<?php
/**
 * LikeCoin utility functions
 *
 * Utility functions shared by admin and public
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
 * Get post author's Liker ID object from post
 *
 * @param object| $post WordPress post object.
 */
function likecoin_get_author_likecoin_user( $post ) {
	$author        = $post->post_author;
	$likecoin_user = get_user_meta( $author, LC_USER_LIKECOIN_USER, true );
	return $likecoin_user;
}
