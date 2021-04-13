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
 * Button settings API validation function
 *
 * @param array| $option The form input data for options api.
 */
function likecoin_plugin_settings_validation( $option ) {
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
 * Add LikeCoin button related settings sections
 */
function likecoin_add_button_settings() {
	register_setting( LC_BUTTON_SITE_OPTIONS_PAGE, LC_BUTTON_OPTION_NAME, 'likecoin_plugin_settings_validation' );

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
		'likecoin_add_generic_checkbox',
		LC_BUTTON_SITE_OPTIONS_PAGE,
		$site_likebutton_options_section,
		array(
			'option_name' => LC_BUTTON_OPTION_NAME,
			'label_for'   => LC_OPTION_BUTTON_DISPLAY_AUTHOR_OVERRIDE,
			'text'        => __( 'Allow editors to customize display setting per post', LC_PLUGIN_SLUG ),
		)
	);
}

/**
 * Publish settings API validation function
 *
 * @param array| $option The form input data for options api.
 */
function likecoin_publish_settings_validation( $option ) {
	// TODO: check for user auth before enabling draft/publish.
	add_settings_error(
		'lc_settings_messages',
		'updated',
		__( 'Settings Saved', LC_PLUGIN_SLUG ),
		'updated'
	);
	return $option;
}

/**
 * Add publish related settings sections
 */
function likecoin_add_publish_settings() {

	register_setting( LC_PUBLISH_SITE_OPTIONS_PAGE, LC_PUBLISH_OPTION_NAME, 'likecoin_publish_settings_validation' );

	$site_matters_id_options_section      = 'lc_site_matters_id_options';
	$site_matters_publish_options_section = 'lc_site_matters_publish_options';
	$site_iscn_badge_section              = 'lc_iscn_badge_options';

	add_settings_section(
		$site_matters_id_options_section,
		__( 'Matters connection status', LC_PLUGIN_SLUG ),
		null,
		LC_PUBLISH_SITE_OPTIONS_PAGE
	);

	add_settings_section(
		$site_matters_publish_options_section,
		__( 'Publish to Matters', LC_PLUGIN_SLUG ),
		null,
		LC_PUBLISH_SITE_OPTIONS_PAGE
	);

	add_settings_section(
		$site_iscn_badge_section,
		__( 'Publish to ISCN', LC_PLUGIN_SLUG ),
		null,
		LC_PUBLISH_SITE_OPTIONS_PAGE
	);

	add_settings_field(
		LC_OPTION_SITE_MATTERS_USER,
		__( 'Connection status', LC_PLUGIN_SLUG ),
		'likecoin_add_site_matters_login_status',
		LC_PUBLISH_SITE_OPTIONS_PAGE,
		$site_matters_id_options_section,
		array(
			'label_for' => LC_OPTION_SITE_MATTERS_USER,
		)
	);

	$save_draft_to_matters_text = __( 'Auto save draft to Matters', LC_PLUGIN_SLUG );
	add_settings_field(
		LC_OPTION_SITE_MATTERS_AUTO_DRAFT,
		$save_draft_to_matters_text,
		'likecoin_add_generic_checkbox',
		LC_PUBLISH_SITE_OPTIONS_PAGE,
		$site_matters_publish_options_section,
		array(
			'option_name' => LC_PUBLISH_OPTION_NAME,
			'label_for'   => LC_OPTION_SITE_MATTERS_AUTO_DRAFT,
			'text'        => $save_draft_to_matters_text,
		)
	);

	$publish_to_matters_text = __( 'Auto publish post to Matters', LC_PLUGIN_SLUG );
	add_settings_field(
		LC_OPTION_SITE_MATTERS_AUTO_PUBLISH,
		$publish_to_matters_text,
		'likecoin_add_generic_checkbox',
		LC_PUBLISH_SITE_OPTIONS_PAGE,
		$site_matters_publish_options_section,
		array(
			'option_name' => LC_PUBLISH_OPTION_NAME,
			'label_for'   => LC_OPTION_SITE_MATTERS_AUTO_PUBLISH,
			'text'        => $publish_to_matters_text,
		)
	);

	$footer_link_text = __( 'Add post link in footer', LC_PLUGIN_SLUG );
	add_settings_field(
		LC_OPTION_SITE_MATTERS_ADD_FOOTER_LINK,
		$footer_link_text,
		'likecoin_add_generic_checkbox',
		LC_PUBLISH_SITE_OPTIONS_PAGE,
		$site_matters_publish_options_section,
		array(
			'option_name' => LC_PUBLISH_OPTION_NAME,
			'label_for'   => LC_OPTION_SITE_MATTERS_ADD_FOOTER_LINK,
			'text'        => $footer_link_text,
		)
	);

	$iscn_badge_text = __( 'Show ISCN badge in post', LC_PLUGIN_SLUG );
	add_settings_field(
		LC_OPTION_SITE_ISCN_BADGE_DROPDOWN_STYLE,
		$iscn_badge_text,
		'likecoin_add_iscn_badge_dropdown',
		LC_PUBLISH_SITE_OPTIONS_PAGE,
		$site_iscn_badge_section,
		array(
			'option_name' => LC_PUBLISH_OPTION_NAME,
			'label_for' => LC_OPTION_SITE_ISCN_BADGE_DROPDOWN_STYLE,
		)	
	);
}

/**
 * Web monetization settings validation function
 *
 * @param array| $option The form input data for options api.
 */
function likecoin_monetization_settings_validation( $option ) {
	// TODO: check for correct handle before enabling monetization.
	add_settings_error(
		'lc_settings_messages',
		'updated',
		__( 'Settings Saved', LC_PLUGIN_SLUG ),
		'updated'
	);
	return $option;
}

/**
 * Add monetization related settings sections
 */
function likecoin_add_monetization_settings() {

	register_setting( LC_MONETIZATION_SITE_OPTIONS_PAGE, LC_MONETIZATION_OPTION_NAME, 'likecoin_monetization_settings_validation' );

	$site_payment_pointer_options_section = 'lc_site_payment_pointer_options';

	add_settings_section(
		$site_payment_pointer_options_section,
		__( 'Web Monetization', LC_PLUGIN_SLUG ),
		null,
		LC_MONETIZATION_SITE_OPTIONS_PAGE
	);

	add_settings_field(
		LC_OPTION_SITE_MONETIZATION_PAYMENT_POINTER,
		__( 'Payment pointer', LC_PLUGIN_SLUG ),
		'likecoin_add_site_payment_pointer_settings',
		LC_MONETIZATION_SITE_OPTIONS_PAGE,
		$site_payment_pointer_options_section,
		array(
			'label_for' => LC_OPTION_SITE_MONETIZATION_PAYMENT_POINTER,
		)
	);
}

/**
 * Init settings API for plugin
 */
function likecoin_init_settings() {
	include_once dirname( __FILE__ ) . '/views/components.php';
	include_once dirname( __FILE__ ) . '/views/site-options.php';
	likecoin_add_button_settings();
	likecoin_add_publish_settings();
	likecoin_add_monetization_settings();
}
