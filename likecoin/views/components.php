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
 * Add option menu
 *
 * @param boolean| $has_login_button Render the login button or not.
 */
function likecoin_add_web3_section( $has_login_button ) {
	?><section class="likecoin loading" style="display: none">
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
		<?php if ( $has_login_button ) { ?>
			<div class="likecoin webThreeError needLogin" style="display: none">
				<a class="likeCoinButton loginBtn">
					<?php esc_html_e( 'Login to get LikeCoin ID', LC_PLUGIN_SLUG ); ?>
				</a>
			</div>
		<?php } ?>
	</section>
	<?php
}
