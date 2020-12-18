<?php
/**
 * LikeCoin editor functions
 *
 * Define functions used in Gutenberg editor
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
 * Load custom frontend js for Gutenberg editor
 */
function likecoin_load_editor_scripts() {
	// check for Gutenberg.
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

/**
 * Add custom posts columns
 *
 * @param string[]| $columns An associative array of column headings.
 */
function likecoin_add_posts_columns( $columns ) {
	$columns['matters'] = __( 'Matters Publish status', LC_PLUGIN_SLUG );
	$columns['ipfs']    = __( 'IPFS status', LC_PLUGIN_SLUG );
	return $columns;
}

/**
 * Populate custom posts columnsParameters
 *
 * @param string| $column The name of the column to display..
 * @param int|    $post_id The current post ID.
 */
function likecoin_populate_posts_columns( $column, $post_id ) {
	switch ( $column ) {
		case 'matters':
			$option       = get_option( LC_PUBLISH_OPTION_NAME );
			$matters_id   = isset( $option[ LC_OPTION_SITE_MATTERS_USER ] [ LC_MATTERS_ID_FIELD ] ) ? $option[ LC_OPTION_SITE_MATTERS_USER ] [ LC_MATTERS_ID_FIELD ] : '';
			$matters_info = get_post_meta( $post_id, LC_MATTERS_INFO, true );
			if ( ! isset( $matters_info['draft_id'] ) ) {
				esc_html_e( '-' );
				return;
			}
			if ( ! empty( $matters_info['published'] ) ) {
				?>
					<a rel="noopener" target="_blank" href="
				<?php
				echo esc_url(
					likecoin_matters_get_article_link(
						$matters_id,
						$matters_info['article_hash'],
						$matters_info['article_slug']
					)
				);
				?>
					">
				<?php esc_html_e( 'Published', LC_PLUGIN_SLUG ); ?>
					</a>
					<?php
			} else {
				?>
					<a rel="noopener" target="_blank" href="
				<?php echo esc_url( likecoin_matters_get_draft_link( $matters_info['draft_id'] ) ); ?> ">
					<?php esc_html_e( 'Draft', LC_PLUGIN_SLUG ); ?>
					</a>
					<?php
			}
			break;
		case 'ipfs':
			$matters_info = get_post_meta( $post_id, LC_MATTERS_INFO, true );
			if ( ! empty( $matters_info['ipfs_hash'] ) ) {
				?>
					<a rel="noopener" target="_blank" href="
				<?php echo esc_url( 'https://ipfs.io/ipfs/' . $matters_info['ipfs_hash'] ); ?> ">
					<?php esc_html_e( 'Published', LC_PLUGIN_SLUG ); ?>
					</a>
					<?php
			} elseif ( ! empty( $matters_info['published'] ) ) {
				esc_html_e( 'Pending', LC_PLUGIN_SLUG );
			} else {
				esc_html_e( '-', LC_PLUGIN_SLUG );
			}
			break;
	}
}
