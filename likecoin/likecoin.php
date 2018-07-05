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
