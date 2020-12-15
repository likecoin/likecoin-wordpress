<?php
/**
 * LikeCoin Site User Options Menu
 *
 * LikeCoin  Plugin options submenu for user settings
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

	$option  = get_option( LC_BUTTON_OPTION_NAME );
	$user    = wp_get_current_user();
	$user_id = $user->ID;
	if ( ! current_user_can( 'edit_user', $user_id ) ) {
		return exit();
	}
	// For display only, probably no security concern.
	// phpcs:disable WordPress.Security.NonceVerification.Recommended
	if ( isset( $_GET['settings-updated'] ) ) {
	// phpcs:enable WordPress.Security.NonceVerification.Recommended
		add_settings_error(
			'lc_settings_messages',
			'updated',
			__( 'Settings Saved', LC_PLUGIN_SLUG ),
			'updated'
		);
	}
	settings_errors( 'lc_settings_messages' );
	?>
	<div class="wrap likecoin">
	<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
	<form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post">
	<input type="hidden" name="action" value="likecoin_update_user_id">
	<?php
		$is_site_button_enabled = ! empty( $option[ LC_OPTION_SITE_BUTTON_ENABLED ] );
		$params                 = array();
		wp_nonce_field( 'likecoin_update_user_id' );
		$likecoin_id = '';
	if ( $is_site_button_enabled ) {
		$likecoin_id                          = $option[ LC_OPTION_SITE_LIKECOIN_USER ][ LC_LIKECOIN_USER_ID_FIELD ];
		$params['likecoin_id']                = $likecoin_id;
		$params['likecoin_display_name']      = $option[ LC_OPTION_SITE_LIKECOIN_USER ][ LC_LIKECOIN_USER_DISPLAY_NAME_FIELD ];
		$params['likecoin_wallet']            = $option[ LC_OPTION_SITE_LIKECOIN_USER ][ LC_LIKECOIN_USER_WALLET_FIELD ];
		$params['likecoin_avatar']            = $option[ LC_OPTION_SITE_LIKECOIN_USER ][ LC_LIKECOIN_USER_AVATAR_FIELD ];
		$params['likecoin_id_name']           = '';
		$params['likecoin_display_name_name'] = '';
		$params['likecoin_wallet_name']       = '';
		$params['likecoin_avatar_name']       = '';
	} else {
		$likecoin_user                        = get_user_meta( $user_id, LC_USER_LIKECOIN_USER, true );
		$likecoin_id                          = get_user_meta( $user_id, LC_USER_LIKECOIN_ID, true );
		$params['likecoin_id']                = $likecoin_id;
		$params['likecoin_display_name']      = isset( $likecoin_user[ LC_LIKECOIN_USER_DISPLAY_NAME_FIELD ] ) ? $likecoin_user[ LC_LIKECOIN_USER_DISPLAY_NAME_FIELD ] : '';
		$params['likecoin_wallet']            = isset( $likecoin_user[ LC_LIKECOIN_USER_WALLET_FIELD ] ) ? $likecoin_user[ LC_LIKECOIN_USER_WALLET_FIELD ] : '';
		$params['likecoin_avatar']            = isset( $likecoin_user[ LC_LIKECOIN_USER_AVATAR_FIELD ] ) ? $likecoin_user[ LC_LIKECOIN_USER_AVATAR_FIELD ] : '';
		$params['likecoin_id_name']           = LC_LIKECOIN_USER_ID_FIELD;
		$params['likecoin_display_name_name'] = LC_LIKECOIN_USER_DISPLAY_NAME_FIELD;
		$params['likecoin_wallet_name']       = LC_LIKECOIN_USER_WALLET_FIELD;
		$params['likecoin_avatar_name']       = LC_LIKECOIN_USER_AVATAR_FIELD;
	}
		echo '<h2>' . esc_html__( 'Your Liker ID', LC_PLUGIN_SLUG ) . '</h2>';
		likecoin_add_likecoin_info_table( $params, ! $is_site_button_enabled );
		likecoin_add_error_section( false );
		echo '<h2>' . esc_html__( 'Your LikeCoin button', LC_PLUGIN_SLUG ) . '</h2>';
		likecoin_add_button_preview( $likecoin_id );
	if ( ! $is_site_button_enabled ) {
		?>
		<p class="submit">
			<input type="submit" name="submit" id="submit" class="likecoinButton"
				value="<?php esc_attr_e( 'Confirm', LC_PLUGIN_SLUG ); ?>">
		</p>
	<?php } ?>
	</form>
	</div>
	<?php
	wp_register_style( 'lc_css_common', LC_URI . 'assets/css/likecoin.css', false, LC_PLUGIN_VERSION );
	wp_enqueue_style( 'lc_css_common' );
	wp_enqueue_script( 'lc_js_common', LC_URI . 'assets/js/dist/likecoin.js', array( 'jquery', 'underscore' ), LC_PLUGIN_VERSION, true );
}

/**
 * Add the likebutton preview
 *
 * @param string| $likecoin_id user's Liker ID, empty if not logged in.
 */
function likecoin_add_button_preview( $likecoin_id ) {
	$has_likecoin_id = strlen( $likecoin_id ) > 0;
	?>
<section class="likecoin optionsSection" style="<?php echo $has_likecoin_id ? '' : 'display: none'; ?>">
	<section class="previewSection">
		<span><?php esc_html_e( 'Preview', LC_PLUGIN_SLUG ); ?></span>
		<a class="icon" href="https://like.co/in/settings" target="_blank">
		<?php
		/* output actual <svg> to allow styling */

		// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped,WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		echo file_get_contents( LC_DIR . 'assets/icon/settings.svg' );
		// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped,WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		?>
		</a>
		<div class="centerContainer">
		<figure class="likecoin-embed likecoin-button"><iframe id="likecoinPreview" scrolling="no" frameborder="0"
		style="pointer-events: none; height: 212px; width: 500px;"
		src="
		<?php
		if ( $has_likecoin_id ) {
			echo esc_url( 'https://button.like.co/in/embed/' . $likecoin_id . '/button?type=wp' );
		}
		?>
		"
		></iframe></figure>
	</div>
	</section>
</section>
	<?php
}
?>
