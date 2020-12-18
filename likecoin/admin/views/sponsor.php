<?php
/**
 * LikeCoin Sponsor page
 *
 * LikeCoin Github Sponsor info and button page
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
 * Add the likecoin sponsor page
 */
function likecoin_add_sponsor_page() {
	?>
	<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
	<div>
	<iframe src="https://github.com/sponsors/likecoin/card" title="<?php esc_attr_e( 'Sponsor likecoin', LC_PLUGIN_SLUG ); ?>" height="225" width="600" style="overflow: hidden;border: 0;"></iframe>
	<p>
	<?php
	printf(
		/* translators: %s is the link to likecoin official website*/
		esc_html__( '%s is a Decentralized Publishing Infrastructure. It reinvents the publishing industry with decentralized registry, rewards, editorial, and governance.', LC_PLUGIN_SLUG ),
		sprintf(
			'<a rel="noopener" target="_blank" href="%s">%s</a>',
			'https://like.co',
			esc_html__( 'LikeCoin', LC_PLUGIN_SLUG )
		)
	);
	?>
	</p>
<p><strong><?php esc_html_e( 'Decentralized Registry', LC_PLUGIN_SLUG ); ?></strong><br>
	<p>
	<?php
	printf(
		/* translators: %1%s is the link to ISCN, %2%s is the link to LikeCoin chain explorer, %1%s is the link to IPFS */
		esc_html__( 'The heart of Decentralized Publishing is decentralized registry powered by %1$s, a specification we drafted in collaboration with the industry. Inspired by ISBN for books, ISCN is a unique number assigned to content such as articles and images, and comes with metadata such as author, publisher, content address, license terms and creation footprint. Stored on %2$s, ISCN is immutable and censorship resilient. The content, on the other hand, is stored on %3$s for tamper resistance and peer-to-peer distribution.', LC_PLUGIN_SLUG ),
		sprintf(
			'<a rel="noopener" target="_blank" href="%s">%s</a>',
			esc_url( 'https://iscn.io' ),
			esc_html__( 'ISCN', LC_PLUGIN_SLUG )
		),
		sprintf(
			'<a rel="noopener" target="_blank" href="%s">%s</a>',
			esc_url( 'https://likecoin.bigdipper.live' ),
			esc_html__( 'LikeCoin chain', LC_PLUGIN_SLUG )
		),
		sprintf(
			'<a rel="noopener" target="_blank" href="%s">%s</a>',
			esc_url( 'https://ipfs.io' ),
			esc_html__( 'IPFS', LC_PLUGIN_SLUG )
		)
	);
	?>
	</p>
<p><strong><?php esc_html_e( 'Decentralized Rewards', LC_PLUGIN_SLUG ); ?></strong><br>
	<?php
	printf(
		/* translators: %1%s is the link to LikeCoin token page on coingecko, %2%s is the link to Civic Liker intro page */
		esc_html__( 'By simply attaching a LikeCoin button beneath your content and without setting up a paywall, every Like by readers is turned into measurable rewards in %1$s,. The %2$s, movement encourages readers to contribute USD5/mo to reward creativity and journalism, while the matching fund, distributed according to the Likes of all users, doubles the rewarding pool. With decentralized rewards, every Like counts.', LC_PLUGIN_SLUG ),
		sprintf(
			'<a rel="noopener" target="_blank" href="%s">%s</a>',
			esc_url( 'https://www.coingecko.com/en/coins/likecoin' ),
			esc_html__( 'LikeCoin tokens', LC_PLUGIN_SLUG )
		),
		sprintf(
			'<a rel="noopener" target="_blank" href="%s">%s</a>',
			esc_url( 'https://liker.land/civic' ),
			esc_html__( 'Civic Liker', LC_PLUGIN_SLUG )
		)
	);
	?>
</p>
<p><strong><?php esc_html_e( 'Decentralized Editorial', LC_PLUGIN_SLUG ); ?></strong><br>
	<?php
	printf(
		/* translators: %s is Super Like */
		esc_html__( "Apart from rewarding creators as a Liker, readers may go further to become a Content Jockey. Content Jockeys help curate creative stories and insightful commentaries with %s, which is purposely designed to be scarce to cut out noise from signals. When a story gets popular, LikeCoin's unique distribution footprint rewards both creator and Content Jockey, creating an all win situation for the content ecosystem.", LC_PLUGIN_SLUG ),
		sprintf(
			'<em>%s</em>',
			esc_html__( 'Super Like', LC_PLUGIN_SLUG )
		)
	);
	?>
		</p>
<p><strong><?php esc_html_e( 'Decentralized Governance', LC_PLUGIN_SLUG ); ?></strong><br>
	<?php
	printf(
		/* translators: %1%s is the link to LikeCoin chain explorer, %2%s is the link to the proposal page */
		esc_html__( 'Not only is LikeCoin token a reward to creators and Content Jockeys, it also serves doubly as the governing token for the decentralized autonomous organization (DAO), namely the %1$s. Likers participate in liquid democracy by delegating their LikeCoin tokens to validators they trust, and freely switch among them without a fixed term of office. Issues such as default Content Jockeys, inflation rate and protocol updates require passing a corresponding %2$s by the Republic.', LC_PLUGIN_SLUG ),
		sprintf(
			'<a rel="noopener" target="_blank" href="%s">%s</a>',
			esc_url( 'https://likecoin.bigdipper.live' ),
			esc_html__( 'Republic of Liker Land', LC_PLUGIN_SLUG )
		),
		sprintf(
			'<a rel="noopener" target="_blank" href="%s">%s</a>',
			esc_url( 'https://likecoin.bigdipper.live/proposalsc' ),
			esc_html__( 'proposal', LC_PLUGIN_SLUG )
		)
	);
	?>
	</p>
	<iframe src="https://github.com/sponsors/likecoin/button" title="Sponsor likecoin" height="35" width="116" style="overflow: hidden; border: 0;"></iframe>
	</div>
	<?php
}
