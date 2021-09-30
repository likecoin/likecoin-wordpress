<?php
/**
 * LikeCoin WordPress Plugin Built with React
 *
 * @package   LikeCoin
 * Plugin Name: LikecoinReact
 * Description: LikecoinReact App
 * Version 1.0
 * Author: Liker Land
 * Aurhor URI: https://liker.land/
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if user type url directly.
}
/**
 * Init Likecoin React Class.
 */
class LikecoinReact {
	/**
	 * Init the LikecoinReact Class.
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'admin_page' ) );
		add_action( 'rest_api_init', array( $this, 'get_admin_main_page_api' ) );
	}
	/**
	 * Post options data to WordPress database.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 */
	public function post_plugin_options( $request ) {
		$plugin_options = get_option( 'lc_plugin_options' );

		$params = $request->get_json_params();

		$site_liker_id_enabled   = $params['siteLikerIdEnabled'];
		$display_option          = $params['displayOption'];
		$per_post_option_enabled = $params['perPostOptionEnabled'];
		$liker_infos             = $params['likerInfos'];

		$plugin_options['site_likecoin_id_enbled']        = $site_liker_id_enabled;
		$plugin_options['button_display_option']          = $display_option;
		$plugin_options['button_display_author_override'] = $per_post_option_enabled;
		$plugin_options['site_likecoin_user']             = $liker_infos;

		update_option( 'lc_plugin_options', $plugin_options );
		$plugin_options = get_option( 'lc_plugin_options' );

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
	public function get_plugin_options( $request ) {
		$plugin_options    = get_option( 'lc_plugin_options' );
		$result['code']    = 200;
		$result['data']    = $plugin_options;
		$result['message'] = 'Successfully GET!';
		return rest_ensure_response( $result );
	}
	/**
	 * Set up API route for JavaScript file to call.
	 */
	public function get_admin_main_page_api() {
		register_rest_route(
			'likecoin-react/v1',
			'/main-settingpage',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'post_plugin_options' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
		register_rest_route(
			'likecoin-react/v1',
			'/main-settingpage',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_plugin_options' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
	}
	/**
	 * Set up Admin Page menus on the left side bar.
	 */
	public function admin_page() {
		global $likecoin_admin_main_page;
		$likecoin_admin_main_page = add_menu_page(
			'top-menu-title',
			'Plugin Setting',
			'manage_options',
			'likecoin-react',
			array( $this, 'show_likecoin_admin_main_page_content' ),
			'',
			50
		);
		// Load the script only on likecoinAdminMainPage.
		// Below JS will overwrite show_likecoin_admin_main_page_content's effect.
		add_action( 'load-' . $likecoin_admin_main_page, array( $this, 'load_admin_js' ) );

		global $likecoin_submenu_page;
		$likecoin_submenu_page = add_submenu_page(
			'likecoin-react',
			'submenu1-page-title',
			'Your LikeCoin Button',
			'manage_options',
			'/likecoin-react#/likecoin-button',
			array( $this, 'load_admin_js' )
		);
		add_action( 'load-' . $likecoin_submenu_page, array( $this, 'load_admin_js' ) );
	}
	/**
	 * Show default UI for admin main page.
	 */
	public function show_likecoin_admin_main_page_content() {
		?> 
		<p>Hi from default admin page.</p>
		<?php
	}
	/**
	 * Allow php to load JavaScript files from React.
	 */
	public function load_admin_js() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_js' ), 13 );
	}
	/**
	 * Load JavaScript files coming from React.
	 *
	 * @param string| $file_string Part of the React-created JavaScript & css file name.
	 */
	public function get_js_files( $file_string ) {
			return pathinfo( $file_string, PATHINFO_EXTENSION ) === 'js';
	}
	/**
	 * Load css files coming from React.
	 *
	 * @param string| $file_string Part of the React-created JavaScript & css file name.
	 */
	public function get_css_files( $file_string ) {
		return pathinfo( $file_string, PATHINFO_EXTENSION ) === 'css';
	}
	/**
	 * Define how to load JavaScript files coming from React.
	 */
	public function enqueue_admin_js() {
		$react_app_build_url  = plugin_dir_url( __FILE__ ) . 'build/';
		$react_app_build_path = plugin_dir_path( __FILE__ ) . 'build/';
		$manifest_path        = $react_app_build_path . 'asset-manifest.json';
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

		$js_files  = array_filter( $assets_files, array( $this, 'get_js_files' ) );
		$css_files = array_filter( $assets_files, array( $this, 'get_css_files' ) );
		foreach ( $css_files as $index => $css_file ) {
			wp_enqueue_style( 'react-plugin-' . $index, $react_app_build_url . $css_file, array(), 1 );
		}
		foreach ( $js_files as $index => $js_file ) {
			// add wp-api-request as dependency so React can access window.wpApiSettings.
			wp_enqueue_script( 'react-plugin-' . $index, $react_app_build_url . $js_file, array( 'wp-api-request' ), 1, true );
		}
		// create a window.rpReactPlugin which can be accessed by JavaScript.
		wp_localize_script(
			'react-plugin-0',
			'rpReactPlugin',
			array( 'appSelector' => '#wpbody #wpbody-content' )
		);

	}

}

$likecoin_react = new LikecoinReact();
