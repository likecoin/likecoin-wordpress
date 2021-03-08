<?php
/**
 * LikeCoin button
 *
 * LikeCoin button display related functions
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
 * Add LikeCoin Button if LikerId exist
 *
 * @param string| $likecoin_id The Liker ID of owner of LikeCoin Button.
 */
function likecoin_add_likebutton( $likecoin_id = '' ) {
	global $post;
	$option                 = get_option( LC_BUTTON_OPTION_NAME );
	$likecoin_button_widget = '';
	$post_type_query        = '';
	$type                   = $option[ LC_OPTION_BUTTON_DISPLAY_OPTION ];

	if ( strlen( $likecoin_id ) <= 0 ) {
		if ( ! empty( $option[ LC_OPTION_SITE_BUTTON_ENABLED ] ) && ! empty( $option[ LC_OPTION_SITE_LIKECOIN_USER ][ LC_LIKECOIN_USER_ID_FIELD ] ) ) {
			$likecoin_id = $option[ LC_OPTION_SITE_LIKECOIN_USER ][ LC_LIKECOIN_USER_ID_FIELD ];
		} elseif ( $post ) {
			$likecoin_id = likecoin_get_author_likecoin_id( $post );
		}
	}

	do {
		// follow post meta if option is not set yet.
		if ( ! isset( $option[ LC_OPTION_BUTTON_DISPLAY_AUTHOR_OVERRIDE ] ) || $option[ LC_OPTION_BUTTON_DISPLAY_AUTHOR_OVERRIDE ] ) {
			$widget_option   = get_post_meta( $post->ID, LC_OPTION_WIDGET_OPTION, true );
			$widget_position = isset( $widget_option[ LC_OPTION_WIDGET_POSITION ] ) ? $widget_option[ LC_OPTION_WIDGET_POSITION ] : '';
			if ( isset( $option[ LC_OPTION_BUTTON_DISPLAY_OPTION ] ) ) {
				$type = $option[ LC_OPTION_BUTTON_DISPLAY_OPTION ];
				switch ( $type ) {
					case 'none':
						$post_type_query = 'none';
						break;
					case 'post':
						$post_type_query = 'post';
						break;
					case 'always':
						// no op. is_singular() return true when $post_type_query = ''.
						break;
				}
			}

			if ( strlen( $widget_position ) > 0 && 'none' !== $post_type_query && strlen( $likecoin_id ) > 0 && is_singular( $post_type_query ) && 'none' !== $widget_position ) {
				$referrer               = is_preview() ? '' : '&referrer=' . rawurlencode( get_permalink( $post ) );
				$sandbox_attr           = function_exists( 'is_amp_endpoint' ) && is_amp_endpoint() ? 'sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-storage-access-by-user-activation" ' : '';
				$widget_code            = '<figure class="likecoin-embed likecoin-button"><iframe scrolling="no" frameborder="0" ' . $sandbox_attr .
				'style="height: 212px; width: 100%;" ' .
				'src="https://button.like.co/in/embed/' . $likecoin_id . '/button' .
				'?type=wp' . $referrer . '"></iframe></figure>';
				$likecoin_button_widget = $widget_code;
			}
			// else if set post_meta, cont to render.
			break;

			// otherwise judge by switch case below.
		}
		// default show LikeButton if id exist.
	} while ( false );

	return $likecoin_button_widget;
}

/**
 * Handle [likecoin] shortcode
 *
 * @param array|  $atts [$tag] attributes.
 * @param string| $content Post content.
 * @param string| $tag The name of the [$tag] (i.e. the name of the shortcode).
 */
function likecoin_likecoin_shortcode( $atts = array(), $content = null, $tag = '' ) {
	$filtered = shortcode_atts(
		array(
			'liker-id' => '',
		),
		$atts
	);
	return likecoin_add_likebutton( $filtered['liker-id'] );
}
