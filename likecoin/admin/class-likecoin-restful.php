<?php
/**
 * LikeCoin RESTful Service Class
 *
 * Handles REST API endpoint registration and utilities
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

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * LikeCoin RESTful Service Class
 *
 * @since 3.3.0
 */
class LikeCoin_Restful {

	/**
	 * Check if ID is numeric
	 *
	 * @since 3.3.0
	 * @param mixed $id ID to check.
	 * @return bool True if numeric, false otherwise.
	 */
	public static function is_numeric( $id ) {
		return is_numeric( $id );
	}

	/**
	 * Get current user edit post permission
	 *
	 * @since 3.3.0
	 * @param WP_REST_Request $request REST request object.
	 * @return bool True if user can edit post, false otherwise.
	 */
	public static function get_current_user_edit_post_permission( $request ) {
		$post_id = $request['id'];
		return current_user_can( 'edit_post', $post_id );
	}

	/**
	 * Initialize RESTful service endpoints
	 *
	 * @since 3.3.0
	 * @return void
	 */
	public static function init_restful_service() {
		// Register post meta for ISCN info.
		register_post_meta(
			'',
			LC_ISCN_INFO,
			array(
				'type'         => 'object',
				'description'  => 'ISCN information of the post',
				'single'       => true,
				'show_in_rest' => array(
					'schema'           => array(
						'type'       => 'object',
						'properties' => array(
							'iscn_id'              => array(
								'type' => 'string',
							),
							'additionalProperties' => array(
								'type' => 'string',
							),
						),
					),
					'prepare_callback' => function ( $value ) {
						return $value;
					},
				),
			)
		);
		// Main plugin options endpoints.
		register_rest_route(
			'likecoin/v1',
			'/options/liker-id',
			array(
				'methods'             => 'GET',
				'callback'            => array( 'LikeCoin_Restful_View', 'get_main_plugin_options' ),
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);

		register_rest_route(
			'likecoin/v1',
			'/options/liker-id',
			array(
				'methods'             => 'POST',
				'callback'            => array( 'LikeCoin_Restful_View', 'post_main_plugin_options' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);

		// User data endpoints.
		register_rest_route(
			'likecoin/v1',
			'/options/liker-id/user',
			array(
				'methods'             => 'GET',
				'callback'            => array( 'LikeCoin_Restful_View', 'get_user_data' ),
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);

		register_rest_route(
			'likecoin/v1',
			'/options/liker-id/user',
			array(
				'methods'             => 'POST',
				'callback'            => array( 'LikeCoin_Restful_View', 'post_user_data' ),
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);

		// Publish options endpoints.
		register_rest_route(
			'likecoin/v1',
			'/option/publish',
			array(
				'methods'             => 'GET',
				'callback'            => array( 'LikeCoin_Restful_View', 'get_site_publish_data' ),
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
				'callback'            => array( 'LikeCoin_Restful_View', 'post_site_publish_options_data' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);

		// Web monetization endpoints.
		register_rest_route(
			'likecoin/v1',
			'/option/web-monetization',
			array(
				'methods'             => 'GET',
				'callback'            => array( 'LikeCoin_Restful_View', 'get_web_monetization_data' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);

		register_rest_route(
			'likecoin/v1',
			'/option/web-monetization',
			array(
				'methods'             => 'POST',
				'callback'            => array( 'LikeCoin_Restful_View', 'post_web_monetization_data' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);

		// Post-specific endpoints.
		register_rest_route(
			'likecoin/v1',
			'/posts/(?P<id>\d+)/button/settings',
			array(
				'methods'             => 'GET',
				'callback'            => array( 'LikeCoin_Restful_View', 'rest_get_button_settings' ),
				'permission_callback' => array( __CLASS__, 'get_current_user_edit_post_permission' ),
				'args'                => array(
					'id' => array(
						'validate_callback' => array( __CLASS__, 'is_numeric' ),
					),
				),
			)
		);

		register_rest_route(
			'likecoin/v1',
			'/posts/(?P<id>\d+)/button/settings',
			array(
				'methods'             => 'POST',
				'callback'            => array( 'LikeCoin_Restful_View', 'rest_update_button_settings' ),
				'permission_callback' => array( __CLASS__, 'get_current_user_edit_post_permission' ),
				'args'                => array(
					'id' => array(
						'validate_callback' => array( __CLASS__, 'is_numeric' ),
					),
				),
			)
		);

		register_rest_route(
			'likecoin/v1',
			'/posts/(?P<id>\d+)/iscn/arweave',
			array(
				'methods'             => 'POST',
				'callback'            => array( 'LikeCoin_Restful_View', 'rest_arweave_save_metadata' ),
				'permission_callback' => array( __CLASS__, 'get_current_user_edit_post_permission' ),
				'args'                => array(
					'id' => array(
						'validate_callback' => array( __CLASS__, 'is_numeric' ),
					),
				),
			)
		);

		register_rest_route(
			'likecoin/v1',
			'/posts/(?P<id>\d+)/iscn/metadata',
			array(
				'methods'             => 'POST',
				'callback'            => array( 'LikeCoin_Restful_View', 'rest_update_iscn_hash_and_version' ),
				'permission_callback' => array( __CLASS__, 'get_current_user_edit_post_permission' ),
				'args'                => array(
					'id' => array(
						'validate_callback' => array( __CLASS__, 'is_numeric' ),
					),
				),
			)
		);

		register_rest_route(
			'likecoin/v1',
			'/posts/(?P<id>\d+)/iscn/metadata',
			array(
				'methods'             => 'GET',
				'callback'            => array( 'LikeCoin_Restful_View', 'get_iscn_full_info' ),
				'permission_callback' => function () {
					return current_user_can( 'read' );
				},
				'args'                => array(
					'id' => array(
						'validate_callback' => array( __CLASS__, 'is_numeric' ),
					),
				),
			)
		);
	}

	/**
	 * Hook RESTful service initialization
	 *
	 * @since 3.3.0
	 * @return void
	 */
	public static function hook_restful_hook() {
		add_action( 'rest_api_init', array( __CLASS__, 'init_restful_service' ) );
	}
}
