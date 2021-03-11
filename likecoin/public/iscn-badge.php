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
	$post_id               = $post->ID;
	$iscn_info             = get_post_meta( $post_id, LC_ISCN_DEV_INFO, true );
	$iscn_hash             = isset( $iscn_info['iscn_hash'] ) ? $iscn_info['iscn_hash'] : null;
	$option                = get_option( LC_PUBLISH_OPTION_NAME );
	$should_add_iscn_badge = checked( $option[ LC_OPTION_SITE_ADD_ISCN_BADGE ], 1, false );

	if ( strlen( $iscn_hash ) > 0 && $should_add_iscn_badge ) {
		$widget_code = '<figure class="likecoin-iscn-badge">' .
		'<a href="https://like.co/in/tx/iscn/dev/' . $iscn_hash . '" target="_blank" rel="noopener">' .
		'<img ' .
		'src="https://static.like.co/badge/iscn/dev/' . $iscn_hash . '">' .
		'</img></a>' .
		'</figure>';
		return $widget_code;
	}
	return '';
}
