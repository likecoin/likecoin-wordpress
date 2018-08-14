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
 * @param object| $post WordPress post object.
 */
function likecoin_add_meta_box( $post ) {
	$author          = $post->post_author;
	$likecoin_id     = get_user_meta( $author, 'lc_likecoin_id', true );
	$likecoin_wallet = get_user_meta( $author, 'lc_likecoin_wallet', true );
	$widget_option   = get_post_meta( $post->ID, 'lc_widget_option', true );
	$widget_position = isset( $widget_option['lc_widget_position'] ) ? $widget_option['lc_widget_position'] : '';
	if ( ! $widget_position ) {
		$widget_option   = get_user_meta( $author, 'lc_widget_option', true );
		$widget_position = isset( $widget_option['lc_widget_position'] ) ? $widget_option['lc_widget_position'] : '';
	}
	$has_likecoin_id = strlen( $likecoin_id ) > 0;
	?>
<section class="likecoin loading" style="display: none">
	<?php esc_html_e( 'Loading...', LC_PLUGIN_SLUG ); ?>
</section>
<section class="likecoin loginSection" style="<?php echo $has_likecoin_id ? 'display: none' : ''; ?>">
	<div class="likecoin webThreeError needMetaMask" style="display: none">
		<h3>
			<?php
			echo esc_html__( 'Please install' ) . '&nbsp<a href="https://metamask.io/" target="_blank">' . esc_html__( 'MetaMask Plugin' ) . '</a>';
			?>
		</h3>
	</div>
	<div class="likecoin webThreeError needMainNet" style="display: none">
		<h3>
			<?php esc_html_e( 'Please switch to Main Network', LC_PLUGIN_SLUG ); ?>
		</h3>
		<img src="<?php echo esc_attr( LC_URI . 'assets/img/mainnet.png' ); ?>">
	</div>
	<div class="likecoin webThreeError needUnlock" style="display: none">
		<h3>
			<?php esc_html_e( 'Please unlock your wallet', LC_PLUGIN_SLUG ); ?>
		</h3>
		<img src="<?php echo esc_attr( LC_URI . 'assets/img/unlock.png' ); ?>">
	</div>
	<div class="likecoin webThreeError needLikeCoinId" style="display: none">
		<a class="likeCoinButton" href="https://like.co/in/register" target="_blank">
			<?php esc_html_e( 'Please register a LikeCoin ID first', LC_PLUGIN_SLUG ); ?>
		</a>
	</div>
	<div class="likecoin webThreeError needLogin" style="display: none">
		<a class="likeCoinButton loginBtn">
			<?php esc_html_e( 'Login to get LikeCoin ID', LC_PLUGIN_SLUG ); ?>
		</a>
	</div>
</section>
<section class="likecoin optionsSection" style="<?php echo $has_likecoin_id ? '' : 'display: none'; ?>">
	<div class="optionsContainer">
	<section>
		<div id="updateLikeCoinIdStatus"></div>
		<div class="label">LikeCoin ID <a class="changeBtn">change</a>
			<div class="field" id="likecoinId">
				<a href="https://like.co/<?php echo esc_attr( $likecoin_id ); ?>">
					<?php echo esc_html( $likecoin_id ); ?>
				</a>
			</div>
		</div>
		<div class="label">
			<?php esc_html_e( 'LikeCoin Wallet', LC_PLUGIN_SLUG ); ?>
			<div class="field" id="likecoinWallet"><?php echo esc_html( substr( $likecoin_wallet, 0, 6 ) . '...' . substr( $likecoin_wallet, 38, 4 ) ); ?></div>
		</div>
		<div class="label">
			<label for="lc_widget_option">
				<?php esc_html_e( 'Display Option', LC_PLUGIN_SLUG ); ?>
			</label>
			<div><select name="lc_widget_option" id="lc_widget_option" class="postbox">
				<option value="both" 
				<?php
				if ( 'both' === $widget_position ) {
					echo 'selected';
				}
				?>
				>
					<?php esc_html_e( 'Top and bottom', LC_PLUGIN_SLUG ); ?>
				</option>
				<option value="top" 
				<?php
				if ( 'top' === $widget_position ) {
					echo 'selected';
				}
				?>
				>
					<?php esc_html_e( 'Top', LC_PLUGIN_SLUG ); ?>
				</option>
				<option value="bottom" 
				<?php
				if ( 'bottom' === $widget_position ) {
					echo 'selected';
				}
				?>
				>
					<?php esc_html_e( 'Bottom', LC_PLUGIN_SLUG ); ?>
				</option>
				<option value="none" 
				<?php
				if ( 'none' === $widget_position ) {
					echo 'selected';
				}
				?>
				>
					<?php esc_html_e( 'None', LC_PLUGIN_SLUG ); ?>
				</option>
			</select></div>
		</div>
	</section>
	<section class="previewSection">
		<span><?php esc_html_e( 'This LikeButton will be shown in your post:', LC_PLUGIN_SLUG ); ?></span>
		<a class="icon" href="https://like.co/in" target="_blank">
		<?php
		/* output actual <svg> to allow styling */

		// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped,WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		echo file_get_contents( LC_DIR . 'assets/icon/settings.svg' );
		// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped,WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		?>
		</a>
		<iframe id="likecoinPreview" scrolling="no" frameborder="0"
		style="pointer-events: none; height: 212px; width: 100%;"
		src="
		<?php
		if ( $has_likecoin_id ) {
			echo esc_url( 'https://button.like.co/in/embed/' . $likecoin_id . '/button' );
		}
		?>
		"
		></iframe>
	</section>
	</div>
	<?php wp_nonce_field( 'lc_save_post', 'lc_metabox_nonce' ); ?>
</section>
	<?php
	wp_register_style( 'lc_metabox', LC_URI . 'assets/css/metabox.css', false, LC_PLUGIN_VERSION );
	wp_enqueue_style( 'lc_metabox' );
	wp_enqueue_script( 'lc_metabox', LC_URI . 'assets/js/likecoin.es5.js', array( 'jquery' ), LC_PLUGIN_VERSION, true );
	wp_localize_script(
		'lc_metabox',
		'WP_CONFIG',
		array(
			'nonce'        => wp_create_nonce( 'lc_metabox_ajax' ),
			'adminAjaxUrl' => admin_url( 'admin-ajax.php' ),
		)
	);
}
?>
