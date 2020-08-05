<?php
/**
 * LikeCoin admin ajax handler
 *
 * Define handler for ajax fired by admin panel's javascript
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

/**
 * Admin post handler of user LikeCoinId/data update
 */
function likecoin_update_user_id() {
	$user    = wp_get_current_user();
	$user_id = $user->ID;
	if ( ! current_user_can( 'edit_user', $user_id ) ) {
		return wp_die( 'error editing' );
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
			// url might contain octets.
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
	exit();
}
