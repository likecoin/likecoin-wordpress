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
 * Text Domain: likecoin-react
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
	 * Enable JavaScript translation string to work.
	 */
	public function set_script_translations() {
		wp_set_script_translations( 'react-plugin-0', 'likecoin-react' );
	}
	/**
	 * Post options data to WordPress database.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 */
	public function post_main_plugin_options( $request ) {
		$plugin_options          = get_option( 'lc_plugin_options' );
		$params                  = $request->get_json_params();
		$site_liker_id_enabled   = $params['siteLikerIdEnabled'];
		$display_option          = $params['displayOption'];
		$per_post_option_enabled = $params['perPostOptionEnabled'];
		$liker_infos             = $params['siteLikerInfos'];

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
	public function get_main_plugin_options( $request ) {
		$plugin_options = get_option( 'lc_plugin_options' );
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
	public function post_user_data( $request ) {
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
	public function get_user_data( $request ) {
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
	public function post_site_publish_options_data( $request ) {
		$publish_options = get_option( 'lc_publish_options' );
		$params          = $request->get_json_params();
		$publish_options['site_matters_auto_save_draft'] = $params['siteMattersAutoSaveDraft'];
		$publish_options['site_matters_auto_publish']    = $params['siteMattersAutoPublish'];
		$publish_options['site_matters_add_footer_link'] = $params['siteMattersAddFooterLink'];
		$publish_options['iscn_badge_style_option']      = $params['ISCNBadgeStyleOption'];
		update_option( 'lc_publish_options', $publish_options );
		$publish_options   = get_option( 'lc_publish_options' );
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
	public function post_site_matters_login_data( $request ) {
		$publish_options = get_option( 'lc_publish_options' );
		$params          = $request->get_json_params();
		$publish_options['site_matters_user']['matters_id']   = $params['mattersId'];
		$publish_options['site_matters_user']['access_token'] = $params['accessToken'];
		update_option( 'lc_publish_options', $publish_options );
		$publish_options   = get_option( 'lc_publish_options' );
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
	public function get_site_matters_data( $request ) {
		// incl. login and publish data.
		if ( ! $publish_options ) {
			return;
		}
		$publish_options   = get_option( 'lc_publish_options' );
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
	public function post_web_monetization_data( $request ) {
		$monetization_options                         = get_option( 'lc_monetization_options' );
		$params                                       = $request->get_json_params();
		$monetization_options['site_payment_pointer'] = $params['paymentPointer'];
		update_option( 'lc_monetization_options', $monetization_options );
		$monetization_options = get_option( 'lc_monetization_options' );
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
	public function get_web_monetization_data( $request ) {
		$monetization_options = get_option( 'lc_monetization_options' );
		if ( ! $monetization_options ) {
			return;
		}
		$result['code']    = 200;
		$result['data']    = $monetization_options;
		$result['message'] = 'Successfully GET web monetization data!';
		return rest_ensure_response( $result );

	}
	/**
	 * Set up API route for JavaScript file to call.
	 */
	public function get_admin_main_page_api() {
		register_rest_route(
			'likecoin-react/v1',
			'/main-setting-page',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'post_main_plugin_options' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
		register_rest_route(
			'likecoin-react/v1',
			'/main-setting-page',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_main_plugin_options' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
		register_rest_route(
			'likecoin-react/v1',
			'/likecoin-button-page',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'post_user_data' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
		register_rest_route(
			'likecoin-react/v1',
			'/likecoin-button-page',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_user_data' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
		register_rest_route(
			'likecoin-react/v1',
			'/publish-setting-page/publish-options',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'post_site_publish_options_data' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
		register_rest_route(
			'likecoin-react/v1',
			'/publish-setting-page/matters-login',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'post_site_matters_login_data' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
		register_rest_route(
			'likecoin-react/v1',
			'/publish-setting-page',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_site_matters_data' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
		register_rest_route(
			'likecoin-react/v1',
			'/web-monetization-page',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'post_web_monetization_data' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
		register_rest_route(
			'likecoin-react/v1',
			'/web-monetization-page',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_web_monetization_data' ),
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
		// Load the script only on AdminMainPage, overwrite show_likecoin_admin_main_page_content's effect.
		add_action( 'load-' . $likecoin_admin_main_page, array( $this, 'load_admin_js' ) );

		global $likecoin_button_page;
		$likecoin_button_page = add_submenu_page(
			'likecoin-react',
			'likecoin-button-page-title',
			'Your LikeCoin Button',
			'manage_options',
			'/likecoin-react#/likecoin-button',
			array( $this, 'load_admin_js' )
		);
		add_action( 'load-' . $likecoin_button_page, array( $this, 'load_admin_js' ) );

		global $publish_setting_page;
		$publish_setting_page = add_submenu_page(
			'likecoin-react',
			'publish-setting-page-title',
			'Publish Setting',
			'manage_options',
			'/likecoin-react#/publish-setting',
			array( $this, 'load_admin_js' )
		);
		add_action( 'load-' . $publish_setting_page, array( $this, 'load_admin_js' ) );

		global $web_monetization_page;
		$web_monetization_page = add_submenu_page(
			'likecoin-react',
			'web-monetization-page-title',
			'Web Monetization',
			'manage_options',
			'/likecoin-react#/web-monetization',
			array( $this, 'load_admin_js' )
		);
		add_action( 'load-' . $web_monetization_page, array( $this, 'load_admin_js' ) );

		global $sponsor_likecoin_page;
		$sponsor_likecoin_page = add_submenu_page(
			'likecoin-react',
			'sponsor-likecoin-page-title',
			'Sponsor Likecoin',
			'manage_options',
			'/likecoin-react#/sponsor-likecoin',
			array( $this, 'load_admin_js' )
		);
		add_action( 'load-' . $sponsor_likecoin_page, array( $this, 'load_admin_js' ) );

		global $become_civic_liker_page;
		$become_civic_liker_page = add_submenu_page(
			'likecoin-react',
			'become-civic-liker-title',
			'Become a Civic Liker',
			'manage_options',
			'https://liker.land/civic?utm_source=wp-plugin'
		);
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
		add_action( 'admin_enqueue_scripts', array( $this, 'set_script_translations' ), 13 );
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
