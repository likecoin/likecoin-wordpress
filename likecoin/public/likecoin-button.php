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
 * Get Liker ID and wallet from post
 *
 * @param WP_Post| $post The target post for querying liker id.
 */
function likecoin_get_post_liker_id( $post ) {
	$likecoin_id     = '';
	$likecoin_wallet = '';
	$likecoin_user   = likecoin_get_author_likecoin_user( $post );
	if ( empty( $likecoin_user ) ) {
		$option            = get_option( LC_BUTTON_OPTION_NAME );
		$site_liker_id     = empty( $option[ LC_OPTION_SITE_LIKECOIN_USER ][ LC_LIKECOIN_USER_ID_FIELD ] ) ? '' : $option[ LC_OPTION_SITE_LIKECOIN_USER ][ LC_LIKECOIN_USER_ID_FIELD ];
		$site_liker_wallet = empty( $option[ LC_OPTION_SITE_LIKECOIN_USER ][ LC_LIKECOIN_USER_WALLET_FIELD ] ) ? '' : $option[ LC_OPTION_SITE_LIKECOIN_USER ][ LC_LIKECOIN_USER_WALLET_FIELD ];
		$likecoin_id       = $site_liker_id;
		$likecoin_wallet   = $site_liker_wallet;
	} else {
		$likecoin_id     = $likecoin_user[ LC_LIKECOIN_USER_ID_FIELD ];
		$likecoin_wallet = $likecoin_user[ LC_LIKECOIN_USER_WALLET_FIELD ];
	}
	return array(
		'id'     => $likecoin_id,
		'wallet' => $likecoin_wallet,
	);
}

/**
 * Add LikeCoin header if LikerId exist
 */
function likecoin_add_likecoin_meta_header() {
	$post = get_post();
	if ( $post ) {
		$iscn_mainnet_info = get_post_meta( $post->ID, LC_ISCN_INFO, true );
		$iscn_id           = '';
		if ( $iscn_mainnet_info ) {
			$iscn_id = $iscn_mainnet_info['iscn_id'];
		}
		if ( ! empty( $iscn_id ) ) {
			echo '<meta name="likecoin:iscn" content="' . esc_attr( $iscn_id ) . '">';
		}
		$likecoin_user = likecoin_get_post_liker_id( $post );
		if ( ! empty( $likecoin_user['id'] ) ) {
			echo '<meta name="likecoin:liker-id" content="' . esc_attr( $likecoin_user['id'] ) . '">';
		}
		if ( ! empty( $likecoin_user['wallet'] ) ) {
			echo '<meta name="likecoin:wallet" content="' . esc_attr( $likecoin_user['wallet'] ) . '">';
		}
	}
}

/**
 * Add LikeCoin Button if LikerId exist
 *
 * @param string| $likecoin_id The Liker ID of owner of LikeCoin Button.
 */
function likecoin_add_likebutton( $likecoin_id = '' ) {
	global $post;
	$option = get_option( LC_BUTTON_OPTION_NAME );
	$type   = $option[ LC_OPTION_BUTTON_DISPLAY_OPTION ];

	if ( ! isset( $post ) ) {
		return '';
	}

	// follow post meta only if per post widget option is set.
	$per_post_widget_position = '';
	if ( isset( $option[ LC_OPTION_BUTTON_DISPLAY_AUTHOR_OVERRIDE ] ) && $option[ LC_OPTION_BUTTON_DISPLAY_AUTHOR_OVERRIDE ] ) {
		$widget_option = get_post_meta( $post->ID, LC_OPTION_WIDGET_OPTION, true );
		// default to 'bottom' if nothing is set, since liker id is set.
		if ( isset( $widget_option[ LC_OPTION_WIDGET_POSITION ] ) ) {
			$per_post_widget_position = $widget_option[ LC_OPTION_WIDGET_POSITION ];
		}
	}

	// check widget is enabled in site setting.
	$widget_position = 'bottom'; // default to bottom.
	$post_type_query = ''; // empty query means any type.
	if ( isset( $per_post_widget_position ) && ! empty( $per_post_widget_position ) ) {
		$widget_position = $per_post_widget_position;
	} elseif ( $widget_position ) { // follow site setting.
		$widget_option = get_option( LC_BUTTON_OPTION_NAME );
		if ( isset( $option[ LC_OPTION_BUTTON_DISPLAY_OPTION ] ) ) {
			$type = $option[ LC_OPTION_BUTTON_DISPLAY_OPTION ];
			switch ( $type ) {
				case 'post':
					$post_type_query = 'post';
					$widget_position = 'bottom';
					break;
				case 'page':
					$post_type_query = 'page';
					$widget_position = 'bottom';
					break;
				case 'always':
					$widget_position = 'bottom';
					break;
				case 'none':
					$widget_position = 'none';
					break;
			}
		}
	};
	$widget_is_enabled = ! empty( $widget_position ) && 'none' !== $widget_position;
	if ( ! $widget_is_enabled ) {
		return '';
	}

	$iscn_mainnet_info = get_post_meta( $post->ID, LC_ISCN_INFO, true );
	$iscn_id           = '';
	if ( $iscn_mainnet_info ) {
		$iscn_id = $iscn_mainnet_info['iscn_id'];
	}
	$is_iscn_button = strlen( $iscn_id ) > 0;
	if ( $is_iscn_button ) {
		// override Liker ID with ISCN.
		$likecoin_id = 'iscn';
	} else {
		$likecoin_id = likecoin_get_post_liker_id( $post )['id'];
	}
	if ( empty( $likecoin_id ) ) {
		return '';
	}

	$likecoin_button_widget = '';
	if ( is_singular( $post_type_query ) ) {
		$like_target = '';
		if ( ! is_preview() ) {
			if ( strlen( $iscn_id ) > 0 ) {
				$like_target = '&iscn_id=' . rawurlencode( $iscn_id );
			} else {
				$like_target = '&referrer=' . rawurlencode( get_permalink( $post ) );
			}
		}
		$sandbox_attr           = function_exists( 'is_amp_endpoint' ) && is_amp_endpoint() ? 'sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-storage-access-by-user-activation" ' : '';
		$widget_code            = '<figure class="likecoin-embed likecoin-button"><iframe scrolling="no" frameborder="0" ' . $sandbox_attr .
		'style="height:' . ( $is_iscn_button ? '480px' : '212px' ) . ';width: 360px;" ' .
		'src="https://button.' . LC_LIKE_CO_HOST . '/in/embed/' . $likecoin_id . '/button' .
		'?type=wp&integration=wordpress_plugin' . $like_target . '"></iframe></figure>';
		$likecoin_button_widget = $widget_code;
	}

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
