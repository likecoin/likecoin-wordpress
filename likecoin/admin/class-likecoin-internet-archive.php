<?php
/**
 * LikeCoin Internet Archive Class
 *
 * Handles Internet Archive integration functionality
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
 * LikeCoin Internet Archive Class
 *
 * @since 3.3.0
 */
class LikeCoin_Internet_Archive {

	/**
	 * Send a post URL to Internet Archive for archiving
	 *
	 * @since 3.3.0
	 * @param int     $post_id Post id to be saved to IA.
	 * @param WP_Post $post    Post object to be saved to IA.
	 * @return void
	 */
	public static function post_to_internet_archive( $post_id, $post ) {
		$post_type   = get_post_type( $post );
		$post_status = get_post_status( $post );
		if ( ! ( is_post_type_viewable( $post_type ) && 'publish' === $post_status ) ) {
			return;
		}

		$url     = get_permalink( $post );
		$option  = get_option( LC_PUBLISH_OPTION_NAME );
		$key     = isset( $option[ LC_OPTION_IA_ACCESS_KEY ] ) ? $option[ LC_OPTION_IA_ACCESS_KEY ] : '';
		$secret  = isset( $option[ LC_OPTION_IA_SECRET ] ) ? $option[ LC_OPTION_IA_SECRET ] : '';
		$headers = array(
			'Content-Type'  => 'application/x-www-form-urlencoded',
			'Accept'        => 'application/json',
			'Authorization' => 'LOW ' . $key . ':' . $secret,
		);
		wp_remote_post(
			'https://web.archive.org/save',
			array(
				'blocking'   => WP_DEBUG === true,
				'user-agent' => 'LikeCoin WordPress Plugin ' . LC_PLUGIN_VERSION,
				'headers'    => $headers,
				'body'       => array(
					'url'                => $url,
					'skip_first_archive' => '1',
				),
			)
		);
	}

	/**
	 * Check whether Internet Archive publish options are enabled
	 *
	 * @since 3.3.0
	 * @return bool True if Internet Archive integration is enabled and configured.
	 */
	public static function should_hook_internet_archive_publish() {
		$option = get_option( LC_PUBLISH_OPTION_NAME );
		return isset( $option[ LC_OPTION_IA_ENABLED ] ) && $option[ LC_OPTION_IA_ENABLED ] &&
		isset( $option[ LC_OPTION_IA_ACCESS_KEY ] ) && $option[ LC_OPTION_IA_ACCESS_KEY ] &&
		isset( $option[ LC_OPTION_IA_SECRET ] ) && $option[ LC_OPTION_IA_SECRET ];
	}

	/**
	 * Setup Internet Archive related post hooks according to configuration
	 *
	 * @since 3.3.0
	 * @return void
	 */
	public static function add_internet_archive_hook() {
		if ( self::should_hook_internet_archive_publish() ) {
			add_action( 'publish_post', array( __CLASS__, 'post_to_internet_archive' ), 10, 2 );
		}
	}
}
