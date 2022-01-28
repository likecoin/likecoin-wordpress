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

// phpcs:disable WordPress.WP.I18n.NonSingularStringLiteralDomain

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
	$title                  = apply_filters( 'the_title_rss', $post->post_title );
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
	$description    = apply_filters( 'get_the_excerpt', $content );
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
 * Add likecoin arweave estimate endpoint.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|WP_REST_Response
 */
function likecoin_rest_post_arweave_estimate( $request ) {
	$post_id = $request['id'];
	$post    = get_post( $post_id );
	if ( ! isset( $post ) ) {
		return new WP_Error( 'post_not_found', __( 'Post was not found', LC_PLUGIN_SLUG ), array( 'status' => 404 ) );
	}
	// phpcs:disable WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
	$boundary = base64_encode( wp_generate_password( 24 ) );
	// phpcs:enable WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
	$body                      = likecoin_format_post_to_multipart_formdata( $boundary, $post );
	$title                     = apply_filters( 'the_title_rss', $post->post_title );
	$tags                      = likecoin_get_post_tags_for_matters( $post );
	$url                       = get_permalink( $post );
	$likecoin_api_estimate_url = 'https://api.like.co/api/arweave/estimate';
	$response                  = wp_remote_post(
		$likecoin_api_estimate_url,
		array(
			'headers' => array(
				'Content-Type' => 'multipart/form-data; boundary=' . $boundary,
			),
			'body'    => $body,
		)
	);
	if ( is_wp_error( $response ) ) {
		$err_message = $response->get_error_message();
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG === true ) {
			// phpcs:disable WordPress.PHP.DevelopmentFunctions
			error_log( $response->get_error_message() );
			// phpcs:enable WordPress.PHP.DevelopmentFunctions
		}
		return new WP_REST_Response( array( 'error' => $response->get_error_message() ), 500 );
	}
	$decoded_response = json_decode( $response['body'], true );
	if ( ! $decoded_response ) {
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG === true ) {
			// phpcs:disable WordPress.PHP.DevelopmentFunctions
			error_log( $response['body'] );
			// phpcs:enable WordPress.PHP.DevelopmentFunctions
		}
		return new WP_REST_Response( array( 'error' => $response['body'] ), 400 );
	}
	$decoded_response['title'] = $title;
	$publish_params            = likecoin_get_meta_box_publish_params( $post, true );
	if ( isset( $publish_params['ipfs_hash'] ) ) {
		$decoded_response['mattersIPFSHash']             = $publish_params['ipfs_hash'];
		$decoded_response['mattersId']                   = $publish_params['matters_id'];
		$decoded_response['mattersPublishedArticleHash'] = $publish_params['article_hash'];
		$decoded_response['mattersArticleId']            = $publish_params['article_id'];
		$decoded_response['mattersArticleSlug']          = $publish_params['article_slug'];
	}
	$decoded_response['tags']              = $tags;
	$decoded_response['url']               = $url;
	$iscn_related_post_meta                = likecoin_get_post_iscn_meta( $post );
	$decoded_response['author']            = $iscn_related_post_meta['author'];
	$decoded_response['authorDescription'] = $iscn_related_post_meta['author_description'];
	$decoded_response['description']       = $iscn_related_post_meta['description'];
	return new WP_REST_Response( $decoded_response, 200 );
}
/**
 * Transform content to arweave-accepted body format.
 *
 * @param string| $boundary Random-generated separator.
 * @param object| $post WordPress post object.
 */
function likecoin_format_post_to_multipart_formdata( $boundary, $post ) {
	$title          = apply_filters( 'the_title_rss', $post->post_title );
	$content        = apply_filters( 'the_content', $post->post_content );
	$urls           = likecoin_get_post_image_url( $post );
	$content        = '<!DOCTYPE html><html>
  	<head> <title>' . $title . '</title>' .
		'<meta charset="utf-8" />
		 <meta name="viewport" content="width=device-width, initial-scale=1" />
	</head>
	<body> <h1>' . $title . '</h1>' . $content . '</body></html>';
	$file_mime_type = 'text/html';
	$filename       = 'index.html';
	$body           = '';
	$body          .= '--' . $boundary . "\r\n";
	$body          .= 'Content-Disposition: form-data; name="index.html"; filename="' . $filename . "\"\r\n";
	$body          .= 'Content-Type: ' . $file_mime_type . "\r\n";
	$body          .= "Content-Transfer-Encoding: binary\r\n";
	$body          .= "\r\n";
	$body          .= $content . "\r\n";
	$body          .= "\r\n";
	foreach ( $urls as $url ) {
		$file_info  = new finfo( FILEINFO_MIME_TYPE );
		$image_path = substr( $url, 22 );
		// phpcs:disable WordPress.WP.AlternativeFunctions
		$img_body = file_get_contents( $image_path );
		// phpcs:enable WordPress.WP.AlternativeFunctions
		$mime_type = $file_info->buffer( $img_body );
		$filename  = basename( $url );
		$body     .= '--' . $boundary . "\r\n";
		$body     .= 'Content-Disposition: form-data; name="' . $filename . '"; filename="' . $filename . "\"\r\n";
		$body     .= 'Content-Type: ' . $mime_type . "\r\n";
		$body     .= "Content-Transfer-Encoding: binary\r\n";
		$body     .= "\r\n";
		$body     .= $img_body . "\r\n";
		$body     .= "\r\n";
	}
	$body .= '--' . $boundary . '--';
	return $body;
}
/**
 * Add likecoin arweave upload and change WordPress DB endpoint.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|WP_REST_Response
 */
function likecoin_rest_arweave_upload_and_update_post_meta( $request ) {
	global $post;
	$post_id  = $request['id'];
	$response = likecoin_upload_to_arweave( $request );
	if ( is_wp_error( $response ) ) {
		$err_message = $response->get_error_message();
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG === true ) {
			// phpcs:disable WordPress.PHP.DevelopmentFunctions
			error_log( $response->get_error_message() );
			// phpcs:enable WordPress.PHP.DevelopmentFunctions
		}
		return new WP_REST_Response( array( 'error' => $response->get_error_message() ), 500 );
	}
	$decoded_response = json_decode( $response['body'], true );
	if ( ! $decoded_response ) {
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG === true ) {
			// phpcs:disable WordPress.PHP.DevelopmentFunctions
			error_log( $response['body'] );
			// phpcs:enable WordPress.PHP.DevelopmentFunctions
		}
		return new WP_REST_Response( array( 'error' => $response['body'] ), 400 );
	}
	// save arweaveId & ipfsHash to WordPress DB.
	$arweave_info = get_post_meta( $post_id, LC_ARWEAVE_INFO, true );
	if ( ! is_array( $arweave_info ) ) {
		$arweave_info = array();
	}
	$arweave_info['arweave_id'] = $decoded_response['arweaveId'];
	$arweave_info['ipfs_hash']  = $decoded_response['ipfsHash'];
	update_post_meta( $post_id, LC_ARWEAVE_INFO, $arweave_info );
	$publish_params                      = likecoin_get_meta_box_publish_params( $post, true );
	$decoded_response['mattersIPFSHash'] = $publish_params['ipfsHash'];

	return new WP_REST_Response( array( 'data' => $decoded_response ), 200 );
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
 * Add upload to arweave server function.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_REST_Response
 */
function likecoin_upload_to_arweave( $request ) {
	$post_id = $request['id'];
	$post    = get_post( $post_id );
	$tx_hash = $request['txHash'];
	if ( ! isset( $post ) ) {
		return new WP_Error( 'post_not_found', __( 'Post was not found', LC_PLUGIN_SLUG ), array( 'status' => 404 ) );
	}
	// phpcs:disable WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
	$boundary = base64_encode( wp_generate_password( 24 ) );
	// phpcs:enable WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
	$body                    = likecoin_format_post_to_multipart_formdata( $boundary, $post );
	$likecoin_api_upload_url = 'https://api.like.co/api/arweave/upload?txHash=' . $tx_hash;
	$response                = wp_remote_post(
		$likecoin_api_upload_url,
		array(
			'headers' => array(
				'Content-Type' => 'multipart/form-data; boundary=' . $boundary,
			),
			'body'    => $body,
		)
	);
	return $response;
};

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
		$iscn_timestamp_local_time            = get_date_from_gmt( gmdate( 'Y-m-d H:i:s', $iscn_timestamp ), 'Y-m-d H:i:s' );
		$timezone                             = wp_timezone_string();
		$data['iscnVersion']                  = $iscn_version;
		$data['timeZone']                     = $timezone;
		$data['localTime']                    = $iscn_timestamp_local_time;
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
		$timezone                   = wp_timezone_string();
		$iscn_timestamp_local_time  = get_date_from_gmt( gmdate( 'Y-m-d H:i:s', $iscn_info['last_saved_time'] ), 'Y-m-d H:i:s' );
		// iscnVersion should be taken from chain API.
		$iscn_full_info['timeZone']    = $timezone;
		$iscn_full_info['localTime']   = $iscn_timestamp_local_time;
		$iscn_full_info['iscnVersion'] = $iscn_info['iscn_version'];
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
						return current_user_can( 'manage_options' );
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
						return current_user_can( 'manage_options' );
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
				'/posts/(?P<id>\d+)/arweave/estimate',
				array(
					'methods'             => 'POST',
					'callback'            => 'likecoin_rest_post_arweave_estimate',
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
				'/posts/(?P<id>\d+)/arweave/upload',
				array(
					'methods'             => 'POST',
					'callback'            => 'likecoin_rest_arweave_upload_and_update_post_meta',
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
