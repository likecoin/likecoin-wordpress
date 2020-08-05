<?php
/**
 * LikeCoin public index
 *
 * Index of the public facing side of LikeCoin plugin
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
 * Require public files
 */
require_once dirname( __FILE__ ) . '/likecoin-button.php';

/**
 * Run all public related WordPress hook
 */
function likecoin_add_public_hooks() {
	add_filter( 'the_content', 'likecoin_content_filter' );
	add_shortcode( 'likecoin', 'likecoin_likecoin_shortcode' );
}
