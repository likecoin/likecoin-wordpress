<?php
require_once dirname( __FILE__ ) . '/../includes/class-likecoin-matters-api.php';

function likecoin_replace_matters_attachment_url( $content ) {
	if ( ! preg_match_all( '/<img[^>]+src=([\'"])(?<src>.+?)\1[^>]*>/i', $content, $matches ) ) {
		return $content;
	}
	foreach ( $matches[0] as $match ) {
		if ( preg_match( '@src="([0-9a-z:/._-]+)@i', $match, $src_list ) ) {
			$url = $src_list[1];
			if ( $url ) {
				$attachment_id = attachment_url_to_postid( $url );
				if ( $attachment_id ) {
					$matters_info = get_post_meta( $attachment_id, LC_MATTERS_INFO, true );
					if ( isset( $matters_info['url'] ) ) {
						$content = str_replace( $url, $matters_info['url'], $content );
					}
				}
			}
		}
	}
	return $content;
}

function likecoin_save_to_matters( $post_id, $post, $update ) {
	if ( 'draft' !== get_post_status( $post_id ) ) {
		return;
	}

	$content          = apply_filters( 'the_content', $post->post_content );
	$content          = likecoin_replace_matters_attachment_url( $content );
	$title            = apply_filters( 'the_title', $post->post_title );
	$api              = LikeCoin_Matters_API::get_instance();
	$matters_draft_id = get_post_meta( $post_id, LC_MATTERS_DRAFT_ID, true );

	if ( $update && $matters_draft_id ) {
		$draft = $api->update_draft( $matters_draft_id, $title, $content );
		if ( ! isset( $draft['id'] ) ) {
			delete_post_meta( $post_id, LC_MATTERS_DRAFT_ID );
		} elseif ( $draft['id'] !== $matters_draft_id ) {
			$matters_draft_id = $draft['id'];
			update_post_meta( $post_id, LC_MATTERS_DRAFT_ID, $matters_draft_id );
		}
	} else {
		$draft = $api->new_draft( $title, $content );
		// TODO: handle create fail
		$matters_draft_id = $draft['id'];
		update_post_meta( $post_id, LC_MATTERS_DRAFT_ID, $matters_draft_id );
	}
}

function likecoin_publish_to_matters( $post_id, $post ) {
	$content          = apply_filters( 'the_content', $post->post_content );
	$title            = apply_filters( 'the_title', $post->post_title );
	$api              = LikeCoin_Matters_API::get_instance();
	$matters_draft_id = get_post_meta( $post_id, LC_MATTERS_DRAFT_ID, true );
	if ( ! $matters_draft_id ) {
		$draft = $api->new_draft( $title, $content );
		// TODO: handle create fail
		$matters_draft_id = $draft['id'];
	} else {
		$api->update_draft( $matters_draft_id, $title, $content );
		// TODO: handle update fail
	}
	$res = $api->publish_draft( $matters_draft_id );
	// TODO: handle publish fail
}

function likecoin_post_attachment_to_matters( $metadata, $attachment_id ) {
	$attachment     = get_post( $attachment_id );
	$file_path      = get_attached_file( $attachment_id );
	$file_mime_type = get_post_mime_type( $attachment_id );
	$filename       = basename( $file_path );
	$parent_post    = $attachment->post_parent;
	if ( ! $parent_post ) {
		return;
	}
	$matters_draft_id = get_post_meta( $parent_post, LC_MATTERS_DRAFT_ID, true );
	if ( ! $matters_draft_id ) {
		$matters_draft_id = likecoin_publish_to_matters( $parent_post, get_post( $parent_post ) );
	}
	$api    = LikeCoin_Matters_API::get_instance();
	$res    = $api->post_attachment(
		array(
			'path'      => $file_path,
			'filename'  => $filename,
			'mime_type' => $file_mime_type,
		),
		$matters_draft_id
	);
	$params = array(
		'type'          => 'attachment',
		'url'           => $res['path'],
		'attachment_id' => $res['id'],
	);
	update_post_meta( $attachment_id, LC_MATTERS_INFO, $params );
}
