<?php
/**
 * LikeCoin admin post editor functions
 *
 * Define functions used for post editor pages
 *
 * @package   LikeCoin
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase

/**
 * Get all tags names in a post
 *
 * @param WP_Post| $post Post object.
 */
function likecoin_get_post_tags( $post ) {
	$post_id   = $post->ID;
	$func      = function( $terms ) {
		return htmlspecialchars_decode( $terms->name );
	};
	$post_tags = get_the_tags( $post_id );

	if ( ! $post_tags ) {
		$post_tags = array();
	}
	return array_map( $func, $post_tags );
}

/**
 * Transform content to json base64 encoded format.
 *
 * @param object| $post WordPress post object.
 */
function likecoin_format_post_to_json_data( $post ) {
	$files           = array();
	$title           = apply_filters( 'the_title_rss', $post->post_title );
	$content         = likecoin_get_post_content_with_relative_image_url( $post );
	$urls            = likecoin_get_post_image_url( $post );
	$feature_img_div = likecoin_get_post_thumbnail_with_relative_image_url( $post );
	$content         = '<!DOCTYPE html><html>
  	<head> <title>' . $title . '</title>' .
		'<meta charset="utf-8" />
		 <meta name="viewport" content="width=device-width, initial-scale=1" />
	</head>
	<body><header><h1>' . $title . '</h1>' . $feature_img_div . '</header>' . $content . '
	</body></html>';
	$file_mime_type  = 'text/html';
	$filename        = 'index.html';
	// phpcs:disable WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
	$files[] = array(
		'filename' => $filename,
		'mimeType' => $file_mime_type,
		'data'     => base64_encode( $content ),
	);

	$site_url_parsed = wp_parse_url( get_site_url() );
	$site_host       = $site_url_parsed['host'];
	foreach ( $urls as $url ) {
		$file_info = new finfo( FILEINFO_MIME_TYPE );
		$parse     = wp_parse_url( $url );
		$host      = $parse['host'];
		if ( $host === $site_host ) {
			$relative_path = ltrim( $parse['path'], '/' );
			$image_path    = ABSPATH . $relative_path;
			// phpcs:disable WordPress.WP.AlternativeFunctions
			$img_body = file_get_contents( $image_path );
			// phpcs:enable WordPress.WP.AlternativeFunctions
			$mime_type = $file_info->buffer( $img_body );
			$files[]   = array(
				'filename' => $relative_path,
				'mimeType' => $mime_type,
				'data'     => base64_encode( $img_body ),
			);
		}
	}
	// phpcs:enable WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
	return $files;
}

/**
 * Get post content with relative img src
 *
 * @param object| $post WordPress post object.
 */
function likecoin_get_post_content_with_relative_image_url( $post ) {
	$content               = apply_filters( 'the_content', $post->post_content );
	$dom_document          = new DOMDocument();
	$libxml_previous_state = libxml_use_internal_errors( true );
	$dom_content           = $dom_document->loadHTML( '<template>' . mb_convert_encoding( $content, 'HTML-ENTITIES' ) . '</template>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
	libxml_clear_errors();
	libxml_use_internal_errors( $libxml_previous_state );
	if ( false === $dom_content ) {
		return $content;
	}
	$images          = $dom_document->getElementsByTagName( 'img' );
	$site_url_parsed = wp_parse_url( get_site_url() );
	$site_host       = $site_url_parsed['host'];
	foreach ( $images as $image ) {
		$url    = $image->getAttribute( 'src' );
		$url    = explode( '#', $url )[0];
		$url    = explode( '?', $url )[0];
		$parsed = wp_parse_url( $url );
		$host   = $parsed['host'];
		if ( $host === $site_host ) {
			$image->setAttribute( 'src', '.' . $parsed['path'] );
			$image->removeAttribute( 'srcset' );
		}
	}
	$root   = $dom_document->documentElement;
	$result = '';
	foreach ( $root->childNodes as $child_node ) {
			$result .= $dom_document->saveHTML( $child_node );
	}
	return $result;
}

/**
 * Get post feature image = with relative img src
 *
 * @param object| $post WordPress post object.
 */
function likecoin_get_post_thumbnail_with_relative_image_url( $post ) {
	$post_thumbnail_id = get_post_thumbnail_id( $post->ID );
	$feature_img_div   = '';
	if ( ! empty( $post_thumbnail_id ) ) {
		$url = wp_get_attachment_image_url( $post_thumbnail_id, 'full' );
		if ( $url ) {
			$site_url_parsed = wp_parse_url( get_site_url() );
			$site_host       = $site_url_parsed['host'];
			$parsed          = wp_parse_url( $url );
			$host            = $parsed['host'];
			if ( $host === $site_host ) {
				$feature_img_div = '<figure><img src=".' . esc_url( $parsed['path'] ) . '"></figure>';
			}
		}
	}
	return $feature_img_div;
}

/**
 * Get image urls in post
 *
 * @param object| $post WordPress post object.
 */
function likecoin_get_post_image_url( $post ) {
	$urls                  = array();
	$content               = apply_filters( 'the_content', $post->post_content );
	$dom_document          = new DOMDocument();
	$libxml_previous_state = libxml_use_internal_errors( true );
	$dom_content           = $dom_document->loadHTML( '<template>' . mb_convert_encoding( $content, 'HTML-ENTITIES' ) . '</template>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
	libxml_clear_errors();
	libxml_use_internal_errors( $libxml_previous_state );
	$images = $dom_document->getElementsByTagName( 'img' );

	// get all images.
	foreach ( $images as $image ) { // only works after attachment is converted to image by user.
		$url    = $image->getAttribute( 'src' );
		$url    = explode( '#', $url )[0];
		$url    = explode( '?', $url )[0];
		$urls[] = $url;
	};
	// get featured image.
	$post_thumbnail_id = get_post_thumbnail_id( $post->ID );
	if ( ! empty( $post_thumbnail_id ) ) {
		$url = wp_get_attachment_image_url( $post_thumbnail_id, 'full' );
		if ( $url ) {
			$urls[] = $url;
		}
	}
	return $urls;
}

/**
 * Save the post-specific widget option to post meta and user meta
 *
 * @param int| $post_id The post id of the target post.
 */
function likecoin_save_postdata( $post_id ) {
	/* Check nonce */
	if ( ! ( isset( $_POST['lc_metabox_nonce'] ) && wp_verify_nonce( sanitize_key( $_POST['lc_metabox_nonce'] ), 'lc_save_post' ) ) ) {
		return;
	}

	if ( isset( $_POST[ LC_OPTION_WIDGET_OPTION ] ) ) {
		$option = array(
			LC_OPTION_WIDGET_POSITION => sanitize_key( $_POST[ LC_OPTION_WIDGET_OPTION ] ),
		);
		update_post_meta(
			$post_id,
			LC_OPTION_WIDGET_OPTION,
			$option
		);
	}
}
