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
 * Add user option page
 */
function likecoin_add_user_options_page() {
	include_once 'components.php';

	$user    = wp_get_current_user();
	$user_id = $user->ID;
	if ( ! current_user_can( 'edit_user', $user_id ) ) {
		return exit();
	}
	// For display only, probably no security concern.
	// phpcs:disable WordPress.Security.NonceVerification.NoNonceVerification
	if ( isset( $_GET['settings-updated'] ) ) {
	// phpcs:enable WordPress.Security.NonceVerification.NoNonceVerification
		add_settings_error(
			'lc_settings_messages',
			'updated',
			__( 'Settings Saved', LC_PLUGIN_SLUG ),
			'updated'
		);
	}
	settings_errors( 'lc_settings_messages' );
	?>
	<div class="wrap">
	<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
	<?php likecoin_add_loading_section(); ?>
	<form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post">
	<input type="hidden" name="action" value="likecoin_update_user_id">
	<?php
		wp_nonce_field( 'likecoin_update_user_id' );
		$likecoin_id                = get_user_meta( $user_id, 'lc_likecoin_id', true );
		$likecoin_display_name      = get_user_meta( $user_id, 'lc_likecoin_display_name', true );
		$likecoin_wallet            = get_user_meta( $user_id, 'lc_likecoin_wallet', true );
		$likecoin_id_name           = 'likecoin_id';
		$likecoin_display_name_name = 'likecoin_display_name';
		$likecoin_wallet_name       = 'likecoin_wallet';
		$params                     = (object) array(
			'likecoin_id'                => $likecoin_id,
			'likecoin_display_name'      => $likecoin_display_name,
			'likecoin_wallet'            => $likecoin_wallet,
			'likecoin_id_name'           => $likecoin_id_name,
			'likecoin_display_name_name' => $likecoin_display_name_name,
			'likecoin_wallet_name'       => $likecoin_wallet_name,
		);
		echo '<h2>' . esc_html__( 'Your LikeCoin ID' ) . '</h2>';
		likecoin_add_likecoin_info_table( $params );
		echo '<h2>' . esc_html__( 'LikeButton' ) . '</h2>';
		likecoin_add_button_preview( $likecoin_id );
		submit_button( __( 'Save Settings' ) );
	?>
	</form>
	</div>
	<?php
	wp_register_style( 'lc_metabox', LC_URI . 'assets/css/metabox.css', false, LC_PLUGIN_VERSION );
	wp_enqueue_style( 'lc_metabox' );
	wp_enqueue_script( 'lc_metabox', LC_URI . 'assets/js/likecoin.es5.js', array( 'jquery' ), LC_PLUGIN_VERSION, true );
}

/**
 * Add the likebutton preview
 *
 * @param string| $likecoin_id user's LikeCoin ID, empty if not logged in.
 */
function likecoin_add_button_preview( $likecoin_id ) {
	$has_likecoin_id = strlen( $likecoin_id ) > 0;
	?>
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
</section>
	<?php
}
?>
