<?php
/**
 * LikeCoin public index
 *
 * Index of the public facing side of LikeCoin plugin
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
 * Require public files
 */
require_once __DIR__ . '/likecoin-button.php';
require_once __DIR__ . '/web-monetization.php';
require_once __DIR__ . '/iscn-badge.php';

/**
 * Add Likecoin Content Filter
 *
 * @param string| $content The original post content.
 */
function likecoin_content_filter( $content ) {
	global $post;

	if ( ! isset( $post ) ) {
		return $content;
	}

	if ( is_singular() && in_the_loop() && is_main_query() ) {
		if ( ! empty( $post->post_password ) ) {
			return $content;
		}
		$content = $content . likecoin_add_likebutton() . likecoin_add_iscn_badge( $post );
	}
	return $content;
}

/**
 * Extend http request waiting time
 */
function likecoin_timeout_extend() {
	return 100; // default is 5.
}
/**
 * Run all public related WordPress hook
 */
function likecoin_add_public_hooks() {
	add_filter( 'the_content', 'likecoin_content_filter' );
	add_action( 'wp_head', 'likecoin_add_web_monetization_header' );
	add_action( 'wp_head', 'likecoin_add_likecoin_meta_header' );
	add_shortcode( 'likecoin', 'likecoin_likecoin_shortcode' );
	add_filter( 'http_request_timeout', 'likecoin_timeout_extend' );
}
