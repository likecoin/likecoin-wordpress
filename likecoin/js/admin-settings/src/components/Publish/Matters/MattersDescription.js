import { __ } from '@wordpress/i18n';
import { createInterpolateElement, createElement } from '@wordpress/element';
import Link from '../../Link';

function MattersDescription() {
  const localizedMattersShortIntro = createInterpolateElement(
    __(
      '<Matters/> is a decentralized, cryptocurrency driven content creation and discussion platform. ',
      'likecoin',
    ),
    {
      Matters: createElement(Link, {
        text: __('Matters', 'likecoin'),
        linkAddress: 'https://matters.news',
      }),
    },
  );
  const localizedMattersLongIntro = createInterpolateElement(
    __(
      'By publishing on Matters, your articles will be stored to the distributed InterPlanetary File System (<IPFS/>) nodes and get rewarded. Take the first step to publish your creation and reclaim your ownership of data!',
      'likecoin',
    ),
    {
      IPFS: createElement(Link, {
        text: __('IPFS', 'likecoin'),
        linkAddress: 'https://ipfs.io',
      }),
    },
  );
  return (
    <div>
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
        {__('What is Matters.news?', 'likecoin')}
      </h2>
      <p>{localizedMattersShortIntro}</p>
      <p>{localizedMattersLongIntro}</p>
    </div>
  );
}

export default MattersDescription;
