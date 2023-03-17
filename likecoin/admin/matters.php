<?php
/**
 * LikeCoin Matters publish functions
 *
 * Functions for saving draft/attachment and publishing on matters
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

// phpcs:disable WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase

/**
 * Include useful functions
 */
require_once dirname( __FILE__ ) . '/../includes/class-likecoin-matters-api.php';
require_once dirname( __FILE__ ) . '/error.php';

/**
 * Generate a DOM element for Matters to display audio widget
 *
 * @param string| $filename Title of audio file.
 */
function likecoin_generate_matters_player_widget( $filename ) {
	$dom_document          = new DOMDocument();
	$libxml_previous_state = libxml_use_internal_errors( true );
	$dom_content           = $dom_document->loadHTML( '<div class="player"><header><div class="meta"><h4 class="title">' . $filename . '</h4><div class="time"><span class="current"></span><span class="duration"></span></div></div><span class="play paused"></span></header><footer><div class="progress-bar"><span></span></div></footer></div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
	libxml_clear_errors();
	libxml_use_internal_errors( $libxml_previous_state );
	return $dom_document->documentElement;
}


/**
 * Append footer link into DOM
 *
 * @param DOMDocument| $dom_document Parent dom document.
 */
function likecoin_append_footer_link_element( $dom_document ) {
	global $post;
	$site_title = get_bloginfo( 'name' );
	if ( ! $post ) {
		return;
	}
	$url = get_permalink( $post );
	if ( ! $url ) {
		return;
	}
	$p = $dom_document->createElement( 'p', esc_html__( 'Original link: ', LC_PLUGIN_SLUG ) );
	$a = $dom_document->createElement( 'a', $site_title );
	$a->setAttribute( 'href', $url );
	$p->appendChild( $a );
	$dom_document->documentElement->appendChild( $p );
}

/**
 * Parse and modify post HTML to replace Matters asset url and div/class standard
 *
 * @param string| $content raw post HTML content.
 * @param array|  $params post options for addtional components.
 */
function likecoin_replace_matters_attachment_url( $content, $params ) {
	$post_id = $params ['post_id'];
	if ( ! $content ) {
		return $content;
	}
	$image_infos            = get_post_meta( $post_id, LC_MATTERS_IMAGE_INFO, true );
	$should_add_footer_link = $params['add_footer_link'];
	$dom_document           = new DOMDocument();
	$libxml_previous_state  = libxml_use_internal_errors( true );
	$dom_content            = $dom_document->loadHTML( '<template>' . mb_convert_encoding( $content, 'HTML-ENTITIES' ) . '</template>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
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
		} else {
			$figure = $dom_document->createElement( 'figure' );
			$figure->setAttribute( 'class', 'image' );
			$image = $parent->replaceChild( $figure, $image );
			$figure->appendChild( $image );
			$parent = $figure;
		}
		$url = $image->getAttribute( 'src' );
		// Remove hashtag and querystring in url.
		$url           = explode( '#', $url )[0];
		$url           = explode( '?', $url )[0];
		$classes       = $image->getAttribute( 'class' );
		$attachment_id = intval( $image->getAttribute( 'data-attachment-id' ) );
		if ( ! $attachment_id && $classes && preg_match( '/wp-image-([0-9]+)/i', $classes, $class_id ) && absint( $class_id[1] ) ) {
			$attachment_id = $class_id[1];
		}
		if ( ! $attachment_id && ! empty( $url ) ) {
			$attachment_id = attachment_url_to_postid( $url );
			// if its url image.
			if ( isset( $image_infos ) && isset( $image_infos[ $url ] ) ) {
				$image_info = $image_infos[ $url ];
				if ( isset( $image_info['original_url'] ) && isset( $image_info['matters_url'] ) ) {
					$image->setAttribute( 'src', $image_info['matters_url'] );
					$image->setAttribute( 'data-asset-id', $image_info['matters_attachment_id'] );
				}
			}
		}
		if ( $attachment_id ) {
			// if its uploaded image.
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
		$url           = explode( '#', $url )[0];
		$url           = explode( '?', $url )[0];
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
		} else {
			$figure = $dom_document->createElement( 'figure' );
			$figure->setAttribute( 'class', 'audio' );
			$audio = $parent->replaceChild( $figure, $audio );
			$figure->appendChild( $audio );
			$parent = $figure;
		}
		$player = likecoin_generate_matters_player_widget( $filename );
		$parent->appendChild( $dom_document->importNode( $player, true ) );
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

	if ( $should_add_footer_link ) {
		likecoin_append_footer_link_element( $dom_document );
	}

	$root   = $dom_document->documentElement;
	$result = '';
	foreach ( $root->childNodes as $child_node ) {
			$result .= $dom_document->saveHTML( $child_node );
	}
	return $result;
}
/**
 * Format a draft url to matters.news.
 *
 * @param string| $draft_id Matters draft id.
 */
function likecoin_matters_get_draft_link( $draft_id ) {
	return 'https://matters.news/me/drafts/' . $draft_id;
}

/**
 * Format a article url to matters.news.
 *
 * @param string| $matters_id User Matters id.
 * @param string| $article_hash IPFS hash of article.
 * @param string| $article_slug slug of matters article.
 */
function likecoin_matters_get_article_link( $matters_id, $article_hash, $article_slug = '' ) {
	return 'https://matters.news/@' . $matters_id . '/' . $article_slug . '-' . $article_hash;
}

/**
 * Query post publish status via matters api
 *
 * @param int| $post_id Post id of post to query matters status.
 */
function likecoin_query_post_matters_status( $post_id ) {
	$matters_info     = get_post_meta( $post_id, LC_MATTERS_INFO, true );
	$matters_draft_id = isset( $matters_info['draft_id'] ) ? $matters_info['draft_id'] : null;
	if ( ! $matters_draft_id ) {
		return;
	}
	$api = LikeCoin_Matters_API::get_instance();
	$res = $api->query_post_status( $matters_draft_id );
	if ( isset( $res['error'] ) ) {
		return $res;
	}
	return $res;
}

/**
 * Refresh and store publish status in post metadata
 *
 * @param WP_Post| $post Post object.
 * @param boolean| $force Ignore last refresh time.
 */
function likecoin_refresh_post_matters_status( $post, $force = false ) {
	$post_id          = $post->ID;
	$matters_info     = get_post_meta( $post_id, LC_MATTERS_INFO, true );
	$matters_draft_id = isset( $matters_info['draft_id'] ) ? $matters_info['draft_id'] : null;
	if ( ! $matters_draft_id ) {
		return;
	}

	$time_now = time();
	// limit refresh rate to 1 min.
	if ( ! $force && isset( $matters_info['last_refresh_time'] ) && $matters_info['last_refresh_time'] + 60 > $time_now ) {
		return $matters_info;
	}

	if ( ! $force && ( isset( $matters_info['published'] ) && isset( $matters_info['ipfs_hash'] ) ) ) {
		return $matters_info;
	}
	$res = likecoin_query_post_matters_status( $post_id );
	if ( isset( $res['error'] ) ) {
		return $res;
	}
	if ( isset( $res['publishState'] ) && 'published' === $res['publishState'] ) {
		$matters_info['published'] = true;
	}
	if ( ! empty( $res['article']['id'] ) ) {
		$matters_info['article_id'] = $res['article']['id'];
	}
	if ( ! empty( $res['article']['slug'] ) ) {
		$matters_info['article_slug'] = $res['article']['slug'];
	}
	if ( ! empty( $res['article']['mediaHash'] ) ) {
		$matters_info['article_hash'] = $res['article']['mediaHash'];
	}
	if ( ! empty( $res['article']['dataHash'] ) ) {
		$matters_info['ipfs_hash'] = $res['article']['dataHash'];
	}
	if ( ! empty( $res['article']['author']['userName'] ) ) {
		$matters_info['article_author'] = $res['article']['author']['userName'];
	}
	$matters_info['last_refresh_time'] = $time_now;
	update_post_meta( $post_id, LC_MATTERS_INFO, $matters_info );
	return $matters_info;
}

/**
 * Clear all matters id and token in options
 */
function likecoin_logout_matters_session() {
	$option = get_option( LC_PUBLISH_OPTION_NAME );
	if ( ! isset( $option[ LC_OPTION_SITE_MATTERS_USER ] ) ) {
		return;
	}
	unset( $option[ LC_OPTION_SITE_MATTERS_USER ] );
	update_option( LC_PUBLISH_OPTION_NAME, $option );
}

/**
 * Parse error handling string
 *
 * @param string| $error Error string.
 */
function likecoin_handle_matters_api_error( $error ) {
	$decoded_error = json_decode( $error, true );
	if ( ! $decoded_error ) {
		likecoin_set_admin_errors( $error, 'publish' );
		return;
	}
	$error_message = isset( $decoded_error['errors'][0]['message'] ) ? $decoded_error['errors'][0]['message'] : null;
	$error_code    = isset( $decoded_error['errors'][0]['extensions']['code'] ) ? $decoded_error['errors'][0]['extensions']['code'] : null;
	if ( $error_code ) {
		if ( 'TOKEN_INVALID' === $error_code ) {
			likecoin_logout_matters_session();
			likecoin_set_admin_errors(
				__( 'Matters session expired. Please login again in Web3Press publish settings', LC_PLUGIN_SLUG ),
				'publish'
			);
		} else {
			likecoin_set_admin_errors( $error_code, 'publish' );
		}
	} elseif ( $error_message ) {
		likecoin_set_admin_errors( $error_message, 'publish' );
	} else {
		likecoin_set_admin_errors( $error, 'publish' );
	}
}


/**
 * Apply post filter for matters
 *
 * @param WP_Post| $post Post object.
 */
function likecoin_filter_matters_post_content( $post ) {
	$option = get_option( LC_PUBLISH_OPTION_NAME );
	$params = array(
		'add_footer_link' => isset( $option[ LC_OPTION_SITE_MATTERS_ADD_FOOTER_LINK ] ) && checked( $option[ LC_OPTION_SITE_MATTERS_ADD_FOOTER_LINK ], 1, false ),
		'post_id'         => $post->ID,
	);
	add_filter( 'jetpack_photon_skip_image', '__return_true', 10, 3 );
	$content = apply_filters( 'the_content', $post->post_content );
	$content = likecoin_replace_matters_attachment_url( $content, $params );
	remove_filter( 'jetpack_photon_skip_image', '__return_true', 10, 3 );
	return $content;
}

/**
 * Parse and modify post HTML to replace Matters asset url and div/class standard
 *
 * @param string|  $matters_draft_id ID of matters article draft.
 * @param WP_Post| $post Post object.
 */
function likecoin_upload_url_image_to_matters( $matters_draft_id, $post ) {
	if ( ! $post || ! $matters_draft_id ) {
		return;
	}
	$post_id = $post->ID;
	$content = $post->post_content;
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
	$images             = $dom_document->getElementsByTagName( 'img' );
	$current_image_urls = array();
	$image_infos        = get_post_meta( $post_id, LC_MATTERS_IMAGE_INFO, true );
	if ( ! isset( $image_infos ) ) {
		$image_infos = array();
	} elseif ( ! is_array( $image_infos ) ) {
		// convert stdClass to associative array.
		$image_infos = json_decode( wp_json_encode( $image_infos ), true );
	}
	if ( ! isset( $image_infos ) || ! is_array( $image_infos ) ) {
		$image_infos = array();
	}
	foreach ( $images as $image ) {
		$url                        = $image->getAttribute( 'src' );
		$url                        = explode( '#', $url )[0];
		$url                        = explode( '?', $url )[0];
		$current_image_urls[ $url ] = $image;
		$image_url                  = $url;
		if ( empty( $url ) ) {
			continue;
		}
		// if it's uploaded image, then skip likecoin_post_url_image_to_matters.
		$classes       = $image->getAttribute( 'class' );
		$attachment_id = intval( $image->getAttribute( 'data-attachment-id' ) );
		if ( ! $attachment_id && $classes && preg_match( '/wp-image-([0-9]+)/i', $classes, $class_id ) && absint( $class_id[1] ) ) {
			$attachment_id = $class_id[1];
		}
		if ( $attachment_id ) {
			continue;
		}
		// check if $image_url already existed in the post.
		if ( isset( $image_infos[ $image_url ] ) ) { // if existed in matters, don't need to upload to matters.
			$image_info = $image_infos[ $image_url ];
			if ( $image_info['original_url'] === $image_url ) {
				continue;
			}
		}
		$new_image_info            = likecoin_post_url_image_to_matters( $matters_draft_id, $image_url );
		$image_infos[ $image_url ] = $new_image_info;
	}
	// delete image_info in image_infos collection if the image is deleted from the draft.
	if ( ! empty( $image_infos ) ) {
		foreach ( $image_infos as $key => $value ) {
			if ( ! isset( $current_image_urls[ $key ] ) ) {
				// remove the image from WordPress.
				unset( $image_infos[ $key ] );
			}
		}
	}
	update_post_meta( $post_id, LC_MATTERS_IMAGE_INFO, $image_infos );
	// TODO: remove the image from matters.
}
/**
 * Save a post as a draft to matters
 *
 * @param int|     $post_id Post id to be saved to matters.
 * @param WP_Post| $post Post object to be saved to matters.
 * @param boolean| $update if this is triggered by an update.
 */
function likecoin_save_to_matters( $post_id, $post, $update = true ) {
	$matters_info = get_post_meta( $post_id, LC_MATTERS_INFO, true );
	if ( ! $matters_info ) {
		$matters_info = array(
			'type' => 'post',
		);
	}
	if ( isset( $matters_info['published'] ) && $matters_info['published'] ) {
		return;
	}
	$matters_draft_id = isset( $matters_info['draft_id'] ) ? $matters_info['draft_id'] : null;
	$title            = apply_filters( 'the_title_rss', $post->post_title );
	$tags             = likecoin_get_post_tags( $post );

	$api = LikeCoin_Matters_API::get_instance();
	if ( $update && $matters_draft_id ) {
		likecoin_upload_url_image_to_matters( $matters_draft_id, $post );
		$content = likecoin_filter_matters_post_content( $post );
		$draft   = $api->update_draft( $matters_draft_id, $title, $content, $tags );
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
		$content = likecoin_filter_matters_post_content( $post );
		if ( ! $content ) {
			$content = __( '(Empty)', LC_PLUGIN_SLUG );
		}
		$draft = $api->new_draft( $title, $content, $tags, false );
		if ( isset( $draft['error'] ) ) {
			likecoin_handle_matters_api_error( $draft['error'] );
			return;
		}
		$matters_info['draft_id'] = $draft['id'];
		update_post_meta( $post_id, LC_MATTERS_INFO, $matters_info );
		likecoin_upload_url_image_to_matters( $matters_draft_id, $post );
		$content          = likecoin_filter_matters_post_content( $post );
		$matters_draft_id = $draft['id'];
		$draft            = $api->update_draft( $matters_draft_id, $title, $content, $tags );
	}
	return $matters_draft_id;
}

/**
 * Publish a post as an article to matters
 *
 * @param int|     $post_id Post id to be published to matters.
 * @param WP_Post| $post Post object to be published to matters.
 */
function likecoin_publish_to_matters( $post_id, $post ) {
	$matters_info = get_post_meta( $post_id, LC_MATTERS_INFO, true );
	if ( ! $matters_info ) {
		$matters_info = array(
			'type' => 'post',
		);
	}
	if ( isset( $matters_info['published'] ) && $matters_info['published'] ) {
		return;
	}
	$matters_draft_id = isset( $matters_info['draft_id'] ) ? $matters_info['draft_id'] : null;
	$title            = apply_filters( 'the_title_rss', $post->post_title );
	$tags             = likecoin_get_post_tags( $post );
	$api              = LikeCoin_Matters_API::get_instance();
	if ( ! $matters_draft_id ) {
		$content = likecoin_filter_matters_post_content( $post );
		$draft   = $api->new_draft( $title, $content, $tags, true );
		if ( isset( $draft['error'] ) ) {
			likecoin_handle_matters_api_error( $draft['error'] );
			return;
		}
		$matters_draft_id         = $draft['id'];
		$matters_info['draft_id'] = $matters_draft_id;
		update_post_meta( $post_id, LC_MATTERS_INFO, $matters_info );
		likecoin_upload_url_image_to_matters( $matters_draft_id, $post );
		$content = likecoin_filter_matters_post_content( $post );
		$draft   = $api->update_draft( $matters_draft_id, $title, $content, $tags );
	} else {
		likecoin_upload_url_image_to_matters( $matters_draft_id, $post );
		$content = likecoin_filter_matters_post_content( $post );
		$draft   = $api->update_draft( $matters_draft_id, $title, $content, $tags );
		if ( isset( $draft['error'] ) ) {
			likecoin_handle_matters_api_error( $draft['error'] );
			return;
		}
	}
	$res = $api->publish_draft( $matters_draft_id );
	if ( isset( $res['error'] ) ) {
		likecoin_handle_matters_api_error( $res['error'] );
		return;
	}
	$matters_info['published'] = true;
	update_post_meta( $post_id, LC_MATTERS_INFO, $matters_info );
	return $matters_draft_id;
}

/**
 * Upload a file as draft image to matters
 *
 * @param string | $matters_draft_id ID of matters article draft.
 * @param string | $image_url image url to be uploaded to matters.
 */
function likecoin_post_url_image_to_matters( $matters_draft_id, $image_url ) {
	$file_path      = $image_url;
	$headers        = get_headers( $file_path, true );
	$file_mime_type = $headers['Content-Type'];
	if ( is_array( $file_mime_type ) ) {
		$file_mime_type = end( $file_mime_type );
	}
	if ( ! ( substr( $file_mime_type, 0, 5 ) === 'image' ) ) {
		return;
	}
	$filename        = basename( $file_path );
	$attachment_type = 'image';
	$api             = LikeCoin_Matters_API::get_instance();
	$res             = $api->post_attachment(
		array(
			'path'      => $file_path,
			'filename'  => $filename,
			'mime_type' => $file_mime_type,
			'type'      => $attachment_type,
		),
		$matters_draft_id
	);
	if ( isset( $res['error'] ) ) {
		likecoin_handle_matters_api_error( $res['error'] );
		return;
	}
	$matters_attachment_id = $res['id'];
	$image_info            = array(
		'original_url'          => $image_url,
		'matters_url'           => $res['path'],
		'matters_attachment_id' => $res['id'],
	);
	return $image_info;
}
/**
 * Upload a file as draft attachment to matters
 *
 * @param int| $attachment_id Attachment id to be uploaded to matters.
 */
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
	if ( isset( $matters_info['published'] ) && $matters_info['published'] ) {
		return;
	}
	$matters_draft_id = isset( $matters_info['draft_id'] ) ? $matters_info['draft_id'] : null;
	if ( ! $matters_draft_id ) {
		$matters_draft_id = likecoin_save_to_matters( $parent_post, get_post( $parent_post ), false );
	}
	if ( ! $matters_draft_id ) {
		if ( ! likecoin_get_admin_errors() ) {
			likecoin_handle_matters_api_error( 'Cannot save draft before publishing' );
		}
		return;
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
	$api = LikeCoin_Matters_API::get_instance();
	$res = $api->post_attachment(
		array(
			'path'      => $file_path,
			'filename'  => $filename,
			'mime_type' => $file_mime_type,
			'type'      => $attachment_type,
		),
		$matters_draft_id
	);
	if ( isset( $res['error'] ) ) {
		likecoin_handle_matters_api_error( $res['error'] );
		return;
	}
	$matters_attachment_id = $res['id'];
	$params                = array(
		'type'          => 'attachment',
		'url'           => $res['path'],
		'attachment_id' => $matters_attachment_id,
	);
	update_post_meta( $attachment_id, LC_MATTERS_INFO, $params );
	return $matters_attachment_id;
}

/**
 * Returns a boolean whether draft options are enabled
 */
function likecoin_check_should_hook_matters_draft() {
	$option = get_option( LC_PUBLISH_OPTION_NAME );

	return isset( $option[ LC_OPTION_SITE_MATTERS_USER ] ) &&
	isset( $option[ LC_OPTION_SITE_MATTERS_USER ][ LC_MATTERS_USER_ACCESS_TOKEN_FIELD ] ) &&
	$option[ LC_OPTION_SITE_MATTERS_USER ][ LC_MATTERS_USER_ACCESS_TOKEN_FIELD ] &&
	isset( $option[ LC_OPTION_SITE_MATTERS_AUTO_DRAFT ] ) &&
	$option[ LC_OPTION_SITE_MATTERS_AUTO_DRAFT ];
}

/**
 * Returns a boolean whether publish options are enabled
 */
function likecoin_check_should_hook_matters_publish() {
	$option = get_option( LC_PUBLISH_OPTION_NAME );
	return isset( $option[ LC_OPTION_SITE_MATTERS_USER ] ) &&
	isset( $option[ LC_OPTION_SITE_MATTERS_USER ][ LC_MATTERS_USER_ACCESS_TOKEN_FIELD ] ) &&
	$option[ LC_OPTION_SITE_MATTERS_USER ][ LC_MATTERS_USER_ACCESS_TOKEN_FIELD ] &&
	isset( $option[ LC_OPTION_SITE_MATTERS_AUTO_PUBLISH ] ) &&
	$option[ LC_OPTION_SITE_MATTERS_AUTO_PUBLISH ];
}

/**
 * Setup Matters related post hooks according to config
 */
function likecoin_add_matters_hook() {
	if ( likecoin_check_should_hook_matters_draft() ) {
		add_action( 'save_post_post', 'likecoin_save_to_matters', 10, 3 );
		add_action( 'save_post_page', 'likecoin_save_to_matters', 10, 3 );
	}
	if ( likecoin_check_should_hook_matters_publish() ) {
		add_action( 'publish_post', 'likecoin_publish_to_matters', 10, 2 );
	} elseif ( likecoin_check_should_hook_matters_draft() ) {
		add_action( 'publish_post', 'likecoin_save_to_matters', 10, 2 );
	}
}

/**
 * Setup Matters related restful hook for Gutenberg file upload
 */
function likecoin_add_matters_restful_hook() {
	if ( likecoin_check_should_hook_matters_draft() || likecoin_check_should_hook_matters_publish() ) {
		add_action( 'add_attachment', 'likecoin_post_attachment_to_matters', 10, 2 );
	}
}
