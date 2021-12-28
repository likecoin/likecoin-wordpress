<?php
/**
 * LikeCoin error message/admin notice
 *
 * Getter/Setter and admin notice render function
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
 * Set error message into transient base on current user id
 *
 * @param string| $message Error message.
 * @param string| $type Type of error.
 */
function likecoin_set_admin_errors( $message, $type = 'general' ) {
	$error   = array(
		'message' => $message,
		'type'    => $type,
	);
	$user_id = get_current_user_id();
	set_transient( "likecoin_errors_{$user_id}", $error, 10 );
}

/**
 * Get error message in transient base on current user id
 */
function likecoin_get_admin_errors() {
	$user_id = get_current_user_id();
	$error   = get_transient( "likecoin_errors_{$user_id}" );
	return $error;
}

/**
 * Clear error message in transient base on current user id
 */
function likecoin_clear_admin_errors() {
	$user_id = get_current_user_id();
	delete_transient( "likecoin_errors_{$user_id}" );
}

/**
 * Render admin notice for error message in transient base on current user id
 */
function likecoin_show_admin_errors() {
	$user_id = get_current_user_id();
	$error   = get_transient( "likecoin_errors_{$user_id}" );
	if ( $error ) {
		if ( 'publish' === $error['type'] ) {
			$title       = __( 'LikeCoin publish Error', LC_PLUGIN_SLUG );
			$option_page = LC_PUBLISH_SITE_OPTIONS_PAGE;
		} else {
			$title       = __( 'LikeCoin plugin Error:', LC_PLUGIN_SLUG );
			$option_page = LC_BUTTON_SITE_OPTIONS_PAGE;
		}
		?>
		<div class="notice notice-error">
			<p><?php echo esc_html( $title ); ?></p>
			<p><?php echo esc_html( $error['message'] ); ?></p>
			<a href="
			<?php echo esc_url( admin_url( 'options-general.php?page=likecoin#/' . $option_page ) ); ?> "><?php esc_html_e( 'Go to settings', LC_PLUGIN_SLUG ); ?></a>
		</div>
		<?php
		// do not delete since Gutenberg fetch edit post once before restful.
	}
}
