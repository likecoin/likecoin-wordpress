<?php
/**
 * LikeCoin admin post sidebar
 *
 * Define sidebar functions used for post editor pages
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

require_once dirname( __FILE__ ) . '/matters.php';
require_once dirname( __FILE__ ) . '/metabox.php';

/**
 * Add the likecoin sidebar
 *
 * @param int|    $post Current post object.
 * @param object| $publish_params Params for displaying publish related settings.
 */
function likecoin_add_sidebar( $post, $publish_params ) {
	$post_id                  = $post->ID;
	$post_title               = $post->post_title;
	$post_tags                = likecoin_get_post_tags( $post );
	$post_url                 = get_permalink( $post );
	$matters_ipfs_hash        = $publish_params['ipfs_hash'];
	$matters_published_status = $publish_params['published'];
	$arweave_info             = get_post_meta( $post_id, LC_ARWEAVE_INFO, true );
	$arweave_id               = '';
	$arweave_ipfs_hash        = '';
	wp_enqueue_script(
		'lc-plugin-sidebar-js',
		LC_URI . 'assets/js/sidebar/index.js',
		array( 'wp-plugins', 'wp-edit-post', 'wp-element', 'wp-i18n' ),
		LC_PLUGIN_VERSION,
		true
	);
	wp_register_style( 'lc_plugin_sidebar_css', LC_URI . 'assets/js/sidebar/index.css', false, LC_PLUGIN_VERSION );
	wp_enqueue_style( 'lc_plugin_sidebar_css' );
	wp_localize_script(
		'lc-plugin-sidebar-js',
		'wpApiSettings',
		array(
			'siteurl'       => get_site_url(),
			'postId'        => $post_id,
			'likecoHost'    => LC_LIKE_CO_HOST,
			'likerlandHost' => LC_LIKER_LAND_HOST,
		)
	);
}

/**
 * Displays sidebar
 *
 * @param object| $post WordPress post object.
 */
function likecoin_display_sidebar( $post ) {
	$publish_params = likecoin_get_meta_box_publish_params( $post, true );
	likecoin_add_sidebar( $post, $publish_params );
}

/**
 * Register sidebar
 *
 * @param int| $post Current post object.
 */
function likecoin_register_sidebar( $post ) {
	likecoin_display_sidebar( $post );
}
