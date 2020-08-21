<?php
/**
 * LikeCoin editor functions
 *
 * Define functions used in gutenberg editor
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

/**
 * Load custom frontend js for gutenberg editor
 */
function likecoin_load_editor_scripts() {
	// check for gutenberg.
	if ( ! function_exists( 'has_blocks' ) ) {
		return;
	}
	wp_enqueue_script(
		'lc_js_editor',
		LC_URI . 'assets/js/dist/admin/likecoin_editor.js',
		array( 'wp-editor', 'wp-i18n' ),
		LC_PLUGIN_VERSION,
		true
	);
}
