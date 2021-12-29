import { __ } from '@wordpress/i18n';
import { createInterpolateElement, createElement } from '@wordpress/element';
import Link from './Link';

function ISCNDescription() {
  const localizedISCNShortIntro = createInterpolateElement(
    __(
      '<ISCN/> (International Standard Content Number) is the unique metadata record of a piece of content registered on <Chain/>.',
      'likecoin',
    ),
    {
      ISCN: createElement(Link, {
        text: __('ISCN', 'likecoin'),
        linkAddress: 'https://iscn.io',
      }),
      Chain: createElement(Link, {
        text: __('LikeCoin chain', 'likecoin'),
        linkAddress: 'https://docs.like.co',
      }),
    },
  );
  const localizedISCNLongIntro = __(
    'A unique ISCN is generated for each piece of content and bears corresponding metadata such as authors, publication date, copyright licenses and the digital fingerprint. ISCN data are immutable because of blockchain\'s characteristics.',
    'likecoin',
  );
  return (
    <div style={{ textAlign: 'left' }}>
      <h2>
        {__('What is ISCN?', 'likecoin')}
      </h2>
      <p>{localizedISCNShortIntro}</p>
      <p>{localizedISCNLongIntro}</p>
    </div>
  );
}

export default ISCNDescription;
