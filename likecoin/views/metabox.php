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


/**
 * Add the likecoin widget metabox
 *
 * @param object|  $post WordPress post object.
 * @param boolean| $is_disabled Show metabox disabled message.
 */
function likecoin_add_meta_box( $post, $is_disabled ) {
	$author            = $post->post_author;
	$likecoin_id       = get_user_meta( $author, 'lc_likecoin_id', true );
	$widget_option     = get_post_meta( $post->ID, 'lc_widget_option', true );
	$widget_position   = isset( $widget_option['lc_widget_position'] ) ? $widget_option['lc_widget_position'] : '';
	$is_widget_enabled = strlen( $widget_position ) > 0 && 'none' !== $widget_position;
	$has_likecoin_id   = strlen( $likecoin_id ) > 0;
	?>
	<div class="wrapper">
		<section class="likecoin">
		<?php
		if ( $is_disabled ) {
			esc_html_e( 'LikeButton custom setting is disabled by admin.', LC_PLUGIN_SLUG );
		} elseif ( ! $has_likecoin_id ) {
			?>
			<a href="<?php echo esc_url( admin_url( 'admin.php?page=lc_site_options' ) ); ?>">
				<?php esc_html_e( 'Author has no LikeCoin ID yet.', LC_PLUGIN_SLUG ); ?>
			</a>
		<?php } else { ?>
			<input type='hidden' name="<?php echo esc_attr( 'lc_widget_option' ); ?>" value="none">
			<input type="checkbox"
				name="<?php echo esc_attr( 'lc_widget_option' ); ?>"
				value="bottom"
				<?php
				if ( $is_widget_enabled ) {
					echo esc_attr( 'checked' );}
				?>
			>
			<label for="<?php echo esc_attr( 'lc_widget_option' ); ?>">
				<?php esc_html_e( 'Enabled LikeButton in this post', LC_PLUGIN_SLUG ); ?>
			</label>
		</section>
	</div>
			<?php
			wp_nonce_field( 'lc_save_post', 'lc_metabox_nonce' );
}
		wp_register_style( 'lc_metabox', LC_URI . 'assets/css/metabox.css', false, LC_PLUGIN_VERSION );
		wp_enqueue_style( 'lc_metabox' );
}
?>
