<?php
/**
 * LikeCoin admin post editor functions
 *
 * Define functions used for post editor pages
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
 * Save the post-specific widget option to post meta and user meta
 *
 * @param int| $post_id The post id of the target post.
 */
function likecoin_save_postdata( $post_id ) {
	/* Check nonce */
	if ( ! ( isset( $_POST['lc_metabox_nonce'] ) && wp_verify_nonce( sanitize_key( $_POST['lc_metabox_nonce'] ), 'lc_save_post' ) ) ) {
		return;
	}

	if ( isset( $_POST[ LC_OPTION_WIDGET_OPTION ] ) ) {
		$option = array(
			LC_OPTION_WIDGET_POSITION => sanitize_key( $_POST[ LC_OPTION_WIDGET_OPTION ] ),
		);
		update_post_meta(
			$post_id,
			LC_OPTION_WIDGET_OPTION,
			$option
		);
	}
}
