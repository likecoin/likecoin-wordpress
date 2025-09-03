<?php
/**
 * LikeCoin Admin View Class
 *
 * Handles admin page display and JavaScript loading
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
 * LikeCoin Admin View Class
 *
 * @since 4.0.0
 */
class LikeCoin_Admin_View {

	/**
	 * Set up Admin Page menus on the left sidebar
	 *
	 * @since 4.0.0
	 * @return void
	 */
	public static function display_admin_pages() {
		global $likecoin_admin_main_page;
		// phpcs:disable WordPress.WP.I18n.NonSingularStringLiteralDomain
		$likecoin_admin_main_page = add_menu_page(
			__( 'Web3Press', 'likecoin' ),
			__( 'Web3Press', 'likecoin' ),
			'edit_posts',
			'likecoin',
			array( __CLASS__, 'show_admin_main_page_content' ),
			// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped,WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents,WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
			'data:image/svg+xml;base64,' . base64_encode( file_get_contents( LC_DIR . 'assets/icon/star.svg' ) ),
			// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped,WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents,WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
			50
		);
		add_action( 'load-' . $likecoin_admin_main_page, array( __CLASS__, 'load_admin_js' ) );

		global $likecoin_admin_plugin_page;
		$likecoin_admin_plugin_page = add_submenu_page(
			'likecoin',
			__( 'Web3Press', 'likecoin' ),
			__( 'Plugin Setting', 'likecoin' ),
			'edit_posts',
			'likecoin',
			array( __CLASS__, 'show_admin_main_page_content' )
		);
		add_action( 'load-' . $likecoin_admin_plugin_page, array( __CLASS__, 'load_menu_admin_js' ) );

		global $likecoin_button_page;
		$likecoin_button_page = add_submenu_page(
			'likecoin',
			__( 'Web3Press', 'likecoin' ),
			__( 'Liker ID', 'likecoin' ),
			'edit_posts',
			'likecoin_liker_id',
			array( __CLASS__, 'show_admin_main_page_content' )
		);
		add_action( 'load-' . $likecoin_button_page, array( __CLASS__, 'load_menu_admin_js' ) );

		global $likecoin_help_page;
		$likecoin_help_page = add_submenu_page(
			'likecoin',
			__( 'Web3Press', 'likecoin' ),
			__( 'Getting Started', 'likecoin' ),
			'edit_posts',
			'likecoin_help',
			array( __CLASS__, 'show_admin_main_page_content' )
		);
		add_action( 'load-' . $likecoin_help_page, array( __CLASS__, 'load_menu_admin_js' ) );
		// phpcs:enable WordPress.WP.I18n.NonSingularStringLiteralDomain
	}

	/**
	 * Show default UI for admin main page
	 *
	 * @since 4.0.0
	 * @return void
	 */
	public static function show_admin_main_page_content() {
		?>
		<div id="likecoin-admin-settings"></div>
		<?php
	}

	/**
	 * Load JavaScript files from React and menu hashtag hack
	 *
	 * @since 4.0.0
	 * @return void
	 */
	public static function load_menu_admin_js() {
		self::load_admin_js();
		wp_enqueue_script(
			'likecoin-admin-menu',
			LC_URI . 'assets/js/admin-menu/index.js',
			array(),
			LC_PLUGIN_VERSION,
			true
		);
	}

	/**
	 * Load JavaScript files from React
	 *
	 * @since 4.0.0
	 * @return void
	 */
	public static function load_admin_js() {
		$asset_file = LC_DIR . 'assets/js/admin-settings/index.asset.php';
		$asset      = file_exists( $asset_file ) ? require $asset_file : array(
			'dependencies' => array( 'lodash', 'react', 'react-dom', 'wp-api-fetch', 'wp-data', 'wp-element', 'wp-i18n' ),
			'version'      => LC_PLUGIN_VERSION,
		);

		wp_enqueue_script(
			'likecoin-admin-js',
			LC_URI . 'assets/js/admin-settings/index.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		wp_enqueue_style(
			'likecoin-admin-css',
			LC_URI . 'assets/js/admin-settings/index.css',
			array( 'wp-components' ),
			$asset['version']
		);

		wp_set_script_translations( 'likecoin-admin-js', 'likecoin' );
		self::enqueue_admin_js();
	}


	/**
	 * Enqueue admin JavaScript with localized data
	 *
	 * @since 4.0.0
	 * @return void
	 */
	public static function enqueue_admin_js() {
		wp_localize_script(
			'likecoin-admin-js',
			'likecoinReactAppData',
			array(
				'appSelector'   => '#likecoin-admin-settings',
				'likecoHost'    => LC_LIKE_CO_HOST,
				'likerlandHost' => LC_LIKER_LAND_HOST,
			)
		);
	}

	/**
	 * Show admin welcome notice
	 *
	 * @since 4.0.0
	 * @return void
	 */
	public static function show_admin_welcome() {
		if ( get_transient( 'likecoin_welcome_notice' ) ) {
			delete_transient( 'likecoin_welcome_notice' );
			?>
			<div class="notice notice-success is-dismissible">
				<p>
					<?php
					// phpcs:disable WordPress.WP.I18n.NonSingularStringLiteralDomain
					printf(
						/* translators: %s is the plugin settings URL */
						esc_html__( 'Welcome to Web3Press! Please %s to get started.', 'likecoin' ),
						sprintf(
							'<a href="%s">%s</a>',
							esc_url( admin_url( 'admin.php?page=likecoin#/help' ) ),
							esc_html__( 'visit the plugin settings', 'likecoin' )
						)
					);
					// phpcs:enable WordPress.WP.I18n.NonSingularStringLiteralDomain
					?>
				</p>
			</div>
			<?php
		}
	}
}