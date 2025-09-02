<?php
/**
 * LikeCoin Public Utilities Class
 *
 * Handles various public utility functions
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
 * LikeCoin Public Utilities Class
 *
 * @since 3.3.0
 */
class LikeCoin_Public_Utils {

	/**
	 * Add web monetization header if payment pointer is set
	 *
	 * @since 3.3.0
	 * @return void
	 */
	public static function add_web_monetization_header() {
		$option = get_option( LC_MONETIZATION_OPTION_NAME );
		if ( isset( $option[ LC_OPTION_SITE_MONETIZATION_PAYMENT_POINTER ] ) && ! empty( $option[ LC_OPTION_SITE_MONETIZATION_PAYMENT_POINTER ] ) ) {
			echo '<meta name="monetization" content="' . esc_attr( $option[ LC_OPTION_SITE_MONETIZATION_PAYMENT_POINTER ] ) . '">';
		}
	}

	/**
	 * Add ISCN badge for a post if ISCN exists (legacy format)
	 *
	 * @since 3.3.0
	 * @param WP_Post $post Post object.
	 * @return string ISCN badge HTML or empty string.
	 */
	public static function add_iscn_badge( $post ) {
		$post_id = $post->ID;
		$option  = get_option( LC_PUBLISH_OPTION_NAME );

		$is_dark_badge   = 0;
		$show_iscn_badge = false;

		if ( isset( $option[ LC_OPTION_ISCN_BADGE_STYLE_OPTION ] ) ) {
			$iscn_badge_style_option = $option[ LC_OPTION_ISCN_BADGE_STYLE_OPTION ];
			switch ( $iscn_badge_style_option ) {
				case 'dark':
					$show_iscn_badge = true;
					$is_dark_badge   = 1;
					break;
				case 'light':
					$show_iscn_badge = true;
					break;
				case 'none':
					break;
			}
		}

		if ( $show_iscn_badge ) {
			$iscn_testnet_info   = get_post_meta( $post_id, LC_ISCN_DEV_INFO, true );
			$iscn_mainnet_info   = get_post_meta( $post_id, LC_ISCN_INFO, true );
			$iscn_hash           = null;
			$iscn_view_page_url  = null;
			$iscn_badge_endpoint = null;
			if ( $iscn_mainnet_info ) {
				$iscn_hash           = $iscn_mainnet_info['iscn_hash'];
				$iscn_id             = $iscn_mainnet_info['iscn_id'];
				$iscn_view_page_url  = 'https://app.' . LC_LIKE_CO_HOST . '/view/' . rawurlencode( $iscn_id );
				$iscn_badge_endpoint = 'https://static.like.co/badge/iscn/';
			} elseif ( $iscn_testnet_info ) {
				$iscn_hash           = $iscn_testnet_info['iscn_hash'];
				$iscn_view_page_url  = 'https://like.co/in/tx/iscn/dev/' . $iscn_hash;
				$iscn_badge_endpoint = 'https://static.like.co/badge/iscn/dev/';
			}
			$widget_code = '';
			if ( strlen( $iscn_hash ) > 0 ) {
				$widget_code = '<figure class="likecoin-iscn-badge">' .
				'<a href="' . $iscn_view_page_url . '" target="_blank" rel="noopener">' .
				'<img ' .
				'src="' . $iscn_badge_endpoint . $iscn_hash . '.svg?dark=' . $is_dark_badge . '"' .
				'width="164" height="36"></a></figure>';
			}
			return $widget_code;
		}
		return '';
	}
}
