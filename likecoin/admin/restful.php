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
require_once dirname( __FILE__ ) . '/views/metabox.php';

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
	$matters_info = likecoin_get_meta_box_publish_params( $post, true );
	$data         = likecoin_parse_publish_status( $matters_info );
	return new WP_REST_Response( $data, 200 );
}

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
	$iscn_hash = $params['iscnHash'];
	$iscn_info = get_post_meta( $post_id, LC_ISCN_DEV_INFO, true );
	if ( ! is_array( $iscn_info ) ) {
		$iscn_info = array();
	}
	$iscn_info['iscn_hash'] = $iscn_hash;
	update_post_meta( $post_id, LC_ISCN_DEV_INFO, $iscn_info );
	$data = likecoin_parse_iscn_status( $iscn_hash );
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
 * Add plugin restful routes
 */
function likecoin_init_restful_service() {
	add_action(
		'rest_api_init',
		function () {
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
					'permission_callback' => function () {
						return current_user_can( 'edit_posts' );
					},
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
					'permission_callback' => function () {
						return current_user_can( 'edit_posts' );
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
