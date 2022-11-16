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
 * Require files
 */
require_once dirname( __FILE__ ) . '/matters.php';
require_once dirname( __FILE__ ) . '/view/restful.php';

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
				'/options/button',
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
				'/options/button',
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
				'/options/button/user',
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
				'/options/button/user',
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
				'/option/publish/settings/matters',
				array(
					'methods'             => 'POST',
					'callback'            => 'likecoin_login_matters',
					'permission_callback' => function () {
						return current_user_can( 'manage_options' );
					},
				)
			);
			register_rest_route(
				'likecoin/v1',
				'/option/publish/settings/matters',
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
				'/option/publish',
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
				'/option/publish',
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
				'/posts/(?P<id>\d+)/iscn/refresh',
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
				'/posts/(?P<id>\d+)/iscn/arweave/upload',
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
				'/posts/(?P<id>\d+)/iscn/arweave',
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
				'/posts/(?P<id>\d+)/iscn/metadata',
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
				'/posts/(?P<id>\d+)/iscn/metadata',
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
