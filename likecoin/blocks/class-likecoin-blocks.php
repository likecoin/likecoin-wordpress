<?php
/**
 * LikeCoin Blocks Class
 *
 * Register Gutenberg blocks for LikeCoin functionality
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

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * LikeCoin Blocks Class
 *
 * @since 3.3.0
 */
class LikeCoin_Blocks {

	/**
	 * Register Gutenberg blocks
	 *
	 * @since 3.3.0
	 * @return void
	 */
	public static function init() {
		register_block_type( LC_DIR . 'assets/blocks/nft-widget' );
		register_block_type( LC_DIR . 'assets/blocks/nft-collect-button' );
	}
}
