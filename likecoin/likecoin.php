<?php
/**
 * Web3Press by LikeCoin
 *
 * Plugin for embbeding LikeCoin functionalities into WordPress.
 *
 * @package   LikeCoin
 * @author    LikeCoin <team@like.co>
 * @license   GPLv3
 * @link      https://github.com/likecoin/likecoin-wordpress
 * @copyright 2018 LikerLand

 * Plugin Name:  Web3Press by LikeCoin
 * Plugin URI:   https://github.com/likecoin/likecoin-wordpress
 * Description:  Publishes your posts to the blockchain. Sell your posts, share your work, build community, preserve content.
 * Version:      3.3.0
 * Author:       LikeCoin
 * Author URI:   https://like.co/
 * License:      GPLv3
 * License URI:  https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:  likecoin
 * Domain Path:  /languages/
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

define( 'LC_URI', plugin_dir_url( __FILE__ ) );
define( 'LC_DIR', plugin_dir_path( __FILE__ ) );
define( 'LC_PLUGIN_SLUG', 'likecoin' );
define( 'LC_PLUGIN_NAME', 'Web3Press By LikeCoin' );
define( 'LC_PLUGIN_VERSION', '3.3.0' );

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Include the main plugin loader class.
require_once __DIR__ . '/includes/class-likecoin-loader.php';

/**
 * Initialize the plugin
 *
 * @since 3.3.0
 * @return void
 */
function likecoin_init() {
	$plugin = LikeCoin_Loader::get_instance();
	$plugin->init();
}

// Start the plugin.
likecoin_init();
