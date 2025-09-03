<?php
/**
 * LikeCoin RESTful View Class
 *
 * Handles REST API endpoints data preparation and processing
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
 * LikeCoin RESTful View Class
 *
 * @since 4.0.0
 */
class LikeCoin_Restful_View {

	/**
	 * Ensure admin utilities are loaded
	 *
	 * @since 4.0.0
	 * @return void
	 */
	private static function ensure_admin_utilities() {
		if ( ! class_exists( 'LikeCoin_Admin_Utils' ) ) {
			require_once LC_DIR . 'admin/class-likecoin-admin-utils.php';
		}
	}

	/**
	 * Remove access token from publish option for REST API response
	 *
	 * @since 4.0.0
	 * @return array Publish options without sensitive data.
	 */
	public static function get_publish_option_for_restful() {
		$publish_options = get_option( LC_PUBLISH_OPTION_NAME );
		// Don't give access token to frontend, not useful and security risk.
		if ( isset( $publish_options[ LC_OPTION_IA_SECRET ] ) ) {
			unset( $publish_options[ LC_OPTION_IA_SECRET ] );
		}
		return $publish_options;
	}

	/**
	 * Post main plugin options data to WordPress database
	 *
	 * @since 4.0.0
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response REST API response.
	 */
	public static function post_main_plugin_options( $request ) {
		$plugin_options = get_option( LC_BUTTON_OPTION_NAME );
		$params         = $request->get_json_params();

		// Validate and sanitize input parameters.
		if ( ! is_array( $params ) ) {
			// phpcs:disable WordPress.WP.I18n.NonSingularStringLiteralDomain
			return new WP_Error( 'invalid_parameters', __( 'Invalid parameters provided', LC_PLUGIN_SLUG ), array( 'status' => 400 ) );
			// phpcs:enable WordPress.WP.I18n.NonSingularStringLiteralDomain
		}

		if ( isset( $params['displayOption'] ) ) {
			$display_option = sanitize_text_field( $params['displayOption'] );
			// Validate against allowed values.
			$allowed_display_options = array( 'post', 'page', 'always', 'none' );
			if ( in_array( $display_option, $allowed_display_options, true ) ) {
				$plugin_options[ LC_OPTION_BUTTON_DISPLAY_OPTION ] = $display_option;
			}
		}

		if ( isset( $params['perPostOptionEnabled'] ) ) {
			$per_post_option_enabled                          = (bool) $params['perPostOptionEnabled'];
			$plugin_options['button_display_author_override'] = $per_post_option_enabled;
		}

		if ( isset( $params['siteLikerInfos'] ) && is_array( $params['siteLikerInfos'] ) ) {
			// Sanitize liker info array.
			$liker_infos = array();
			if ( isset( $params['siteLikerInfos']['likecoin_id'] ) ) {
				$liker_infos['likecoin_id'] = sanitize_text_field( $params['siteLikerInfos']['likecoin_id'] );
			}
			if ( isset( $params['siteLikerInfos']['display_name'] ) ) {
				$liker_infos['display_name'] = sanitize_text_field( $params['siteLikerInfos']['display_name'] );
			}
			if ( isset( $params['siteLikerInfos']['avatar'] ) ) {
				$liker_infos['avatar'] = esc_url_raw( $params['siteLikerInfos']['avatar'] );
			}
			if ( isset( $params['siteLikerInfos']['wallet'] ) ) {
				$liker_infos['wallet'] = sanitize_text_field( $params['siteLikerInfos']['wallet'] );
			}
			$plugin_options['site_likecoin_user'] = $liker_infos;
		}

		update_option( LC_BUTTON_OPTION_NAME, $plugin_options );
		$plugin_options = get_option( LC_BUTTON_OPTION_NAME );

		$result['code']    = 200;
		$result['data']    = $plugin_options;
		$result['message'] = 'Successfully POST!';
		return rest_ensure_response( $result );
	}

	/**
	 * Get main plugin options data from WordPress database
	 *
	 * @since 4.0.0
	 * @return WP_REST_Response|null REST API response or null if no options.
	 */
	public static function get_main_plugin_options() {
		$plugin_options = get_option( LC_BUTTON_OPTION_NAME );
		if ( ! $plugin_options ) {
			return null;
		}
		$plugin_options['user_can_edit'] = current_user_can( 'manage_options' );
		$result['code']                  = 200;
		$result['data']                  = $plugin_options;
		$result['message']               = 'Successfully GET main plugin setting data!';
		return rest_ensure_response( $result );
	}

	/**
	 * Post user data to WordPress database
	 *
	 * @since 4.0.0
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response REST API response.
	 */
	public static function post_user_data( $request ) {
		$user    = wp_get_current_user();
		$user_id = $user->ID;
		$params  = $request->get_json_params();

		// Validate input parameters.
		if ( ! is_array( $params ) || ! isset( $params['userLikerInfos'] ) || ! is_array( $params['userLikerInfos'] ) ) {
			// phpcs:disable WordPress.WP.I18n.NonSingularStringLiteralDomain
			return new WP_Error( 'invalid_parameters', __( 'Invalid user liker info provided', LC_PLUGIN_SLUG ), array( 'status' => 400 ) );
			// phpcs:enable WordPress.WP.I18n.NonSingularStringLiteralDomain
		}

		// Sanitize user liker info.
		$liker_infos = array();
		if ( isset( $params['userLikerInfos']['likecoin_id'] ) ) {
			$liker_infos['likecoin_id'] = sanitize_text_field( $params['userLikerInfos']['likecoin_id'] );
		}
		if ( isset( $params['userLikerInfos']['display_name'] ) ) {
			$liker_infos['display_name'] = sanitize_text_field( $params['userLikerInfos']['display_name'] );
		}
		if ( isset( $params['userLikerInfos']['avatar'] ) ) {
			$liker_infos['avatar'] = esc_url_raw( $params['userLikerInfos']['avatar'] );
		}
		if ( isset( $params['userLikerInfos']['wallet'] ) ) {
			$liker_infos['wallet'] = sanitize_text_field( $params['userLikerInfos']['wallet'] );
		}

		$likecoin_id = isset( $liker_infos['likecoin_id'] ) ? $liker_infos['likecoin_id'] : '';

		update_user_meta( $user_id, 'lc_likecoin_user', $liker_infos );
		update_user_meta( $user_id, 'lc_likecoin_id', $likecoin_id );

		// Retrieve latest data.
		$likecoin_user = get_user_meta( $user_id, 'lc_likecoin_user', true );
		$likecoin_id   = get_user_meta( $user_id, 'lc_likecoin_id', true );

		$result['code']                  = 200;
		$result['data']['likecoin_user'] = $likecoin_user;
		$result['data']['likecoin_id']   = $likecoin_id;
		return rest_ensure_response( $result );
	}

	/**
	 * Get user data from WordPress database
	 *
	 * @since 4.0.0
	 * @return WP_REST_Response|null REST API response or null if no user data.
	 */
	public static function get_user_data() {
		$user          = wp_get_current_user();
		$user_id       = $user->ID;
		$likecoin_user = get_user_meta( $user_id, 'lc_likecoin_user', true );
		if ( ! $likecoin_user ) {
			return null;
		}
		$likecoin_id                     = get_user_meta( $user_id, 'lc_likecoin_id', true );
		$result['code']                  = 200;
		$result['data']['likecoin_user'] = $likecoin_user;
		$result['data']['likecoin_id']   = $likecoin_id;
		return rest_ensure_response( $result );
	}

	/**
	 * Post site publish options data to WordPress database
	 *
	 * @since 4.0.0
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response REST API response.
	 */
	public static function post_site_publish_options_data( $request ) {
		$publish_options = get_option( LC_PUBLISH_OPTION_NAME );
		$params          = $request->get_json_params();

		if ( isset( $params['ISCNBadgeStyleOption'] ) ) {
			$publish_options['iscn_badge_style_option'] = $params['ISCNBadgeStyleOption'];
		}
		if ( isset( $params['siteInternetArchiveEnabled'] ) ) {
			$publish_options[ LC_OPTION_IA_ENABLED ] = $params['siteInternetArchiveEnabled'];
		}
		if ( isset( $params['siteInternetArchiveAccessKey'] ) ) {
			$publish_options[ LC_OPTION_IA_ACCESS_KEY ] = $params['siteInternetArchiveAccessKey'];
		}
		if ( isset( $params['siteInternetArchiveSecret'] ) ) {
			$publish_options[ LC_OPTION_IA_SECRET ] = $params['siteInternetArchiveSecret'];
		}

		update_option( LC_PUBLISH_OPTION_NAME, $publish_options );
		$return_payload = self::get_publish_option_for_restful();

		$result['code'] = 200;
		$result['data'] = $return_payload;
		return rest_ensure_response( $result );
	}

	/**
	 * Get site publish data from WordPress database
	 *
	 * @since 4.0.0
	 * @return WP_REST_Response REST API response.
	 */
	public static function get_site_publish_data() {
		$return_payload = self::get_publish_option_for_restful();
		// Incl. login and publish data.
		if ( ! $return_payload ) {
			$return_payload = array();
		}
		$result['code'] = 200;
		$result['data'] = $return_payload;
		return rest_ensure_response( $result );
	}

	/**
	 * Post web monetization data to WordPress database
	 *
	 * @since 4.0.0
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response REST API response.
	 */
	public static function post_web_monetization_data( $request ) {
		$monetization_options = get_option( LC_MONETIZATION_OPTION_NAME );
		$params               = $request->get_json_params();

		// Validate and sanitize input.
		if ( ! is_array( $params ) || ! isset( $params['paymentPointer'] ) ) {
			// phpcs:disable WordPress.WP.I18n.NonSingularStringLiteralDomain
			return new WP_Error( 'invalid_parameters', __( 'Payment pointer is required', LC_PLUGIN_SLUG ), array( 'status' => 400 ) );
			// phpcs:enable WordPress.WP.I18n.NonSingularStringLiteralDomain
		}

		$payment_pointer = sanitize_text_field( $params['paymentPointer'] );
		$monetization_options[ LC_OPTION_SITE_MONETIZATION_PAYMENT_POINTER ] = $payment_pointer;
		update_option( LC_MONETIZATION_OPTION_NAME, $monetization_options );
		$monetization_options = get_option( LC_MONETIZATION_OPTION_NAME );
		$result['code']       = 200;
		$result['data']       = $monetization_options;
		return rest_ensure_response( $result );
	}

	/**
	 * Get web monetization data from WordPress database
	 *
	 * @since 4.0.0
	 * @return WP_REST_Response REST API response.
	 */
	public static function get_web_monetization_data() {
		$monetization_options = get_option( LC_MONETIZATION_OPTION_NAME );
		if ( ! $monetization_options ) {
			$monetization_options = array();
		}
		$result['code'] = 200;
		$result['data'] = $monetization_options;
		return rest_ensure_response( $result );
	}

	/**
	 * Get button settings for a specific post
	 *
	 * @since 4.0.0
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response|WP_Error REST API response or error.
	 */
	public static function rest_get_button_settings( $request ) {
		$post_id = $request['id'];
		$post    = get_post( $post_id );

		if ( ! isset( $post ) ) {
			// phpcs:disable WordPress.WP.I18n.NonSingularStringLiteralDomain
			return new WP_Error( 'post_not_found', __( 'Post was not found', LC_PLUGIN_SLUG ), array( 'status' => 404 ) );
			// phpcs:enable WordPress.WP.I18n.NonSingularStringLiteralDomain
		}

		self::ensure_admin_utilities();
		$data = LikeCoin_Admin_Utils::get_meta_box_button_params( $post, true );
		return new WP_REST_Response( $data, 200 );
	}

	/**
	 * Update button settings for a specific post
	 *
	 * @since 4.0.0
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response|WP_Error REST API response or error.
	 */
	public static function rest_update_button_settings( $request ) {
		$post_id = $request['id'];
		$post    = get_post( $post_id );

		if ( ! isset( $post ) ) {
			// phpcs:disable WordPress.WP.I18n.NonSingularStringLiteralDomain
			return new WP_Error( 'post_not_found', __( 'Post was not found', LC_PLUGIN_SLUG ), array( 'status' => 404 ) );
			// phpcs:enable WordPress.WP.I18n.NonSingularStringLiteralDomain
		}

		$params = $request->get_json_params();
		if ( isset( $params['is_widget_enabled'] ) ) {
			$option = get_post_meta( $post_id, LC_OPTION_WIDGET_OPTION, true );
			if ( ! isset( $option ) || ! is_array( $option ) ) {
				$option = array();
			}
			$option[ LC_OPTION_WIDGET_POSITION ] = $params['is_widget_enabled'];
			update_post_meta( $post_id, LC_OPTION_WIDGET_OPTION, $option );
		}
		return new WP_REST_Response( $params, 200 );
	}

	/**
	 * Save Arweave metadata for a post
	 *
	 * @since 4.0.0
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response|WP_Error REST API response or error.
	 */
	public static function rest_arweave_save_metadata( $request ) {
		$post_id = absint( $request['id'] );

		// Validate post exists.
		if ( ! get_post( $post_id ) ) {
			// phpcs:disable WordPress.WP.I18n.NonSingularStringLiteralDomain
			return new WP_Error( 'post_not_found', __( 'Post was not found', LC_PLUGIN_SLUG ), array( 'status' => 404 ) );
			// phpcs:enable WordPress.WP.I18n.NonSingularStringLiteralDomain
		}

		// Validate and sanitize Arweave data.
		$arweave_info = array();
		if ( isset( $request['arweaveIPFSHash'] ) ) {
			$arweave_info['ipfs_hash'] = sanitize_text_field( $request['arweaveIPFSHash'] );
		}
		if ( isset( $request['arweaveId'] ) ) {
			$arweave_info['arweave_id'] = sanitize_text_field( $request['arweaveId'] );
		}

		if ( empty( $arweave_info ) ) {
			// phpcs:disable WordPress.WP.I18n.NonSingularStringLiteralDomain
			return new WP_Error( 'missing_parameters', __( 'Arweave ID and IPFS hash are required', LC_PLUGIN_SLUG ), array( 'status' => 400 ) );
			// phpcs:enable WordPress.WP.I18n.NonSingularStringLiteralDomain
		}

		update_post_meta( $post_id, LC_ARWEAVE_INFO, $arweave_info );
		return new WP_REST_Response( array( 'data' => $arweave_info ), 200 );
	}

	/**
	 * Update ISCN hash and version for a post
	 *
	 * @since 4.0.0
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response|WP_Error REST API response or error.
	 */
	public static function rest_update_iscn_hash_and_version( $request ) {
		$post_id = $request['id'];
		$params  = $request->get_json_params();
		$post    = get_post( $post_id );

		if ( ! isset( $post ) ) {
			// phpcs:disable WordPress.WP.I18n.NonSingularStringLiteralDomain
			return new WP_Error( 'post_not_found', __( 'Post was not found', LC_PLUGIN_SLUG ), array( 'status' => 404 ) );
			// phpcs:enable WordPress.WP.I18n.NonSingularStringLiteralDomain
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
		if ( isset( $params['iscnData'] ) ) {
			$iscn_mainnet_info['iscn_data'] = $params['iscnData'];
		}
		// Only allow to publish to mainnet going forward.
		update_post_meta( $post_id, LC_ISCN_INFO, $iscn_mainnet_info );
		return new WP_REST_Response( $data, 200 );
	}

	/**
	 * Get full ISCN information for a post
	 *
	 * @since 4.0.0
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response|WP_Error REST API response or error.
	 */
	public static function get_iscn_full_info( $request ) {
		$post_id = $request['id'];
		$params  = $request->get_json_params();
		$post    = get_post( $post_id );

		if ( ! isset( $post ) ) {
			// phpcs:disable WordPress.WP.I18n.NonSingularStringLiteralDomain
			return new WP_Error( 'post_not_found', __( 'Post was not found', LC_PLUGIN_SLUG ), array( 'status' => 404 ) );
			// phpcs:enable WordPress.WP.I18n.NonSingularStringLiteralDomain
		}

		$iscn_full_info = array();
		$iscn_info      = get_post_meta( $post_id, LC_ISCN_INFO, true );
		if ( is_array( $iscn_info ) ) {
			$iscn_full_info['iscnHash'] = $iscn_info['iscn_hash'];
			$iscn_full_info['iscnId']   = $iscn_info['iscn_id'];
			$iscn_full_info['iscnData'] = $iscn_info['iscn_data'];
			// iscnVersion should be taken from chain API.
			$iscn_full_info['iscnTimestamp'] = $iscn_info['last_saved_time'];
			$iscn_full_info['iscnVersion']   = $iscn_info['iscn_version'];
		}
		$arweave_info = get_post_meta( $post_id, LC_ARWEAVE_INFO, true );
		if ( is_array( $arweave_info ) ) {
			$iscn_full_info['arweaveId']       = $arweave_info['arweave_id'];
			$iscn_full_info['arweaveIPFSHash'] = $arweave_info['ipfs_hash'];
		}
		self::ensure_admin_utilities();
		$iscn_related_post_meta              = LikeCoin_Admin_Utils::get_post_iscn_meta( $post );
		$iscn_full_info['title']             = $iscn_related_post_meta['title'];
		$iscn_full_info['author']            = $iscn_related_post_meta['author'];
		$iscn_full_info['authorDescription'] = $iscn_related_post_meta['author_description'];
		$iscn_full_info['description']       = $iscn_related_post_meta['description'];
		$iscn_full_info['url']               = $iscn_related_post_meta['url'];
		$iscn_full_info['tags']              = $iscn_related_post_meta['tags'];
		return new WP_REST_Response( $iscn_full_info, 200 );
	}
}
