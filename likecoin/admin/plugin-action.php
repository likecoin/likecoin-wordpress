<?php
/**
 * LikeCoin admin plugin actions
 *
 * Define plugin actions
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
 * Modify plugin action links
 * Ref: https://codex.wordpress.org/Plugin_API/Filter_Reference/plugin_action_links_(plugin_file_name)
 *
 * @param array| $links List of action links.
 */
function modify_plugin_action_links( $links ) {
	$links_before = array(
		'<a href="' . admin_url( 'options-general.php?page=' . LC_BUTTON_SITE_OPTIONS_PAGE ) . '">' . esc_html__( 'Settings', LC_PLUGIN_SLUG ) . '</a>',
	);
	$links_after  = array(
		'<a rel="noopener" target="_blank" href="' . esc_url( __( 'https://docs.like.co/user-guide/likecoin-button/wordpress', LC_PLUGIN_SLUG ) ) . '" target="_blank">' . esc_html__( 'Help', LC_PLUGIN_SLUG ) . '</a>',
		'<a rel="noopener" target="_blank" href="https://like.co">' . esc_html__( 'About', LC_PLUGIN_SLUG ) . '</a>',
	);
	return array_merge( $links_before, $links, $links_after );
}
