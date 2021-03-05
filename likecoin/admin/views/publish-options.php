<?php
/**
 * LikeCoin Publish Options Menu
 *
 * LikeCoin Plugin options submenu for publish settings
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
 * Add Matters login table
 */
function likecoin_add_matters_login_table() {
	?>
	<form action="admin-ajax.php">
		<input type="hidden" name="action" value="likecoin_matters_login">
		<?php wp_nonce_field( 'likecoin_matters_login' ); ?>
		<table class="form-table">
			<tr>
				<td>
					<label for="matters_id"><?php esc_attr_e( 'Matters login email', LC_PLUGIN_SLUG ); ?></label>
					<input type="text" name="<?php echo esc_attr( LC_OPTION_MATTERS_ID_FIELD ); ?>" id="matters_id" value="">
				</td>
				<td>
					<label for="matters_password"><?php esc_attr_e( 'Password', LC_PLUGIN_SLUG ); ?></label>
					<input type="password" name="<?php echo esc_attr( LC_OPTION_MATTERS_PASSWORD_FIELD ); ?>" id="matters_password" value="">
				</td>
			</tr>
			<tr>
				<td class="actions">
					<span class="actionWrapper">
						<input
							id="lcMattersIdLoginBtn"
							type="submit"
							value=<?php esc_attr_e( 'Login', LC_PLUGIN_SLUG ); ?>>
						</a>
					</span>
				</td>
				<td><span id="lcMattersErrorMessage"></span></td>
			</tr>
	</table>
	</form>
	<?php
}

/**
 * Add Matters login status section
 *
 * @param array| $info display option for Matters table.
 */
function likecoin_add_matters_login_status( $info ) {
	$matters_access_token            = $info['matters_access_token'];
	$matters_access_token_field_name = $info['matters_access_token_field_name'];
	$matters_id                      = $info['matters_id'];
	$matters_id_field_name           = $info['matters_id_field_name'];
	$has_matters_access_token        = strlen( $matters_access_token ) > 0;
	$has_matters_id                  = strlen( $matters_id ) > 0;
	?>
	<input type="hidden"
		name="<?php echo esc_attr( $matters_id_field_name ); ?>"
		id="<?php echo esc_attr( $matters_id_field_name ); ?>"
		value="<?php echo esc_attr( $matters_id ); ?>"
		>
	<input type="hidden"
		name="<?php echo esc_attr( $matters_access_token_field_name ); ?>"
		id="<?php echo esc_attr( $matters_access_token_field_name ); ?>"
		value="<?php echo esc_attr( $matters_access_token ); ?>"
		>
	<div>
	<span><b>
	<?php
	if ( $has_matters_access_token ) {
		if ( $has_matters_id ) {
			esc_html_e( 'Logged in as ', LC_PLUGIN_SLUG );
			echo '<a rel="noopener" target="_blank" href="' . esc_url( 'https://matters.news/@' . $matters_id ) . '">' . esc_html( $matters_id ) . '</a>';
		} else {
			esc_html_e( 'Logged in', LC_PLUGIN_SLUG );
		}
	} else {
		esc_html_e( 'Not connected', LC_PLUGIN_SLUG );
	}
	?>
	</b></span>
	<span ></span>
		<?php if ( $has_matters_access_token ) { ?>
		<span class="actionWrapper">
					<a target="_blank"
						id="lcMattersIdLogoutButton"
						href="#"
						type="button">
						<?php esc_attr_e( 'Logout', LC_PLUGIN_SLUG ); ?>
					</a>
		</span>
		<?php } ?>
	</div>
	<?php
}

/**
 * Add option menu
 */
function likecoin_add_publish_options_page() {
	include_once 'matters.php';

	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	settings_errors( 'lc_settings_messages' );
	?>
	<div class="wrap likecoin">
	<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
	<?php likecoin_add_matters_introduction(); ?>
	<?php likecoin_add_site_matters_login_table(); ?>
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
 * Add the Matters login table section
 */
function likecoin_add_site_matters_login_table() {
	?>
	<h2><?php esc_html_e( 'Login with Matters ID', LC_PLUGIN_SLUG ); ?></h2>
	<?php
	likecoin_add_matters_login_table();
}

/**
 * Add the Matters login status page
 *
 * @param array| $args settings field extra argument, e.g. label_for and class.
 */
function likecoin_add_site_matters_login_status( $args ) {
	$option = get_option( LC_PUBLISH_OPTION_NAME );

	$matters_id                      = isset( $option[ $args['label_for'] ] [ LC_MATTERS_ID_FIELD ] ) ? $option[ $args['label_for'] ] [ LC_MATTERS_ID_FIELD ] : '';
	$matters_access_token            = isset( $option[ $args['label_for'] ] [ LC_MATTERS_USER_ACCESS_TOKEN_FIELD ] ) ? $option[ $args['label_for'] ] [ LC_MATTERS_USER_ACCESS_TOKEN_FIELD ] : '';
	$matters_id_field_name           = LC_PUBLISH_OPTION_NAME . '[' . $args['label_for'] . '][' . LC_MATTERS_ID_FIELD . ']';
	$matters_access_token_field_name = LC_PUBLISH_OPTION_NAME . '[' . $args['label_for'] . '][' . LC_MATTERS_USER_ACCESS_TOKEN_FIELD . ']';

	$params = array(
		'matters_id'                      => $matters_id,
		'matters_access_token'            => $matters_access_token,
		'matters_id_field_name'           => $matters_id_field_name,
		'matters_access_token_field_name' => $matters_access_token_field_name,
	);
	likecoin_add_matters_login_status( $params );
	wp_enqueue_script( 'lc_js_site_options', LC_URI . 'assets/js/dist/admin/likecoin_site_publish_options.js', array( 'wp-polyfill', 'jquery', 'underscore' ), LC_PLUGIN_VERSION, true );
	wp_localize_script(
		'lc_js_site_options',
		'WP_CONFIG',
		array(
			'mattersAccessTokenFieldId' => esc_attr( $matters_access_token_field_name ),
			'mattersIdFieldId'          => esc_attr( $matters_id_field_name ),
		)
	);
}
