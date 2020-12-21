<?php
/**
 * LikeCoin Matters HTML processer
 *
 * Function for modifying post HTML content to prepare for upload to matters
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

// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase, WordPress.WP.I18n.NonSingularStringLiteralDomain

/**
 * Generate matters introduction
 */
function likecoin_add_matters_introduction() {
	?>
	<div>
	<p>
		<h2><a rel="noopener" target="_blank" href="https://matters.news">
		<img height="32" weight="32" src="https://matters.news/static/icon-144x144.png"/>
		</a><?php esc_html_e( 'What is Matters.news?' ); ?></h2>
	</p>
	<p>
	<?php
	printf(
		/* translators: %s is the link to matters.news */
		esc_html__( '%s is a decentralized, cryptocurrency driven content creation and discussion platform.', LC_PLUGIN_SLUG ),
		sprintf(
			'<a rel="noopener" target="_blank" href="%s">%s</a>',
			esc_url( 'https://matters.news' ),
			esc_html__( 'Matters', LC_PLUGIN_SLUG )
		)
	);
	echo '</p><p>';
	printf(
		/* translators: %s is the link to ipfs.io */
		esc_html__( 'By publishing on Matters, your articles will be stored to the distributed InterPlanetary File System (%s) nodes and get rewarded. Take the first step to publish your creation and reclaim your ownership of data!', LC_PLUGIN_SLUG ),
		sprintf(
			'<a rel="noopener" target="_blank" href="%s">%s</a>',
			esc_url( 'https://ipfs.io' ),
			esc_html__( 'IPFS', LC_PLUGIN_SLUG )
		)
	);
	echo '</p><br></div>';
}

/**
 * Generate a DOM element for Matters to display audio widget
 *
 * @param string| $filename Title of audio file.
 */
function likecoin_generate_matters_player_widget( $filename ) {
	$dom_document          = new DOMDocument();
	$libxml_previous_state = libxml_use_internal_errors( true );
	$dom_content           = $dom_document->loadHTML( '<div class="player"><header><div class="meta"><h4 class="title">' . $filename . '</h4><div class="time"><span class="current"></span><span class="duration"></span></div></div><span class="play paused"></span></header><footer><div class="progress-bar"><span></span></div></footer></div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
	libxml_clear_errors();
	libxml_use_internal_errors( $libxml_previous_state );
	return $dom_document->documentElement;
}


/**
 * Append footer link into DOM
 *
 * @param DOMDocument| $dom_document Parent dom document.
 */
function likecoin_append_footer_link_element( $dom_document ) {
	global $post;
	$site_title = get_bloginfo( 'name' );
	if ( ! $post ) {
		return;
	}
	$url = get_permalink( $post );
	if ( ! $url ) {
		return;
	}
	$p = $dom_document->createElement( 'p', esc_html__( 'Original link: ', LC_PLUGIN_SLUG ) );
	$a = $dom_document->createElement( 'a', $site_title );
	$a->setAttribute( 'href', $url );
	$p->appendChild( $a );
	$dom_document->documentElement->appendChild( $p );
}

/**
 * Parse and modify post HTML to replace Matters asset url and div/class standard
 *
 * @param string| $content raw post HTML content.
 * @param array|  $params post options for addtional components.
 */
function likecoin_replace_matters_attachment_url( $content, $params ) {
	if ( ! $content ) {
		return $content;
	}
	$should_add_footer_link = $params['add_footer_link'];
	$dom_document           = new DOMDocument();
	$libxml_previous_state  = libxml_use_internal_errors( true );
	$dom_content            = $dom_document->loadHTML( '<template>' . mb_convert_encoding( $content, 'HTML-ENTITIES' ) . '</template>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
	libxml_clear_errors();
	libxml_use_internal_errors( $libxml_previous_state );
	if ( false === $dom_content ) {
		return $content;
	}
	$images = $dom_document->getElementsByTagName( 'img' );
	foreach ( $images as $image ) {
		$parent = $image->parentNode;
		if ( 'figure' === $parent->nodeName ) {
			$classes = $parent->getAttribute( 'class' );
			$parent->setAttribute( 'class', $classes . ' image' );
		} else {
			$figure = $dom_document->createElement( 'figure' );
			$figure->setAttribute( 'class', 'image' );
			$image = $parent->replaceChild( $figure, $image );
			$figure->appendChild( $image );
			$parent = $figure;
		}
		$url           = $image->getAttribute( 'src' );
		$classes       = $image->getAttribute( 'class' );
		$attachment_id = intval( $image->getAttribute( 'data-attachment-id' ) );
		if ( ! $attachment_id && $classes && preg_match( '/wp-image-([0-9]+)/i', $classes, $class_id ) && absint( $class_id[1] ) ) {
			$attachment_id = $class_id[1];
		}
		if ( ! $attachment_id && $url ) {
			$attachment_id = attachment_url_to_postid( $url );
		}
		if ( $attachment_id ) {
			$matters_info = get_post_meta( $attachment_id, LC_MATTERS_INFO, true );
			if ( isset( $matters_info['url'] ) ) {
				$image->setAttribute( 'src', $matters_info['url'] );
				$image->setAttribute( 'data-asset-id', $matters_info['attachment_id'] );
			}
		}
	}
	$audios = $dom_document->getElementsByTagName( 'audio' );
	foreach ( $audios as $audio ) {
		$url           = $audio->getAttribute( 'src' );
		$attachment_id = intval( $audio->getAttribute( 'data-attachment-id' ) );
		$id            = null;
		$filename      = null;

		if ( ! $attachment_id && $url ) {
			$attachment_id = attachment_url_to_postid( $url );
		}
		if ( $attachment_id ) {
			$matters_info = get_post_meta( $attachment_id, LC_MATTERS_INFO, true );
			if ( isset( $matters_info['url'] ) ) {
					$url = $matters_info['url'];
					$id  = $matters_info['attachment_id'];
			}
			$file_path = get_attached_file( $attachment_id );
			$filename  = basename( $file_path );
			$source    = $dom_document->createElement( 'source' );
			$source->setAttribute( 'src', $url );
			if ( $id ) {
				$source->setAttribute( 'data-asset-id', $id );
			}
			if ( $filename ) {
				$audio->setAttribute( 'data-file-name', $filename );
			}
			$audio->removeAttribute( 'src' );
			$audio->appendChild( $source );
		}
		$parent = $audio->parentNode;
		if ( 'figure' === $parent->nodeName ) {
			$classes = $parent->getAttribute( 'class' );
			$parent->setAttribute( 'class', $classes . ' audio' );
		} else {
			$figure = $dom_document->createElement( 'figure' );
			$figure->setAttribute( 'class', 'audio' );
			$audio = $parent->replaceChild( $figure, $audio );
			$figure->appendChild( $audio );
			$parent = $figure;
		}
		$player = likecoin_generate_matters_player_widget( $filename );
		$parent->appendChild( $dom_document->importNode( $player, true ) );
	}
	$figures = $dom_document->getElementsByTagName( 'figure' );
	foreach ( $figures as $figure ) {
		$classes = $figure->getAttribute( 'class' );
		if ( strpos( $classes, 'gallery' ) !== false ) {
			$figure->setAttribute( 'class', $classes . ' image' );
		}
		$has_caption = false;
		$captions    = $figure->getElementsByTagName( 'figcaption' );
		foreach ( $captions as $caption ) {
			if ( $caption->parentNode === $figure ) {
				$has_caption = true;
			}
		}
		if ( ! $has_caption ) {
			$new_caption = $dom_document->createElement( 'figcaption' );
			$span        = $dom_document->createElement( 'span' );
			$new_caption->appendChild( $span );
			$figure->appendChild( $new_caption );
		}
	}

	if ( $should_add_footer_link ) {
		likecoin_append_footer_link_element( $dom_document );
	}

	$root   = $dom_document->documentElement;
	$result = '';
	foreach ( $root->childNodes as $child_node ) {
			$result .= $dom_document->saveHTML( $child_node );
	}
	return $result;
}
// phpcs:enable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
