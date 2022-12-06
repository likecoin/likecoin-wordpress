import { __ } from '@wordpress/i18n';
import { createInterpolateElement, createElement } from '@wordpress/element';
import LikecoinHeading from '../components/LikecoinHeading';
import Link from '../components/Link';

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
  return (
    <div>
      <LikecoinHeading />
      <div style={{ textAlign: 'left' }}>
        <p>{localizedIntroduction}</p>
      </div>
    </div>
  );
}

export default LikeCoinHelpPage;
