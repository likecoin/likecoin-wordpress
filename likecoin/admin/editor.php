<?php
/**
 * LikeCoin editor functions
 *
 * Define functions used in Gutenberg editor
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

require_once __DIR__ . '/metabox.php';

/**
 * Load custom frontend js for Gutenberg editor
 */
function likecoin_load_editor_scripts() {
	// check for Gutenberg.
	if ( ! function_exists( 'has_blocks' ) ) {
		return;
	}
	global $post;
	$post_id = null;
	if ( $post ) {
		$post_id = $post->ID;
	}
	$asset_file = include plugin_dir_path( __FILE__ ) . '/../assets/js/sidebar/index.asset.php';
	wp_enqueue_style(
		'lc_js_editor',
		LC_URI . 'assets/js/sidebar/index.css',
		array(),
		$asset_file['version']
	);
	wp_register_script(
		'lc_js_editor',
		LC_URI . 'assets/js/sidebar/index.js',
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);
	wp_localize_script(
		'lc_js_editor',
		'likecoinApiSettings',
		array(
			'siteurl'       => get_site_url(),
			'postId'        => $post_id,
			'likecoHost'    => LC_LIKE_CO_HOST,
			'likerlandHost' => LC_LIKER_LAND_HOST,
		)
	);
	wp_enqueue_script( 'lc_js_editor' );
}
