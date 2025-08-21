<?php
/**
 * LikeCoin enable react handler
 *
 * Get Likecoin admin react files
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
 * Inclue required files.
 */
require_once __DIR__ . '/../../includes/constant/options.php';


/**
 * Set up Admin Page menus on the left side bar.
 */
function likecoin_display_admin_pages() {
	global $likecoin_admin_main_page;
	$likecoin_admin_main_page = add_menu_page(
		__( 'Web3Press', 'likecoin' ),
		__( 'Web3Press', 'likecoin' ),
		'edit_posts',
		'likecoin',
		'likecoin_show_likecoin_admin_main_page_content',
		// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped,WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents,WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
		'data:image/svg+xml;base64,' . base64_encode( file_get_contents( LC_DIR . 'assets/icon/star.svg' ) ),
		// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped,WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents,WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
		50
	);
	add_action( 'load-' . $likecoin_admin_main_page, 'likecoin_load_admin_js' );

	global $likecoin_admin_plugin_page;
	$likecoin_admin_plugin_page = add_submenu_page(
		'likecoin',
		__( 'Web3Press', 'likecoin' ),
		__( 'Plugin Setting', 'likecoin' ),
		'edit_posts',
		'likecoin',
		'likecoin_show_likecoin_admin_main_page_content'
	);
	add_action( 'load-' . $likecoin_admin_plugin_page, 'likecoin_load_menu_admin_js' );

	global $likecoin_button_page;
	$likecoin_button_page = add_submenu_page(
		'likecoin',
		__( 'Web3Press', 'likecoin' ),
		__( 'Liker ID', 'likecoin' ),
		'edit_posts',
		'likecoin_liker_id',
		'likecoin_show_likecoin_admin_main_page_content'
	);
	add_action( 'load-' . $likecoin_button_page, 'likecoin_load_menu_admin_js' );

	global $likecoin_help_page;
	$likecoin_help_page = add_submenu_page(
		'likecoin',
		__( 'Web3Press', 'likecoin' ),
		__( 'Getting Started', 'likecoin' ),
		'edit_posts',
		'likecoin_help',
		'likecoin_show_likecoin_admin_main_page_content'
	);
	add_action( 'load-' . $likecoin_help_page, 'likecoin_load_menu_admin_js' );
}
/**
 * Show default UI for admin main page.
 */
function likecoin_show_likecoin_admin_main_page_content() {
	?> 
	<div id="likecoin-admin-settings"></div>
	<?php
}

/**
 * Load JavaScript files from React and menu hashtag hack.
 */
function likecoin_load_menu_admin_js() {
	likecoin_load_admin_js();
	wp_enqueue_script(
		'likecoin-admin-menu',
		LC_URI . 'assets/js/admin-menu/index.js',
		array(),
		LC_PLUGIN_VERSION,
		true
	);
}

/**
 * Allow php to load JavaScript files from React.
 */
function likecoin_load_admin_js() {
	add_action( 'admin_enqueue_scripts', 'likecoin_enqueue_admin_js', 13 );
}
/**
 * Load JavaScript files coming from React.
 *
 * @param string| $file_string Part of the React-created JavaScript & css file name.
 */
function likecoin_get_js_files( $file_string ) {
		return pathinfo( $file_string, PATHINFO_EXTENSION ) === 'js';
}
/**
 * Load css files coming from React.
 *
 * @param string| $file_string Part of the React-created JavaScript & css file name.
 */
function likecoin_get_css_files( $file_string ) {
	return pathinfo( $file_string, PATHINFO_EXTENSION ) === 'css';
}
/**
 * Define how to load JavaScript files coming from React.
 */
function likecoin_enqueue_admin_js() {
	$asset_file = include plugin_dir_path( __FILE__ ) . '/../../assets/js/admin-settings/index.asset.php';
	wp_enqueue_style(
		'likecoin-admin-settings',
		LC_URI . 'assets/js/admin-settings/index.css',
		array(),
		$asset_file['version']
	);
	wp_enqueue_script(
		'likecoin-admin-settings',
		LC_URI . 'assets/js/admin-settings/index.js',
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);
	// create a window.likecoinReactAppData which can be accessed by JavaScript.
	wp_localize_script(
		'likecoin-admin-settings',
		'likecoinReactAppData',
		array(
			'appSelector'   => '#likecoin-admin-settings',
			'likecoHost'    => LC_LIKE_CO_HOST,
			'likerlandHost' => LC_LIKER_LAND_HOST,
		)
	);
}

/**
 * Show welcome message on plugin activate.
 */
function likecoin_show_admin_welcome() {
	$is_welcome = get_transient( 'likecoin_welcome_notice' );
	if ( $is_welcome ) {
		?>
		<div class="notice notice-success">
			<p><?php echo esc_html( __( 'Welcome to Web3Press!', LC_PLUGIN_SLUG ) . ' ' . __( 'To receive our latest feature updates, ', LC_PLUGIN_SLUG ) ); ?>
				<a taget="_blank" rel="noopener" href="<?php echo esc_url( 'https://newsletter.like.co/' ); ?> ">
				<?php esc_html_e( 'Click here to subscribe to our newsletter.', LC_PLUGIN_SLUG ); ?>
				</a>
			</p>
		</div>
		<?php
		delete_transient( 'likecoin_welcome_notice' );
	}
}

