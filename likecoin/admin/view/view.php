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
		__( 'Your LikeCoin Button', 'likecoin' ),
		'edit_posts',
		'/likecoin#/likecoin-button',
		'likecoin_load_admin_js'
	);
	add_action( 'load-' . $likecoin_button_page, 'likecoin_load_admin_js' );

	global $publish_setting_page;
	$publish_setting_page = add_submenu_page(
		'likecoin',
		__( 'LikeCoin', 'likecoin' ),
		__( 'Publish Setting', 'likecoin' ),
		'manage_options',
		'/likecoin#/publish-setting',
		'likecoin_load_admin_js'
	);
	add_action( 'load-' . $publish_setting_page, 'likecoin_load_admin_js' );

	global $web_monetization_page;
	$web_monetization_page = add_submenu_page(
		'likecoin',
		__( 'LikeCoin', 'likecoin' ),
		__( 'Other Settings', 'likecoin' ),
		'manage_options',
		'/likecoin#/other',
		'likecoin_load_admin_js'
	);
	add_action( 'load-' . $web_monetization_page, 'likecoin_load_admin_js' );

	global $sponsor_likecoin_page;
	$sponsor_likecoin_page = add_submenu_page(
		'likecoin',
		__( 'LikeCoin', 'likecoin' ),
		__( 'Sponsor Likecoin', 'likecoin' ),
		'edit_posts',
		'/likecoin#/sponsor-likecoin',
		'likecoin_load_admin_js'
	);
	add_action( 'load-' . $sponsor_likecoin_page, 'likecoin_load_admin_js' );

	global $become_civic_liker_page;
	$become_civic_liker_page = add_submenu_page(
		'likecoin',
		__( 'LikeCoin', 'likecoin' ),
		__( 'Become a Civic Liker', 'likecoin' ),
		'edit_posts',
		'https://liker.land/civic?utm_source=wp-plugin'
	);
}
/**
 * Show default UI for admin main page.
 */
function likecoin_show_likecoin_admin_main_page_content() {
	?> 
	<p>Default admin page.</p>
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
	$react_app_build_url = LC_URI . 'assets/js/admin-settings/';
	$manifest_path       = LC_DIR . 'assets/js/admin-settings/asset-manifest.json';
	// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped,WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	$request = file_get_contents( $manifest_path );
	// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped,WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents

	if ( ! $request ) {
		return false;
	}
	$files_data = json_decode( $request );
	if ( null === $files_data ) {
		return;
	}
	if ( ! property_exists( $files_data, 'entrypoints' ) ) {
		return false;
	}
	$assets_files = $files_data->entrypoints;

	$js_files  = array_filter( $assets_files, 'likecoin_get_js_files' );
	$css_files = array_filter( $assets_files, 'likecoin_get_css_files' );
	foreach ( $css_files as $index => $css_file ) {
		wp_enqueue_style( 'likecoin-admin-settings-' . $index, $react_app_build_url . $css_file, array(), LC_PLUGIN_VERSION );
	}
	foreach ( $js_files as $index => $js_file ) {
		// add wp-api-request as dependency so React can access window.wpApiSettings.
		wp_enqueue_script( 'likecoin-admin-settings-' . $index, $react_app_build_url . $js_file, array( 'wp-api-request', 'wp-i18n' ), LC_PLUGIN_VERSION, true );
	}
	// create a window.likecoinReactAppData which can be accessed by JavaScript.
	wp_localize_script(
		'likecoin-admin-settings-1',
		'likecoinReactAppData',
		array(
			'appSelector'   => '#wpbody #wpbody-content',
			'likecoHost'    => LC_LIKE_CO_HOST,
			'likerlandHost' => LC_LIKER_LAND_HOST,
		)
	);
}
