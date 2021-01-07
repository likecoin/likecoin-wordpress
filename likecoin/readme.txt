=== LikeCoin - Decentralized Publishing ===

Contributors: likecoin,williamchong007,ckxpress
Tags: LikeCoin, LikeButton, like button, likebtn, civic liker, CivicLiker, LikeChain, blockchain, Cosmos, blogger, Like Rewards
Donate link: https://github.com/sponsors/likecoin
Requires at least: 5.0
Tested up to: 5.6
Requires PHP: 5.4
Stable tag: 2.0.7
License: GPLv3
License URI: https://www.gnu.org/licenses/gpl-3.0.html

With this plug-in installed in your site, every Like is a Reward.

== Description ==

LikeCoin is an infrastructure to decentralize publishing.

= Decentralized Archive =
LikeCoin plugin publishes your posts to [IPFS](https://ipfs.io/) through [Matters.news](https://matters.news) for peer-to-peer distribution. In the next stage, you will also be able to register your content an International Standard Content Number, [ISCN](https://iscn.io/), a specification we drafted in collaboration with the industry. Borrowed from the concept of ISBN for books, ISCN is a unique number assigned to content such as articles and images, and comes with metadata such as author, publisher, content address, license terms and creation footprint. Stored on [LikeCoin chain](https://likecoin.bigdipper.live), ISCN is immutable and censorship resilient.

= Decentralized rewards =
LikeCoin plugin attaches a [LikeCoin button](https://docs.like.co/user-guide/likecoin-button) beneath your content. Without setting up a paywall, every Like by readers is turned into measurable rewards in [LikeCoin tokens](https://coinmarketcap.com/currencies/likecoin/). The [Civic Liker](https://liker.land/civic) movement encourages readers to contribute USD5/mo to reward creativity and journalism, while the matching fund, distributed according to the Likes of all users, doubles the rewarding pool. With the decentralized rewards mechanism, every Like counts.

= Decentralized Curation =
Apart from rewarding creators as a Liker, readers may go further to become a Content Jockey. Content Jockeys help distribute creative stories and insightful commentaries with Super Likes, which are purposely designed to be scarce to cut out noise from signals. When a story gets popular, LikeCoin’s unique distribution footprint rewards both creator and Content Jockey, creating an all win situation for the content ecosystem.

[LikeCoin tokens](https://coinmarketcap.com/currencies/likecoin/) can be exchanged into USD, TWD or cryptocurrencies such as Bitcoin on exchanges such as [Liquid](https://app.liquid.com/exchange/LIKEUSDT), [DigiFinex](https://www.digifinex.com/en-ww/trade/USDT/LIKE) and [BitAsset](https://www.bitasset.com/ktrade/LIKE-TWD). Information of the LikeCoin token (LIKE) can be found in [CoinMarketCap](https://coinmarketcap.com/currencies/likecoin/) and [Big Dipper](https://likecoin.bigdipper.live/) blockchain explorer.

Contribute to the plugin development on [Github](https://github.com/likecoin/likecoin-wordpress).

== Installation ==

1. Activate the plugin.
2. Make sure you have a valid Liker ID. Please refer to "How to register a Liker ID?" if you don't have one yet.
3. Go to the LikeCoin plugin settings page. Enable displaying of LikeCoin button in "LikeCoin Button Display Setting".
4. Go to "Your LikeCoin Button" in the plugin settings. Enter your Liker ID in the input box, your other account information should be fetched and filled in automatically.
5. You should see a LikeCoin Button in every post authored by you.

After connecting your Liker ID, you can also use the shortcode [likecoin] to display LikeCoin button in your post. You can also define Liker ID using param liker-id i.e. [likecoin liker-id=ckxpress].

== Frequently Asked Questions ==

= How to register a Liker ID? =
Please refer to [this step-by-step instruction](https://docs.like.co/user-guide/liker-id/how-to-register-a-liker-id).

= LikeCoin button is not shown after I edited other's post? =
Post author's account must be linked to a Liker ID for the LikeCoin button to show in posts. Please login the LikeCoin plugin with the author's WordPress account once before editing with other editor account. You can also use the "Site Liker ID" option to force all posts to use a site-wise Liker ID.

== Screenshots ==

1. LikeCoin button in a Post
2. LikeCoin Plugin Options
3. LikeCoin Plugin Metabox

== Changelog ==

= 2.0.7 =
* Add refresh publish status button in post metabox
* Add Web Monetization setting

= 2.0.6 =
* Add Matters and IPFS status display in metabox and post management list
* Add class to LikeCoin button <figure> to allow CSS customization

= 2.0.5 =

* Fix LikeCoin button size issue in Twenty Twenty-One

= 2.0.4 =

* Fix Matters session expiration message is unreadable
* Sync post tags to Matters

= 2.0.3 =

* Unify Matters.news brand name
* Improve Matters publish support for classic editor
* New option to add post link in footer when publishing

= 2.0.2 =

* Fix publish to matters checkbox status does not display properly

= 2.0.1 =

* Fix typo in matters.news description
* Fix users' LikeCoin button setting cannot be updated

= 2.0.0 =

* Try to fix title encoding issue when saving draft to matters
* Fix cannot save draft to matters when publishing article
* Improve formatting of matters ID display
* Add short introduction on matters.news

= 2.0.0-b.2 =

* Add display of current matters ID in settings
* Add sponsor information

= 2.0.0-b.1 =

* Add publish to matters function beta

= 1.3.3 =

* Add become civic liker button and update help url

= 1.3.2 =

* Add liker-id param in [likecoin] shortcode
* Rename Like Rewards banner to LikeCoin button

= 1.3.1 =

* Use LikeCoin wallet when updating user info.

= 1.3.0 =

* Allow user to input Liker ID directly
* Remove Metamask related code

= 1.2.4 =

* Fix Like Rewards banner not showing when using site Liker ID

= 1.2.3 =

* Add shortcode [likecoin] for displaying Like Rewards banner

= 1.2.2 =

* Fixes options in metabox did not follow current config

= 1.2.1 =

* Fixes Android Facebook Browser stuck in redirect issue
* Inject sandbox attributes in iframe only in AMP mode

= 1.2.0 =

* Support Metamask privacy mode

= 1.1.7 =

* Update names and branding
* Do not display Like Rewards banner in password-protected post

= 1.1.6 =

* Remove button referrer when in preview mode

= 1.1.5 =

* Support AMP plugin in paired/native mode

= 1.1.4 =

* Support new LikeButton setting available like.co
* Better compatibility with old php versions
* Add action shortcut to help and settings links

= 1.1.3 =

* Better support for page builder like elementor and beaver
* Fine-tune LikeButton display priority and default display option

= 1.1.2 =

* Fix localization not working

= 1.1.1 =

* Fix typos

= 1.1.0 =

* Add LikeCoin Plugin Settings page
* Add site LikeButton functionality
* UI revamp

= 1.0.2 =

* Minify JS
* Update localizations

= 1.0.1 =

* Add localization headers

= 1.0 =

* Initial release

== Upgrade Notice ==

Upgrade to use the newly designed LikeCoin Plugin Settings page, allowing simpler management of LikeButton across your site. Latest version fixes localization.
