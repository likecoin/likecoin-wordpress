<?php

// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase

function likecoin_generate_matters_player_widget( $filename ) {
	$dom_document          = new DOMDocument();
	$libxml_previous_state = libxml_use_internal_errors( true );
	$dom_content           = $dom_document->loadHTML( '<div class="player"><header><div class="meta"><h4 class="title">' . $filename . '</h4><div class="time"><span class="current"></span><span class="duration"></span></div></div><span class="play paused"></span></header><footer><div class="progress-bar"><span></span></div></footer></div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
	libxml_clear_errors();
	libxml_use_internal_errors( $libxml_previous_state );
	return $dom_document->documentElement;
}

function likecoin_replace_matters_attachment_url( $content ) {
	if ( ! $content ) {
		return $content;
	}
	$dom_document          = new DOMDocument();
	$libxml_previous_state = libxml_use_internal_errors( true );
	$dom_content           = $dom_document->loadHTML( '<template>' . mb_convert_encoding( $content, 'HTML-ENTITIES' ) . '</template>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
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
		$url           = $image->getAttribute( 'src' );
		$classes       = $image->getAttribute( 'class' );
		$attachment_id = intval( $image->getAttribute( 'data-attachment-id' ) );
		if ( ! $attachment_id && $classes && preg_match( '/wp-image-([0-9]+)/i', $classes, $class_id ) && absint( $class_id[1] ) ) {
			$attachment_id = $class_id[1];
		}
		if ( ! $attachment_id && $url ) {
			$attachment_id = attachment_url_to_postid( $url );
		}
		if ( $attachment_id ) {
			$matters_info = get_post_meta( $attachment_id, LC_MATTERS_INFO, true );
			if ( isset( $matters_info['url'] ) ) {
				$image->setAttribute( 'src', $matters_info['url'] );
				$image->setAttribute( 'data-asset-id', $matters_info['attachment_id'] );
			}
		}
	}
	$audios = $dom_document->getElementsByTagName( 'audio' );
	foreach ( $audios as $audio ) {
		$url           = $audio->getAttribute( 'src' );
		$attachment_id = intval( $audio->getAttribute( 'data-attachment-id' ) );
		$id            = null;
		$filename      = null;

		if ( ! $attachment_id && $url ) {
			$attachment_id = attachment_url_to_postid( $url );
		}
		if ( $attachment_id ) {
			$matters_info = get_post_meta( $attachment_id, LC_MATTERS_INFO, true );
			if ( isset( $matters_info['url'] ) ) {
					$url = $matters_info['url'];
					$id  = $matters_info['attachment_id'];
			}
			$file_path = get_attached_file( $attachment_id );
			$filename  = basename( $file_path );
			$source    = $dom_document->createElement( 'source' );
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
		$parent = $audio->parentNode;
		if ( 'figure' === $parent->nodeName ) {
			$classes = $parent->getAttribute( 'class' );
			$parent->setAttribute( 'class', $classes . ' audio' );
			$player = likecoin_generate_matters_player_widget( $filename );
			$parent->appendChild( $dom_document->importNode( $player, true ) );
		}
	}
	$figures = $dom_document->getElementsByTagName( 'figure' );
	foreach ( $figures as $figure ) {
		$classes = $figure->getAttribute( 'class' );
		if ( strpos( $classes, 'gallery' ) !== false ) {
			$figure->setAttribute( 'class', $classes . ' image' );
		}
		$has_caption = false;
		$captions    = $figure->getElementsByTagName( 'figcaption' );
		foreach ( $captions as $caption ) {
			if ( $caption->parentNode === $figure ) {
				$has_caption = true;
			}
		}
		if ( ! $has_caption ) {
			$new_caption = $dom_document->createElement( 'figcaption' );
			$span        = $dom_document->createElement( 'span' );
			$new_caption->appendChild( $span );
			$figure->appendChild( $new_caption );
		}
	}

	$root   = $dom_document->documentElement;
	$result = '';
	foreach ( $root->childNodes as $child_node ) {
			$result .= $dom_document->saveHTML( $child_node );
	}
	return $result;
}
// phpcs:enable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
