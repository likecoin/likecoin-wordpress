<?php
/**
 * LikeCoin admin index
 *
 * Index of the admin panel facing side of LikeCoin plugin
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
 * Require admin files
 */
require_once dirname( __FILE__ ) . '/ajax.php';
require_once dirname( __FILE__ ) . '/editor.php';
require_once dirname( __FILE__ ) . '/metabox.php';
require_once dirname( __FILE__ ) . '/plugin-action.php';
require_once dirname( __FILE__ ) . '/post.php';
require_once dirname( __FILE__ ) . '/error.php';
require_once dirname( __FILE__ ) . '/view/view.php';

/**
 * Adds privacy policy to wp global privacy policy
 */
function likecoin_add_privacy_policy_content() {
	if ( ! function_exists( 'wp_add_privacy_policy_content' ) ) {
		return;
	}
	$content = sprintf(
		/* translators: %s is the policy url, e.g. https://like.co/in/policies/privacy */
		__(
			'When you use the LikeCoin embed, we automatically collect basic visitor informations,
		e.g. IP address, user agent, etc. These kind of information might be used as analytics purpose.
		For the purpose of applying personal site preferences, We might also identify a registered 
		Liker ID owner by the use of cookie.
		More details can be found in like.co privacy policy <a href="%s" target="_blank">here</a>.',
			LC_PLUGIN_SLUG
		),
		'https://like.co/in/policies/privacy'
	);
	wp_add_privacy_policy_content(
		LC_PLUGIN_NAME,
		wp_kses_post( wpautop( $content, false ) )
	);
}

/**
 * Enqueue deactivation script in plugins screen
 */
function likecoin_enqueue_plugins_screen_scripts() {
	$screen = get_current_screen();
	if ( 'plugins' === $screen->id ) {
		wp_register_style( 'lc_jquery_ui', LC_URI . 'assets/css/vendor/jquery-ui-1.13.2.css', false, '1.13.2' );
		wp_enqueue_style( 'lc_jquery_ui' );
		$asset_file = include plugin_dir_path( __FILE__ ) . '/../assets/js/admin-plugins/deactivate.asset.php';
		wp_enqueue_script(
			'lc_js_plugins',
			LC_URI . 'assets/js/admin-plugins/deactivate.js',
			array( 'jquery-ui-core', 'jquery-ui-dialog', 'wp-i18n' ),
			$asset_file['version'],
			true
		);

	}
}

/**
 * Run all functions for admin_init hook
 */
function likecoin_admin_init() {
	likecoin_add_privacy_policy_content();
}

/**
 * Add likecoin metabox for legacy editor
 */
function likecoin_add_metabox() {
	if ( likecoin_is_block_editor() ) {
		return;
	}
	add_meta_box( 'like-coin', __( 'Web3Press', LC_PLUGIN_SLUG ), 'likecoin_display_meta_box' );
}

/**
 * Check if it's block editor or not
 */
function likecoin_is_block_editor() {
	if ( function_exists( 'get_current_screen' ) ) {
		$screen = get_current_screen();
		if ( $screen && $screen->is_block_editor() ) {
			return true;
		}
		if ( function_exists( 'is_gutenberg_page' ) ) {
			return is_gutenberg_page();
		}
	}
	return false;
}

/**
 * Run all admin related WordPress hook
 *
 * @param string| $basename plugin base path.
 */
function likecoin_add_admin_hooks( $basename ) {
	add_action( 'current_screen', 'likecoin_enqueue_plugins_screen_scripts' );
	add_action( 'admin_menu', 'likecoin_display_admin_pages' );
	add_action( 'admin_init', 'likecoin_admin_init' );
	add_filter( 'plugin_action_links_' . $basename, 'likecoin_modify_plugin_action_links' );
	add_action( 'save_post_post', 'likecoin_save_postdata' );
	add_action( 'save_post_page', 'likecoin_save_postdata' );
	add_action( 'admin_post_likecoin_update_user_id', 'likecoin_update_user_id' );
	add_action( 'wp_ajax_likecoin_get_error_notice', 'likecoin_get_admin_errors_restful' );
	add_action( 'enqueue_block_editor_assets', 'likecoin_load_editor_scripts' );
	add_action( 'admin_notices', 'likecoin_show_admin_errors' );
	add_action( 'admin_notices', 'likecoin_show_admin_welcome' );
	add_action( 'manage_posts_columns', 'likecoin_add_posts_columns', 10, 2 );
	add_action( 'manage_posts_custom_column', 'likecoin_populate_posts_columns', 10, 2 );
	add_action( 'add_meta_boxes', 'likecoin_add_metabox' );
}
