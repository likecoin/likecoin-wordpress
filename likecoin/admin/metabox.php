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

/**
 * Get button related params for metabox
 *
 * @param object| $post WordPress post object.
 */
function likecoin_get_meta_box_button_params( $post ) {
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
