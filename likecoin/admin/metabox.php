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
 * Parse the publish params into array of status
 *
 * @param object| $publish_params Params for displaying publish related settings.
 * @param object| $post WordPress post object.
 */
function likecoin_parse_iscn_status( $publish_params, $post ) {
	$post_id             = $post->ID;
	$result              = array();
	$iscn_testnet_info   = get_post_meta( $post_id, LC_ISCN_DEV_INFO, true );
	$iscn_mainnet_info   = get_post_meta( $post_id, LC_ISCN_INFO, true );
	$post_status         = get_post_status( $post );
	$iscn_hash           = $publish_params['iscn_hash'];
	$iscn_id             = $publish_params['iscn_id'];
	$iscn_view_page_url  = null;
	$iscn_badge_endpoint = null;
	if ( $iscn_mainnet_info ) {
		$iscn_view_page_url  = 'https://' . LC_LIKE_CO_HOST . '/in/tx/iscn/';
		$iscn_badge_endpoint = 'https://static.like.co/badge/iscn/';
		$iscn_card_endpoint  = 'https://app.' . LC_LIKE_CO_HOST . '/view/';
	} elseif ( $iscn_testnet_info ) {
		$iscn_view_page_url  = 'https://like.co/in/tx/iscn/dev/';
		$iscn_badge_endpoint = 'https://static.like.co/badge/iscn/dev/';
	}
	$result['ipfs_status']      = 'Pending';
	$result['is_dev_published'] = false;
	if ( ! empty( $iscn_id ) ) {
		if ( $iscn_mainnet_info ) {
			$result['iscn_id'] = $iscn_id;
			$result['status']  = __( 'Published', LC_PLUGIN_SLUG );
			$result['url']     = $iscn_card_endpoint . rawurlencode( $iscn_id );
		} else {
			$result['is_dev_published'] = true;
			$result['status']           = __( 'Published (testnet)', LC_PLUGIN_SLUG );
			$result['url']              = $iscn_view_page_url . $iscn_hash;
		}
		$result['ipfs_status'] = 'Published';
		$result['hash']        = $iscn_hash;
	} elseif ( 'publish' === $post_status ) {
		$result['status']       = __( 'Click to Publish', LC_PLUGIN_SLUG );
		$result['ipfs_status']  = 'Published';
		$result['redirect_url'] = '/wp-admin/post.php?post=' . $post_id . '&action=edit#likecoin_submit_iscn';
	} else {
		$result['status']       = '-';
		$result['redirect_url'] = '/wp-admin/post.php?post=' . $post_id . '&action=edit#likecoin_submit_iscn';
	}
	return $result;
}

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

/**
 * Get publish related params for metabox
 *
 * @param object| $post WordPress post object.
 */
function likecoin_get_meta_box_publish_params( $post ) {
	$option         = get_option( LC_PUBLISH_OPTION_NAME );
	$arweave_inf    = get_post_meta( $post->ID, LC_ARWEAVE_INFO, true );
	$post_id        = $post->ID;
	$iscn_main_info = get_post_meta( $post_id, LC_ISCN_INFO, true );
	$iscn_info      = $iscn_main_info ? $iscn_main_info : get_post_meta( $post_id, LC_ISCN_DEV_INFO, true );
	$publish_params = array(
		'iscn_hash'         => isset( $iscn_info['iscn_hash'] ) ? $iscn_info['iscn_hash'] : '',
		'iscn_id'           => isset( $iscn_info['iscn_id'] ) ? $iscn_info['iscn_id'] : '',
		'iscn_timestamp'    => isset( $iscn_info['last_saved_time'] ) ? $iscn_info['last_saved_time'] : '',
		'arweave_id'        => isset( $arweave_info['arweave_id'] ) ? $arweave_info['arweave_id'] : '',
		'arweave_ipfs_hash' => isset( $arweave_info['ipfs_hash'] ) ? $arweave_info['ipfs_hash'] : '',
	);
	return $publish_params;
}
