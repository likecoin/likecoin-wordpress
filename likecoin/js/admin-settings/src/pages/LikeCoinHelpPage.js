import { __ } from '@wordpress/i18n';
import { createInterpolateElement, createElement } from '@wordpress/element';
import Link from '../components/Link';
import Section from '../components/Section';

function LikeCoinHelpPage() {
  const localizedIntroduction = createInterpolateElement(
    __(
      'Please refer to <Help/> for help on using this plugin',
      'likecoin',
    ),
    {
      Help: createElement(Link, {
        text: __('this guide', 'likecoin'),
        linkAddress: 'https://docs.like.co/user-guide/wordpress',
      }),
    },
  );
  const faucetDescription = createInterpolateElement(
    __(
      'Never heard of <LikeCoin>LikeCoin</LikeCoin>? Don’t worry, <Link>here</Link> are some for you to get started.',
      'likecoin',
    ),
    {
      LikeCoin: createElement(Link, {
        text: __('LikeCoin', 'likecoin'),
        linkAddress: 'https://like.co',
      }),
      Link: createElement(Link, {
        text: __('here', 'likecoin'),
        linkAddress: `https://faucet.like.co/?platform=wordpress&referrer=${encodeURIComponent(document.location.origin)}`,
      }),
    },
  );
  return (
    <div className="lcp-nav-tab-panel likecoin">
      <Section title={__('Getting Started', 'likecoin')} />
      <div className="lcp-card">
        <h2>{__('1. Get some LikeCoin tokens to get started', 'likecoin')}</h2>
        <p>{faucetDescription}</p>
      </div>
      <div className="lcp-card">
        <h2>{__('2. You are ready, let’s publish.', 'likecoin')}</h2>
        <p>{__('Here is a video to help you understand how to publish a Writing NFT', 'likecoin')}</p>
        <iframe
          height="315"
          src="https://www.youtube.com/embed/zHmAidvifQw"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          style={{ width: '100%', maxWidth: '560px' }}
        />
        <p>{localizedIntroduction}</p>
      </div>
      <hr />
      <Section title={__('Useful Tips', 'likecoin')} />
      <div className="lcp-card">
        <h3>{__('Publish your post before you mint Writing NFT', 'likecoin')}</h3>
        <p>{__('You need to publish your post first, then you can find the Publish button on the editing sidebar.', 'likecoin')}</p>
      </div>
      <div className="lcp-card">
        <h3>{__('Publish alone with licence', 'likecoin')}</h3>
        <p>{__('You can set your preferred licence on the editing sidebar.', 'likecoin')}</p>
      </div>
      <div className="lcp-card">
        <h3>{__('Encourage your readers to collect Writing NFT of your works', 'likecoin')}</h3>
        <p>{__('Let your readers aware they can collect Writing NFT of your works. Let them know it is meaningful to support you.', 'likecoin')}</p>
      </div>
    </div>
  );
}

export default LikeCoinHelpPage;
