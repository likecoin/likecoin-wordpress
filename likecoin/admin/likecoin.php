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
require_once dirname( __FILE__ ) . '/matters.php';
require_once dirname( __FILE__ ) . '/error.php';
require_once dirname( __FILE__ ) . '/../admin-frontend/index.php';
/**
 * Inject web3.js on related admin pages
 *
 * @param string| $hook The current admin page filename.
 */
function likecoin_load_scripts( $hook ) {
	if ( 'toplevel_page_' . LC_BUTTON_SITE_OPTIONS_PAGE !== $hook && 'likecoin_page_' . LC_BUTTON_USER_OPTIONS_PAGE !== $hook ) {
		return;
	}
}

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
 * Run all functions for admin_init hook
 */
function likecoin_admin_init() {
	likecoin_add_privacy_policy_content();
}

/**
 * Run all admin related WordPress hook
 */
function likecoin_add_admin_hooks() {
	add_action( 'admin_enqueue_scripts', 'likecoin_load_scripts' );
	add_action( 'admin_menu', 'likecoin_display_admin_pages' );
	add_action( 'add_meta_boxes', 'likecoin_register_meta_boxes' );
	add_action( 'admin_init', 'likecoin_admin_init' );
	add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'modify_plugin_action_links' );
	add_action( 'save_post_post', 'likecoin_save_postdata' );
	add_action( 'save_post_page', 'likecoin_save_postdata' );
	add_action( 'admin_post_likecoin_update_user_id', 'likecoin_update_user_id' );
	add_action( 'wp_ajax_likecoin_matters_login', 'likecoin_matters_login' );
	add_action( 'wp_ajax_likecoin_get_error_notice', 'likecoin_get_admin_errors_restful' );
	add_action( 'enqueue_block_editor_assets', 'likecoin_load_editor_scripts' );
	add_action( 'admin_notices', 'likecoin_show_admin_errors' );
	add_action( 'manage_posts_columns', 'likecoin_add_posts_columns', 10, 2 );
	add_action( 'manage_posts_custom_column', 'likecoin_populate_posts_columns', 10, 2 );
	likecoin_add_matters_admin_hook();
}
