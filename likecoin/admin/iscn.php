<?php
/**
 * LikeCoin ISCN functions
 *
 * ISCN related functions
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
 * Require files
 */
require_once __DIR__ . '/post.php';

/**
 * Get ISCN register related post metadata.
 *
 * @param object| $post WordPress post object.
 */
function likecoin_get_post_iscn_meta( $post ) {
	$iscn_related_post_meta = array();
	$user                   = wp_get_current_user();
	$user_id                = $user->ID;
	$title                  = html_entity_decode( apply_filters( 'the_title_rss', $post->post_title ) );
	if ( isset( $title ) ) {
		$iscn_related_post_meta['title'] = $title;
	}
	$author = $user->display_name;
	if ( isset( $author ) ) {
		$iscn_related_post_meta['author'] = $author;
	}
	$author_description = get_the_author_meta( 'description', $user_id );
	if ( isset( $author_description ) ) {
		$iscn_related_post_meta['author_description'] = $author_description;
	}
	$post_id = $post->ID;
	$content = '';
	if ( has_excerpt( $post_id ) ) {
		$content = get_the_excerpt( $post_id );
	}
	if ( empty( $content ) ) {
		$content = apply_filters( 'the_content', $post->post_content );
	}
	if ( ! empty( $content ) ) {
		$excerpt_length = apply_filters( 'excerpt_length', 55 );
		$content        = wp_trim_words( $content, $excerpt_length, '...' );
		if ( strlen( $content ) > 200 ) {
			$content = substr( $content, 0, 200 ) . '...';
		}
	}
	$description = html_entity_decode( apply_filters( 'get_the_excerpt', $content ) );
	if ( isset( $description ) ) {
		$iscn_related_post_meta['description'] = $description;
	}
	$url = get_permalink( $post );
	if ( isset( $url ) ) {
		$iscn_related_post_meta['url'] = $url;
	}
	$tags = likecoin_get_post_tags( $post );
	if ( is_array( $tags ) ) {
		$iscn_related_post_meta['tags'] = $tags;
	}
	return $iscn_related_post_meta;
}
