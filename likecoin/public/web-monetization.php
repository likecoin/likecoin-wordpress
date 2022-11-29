<?php
/**
 * LikeCoin web monetization
 *
 * Add header for web monetization standard
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

/**
 * Require shared functions
 */
require_once dirname( __FILE__ ) . '/../includes/likecoin.php';

/**
 * Add web monetization header if payment pointer exists
 */
function likecoin_add_web_monetization_header() {
	$option          = get_option( LC_MONETIZATION_OPTION_NAME );
	$payment_pointer = isset( $option[ LC_OPTION_SITE_MONETIZATION_PAYMENT_POINTER ] ) ? $option[ LC_OPTION_SITE_MONETIZATION_PAYMENT_POINTER ] : '';

	if ( ! empty( $payment_pointer ) ) {
		?>
			<meta
				name="monetization"
				content="<?php echo esc_attr( $payment_pointer ); ?>">
		<?php
	}
}
