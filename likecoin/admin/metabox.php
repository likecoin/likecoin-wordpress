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
 */
function likecoin_parse_publish_status( $publish_params ) {
	if ( isset( $publish_params['error'] ) ) {
		return array( 'error' => $publish_params['error'] );
	}
	$result = array(
		'ipfs'    => array(
			'status' => __( '-', LC_PLUGIN_SLUG ),
		),
		'iscn'    => array(
			'status' => __( '-', LC_PLUGIN_SLUG ),
		),
		'arweave' => array(
			'status' => __( '-', LC_PLUGIN_SLUG ),
		),
	);
	if ( ! isset( $publish_params['draft_id'] ) ) {
		return $result;
	}
	if ( isset( $publish_params['arweave_id'] ) && $publish_params['arweave_id'] ) {
		$result['arweave']['status']            = __( 'Published', LC_PLUGIN_SLUG );
		$result['arweave']['arweave_ipfs_hash'] = $publish_params['arweave_ipfs_hash'];
		$result['arweave']['ipfs_url']          = 'https://ipfs.io/ipfs/' . $publish_params['arweave_ipfs_hash'];
		$result['arweave']['arweave_id']        = $publish_params['arweave_id'];
		$result['arweave']['url']               = 'https://arweave.net/' . $publish_params['arweave_id'];
	}
	if ( ! empty( $publish_params['arweave_ipfs_hash'] ) ) { // use Arweave IPFS as default.
		$result['ipfs']['status'] = __( 'Published', LC_PLUGIN_SLUG );
		$result['ipfs']['url']    = 'https://ipfs.io/ipfs/' . $publish_params['arweave_ipfs_hash'];
		$result['ipfs']['hash']   = $publish_params['arweave_ipfs_hash'];
	} elseif ( ! empty( $publish_params['ipfs_hash'] ) ) { // use Matters IPFS if no Arweave IPFS.
		$result['ipfs']['status'] = __( 'Published', LC_PLUGIN_SLUG );
		$result['ipfs']['url']    = 'https://ipfs.io/ipfs/' . $publish_params['ipfs_hash'];
		$result['ipfs']['hash']   = $publish_params['ipfs_hash'];
	} elseif ( ! empty( $publish_params['published'] ) ) {
		$result['ipfs']['status'] = __( 'Pending', LC_PLUGIN_SLUG );
	}
		return $result;
}

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
 * Get post arweave status
 *
 * @param object| $post WordPress post object.
 */
function likecoin_get_post_arweave_status( $post ) {
	$post_id      = $post->ID;
	$result       = array();
	$arweave_info = get_post_meta( $post_id, LC_ARWEAVE_INFO, true );
	if ( ! is_array( $arweave_info ) ) {
		return $result;
	}
	$result['arweave_id']  = $arweave_info['arweave_id'];
	$result['ipfs_hash']   = $arweave_info['ipfs_hash'];
	$result['arweave_url'] = 'https://arweave.net/' . $arweave_info['arweave_id'];
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
/**
 * Add the publish session of likecoin widget metabox
 *
 * @param object|  $publish_params Params for displaying publish related settings.
 * @param WP_Post| $post Post object.
 */
function likecoin_add_publish_meta_box( $publish_params, $post ) {
	$iscn_hash                = $publish_params['iscn_hash'];
	$status                   = likecoin_parse_publish_status( $publish_params );
	$iscn_status              = likecoin_parse_iscn_status( $publish_params, $post );
	$wordpress_publish_status = get_post_status( $post->ID );
	if ( isset( $status['error'] ) ) {
		?>
		<h3><?php esc_html_e( 'Web3Press publish', LC_PLUGIN_SLUG ); ?></h3>
		<?php
		esc_html_e( 'Error: ', LC_PLUGIN_SLUG );
		echo esc_html( $status['error'] );
		return;
	}
	?>

	<h3>
		<?php esc_html_e( 'Web3Press publish', LC_PLUGIN_SLUG ); ?>
		<button id="lcPublishRefreshBtn" class="button" style="vertical-align:middle">
			<span class="dashicons dashicons-image-rotate" style="vertical-align:middle"></span>
		</button>
	</h3>
	<div id="lcTitleStatus"><?php if ( ! empty( $iscn_status['url'] ) ) { ?>
		<h1 class="iscn-status-green"> &#183; </h1><h3 class="iscn-status-text"><?php esc_html_e( 'Published', LC_PLUGIN_SLUG ); ?></h3>
		<?php } elseif ( 'publish' === $wordpress_publish_status ) { ?>
			<h1 class="iscn-status-orange"> &#183; </h1><h3 class="iscn-status-text"><?php esc_html_e( 'Ready to Submit', LC_PLUGIN_SLUG ); ?></h3>
		<?php } else { ?>
			<h1 class="iscn-status-red"> &#183; </h1><h3 class="iscn-status-text"> <?php esc_html_e( 'Publish Your Post First', LC_PLUGIN_SLUG ); ?></h3>
		<?php } ?>
	</div>
	<table class="form-table">
		<tbody>
			<tr id="likecoin_submit_arweave">
				<th><label><?php esc_html_e( 'ISCN Status', LC_PLUGIN_SLUG ); ?></label></th>
				<td id="lcISCNStatus">
					<?php if ( ! empty( $iscn_status['url'] ) ) { ?>
						<a rel="noopener" target="_blank" href="<?php echo esc_url( $iscn_status['url'] ); ?>">
							<?php echo esc_html( $iscn_status['iscn_id'] ); ?>
						</a>
					<?php } else { ?>
						<button id="lcArweaveISCNBtn" class="button button-primary" 
							<?php
							if ( 'publish' !== $wordpress_publish_status ) {
								?>
								disabled > 
								<?php
							} else {
								?>
	>
						<?php } ?>
						<?php esc_html_e( 'Submit to ISCN', LC_PLUGIN_SLUG ); ?>
						</button>
					<?php } ?>
				</td>
			</tr>
			<tr>
				<th><label><?php esc_html_e( 'Storage', LC_PLUGIN_SLUG ); ?></label></th>
				<td id="lcArweaveStatus">
					<?php if ( ! empty( $status['arweave']['url'] ) ) { ?>
						<a rel="noopener" target="_blank" href="<?php echo esc_url( $status['arweave']['url'] ); ?>">
							<?php echo esc_html( $status['arweave']['arweave_id'] ); ?>
						</a>
					<?php } else { ?>
						-
					<?php } ?>
				</td>
			</tr>
			<tr>
				<th><label><?php esc_html_e( 'IPFS Hash', LC_PLUGIN_SLUG ); ?></label></th>
				<td id="lcIPFSStatus">
					<?php if ( ! empty( $status['arweave']['arweave_ipfs_hash'] ) ) { ?>
						<a rel="noopener" target="_blank" href="<?php echo esc_url( $status['arweave']['ipfs_url'] ); ?>">
							<?php echo esc_html( $status['arweave']['arweave_ipfs_hash'] ); ?>
						</a>
					<?php } elseif ( ! empty( $status['ipfs']['url'] ) ) { ?>
						<a rel="noopener" target="_blank" href="<?php echo esc_url( $status['ipfs']['url'] ); ?>">
							<?php echo esc_html( $status['ipfs']['hash'] ); ?>
						</a>
					<?php } else { ?>
						-
					<?php } ?>
				</td>
			</tr>
		</tbody>
	</table>
	<?php
}
/**
 * Add the button session for likecoin widget metabox
 *
 * @param object| $button_params Params for displaying button related settings.
 */
function likecoin_add_button_meta_box( $button_params ) {
	$button_checked   = $button_params['is_widget_enabled'];
	$is_disabled      = $button_params['is_disabled'];
	$show_no_id_error = $button_params['show_no_id_error'];
	?>
	<h3><?php esc_html_e( 'LikeCoin button', LC_PLUGIN_SLUG ); ?></h3>

	<?php if ( $is_disabled ) { ?>
		<p>
			<a href="<?php echo esc_url( admin_url( 'admin.php?page=likecoin#/' . LC_BUTTON_SITE_OPTIONS_PAGE ) ); ?>">
				<?php esc_html_e( 'LikeCoin button per post setting is disabled by admin.', LC_PLUGIN_SLUG ); ?>
			</a>
		</p>
	<?php } elseif ( $show_no_id_error ) { ?>
		<p>
			<a href="<?php echo esc_url( admin_url( 'admin.php?page=likecoin#/' . LC_BUTTON_USER_OPTIONS_PAGE ) ); ?>">
				<?php esc_html_e( 'Author has no Liker ID yet.', LC_PLUGIN_SLUG ); ?>
			</a>
		</p>
	<?php } else { ?>
		<table class="form-table">
			<tbody>
				<tr>
					<th>
						<label for="<?php echo esc_attr( LC_OPTION_WIDGET_OPTION ); ?>">
							<?php esc_html_e( 'Enable LikeCoin button', LC_PLUGIN_SLUG ); ?>
						</label>
					</th>
					<td>
						<input type='hidden' name="<?php echo esc_attr( LC_OPTION_WIDGET_OPTION ); ?>" value="none">
						<input type="checkbox"
							id="<?php echo esc_attr( LC_OPTION_WIDGET_OPTION ); ?>"
							name="<?php echo esc_attr( LC_OPTION_WIDGET_OPTION ); ?>"
							value="bottom"
							<?php
							if ( $button_checked ) {
								esc_attr_e( 'checked', LC_PLUGIN_SLUG );}
							?>
						>
						<label><?php esc_html_e( 'Embed LikeCoin button in this post', LC_PLUGIN_SLUG ); ?></label>
					</td>
				</tr>
			</tbody>
		</table>
		<?php
	}
}

/**
 * Add the likecoin widget metabox
 *
 * @param int|    $post Current post object.
 * @param object| $button_params Params for displaying button related settings.
 * @param object| $publish_params Params for displaying publish related settings.
 */
function likecoin_add_meta_box( $post, $button_params, $publish_params ) {

	?>
	<div class="wrapper">			
		<?php likecoin_add_button_meta_box( $button_params ); ?>
		<hr>
		<?php likecoin_add_publish_meta_box( $publish_params, $post ); ?>
	</div>
	<?php
		$post_id           = $post->ID;
		$post_title        = $post->post_title;
		$post_tags         = likecoin_get_post_tags( $post );
		$post_url          = get_permalink( $post );
		$arweave_info      = get_post_meta( $post_id, LC_ARWEAVE_INFO, true );
		$arweave_id        = '';
		$arweave_ipfs_hash = '';
	if ( is_array( $arweave_info ) ) {
		$arweave_id        = $arweave_info['arweave_id'];
		$arweave_ipfs_hash = $arweave_info['ipfs_hash'];
	}
		wp_nonce_field( 'lc_save_post', 'lc_metabox_nonce' );
		wp_register_style( 'lc_css_common', LC_URI . 'assets/css/likecoin.css', false, LC_PLUGIN_VERSION );
		wp_enqueue_style( 'lc_css_common' );
		$asset_file = include plugin_dir_path( __FILE__ ) . '/../assets/js/admin-metabox/metabox.asset.php';
		wp_register_script(
			'lc_js_metabox',
			LC_URI . 'assets/js/admin-metabox/metabox.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
		wp_localize_script(
			'lc_js_metabox',
			'likecoinApiSettings',
			array(
				'root'          => esc_url_raw( rest_url() ),
				'siteurl'       => get_site_url(),
				'nonce'         => wp_create_nonce( 'wp_rest' ),
				'postId'        => $post_id,
				'likecoHost'    => LC_LIKE_CO_HOST,
				'likerlandHost' => LC_LIKER_LAND_HOST,
			)
		);
		wp_localize_script(
			'lc_js_metabox',
			'lcPostInfo',
			array(
				'id'               => $post_id,
				'title'            => $post_title,
				'lastModifiedTime' => get_post_modified_time( 'U', true, $post_id ),
				'arweaveIPFSHash'  => $arweave_ipfs_hash,
				'iscnHash'         => $publish_params['iscn_hash'],
				'iscnId'           => $publish_params['iscn_id'],
				'iscnTimestamp'    => $publish_params['iscn_timestamp'],
				'tags'             => $post_tags,
				'url'              => $post_url,
				'arweaveId'        => $arweave_id,
				'mainStatus'       => 'initial',
			)
		);
		wp_localize_script(
			'lc_js_metabox',
			'lcStringInfo',
			array(
				'mainTitleDraft'          => __( 'Publish Your Post First', LC_PLUGIN_SLUG ),
				'mainTitleIntermediate'   => __( 'Ready to submit', LC_PLUGIN_SLUG ),
				'mainTitleDone'           => __( 'Published', LC_PLUGIN_SLUG ),
				'mainStatusLoading'       => __( 'Loading...', LC_PLUGIN_SLUG ),
				'mainStatusFailedPopUp'   => __( 'Failed to open like.co widget. Please allow popup in your browser and retry.', LC_PLUGIN_SLUG ),
				'mainStatusLIKEPay'       => __( 'Waiting for LIKE Pay...', LC_PLUGIN_SLUG ),
				'mainStatusUploadArweave' => __( 'Uploading to Storage...', LC_PLUGIN_SLUG ),
				'mainStatusRegisterISCN'  => __( 'Registering ISCN...', LC_PLUGIN_SLUG ),
				'buttonSubmitISCN'        => __( 'Submit to ISCN', LC_PLUGIN_SLUG ),
				'buttonRegisterISCN'      => __( 'Register ISCN', LC_PLUGIN_SLUG ),
				'buttonUpdateISCN'        => __( 'Update ISCN', LC_PLUGIN_SLUG ),
				'draft'                   => __( 'Draft', LC_PLUGIN_SLUG ),
			)
		);
		wp_enqueue_script( 'lc_js_metabox' );
}

/**
 * Displays metabox
 *
 * @param object| $post WordPress post object.
 */
function likecoin_display_meta_box( $post ) {
	$button_params  = likecoin_get_meta_box_button_params( $post );
	$publish_params = likecoin_get_meta_box_publish_params( $post );
	likecoin_add_meta_box( $post, $button_params, $publish_params );
}
