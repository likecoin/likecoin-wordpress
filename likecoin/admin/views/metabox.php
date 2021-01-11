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
	if ( $is_disabled ) {
		?>
		<a href="<?php echo esc_url( admin_url( 'admin.php?page=' . LC_BUTTON_SITE_OPTIONS_PAGE ) ); ?>">
			<?php esc_html_e( 'LikeCoin button per post setting is disabled by admin.', LC_PLUGIN_SLUG ); ?>
		</a>
		<?php
	} elseif ( $show_no_id_error ) {
		?>
		<a href="<?php echo esc_url( admin_url( 'admin.php?page=' . LC_BUTTON_USER_OPTIONS_PAGE ) ); ?>">
			<?php esc_html_e( 'Author has no Liker ID yet.', LC_PLUGIN_SLUG ); ?>
		</a>
	<?php } else { ?>
		<input type='hidden' name="<?php echo esc_attr( LC_OPTION_WIDGET_OPTION ); ?>" value="none">
		<input type="checkbox"
			id="<?php echo esc_attr( LC_OPTION_WIDGET_OPTION ); ?>"
			name="<?php echo esc_attr( LC_OPTION_WIDGET_OPTION ); ?>"
			value="bottom"
			<?php
			if ( $button_checked ) {
				echo esc_attr( 'checked' );}
			?>
		>
		<label for="<?php echo esc_attr( LC_OPTION_WIDGET_OPTION ); ?>">
			<?php esc_html_e( 'Enabled LikeCoin button in this post', LC_PLUGIN_SLUG ); ?>
		</label>
		<?php
}
}

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
		'matters' => array(
			'status' => __( '-', LC_PLUGIN_SLUG ),
		),
		'ipfs'    => array(
			'status' => __( '-', LC_PLUGIN_SLUG ),
		),
	);
	if ( ! isset( $publish_params['draft_id'] ) ) {
		return $result;
	}
	if ( ! empty( $publish_params['published'] ) ) {
		if ( ! empty( $publish_params['article_hash'] ) ) {
			$result['matters']['status'] = __( 'Published', LC_PLUGIN_SLUG );
			$result['matters']['url']    = likecoin_matters_get_article_link(
				$publish_params['matters_id'],
				$publish_params['article_hash'],
				$publish_params['article_slug']
			);
		} else {
			$result['matters']['status'] = __( 'Pending', LC_PLUGIN_SLUG );
		}
	} else {
		$result['matters']['status'] = __( 'Draft', LC_PLUGIN_SLUG );
		$result['matters']['url']    = likecoin_matters_get_draft_link( $publish_params['draft_id'] );
	}
	if ( ! empty( $publish_params['ipfs_hash'] ) ) {
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
 */
function likecoin_parse_iscn_status( $publish_params ) {
	$result    = array();
	$iscn_hash = $publish_params['iscn_hash'];
	if ( ! empty( $iscn_hash ) ) {
		$result['status'] = __( 'Published', LC_PLUGIN_SLUG );
		$result['url']    = 'https://node.iscn-dev.like.co/txs/' . $iscn_hash;
		$result['hash']   = $iscn_hash;
	} elseif ( empty( $publish_params['ipfs_hash'] ) ) {
		$result['status'] = __( '- (IPFS is required)', LC_PLUGIN_SLUG );
	} else {
		$result['status'] = '-';
	}
	return $result;
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
		esc_html_e( 'Error: ', LC_PLUGIN_SLUG );
		echo esc_html( $status['error'] );
		return;
	}
	?>
	<div>
		<span>
			<?php esc_html_e( 'Matters Status: ', LC_PLUGIN_SLUG ); ?>
		</span>
		<span id="lcMattersStatus">
		<?php if ( ! empty( $status['matters']['url'] ) ) { ?>
			<a rel="noopener" target="_blank" href="
			<?php
			echo esc_url( $status['matters']['url'] );
			?>
			">
			<?php echo esc_html( $status['matters']['status'] ); ?>
			</a>
		<?php } else { ?>
			<?php echo esc_html( $status['matters']['status'] ); ?>
		<?php } ?>
		</span>
	</div>
	<div>
		<span>
			<?php esc_html_e( 'IPFS Status: ', LC_PLUGIN_SLUG ); ?>
		</span>
		<span id="lcIPFSStatus">
		<?php if ( ! empty( $status['ipfs']['url'] ) ) { ?>
			<a rel="noopener" target="_blank" href="
			<?php
			echo esc_url( $status['ipfs']['url'] );
			?>
			">
			<?php echo esc_html( $status['ipfs']['status'] ); ?>
			</a>
		<?php } else { ?>
			<?php echo esc_html( $status['ipfs']['status'] ); ?>
		<?php } ?>
		</span>
	</div>
	<div>
		<span>
			<?php esc_html_e( 'ISCN (testnet) Status: ', LC_PLUGIN_SLUG ); ?>
		</span>
		<span id="lcISCNStatus">
		<?php if ( ! empty( $iscn_hash ) ) { ?>
			<a rel="noopener" target="_blank" href="
			<?php
			echo esc_url( $iscn_status['url'] );
			?>
			">
			<?php echo esc_html( $iscn_status['status'] ); ?>
			</a>
		<?php } else { ?>
			<?php echo esc_html( $iscn_status['status'] ); ?>
			<?php if ( ! empty( $status['ipfs']['url'] ) ) { ?>
				<span id="lcISCNPublish"><button id="lcISCNPublishBtn"><?php esc_html_e( 'Submit to ISCN', LC_PLUGIN_SLUG ); ?></button></span>
			<?php } ?>
		<?php } ?>
		</span>
		<div><button id="lcPublishRefreshBtn"><?php esc_html_e( 'Refresh', LC_PLUGIN_SLUG ); ?></button></div>
	</div>
	<?php
}

/**
 * Add the likecoin widget metabox
 *
 * @param int|    $post_id Current post ID.
 * @param object| $button_params Params for displaying button related settings.
 * @param object| $publish_params Params for displaying publish related settings.
 */
function likecoin_add_meta_box( $post, $button_params, $publish_params ) {

	?>
	<div class="wrapper">
		<section class="likecoin">
		<h5><?php esc_html_e( 'LikeCoin button', LC_PLUGIN_SLUG ); ?></h5>
		<?php
		likecoin_add_button_meta_box( $button_params );
		?>
		</section>
		<section class="likecoin">
		<h5><?php esc_html_e( 'LikeCoin publish', LC_PLUGIN_SLUG ); ?></h5>
		<?php
		likecoin_add_publish_meta_box( $publish_params );
		?>
		</section>
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
