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
  const localizedSubscribe = createInterpolateElement(
    __(
      'Follow us by entering your email below, or visit our <Blog/> for latest update.',
      'likecoin',
    ),
    {
      Blog: createElement(Link, {
        text: __('blog', 'likecoin'),
        linkAddress: 'https://blog.like.co/?utm_source=wordpress&utm_medium=plugin&utm_campaign=getting_started',
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
        <h2>{__('2. You are now ready, let’s start publishing.', 'likecoin')}</h2>
        <p>{__('Here is a video to help you understand how to publish a Writing NFT', 'likecoin')}</p>
        <iframe
          height="315"
          src="https://www.youtube.com/embed/zHmAidvifQw"
          title={__('YouTube video player', 'likecoin')}
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          style={{ width: '100%', maxWidth: '560px' }}
        />
        <p>{localizedIntroduction}</p>
      </div>
      <div className="lcp-card">
        <h2>{__('3. Subscribe to our newsletter for upcoming features', 'likecoin')}</h2>
        <p>{localizedSubscribe}</p>
        <iframe
          src="https://newsletter.like.co/embed"
          width="100%"
          height="150"
          title={__('Subscribe to LikeCoin newsletter', 'likecoin')}
          style={{ border: '1px solid #EEE', background: 'white', maxWidth: '420px' }}
          frameborder="0"
          scrolling="no"
        />
      </div>
      <hr />
      <Section title={__('Useful Tips', 'likecoin')} />
      <div className="lcp-card">
        <h3>{__('Publish your post before you mint Writing NFT', 'likecoin')}</h3>
        <p>{__('You need to publish your post first, then you can find the Publish button on the editing sidebar.', 'likecoin')}</p>
      </div>
      <div className="lcp-card">
        <h3>{__('Publish along with licence', 'likecoin')}</h3>
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
