<?php
/**
 * LikeCoin Admin Ajax Handler Class
 *
 * Handles AJAX requests fired by admin panel's JavaScript
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
 * LikeCoin Admin Ajax Handler Class
 *
 * @since 4.0.0
 */
class LikeCoin_Ajax {

	/**
	 * Initialize AJAX handlers
	 *
	 * @since 4.0.0
	 * @return void
	 */
	public static function init() {
		add_action( 'admin_post_likecoin_update_user_id', array( __CLASS__, 'update_user_id' ) );
		add_action( 'wp_ajax_likecoin_get_error_notice', array( __CLASS__, 'get_admin_errors_restful' ) );
	}

	/**
	 * Admin post handler of user LikeCoinId/data update
	 *
	 * @since 4.0.0
	 * @return void
	 */
	public static function update_user_id() {
		$user    = wp_get_current_user();
		$user_id = $user->ID;
		if ( ! current_user_can( 'edit_user', $user_id ) ) {
			wp_die( 'Permission denied: You do not have permission to edit this user.' );
			return;
		}
		check_admin_referer( 'likecoin_update_user_id' );
		if ( isset( $_POST[ LC_LIKECOIN_USER_ID_FIELD ] ) ) {
			update_user_meta(
				$user_id,
				LC_USER_LIKECOIN_ID,
				sanitize_text_field( wp_unslash( $_POST[ LC_LIKECOIN_USER_ID_FIELD ] ) )
			);
			$likecoin_user = array();
			if ( isset( $_POST[ LC_LIKECOIN_USER_ID_FIELD ] ) ) {
				$likecoin_user[ LC_LIKECOIN_USER_ID_FIELD ] = sanitize_text_field( wp_unslash( $_POST[ LC_LIKECOIN_USER_ID_FIELD ] ) );
			}
			if ( isset( $_POST[ LC_LIKECOIN_USER_DISPLAY_NAME_FIELD ] ) ) {
				$likecoin_user[ LC_LIKECOIN_USER_DISPLAY_NAME_FIELD ] = sanitize_text_field( wp_unslash( $_POST[ LC_LIKECOIN_USER_DISPLAY_NAME_FIELD ] ) );
			}
			if ( isset( $_POST[ LC_LIKECOIN_USER_WALLET_FIELD ] ) ) {
				$likecoin_user[ LC_LIKECOIN_USER_WALLET_FIELD ] = sanitize_text_field( wp_unslash( $_POST[ LC_LIKECOIN_USER_WALLET_FIELD ] ) );
			}
			if ( isset( $_POST[ LC_LIKECOIN_USER_AVATAR_FIELD ] ) ) {
				// URL might contain octets.
				// phpcs:disable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
				$likecoin_user[ LC_LIKECOIN_USER_AVATAR_FIELD ] = wp_unslash( $_POST[ LC_LIKECOIN_USER_AVATAR_FIELD ] );
				// phpcs:enable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			}
			update_user_meta(
				$user_id,
				LC_USER_LIKECOIN_USER,
				$likecoin_user
			);
		}
		if ( isset( $_POST['_wp_http_referer'] ) ) {
			wp_safe_redirect( esc_url_raw( add_query_arg( 'settings-updated', '1', wp_get_referer() ) ) );
		}
		// wp_die breaks safe_redirect, use exit.
		exit();
	}

	/**
	 * POST handler of editor fetching admin notices/error message
	 *
	 * @since 4.0.0
	 * @return void
	 */
	public static function get_admin_errors_restful() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_send_json( false );
			return;
		}
		$error = LikeCoin_Error::get_admin_errors();
		LikeCoin_Error::clear_admin_errors();
		$decode_message = false;
		if ( $error ) {
			$decode_message = json_decode( $error['message'] );
			if ( ! $decode_message ) {
				wp_send_json( $error['message'] );
				return;
			}
		}
		wp_send_json( $decode_message );
	}
}
