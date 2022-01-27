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
 * Get translation scripts
 */
function likecoin_set_script_translations() {
	wp_set_script_translations( 'react-plugin-0', 'likecoin' );
}
/**
 * Post options data to WordPress database.
 *
 * @param WP_REST_Request $request Full data about the request.
 */
function likecoin_post_main_plugin_options( $request ) {
	$plugin_options          = get_option( LC_BUTTON_OPTION_NAME );
	$params                  = $request->get_json_params();
	$site_liker_id_enabled   = $params['siteLikerIdEnabled'];
	$display_option          = $params['displayOption'];
	$per_post_option_enabled = $params['perPostOptionEnabled'];
	$liker_infos             = $params['siteLikerInfos'];

	$plugin_options['site_likecoin_id_enbled']        = $site_liker_id_enabled;
	$plugin_options['button_display_option']          = $display_option;
	$plugin_options['button_display_author_override'] = $per_post_option_enabled;
	$plugin_options['site_likecoin_user']             = $liker_infos;

	update_option( LC_BUTTON_OPTION_NAME, $plugin_options );
	$plugin_options = get_option( LC_BUTTON_OPTION_NAME );

	$result['code']    = 200;
	$result['data']    = $plugin_options;
	$result['message'] = 'Successfully POST!';
	return rest_ensure_response( $result );
}
/**
 * Get options data from WordPress database.
 *
 * @param WP_REST_Request $request Full data about the request.
 */
function likecoin_get_main_plugin_options( $request ) {
	$plugin_options = get_option( LC_BUTTON_OPTION_NAME );
	if ( ! $plugin_options ) {
		return;
	}
	$result['code']    = 200;
	$result['data']    = $plugin_options;
	$result['message'] = 'Successfully GET main plugin setting data!';
	return rest_ensure_response( $result );
}
/**
 * Post user data to WordPress database.
 *
 * @param WP_REST_Request $request Full data about the request.
 */
function likecoin_post_user_data( $request ) {
	$user          = wp_get_current_user();
	$user_id       = $user->ID;
	$likecoin_user = get_user_meta( $user_id, 'lc_likecoin_user', true );
	$likecoin_id   = get_user_meta( $user_id, 'lc_likecoin_id', true );
	$params        = $request->get_json_params();
	$liker_infos   = $params['userLikerInfos'];
	$likecoin_user = $liker_infos;
	$likecoin_id   = $liker_infos['likecoin_id'];

	update_user_meta( $user_id, 'lc_likecoin_user', $likecoin_user );
	update_user_meta( $user_id, 'lc_likecoin_id', $likecoin_id );

	// retrieve latest data.
	$likecoin_user = get_user_meta( $user_id, 'lc_likecoin_user', true );
	$likecoin_id   = get_user_meta( $user_id, 'lc_likecoin_id', true );

	$result['code']                  = 200;
	$result['data']['likecoin_user'] = $likecoin_user;
	$result['data']['likecoin_id']   = $likecoin_id;
	$result['message']               = 'Successfully POST to likecoin user!';
	return rest_ensure_response( $result );
}
/**
 * Get user data from WordPress database.
 *
 * @param WP_REST_Request $request Full data about the request.
 */
function likecoin_get_user_data( $request ) {
	$user          = wp_get_current_user();
	$user_id       = $user->ID;
	$likecoin_user = get_user_meta( $user_id, 'lc_likecoin_user', true );
	if ( ! $likecoin_user ) {
		return;
	}
	$likecoin_id                     = get_user_meta( $user_id, 'lc_likecoin_id', true );
	$result['code']                  = 200;
	$result['data']['likecoin_user'] = $likecoin_user;
	$result['data']['likecoin_id']   = $likecoin_id;
	$result['message']               = 'Successfully GET user data!';
	return rest_ensure_response( $result );
}
/**
 * Post matters login data to WordPress database.
 *
 * @param WP_REST_Request $request Full data about the request.
 */
function likecoin_post_site_publish_options_data( $request ) {
	$publish_options = get_option( LC_PUBLISH_OPTION_NAME );
	$params          = $request->get_json_params();
	$publish_options['site_matters_auto_save_draft'] = $params['siteMattersAutoSaveDraft'];
	$publish_options['site_matters_auto_publish']    = $params['siteMattersAutoPublish'];
	$publish_options['site_matters_add_footer_link'] = $params['siteMattersAddFooterLink'];
	$publish_options['iscn_badge_style_option']      = $params['ISCNBadgeStyleOption'];
	update_option( LC_PUBLISH_OPTION_NAME, $publish_options );
	$publish_options   = get_option( LC_PUBLISH_OPTION_NAME );
	$result['code']    = 200;
	$result['data']    = $publish_options;
	$result['message'] = 'Successfully POST matters login data!';
	return rest_ensure_response( $result );
}
/**
 * Post matters login data to WordPress database.
 *
 * @param WP_REST_Request $request Full data about the request.
 */
function likecoin_login_to_matters( $request ) {
	$params               = $request->get_json_params();
	$matters_id           = $params['mattersId'];
	$matters_password     = $params['mattersPassword'];
	$api                  = LikeCoin_Matters_API::get_instance();
	$results              = $api->login( $matters_id, $matters_password );
	$matters_access_token = isset( $results['data']['userLogin']['token'] ) ? $results['data']['userLogin']['token'] : null;
	$user_info_results    = array();
	if ( isset( $matters_access_token ) ) {
		$user_info_results             = $api->query_user_info( $matters_access_token );
		$matters_info                  = array();
		$matters_info['matters_token'] = $matters_access_token;
		$matters_info['matters_id']    = $user_info_results['userName'];
		likecoin_save_site_matters_login_data( $matters_info );
		return rest_ensure_response( array_merge( $results['data'], array( 'viewer' => $user_info_results ) ) );
	} else {
		return rest_ensure_response( $results );
	}
}
/**
 * Log out from Matters
 *
 * @param WP_REST_Request $request Full data about the request.
 */
function likecoin_logout_matters( $request ) {
	likecoin_logout_matters_session();
	$result['code']    = 200;
	$result['message'] = 'Successfully logout from matters.';
	return rest_ensure_response( $result );
}
/**
 * Post matters login data to WordPress database.
 *
 * @param array | $matters_info valid matters login info.
 */
function likecoin_save_site_matters_login_data( $matters_info ) {
	$publish_options                                      = get_option( LC_PUBLISH_OPTION_NAME );
	$publish_options['site_matters_user']['matters_id']   = $matters_info['matters_id'];
	$publish_options['site_matters_user']['access_token'] = $matters_info['matters_token'];
	update_option( LC_PUBLISH_OPTION_NAME, $publish_options );
	$publish_options   = get_option( LC_PUBLISH_OPTION_NAME );
	$result['code']    = 200;
	$result['data']    = $publish_options;
	$result['message'] = 'Successfully POST matters login data!';
	return rest_ensure_response( $result );
}
/**
 * Get matters login data from WordPress database.
 *
 * @param WP_REST_Request $request Full data about the request.
 */
function likecoin_get_site_matters_data( $request ) {
	$publish_options = get_option( LC_PUBLISH_OPTION_NAME );
	// incl. login and publish data.
	if ( ! $publish_options ) {
		return;
	}
	$publish_options   = get_option( LC_PUBLISH_OPTION_NAME );
	$result['code']    = 200;
	$result['data']    = $publish_options;
	$result['message'] = 'Successfully GET matters data!';
	return rest_ensure_response( $result );
}
/**
 * Post matters login data from WordPress database.
 *
 * @param WP_REST_Request $request Full data about the request.
 */
function likecoin_post_web_monetization_data( $request ) {
	$monetization_options                         = get_option( LC_MONETIZATION_OPTION_NAME );
	$params                                       = $request->get_json_params();
	$monetization_options['site_payment_pointer'] = $params['paymentPointer'];
	update_option( LC_MONETIZATION_OPTION_NAME, $monetization_options );
	$monetization_options = get_option( LC_MONETIZATION_OPTION_NAME );
	$result['code']       = 200;
	$result['data']       = $monetization_options;
	$result['message']    = 'Successfully POST web monetization data!';
	return rest_ensure_response( $result );
}
/**
 * Get matters login data from WordPress database.
 *
 * @param WP_REST_Request $request Full data about the request.
 */
function likecoin_get_web_monetization_data( $request ) {
	$monetization_options = get_option( LC_MONETIZATION_OPTION_NAME );
	if ( ! $monetization_options ) {
		return;
	}
	$result['code']    = 200;
	$result['data']    = $monetization_options;
	$result['message'] = 'Successfully GET web monetization data!';
	return rest_ensure_response( $result );

}

/**
 * Set up Admin Page menus on the left side bar.
 */
function likecoin_display_admin_pages() {
	global $likecoin_admin_main_page;
	$likecoin_admin_main_page = add_menu_page(
		__( 'LikeCoin', 'likecoin' ),
		__( 'LikeCoin', 'likecoin' ),
		'manage_options',
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
		'manage_options',
		'likecoin',
		'likecoin_load_admin_js'
	);
	add_action( 'load-' . $likecoin_plugin_main_page, 'likecoin_load_admin_js' );

	global $likecoin_button_page;
	$likecoin_button_page = add_submenu_page(
		'likecoin',
		__( 'LikeCoin', 'likecoin' ),
		__( 'Your LikeCoin Button', 'likecoin' ),
		'manage_options',
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
		__( 'Web Monetization (beta)', 'likecoin' ),
		'manage_options',
		'/likecoin#/web-monetization',
		'likecoin_load_admin_js'
	);
	add_action( 'load-' . $web_monetization_page, 'likecoin_load_admin_js' );

	global $sponsor_likecoin_page;
	$sponsor_likecoin_page = add_submenu_page(
		'likecoin',
		__( 'LikeCoin', 'likecoin' ),
		__( 'Sponsor Likecoin', 'likecoin' ),
		'manage_options',
		'/likecoin#/sponsor-likecoin',
		'likecoin_load_admin_js'
	);
	add_action( 'load-' . $sponsor_likecoin_page, 'likecoin_load_admin_js' );

	global $become_civic_liker_page;
	$become_civic_liker_page = add_submenu_page(
		'likecoin',
		__( 'LikeCoin', 'likecoin' ),
		__( 'Become a Civic Liker', 'likecoin' ),
		'manage_options',
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
		'likecoin-admin-settings-0',
		'likecoinReactAppData',
		array( 'appSelector' => '#wpbody #wpbody-content' )
	);
}
