<?php
/**
 * LikeCoin view components
 *
 * LikeCoin Plugin reusable view components
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
 * Add loading section
 */
function likecoin_add_loading_section() {
	?>
	<section class="likecoin loading" style="display: none">
		<?php esc_html_e( 'Loading...', LC_PLUGIN_SLUG ); ?>
	</section>
	<?php
}

/**
 * Add option menu
 *
 * @param boolean| $has_login_button Render the login button or not.
 */
function likecoin_add_web3_section( $has_login_button ) {
	likecoin_add_loading_section();
	?>
	<section class="likecoin loginSection">
		<div class="likecoin centerContainer webThreeError needMetaMask" style="display: none">
			<h3>
				<?php
				echo esc_html__( 'Please install' ) . '&nbsp<a href="https://metamask.io/" target="_blank">' . esc_html__( 'MetaMask Plugin' ) . '</a>';
				?>
			</h3>
		</div>
		<div class="likecoin centerContainer webThreeError needMainNet" style="display: none">
			<h3>
				<?php esc_html_e( 'Please switch to Main Network', LC_PLUGIN_SLUG ); ?>
			</h3>
			<img src="<?php echo esc_attr( LC_URI . 'assets/img/mainnet.png' ); ?>">
		</div>
		<div class="likecoin centerContainer webThreeError needUnlock" style="display: none">
			<h3>
				<?php esc_html_e( 'Please unlock your wallet', LC_PLUGIN_SLUG ); ?>
			</h3>
			<img src="<?php echo esc_attr( LC_URI . 'assets/img/unlock.png' ); ?>">
		</div>
		<div class="likecoin centerContainer webThreeError needLikeCoinId" style="display: none">
			<a class="likeCoinButton" href="https://like.co/in/register" target="_blank">
				<?php esc_html_e( 'Please register a LikeCoin ID first', LC_PLUGIN_SLUG ); ?>
			</a>
		</div>
		<?php if ( $has_login_button ) { ?>
			<div class="likecoin centerContainer webThreeError needLogin" style="display: none">
				<a class="likeCoinButton loginBtn">
					<?php esc_html_e( 'Login to get LikeCoin ID', LC_PLUGIN_SLUG ); ?>
				</a>
			</div>
		<?php } ?>
	</section>
	<?php
}

/**
 * Add the LikeCoin ID table UI
 *
 * @param array| $args display option for LikeCoin ID table.
 */
function likecoin_add_likecoin_info_table( $args ) {
	$likecoin_id                = $args->likecoin_id;
	$likecoin_display_name      = $args->likecoin_display_name;
	$likecoin_wallet            = $args->likecoin_wallet;
	$likecoin_id_name           = $args->likecoin_id_name;
	$likecoin_display_name_name = $args->likecoin_display_name_name;
	$likecoin_wallet_name       = $args->likecoin_wallet_name;
	$has_likecoin_id            = strlen( $likecoin_id ) > 0;
	?>
	<table  class="form-table">
		<tr>
			<td><?php esc_html_e( 'LikeCoin ID', LC_PLUGIN_SLUG ); ?></td>
			<td><?php esc_html_e( 'Display Name', LC_PLUGIN_SLUG ); ?></td>
			<td><?php esc_html_e( 'Wallet', LC_PLUGIN_SLUG ); ?></td>
			<td></td>
		</tr>
		<tr>
			<td>
				<span id="likecoinId" class="likecoinId"><?php echo esc_html( $likecoin_id ? $likecoin_id : '-' ); ?></span>
				<input type="hidden"
					class="likecoinId"
					name="<?php echo esc_attr( $likecoin_id_name ); ?>"
					value="<?php echo esc_attr( $likecoin_id ); ?>"
				>
			</td>
			<td>
				<span id="likecoinDisplayName"><?php echo esc_html( $likecoin_display_name ? $likecoin_display_name : '-' ); ?></span>
				<input type="hidden"
					class="likecoinDisplayName"
					name="<?php echo esc_attr( $likecoin_display_name_name ); ?>"
					value="<?php echo esc_attr( $likecoin_display_name ); ?>"
				>
			</td>
			<td>
				<span id="likecoinWallet"><?php echo esc_html( $likecoin_wallet ? $likecoin_wallet : '-' ); ?></span>
				<input type="hidden"
					class="likecoinWallet"
					name="<?php echo esc_attr( $likecoin_wallet_name ); ?>"
					value="<?php echo esc_attr( $likecoin_wallet ); ?>"
				>
			</td>
			<td>
				<?php if ( $has_likecoin_id ) { ?>
					<input id="likecoinChangeBtn"
						type="button"
						value="<?php esc_attr_e( 'Change', LC_PLUGIN_SLUG ); ?>"
					>
					<input id="likecoinLogoutBtn"
						type="button"
						value="<?php esc_attr_e( 'Disconnect', LC_PLUGIN_SLUG ); ?>"
					>
				<?php } else { ?>
					<input id="likecoinChangeBtn"
						type="button"
						value="<?php esc_attr_e( 'Connect', LC_PLUGIN_SLUG ); ?>"
					>
				<?php } ?>
			</td>
		</tr>
	</table>
	<?php
}
