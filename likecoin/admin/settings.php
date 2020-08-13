<?php
/**
 * LikeCoin admin settings
 *
 * Define settings UI injection and ultilies
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
 * Settings api validation function
 *
 * @param array| $option The form input data for options api.
 */
function likecoin_settings_validation( $option ) {
	if ( ! empty( $option[ LC_OPTION_SITE_BUTTON_ENABLED ] ) && empty( $option[ LC_OPTION_SITE_LIKECOIN_USER ][ LC_LIKECOIN_USER_ID_FIELD ] ) ) {
		add_settings_error(
			'lc_settings_messages',
			'missing_site_id',
			__( 'Site Liker ID is missing', LC_PLUGIN_SLUG ),
			'error'
		);
		return get_option( LC_BUTTON_OPTION_NAME );
	}
	add_settings_error(
		'lc_settings_messages',
		'updated',
		__( 'Settings Saved', LC_PLUGIN_SLUG ),
		'updated'
	);
	return $option;
}

/**
 * Init settings api for plugin
 */
function likecoin_init_settings() {
	include_once dirname( __FILE__ ) . '/views/site-options.php';

	register_setting( LC_BUTTON_SITE_OPTIONS_PAGE, LC_BUTTON_OPTION_NAME, 'likecoin_settings_validation' );

	$site_likecoin_id_options_section = 'lc_site_likecoin_id_options';
	$site_likebutton_options_section  = 'lc_site_likebutton_options';

	add_settings_section(
		$site_likecoin_id_options_section,
		__( 'Site Liker ID', LC_PLUGIN_SLUG ),
		null,
		LC_BUTTON_SITE_OPTIONS_PAGE
	);

	add_settings_section(
		$site_likebutton_options_section,
		__( 'Site LikeCoin button display setting', LC_PLUGIN_SLUG ),
		null,
		LC_BUTTON_SITE_OPTIONS_PAGE
	);

	add_settings_field(
		LC_OPTION_SITE_BUTTON_ENABLED,
		__( 'Enable site Liker ID', LC_PLUGIN_SLUG ),
		'likecoin_add_site_likecoin_id_toggle',
		LC_BUTTON_SITE_OPTIONS_PAGE,
		$site_likecoin_id_options_section,
		array(
			'label_for' => LC_OPTION_SITE_BUTTON_ENABLED,
		)
	);

	add_settings_field(
		'lc_site_likecoin_id_table',
		__( 'Site Liker ID', LC_PLUGIN_SLUG ),
		'likecoin_add_site_likecoin_id_table',
		LC_BUTTON_SITE_OPTIONS_PAGE,
		$site_likecoin_id_options_section,
		array(
			'label_for' => LC_OPTION_SITE_LIKECOIN_USER,
			'class'     => 'site_liekcoin_id_table',
		)
	);

	add_settings_field(
		LC_OPTION_BUTTON_DISPLAY_OPTION,
		__( 'Display option', LC_PLUGIN_SLUG ),
		'likecoin_add_site_likebutton_display_option',
		LC_BUTTON_SITE_OPTIONS_PAGE,
		$site_likebutton_options_section,
		array(
			'label_for' => LC_OPTION_BUTTON_DISPLAY_OPTION,
		)
	);

	add_settings_field(
		LC_OPTION_BUTTON_DISPLAY_AUTHOR_OVERRIDE,
		__( 'Allow per Post option', LC_PLUGIN_SLUG ),
		'likecoin_add_site_likebutton_allow_author_override',
		LC_BUTTON_SITE_OPTIONS_PAGE,
		$site_likebutton_options_section,
		array(
			'label_for' => LC_OPTION_BUTTON_DISPLAY_AUTHOR_OVERRIDE,
		)
	);
}
