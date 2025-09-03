<?php
/**
 * LikeCoin Error Handler Class
 *
 * Handles error messages and admin notices
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
 * LikeCoin Error Handler Class
 *
 * @since 4.0.0
 */
class LikeCoin_Error {

	/**
	 * Set error message into transient based on current user ID
	 *
	 * @since 4.0.0
	 * @param string $message Error message.
	 * @param string $type    Type of error.
	 * @return void
	 */
	public static function set_admin_errors( $message, $type = 'general' ) {
		$error   = array(
			'message' => $message,
			'type'    => $type,
		);
		$user_id = get_current_user_id();
		set_transient( "likecoin_errors_{$user_id}", $error, 10 );
	}

	/**
	 * Get error message in transient based on current user ID
	 *
	 * @since 4.0.0
	 * @return array|false Error data or false if no error.
	 */
	public static function get_admin_errors() {
		$user_id = get_current_user_id();
		$error   = get_transient( "likecoin_errors_{$user_id}" );
		return $error;
	}

	/**
	 * Clear error message in transient based on current user ID
	 *
	 * @since 4.0.0
	 * @return void
	 */
	public static function clear_admin_errors() {
		$user_id = get_current_user_id();
		delete_transient( "likecoin_errors_{$user_id}" );
	}

	/**
	 * Render admin notice for error message in transient based on current user ID
	 *
	 * @since 4.0.0
	 * @return void
	 */
	public static function show_admin_errors() {
		$user_id = get_current_user_id();
		$error   = get_transient( "likecoin_errors_{$user_id}" );
		if ( $error ) {
			if ( 'publish' === $error['type'] ) {
				// phpcs:disable WordPress.WP.I18n.NonSingularStringLiteralDomain
				$title = __( 'Web3Press Error', LC_PLUGIN_SLUG );
				// phpcs:enable WordPress.WP.I18n.NonSingularStringLiteralDomain
				$option_page = LC_PUBLISH_SITE_OPTIONS_PAGE;
			} else {
				// phpcs:disable WordPress.WP.I18n.NonSingularStringLiteralDomain
				$title = __( 'Web3Press Error:', LC_PLUGIN_SLUG );
				// phpcs:enable WordPress.WP.I18n.NonSingularStringLiteralDomain
				$option_page = LC_BUTTON_SITE_OPTIONS_PAGE;
			}
			?>
			<div class="notice notice-error">
				<p><?php echo esc_html( $title ); ?></p>
				<p><?php echo esc_html( $error['message'] ); ?></p>
				<a href="<?php echo esc_url( admin_url( 'options-general.php?page=likecoin#/' . $option_page ) ); ?>">
				<?php
				// phpcs:disable WordPress.WP.I18n.NonSingularStringLiteralDomain
				esc_html_e( 'Go to settings', LC_PLUGIN_SLUG );
				// phpcs:enable WordPress.WP.I18n.NonSingularStringLiteralDomain
				?>
				</a>
			</div>
			<?php
			// Do not delete since Gutenberg fetch edit post once before restful.
		}
	}
}