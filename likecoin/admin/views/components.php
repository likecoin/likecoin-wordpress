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
					<a
						id="likecoinId"
						rel="noopener"
						target="_blank"
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
								rel="noopener"
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

/**
 * Add generic settings check box
 *
 * @param array| $args settings field extra argument, e.g. label_for and class.
 */
function likecoin_add_generic_checkbox( $args ) {
	$option = get_option( $args['option_name'] );
	?>
	<input type='hidden'
		name="<?php echo esc_attr( $args['option_name'] . '[' . $args['label_for'] . ']' ); ?>"
		value="0">
	<input type="checkbox"
		id="<?php echo esc_attr( $args['label_for'] ); ?>"
		name="<?php echo esc_attr( $args['option_name'] . '[' . $args['label_for'] . ']' ); ?>"
		value="1"
	<?php isset( $option[ $args['label_for'] ] ) && checked( $option[ $args['label_for'] ] ); ?>
	>
	<label for="<?php echo esc_attr( $args['label_for'] ); ?>">
		<?php echo esc_html( $args['text'] ); ?>
	</label>
	<?php
}



function likecoin_add_iscn_badge_dropdown( $args ) {
	$option = get_option( $args['option_name'] );
	?>
	<select id="<?php echo esc_attr( $args['label_for'] ); ?>"
		name="<?php echo esc_attr( $args['option_name'] . '[' . $args['label_for'] . ']' ); ?>"
	>
	<option value="light"
		<?php echo isset( $option[ $args['label_for'] ] ) ? ( selected( $option[ $args['label_for'] ], 'light', false ) ) : ( '' ); ?>>
		<?php esc_html_e( 'Light Mode', LC_PLUGIN_SLUG ); ?>
	</option>
	<option value="dark"
		<?php echo isset( $option[ $args['label_for'] ] ) ? ( selected( $option[ $args['label_for'] ], 'dark', false ) ) : ( '' ); ?>>
		<?php esc_html_e( 'Dark Mode', LC_PLUGIN_SLUG ); ?>
	</option>
	<option value="hidden"
		<?php echo isset( $option[ $args['label_for'] ] ) ? ( selected( $option[ $args['label_for'] ], 'hidden', false ) ) : ( '' ); ?>>
		<?php esc_html_e( 'Hidden', LC_PLUGIN_SLUG ); ?>
	</option>

	</select>
	<?php
}