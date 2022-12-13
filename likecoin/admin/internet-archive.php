<?php
/**
 * LikeCoin Internet Archive functions
 *
 * Functions for calling Internet Archive API on publish
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
 * Send a post URL to IA for archive
 *
 * @param int|     $post_id Post id to be saved to matters.
 * @param WP_Post| $post Post object to be saved to matters.
 */
function likecoin_post_to_internet_archive( $post_id, $post ) {

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
 * Returns a boolean whether publish options are enabled
 */
function likecoin_should_hook_internet_archive_publish() {
	$option = get_option( LC_PUBLISH_OPTION_NAME );
	return isset( $option[ LC_OPTION_IA_ENABLED ] ) && $option[ LC_OPTION_IA_ENABLED ] &&
	isset( $option[ LC_OPTION_IA_ACCESS_KEY ] ) && $option[ LC_OPTION_IA_ACCESS_KEY ] &&
	isset( $option[ LC_OPTION_IA_SECRET ] ) && $option[ LC_OPTION_IA_SECRET ];
}

/**
 * Setup IA related post hooks according to config
 */
function likecoin_add_internet_archive_hook() {
	if ( likecoin_should_hook_internet_archive_publish() ) {
		add_action( 'publish_post', 'likecoin_post_to_internet_archive', 10, 2 );
	}
}
