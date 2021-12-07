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
		$urls[] = $url;
	};
	return $urls;
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
		return array( 'error' => $response->get_error_message() );
	}
	$decoded_response = json_decode( $response['body'], true );
	if ( ! $decoded_response ) {
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG === true ) {
			// phpcs:disable WordPress.PHP.DevelopmentFunctions
			error_log( $response['body'] );
			// phpcs:enable WordPress.PHP.DevelopmentFunctions
		}
		return array( 'error' => $response['body'] );
	}
	return new WP_REST_Response( $decoded_response, 200 );
}
/**
 * Transform content to arweave-accepted body format.
 *
 * @param string| $boundary Random-generated separator.
 * @param object| $post WordPress post object.
 */
function likecoin_format_post_to_multipart_formdata( $boundary, $post ) {
	$content        = $post->post_title;
	$content        = $content . apply_filters( 'the_content', $post->post_content );
	$urls           = likecoin_get_post_image_url( $post );
	$content        = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
        "http://www.w3.org/TR/html4/strict.dtd"><html><body>' . $content . '</body></html>';
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
	$post_id  = $request['id'];
	$response = likecoin_upload_to_arweave( $request );
	if ( is_wp_error( $response ) ) {
		$err_message = $response->get_error_message();
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG === true ) {
			// phpcs:disable WordPress.PHP.DevelopmentFunctions
			error_log( $response->get_error_message() );
			// phpcs:enable WordPress.PHP.DevelopmentFunctions
		}
		return array( 'error' => $response->get_error_message() );
	}
	$decoded_response = json_decode( $response['body'], true );
	if ( ! $decoded_response ) {
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG === true ) {
			// phpcs:disable WordPress.PHP.DevelopmentFunctions
			error_log( $response['body'] );
			// phpcs:enable WordPress.PHP.DevelopmentFunctions
		}
		return array( 'error' => $response['body'] );
	}
	// save arweaveId & ipfsHash to WordPress DB.
	$arweave_info = get_post_meta( $post_id, LC_ARWEAVE_INFO, true );
	if ( ! is_array( $arweave_info ) ) {
		$arweave_info = array();
	}
	$arweave_info['arweave_id'] = $decoded_response['arweaveId'];
	$arweave_info['ipfs_hash']  = $decoded_response['ipfsHash'];
	update_post_meta( $post_id, LC_ARWEAVE_INFO, $arweave_info );
	return new WP_REST_Response( array( 'data' => $decoded_response ), 200 );
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
	$likecoin_api_upload_url = 'https://api.like.co/api/arweave/upload?txHash=' . $tx_hash; // TODO: change based on test/main net.
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
function likecoin_rest_update_iscn_hash( $request ) {
	$post_id = $request['id'];
	$params  = $request->get_json_params();
	$post    = get_post( $post_id );
	if ( ! isset( $post ) ) {
		return new WP_Error( 'post_not_found', __( 'Post was not found', LC_PLUGIN_SLUG ), array( 'status' => 404 ) );
	}
	$iscn_hash         = $params['iscnHash'];
	$iscn_mainnet_info = get_post_meta( $post_id, LC_ISCN_INFO, true );
	if ( ! is_array( $iscn_mainnet_info ) ) {
		$iscn_mainnet_info = array();
	}
	// only allow to publish to mainnet going forward.
	$iscn_mainnet_info['iscn_hash'] = $iscn_hash;
	update_post_meta( $post_id, LC_ISCN_INFO, $iscn_mainnet_info );
	$data = likecoin_parse_iscn_status( array( 'iscn_hash' => $iscn_hash ) );
	return new WP_REST_Response( $data, 200 );
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
				'/posts/(?P<id>\d+)/publish/iscn',
				array(
					'methods'             => 'POST',
					'callback'            => 'likecoin_rest_update_iscn_hash',
					'args'                => array(
						'id' => array(
							'validate_callback' => 'likecoin_is_numeric',
						),
					),
					'permission_callback' => 'likecoin_get_current_user_edit_post_permission',
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
