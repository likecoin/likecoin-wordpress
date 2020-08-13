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
function likecoin_add_error_section( $has_login_button ) {
	likecoin_add_loading_section();
	?>
	<section class="likecoin loginSection">
		<div class="likecoin likecoinError userNotFound" style="display: none">
			<h4>
				<?php esc_html_e( 'Liker ID not found', LC_PLUGIN_SLUG ); ?>
			</h4>
		</div>
		<div class="likecoin likecoinError findMyLikerId" style="display: none">
			<h4>
				<?php esc_html_e( 'Please find your Liker ID as shown below after signing in or login in like.co', LC_PLUGIN_SLUG ); ?>
			</h4>
			<img src="<?php echo esc_attr( LC_URI . 'assets/img/likecoin.png' ); ?>">
		</div>
	</section>
	<?php
}

/**
 * Add the Liker ID table UI
 *
 * @param array|   $info display option for Liker ID table.
 * @param boolean| $editable Show action buttons or not.
 * @param boolean| $disconnectable Show disconnect button or not.
 */
function likecoin_add_likecoin_info_table( $info, $editable = true, $disconnectable = true ) {
	$likecoin_id                = $info['likecoin_id'];
	$likecoin_display_name      = $info['likecoin_display_name'];
	$likecoin_wallet            = $info['likecoin_wallet'];
	$likecoin_wallet            = preg_replace( '/((?:cosmos1|0x).{4}).*(.{10})/', '$1...$2', $likecoin_wallet );
	$likecoin_avatar            = $info['likecoin_avatar'];
	$likecoin_id_name           = $info['likecoin_id_name'];
	$likecoin_display_name_name = $info['likecoin_display_name_name'];
	$likecoin_wallet_name       = $info['likecoin_wallet_name'];
	$likecoin_avatar_name       = $info['likecoin_avatar_name'];
	$has_likecoin_id            = strlen( $likecoin_id ) > 0;
	?>
	<table class="form-table likecoinTable">
		<tr>
			<th><span><?php esc_html_e( 'Liker ID', LC_PLUGIN_SLUG ); ?></span></th>
			<th><?php esc_html_e( 'Display Name', LC_PLUGIN_SLUG ); ?></th>
			<th><?php esc_html_e( 'Wallet', LC_PLUGIN_SLUG ); ?></th>
			<?php
			if ( $editable ) {
				echo '<th class="actions"></th>';}
			?>
		</tr>
		<tr>
			<td>
				<div class="avatarWrapper">
					<img id="likecoinAvatar"
						class="likecoinAvatar"
						src="<?php echo esc_url( $likecoin_avatar ? $likecoin_avatar : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=' ); ?>">
					<input type="hidden"
						class="likecoinAvatar"
						name="<?php echo esc_attr( $likecoin_avatar_name ); ?>"
						value="<?php echo esc_url( $likecoin_avatar ); ?>"
					>
					<a id="likecoinId"
						href="<?php echo esc_url( 'https://like.co/' . $likecoin_id ); ?>"
						class="likecoin likecoinId"
						style="<?php echo $has_likecoin_id ? '' : 'display: none'; ?>"
					>
						<?php echo esc_html( $likecoin_id ? $likecoin_id : '' ); ?></a>
					<input type="hidden"
						name="<?php echo esc_attr( $likecoin_id_name ); ?>"
						value="<?php echo esc_attr( $likecoin_id ); ?>"
						class="likecoin likecoinId"
					>
					<div class="likecoin likecoinIdInputArea" style="<?php echo esc_attr( $likecoin_id ? 'display: none;' : '' ); ?>">
						<input
							type="text"
							id="likecoinIdInputBox"
							class="likecoin likecoinIdInputBox"
						>
						<p><a
								id="likecoinInputLabel"
								class="likecoin likecoinInputLabel"
								target="blank"
								rel="noopenner"
								href="https://like.co/in"
							>
								<?php esc_html_e( 'Sign Up / Find my Liker ID', LC_PLUGIN_SLUG ); ?>
							</a></p>
					</div>
				</div>
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
			<?php if ( $editable ) { ?>
			<td class="actions">
				<?php if ( $has_likecoin_id ) { ?>
				<span class="actionWrapper">
					<a target="_blank"
						id="likecoinChangeBtn"
						type="button">
						<?php esc_attr_e( 'Change', LC_PLUGIN_SLUG ); ?>
					</a>
				</span>
					<?php if ( $disconnectable ) { ?>
				<span class="actionWrapper">
					<a target="_blank"
						id="likecoinLogoutBtn"
						type="button">
						<?php esc_attr_e( 'Disconnect', LC_PLUGIN_SLUG ); ?>
					</a>
				</span>
					<?php } ?>
			<?php } ?>
			</td>
			<?php } ?>
		</tr>
	</table>
	<?php
}

function likecoin_add_matters_login_table( $info ) {
	$matters_access_token      = $info['matters_access_token'];
	$matters_access_token_name = $info['matters_access_token_name'];
	$has_matters_access_token  = strlen( $matters_access_token ) > 0;
	?>
	<table class="form-table">
		<tr>
			<td>
				<label for="matters_id"><?php esc_attr_e( 'Matters login email', LC_PLUGIN_SLUG ); ?></label>
			</td>
			<td>
				<label for="matters_password"><?php esc_attr_e( 'Password', LC_PLUGIN_SLUG ); ?></label>
			</td>
		</tr>
		<tr>
			<td>
				<input type="text" name="matters_id" id="matters_id" value=""><br>
			</td>
			<td>
				<input type="password" name="matters_password" id="matters_password" value=""><br>
			</td>
		</tr>
		<tr>
			<td class="actions">
				<span class="actionWrapper">
					<a target="_blank"
						id="mattersIdLoginBtn"
						href="#"
						type="button">
						<?php esc_attr_e( 'Login', LC_PLUGIN_SLUG ); ?>
					</a>
				</span>
			</td>
		</tr>
	</table>
		<input type="hidden"
			name="<?php echo esc_attr( $matters_access_token_name ); ?>"
			id="<?php echo esc_attr( $matters_access_token_name ); ?>"
			value="<?php echo esc_attr( $matters_access_token ); ?>"
		>
	<hr>
	<div>
		<span><?php esc_html_e( 'Matters Login Status: ', LC_PLUGIN_SLUG ); ?></span>
		<span><b><?php $has_matters_access_token ? esc_html_e( 'Logged in', LC_PLUGIN_SLUG ) : esc_html_e( 'Not connected', LC_PLUGIN_SLUG ); ?></b></span>
		<span ></span>
		<?php if ( $has_matters_access_token ) { ?>
			<span class="actionWrapper">
						<a target="_blank"
							id="mattersIdLogoutButton"
							href="#"
							type="button">
							<?php esc_attr_e( 'Logout', LC_PLUGIN_SLUG ); ?>
						</a>
		</span>
		<?php } ?>
	</div>
	<?php
}
