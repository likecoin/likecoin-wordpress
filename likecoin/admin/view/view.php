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

/**
 * Inclue required files.
 */
require_once dirname( __FILE__ ) . '/../../includes/constant/options.php';

/**
 * Get translation scripts
 */
function likecoin_set_script_translations() {
	wp_set_script_translations( 'react-plugin-0', 'likecoin' );
}

/**
 * Set up Admin Page menus on the left side bar.
 */
function likecoin_display_admin_pages() {
	global $likecoin_admin_main_page;
	$likecoin_admin_main_page = add_menu_page(
		__( 'LikeCoin', 'likecoin' ),
		__( 'LikeCoin', 'likecoin' ),
		'edit_posts',
		'likecoin',
		'likecoin_show_likecoin_admin_main_page_content',
		// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped,WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents,WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
		'data:image/svg+xml;base64,' . base64_encode( file_get_contents( LC_DIR . 'assets/icon/likecoin.svg' ) ),
		// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped,WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents,WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
		50
	);
	add_action( 'load-' . $likecoin_admin_main_page, 'likecoin_load_admin_js' );

	global $likecoin_plugin_main_page;
	$likecoin_admin_plugin_page = add_submenu_page(
		'likecoin',
		__( 'LikeCoin', 'likecoin' ),
		__( 'Plugin Setting', 'likecoin' ),
		'edit_posts',
		'likecoin',
		'likecoin_load_admin_js'
	);
	add_action( 'load-' . $likecoin_plugin_main_page, 'likecoin_load_admin_js' );

	global $likecoin_button_page;
	$likecoin_button_page = add_submenu_page(
		'likecoin',
		__( 'LikeCoin', 'likecoin' ),
		__( 'Liker ID', 'likecoin' ),
		'edit_posts',
		'/likecoin#/button',
		'likecoin_load_admin_js'
	);
	add_action( 'load-' . $likecoin_button_page, 'likecoin_load_admin_js' );

	global $likecoin_help_page;
	$likecoin_help_page = add_submenu_page(
		'likecoin',
		__( 'LikeCoin', 'likecoin' ),
		__( 'Getting Started', 'likecoin' ),
		'edit_posts',
		'/likecoin#/help',
		'likecoin_load_admin_js'
	);
	add_action( 'load-' . $likecoin_help_page, 'likecoin_load_admin_js' );
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
 * Allow php to load JavaScript files from React.
 */
function likecoin_load_admin_js() {
	add_action( 'admin_enqueue_scripts', 'likecoin_enqueue_admin_js', 13 );
	add_action( 'admin_enqueue_scripts', 'likecoin_set_script_translations', 13 );
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
