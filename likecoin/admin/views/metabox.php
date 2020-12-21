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
 * Add the publish session of likecoin widget metabox
 *
 * @param object| $publish_params Params for displaying publish related settings.
 */
function likecoin_add_publish_meta_box( $publish_params ) {
	if ( isset( $publish_params['error'] ) ) {
		esc_html_e( 'Error: ', LC_PLUGIN_SLUG );
		echo esc_html( $publish_params['error'] );
		return;
	}
	esc_html_e( 'Matters Status: ', LC_PLUGIN_SLUG );
	if ( ! isset( $publish_params['draft_id'] ) ) {
		esc_html_e( 'Not inited' );
		return;
	}
	if ( ! empty( $publish_params['published'] ) ) {
		if ( ! empty( $publish_params['article_hash'] ) ) {
			?>
		<a rel="noopener" target="_blank" href="
			<?php
			echo esc_url(
				likecoin_matters_get_article_link(
					$publish_params['matters_id'],
					$publish_params['article_hash'],
					$publish_params['article_slug']
				)
			);
			?>
		">
			<?php esc_html_e( 'Published', LC_PLUGIN_SLUG ); ?>
		</a>
			<?php
		} else {
			esc_html_e( 'Pending', LC_PLUGIN_SLUG );
		}
	} else {
		?>
		<a rel="noopener" target="_blank" href="
		<?php echo esc_url( likecoin_matters_get_draft_link( $publish_params['draft_id'] ) ); ?> ">
		<?php esc_html_e( 'Draft', LC_PLUGIN_SLUG ); ?>
		</a>
		<?php
	}
	echo '<br />';
	esc_html_e( 'IPFS Status: ', LC_PLUGIN_SLUG );
	if ( ! empty( $publish_params['ipfs_hash'] ) ) {
		// TODO: Fix cid v0 vs v1 format for ipfs gateway.
		?>
		<a rel="noopener" target="_blank" href="
		<?php echo esc_url( 'https://ipfs.io/ipfs/' . $publish_params['ipfs_hash'] ); ?> ">
		<?php esc_html_e( 'Published', LC_PLUGIN_SLUG ); ?>
		</a>
		<?php
	} elseif ( ! empty( $publish_params['published'] ) ) {
		esc_html_e( 'Pending', LC_PLUGIN_SLUG );
	} else {
		esc_html_e( '-', LC_PLUGIN_SLUG );
	}
}

/**
 * Add the likecoin widget metabox
 *
 * @param object| $button_params Params for displaying button related settings.
 * @param object| $publish_params Params for displaying publish related settings.
 */
function likecoin_add_meta_box( $button_params, $publish_params ) {

	?>
	<div class="wrapper">
		<section class="likecoin">
		<?php
			likecoin_add_button_meta_box( $button_params );
		?>
		</section>
		<hr />
		<section class="likecoin">
		<?php
			likecoin_add_publish_meta_box( $publish_params );
		?>
		</section>
	</div>
	<?php
		wp_nonce_field( 'lc_save_post', 'lc_metabox_nonce' );
		wp_register_style( 'lc_css_common', LC_URI . 'assets/css/likecoin.css', false, LC_PLUGIN_VERSION );
		wp_enqueue_style( 'lc_css_common' );
}
?>
