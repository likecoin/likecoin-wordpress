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
  return (
    <div>
      <div>
      <Section title={__('Getting Started', 'likecoin')} />
        <p>{localizedIntroduction}</p>
      </div>
    </div>
  );
}

export default LikeCoinHelpPage;
