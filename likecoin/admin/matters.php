<?php

require_once dirname( __FILE__ ) . '/../includes/class-likecoin-matters-api.php';


function likecoin_replace_matters_attachment_url( $content ) {
	$dom_document          = new DOMDocument();
	$libxml_previous_state = libxml_use_internal_errors( true );
	$dom_content           = $dom_document->loadHTML( mb_convert_encoding( $content, 'HTML-ENTITIES' ), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
	libxml_clear_errors();
	libxml_use_internal_errors( $libxml_previous_state );
	if ( false === $dom_content ) {
		return $content;
	}
	$images = $dom_document->getElementsByTagName( 'img' );
	foreach ( $images as $image ) {
		$parent = $image->parentNode;
		if ( 'figure' === $parent->nodeName ) {
			$classes = $parent->getAttribute( 'class' );
			$parent->setAttribute( 'class', $classes . ' image' );
		}
		$url = $image->getAttribute( 'src' );

		if ( $url ) {
			$attachment_id = attachment_url_to_postid( $url );
			if ( $attachment_id ) {
				$matters_info = get_post_meta( $attachment_id, LC_MATTERS_INFO, true );
				if ( isset( $matters_info['url'] ) ) {
					$image->setAttribute( 'src', $matters_info['url'] );
					$image->setAttribute( 'data-asset-id', $matters_info['attachment_id'] );
				}
			}
		}
	}
	return wp_kses_post( $dom_document->saveHTML() );
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
