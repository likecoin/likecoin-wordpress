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
