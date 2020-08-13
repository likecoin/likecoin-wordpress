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

require_once dirname( __FILE__ ) . '/../../includes/constant/options.php';

/**
 * Add option menu
 */
function likecoin_add_site_options_page() {
	include_once 'components.php';

	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	settings_errors( 'lc_settings_messages' );
	?>
	<div class="wrap likecoin">
	<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
	<form action="options.php" method="post">
	<?php
		settings_fields( LC_BUTTON_SITE_OPTIONS_PAGE );
		do_settings_sections( LC_BUTTON_SITE_OPTIONS_PAGE );
	?>
		<p class="submit">
			<input type="submit" name="submit" id="submit" class="likecoinButton"
				value="<?php esc_attr_e( 'Confirm', LC_PLUGIN_SLUG ); ?>">
		</p>
	</form>
	</div>
	<?php
	wp_register_style( 'lc_css_common', LC_URI . 'assets/css/likecoin.css', false, LC_PLUGIN_VERSION );
	wp_enqueue_style( 'lc_css_common' );
	wp_enqueue_script( 'lc_js_common', LC_URI . 'assets/js/dist/likecoin.js', array( 'jquery', 'underscore' ), LC_PLUGIN_VERSION, true );
}

/**
 * Add option menu
 */
function likecoin_add_publish_options_page() {
	include_once 'components.php';

	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	settings_errors( 'lc_settings_messages' );
	?>
	<div class="wrap likecoin">
	<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
	<form action="options.php" method="post">
	<?php
		settings_fields( LC_PUBLISH_SITE_OPTIONS_PAGE );
		do_settings_sections( LC_PUBLISH_SITE_OPTIONS_PAGE );
	?>
		<p class="submit">
			<input type="submit" name="submit" id="submit" class="likecoinButton"
				value="<?php esc_attr_e( 'Confirm', LC_PLUGIN_SLUG ); ?>">
		</p>
	</form>
	</div>
	<?php
	wp_register_style( 'lc_css_common', LC_URI . 'assets/css/likecoin.css', false, LC_PLUGIN_VERSION );
	wp_enqueue_style( 'lc_css_common' );
}

/**
 * Add the site Liker ID on/off
 *
 * @param array| $args settings field extra argument, e.g. label_for and class.
 */
function likecoin_add_site_likecoin_id_toggle( $args ) {
	$option = get_option( LC_BUTTON_OPTION_NAME );
	?>
	<input type='hidden'
		name="<?php echo esc_attr( LC_BUTTON_OPTION_NAME . '[' . $args['label_for'] . ']' ); ?>"
		value="0">
	<input type="checkbox"
	id="<?php echo esc_attr( $args['label_for'] ); ?>"
	name="<?php echo esc_attr( LC_BUTTON_OPTION_NAME . '[' . $args['label_for'] . ']' ); ?>"
	value="1"
	<?php isset( $option[ $args['label_for'] ] ) && checked( $option[ $args['label_for'] ] ); ?>
	>
	<label for="<?php echo esc_attr( $args['label_for'] ); ?>">
		<?php esc_html_e( 'Override all LikeCoin button with site Liker ID', LC_PLUGIN_SLUG ); ?>
	</label>
	<?php
	wp_enqueue_script( 'lc_js_site_options', LC_URI . 'assets/js/dist/admin/likecoin_site_options.js', array( 'jquery', 'underscore' ), LC_PLUGIN_VERSION, true );
	wp_localize_script(
		'lc_js_site_options',
		'WP_CONFIG',
		array(
			'siteButtonCheckboxId' => esc_attr( $args['label_for'] ),
		)
	);
}

/**
 * Add the site Liker ID info table
 *
 * @param array| $args settings field extra argument, e.g. label_for and class.
 */
function likecoin_add_site_likecoin_id_table( $args ) {
	include_once 'components.php';
	$option                     = get_option( LC_BUTTON_OPTION_NAME );
	$likecoin_id                = isset( $option[ $args['label_for'] ] [ LC_LIKECOIN_USER_ID_FIELD ] ) ? $option[ $args['label_for'] ] [ LC_LIKECOIN_USER_ID_FIELD ] : '';
	$likecoin_display_name      = isset( $option[ $args['label_for'] ] [ LC_LIKECOIN_USER_DISPLAY_NAME_FIELD ] ) ? $option[ $args['label_for'] ] [ LC_LIKECOIN_USER_DISPLAY_NAME_FIELD ] : '';
	$likecoin_wallet            = isset( $option[ $args['label_for'] ] [ LC_LIKECOIN_USER_WALLET_FIELD ] ) ? $option[ $args['label_for'] ] [ LC_LIKECOIN_USER_WALLET_FIELD ] : '';
	$likecoin_avatar            = isset( $option[ $args['label_for'] ] [ LC_LIKECOIN_USER_AVATAR_FIELD ] ) ? $option[ $args['label_for'] ] [ LC_LIKECOIN_USER_AVATAR_FIELD ] : '';
	$likecoin_id_name           = LC_BUTTON_OPTION_NAME . '[' . $args['label_for'] . '][' . LC_LIKECOIN_USER_ID_FIELD . ']';
	$likecoin_display_name_name = LC_BUTTON_OPTION_NAME . '[' . $args['label_for'] . '][' . LC_LIKECOIN_USER_DISPLAY_NAME_FIELD . ']';
	$likecoin_wallet_name       = LC_BUTTON_OPTION_NAME . '[' . $args['label_for'] . '][' . LC_LIKECOIN_USER_WALLET_FIELD . ']';
	$likecoin_avatar_name       = LC_BUTTON_OPTION_NAME . '[' . $args['label_for'] . '][' . LC_LIKECOIN_USER_AVATAR_FIELD . ']';
	$params                     = array(
		'likecoin_id'                => $likecoin_id,
		'likecoin_display_name'      => $likecoin_display_name,
		'likecoin_wallet'            => $likecoin_wallet,
		'likecoin_avatar'            => $likecoin_avatar,
		'likecoin_id_name'           => $likecoin_id_name,
		'likecoin_display_name_name' => $likecoin_display_name_name,
		'likecoin_wallet_name'       => $likecoin_wallet_name,
		'likecoin_avatar_name'       => $likecoin_avatar_name,
	);
	likecoin_add_likecoin_info_table( $params, true, false );
	likecoin_add_error_section( false );
}

/**
 * Add the likebutton select option
 *
 * @param array| $args settings field extra argument, e.g. label_for and class.
 */
function likecoin_add_site_likebutton_display_option( $args ) {
	$option = get_option( LC_BUTTON_OPTION_NAME );
	?>
	<select id="<?php echo esc_attr( $args['label_for'] ); ?>"
		name="<?php echo esc_attr( LC_BUTTON_OPTION_NAME . '[' . $args['label_for'] . ']' ); ?>"
	>
	<option value="always"
		<?php echo isset( $option[ $args['label_for'] ] ) ? ( selected( $option[ $args['label_for'] ], 'always', false ) ) : ( '' ); ?>>
		<?php esc_html_e( 'Page and Post', LC_PLUGIN_SLUG ); ?>
	</option>
	<option value="post"
		<?php echo isset( $option[ $args['label_for'] ] ) ? ( selected( $option[ $args['label_for'] ], 'post', false ) ) : ( '' ); ?>>
		<?php esc_html_e( 'Post Only', LC_PLUGIN_SLUG ); ?>
	</option>
	<option value="none"
		<?php echo isset( $option[ $args['label_for'] ] ) ? ( selected( $option[ $args['label_for'] ], 'none', false ) ) : ( '' ); ?>>
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
	$option = get_option( LC_BUTTON_OPTION_NAME );
	?>
	<input type='hidden'
		name="<?php echo esc_attr( LC_BUTTON_OPTION_NAME . '[' . $args['label_for'] . ']' ); ?>"
		value="0">
	<input type="checkbox"
		id="<?php echo esc_attr( $args['label_for'] ); ?>"
		name="<?php echo esc_attr( LC_BUTTON_OPTION_NAME . '[' . $args['label_for'] . ']' ); ?>"
		value="1"
	<?php isset( $option[ $args['label_for'] ] ) && checked( $option[ $args['label_for'] ] ); ?>
	>
	<label for="<?php echo esc_attr( $args['label_for'] ); ?>">
		<?php esc_html_e( 'Allow editors to customize display setting per post', LC_PLUGIN_SLUG ); ?>
	</label>
	<?php
}

function likecoin_add_site_matters_login_table( $args ) {
	include_once 'components.php';
	$option                    = get_option( LC_PUBLISH_OPTION_NAME );
	$matters_access_token      = $option[ $args['label_for'] ];
	$matters_access_token_name = LC_PUBLISH_OPTION_NAME . '[' . $args['label_for'] . ']';
	$params                    = array(
		'matters_access_token'      => $matters_access_token,
		'matters_access_token_name' => $matters_access_token_name,
	);
	likecoin_add_matters_login_table( $params );
	wp_enqueue_script( 'lc_js_site_options', LC_URI . 'assets/js/dist/admin/likecoin_site_publish_options.js', array( 'jquery', 'underscore' ), LC_PLUGIN_VERSION, true );
	wp_localize_script(
		'lc_js_site_options',
		'WP_CONFIG',
		array(
			'accessTokenFieldId' => esc_attr( $matters_access_token_name ),
			'mattersApiEndpoint' => LC_MATTERS_API_ENDPOINT,
		)
	);
}

function likecoin_add_site_matters_auto_draft( $args ) {
	$option = get_option( LC_PUBLISH_OPTION_NAME );
	?>
	<input type='hidden'
		name="<?php echo esc_attr( LC_PUBLISH_OPTION_NAME . '[' . $args['label_for'] . ']' ); ?>"
		value="0">
	<input type="checkbox"
		id="<?php echo esc_attr( $args['label_for'] ); ?>"
		name="<?php echo esc_attr( LC_PUBLISH_OPTION_NAME . '[' . $args['label_for'] . ']' ); ?>"
		value="1"
	<?php isset( $option[ $args['label_for'] ] ) && checked( $option[ $args['label_for'] ] ); ?>
	>
	<label for="<?php echo esc_attr( $args['label_for'] ); ?>">
		<?php esc_html_e( 'Auto save draft to matters', LC_PLUGIN_SLUG ); ?>
	</label>
	<?php
}

function likecoin_add_site_matters_auto_publish( $args ) {
	$option = get_option( LC_BUTTON_OPTION_NAME );
	?>
	<input type='hidden'
		name="<?php echo esc_attr( LC_BUTTON_OPTION_NAME . '[' . $args['label_for'] . ']' ); ?>"
		value="0">
	<input type="checkbox"
		id="<?php echo esc_attr( $args['label_for'] ); ?>"
		name="<?php echo esc_attr( LC_BUTTON_OPTION_NAME . '[' . $args['label_for'] . ']' ); ?>"
		value="1"
	<?php isset( $option[ $args['label_for'] ] ) && checked( $option[ $args['label_for'] ] ); ?>
	>
	<label for="<?php echo esc_attr( $args['label_for'] ); ?>">
		<?php esc_html_e( 'Auto publish to matters', LC_PLUGIN_SLUG ); ?>
	</label>
	<?php
}
