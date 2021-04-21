<?php
/**
 * LikeCoin Widget Metabox
 *
 * LikeCoin widget metabox render logics
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

require_once dirname( __FILE__ ) . '/../matters.php';

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
			<a href="<?php echo esc_url( admin_url( 'admin.php?page=' . LC_BUTTON_SITE_OPTIONS_PAGE ) ); ?>">
				<?php esc_html_e( 'LikeCoin button per post setting is disabled by admin.', LC_PLUGIN_SLUG ); ?>
			</a>
		</p>
	<?php } elseif ( $show_no_id_error ) { ?>
		<p>
			<a href="<?php echo esc_url( admin_url( 'admin.php?page=' . LC_BUTTON_USER_OPTIONS_PAGE ) ); ?>">
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
								esc_attr_e( 'checked' );}
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
 * Add the publish session of likecoin widget metabox
 *
 * @param object| $publish_params Params for displaying publish related settings.
 */
function likecoin_add_publish_meta_box( $publish_params ) {
	$iscn_hash   = $publish_params['iscn_hash'];
	$status      = likecoin_parse_publish_status( $publish_params );
	$iscn_status = likecoin_parse_iscn_status( $publish_params );
	if ( isset( $status['error'] ) ) {
		?>
		<h3><?php esc_html_e( 'LikeCoin publish', LC_PLUGIN_SLUG ); ?></h3>
		<?php
		esc_html_e( 'Error: ', LC_PLUGIN_SLUG );
		echo esc_html( $status['error'] );
		return;
	}
	?>
	<?php
	if ( ! $publish_params['is_enabled'] ) {
		?>
		<h3><?php esc_html_e( 'LikeCoin publish', LC_PLUGIN_SLUG ); ?></h3>
		<a href="<?php echo esc_url( admin_url( 'admin.php?page=' . LC_PUBLISH_SITE_OPTIONS_PAGE ) ); ?>">
		<?php esc_html_e( 'Please setup publishing settings first.', LC_PLUGIN_SLUG ); ?>
		</a>
		<?php
		return;
	}
	?>

	<h3>
		<?php esc_html_e( 'LikeCoin publish', LC_PLUGIN_SLUG ); ?>
		<button id="lcPublishRefreshBtn" class="button" style="vertical-align:middle">
			<span class="dashicons dashicons-image-rotate" style="vertical-align:middle"></span>
		</button>
	</h3>
	<table class="form-table">
		<tbody>
			<tr>
				<th><label><?php esc_html_e( 'Matters Status', LC_PLUGIN_SLUG ); ?></label></th>
				<td id="lcMattersStatus">
					<?php if ( ! empty( $status['matters']['url'] ) ) { ?>
						<a class="lc-components-button is-tertiary" rel="noopener" target="_blank" href="<?php echo esc_url( $status['matters']['url'] ); ?>">
							<?php echo esc_html( $status['matters']['status'] ); ?>
						</a>
					<?php } else { ?>
						<?php echo esc_html( $status['matters']['status'] ); ?>
					<?php } ?>
				</td>
			</tr>
			<tr>
				<th><label><?php esc_html_e( 'IPFS Status', LC_PLUGIN_SLUG ); ?></label></th>
				<td id="lcIPFSStatus">
					<?php if ( ! empty( $status['ipfs']['url'] ) ) { ?>
						<a rel="noopener" target="_blank" href="<?php echo esc_url( $status['ipfs']['url'] ); ?>">
							<?php echo esc_html( $status['ipfs']['status'] ); ?>
						</a>
					<?php } else { ?>
						<?php echo esc_html( $status['ipfs']['status'] ); ?>
					<?php } ?>
				</td>
			</tr>
			<tr>
				<th><label><?php esc_html_e( 'ISCN (Testnet) Status', LC_PLUGIN_SLUG ); ?></label></th>
				<td id="lcISCNStatus">
					<?php if ( ! empty( $iscn_hash ) ) { ?>
						<a rel="noopener" target="_blank" href="<?php echo esc_url( $iscn_status['url'] ); ?>">
							<?php echo esc_html( $iscn_status['status'] ); ?>
						</a>
					<?php } else { ?>
						<span id="lcISCNPublish" style="display:<?php echo esc_attr( empty( $status['ipfs']['url'] ) ? 'none' : '' ); ?>">
							<button id="lcISCNPublishBtn" class="button button-primary">
								<?php esc_html_e( 'Submit to ISCN', LC_PLUGIN_SLUG ); ?>
							</button>
						</span>
					<?php } ?>
				</td>
			</tr>
		</tbody>
	</table>
	<?php
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
		<?php likecoin_add_publish_meta_box( $publish_params ); ?>
	</div>
	<?php
		$post_id    = $post->ID;
		$post_title = $post->post_title;
		$post_tags  = likecoin_get_post_tags_for_matters( $post );
		wp_nonce_field( 'lc_save_post', 'lc_metabox_nonce' );
		wp_register_style( 'lc_css_common', LC_URI . 'assets/css/likecoin.css', false, LC_PLUGIN_VERSION );
		wp_enqueue_style( 'lc_css_common' );
		wp_enqueue_script(
			'lc_js_metabox',
			LC_URI . 'assets/js/dist/admin/likecoin_metabox.js',
			array( 'wp-polyfill', 'jquery' ),
			LC_PLUGIN_VERSION,
			true
		);
		wp_localize_script(
			'lc_js_metabox',
			'wpApiSettings',
			array(
				'root'    => esc_url_raw( rest_url() ),
				'siteurl' => get_site_url(),
				'nonce'   => wp_create_nonce( 'wp_rest' ),
				'postId'  => $post_id,
			)
		);
		wp_localize_script(
			'lc_js_metabox',
			'lcPostInfo',
			array(
				'id'       => $post_id,
				'title'    => $post_title,
				'ipfsHash' => $publish_params['ipfs_hash'],
				'iscnHash' => $publish_params['iscn_hash'],
				'tags'     => $post_tags,
			)
		);
}
?>
