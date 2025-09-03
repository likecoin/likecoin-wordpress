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
  const migrationDescription = createInterpolateElement(
    __(
      'Learn about the transition from liker.land to 3ook.com. Read <MigrationGuide>our detailed migration guide</MigrationGuide> for complete information.',
      'likecoin',
    ),
    {
      MigrationGuide: createElement(Link, {
        text: __('our detailed migration guide', 'likecoin'),
        linkAddress: 'https://review.3ook.com/p/liker-land-3ookcom',
      }),
    },
  );
  const localizedSubscribe = createInterpolateElement(
    __(
      'Follow us by entering your email below, or visit our <Blog/> for updates on the upcoming 3ook.com version.',
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
      <div
        className="lcp-card"
        style={{
          background: '#fff3cd', border: '1px solid #ffeaa7', padding: '15px', marginBottom: '20px',
        }}
      >
        <h2 style={{ color: '#856404' }}>{__('Final Legacy Version Notice', 'likecoin')}</h2>
        <p><strong>{__('This is the final version of Web3Press LikeCoin plugin', 'likecoin')}</strong></p>
        <p>{__('Version 4.0.0 is a read-only legacy version. All NFT publishing features have been removed. Future 3ook.com features will be in a new major plugin version.', 'likecoin')}</p>
      </div>
      <div className="lcp-card">
        <h2>{__('1. Current Plugin Status', 'likecoin')}</h2>
        <p>
          <strong>{__('Legacy Mode:', 'likecoin')}</strong>
          {' '}
          {__('This is a maintenance-only version. No new publishing features.', 'likecoin')}
        </p>
        <p>
          <strong>{__('Still Works:', 'likecoin')}</strong>
          {' '}
          {__('Display settings, ISCN/Arweave ID updates, Internet Archive integration.', 'likecoin')}
        </p>
      </div>
      <div className="lcp-card">
        <h2>{__('2. About the Migration to 3ook.com', 'likecoin')}</h2>
        <p>{__('This version is read-only. All blockchain publishing features have been removed as we transition to 3ook.com.', 'likecoin')}</p>
        <p>{migrationDescription}</p>
        <p>{localizedIntroduction}</p>
      </div>
      <div className="lcp-card">
        <h2>{__('3. Stay updated on 3ook.com transition', 'likecoin')}</h2>
        <p>{localizedSubscribe}</p>
        <iframe
          src="https://newsletter.like.co/embed"
          width="100%"
          height="150"
          title={__('Subscribe to LikeCoin newsletter', 'likecoin')}
          style={{ border: '1px solid #EEE', background: 'white', maxWidth: '420px' }}
          frameBorder="0"
          scrolling="no"
        />
      </div>
      <hr />
      <Section title={__('Legacy Version Tips', 'likecoin')} />
      <div className="lcp-card">
        <h3>{__('Managing existing widgets and buttons', 'likecoin')}</h3>
        <p>{__('You can still control display settings for existing LikeCoin buttons and NFT widgets through the plugin settings.', 'likecoin')}</p>
      </div>
      <div className="lcp-card">
        <h3>{__('Updating metadata for existing posts', 'likecoin')}</h3>
        <p>{__('ISCN ID and Arweave ID can still be updated for existing posts through the editor sidebar.', 'likecoin')}</p>
      </div>
      <div className="lcp-card">
        <h3>{__('Accessing your legacy portfolio', 'likecoin')}</h3>
        <p>{__('Your existing NFT collection remains accessible at liker.land. Use the "Your Portfolio (Legacy)" link in the header.', 'likecoin')}</p>
      </div>
    </div>
  );
}

export default LikeCoinHelpPage;
