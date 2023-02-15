import { __ } from '@wordpress/i18n';
import { createInterpolateElement, createElement } from '@wordpress/element';
import Link from '../components/Link';
import Banner from '../assets/w3p_banner.png';

function SponsorLikecoinPage() {
  const localizedIntroduction = createInterpolateElement(
    __(
      `Web3Press provides a creative business model, especially for open content. No paywall or advertisement anymore.
      Web3Press is based on <LikeCoin />, an application-specific blockchain that the community and infrastructure focus on the creator’s economy.
      With Web3Press, you can:`,
      'likecoin',
    ),
    {
      LikeCoin: createElement(Link, {
        text: __('LikeCoin', 'likecoin'),
        linkAddress: 'https://like.co',
      }),
    },
  );
  const localizedNFTIntroduction = createInterpolateElement(
    __('Idea is the best product for your readers. Your readers buy your posts because they love your words. Web3Press helps you to productize your posts as <WNFT/>. Let readers support you by buying your posts while reading.', 'likecoin'),
    {
      WNFT: createElement(Link, {
        text: __('NFTs', 'likecoin'),
        linkAddress: 'https://liker.land/writing-nft/about',
      }),
    },
  );
  const localizedOnChainIntroduction = createInterpolateElement(
    __('You know who has bought your NFTs with <Explorer />. You can connect with your fans by sending NFT gifts with warm greetings is not only possible but convenient. Conditional offers can be made according to the open data on-chain.', 'likecoin'),
    {
      Explorer: createElement(Link, {
        text: __('on-chain data', 'likecoin'),
        linkAddress: 'https://www.mintscan.io/likecoin',
      }),
    },
  );
  const localizedPortfolioIntroduction = createInterpolateElement(
    __('“You are what you read”. Share your <Portfolio /> with pride. Collect the rare and valuable articles into your wallet.', 'likecoin'),
    {
      Portfolio: createElement(Link, {
        text: __('NFT portfolio', 'likecoin'),
        linkAddress: 'https://liker.land/dashboard?tab=collected',
      }),
    },
  );
  const localizedLikeCoinIntroduction = createInterpolateElement(
    __(
      'Web3Press is based on <LikeCoin />, an application-specific blockchain that the community and infrastructure focus on the creator’s economy.',
      'likecoin',
    ),
    {
      LikeCoin: createElement(Link, {
        text: __('LikeCoin', 'likecoin'),
        linkAddress: 'https://like.co',
      }),
    },
  );
  const localizedDecentralizedRegistry = createInterpolateElement(
    __(
      'Register metadata (<ISCN />) on the <LikeCoinChain />, store content on the decentralized file system (<IPFS /> and <Arweave />), and backup on Internet Archive, all in one plugin.',
      'likecoin',
    ),
    {
      ISCN: createElement(Link, {
        text: __('ISCN', 'likecoin'),
        linkAddress: 'https://iscn.io',
      }),
      LikeCoinChain: createElement(Link, {
        text: __('LikeCoin chain', 'likecoin'),
        linkAddress: 'https://www.mintscan.io/likecoin',
      }),
      IPFS: createElement(Link, {
        text: __('IPFS', 'likecoin'),
        linkAddress: 'https://ipfs.io/',
      }),
      Arweave: createElement(Link, {
        text: __('Arweave', 'likecoin'),
        linkAddress: 'https://arweave.io/',
      }),
    },
  );
  const localizedWeb3Introduction = createInterpolateElement(
    __(
      'Web3 is a new standard of the Internet. The Internet has been evolving in the past decades and becoming increasingly decentralized. In Web1, information was 1-way-broadcast; in Web2, information was user-generated. In Web3, the concept of ownership applies to every piece of data. Echoing <WordPress />, the vision of WordPress, Web3Press pushes one more step forward: the freedom to OWN. Oh yes, it’s free, as in freedom.',
      'likecoin',
    ),
    {
      WordPress: createElement(Link, {
        text: __('Democratise Publishing', 'likecoin'),
        linkAddress: 'https://wordpress.org/about/',
      }),
    },
  );

  return (
    <div className="likecoin">
      <img src={Banner} alt="Word3Press Banner"></img>
      <h2>{__('What is Web3Press?', 'likecoin')}</h2>
      <p>{localizedIntroduction}</p>
      <h3>{__('Sell your posts', 'likecoin')}</h3>
      <p>{localizedNFTIntroduction}</p>
      <h3>{__('Be proud of your work', 'likecoin')}</h3>
      <p>{localizedPortfolioIntroduction}</p>
      <h3>{__('Build Community', 'likecoin')}</h3>
      <p>{localizedOnChainIntroduction}</p>
      <h3>{__('Preserve Content', 'likecoin')}</h3>
      <p>{localizedDecentralizedRegistry}</p>

      <h2>{__('What is LikeCoin', 'likecoin')}</h2>
      <p>{localizedLikeCoinIntroduction}</p>

      <h2>{__('Why Web3', 'likecoin')}</h2>
      <p>{localizedWeb3Introduction}</p>

      <iframe
        className="lcp-github-sponsor-card"
        src="https://github.com/sponsors/likecoin/card"
        title="Sponsor likecoin"
        height="225"
        width="660"
      />
    </div>
  );
}

export default SponsorLikecoinPage;
