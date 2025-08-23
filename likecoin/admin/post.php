<?php
/**
 * LikeCoin admin post editor functions
 *
 * Define functions used for post editor pages
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

// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase

/**
 * Require files
 */
require_once __DIR__ . '/../public/likecoin-button.php';

/**
 * Get default style defined in matters library.
 * Refer to https://github.com/thematters/matters-html-formatter/blob/main/src/makeHtmlBundle/formatHTML/articleTemplate.ts for details.
 */
function likecoin_get_default_post_style() {
	return '<style>
	html, body {
	  margin: 0;
	  padding: 0;
	}
	body {
	  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
	  font-size: 18px;
	  line-height: 1.5;
	}
	main {
	  max-width: 673px;
	  margin: 40px auto;
	  padding: 0 20px;
	}
	hr { height: 1px; }
	h1, h2, h3, h4, h5, h6 { font-weight: 600; line-height: 1.4; }
	h1 { font-size: 28px; }
	h2 { font-size: 24px; }
	h3 { font-size: 22px; }
	h4 { font-size: 18px; }
	h5 { font-size: 16px; }
	h6 { font-size: 14px; }
	li ul, li ol { margin: 0 20px; }
	li { margin: 20px 0; }
	ul { list-style-type: disc; }
	ol { list-style-type: decimal; }
	ol ol { list-style: upper-alpha; }
	ol ol ol { list-style: lower-roman; }
	ol ol ol ol { list-style: lower-alpha; }
	img, video, audio {
	  display: block;
	  max-width: 100%;
	  margin: 0 auto;
	}
	audio {
	  width: 100%;
	}
	blockquote {
	  margin-left: 20px;
	  margin-right: 20px;
	  color: #5F5F5F;
	}

	pre {
	  white-space: pre-wrap;
	}

	header {
	  margin-bottom: 40px;
	}
	header h1 {
	  font-size: 32px;
	}


	figure {
	  margin: 0;
	}

	figure.byline {
	  font-size: 16px;
	  margin: 0;
	}
	figure.byline * + * {
	  padding-left: 10px;
	}
	figure.byline time {
	  color: #b3b3b3;
	}
	figure.byline [ref="source"]::before {
	  content: "";
	  border-left: 1px solid currentColor;
	  padding-left: 10px;
	}

	figure.summary {
	  margin: 40px 0;
	  color: #808080;
	  font-size: 18px;
	  font-weight: 500;
	  line-height: 32px;
	}

	figure.read_more {
	  margin: 40px 0;
	}

	article {
	  position: relative;
	}

	article > * {
	  margin-top: 20px;
	  margin-bottom: 24px;
	}
	article a {
	  border-bottom: 1px solid currentcolor;
	  text-decoration: none;
	  padding-bottom: 2px;
	}
	article p {
	  line-height: 1.8;
	}
	figure figcaption {
	  margin-top: 5px;
	  font-size: 16px;
	  color: #b3b3b3;
	}

	figure .iframe-container {
	  position: relative;
	  width: 100%;
	  height: 0;
	  padding-top: 56.25%;
	}
	figure .iframe-container iframe {
	  position: absolute;
	  top: 0;
	  width: 100%;
	  height: 100%;
	}

	.encrypted {
	  display: flex;
	  justify-content: center;
	  word-break: break-all;
	}
  </style>';
}

/**
 * Get all tags names in a post
 *
 * @param WP_Post| $post Post object.
 * @param integer| $limit Number of tags.
 */
function likecoin_get_post_tags( $post, $limit = 0 ) {
	$post_id   = $post->ID;
	$func      = function ( $terms ) {
		return htmlspecialchars_decode( $terms->name );
	};
	$post_tags = get_the_tags( $post_id );

	if ( ! $post_tags ) {
		$post_tags = array();
	}
	$result = array_map( $func, $post_tags );
	if ( $limit ) {
		$result = array_slice( $result, 0, $limit );
	}
	return $result;
}

/**
 * Save the post-specific widget option to post meta and user meta
 *
 * @param int| $post_id The post id of the target post.
 */
function likecoin_save_postdata( $post_id ) {
	/* Check nonce */
	if ( ! ( isset( $_POST['lc_metabox_nonce'] ) && wp_verify_nonce( sanitize_key( $_POST['lc_metabox_nonce'] ), 'lc_save_post' ) ) ) {
		return;
	}

	if ( isset( $_POST[ LC_OPTION_WIDGET_OPTION ] ) ) {
		$option = array(
			LC_OPTION_WIDGET_POSITION => sanitize_key( $_POST[ LC_OPTION_WIDGET_OPTION ] ),
		);
		update_post_meta(
			$post_id,
			LC_OPTION_WIDGET_OPTION,
			$option
		);
	}
}
