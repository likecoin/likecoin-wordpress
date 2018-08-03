<?php
/**
 * LikeCoin WordPress Plugin
 *
 * Plugin for embbeding LikeCoin functionalities into WordPress.
 *
 * @package LikeCoin
 * @version 0.2
 */

/*
Plugin Name: LikeCoin
Plugin URI: http://wordpress.org/plugins/likecoin/
Description: For like coin integration
Author: like.co
Version: 0.2
Author URI: https://like.co/
*/

define( 'LC_URI', plugin_dir_url( __FILE__ ) );
define( 'LC_PLUGIN_VERSION', '0.2' );

/* Utils related */
function get_author_likecoin_id( $post ) {
	$author      = $post->post_author;
	$likecoin_id = get_user_meta( $author, 'lc_likecoin_id', true );
	return $likecoin_id;
}

/* Meta Box related */

function likecoin_display_meta_box( $post ) {
	include_once 'views/metabox.php';
	likecoin_add_meta_box( $post );
}

function likecoin_load_scripts( $hook ) {
	if ( 'post-new.php' !== $hook && 'post.php' !== $hook ) {
		return;
	}
	wp_enqueue_script( 'web3', LC_URI . 'assets/js/web3.min.js', false, '1.0.0-beta34' );
}

function likecoin_register_meta_boxes() {
	add_meta_box( 'like-coin', __( 'Like Coin', 'textdomain' ), 'likecoin_display_meta_box', 'post' );
}

add_action( 'admin_enqueue_scripts', 'likecoin_load_scripts' );
add_action( 'add_meta_boxes', 'likecoin_register_meta_boxes' );

/* Widget related */

function likecoin_save_postdata( $post_id ) {
	if ( array_key_exists( 'lc_widget_option', $_POST ) ) {
		update_post_meta(
			$post_id,
			'lc_widget_position',
			sanitize_text_field( $_POST['lc_widget_option'] )
		);
		$post = get_post( $post_id );
		update_user_meta(
			$post->post_author,
			'lc_widget_position',
			sanitize_text_field( $_POST['lc_widget_option'] )
		);
	}
}

add_action( 'save_post', 'likecoin_save_postdata' );

function likecoin_add_widget( $content ) {
	global $post;
	if ( is_single() ) {
		$likecoin_id = get_author_likecoin_id( $post );
		if ( strlen( $likecoin_id ) > 0 ) {
			$widget_position = get_post_meta( $post->ID, 'lc_widget_position', true );
			$permalink       = urlencode( get_permalink( $post ) );
			$widget_code     = '<iframe scrolling="no" frameborder="0" ' .
			'style="height: 212px; width: 100%;"' .
			'src="https://button.like.co/in/embed/' . $likecoin_id . '/button' .
			'?referrer=' . $permalink . '"></iframe>';
			if ( 'both' === $widget_position ) {
				return $widget_code . $content . $widget_code;
			} elseif ( 'top' === $widget_position ) {
				return $widget_code . $content;
			} elseif ( 'bottom' === $widget_position ) {
				return $content . $widget_code;
			}
			return $content;
		}
	}
	return $content;
}

add_filter( 'the_content', 'likecoin_add_widget', 999 );

/* Ajax related */

function likecoin_update_id() {
	$user    = wp_get_current_user();
	$user_id = $user->ID;
	if ( ! current_user_can( 'edit_user', $user_id ) ) {
		return wp_die( 'error editing' );
	}
	if ( isset( $_POST['likecoin_id'] ) && isset( $_POST['likecoin_wallet'] ) ) {
		$result = update_user_meta(
			$user_id,
			'lc_likecoin_id',
			sanitize_text_field( $_POST['likecoin_id'] )
		);
		update_user_meta(
			$user_id,
			'lc_likecoin_wallet',
			sanitize_text_field( $_POST['likecoin_wallet'] )
		);
		if ( true === $result ) {
			echo 'Updated';
		} elseif ( false === $result ) {
			echo 'Unchanged';
		} else {
			echo 'Created';
		}
	}
	wp_die();
}

// wp_ajax_ is the prefix, likecoin_update_id is the action used in client side code
add_action( 'wp_ajax_likecoin_update_id', 'likecoin_update_id' );

/* Init / Upgrade related */

function handle_init_and_upgrade() {
	global $wpdb;
	global $charset_collate;
	$version    = get_option( 'likecoin_plugin_version', '0.1' );
	$table_name = $wpdb->prefix . 'likecoin_author';
	$sql        = "CREATE TABLE IF NOT EXISTS $table_name (
		`author_id` int NOT NULL,
		`likecoin_id` varchar(255) NOT NULL,
		PRIMARY KEY (`author_id`)
	) $charset_collate;";
	require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	dbDelta( $sql );

	if ( version_compare( $version, '1.0' ) < 0 ) {
		update_option( 'likecoin_plugin_version', '0.1' );
	}
}

function handle_uninstall() {
	global $wpdb;
	$table_name = $wpdb->prefix . 'likecoin_author';
	$sql        = "DROP TABLE IF NOT EXISTS $table_name;";
	require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	dbDelta( $sql );
	delete_option( 'likecoin_plugin_version' );
}

register_activation_hook( __FILE__, 'handle_init_and_upgrade' );
add_action( 'upgrader_process_complete', 'handle_init_and_upgrade' );
add_action( 'init', 'handle_init_and_upgrade' );
register_uninstall_hook( __FILE__, 'handle_uninstall' );
