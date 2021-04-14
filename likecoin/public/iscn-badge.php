<?php
/**
 * LikeCoin ISCN badge
 *
 * LikeCoin ISCN badge displays the ISCN ID of the content.
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

/**
 * Require shared functions
 */
require_once dirname( __FILE__ ) . '/../includes/likecoin.php';

/**
 * Add iscn badge if hashed transaction id exist;
 *
 * @param WP_Post| $post Post object.
 */
function likecoin_add_iscn_badge( $post ) {
	$post_id   = $post->ID;
	$iscn_info = get_post_meta( $post_id, LC_ISCN_DEV_INFO, true );
	$iscn_hash = isset( $iscn_info['iscn_hash'] ) ? $iscn_info['iscn_hash'] : null;
	$option    = get_option( LC_PUBLISH_OPTION_NAME );

	$is_dark_badge   = 0; // default is showing white badge.
	$show_iscn_badge = true;

	if ( isset( $option[ LC_OPTION_ISCN_BADGE_STYLE_OPTION ] ) ) {
		$iscn_badge_style_option = $option[ LC_OPTION_ISCN_BADGE_STYLE_OPTION ];
		switch ( $iscn_badge_style_option ) {
			case 'dark':
				$is_dark_badge = 1;
				break;
			case 'white':
				break;
			case 'none':
				$show_iscn_badge = false;
				break;
		}
	}

	if ( strlen( $iscn_hash ) > 0 && false !== $show_iscn_badge ) {
		$widget_code = '<figure class="likecoin-iscn-badge">' .
		'<a href="https://like.co/in/tx/iscn/dev/' . $iscn_hash . '" target="_blank" rel="noopener">' .
		'<img ' .
		'src="https://static.like.co/badge/iscn/dev/' . $iscn_hash . '?dark=' . $is_dark_badge . '"' .
		'width="164" height="36' .
		'</img></a>' .
		'</figure>';
		return $widget_code;
	}
	return '';
}
