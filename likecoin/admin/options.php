<?php
/**
 * LikeCoin admin options
 *
 * Define option UI injection and ultilies
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
 * Displays option menu
 */
function likecoin_display_top_options_page() {
	include_once dirname( __FILE__ ) . '/views/site-options.php';
	include_once dirname( __FILE__ ) . '/views/user-options.php';
	include_once dirname( __FILE__ ) . '/views/publish-options.php';
	include_once dirname( __FILE__ ) . '/views/sponsor.php';
	include_once dirname( __FILE__ ) . '/views/web-monetization.php';

	add_menu_page(
		__( 'LikeCoin', LC_PLUGIN_SLUG ),
		__( 'LikeCoin', LC_PLUGIN_SLUG ),
		'manage_options',
		LC_BUTTON_SITE_OPTIONS_PAGE,
		'likecoin_add_site_options_page',
		// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped,WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents,WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
		'data:image/svg+xml;base64,' . base64_encode( file_get_contents( LC_DIR . 'assets/icon/likecoin.svg' ) ),
		// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped,WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents,WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
		50
	);

	add_submenu_page(
		LC_BUTTON_SITE_OPTIONS_PAGE,
		__( 'LikeCoin', LC_PLUGIN_SLUG ),
		__( 'Plugin Setting', LC_PLUGIN_SLUG ),
		'manage_options',
		LC_BUTTON_SITE_OPTIONS_PAGE,
		'likecoin_add_site_options_page'
	);

	// hide if site Liker ID enabled and user is not admin.
	$option = get_option( LC_BUTTON_OPTION_NAME );
	if ( empty( $option[ LC_OPTION_SITE_BUTTON_ENABLED ] ) || current_user_can( 'manage_options' ) ) {
		add_submenu_page(
			LC_BUTTON_SITE_OPTIONS_PAGE,
			__( 'LikeCoin', LC_PLUGIN_SLUG ),
			__( 'Your LikeCoin Button', LC_PLUGIN_SLUG ),
			'publish_posts',
			LC_BUTTON_USER_OPTIONS_PAGE,
			'likecoin_add_user_options_page'
		);
	}

	add_submenu_page(
		LC_BUTTON_SITE_OPTIONS_PAGE,
		__( 'LikeCoin', LC_PLUGIN_SLUG ),
		__( 'Publish Setting', LC_PLUGIN_SLUG ),
		'manage_options',
		LC_PUBLISH_SITE_OPTIONS_PAGE,
		'likecoin_add_publish_options_page'
	);

	add_submenu_page(
		LC_BUTTON_SITE_OPTIONS_PAGE,
		__( 'LikeCoin', LC_PLUGIN_SLUG ),
		__( 'Web Monetization (beta)', LC_PLUGIN_SLUG ),
		'manage_options',
		LC_MONETIZATION_SITE_OPTIONS_PAGE,
		'likecoin_add_web_monetization_options_page'
	);

	add_submenu_page(
		LC_BUTTON_SITE_OPTIONS_PAGE,
		__( 'LikeCoin', LC_PLUGIN_SLUG ),
		__( 'Sponsor LikeCoin', LC_PLUGIN_SLUG ),
		'publish_posts',
		LC_SPONSOR_PAGE,
		'likecoin_add_sponsor_page'
	);

	global $submenu;
	array_push(
		$submenu[ LC_BUTTON_SITE_OPTIONS_PAGE ],
		array(
			__( 'Become a Civic Liker', LC_PLUGIN_SLUG ),
			'publish_posts',
			'https://liker.land/civic?utm_source=wp-plugin',
		)
	);
}
