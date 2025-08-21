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
 * Require files
 */
require_once __DIR__ . '/../public/likecoin-button.php';

/**
 * Get default style defined in matters library.
 * Refer to https://github.com/thematters/matters-html-formatter/blob/main/src/makeHtmlBundle/formatHTML/articleTemplate.ts for details.
 */
function likecoin_get_default_post_style() {
	return '<style>
	html, body {
	  margin: 0;
	  padding: 0;
	}
	body {
	  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
	  font-size: 18px;
	  line-height: 1.5;
	}
	main {
	  max-width: 673px;
	  margin: 40px auto;
	  padding: 0 20px;
	}
	hr { height: 1px; }
	h1, h2, h3, h4, h5, h6 { font-weight: 600; line-height: 1.4; }
	h1 { font-size: 28px; }
	h2 { font-size: 24px; }
	h3 { font-size: 22px; }
	h4 { font-size: 18px; }
	h5 { font-size: 16px; }
	h6 { font-size: 14px; }
	li ul, li ol { margin: 0 20px; }
	li { margin: 20px 0; }
	ul { list-style-type: disc; }
	ol { list-style-type: decimal; }
	ol ol { list-style: upper-alpha; }
	ol ol ol { list-style: lower-roman; }
	ol ol ol ol { list-style: lower-alpha; }
	img, video, audio {
	  display: block;
	  max-width: 100%;
	  margin: 0 auto;
	}
	audio {
	  width: 100%;
	}
	blockquote {
	  margin-left: 20px;
	  margin-right: 20px;
	  color: #5F5F5F;
	}

	pre {
	  white-space: pre-wrap;
	}

	header {
	  margin-bottom: 40px;
	}
	header h1 {
	  font-size: 32px;
	}


	figure {
	  margin: 0;
	}

	figure.byline {
	  font-size: 16px;
	  margin: 0;
	}
	figure.byline * + * {
	  padding-left: 10px;
	}
	figure.byline time {
	  color: #b3b3b3;
	}
	figure.byline [ref="source"]::before {
	  content: "";
	  border-left: 1px solid currentColor;
	  padding-left: 10px;
	}

	figure.summary {
	  margin: 40px 0;
	  color: #808080;
	  font-size: 18px;
	  font-weight: 500;
	  line-height: 32px;
	}

	figure.read_more {
	  margin: 40px 0;
	}

	article {
	  position: relative;
	}

	article > * {
	  margin-top: 20px;
	  margin-bottom: 24px;
	}
	article a {
	  border-bottom: 1px solid currentcolor;
	  text-decoration: none;
	  padding-bottom: 2px;
	}
	article p {
	  line-height: 1.8;
	}
	figure figcaption {
	  margin-top: 5px;
	  font-size: 16px;
	  color: #b3b3b3;
	}

	figure .iframe-container {
	  position: relative;
	  width: 100%;
	  height: 0;
	  padding-top: 56.25%;
	}
	figure .iframe-container iframe {
	  position: absolute;
	  top: 0;
	  width: 100%;
	  height: 100%;
	}

	.encrypted {
	  display: flex;
	  justify-content: center;
	  word-break: break-all;
	}
  </style>';
}

/**
 * Get all tags names in a post
 *
 * @param WP_Post| $post Post object.
 * @param integer| $limit Number of tags.
 */
function likecoin_get_post_tags( $post, $limit = 0 ) {
	$post_id   = $post->ID;
	$func      = function ( $terms ) {
		return htmlspecialchars_decode( $terms->name );
	};
	$post_tags = get_the_tags( $post_id );

	if ( ! $post_tags ) {
		$post_tags = array();
	}
	$result = array_map( $func, $post_tags );
	if ( $limit ) {
		$result = array_slice( $result, 0, $limit );
	}
	return $result;
}

/**
 * Transform content to json base64 encoded format.
 *
 * @param object| $post WordPress post object.
 */
function likecoin_format_post_to_json_data( $post ) {
	$files             = array();
	$title             = apply_filters( 'the_title_rss', $post->post_title );
	$description       = get_the_excerpt( $post );
	$feature           = likecoin_get_post_thumbnail_with_relative_image_url( $post );
	$feature_img_div   = $feature['content'];
	$feature_img_data  = $feature['image'];
	$relative          = likecoin_get_post_content_with_relative_image_url( $post );
	$content           = $relative['content'];
	$image_data        = $relative['images'];
	$meta_tags         = '<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />' . '
<meta property="og:title" content="' . $title . '">
<meta name="description" content="' . $description . '" />
<meta property="og:description" content="' . $description . '">';
	$iscn_mainnet_info = get_post_meta( $post->ID, LC_ISCN_INFO, true );
	$iscn_id           = '';
	$likecoin_user     = likecoin_get_post_liker_id( $post );
	if ( $iscn_mainnet_info ) {
		$iscn_id = $iscn_mainnet_info['iscn_id'];
	}
	if ( ! empty( $iscn_id ) ) {
		$meta_tags = $meta_tags . '<meta name="likecoin:iscn" content="' . esc_attr( $iscn_id ) . '">';
	}
	$likecoin_user = likecoin_get_post_liker_id( $post );
	if ( ! empty( $likecoin_user['id'] ) ) {
		$meta_tags = $meta_tags . '<meta name="likecoin:liker-id" content="' . esc_attr( $likecoin_user['id'] ) . '">';
	}
	if ( ! empty( $likecoin_user['wallet'] ) ) {
		$meta_tags = $meta_tags . '<meta name="likecoin:wallet" content="' . esc_attr( $likecoin_user['wallet'] ) . '">';
	}
	$content        = '<!DOCTYPE html><html>
<head> <title>' . $title . '</title>' . $meta_tags . likecoin_get_default_post_style() . '</head>
<body><header><h1>' . $title . '</h1>' . $feature_img_div . '</header>' . $content . '
</body></html>';
	$file_mime_type = 'text/html';
	$filename       = 'index.html';
	// phpcs:disable WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
	$files[] = array(
		'filename' => $filename,
		'mimeType' => $file_mime_type,
		'data'     => base64_encode( $content ),
	);
	if ( ! empty( $feature_img_data ) ) {
		$image_data[] = $feature_img_data;
	}
	foreach ( $image_data as $image ) {
		$url = $image['url'];
		$key = $image['key'];

		if ( ! likecoin_is_valid_image_path( $url ) ) {
			continue;
		}

		global $wp_filesystem;
		if ( ! $wp_filesystem ) {
			require_once ABSPATH . '/wp-admin/includes/file.php';
			WP_Filesystem();
		}

		$img_body = $wp_filesystem->get_contents( $url );
		if ( false === $img_body ) {
			continue;
		}

		// Verify if the file is an image.
		$file_info = new finfo( FILEINFO_MIME_TYPE );
		$mime_type = $file_info->buffer( $img_body );
		if ( strpos( $mime_type, 'image/' ) !== 0 ) {
			continue;
		}

		$files[] = array(
			'filename' => $key,
			'mimeType' => $mime_type,
			'data'     => base64_encode( $img_body ),
		);
	}
	// phpcs:enable WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
	return $files;
}

/**
 * Verify image path is valid and under wp_upload_dir
 *
 * @param string $file_path file path to check.
 * @return bool True if file path is valid, false otherwise.
 */
function likecoin_is_valid_image_path( $file_path ) {
	if ( ! file_exists( $file_path ) ) {
		return false;
	}

	if ( ! is_file( $file_path ) ) {
		return false;
	}

	$valid_extensions = array( 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg' );
	$file_extension   = strtolower( pathinfo( $file_path, PATHINFO_EXTENSION ) );
	if ( ! in_array( $file_extension, $valid_extensions, true ) ) {
		return false;
	}

	$upload_dir      = wp_upload_dir();
	$upload_base_dir = wp_normalize_path( $upload_dir['basedir'] );
	$file_path       = wp_normalize_path( $file_path );

	if ( strpos( $file_path, $upload_base_dir ) !== 0 ) {
		return false;
	}

	return true;
}

/**
 * Get post content with relative img src
 *
 * @param object| $post WordPress post object.
 */
function likecoin_get_post_content_with_relative_image_url( $post ) {
	$image_urls = array();
	$content    = apply_filters( 'the_content', $post->post_content );
	if ( ! class_exists( 'DOMDocument' ) ) {
		// phpcs:disable WordPress.PHP.DevelopmentFunctions.error_log_trigger_error
		trigger_error( 'DOMDocument not found! Please install PHP DOM extension', E_USER_WARNING );
		return array(
			'content' => $content,
			'images'  => $image_urls,
		);
	}
	$dom_document          = new DOMDocument();
	$libxml_previous_state = libxml_use_internal_errors( true );
	$dom_content           = $dom_document->loadHTML( '<template>' . mb_convert_encoding( $content, 'HTML-ENTITIES' ) . '</template>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
	libxml_clear_errors();
	libxml_use_internal_errors( $libxml_previous_state );
	if ( false === $dom_content ) {
		return array(
			'content' => $content,
			'images'  => $image_urls,
		);
	}
	$images          = $dom_document->getElementsByTagName( 'img' );
	$site_url_parsed = wp_parse_url( get_site_url() );
	$site_host       = $site_url_parsed['host'];
	foreach ( $images as $key => $image ) {
		$url = $image->getAttribute( 'data-orig-file' );
		if ( empty( $url ) ) {
			$url = $image->getAttribute( 'src' );
		}
		$attachment_id = $image->getAttribute( 'data-attachment-id' );
		$url           = explode( '#', $url )[0];
		$url           = explode( '?', $url )[0];
		$parsed        = wp_parse_url( $url );
		$host          = $parsed['host'];
		if ( $attachment_id > 0 || ( $host === $site_host && ! empty( $url ) ) ) {
			$image_key = $key + 1; // 0 is for featured image.
			$image->setAttribute( 'src', './' . $image_key );
			$image->removeAttribute( 'srcset' );
			$image_path = $url;
			if ( $attachment_id > 0 ) {
				$image_path = get_attached_file( $attachment_id );
			} else {
				$relative_path = ltrim( $parsed['path'], '/' );
				// Remove ./ and ../ in path.
				$relative_path = preg_replace( '/(?:\.\.\/|\.\/)+/', '', $relative_path );
				$image_path    = ABSPATH . $relative_path;
			}
			$image_urls[] = array(
				'key' => $image_key,
				'url' => $image_path,
			);
		}
	}
	$root   = $dom_document->documentElement;
	$result = '';
	foreach ( $root->childNodes as $child_node ) {
			$result .= $dom_document->saveHTML( $child_node );
	}
	return array(
		'content' => $result,
		'images'  => $image_urls,
	);
}

/**
 * Get post feature image = with relative img src
 *
 * @param object| $post WordPress post object.
 */
function likecoin_get_post_thumbnail_with_relative_image_url( $post ) {
	$post_thumbnail_id = get_post_thumbnail_id( $post->ID );
	$feature_img_div   = '';
	if ( ! $post_thumbnail_id ) {
		return array(
			'content' => '',
			'image'   => null,
		);
	}
	$url = wp_get_attachment_image_url( $post_thumbnail_id, 'full' );
	$url = get_attached_file( $post_thumbnail_id );
	// we place all <img> in html to 1...n in a later function, 0 is used for feature.
	$feature_img_div = '<figure><img src="./0"></figure>';
	return array(
		'content' => $feature_img_div,
		'image'   => array(
			'key' => '0', // index 0 for feature image.
			'url' => $url,
		),
	);
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
