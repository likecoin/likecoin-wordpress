<?php
/**
 * LikeCoin Plugin Loader
 *
 * Handles plugin initialization and core functionality
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
 * Main LikeCoin plugin loader class
 *
 * @since 4.0.0
 */
final class LikeCoin_Loader {

	/**
	 * Plugin instance
	 *
	 * @since 4.0.0
	 * @var LikeCoin_Loader
	 */
	private static $instance;

	/**
	 * Plugin version
	 *
	 * @since 4.0.0
	 * @var string
	 */
	private $version;

	/**
	 * Plugin directory path
	 *
	 * @since 4.0.0
	 * @var string
	 */
	private $plugin_path;

	/**
	 * Plugin directory URL
	 *
	 * @since 4.0.0
	 * @var string
	 */
	private $plugin_url;

	/**
	 * Constructor
	 *
	 * @since 4.0.0
	 */
	private function __construct() {
		$this->version     = LC_PLUGIN_VERSION;
		$this->plugin_path = LC_DIR;
		$this->plugin_url  = LC_URI;
	}

	/**
	 * Get plugin instance
	 *
	 * @since 4.0.0
	 * @return LikeCoin_Loader
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Initialize the plugin
	 *
	 * @since 4.0.0
	 * @return void
	 */
	public function init() {
		$this->load_dependencies();
		$this->define_admin_hooks();
		$this->define_public_hooks();
		$this->define_activation_hooks();
	}

	/**
	 * Load plugin dependencies
	 *
	 * @since 4.0.0
	 * @return void
	 */
	private function load_dependencies() {
		// Load core constants and utilities that are needed everywhere.
		require_once $this->plugin_path . 'includes/constant/options.php';
		require_once $this->plugin_path . 'includes/class-likecoin-utils.php';
		require_once $this->plugin_path . 'public/class-likecoin-public-utils.php';
		require_once $this->plugin_path . 'public/class-likecoin-button.php';
		require_once $this->plugin_path . 'includes/class-likecoin-public.php';
		require_once $this->plugin_path . 'blocks/class-likecoin-blocks.php';

		// Load classes that are needed for hooks initialization.
		require_once $this->plugin_path . 'admin/class-likecoin-internet-archive.php';

		// Load classes needed by REST API.
		require_once $this->plugin_path . 'admin/class-likecoin-post.php';
		require_once $this->plugin_path . 'admin/class-likecoin-admin-utils.php';

		// Load REST API classes - needed for both admin and frontend REST requests.
		require_once $this->plugin_path . 'admin/class-likecoin-restful-view.php';
		require_once $this->plugin_path . 'admin/class-likecoin-restful.php';
	}

	/**
	 * Load admin-specific dependencies
	 *
	 * @since 4.0.0
	 * @return void
	 */
	private function load_admin_dependencies() {
		require_once $this->plugin_path . 'admin/class-likecoin-error.php';
		require_once $this->plugin_path . 'admin/class-likecoin-ajax.php';
		require_once $this->plugin_path . 'admin/class-likecoin-admin-view.php';
		require_once $this->plugin_path . 'admin/class-likecoin-admin.php';
	}

	/**
	 * Define admin hooks
	 *
	 * @since 4.0.0
	 * @return void
	 */
	private function define_admin_hooks() {
		if ( is_admin() ) {
			$this->load_admin_dependencies();
			$admin = new LikeCoin_Admin( $this->get_plugin_basename() );
			$admin->init();
		}
	}

	/**
	 * Define public hooks
	 *
	 * @since 4.0.0
	 * @return void
	 */
	private function define_public_hooks() {
		$public = new LikeCoin_Public();
		$public->init();

		// Initialize hooks that work in both admin and public contexts.
		LikeCoin_Internet_Archive::add_internet_archive_hook();
		LikeCoin_Restful::hook_restful_hook();
	}

	/**
	 * Define activation hooks
	 *
	 * @since 4.0.0
	 * @return void
	 */
	private function define_activation_hooks() {
		register_activation_hook( $this->get_plugin_file(), array( $this, 'handle_activation' ) );
		register_uninstall_hook( $this->get_plugin_file(), array( __CLASS__, 'handle_uninstall' ) );
		add_action( 'upgrader_process_complete', array( $this, 'handle_upgrade' ) );
		add_action( 'init', array( $this, 'handle_init' ) );
		add_action( 'init', array( 'LikeCoin_Blocks', 'init' ) );
		add_action( 'plugins_loaded', array( $this, 'load_textdomain' ) );
		add_action( 'activated_plugin', array( $this, 'handle_activated' ) );
	}

	/**
	 * Handle plugin activation
	 *
	 * @since 4.0.0
	 * @return void
	 */
	public function handle_activation() {
		$this->handle_init_and_upgrade();
	}

	/**
	 * Handle plugin upgrade
	 *
	 * @since 4.0.0
	 * @return void
	 */
	public function handle_upgrade() {
		$this->handle_init_and_upgrade();
	}

	/**
	 * Handle plugin initialization
	 *
	 * @since 4.0.0
	 * @return void
	 */
	public function handle_init() {
		$this->handle_init_and_upgrade();
	}

	/**
	 * Handle plugin initialization and upgrade logic
	 *
	 * @since 4.0.0
	 * @return void
	 */
	public function handle_init_and_upgrade() {
		global $wpdb;
		global $charset_collate;
		$version = get_option( 'likecoin_plugin_version', LC_PLUGIN_VERSION );

		// Init button display option to 'post'.
		$button_option = get_option( LC_BUTTON_OPTION_NAME, array() );
		if ( ! isset( $button_option[ LC_OPTION_BUTTON_DISPLAY_OPTION ] ) ) {
			$button_option[ LC_OPTION_BUTTON_DISPLAY_OPTION ] = 'post';
			update_option( LC_BUTTON_OPTION_NAME, $button_option );
		}

		if ( version_compare( $version, '1.1' ) < 0 ) {
			delete_metadata( 'user', 0, 'lc_widget_option', '', true );
			delete_metadata( 'user', 0, 'lc_widget_position', '', true );
		}

		if ( version_compare( $version, LC_PLUGIN_VERSION ) < 0 ) {
			update_option( 'likecoin_plugin_version', LC_PLUGIN_VERSION );
		}
	}

	/**
	 * Handle plugin activation redirect
	 *
	 * @since 4.0.0
	 * @param string $plugin Plugin path being activated.
	 * @return void
	 */
	public function handle_activated( $plugin ) {
		if ( $this->get_plugin_basename() === $plugin ) {
			set_transient( 'likecoin_welcome_notice', 1, 10 );
			wp_safe_redirect( esc_url( admin_url( 'admin.php?page=likecoin_help#/help' ) ) );
			exit();
		}
	}

	/**
	 * Handle plugin uninstall
	 *
	 * @since 4.0.0
	 * @return void
	 */
	public static function handle_uninstall() {
		// Clean up all user metadata.
		delete_metadata( 'user', 0, 'lc_likecoin_id', '', true );
		delete_metadata( 'user', 0, 'lc_likecoin_wallet', '', true );
		delete_metadata( 'user', 0, 'lc_likecoin_user', '', true );
		delete_metadata( 'user', 0, 'lc_widget_option', '', true );
		delete_metadata( 'user', 0, 'lc_widget_position', '', true );

		// Clean up all post metadata.
		delete_metadata( 'post', 0, 'lc_widget_option', '', true );
		delete_metadata( 'post', 0, 'lc_widget_position', '', true );

		// Clean up all options.
		delete_option( LC_BUTTON_OPTION_NAME );
		delete_option( LC_PUBLISH_OPTION_NAME );
		delete_option( LC_MONETIZATION_OPTION_NAME );
		delete_option( 'likecoin_plugin_version' );
	}

	/**
	 * Load plugin text domain
	 *
	 * @since 4.0.0
	 * @return void
	 */
	public function load_textdomain() {
		load_plugin_textdomain( LC_PLUGIN_SLUG, false, basename( $this->plugin_path ) . '/languages/' );
	}

	/**
	 * Get plugin basename
	 *
	 * @since 4.0.0
	 * @return string
	 */
	private function get_plugin_basename() {
		return plugin_basename( $this->get_plugin_file() );
	}

	/**
	 * Get plugin file path
	 *
	 * @since 4.0.0
	 * @return string
	 */
	private function get_plugin_file() {
		return $this->plugin_path . 'likecoin.php';
	}

	/**
	 * Get plugin version
	 *
	 * @since 4.0.0
	 * @return string
	 */
	public function get_version() {
		return $this->version;
	}

	/**
	 * Get plugin path
	 *
	 * @since 4.0.0
	 * @return string
	 */
	public function get_plugin_path() {
		return $this->plugin_path;
	}

	/**
	 * Get plugin URL
	 *
	 * @since 4.0.0
	 * @return string
	 */
	public function get_plugin_url() {
		return $this->plugin_url;
	}
}
