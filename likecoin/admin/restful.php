<?php
/**
 * LikeCoin restful hook
 *
 * Index of restful hook triggered by admin pages
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
 * Require Matters files
 */
require_once dirname( __FILE__ ) . '/matters.php';
require_once dirname( __FILE__ ) . '/metabox.php';
require_once dirname( __FILE__ ) . '/post.php';
require_once dirname( __FILE__ ) . '/view/view.php';

/**
 * Add refresh publish status endpoint
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|WP_REST_Response
 */
function likecoin_rest_refresh_publish_status( $request ) {
	$post_id = $request['id'];
	$post    = get_post( $post_id );
	if ( ! isset( $post ) ) {
		return new WP_Error( 'post_not_found', __( 'Post was not found', LC_PLUGIN_SLUG ), array( 'status' => 404 ) );
	}
	$publish_params              = likecoin_get_meta_box_publish_params( $post, true );
	$data                        = likecoin_parse_publish_status( $publish_params );
	$data['wordpress_published'] = get_post_status( $post_id );
	return new WP_REST_Response( $data, 200 );
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
 * Add refresh publish status endpoint
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
 * Get ISCN register related post metadata.
 *
 * @param object| $post WordPress post object.
 */
function likecoin_get_post_iscn_meta( $post ) {
	$iscn_related_post_meta = array();
	$user                   = wp_get_current_user();
	$user_id                = $user->ID;
	$title                  = html_entity_decode( apply_filters( 'the_title_rss', $post->post_title ) );
	if ( isset( $title ) ) {
		$iscn_related_post_meta['title'] = $title;
	}
	$author = $user->display_name;
	if ( isset( $author ) ) {
		$iscn_related_post_meta['author'] = $author;
	}
	$author_description = get_the_author_meta( 'description', $user_id );
	if ( isset( $author_description ) ) {
		$iscn_related_post_meta['author_description'] = $author_description;
	}
	$excerpt_length = apply_filters( 'excerpt_length', 55 );
	$content        = apply_filters( 'the_content', $post->post_content );
	$content        = wp_trim_words( $content, $excerpt_length, '...' );
	$description    = html_entity_decode( apply_filters( 'get_the_excerpt', $content ) );
	if ( isset( $description ) ) {
		$iscn_related_post_meta['description'] = $description;
	}
	$url = get_permalink( $post );
	if ( isset( $url ) ) {
		$iscn_related_post_meta['url'] = $url;
	}
	$tags = likecoin_get_post_tags_for_matters( $post );
	if ( is_array( $tags ) ) {
		$iscn_related_post_meta['tags'] = $tags;
	}
	return $iscn_related_post_meta;
}


/**
 * Get post data and metadata as json
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|WP_REST_Response
 */
function likecoin_rest_prepare_post_iscn_register_data( $request ) {
	$post_id = $request['id'];
	$post    = get_post( $post_id );
	if ( ! isset( $post ) ) {
		return new WP_Error( 'post_not_found', __( 'Post was not found', LC_PLUGIN_SLUG ), array( 'status' => 404 ) );
	}
	$files          = likecoin_format_post_to_json_data( $post );
	$response       = array(
		'files' => $files,
	);
	$publish_params = likecoin_get_meta_box_publish_params( $post, true );
	if ( isset( $publish_params['ipfs_hash'] ) ) {
		$response['mattersIPFSHash']             = $publish_params['ipfs_hash'];
		$response['mattersId']                   = $publish_params['matters_id'];
		$response['mattersPublishedArticleHash'] = $publish_params['article_hash'];
		$response['mattersArticleId']            = $publish_params['article_id'];
		$response['mattersArticleSlug']          = $publish_params['article_slug'];
	}
	$iscn_related_post_meta        = likecoin_get_post_iscn_meta( $post );
	$response['title']             = $iscn_related_post_meta['title'];
	$response['author']            = $iscn_related_post_meta['author'];
	$response['authorDescription'] = $iscn_related_post_meta['author_description'];
	$response['description']       = $iscn_related_post_meta['description'];
	$response['url']               = $iscn_related_post_meta['url'];
	$response['tags']              = $iscn_related_post_meta['tags'];
	return new WP_REST_Response( $response, 200 );
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
 * Add likecoin arweave Id and IPFS data saving endpoint.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|WP_REST_Response
 */
function likecoin_rest_arweave_save_metadata( $request ) {
	$post_id                    = $request['id'];
	$arweave_info['ipfs_hash']  = $request['arweaveIPFSHash'];
	$arweave_info['arweave_id'] = $request['arweaveId'];
	update_post_meta( $post_id, LC_ARWEAVE_INFO, $arweave_info );
	return new WP_REST_Response( array( 'data' => $arweave_info ), 200 );
}

/**
 * Add submit iscn hash endpoint
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|WP_REST_Response
 */
function likecoin_rest_update_iscn_hash_and_version( $request ) {
	$post_id = $request['id'];
	$params  = $request->get_json_params();
	$post    = get_post( $post_id );
	if ( ! isset( $post ) ) {
		return new WP_Error( 'post_not_found', __( 'Post was not found', LC_PLUGIN_SLUG ), array( 'status' => 404 ) );
	}
	$iscn_mainnet_info = get_post_meta( $post_id, LC_ISCN_INFO, true );
	if ( ! is_array( $iscn_mainnet_info ) ) {
		$iscn_mainnet_info = array();
	}
	if ( isset( $params['iscnHash'] ) ) {
		$iscn_hash                      = $params['iscnHash'];
		$iscn_mainnet_info['iscn_hash'] = $iscn_hash;
	}
	$data = array();
	if ( isset( $params['iscnId'] ) ) {
		$iscn_id                      = $params['iscnId'];
		$iscn_mainnet_info['iscn_id'] = $iscn_id;
		$data['iscn_id']              = $iscn_id;
	}
	if ( isset( $params['iscnVersion'] ) && isset( $params['iscnTimestamp'] ) ) {
		$iscn_version                         = $params['iscnVersion'];
		$iscn_timestamp                       = $params['iscnTimestamp'];
		$iscn_mainnet_info['iscn_version']    = $iscn_version;
		$iscn_mainnet_info['last_saved_time'] = $iscn_timestamp;
		$data['iscnVersion']                  = $iscn_version;
		$data['iscnTimestamp']                = $iscn_timestamp;
	}
	// only allow to publish to mainnet going forward.
	update_post_meta( $post_id, LC_ISCN_INFO, $iscn_mainnet_info );
	return new WP_REST_Response( $data, 200 );
}

/**
 * Add get ISCN related info.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|WP_REST_Response
 */
function likecoin_get_iscn_full_info( $request ) {
	$post_id = $request['id'];
	$params  = $request->get_json_params();
	$post    = get_post( $post_id );
	if ( ! isset( $post ) ) {
		return new WP_Error( 'post_not_found', __( 'Post was not found', LC_PLUGIN_SLUG ), array( 'status' => 404 ) );
	}
	$iscn_full_info = array();
	$iscn_info      = get_post_meta( $post_id, LC_ISCN_INFO, true );
	if ( is_array( $iscn_info ) ) {
		$iscn_full_info['iscnHash'] = $iscn_info['iscn_hash'];
		$iscn_full_info['iscnId']   = $iscn_info['iscn_id'];
		// iscnVersion should be taken from chain API.
		$iscn_full_info['timeZone']      = $timezone;
		$iscn_full_info['iscnTimestamp'] = $iscn_info['last_saved_time'];
		$iscn_full_info['iscnVersion']   = $iscn_info['iscn_version'];
	}
	$arweave_info = get_post_meta( $post_id, LC_ARWEAVE_INFO, true );
	if ( is_array( $arweave_info ) ) {
		$iscn_full_info['arweaveId']       = $arweave_info['arweave_id'];
		$iscn_full_info['arweaveIPFSHash'] = $arweave_info['ipfs_hash'];
	}
	$publish_params = likecoin_get_meta_box_publish_params( $post, true );
	if ( is_array( $publish_params ) ) {
		$iscn_full_info['mattersIPFSHash']             = $publish_params['ipfs_hash'];
		$iscn_full_info['mattersArticleId']            = $publish_params['article_id'];
		$iscn_full_info['mattersPublishedArticleHash'] = $publish_params['article_hash'];
		$iscn_full_info['mattersId']                   = $publish_params['matters_id'];
		$iscn_full_info['mattersArticleSlug']          = $publish_params['article_slug'];
	}
	$iscn_related_post_meta              = likecoin_get_post_iscn_meta( $post );
	$iscn_full_info['title']             = $iscn_related_post_meta['title'];
	$iscn_full_info['author']            = $iscn_related_post_meta['author'];
	$iscn_full_info['authorDescription'] = $iscn_related_post_meta['author_description'];
	$iscn_full_info['description']       = $iscn_related_post_meta['description'];
	$iscn_full_info['url']               = $iscn_related_post_meta['url'];
	$iscn_full_info['tags']              = $iscn_related_post_meta['tags'];
	return new WP_REST_Response( $iscn_full_info, 200 );
}

/**
 * Check post ID is numeric
 *
 * @param int $id input param.
 */
function likecoin_is_numeric( $id ) {
	return is_numeric( $id );
}

/**
 * Get edit single post level permission
 *
 * @param WP_REST_Request $request Full data about the request.
 */
function likecoin_get_current_user_edit_post_permission( $request ) {
	$id = $request['id'];
	return current_user_can( 'edit_post', $id );
}

/**
 * Add plugin restful routes
 */
function likecoin_init_restful_service() {
	add_action(
		'rest_api_init',
		function () {
			register_rest_route(
				'likecoin/v1',
				'/main-setting-page',
				array(
					'methods'             => 'POST',
					'callback'            => 'likecoin_post_main_plugin_options',
					'permission_callback' => function () {
						return current_user_can( 'manage_options' );
					},
				)
			);
			register_rest_route(
				'likecoin/v1',
				'/main-setting-page',
				array(
					'methods'             => 'GET',
					'callback'            => 'likecoin_get_main_plugin_options',
					'permission_callback' => function () {
						return current_user_can( 'manage_options' );
					},
				)
			);
			register_rest_route(
				'likecoin/v1',
				'/likecoin-button-page',
				array(
					'methods'             => 'POST',
					'callback'            => 'likecoin_post_user_data',
					'permission_callback' => function () {
						return current_user_can( 'edit_posts' );
					},
				)
			);
			register_rest_route(
				'likecoin/v1',
				'/likecoin-button-page',
				array(
					'methods'             => 'GET',
					'callback'            => 'likecoin_get_user_data',
					'permission_callback' => function () {
						return current_user_can( 'edit_posts' );
					},
				)
			);
			register_rest_route(
				'likecoin/v1',
				'/publish-setting-page/login-to-matters',
				array(
					'methods'             => 'POST',
					'callback'            => 'likecoin_login_to_matters',
					'permission_callback' => function () {
						return current_user_can( 'manage_options' );
					},
				)
			);
			register_rest_route(
				'likecoin/v1',
				'/publish-setting-page/publish-options',
				array(
					'methods'             => 'POST',
					'callback'            => 'likecoin_post_site_publish_options_data',
					'permission_callback' => function () {
						return current_user_can( 'manage_options' );
					},
				)
			);
			register_rest_route(
				'likecoin/v1',
				'/publish-setting-page/login-to-matters',
				array(
					'methods'             => 'DELETE',
					'callback'            => 'likecoin_logout_matters',
					'permission_callback' => function () {
						return current_user_can( 'manage_options' );
					},
				)
			);
			register_rest_route(
				'likecoin/v1',
				'/publish-setting-page',
				array(
					'methods'             => 'GET',
					'callback'            => 'likecoin_get_site_matters_data',
					'permission_callback' => function () {
						return current_user_can( 'manage_options' );
					},
				)
			);
			register_rest_route(
				'likecoin/v1',
				'/web-monetization-page',
				array(
					'methods'             => 'POST',
					'callback'            => 'likecoin_post_web_monetization_data',
					'permission_callback' => function () {
						return current_user_can( 'manage_options' );
					},
				)
			);
			register_rest_route(
				'likecoin/v1',
				'/web-monetization-page',
				array(
					'methods'             => 'GET',
					'callback'            => 'likecoin_get_web_monetization_data',
					'permission_callback' => function () {
						return current_user_can( 'manage_options' );
					},
				)
			);
			register_rest_route(
				'likecoin/v1',
				'/posts/(?P<id>\d+)/publish/refresh',
				array(
					'methods'             => 'POST',
					'callback'            => 'likecoin_rest_refresh_publish_status',
					'args'                => array(
						'id' => array(
							'validate_callback' => 'likecoin_is_numeric',
						),
					),
					'permission_callback' => 'likecoin_get_current_user_edit_post_permission',
				)
			);
			register_rest_route(
				'likecoin/v1',
				'/posts/(?P<id>\d+)/arweave/register-data',
				array(
					'methods'             => 'GET',
					'callback'            => 'likecoin_rest_prepare_post_iscn_register_data',
					'args'                => array(
						'id' => array(
							'validate_callback' => 'likecoin_is_numeric',
						),
					),
					'permission_callback' => 'likecoin_get_current_user_edit_post_permission',
				)
			);
			register_rest_route(
				'likecoin/v1',
				'/posts/(?P<id>\d+)/arweave/save-metadata',
				array(
					'methods'             => 'POST',
					'callback'            => 'likecoin_rest_arweave_save_metadata',
					'args'                => array(
						'id' => array(
							'validate_callback' => 'likecoin_is_numeric',
						),
					),
					'permission_callback' => 'likecoin_get_current_user_edit_post_permission',
				)
			);
			register_rest_route(
				'likecoin/v1',
				'/posts/(?P<id>\d+)/publish/iscn',
				array(
					'methods'             => 'POST',
					'callback'            => 'likecoin_rest_update_iscn_hash_and_version',
					'args'                => array(
						'id' => array(
							'validate_callback' => 'likecoin_is_numeric',
						),
					),
					'permission_callback' => 'likecoin_get_current_user_edit_post_permission',
				)
			);
			register_rest_route(
				'likecoin/v1',
				'/posts/(?P<id>\d+)/iscn/full-info',
				array(
					'methods'             => 'GET',
					'callback'            => 'likecoin_get_iscn_full_info',
					'args'                => array(
						'id' => array(
							'validate_callback' => 'likecoin_is_numeric',
						),
					),
					'permission_callback' => function () {
						return current_user_can( 'read' );
					},
				)
			);
		}
	);
}

/**
 * Add public hooks triggered by restful
 */
function likecoin_hook_restful_hook() {
	likecoin_init_restful_service();
	likecoin_add_matters_restful_hook();
}
