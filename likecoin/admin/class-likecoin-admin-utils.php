<?php
/**
 * LikeCoin Admin Utilities Class
 *
 * Handles various admin utility functions
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

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * LikeCoin Admin Utilities Class
 *
 * @since 3.3.0
 */
class LikeCoin_Admin_Utils {

	/**
	 * Get metabox button parameters for a post
	 *
	 * @since 3.3.0
	 * @param WP_Post $post         Post object.
	 * @return array Button parameters.
	 */
	public static function get_meta_box_button_params( $post ) {
		$author          = $post->post_author;
		$option          = get_option( LC_BUTTON_OPTION_NAME );
		$is_disabled     = ! ( isset( $option[ LC_OPTION_BUTTON_DISPLAY_AUTHOR_OVERRIDE ] ) && $option[ LC_OPTION_BUTTON_DISPLAY_AUTHOR_OVERRIDE ] );
		$likecoin_id     = get_user_meta( $author, LC_USER_LIKECOIN_ID, true );
		$widget_option   = get_post_meta( $post->ID, LC_OPTION_WIDGET_OPTION, true );
		$widget_position = isset( $widget_option[ LC_OPTION_WIDGET_POSITION ] ) ? $widget_option[ LC_OPTION_WIDGET_POSITION ] : '';
		$has_likecoin_id = strlen( $likecoin_id ) > 0;
		$is_page         = 'page' === $post->post_type;
		$default_enabled = false;

		if ( isset( $option[ LC_OPTION_BUTTON_DISPLAY_OPTION ] ) ) {
			if ( $is_page ) {
				if ( 'always' === $option[ LC_OPTION_BUTTON_DISPLAY_OPTION ] ) {
					$default_enabled = true;
				}
			} elseif ( 'none' !== $option[ LC_OPTION_BUTTON_DISPLAY_OPTION ] ) {
				$default_enabled = true;
			}
		}

		$is_widget_enabled = strlen( $widget_position ) > 0 ? 'none' !== $widget_position : $default_enabled;
		$show_no_id_error  = ! $has_likecoin_id;
		$button_params     = array(
			'is_widget_enabled' => $is_widget_enabled,
			'is_disabled'       => $is_disabled,
			'show_no_id_error'  => $show_no_id_error,
		);

		return $button_params;
	}

	/**
	 * Load editor scripts for block editor
	 *
	 * @since 3.3.0
	 * @return void
	 */
	public static function load_editor_scripts() {
		global $post;
		$post_id = null;
		if ( $post ) {
			$post_id = $post->ID;
		}
		$asset_file = LC_DIR . 'assets/js/sidebar/index.asset.php';
		$asset      = file_exists( $asset_file ) ? require $asset_file : array(
			'dependencies' => array( 'react', 'wp-api-fetch', 'wp-components', 'wp-data', 'wp-edit-post', 'wp-i18n', 'wp-plugins', 'wp-wordcount' ),
			'version'      => LC_PLUGIN_VERSION,
		);

		wp_enqueue_script(
			'likecoin-sidebar-js',
			LC_URI . 'assets/js/sidebar/index.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		wp_enqueue_style(
			'likecoin-sidebar-css',
			LC_URI . 'assets/js/sidebar/index.css',
			array( 'wp-components' ),
			$asset['version']
		);

		wp_set_script_translations( 'likecoin-sidebar-js', 'likecoin' );

		wp_localize_script(
			'likecoin-sidebar-js',
			'likecoinApiSettings',
			array(
				'likecoHost'    => LC_LIKE_CO_HOST,
				'likerlandHost' => LC_LIKER_LAND_HOST,
				'postId'        => $post_id,
			)
		);
	}

	/**
	 * Get ISCN metadata for a post
	 *
	 * @since 3.3.0
	 * @param WP_Post $post Post object.
	 * @return array ISCN metadata.
	 */
	public static function get_post_iscn_meta( $post ) {
		$post_author_id = $post->post_author;
		$author         = get_userdata( $post_author_id );
		$author_name    = '';
		$author_desc    = '';

		if ( $author ) {
			$author_name = $author->display_name;
			$author_desc = $author->description;
		}

		$post_tags = LikeCoin_Post::get_post_tags( $post );
		$post_url  = get_permalink( $post->ID );

		return array(
			'title'              => get_the_title( $post ),
			'author'             => $author_name,
			'author_description' => $author_desc,
			'description'        => get_the_excerpt( $post ),
			'url'                => $post_url,
			'tags'               => $post_tags,
		);
	}

	/**
	 * Modify plugin action links in the plugins list
	 *
	 * @since 3.3.0
	 * @param array $links Existing action links.
	 * @return array Modified action links.
	 */
	public static function modify_plugin_action_links( $links ) {
		// phpcs:disable WordPress.WP.I18n.NonSingularStringLiteralDomain
		$settings_link = '<a href="' . esc_url( admin_url( 'admin.php?page=likecoin' ) ) . '">' . __( 'Settings', 'likecoin' ) . '</a>';
		// phpcs:enable WordPress.WP.I18n.NonSingularStringLiteralDomain
		array_unshift( $links, $settings_link );
		return $links;
	}
}
