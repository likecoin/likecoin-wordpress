<?php
/**
 * LikeCoin Button Class
 *
 * Handles LikeCoin button display and related functionality
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
 * LikeCoin Button Class
 *
 * @since 4.0.0
 */
class LikeCoin_Button {

	/**
	 * Get Liker ID and wallet from post
	 *
	 * @since 4.0.0
	 * @param WP_Post $post The target post for querying liker id.
	 * @return array Array containing id and wallet.
	 */
	public static function get_post_liker_id( $post ) {
		$likecoin_id     = '';
		$likecoin_wallet = '';
		$likecoin_user   = LikeCoin_Utils::get_author_likecoin_user( $post );
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
	 * Add LikeCoin header if LikerId exists
	 *
	 * @since 4.0.0
	 * @return void
	 */
	public static function add_likecoin_meta_header() {
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
			$likecoin_user = self::get_post_liker_id( $post );
			if ( ! empty( $likecoin_user['id'] ) ) {
				echo '<meta name="likecoin:liker-id" content="' . esc_attr( $likecoin_user['id'] ) . '">';
			}
			if ( ! empty( $likecoin_user['wallet'] ) ) {
				echo '<meta name="likecoin:wallet" content="' . esc_attr( $likecoin_user['wallet'] ) . '">';
			}
		}
	}

	/**
	 * Add LikeCoin Button if LikerId exists
	 *
	 * @since 4.0.0
	 * @param string $likecoin_id   The Liker ID of owner of LikeCoin Button.
	 * @param bool   $is_shortcode  If the button is added by shortcode, ignores $widget_is_enabled if true.
	 * @return string Button HTML code or empty string.
	 */
	public static function add_likebutton( $likecoin_id = '', $is_shortcode = false ) {
		global $post;
		$option = get_option( LC_BUTTON_OPTION_NAME );
		$type   = $option[ LC_OPTION_BUTTON_DISPLAY_OPTION ];

		if ( ! isset( $post ) ) {
			return '';
		}

		// Follow post meta only if per post widget option is set.
		$per_post_widget_position = '';
		if ( isset( $option[ LC_OPTION_BUTTON_DISPLAY_AUTHOR_OVERRIDE ] ) && $option[ LC_OPTION_BUTTON_DISPLAY_AUTHOR_OVERRIDE ] ) {
			$widget_option = get_post_meta( $post->ID, LC_OPTION_WIDGET_OPTION, true );
			// Default to 'bottom' if nothing is set, since liker id is set.
			if ( isset( $widget_option[ LC_OPTION_WIDGET_POSITION ] ) ) {
				$per_post_widget_position = $widget_option[ LC_OPTION_WIDGET_POSITION ];
			}
		}

		// Check widget is enabled in site setting.
		$widget_position = 'bottom'; // Default to bottom.
		$post_type_query = ''; // Empty query means any type.
		if ( isset( $per_post_widget_position ) && ! empty( $per_post_widget_position ) ) {
			$widget_position = $per_post_widget_position;
		} elseif ( $widget_position ) { // Follow site setting.
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
		}
		$widget_is_enabled = ! empty( $widget_position ) && 'none' !== $widget_position;
		if ( ! $widget_is_enabled && ! $is_shortcode ) {
			return '';
		}

		$iscn_mainnet_info = get_post_meta( $post->ID, LC_ISCN_INFO, true );
		$iscn_id           = '';
		if ( $iscn_mainnet_info ) {
			$iscn_id = $iscn_mainnet_info['iscn_id'];
		}
		$is_iscn_button = strlen( $iscn_id ) > 0;
		if ( $is_iscn_button ) {
			// Override Liker ID with ISCN.
			$likecoin_id = 'iscn';
		} else {
			$likecoin_id = self::get_post_liker_id( $post )['id'];
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
	 * @since 4.0.0
	 * @param array $atts Shortcode attributes.
	 * @return string Button HTML code.
	 */
	public static function likecoin_shortcode( $atts = array() ) {
		$filtered = shortcode_atts(
			array(
				'liker-id' => '',
			),
			$atts
		);
		return self::add_likebutton( $filtered['liker-id'], true );
	}
}
