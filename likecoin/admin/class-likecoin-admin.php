<?php
/**
 * LikeCoin Admin Class
 *
 * Handles admin functionality for the LikeCoin plugin
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
 * LikeCoin Admin Class
 *
 * @since 4.0.0
 */
class LikeCoin_Admin {

	/**
	 * Plugin basename
	 *
	 * @since 4.0.0
	 * @var string
	 */
	private $plugin_basename;

	/**
	 * Constructor
	 *
	 * @since 4.0.0
	 * @param string $plugin_basename The plugin basename.
	 */
	public function __construct( $plugin_basename ) {
		$this->plugin_basename = $plugin_basename;
		$this->load_dependencies();
	}

	/**
	 * Initialize admin functionality
	 *
	 * @since 4.0.0
	 * @return void
	 */
	public function init() {
		$this->define_hooks();
	}

	/**
	 * Load admin dependencies
	 *
	 * @since 4.0.0
	 * @return void
	 */
	private function load_dependencies() {
		require_once __DIR__ . '/class-likecoin-error.php';
		require_once __DIR__ . '/class-likecoin-ajax.php';
		require_once __DIR__ . '/class-likecoin-restful.php';
		require_once __DIR__ . '/class-likecoin-restful-view.php';
		require_once __DIR__ . '/class-likecoin-admin-view.php';
		require_once __DIR__ . '/class-likecoin-admin-utils.php';
		require_once __DIR__ . '/class-likecoin-post.php';
	}

	/**
	 * Define admin hooks
	 *
	 * @since 4.0.0
	 * @return void
	 */
	private function define_hooks() {
		add_action( 'admin_menu', array( 'LikeCoin_Admin_View', 'display_admin_pages' ) );
		add_action( 'admin_init', array( $this, 'admin_init' ) );
		add_filter( 'plugin_action_links_' . $this->plugin_basename, array( 'LikeCoin_Admin_Utils', 'modify_plugin_action_links' ) );
		add_action( 'save_post_post', array( 'LikeCoin_Post', 'save_postdata' ) );
		add_action( 'save_post_page', array( 'LikeCoin_Post', 'save_postdata' ) );
		add_action( 'enqueue_block_editor_assets', array( 'LikeCoin_Admin_Utils', 'load_editor_scripts' ) );
		add_action( 'admin_notices', array( 'LikeCoin_Error', 'show_admin_errors' ) );
		add_action( 'admin_notices', array( 'LikeCoin_Admin_View', 'show_admin_welcome' ) );
	}

	/**
	 * Run all functions for admin_init hook
	 *
	 * @since 4.0.0
	 * @return void
	 */
	public function admin_init() {
		$this->add_privacy_policy_content();
	}

	/**
	 * Add privacy policy to wp global privacy policy
	 *
	 * @since 4.0.0
	 * @return void
	 */
	private function add_privacy_policy_content() {
		if ( ! function_exists( 'wp_add_privacy_policy_content' ) ) {
			return;
		}
		// phpcs:disable WordPress.WP.I18n.NonSingularStringLiteralDomain
		$content = sprintf(
			/* translators: %s is the policy url, e.g. https://like.co/in/policies/privacy */
			__(
				'When you use the LikeCoin embed, we automatically collect basic visitor informations,
			e.g. IP address, user agent, etc. These kind of information might be used as analytics purpose.
			For the purpose of applying personal site preferences, We might also identify a registered 
			Liker ID owner by the use of cookie.
			More details can be found in like.co privacy policy <a href="%s" target="_blank">here</a>.',
				LC_PLUGIN_SLUG
			),
			'https://like.co/in/policies/privacy'
		);
		// phpcs:enable WordPress.WP.I18n.NonSingularStringLiteralDomain
		wp_add_privacy_policy_content(
			LC_PLUGIN_NAME,
			wp_kses_post( wpautop( $content, false ) )
		);
	}

	/**
	 * Check if it's block editor or not
	 *
	 * @since 4.0.0
	 * @return bool
	 */
	public static function is_block_editor() {
		if ( function_exists( 'get_current_screen' ) ) {
			$screen = get_current_screen();
			if ( $screen && $screen->is_block_editor() ) {
				return true;
			}
			if ( function_exists( 'is_gutenberg_page' ) ) {
				return is_gutenberg_page();
			}
		}
		return false;
	}
}
