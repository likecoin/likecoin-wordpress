<?php
/**
 * LikeCoin WordPress Plugin
 *
 * Plugin for embbeding LikeCoin functionalities into WordPress.
 *
 * @package   LikeCoin
 * @author    LikeCoin Foundation <team@like.co>
 * @license   GPLv3
 * @link      https://github.com/likecoin/likecoin-wordpress
 * @copyright 2018 LikeCoin Foundation

 * Plugin Name:  LikeCoin
 * Plugin URI:   https://github.com/likecoin/likecoin-wordpress
 * Description:  Integrate LikeCoin ID with WordPress, allow users to add LikeButton into posts.
 * Version:      1.0.2
 * Author:       LikeCoin Foundation
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
define( 'LC_PLUGIN_SLUG', plugin_basename( __FILE__ ) );
define( 'LC_PLUGIN_NAME', 'LikeCoin' );
define( 'LC_PLUGIN_VERSION', '1.0.2' );
define( 'LC_WEB3_VERSION', '1.0.0-beta35' );

define( 'LC_SITE_OPTIONS_PAGE', 'lc_site_options' );
define( 'LC_USER_OPTIONS_PAGE', 'lc_user_options' );
define( 'LC_OPTION_NAME', 'lc_plugin_options' );
/**
 * Get post author's LikeCoin ID from post
 *
 * @param object| $post WordPress post object.
 */
function get_author_likecoin_id( $post ) {
	$author      = $post->post_author;
	$likecoin_id = get_user_meta( $author, 'lc_likecoin_id', true );
	return $likecoin_id;
}

/**
 * Displays metabox
 *
 * @param object| $post WordPress post object.
 */
function likecoin_display_meta_box( $post ) {
	include_once 'views/metabox.php';
	$option      = get_option( LC_OPTION_NAME );
	$is_disabled = false;
	if ( isset( $option['lc_site_likebutton_allow_author_override'] ) ) {
		$is_disabled = ! $option['lc_site_likebutton_allow_author_override'];
	}
	likecoin_add_meta_box( $post, $is_disabled );
}


/**
 * Displays option menu
 */
function likecoin_display_top_options_page() {
	include_once 'views/site-options.php';
	include_once 'views/user-options.php';

	add_menu_page(
		__( 'LikeCoin', LC_PLUGIN_SLUG ),
		__( 'LikeCoin', LC_PLUGIN_SLUG ),
		'manage_options',
		LC_SITE_OPTIONS_PAGE,
		'likecoin_add_site_options_page',
		// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped,WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents,WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
		'data:image/svg+xml;base64,' . base64_encode( file_get_contents( LC_DIR . 'assets/icon/likecoin.svg' ) ),
		// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped,WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents,WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
		50
	);

	add_submenu_page(
		LC_SITE_OPTIONS_PAGE,
		__( 'LikeCoin', LC_PLUGIN_SLUG ),
		__( 'Plugin Setting', LC_PLUGIN_SLUG ),
		'manage_options',
		LC_SITE_OPTIONS_PAGE,
		'likecoin_add_site_options_page'
	);

	add_submenu_page(
		LC_SITE_OPTIONS_PAGE,
		__( 'LikeCoin', LC_PLUGIN_SLUG ),
		__( 'Your LikeButton', LC_PLUGIN_SLUG ),
		'publish_posts',
		'lc_user_options',
		'likecoin_add_user_options_page'
	);
}
add_action( 'admin_menu', 'likecoin_display_top_options_page' );


/**
 * Inject web3.js on related admin pages
 *
 * @param string| $hook The current admin page filename.
 */
function likecoin_load_scripts( $hook ) {
	if ( 'toplevel_page_' . LC_SITE_OPTIONS_PAGE !== $hook && 'likecoin_page_' . LC_USER_OPTIONS_PAGE !== $hook ) {
		return;
	}
	wp_enqueue_script( 'web3', LC_URI . 'assets/js/web3.min.js', false, LC_WEB3_VERSION, true );
}

/**
 * Register our metabox
 */
function likecoin_register_meta_boxes() {
	add_meta_box( 'like-coin', __( 'LikeCoin Plugin', LC_PLUGIN_SLUG ), 'likecoin_display_meta_box' );
}

add_action( 'admin_enqueue_scripts', 'likecoin_load_scripts' );
add_action( 'add_meta_boxes', 'likecoin_register_meta_boxes' );

/**
 * Save the post-specific widget option to post meta and user meta
 *
 * @param int| $post_id The post id of the target post.
 */
function likecoin_save_postdata( $post_id ) {
	/* Check nonce */
	if ( ! ( isset( $_POST['lc_metabox_nonce'] ) && wp_verify_nonce( sanitize_key( $_POST['lc_metabox_nonce'] ), 'lc_save_post' ) ) ) {
		return;
	}

	if ( isset( $_POST['lc_widget_option'] ) ) {
		$option = array(
			'lc_widget_position' => sanitize_key( $_POST['lc_widget_option'] ),
		);
		update_post_meta(
			$post_id,
			'lc_widget_option',
			$option
		);
		$post = get_post( $post_id );
		update_user_meta(
			$post->post_author,
			'lc_widget_option',
			$option
		);
	}
}

add_action( 'save_post', 'likecoin_save_postdata' );

/**
 * Add LikeButton to post content if suitable
 *
 * @param string| $content The original post content.
 */
function likecoin_add_likebutton( $content ) {
	global $post;
	$option          = get_option( LC_OPTION_NAME );
	$post_type_query = '';

	do {
		if ( isset( $option['lc_site_likebutton_allow_author_override'] ) ) {
			if ( $option['lc_site_likebutton_allow_author_override'] ) {
				$widget_option   = get_post_meta( $post->ID, 'lc_widget_option', true );
				$widget_position = isset( $widget_option['lc_widget_position'] ) ? $widget_option['lc_widget_position'] : '';
				if ( strlen( $widget_position ) > 0 && 'none' !== $widget_position ) {
					// if set post_meta, cont to render.
					break;
				}
				// otherwise judge by switch case below.
			}
		}
		if ( isset( $option['lc_site_likebutton_show'] ) ) {
			$type = $option['lc_site_likebutton_show'];
			switch ( $type ) {
				case 'none':
					// set to none, exit early.
					return $content;
				case 'post':
					$post_type_query = 'post';
					break;
				case 'always':
					// no op.
					break;
			}
		} else {
			// default not show, exit early.
			return $content;
		}
	} while ( false );

	if ( is_singular( $post_type_query ) && in_the_loop() && is_main_query() ) {
		$should_use_site_id = false;
		$likecoin_id        = '';

		if ( isset( $option['lc_site_likecoin_id_toggle'] ) && isset( $option['lc_site_likecoin_id_object'] ) ) {
			$should_use_site_id = (bool) $option['lc_site_likecoin_id_toggle'];
			$likecoin_id        = $option['lc_site_likecoin_id_object']['likecoin_id'];
		} else {
			$likecoin_id = get_author_likecoin_id( $post );
		}

		if ( strlen( $likecoin_id ) > 0 ) {
			$permalink   = rawurlencode( get_permalink( $post ) );
			$widget_code = '<iframe scrolling="no" frameborder="0" ' .
			'style="height: 212px; width: 100%;"' .
			'src="https://button.like.co/in/embed/' . $likecoin_id . '/button' .
			'?referrer=' . $permalink . '"></iframe>';
			return $content . $widget_code;
		}
	}
	return $content;
}

add_filter( 'the_content', 'likecoin_add_likebutton', 9 );

/**
 * Admin post handler of user LikeCoinId/data update
 */
function likecoin_update_user_id() {
	$user    = wp_get_current_user();
	$user_id = $user->ID;
	if ( ! current_user_can( 'edit_user', $user_id ) ) {
		return wp_die( 'error editing' );
	}
	check_admin_referer( 'likecoin_update_user_id' );
	if ( isset( $_POST['likecoin_id'] ) ) {
		update_user_meta(
			$user_id,
			'lc_likecoin_id',
			sanitize_text_field( wp_unslash( $_POST['likecoin_id'] ) )
		);
	}
	if ( isset( $_POST['likecoin_wallet'] ) ) {
		update_user_meta(
			$user_id,
			'lc_likecoin_wallet',
			sanitize_text_field( wp_unslash( $_POST['likecoin_wallet'] ) )
		);
	}
	if ( isset( $_POST['likecoin_display_name'] ) ) {
		update_user_meta(
			$user_id,
			'lc_likecoin_display_name',
			sanitize_text_field( wp_unslash( $_POST['likecoin_display_name'] ) )
		);
	}
	if ( isset( $_POST['_wp_http_referer'] ) ) {
		wp_safe_redirect( esc_url_raw( add_query_arg( 'settings-updated', '1', wp_get_referer() ) ) );
	}
	exit();
}

add_action( 'admin_post_likecoin_update_user_id', 'likecoin_update_user_id' );

/**
 * Handle plugin init and upgrade
 */
function handle_init_and_upgrade() {
	global $wpdb;
	global $charset_collate;
	$version = get_option( 'likecoin_plugin_version', LC_PLUGIN_VERSION );

	if ( version_compare( $version, '1.1' ) < 0 ) {
		delete_metadata( 'user', 0, 'lc_widget_option', '', true );
		delete_metadata( 'user', 0, 'lc_widget_position', '', true );
	}

	if ( version_compare( $version, LC_PLUGIN_VERSION ) < 0 ) {
		update_option( 'likecoin_plugin_version', LC_PLUGIN_VERSION );
	}

}

/**
 * Handle plugin uninstall
 */
function handle_uninstall() {

	/* clean up all user metadata */
	delete_metadata( 'user', 0, 'lc_likecoin_id', '', true );
	delete_metadata( 'user', 0, 'lc_likecoin_wallet', '', true );
	delete_metadata( 'user', 0, 'lc_widget_option', '', true );
	delete_metadata( 'user', 0, 'lc_widget_position', '', true );
	/* clean up all post metadata */
	delete_metadata( 'user', 0, 'lc_widget_option', '', true );
	delete_metadata( 'post', 0, 'lc_widget_position', '', true );

	delete_option( LC_OPTION_NAME );
	delete_option( 'likecoin_plugin_version' );
}

/**
 * Init settings api for plugin
 */
function likecoin_init_settings() {
	include_once 'views/site-options.php';

	register_setting( LC_SITE_OPTIONS_PAGE, LC_OPTION_NAME );

	add_settings_section(
		'lc_site_likecoin_id_options',
		__( 'Site LikeCoinID', LC_PLUGIN_SLUG ),
		null,
		LC_SITE_OPTIONS_PAGE
	);

	add_settings_section(
		'lc_site_likebutton_options',
		__( 'Site LikeButton Display Setting', LC_PLUGIN_SLUG ),
		null,
		LC_SITE_OPTIONS_PAGE
	);

	add_settings_field(
		'lc_site_likecoin_id_toggle',
		__( 'Enable site LikeCoin ID', LC_PLUGIN_SLUG ),
		'likecoin_add_site_likecoin_id_toggle',
		LC_SITE_OPTIONS_PAGE,
		'lc_site_likecoin_id_options',
		[
			'label_for' => 'lc_site_likecoin_id_toggle',
		]
	);

	add_settings_field(
		'lc_site_likecoin_id_table',
		__( 'Site LikeCoin ID', LC_PLUGIN_SLUG ),
		'likecoin_add_site_likecoin_id_table',
		LC_SITE_OPTIONS_PAGE,
		'lc_site_likecoin_id_options',
		[
			'label_for' => 'lc_site_likecoin_id_object',
		]
	);

	add_settings_field(
		'lc_site_likebutton_show',
		__( 'Display option', LC_PLUGIN_SLUG ),
		'likecoin_add_site_likebutton_display_option',
		LC_SITE_OPTIONS_PAGE,
		'lc_site_likebutton_options',
		[
			'label_for' => 'lc_site_likebutton_show',
		]
	);

	add_settings_field(
		'lc_site_likebutton_allow_author_override',
		__( 'Allow per Post option', LC_PLUGIN_SLUG ),
		'likecoin_add_site_likebutton_allow_author_override',
		LC_SITE_OPTIONS_PAGE,
		'lc_site_likebutton_options',
		[
			'label_for' => 'lc_site_likebutton_allow_author_override',
		]
	);
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
		LikeCoin ID owner by the use of cookie.
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
	likecoin_init_settings();
	likecoin_add_privacy_policy_content();
}

/**
 * Loads localization .mo files
 */
function likecoin_load_plugin_textdomain() {
	load_plugin_textdomain( LC_PLUGIN_SLUG, false, basename( dirname( __FILE__ ) ) . '/languages/' );
}

register_activation_hook( __FILE__, 'handle_init_and_upgrade' );
add_action( 'upgrader_process_complete', 'handle_init_and_upgrade' );
add_action( 'init', 'handle_init_and_upgrade' );
add_action( 'admin_init', 'likecoin_admin_init' );
add_action( 'plugins_loaded', 'likecoin_load_plugin_textdomain' );
register_uninstall_hook( __FILE__, 'handle_uninstall' );
