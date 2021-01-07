<?php
/**
 * LikeCoin admin post metabox
 *
 * Define metabox functions used for post editor pages
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

/**
 * Get button related params for metabox
 *
 * @param object| $post WordPress post object.
 */
function likecoin_get_meta_box_button_params( $post ) {
	$author          = $post->post_author;
	$option          = get_option( LC_BUTTON_OPTION_NAME );
	$is_disabled     = ! ( isset( $option[ LC_OPTION_BUTTON_DISPLAY_AUTHOR_OVERRIDE ] ) && $option[ LC_OPTION_BUTTON_DISPLAY_AUTHOR_OVERRIDE ] );
	$site_id_enabled = ! empty( $option[ LC_OPTION_SITE_BUTTON_ENABLED ] );
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
	$show_no_id_error  = ! $has_likecoin_id && ! $site_id_enabled;
	$button_params     = array(
		'is_widget_enabled' => $is_widget_enabled,
		'is_disabled'       => $is_disabled,
		'show_no_id_error'  => $show_no_id_error,
	);
	return $button_params;
}

/**
 * Get publish related params for metabox
 *
 * @param object|  $post WordPress post object.
 * @param boolean| $force Force update status.
 */
function likecoin_get_meta_box_publish_params( $post, $force = false ) {
	$matters_info = likecoin_refresh_post_matters_status( $post, $force );
	if ( isset( $matters_info['error'] ) ) {
		$publish_params = array(
			'error' => $matters_info['error'],
		);
	} else {
		$post_id        = $post->ID;
		$iscn_info      = get_post_meta( $post_id, LC_ISCN_DEV_INFO, true );
		$option         = get_option( LC_PUBLISH_OPTION_NAME );
		$matters_id     = isset( $option[ LC_OPTION_SITE_MATTERS_USER ] [ LC_MATTERS_ID_FIELD ] ) ? $option[ LC_OPTION_SITE_MATTERS_USER ] [ LC_MATTERS_ID_FIELD ] : '';
		$publish_params = array(
			'matters_id'   => isset( $matters_info['article_author'] ) ? $matters_info['article_author'] : $matters_id,
			'draft_id'     => isset( $matters_info['draft_id'] ) ? $matters_info['draft_id'] : '',
			'published'    => isset( $matters_info['published'] ) ? $matters_info['published'] : '',
			'article_id'   => isset( $matters_info['article_id'] ) ? $matters_info['article_id'] : '',
			'article_hash' => isset( $matters_info['article_hash'] ) ? $matters_info['article_hash'] : '',
			'article_slug' => isset( $matters_info['article_slug'] ) ? $matters_info['article_slug'] : '',
			'ipfs_hash'    => isset( $matters_info['ipfs_hash'] ) ? $matters_info['ipfs_hash'] : '',
			'iscn_hash'    => isset( $iscn_info['iscn_hash'] ) ? $iscn_info['iscn_hash'] : '',
		);
	}
	return $publish_params;
}


/**
 * Displays metabox
 *
 * @param object| $post WordPress post object.
 */
function likecoin_display_meta_box( $post ) {
	include_once dirname( __FILE__ ) . '/views/metabox.php';
	$button_params  = likecoin_get_meta_box_button_params( $post );
	$publish_params = likecoin_get_meta_box_publish_params( $post );
	likecoin_add_meta_box( $post->ID, $button_params, $publish_params );
}

/**
 * Register our metabox
 */
function likecoin_register_meta_boxes() {
	add_meta_box( 'like-coin', __( 'LikeCoin Plugin', LC_PLUGIN_SLUG ), 'likecoin_display_meta_box' );
}
