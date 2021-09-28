<?php
/*
    Plugin Name: LikecoinReact
    Description: LikecoinReact App
    Version 1.0
    Author: Liker Land
    Aurhor URI: https://liker.land/
*/

if (!defined('ABSPATH') ) exit; // Exit if user type url directly

class LikecoinReact {
    function __construct() {
		add_action('admin_menu', array($this, 'adminPage'));
        add_action('rest_api_init', array($this,'getAdminMainPageAPI'));
	}
    function getPluginOptions( $request ) {
        $pluginOptions = get_option('lc_plugin_options_new');

        $displayOverridepre = $pluginOptions['button_display_author_override'];
        
        $params  = $request->get_json_params(); // 一次 get 很多 params. 若只拿一個：$request['user_email'].
        
        $siteLikerIdEnabled = $params['siteLikerIdEnabled'];
        $displayOption = $params['displayOption'];
        $perPostOptionEnabled = $params['perPostOptionEnabled'];
        $likerInfos = $params['likerInfos'];

        $pluginOptions['site_likecoin_id_enabled'] = $siteLikerIdEnabled;
        $pluginOptions['button_display_option'] = $displayOption;
        $pluginOptions['button_display_author_override'] = $perPostOptionEnabled;
        $pluginOptions['site_likecoin_user'] = $likerInfos;

        update_option('lc_plugin_options_new', $pluginOptions);
        $pluginOptions = get_option('lc_plugin_options_new'); // use the updated data as response.

        $result['code'] = 200;
        $result['data'] = $pluginOptions;
        $result['message'] = 'success yeah!';
        return rest_ensure_response( $result ); // ensure REST valid format even if it's null.
    }
    function getAdminMainPageAPI() {
        register_rest_route(
                'likecoin-react/v1', // namespace
                '/main-settingpage',
                array(
                    'methods'             => 'POST',
                    'callback'            => [$this, 'getPluginOptions'],
                    'permission_callback' => function () {
						return current_user_can( 'manage_options' );
					},
                )
            );
    }
    function likecoin_react_is_ok() {
        return true; // TODO
    }
    function adminPage() {
        global $likecoinAdminMainPage;
        $likecoinAdminMainPage = add_menu_page(
			'top-menu-title',
   			'Plugin Setting Newy',
			'manage_options',
			'likecoin-react', // slug name
			[$this, 'show_likecoin_admin_main_page_content'], // load on EVERY admin pages
			'',
			50
		);
        // load the script only on likecoinAdminMainPage.
        // below JS will overwrite show_likecoin_admin_main_page_content's effect.
		add_action('load-' . $likecoinAdminMainPage, [$this,'load_admin_js']);

        global $likecoinSubmenuPage;
        $likecoinSubmenuPage = add_submenu_page(
            'likecoin-react', // parent slug name
            'submenu1-page-title',
            'Likecoin Button Newy',
            'manage_options',
            '/likecoin-react#/likecoin-button', // submenu slug name (url)
            [$this, 'load_admin_js']
        );
        add_action('load-' . $likecoinSubmenuPage, [$this, 'load_admin_js']);
	}
    function show_likecoin_admin_main_page_content() {
        ?> 
        <p>Hi from default admin page.</p>
        <?php
    }
    function load_admin_js() {
		add_action('admin_enqueue_scripts', [$this,'enqueue_admin_js'], 13);
	}
    function get_js_files ($file_string) {
            return pathinfo($file_string, PATHINFO_EXTENSION) === 'js';
        }
    function get_css_files ($file_string) {
        return pathinfo( $file_string, PATHINFO_EXTENSION ) === 'css';
    }
    function enqueue_admin_js() {
        $react_app_build_url = plugin_dir_url( __FILE__ ) . 'build/'; // for getting valid path for bundled JS files.
        $react_app_build_path = plugin_dir_path(__FILE__) . 'build/'; // for reading manifest file.
        $manifest_path = $react_app_build_path . 'asset-manifest.json';
        // phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped,WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
        $request = file_get_contents( $manifest_path );
        // phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped,WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
        
        if (!$request) {
            return false;
        }
        $files_data = json_decode($request);
        if($files_data === null) return;
        if(!property_exists($files_data, 'entrypoints')) {
            return false;
        }
        $assets_files = $files_data->entrypoints;
        
        $js_files = array_filter($assets_files, [$this, 'get_js_files']);
        $css_files = array_filter($assets_files, [$this, 'get_css_files']);
        foreach( $css_files as $index => $css_file) {
            wp_enqueue_style('react-plugin-' . $index, $react_app_build_url . $css_file);
        }
        foreach( $js_files as $index => $js_file) {
            wp_enqueue_script('react-plugin-'. $index, $react_app_build_url . $js_file, ['wp-api-request'], 1, true); // add wp-api-request as dependency so React can access window.wpApiSettings
        }
        // create a window.rpReactPlugin which can be accessed by JavaScript.
        wp_localize_script('react-plugin-0', 'rpReactPlugin',
		    array('appSelector' => '#wpbody #wpbody-content') // only works if the script is enqueued! (it's enqueue above with react-plugin-$index 而 $index 為零)
        );

	}

}

$likecoinReact = new LikecoinReact();