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
	echo '<form action="options.php" method="post">';
	// output security fields for the registered setting "wporg"
	settings_fields( 'lc_site_options' );
	// output setting sections and their fields
	// (sections are registered for "wporg", each field is registered to a specific	section)
	// echo '<table>';
	// do_settings_fields( 'lc_site_options', 'lc_site_likecoin_id_options' );
	// echo '</table>';
	do_settings_sections( 'lc_site_options' );
	// output save settings button
	submit_button( 'Save Settings' );
	echo '</form></div>';
}

/**
 * Add the likecoin plugin site options menu
 */

function likecoin_add_site_likecoin_id_toggle( $args ) {
	// get the value of the setting we've registered with register_setting()
	$options = get_option( 'wporg_options' );
	// output the field
	?>
  	<input type="checkbox"
  	name="vehicle"
  	value="Bike"
  	>
  	<label for="vehicle">Only one LikeCoin ID</label>
	<?php
}

/**
 * Add the likecoin plugin site options menu
 */

function likecoin_add_site_likecoin_id_table( $args ) {
	// get the value of the setting we've registered with register_setting()
	$options = get_option( 'wporg_options' );
	// output the field
	?>
	<table>
		<tr>
			<td><?php esc_html_e( 'LikeCoin ID', LC_PLUGIN_SLUG ); ?></td>
			<td><?php esc_html_e( 'Display Name', LC_PLUGIN_SLUG ); ?></td>
			<td><?php esc_html_e( 'Wallet', LC_PLUGIN_SLUG ); ?></td>
			<td></td>
		</tr>
		<tr>
			<td>-</td>
			<td>-</td>
			<td>-</td>
			<td>Connect</td>
		</tr>
	</table>
	<?php
}

function wporg_section_developers_cb( $args ) {
	?>
	<p id="<?php echo esc_attr( $args['id'] ); ?>"><?php esc_html_e( 'Follow the white rabbit.', 'wporg' ); ?></p>
	<?php
}
