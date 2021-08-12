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

require_once dirname( __FILE__ ) . '/metabox.php';

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
		array( 'wp-polyfill', 'wp-editor', 'wp-i18n' ),
		LC_PLUGIN_VERSION,
		true
	);
}

/**
 * Format icon for post column
 *
 * @param string| $svg Base64 svg string.
 * @param string| $title Title of post column.
 */
function likecoin_format_post_column_icon( $svg, $title ) {
	return '<img width=20 heigth=20 src="'
		. esc_attr( $svg ) . '" title="'
		. esc_attr( $title ) . '" alt="'
		. esc_attr( $title ) . '" />';
}

/**
 * Add custom posts columns
 *
 * @param string[]| $columns An associative array of column headings.
 */
function likecoin_add_posts_columns( $columns ) {
	// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped,WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents,WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
	$matters_svg = 'data:image/svg+xml;base64,' . base64_encode( file_get_contents( LC_DIR . 'assets/icon/matters.svg' ) );
	$ipfs_svg    = 'data:image/svg+xml;base64,' . base64_encode( file_get_contents( LC_DIR . 'assets/icon/ipfs.svg' ) );
	$iscn_svg    = 'data:image/svg+xml;base64,' . base64_encode( file_get_contents( LC_DIR . 'assets/icon/ISCN_logo_extra_small.svg' ) );
	// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped,WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents,WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
	$columns['matters'] = likecoin_format_post_column_icon( $matters_svg, __( 'Matters Publish status', LC_PLUGIN_SLUG ) );
	$columns['ipfs']    = likecoin_format_post_column_icon( $ipfs_svg, __( 'IPFS status', LC_PLUGIN_SLUG ) );
	$columns['iscn']    = likecoin_format_post_column_icon( $iscn_svg, __( 'ISCN status', LC_PLUGIN_SLUG ) );
	return $columns;
}

/**
 * Populate custom posts columnsParameters
 *
 * @param string| $column The name of the column to display..
 * @param int|    $post_id The current post ID.
 */
function likecoin_populate_posts_columns( $column, $post_id ) {
	global $post;
	switch ( $column ) {
		case 'matters':
		case 'ipfs':
			$matters_info = get_post_meta( $post_id, LC_MATTERS_INFO, true );
			if ( ! is_array( $matters_info ) ) {
				$matters_info = array();
			} else {
				$option                     = get_option( LC_PUBLISH_OPTION_NAME );
				$matters_id                 = isset( $option[ LC_OPTION_SITE_MATTERS_USER ] [ LC_MATTERS_ID_FIELD ] ) ? $option[ LC_OPTION_SITE_MATTERS_USER ] [ LC_MATTERS_ID_FIELD ] : '';
				$matters_info['matters_id'] = $matters_id;
			}
			$status = likecoin_parse_publish_status( $matters_info );
			if ( ! empty( $status[ $column ]['url'] ) ) {
				?>
					<a rel="noopener" target="_blank" href="
				<?php
				echo esc_url( $status[ $column ]['url'] );
				?>
					">
				<?php echo esc_html( $status[ $column ]['status'] ); ?>
					</a>
					<?php
			} else {
				echo esc_html( $status[ $column ]['status'] );
			}
			break;
		case 'iscn':
			// get latest matters info to prevent time lag on matters & ipfs status.
			$matters_info = get_post_meta( $post_id, LC_MATTERS_INFO, true );
			if ( ! is_array( $matters_info ) ) {
				$matters_info = array();
			} else {
				$option                     = get_option( LC_PUBLISH_OPTION_NAME );
				$matters_id                 = isset( $option[ LC_OPTION_SITE_MATTERS_USER ] [ LC_MATTERS_ID_FIELD ] ) ? $option[ LC_OPTION_SITE_MATTERS_USER ] [ LC_MATTERS_ID_FIELD ] : '';
				$matters_info['matters_id'] = $matters_id;
			}
			$status = likecoin_parse_publish_status( $matters_info );

			// get iscn related info status.
			$publish_params = likecoin_get_meta_box_publish_params( $post );
			$iscn_status    = likecoin_parse_iscn_status( $publish_params );

			if ( 'Published' === $status['ipfs']['status'] ) {
				if ( ! empty( $iscn_status['url'] ) ) {
					?>
						<a rel="noopener" target="_blank" href="
					<?php
					echo esc_url( $iscn_status['url'] );
					?>
						">
					<?php echo esc_html( $iscn_status['status'] ); ?> 
						</a>
						<?php
				} elseif ( ! empty( $iscn_status['redirect_url'] ) ) {
					?>
						<a rel="noopener" target="_blank" href="
					<?php
					echo esc_url( $iscn_status['redirect_url'] );
					?>
						">
					<?php echo esc_html( $iscn_status['status'] ); ?> 
						</a>
						<?php
				}
			} else {
				$iscn_status['status'] = '-'; // replace '(IPFS is required)'.
				echo esc_html( $iscn_status['status'] );
			}
			break;

	}
}
