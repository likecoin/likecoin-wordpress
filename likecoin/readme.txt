=== LikeCoin ===

Contributors: likecoin,williamchong007,ckxpress
Tags: LikeCoin, LikeButton, like button, likebtn, civic liker, CivicLiker, LikeChain, blockchain, Ethereum, blogger, Like Rewards
Donate link: https://like.co/foundation
Requires at least: 4.0
Tested up to: 5.2
Requires PHP: 5.4
Stable tag: 1.3.3
License: GPLv3
License URI: https://www.gnu.org/licenses/gpl-3.0.html

With this plug-in installed in your site, every Like is a Reward.

== Description ==

[Civic Liker](https://liker.land/civic) is a movement to realign creativity and reward, by the technology of nano-payment to decouple media's income from advertising needs. Any website can enable the LikeCoin button by installing the LikeCoin plugin. Each "Like" from the readers let creators to be rewarded.

The source of the daily reward consists of two parts:
1) The monthly subscription fee paid by the Civic Likers who distribute their donation by their "Likes";
2) Creators matching fund: managed by the foundation. The daily amount is adjusted according to the total amount donated by Civic Likers. Both of the likes given by Civic Liker and free likers's will be consider as votes for fund distribution.

LikeCoin thus rewarded can be exchanged into USD on exchanges such as [BitAsset](https://www.bitasset.com/ktrade/LIKE-BTC) and [Liquid](https://app.liquid.com/exchange/LIKEETH). Information of the LikeCoin token (LIKE) can be found in [CoinMarketCap](https://coinmarketcap.com/currencies/likecoin/) and [Etherscan](https://etherscan.io/token/0x02f61fd266da6e8b102d4121f5ce7b992640cf98).

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
Please refer to [this step-by-step instruction](https://help.like.co/likecoin-faq/newbies/registering-likecoin-id-on-computer).

= LikeCoin button is not shown after I edited other's post? =
Post author's account must be linked to a Liker ID for the LikeCoin button to show in posts. Please login the LikeCoin plugin with the author's WordPress account once before editing with other editor account. You can also use the "Site Liker ID" option to force all posts to use a site-wise Liker ID.

== Screenshots ==

1. LikeCoin button in a Post
2. LikeCoin Plugin Options
3. LikeCoin Plugin Metabox

== Changelog ==

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
