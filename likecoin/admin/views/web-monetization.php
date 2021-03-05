<?php
/**
 * LikeCoin Web Monetization views
 *
 * Function for modifying post HTML content to prepare for upload to matters
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
 * Add the monetization payment pointer page
 *
 * @param array| $args settings field extra argument, e.g. label_for and class.
 */
function likecoin_add_site_payment_pointer_settings( $args ) {
	$option = get_option( LC_MONETIZATION_OPTION_NAME );
	?>
		<input type="text"
			name="<?php echo esc_attr( LC_MONETIZATION_OPTION_NAME . '[' . $args['label_for'] . ']' ); ?>"
			value="<?php echo esc_attr( $option[ $args['label_for'] ] ); ?>"
			placeholder="$wallet.example.com/alice"
		>
			<a rel="noopener noreferrer" target="_blank" href="https://webmonetization.org/docs/ilp-wallets/">What is payment pointer?</a>
	<?php
}

/**
 * Add web monetization option menu
 */
function likecoin_add_web_monetization_options_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	settings_errors( 'lc_settings_messages' );
	?>
	<div class="wrap likecoin">
	<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
	<?php likecoin_add_web_monetization_introduction(); ?>
	<form action="options.php" method="post">
	<?php
		settings_fields( LC_MONETIZATION_SITE_OPTIONS_PAGE );
		do_settings_sections( LC_MONETIZATION_SITE_OPTIONS_PAGE );
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
 * Generate web monetization introduction
 */
function likecoin_add_web_monetization_introduction() {
	?>
	<div>
	<p>
		<h2><?php esc_html_e( 'What is Web Monetization?' ); ?></h2>
	</p>
	<p>
	<?php
	printf(
		/* translators: %s is the link to webmonetization.org */
		esc_html__( '%s is an API that allows websites to request small payments from users facilitated by the browser and the user\'s Web Monetization provider.', LC_PLUGIN_SLUG ),
		sprintf(
			'<a rel="noopener" target="_blank" href="%s">%s</a>',
			esc_url( 'https://webmonetization.org/' ),
			esc_html__( 'Web Monetization', LC_PLUGIN_SLUG )
		)
	);
	echo '</p><p>';
	printf(
		/* translators: %1%s is the link to payment pointer guide, %2%s is the link to likecoin web monetization community page */
		esc_html__( 'You would need to register a %1$s to enable web monetization. However LikeCoin is working hard to integrate web monetization natively into our ecosystem. Follow our latest progress %2$s!' ),
		sprintf(
			'<a rel="noopener" target="_blank" href="%s">%s</a>',
			esc_url( 'https://webmonetization.org/docs/ilp-wallets' ),
			esc_html__( 'payment pointer', LC_PLUGIN_SLUG )
		),
		sprintf(
			'<a rel="noopener" target="_blank" href="%s">%s</a>',
			esc_url( 'https://community.webmonetization.org/likecoinprotocol' ),
			esc_html__( 'here', LC_PLUGIN_SLUG )
		)
	);
	echo '</p><br></div>';
}
