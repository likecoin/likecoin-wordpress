<?php
/**
 * LikeCoin Site Options Menu
 *
 * LikeCoin Plugin options submenu for admin and site-wise settings
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
 * Add option menu
 */
function likecoin_add_site_options_page() {
	include_once 'components.php';

	if ( ! current_user_can( 'manage_options' ) ) {
		return;
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
	<div class="wrap likecoin">
	<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
	<form action="options.php" method="post">
	<?php
		settings_fields( LC_SITE_OPTIONS_PAGE );
		do_settings_sections( LC_SITE_OPTIONS_PAGE );
	?>
		<p class="submit">
			<input type="submit" name="submit" id="submit" class="likecoinButton"
				value="<?php esc_attr_e( 'Confirm' ); ?>">
		</p>
	</form>
	</div>
	<?php
	wp_register_style( 'lc_css_common', LC_URI . 'assets/css/likecoin.css', false, LC_PLUGIN_VERSION );
	wp_enqueue_style( 'lc_css_common' );
	wp_enqueue_script( 'lc_js_common', LC_URI . 'assets/js/likecoin.es5.js', array( 'jquery' ), LC_PLUGIN_VERSION, true );
}

/**
 * Add the site likecoin id on/off
 *
 * @param array| $args settings field extra argument, e.g. label_for and class.
 */
function likecoin_add_site_likecoin_id_toggle( $args ) {
	$options = get_option( LC_OPTION_NAME );
	?>
	<input type="checkbox"
	name="<?php echo esc_attr( LC_OPTION_NAME . '[' . $args['label_for'] . ']' ); ?>"
	value="true"
	<?php
	if ( isset( $options[ $args['label_for'] ] ) ) {
		echo esc_attr( 'checked' );
	}
	?>
	>
	<label for="<?php echo esc_attr( $args['label_for'] ); ?>">
		<?php esc_html_e( 'Override all LikeButton with site LikeCoin ID' ); ?>
	</label>
	<?php
}

/**
 * Add the site likecoin id info table
 *
 * @param array| $args settings field extra argument, e.g. label_for and class.
 */
function likecoin_add_site_likecoin_id_table( $args ) {
	include_once 'components.php';
	$options                    = get_option( LC_OPTION_NAME );
	$likecoin_id                = isset( $options[ $args['label_for'] ] [ LC_LIKECOIN_USER_ID_FIELD ] ) ? $options[ $args['label_for'] ] [ LC_LIKECOIN_USER_ID_FIELD ] : '';
	$likecoin_display_name      = isset( $options[ $args['label_for'] ] [ LC_LIKECOIN_USER_DISPLAY_NAME_FIELD ] ) ? $options[ $args['label_for'] ] [ LC_LIKECOIN_USER_DISPLAY_NAME_FIELD ] : '';
	$likecoin_wallet            = isset( $options[ $args['label_for'] ] [ LC_LIKECOIN_USER_WALLET_FIELD ] ) ? $options[ $args['label_for'] ] [ LC_LIKECOIN_USER_WALLET_FIELD ] : '';
	$likecoin_id_name           = LC_OPTION_NAME . '[' . $args['label_for'] . '][' . LC_LIKECOIN_USER_ID_FIELD . ']';
	$likecoin_display_name_name = LC_OPTION_NAME . '[' . $args['label_for'] . '][' . LC_LIKECOIN_USER_DISPLAY_NAME_FIELD . ']';
	$likecoin_wallet_name       = LC_OPTION_NAME . '[' . $args['label_for'] . '][' . LC_LIKECOIN_USER_WALLET_FIELD . ']';
	$params                     = (object) array(
		'likecoin_id'                => $likecoin_id,
		'likecoin_display_name'      => $likecoin_display_name,
		'likecoin_wallet'            => $likecoin_wallet,
		'likecoin_id_name'           => $likecoin_id_name,
		'likecoin_display_name_name' => $likecoin_display_name_name,
		'likecoin_wallet_name'       => $likecoin_wallet_name,
	);
	likecoin_add_likecoin_info_table( $params );
	likecoin_add_web3_section( false );
}

/**
 * Add the likebutton select option
 *
 * @param array| $args settings field extra argument, e.g. label_for and class.
 */
function likecoin_add_site_likebutton_display_option( $args ) {
	$options = get_option( LC_OPTION_NAME );
	?>
	<select id="<?php echo esc_attr( $args['label_for'] ); ?>"
		name="<?php echo esc_attr( LC_OPTION_NAME . '[' . $args['label_for'] . ']' ); ?>"
	>
	<option value="always"
		<?php echo isset( $options[ $args['label_for'] ] ) ? ( selected( $options[ $args['label_for'] ], 'always', false ) ) : ( '' ); ?>>
		<?php esc_html_e( 'Always Show', LC_PLUGIN_SLUG ); ?>
	</option>
	<option value="post"
		<?php echo isset( $options[ $args['label_for'] ] ) ? ( selected( $options[ $args['label_for'] ], 'post', false ) ) : ( '' ); ?>>
		<?php esc_html_e( 'Post Only', LC_PLUGIN_SLUG ); ?>
	</option>
	<option value="none"
		<?php echo isset( $options[ $args['label_for'] ] ) ? ( selected( $options[ $args['label_for'] ], 'none', false ) ) : ( '' ); ?>>
		<?php esc_html_e( 'None', LC_PLUGIN_SLUG ); ?>
	</option>

	</select>
	<?php
}

/**
 * Add the likebutton author checkbox
 *
 * @param array| $args settings field extra argument, e.g. label_for and class.
 */
function likecoin_add_site_likebutton_allow_author_override( $args ) {
	$options = get_option( LC_OPTION_NAME );
	?>
	<input type="checkbox"
		name="<?php echo esc_attr( LC_OPTION_NAME . '[' . $args['label_for'] . ']' ); ?>"
		value="true"
	<?php
	if ( isset( $options[ $args['label_for'] ] ) ) {
		echo esc_attr( 'checked' );
	}
	?>
	>
	<label for="<?php echo esc_attr( $args['label_for'] ); ?>">
		<?php esc_html_e( 'Allow editors to cusomtize display setting per post' ); ?>
	</label>
	<?php
}

