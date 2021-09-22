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
	}
    function adminPage() {
        global $likecoinAdminMainPage;
        $likecoinAdminMainPage = add_menu_page(
			'LikecoinReact Settings',
   			'LikecoinReact',
			'manage_options',
			'likecoinReact-main-settings-page',
			array($this, 'show_likecoin_admin_main_page_content'), // load on EVERY admin pages
			'',
			50
		);
        // load the script only on likecoinAdminMainPage.
        // below JS will overwrite show_likecoin_admin_main_page_content's effect.
		add_action('load-' . $likecoinAdminMainPage, array($this,'load_admin_js'));
	}
    function show_likecoin_admin_main_page_content() {
        ?> 
        <p>Hi from default admin page.</p>
        <?php
    }
    function load_admin_js() {
		add_action('admin_enqueue_scripts', array($this,'enqueue_admin_js'), 13);
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
        
        $js_files = array_filter($assets_files, array($this, 'get_js_files'));
        $css_files = array_filter($assets_files, array($this, 'get_css_files'));
        foreach( $css_files as $index => $css_file) {
            wp_enqueue_style('react-plugin-' . $index, $react_app_build_url . $css_file);
        }
        foreach( $js_files as $index => $js_file) {
            wp_enqueue_script('react-plugin-'. $index, $react_app_build_url . $js_file, array(), 1, true);
        }
        // create a window.rpReactPlugin which can be accessed by JavaScript.
        wp_localize_script('react-plugin-0', 'rpReactPlugin',
		array('appSelector' => '#wpbody #wpbody-content'));
	}

}

$likecoinReact = new LikecoinReact();