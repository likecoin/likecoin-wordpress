import { __ } from '@wordpress/i18n';
import { createInterpolateElement, createElement } from '@wordpress/element';
import Link from '../components/Link';

function MattersDescription() {
  const localizedMattersShortIntro = createInterpolateElement(
    __(
      '<Matters/> is a decentralized, cryptocurrency driven content creation and discussion platform. ',
      'likecoin-react'
    ),
    {
      Matters: createElement(Link, {
        text: __('Matters', 'likecoin-react'),
        linkAddress: 'https://matters.news',
      }),
    }
  );
  const localizedMattersLongIntro = createInterpolateElement(
    __(
      'By publishing on Matters, your articles will be stored to the distributed InterPlanetary File System (<IPFS/>) nodes and get rewarded. Take the first step to publish your creation and reclaim your ownership of data!',
      'likecoin-react'
    ),
    {
      IPFS: createElement(Link, {
        text: __('IPFS', 'likecoin-react'),
        linkAddress: 'https://ipfs.io',
      }),
    }
  );
  return (
    <div style={{ textAlign: 'left' }}>
      <p></p>
      <h2>
        <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://matters.news"
        >
          <img
            height="32"
            weight="32"
            src="https://matters.news/static/icon-144x144.png"
            alt="matters-logo"
          ></img>
        </a>
        {__('What is Matters.news?', 'likecoin-react')}
      </h2>
      <p></p>
      <p>{localizedMattersShortIntro}</p>
      <p>{localizedMattersLongIntro}</p>
      <br />
    </div>
  );
}

export default MattersDescription;
