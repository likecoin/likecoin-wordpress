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
 * @param boolean| $default_checked Default status for checkbox.
 * @param boolean| $is_disabled Show metabox disabled message.
 * @param boolean| $skip_id_check Skip author Liker ID check.
 */
function likecoin_add_meta_box( $post, $default_checked = false, $is_disabled = false, $skip_id_check = false ) {
	$author            = $post->post_author;
	$likecoin_id       = get_user_meta( $author, LC_USER_LIKECOIN_ID, true );
	$widget_option     = get_post_meta( $post->ID, LC_OPTION_WIDGET_OPTION, true );
	$widget_position   = isset( $widget_option[ LC_OPTION_WIDGET_POSITION ] ) ? $widget_option[ LC_OPTION_WIDGET_POSITION ] : '';
	$is_widget_enabled = ( strlen( $widget_position ) > 0 && 'none' !== $widget_position ) || $default_checked;
	$has_likecoin_id   = strlen( $likecoin_id ) > 0;
	?>
	<div class="wrapper">
		<section class="likecoin">
		<?php
		if ( $is_disabled ) {
			?>
			<a href="<?php echo esc_url( admin_url( 'admin.php?page=' . LC_SITE_OPTIONS_PAGE ) ); ?>">
				<?php esc_html_e( 'LikeButton per post setting is disabled by admin.', LC_PLUGIN_SLUG ); ?>
			</a>
			<?php
		} elseif ( ! $skip_id_check && ! $has_likecoin_id ) {
			?>
			<a href="<?php echo esc_url( admin_url( 'admin.php?page=' . LC_USER_OPTIONS_PAGE ) ); ?>">
				<?php esc_html_e( 'Author has no Liker ID yet.', LC_PLUGIN_SLUG ); ?>
			</a>
		<?php } else { ?>
			<input type='hidden' name="<?php echo esc_attr( LC_OPTION_WIDGET_OPTION ); ?>" value="none">
			<input type="checkbox"
				id="<?php echo esc_attr( LC_OPTION_WIDGET_OPTION ); ?>"
				name="<?php echo esc_attr( LC_OPTION_WIDGET_OPTION ); ?>"
				value="bottom"
				<?php
				if ( $is_widget_enabled ) {
					echo esc_attr( 'checked' );}
				?>
			>
			<label for="<?php echo esc_attr( LC_OPTION_WIDGET_OPTION ); ?>">
				<?php esc_html_e( 'Enabled LikeButton in this post', LC_PLUGIN_SLUG ); ?>
			</label>
		</section>
	</div>
			<?php
			wp_nonce_field( 'lc_save_post', 'lc_metabox_nonce' );
}
		wp_register_style( 'lc_css_common', LC_URI . 'assets/css/likecoin.css', false, LC_PLUGIN_VERSION );
		wp_enqueue_style( 'lc_css_common' );
}
?>
