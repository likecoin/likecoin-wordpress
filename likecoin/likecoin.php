<?php
/**
 * @package Like Coin
 * @version 0.1
 */
/*
Plugin Name: Like Coin
Plugin URI: http://wordpress.org/plugins/like-coin/
Description: For like coin integration
Author: like.co
Version: 0.1
Author URI: http://like.co/
*/

define( 'LC_URI', plugin_dir_url( __FILE__ ) );

/* Meta Box related */

function likecoin_display_meta_box($post) {
  include_once('views/metabox.php');
  likecoin_add_meta_box($post);
}

function likecoin_load_scripts($hook) {
  if ($hook !== 'post-new.php' && $hook !== 'post.php') {
    return;
  }
  wp_enqueue_script( 'web3', LC_URI . 'assets/js/web3.min.js', false );
}

function likecoin_register_meta_boxes() {
  add_meta_box( 'like-coin', __( 'Like Coin', 'textdomain' ), 'likecoin_display_meta_box', 'post' );
}

add_action( 'admin_enqueue_scripts', 'likecoin_load_scripts' );
add_action( 'add_meta_boxes', 'likecoin_register_meta_boxes' );

/* Init / Upgrade related */

function handle_init_and_upgrade() {
  global $wpdb;
  global $charset_collate;
  $version = get_option( 'likecoin_plugin_version', '0.1' );
  $table_name = $wpdb->prefix . 'likecoin_author';
  $sql = "CREATE TABLE IF NOT EXISTS $table_name (
    `author_id` int NOT NULL,
    `likecoin_id` varchar(255) NOT NULL,
    PRIMARY KEY (`author_id`)
  ) $charset_collate;";
  require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
  dbDelta( $sql );

  if ( version_compare( $version, '1.0' ) < 0 ) {
    update_option( 'likecoin_plugin_version', '0.1' );
  }
}

function handle_uninstall() {
  global $wpdb;
  $table_name = $wpdb->prefix . 'likecoin_author';
  $sql = "DROP TABLE IF NOT EXISTS $table_name;";
  require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
  dbDelta( $sql );
  delete_option( 'likecoin_plugin_version' );
}

register_activation_hook( __FILE__, 'handle_init_and_upgrade' );
add_action( 'upgrader_process_complete', 'handle_init_and_upgrade' );
add_action( 'init', 'handle_init_and_upgrade' );
register_uninstall_hook( __FILE__, 'handle_uninstall' );
