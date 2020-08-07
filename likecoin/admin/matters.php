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
	$audios = $dom_document->getElementsByTagName( 'audio' );
	foreach ( $audios as $audio ) {
		$parent = $audio->parentNode;
		if ( 'figure' === $parent->nodeName ) {
			$classes = $parent->getAttribute( 'class' );
			$parent->setAttribute( 'class', $classes . ' audio' );
		}
		$url      = $audio->getAttribute( 'src' );
		$id       = null;
		$filename = null;
		if ( $url ) {
			$attachment_id = attachment_url_to_postid( $url );
			if ( $attachment_id ) {
				$matters_info = get_post_meta( $attachment_id, LC_MATTERS_INFO, true );
				if ( isset( $matters_info['url'] ) ) {
					$url = $matters_info['url'];
					$id  = $matters_info['attachment_id'];
				}
				$file_path = get_attached_file( $attachment_id );
				$filename  = basename( $file_path );
			}
			$source = $dom_document->createElement( 'source' );
			$source->setAttribute( 'src', $url );
			if ( $id ) {
				$source->setAttribute( 'data-asset-id', $id );
			}
			if ( $filename ) {
				$audio->setAttribute( 'data-file-name', $filename );
			}
			$audio->removeAttribute( 'src' );
			$audio->appendChild( $source );
		}
	}
	$figures = $dom_document->getElementsByTagName( 'figure' );
	foreach ( $figures as $figure ) {
		$classes = $figure->getAttribute( 'class' );
		if ( strpos( $classes, 'gallery' ) !== false ) {
			$figure->setAttribute( 'class', $classes . ' image' );
		}
	}
	return $dom_document->saveHTML();
}

function likecoin_save_to_matters( $post_id, $post, $update ) {
	if ( 'draft' !== get_post_status( $post_id ) ) {
		return;
	}
	$matters_info = get_post_meta( $post_id, LC_MATTERS_INFO, true );
	if ( ! $matters_info ) {
		$matters_info = array(
			'type' => 'post',
		);
	}
	if ( $matters_info['published'] ) {
		return;
	}
	$matters_draft_id = $matters_info['draft_id'];
	$content          = apply_filters( 'the_content', $post->post_content );
	$content          = likecoin_replace_matters_attachment_url( $content );
	$title            = apply_filters( 'the_title', $post->post_title );
	$api              = LikeCoin_Matters_API::get_instance();
	if ( $update && $matters_draft_id ) {
		$draft = $api->update_draft( $matters_draft_id, $title, $content );
		if ( ! isset( $draft['id'] ) ) {
			unset( $matters_info['draft_id'] );
			$matters_draft_id = null;
			update_post_meta( $post_id, LC_MATTERS_INFO, $matters_info );
		} elseif ( $draft['id'] !== $matters_draft_id ) {
			$matters_draft_id         = $draft['id'];
			$matters_info['draft_id'] = $matters_draft_id;
			update_post_meta( $post_id, LC_MATTERS_INFO, $matters_info );
		}
	}
	if ( ! $matters_draft_id ) {
		$draft = $api->new_draft( $title, $content );
		// TODO: handle create fail
		$matters_info['draft_id'] = $draft['id'];
		update_post_meta( $post_id, LC_MATTERS_INFO, $matters_info );
	}
}

function likecoin_publish_to_matters( $post_id, $post ) {
	$matters_info = get_post_meta( $post_id, LC_MATTERS_INFO, true );
	if ( ! $matters_info ) {
		$matters_info = array(
			'type' => 'post',
		);
	}
	if ( $matters_info['published'] ) {
		return;
	}
	$content          = apply_filters( 'the_content', $post->post_content );
	$content          = likecoin_replace_matters_attachment_url( $content );
	$title            = apply_filters( 'the_title', $post->post_title );
	$api              = LikeCoin_Matters_API::get_instance();
	$matters_draft_id = $matters_info['draft_id'];
	if ( ! $matters_draft_id ) {
		$draft = $api->new_draft( $title, $content );
		// TODO: handle create fail
		$matters_draft_id         = $draft['id'];
		$matters_info['draft_id'] = $matters_draft_id;
	} else {
		$api->update_draft( $matters_draft_id, $title, $content );
		// TODO: handle update fail
	}
	$res                       = $api->publish_draft( $matters_draft_id );
	$matters_info['published'] = true;
	update_post_meta( $post_id, LC_MATTERS_INFO, $matters_info );
	// TODO: handle publish fail
}

function likecoin_post_attachment_to_matters( $attachment_id ) {
	$attachment     = get_post( $attachment_id );
	$file_path      = get_attached_file( $attachment_id );
	$file_mime_type = get_post_mime_type( $attachment_id );
	$filename       = basename( $file_path );
	$parent_post    = $attachment->post_parent;
	if ( ! $parent_post ) {
		return;
	}
	$matters_info = get_post_meta( $parent_post, LC_MATTERS_INFO, true );
	if ( ! $matters_info ) {
		$matters_info = array(
			'type' => 'post',
		);
	}
	if ( $matters_info['published'] ) {
		return;
	}
	$matters_draft_id = $matters_info['draft_id'];
	if ( ! $matters_draft_id ) {
		$matters_draft_id         = likecoin_publish_to_matters( $parent_post, get_post( $parent_post ) );
		$matters_info['draft_id'] = $matters_draft_id;
		update_post_meta( $parent_post, LC_MATTERS_INFO, $matters_info );
	}
	$attachment_type = null;
	if ( wp_attachment_is( 'image', $attachment_id ) ) {
		$attachment_type = 'image';
	} elseif ( wp_attachment_is( 'audio', $attachment_id ) ) {
		$attachment_type = 'audio';
	}
	if ( ! $attachment_type ) {
		return;
	}
	$api    = LikeCoin_Matters_API::get_instance();
	$res    = $api->post_attachment(
		array(
			'path'      => $file_path,
			'filename'  => $filename,
			'mime_type' => $file_mime_type,
			'type'      => $attachment_type,
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
