import LikecoinHeading from '../components/LikecoinHeading';
import ParagraphTitle from '../components/ParagraphTitle';
import Link from '../components/Link';
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, createElement } from '@wordpress/element';
function SponsorLikecoinPage() {
    const translatedString = createInterpolateElement(
      __(
        `Test: <Link/> is a Decentralized Publishing Infrastructure. 
        It reinvents the publishing industry with decentralized registry, 
        rewards, editorial, and governance.`
      ),
      {
        Link: createElement(
          Link,
          {text:"Likecoin", linkAddress:"https://like.co"}
        ),
      }
    );
  return (
    <div>
      <LikecoinHeading />
      <div style={{ textAlign: 'left' }}>
        <iframe
          src="https://github.com/sponsors/likecoin/card"
          title="Sponsor likecoin"
          height="225"
          width="660"
          style={{ overflow: 'hidden', border: 0 }}
        ></iframe>
        <p>
          <Link text="Likecoin" linkAddress="https://like.co" /> is a
          Decentralized Publishing Infrastructure. It reinvents the publishing
          industry with decentralized registry, rewards, editorial, and
          governance.
        </p>
        <p>{translatedString}</p>
        <ParagraphTitle text={'Decentralized Registry'} />
        <p>
          The heart of Decentralized Publishing is decentralized registry
          powered by <Link text="ISCN" linkAddress="https://iscn.io" />, a
          specification we drafted in collaboration with the industry. Inspired
          by ISBN for books, ISCN is a unique number assigned to content such as
          articles and images, and comes with metadata such as author,
          publisher, content address, license terms and creation footprint.
          Stored on{' '}
          <Link
            text="LikeCoin chain"
            linkAddress="https://likecoin.bigdipper.live/"
          />
          , ISCN is immutable and censorship resilient. The content, on the
          other hand, is stored on{' '}
          <Link text="IPFS" linkAddress="https://ipfs.io/" /> for tamper
          resistance and peer-to-peer distribution.
        </p>
        <ParagraphTitle text={'Decentralized Rewards'} />
        <p>
          By simply attaching a LikeCoin button beneath your content and without
          setting up a paywall, every Like by readers is turned into measurable
          rewards in{' '}
          <Link
            text="LikeCoin tokens"
            linkAddress="https://www.coingecko.com/en/coins/likecoin"
          />
          . The{' '}
          <Link text="Civic Liker" linkAddress="https://liker.land/civic" />,
          movement encourages readers to contribute USD5/mo to reward creativity
          and journalism, while the matching fund, distributed according to the
          Likes of all users, doubles the rewarding pool. With decentralized
          rewards, every Like counts.
        </p>
        <ParagraphTitle text={'Decentralized Editorials'} />
        <p>
          Apart from rewarding creators as a Liker, readers may go further to
          become a Content Jockey. Content Jockeys help curate creative stories
          and insightful commentaries with Super Like, which is purposely
          designed to be scarce to cut out noise from signals. When a story gets
          popular, LikeCoin's unique distribution footprint rewards both creator
          and Content Jockey, creating an all win situation for the content
          ecosystem.
        </p>
        <ParagraphTitle text={'Decentralized Governance'} />
        <p>
          Not only is LikeCoin token a reward to creators and Content Jockeys,
          it also serves doubly as the governing token for the decentralized
          autonomous organization (DAO), namely the{' '}
          <Link
            text="Republic of Liker Land"
            linkAddress="https://likecoin.bigdipper.live"
          />
          . Likers participate in liquid democracy by delegating their LikeCoin
          tokens to validators they trust, and freely switch among them without
          a fixed term of office. Issues such as default Content Jockeys,
          inflation rate and protocol updates require passing a corresponding{' '}
          <Link
            text="proposal"
            linkAddress="https://likecoin.bigdipper.live/proposalsc"
          />{' '}
          by the Republic.
        </p>
        <iframe
          src="https://github.com/sponsors/likecoin/button"
          title="Sponsor likecoin"
          height="35"
          width="116"
          style={{ overflow: 'hidden', border: 0 }}
        ></iframe>
      </div>
    </div>
  );
}

export default SponsorLikecoinPage;
