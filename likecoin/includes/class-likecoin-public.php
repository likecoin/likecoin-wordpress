<?php
/**
 * LikeCoin Public Class
 *
 * Handles public-facing functionality for the LikeCoin plugin
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
 * LikeCoin Public Class
 *
 * @since 3.3.0
 */
class LikeCoin_Public {

	/**
	 * Constructor
	 *
	 * @since 3.3.0
	 */
	public function __construct() {
		$this->load_dependencies();
	}

	/**
	 * Initialize public functionality
	 *
	 * @since 3.3.0
	 * @return void
	 */
	public function init() {
		$this->define_hooks();
	}

	/**
	 * Load public dependencies
	 *
	 * @since 3.3.0
	 * @return void
	 */
	private function load_dependencies() {
		require_once LC_DIR . 'public/class-likecoin-button.php';
		require_once LC_DIR . 'public/class-likecoin-public-utils.php';
	}

	/**
	 * Define public hooks
	 *
	 * @since 3.3.0
	 * @return void
	 */
	private function define_hooks() {
		add_filter( 'the_content', array( $this, 'content_filter' ) );
		add_action( 'wp_head', array( 'LikeCoin_Public_Utils', 'add_web_monetization_header' ) );
		add_action( 'wp_head', array( 'LikeCoin_Button', 'add_likecoin_meta_header' ) );
		add_shortcode( 'likecoin', array( 'LikeCoin_Button', 'likecoin_shortcode' ) );
		add_filter( 'http_request_timeout', array( $this, 'extend_timeout' ) );
	}

	/**
	 * Add LikeCoin Content Filter
	 *
	 * @since 3.3.0
	 * @param string $content The original post content.
	 * @return string
	 */
	public function content_filter( $content ) {
		global $post;

		if ( ! isset( $post ) ) {
			return $content;
		}

		if ( is_singular() && in_the_loop() && is_main_query() ) {
			if ( ! empty( $post->post_password ) ) {
				return $content;
			}
			$content = $content . LikeCoin_Button::add_likebutton() . LikeCoin_Public_Utils::add_iscn_badge( $post );
		}
		return $content;
	}

	/**
	 * Extend HTTP request waiting time
	 *
	 * @since 3.3.0
	 * @return int
	 */
	public function extend_timeout() {
		return 100; // Default is 5.
	}
}
