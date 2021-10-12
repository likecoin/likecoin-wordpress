import LikecoinHeading from '../components/LikecoinHeading';
import ParagraphTitle from '../components/ParagraphTitle';
import Link from '../components/Link';
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, createElement } from '@wordpress/element';
function SponsorLikecoinPage() {
  const localizedlikecoinLink = createInterpolateElement(
    __('<Likecoin/>', 'likecoin-react'),
    {
      Likecoin: createElement(Link, {
        text: 'Likecoin',
        linkAddress: 'https://like.co',
      }),
    }
  );
  const localizedISCNLink = createInterpolateElement(
    __('<ISCN/>', 'likecoin-react'),
    {
      ISCN: createElement(Link, {
        text: 'ISCN',
        linkAddress: 'https://iscn.io',
      }),
    }
  );
  const localizedLikecoinChainLink = createInterpolateElement(
    __('<LikeCoinChain/>', 'likecoin-react'),
    {
      LikeCoinChain: createElement(Link, {
        text: 'LikeCoin chain',
        linkAddress: 'https://likecoin.bigdipper.live/',
      }),
    }
  );
  const localizedIPFSLink = createInterpolateElement(
    __('<IPFS/>', 'likecoin-react'),
    {
      IPFS: createElement(Link, {
        text: 'IPFS',
        linkAddress: 'https://ipfs.io/',
      }),
    }
  );
  const localizedlikecoinTokenLink = createInterpolateElement(
    __('<LikeCoinToken/>', 'likecoin-react'),
    {
      LikeCoinToken: createElement(Link, {
        text: 'LikeCoin tokens',
        linkAddress: 'https://www.coingecko.com/en/coins/likecoin',
      }),
    }
  );
  const localizedCivicLikerLink = createInterpolateElement(
    __('<CivicLiker/>', 'likecoin-react'),
    {
      CivicLiker: createElement(Link, {
        text: 'Civic Liker',
        linkAddress: 'https://liker.land/civic',
      }),
    }
  );
  const localizedRepublicLikerLandLink = createInterpolateElement(
    __('<RepublicOfLikerLand/>', 'likecoin-react'),
    {
      RepublicOfLikerLand: createElement(Link, {
        text: 'Republic of Liker Land',
        linkAddress: 'https://likecoin.bigdipper.live',
      }),
    }
  );
  const localizedProposalLink = createInterpolateElement(
    __('<Proposal/>', 'likecoin-react'),
    {
      Proposal: createElement(Link, {
        text: 'proposal',
        linkAddress: 'https://likecoin.bigdipper.live/proposalsc',
      }),
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
          {localizedlikecoinLink}
          {__(
            ' is a Decentralized Publishing Infrastructure. It reinvents the publishing industry with decentralized registry, rewards, editorial, and governance.',
            'likecoin-react'
          )}
        </p>
        <ParagraphTitle text={__('Decentralized Registry', 'likecoin-react')} />
        <p>
          {__(
            'The heart of Decentralized Publishing is decentralized registry powered by ',
            'likecoin-react'
          )}{' '}
          {localizedISCNLink}
          {__(
            ', a specification we drafted in collaboration with the industry. Inspired by ISBN for books, ISCN is a unique number assigned to content such as articles and images, and comes with metadata such as author, publisher, content address, license terms and creation footprint. Stored on ',
            'likecoin-react'
          )}
          {localizedLikecoinChainLink}
          {__(
            ', ISCN is immutable and censorship resilient. The content, on the other hand, is stored on ',
            'likecoin-react'
          )}
          {localizedIPFSLink}{' '}
          {__(
            'for tamper resistance and peer-to-peer distribution.',
            'likecoin-react'
          )}
        </p>
        <ParagraphTitle text={__('Decentralized Rewards', 'likecoin-react')} />
        <p>
          {__(
            'By simply attaching a LikeCoin button beneath your content and without setting up a paywall, every Like by readers is turned into measurable rewards in ',
            'likecoin-react'
          )}
          {localizedlikecoinTokenLink}. {__('The ', 'likecoin-react')}
          {localizedCivicLikerLink}
          {__(
            ' movement encourages readers to contribute USD5/mo to reward creativity and journalism, while the matching fund, distributed according to the Likes of all users, doubles the rewarding pool. With decentralized rewards, every Like counts.',
            'likecoin-react'
          )}
        </p>
        <ParagraphTitle
          text={__('Decentralized Editorials', 'likecoin-react')}
        />
        <p>
          {__(
            "Apart from rewarding creators as a Liker, readers may go further to become a Content Jockey. Content Jockeys help curate creative stories and insightful commentaries with Super Like, which is purposely designed to be scarce to cut out noise from signals. When a story gets popular, LikeCoin's unique distribution footprint rewards both creator and Content Jockey, creating an all win situation for the content ecosystem.",
            'likecoin-react'
          )}
        </p>
        <ParagraphTitle
          text={__('Decentralized Governance', 'likecoin-react')}
        />
        <p>
          {__(
            'Not only is LikeCoin token a reward to creators and Content Jockeys, it also serves doubly as the governing token for the decentralized autonomous organization (DAO), namely the ',
            'likecoin-react'
          )}
          {localizedRepublicLikerLandLink}
          {__(
            '. Likers participate in liquid democracy by delegating their LikeCoin tokens to validators they trust, and freely switch among them without a fixed term of office. Issues such as default Content Jockeys, inflation rate and protocol updates require passing a corresponding ',
            'likecoin-react'
          )}
          {localizedProposalLink}
          {__(' by the Republic.', 'likecoin-react')}
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
