<?php
/**
 * Web3Press by LikeCoin
 *
 * Plugin for embbeding LikeCoin functionalities into WordPress.
 *
 * @package   LikeCoin
 * @author    LikeCoin <team@like.co>
 * @license   GPLv3
 * @link      https://github.com/likecoin/likecoin-wordpress
 * @copyright 2018 LikerLand

 * Plugin Name:  Web3Press by LikeCoin
 * Plugin URI:   https://github.com/likecoin/likecoin-wordpress
 * Description:  Publishes your posts to the blockchain. Sell your posts, share your work, build community, preserve content.
 * Version:      3.0.2
 * Author:       LikeCoin
 * Author URI:   https://like.co/
 * License:      GPLv3
 * License URI:  https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:  likecoin
 * Domain Path:  /languages/
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

define( 'LC_URI', plugin_dir_url( __FILE__ ) );
define( 'LC_DIR', plugin_dir_path( __FILE__ ) );
define( 'LC_PLUGIN_SLUG', 'likecoin' );
define( 'LC_PLUGIN_NAME', 'Web3Press By LikeCoin' );
define( 'LC_PLUGIN_VERSION', '3.0.2' );

require_once dirname( __FILE__ ) . '/includes/constant/options.php';
require_once dirname( __FILE__ ) . '/public/likecoin.php';
require_once dirname( __FILE__ ) . '/admin/restful.php';
require_once dirname( __FILE__ ) . '/admin/matters.php';
require_once dirname( __FILE__ ) . '/admin/internet-archive.php';

/**
 * Handle plugin init and upgrade
 */
function likecoin_handle_init_and_upgrade() {
	global $wpdb;
	global $charset_collate;
	$version = get_option( 'likecoin_plugin_version', LC_PLUGIN_VERSION );

	// init button display option to 'post'.
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
 * Handle plugin activated
 *
 * @param string| $plugin plugin path being activated.
 */
function likecoin_handle_activated( $plugin ) {
	if ( plugin_basename( __FILE__ ) === $plugin ) {
		set_transient( 'likecoin_welcome_notice', 1, 10 );
		wp_safe_redirect( esc_url( admin_url( 'admin.php?page=likecoin_help#/help' ) ) );
		exit();
	}
}

/**
 * Handle plugin uninstall
 */
function likecoin_handle_uninstall() {

	/* clean up all user metadata */
	delete_metadata( 'user', 0, 'lc_likecoin_id', '', true );
	delete_metadata( 'user', 0, 'lc_likecoin_wallet', '', true );
	delete_metadata( 'user', 0, 'lc_likecoin_user', '', true );
	delete_metadata( 'user', 0, 'lc_widget_option', '', true );
	delete_metadata( 'user', 0, 'lc_widget_position', '', true );
	/* clean up all post metadata */
	delete_metadata( 'post', 0, 'lc_widget_option', '', true );
	delete_metadata( 'post', 0, 'lc_widget_position', '', true );
	/* clean up all option */
	delete_option( LC_BUTTON_OPTION_NAME );
	delete_option( LC_PUBLISH_OPTION_NAME );
	delete_option( LC_MONETIZATION_OPTION_NAME );
	delete_option( 'likecoin_plugin_version' );
}

/**
 * Loads localization .mo files
 */
function likecoin_load_plugin_textdomain() {
	load_plugin_textdomain( LC_PLUGIN_SLUG, false, basename( dirname( __FILE__ ) ) . '/languages/' );
}

/**
 * Add all WordPress hooks related to this plugin
 */
function likecoin_add_all_hooks() {
	if ( is_admin() ) {
		require_once dirname( __FILE__ ) . '/admin/likecoin.php';
		likecoin_add_admin_hooks( plugin_basename( __FILE__ ) );
	}
	likecoin_add_matters_hook();
	likecoin_add_internet_archive_hook();
	likecoin_hook_restful_hook();
	likecoin_add_public_hooks();
	register_activation_hook( __FILE__, 'likecoin_handle_init_and_upgrade' );
	add_action( 'upgrader_process_complete', 'likecoin_handle_init_and_upgrade' );
	add_action( 'init', 'likecoin_handle_init_and_upgrade' );
	add_action( 'plugins_loaded', 'likecoin_load_plugin_textdomain' );
	add_action( 'activated_plugin', 'likecoin_handle_activated' );
	register_uninstall_hook( __FILE__, 'likecoin_handle_uninstall' );
}

likecoin_add_all_hooks();
