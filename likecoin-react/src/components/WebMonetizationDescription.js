import { __ } from '@wordpress/i18n';
import { createInterpolateElement, createElement } from '@wordpress/element';
import Link from '../components/Link';
const localizedWebMonetizationShortIntro = createInterpolateElement(
  __(
    "<WebMonetization/> is an API that allows websites to request small payments from users facilitated by the browser and the user's Web Monetization provider.",
    'likecoin-react'
  ),
  {
    WebMonetization: createElement(Link, {
      text: __('Web Monetization', 'likecoin-react'),
      linkAddress: 'https://webmonetization.org/',
    }),
  }
);
const localizedWebMonetizationLongIntro = createInterpolateElement(
  __(
    'You would need to register a <PaymentPointer/> to enable web monetization. However LikeCoin is working hard to integrate web monetization natively into our ecosystem. Follow our latest progress <Here/>!',
    'likecoin-react'
  ),
  {
    PaymentPointer: createElement(Link, {
      text: __('payment pointer', 'likecoin-react'),
      linkAddress: 'https://webmonetization.org/docs/ilp-wallets',
    }),
    Here: createElement(Link, {
      text: __('here', 'likecoin-react'),
      linkAddress: 'https://community.webmonetization.org/likecoinprotocol',
    }),
  }
);
function WebMonetizationDescription() {
  return (
    <div style={{ textAlign: 'left' }}>
      <p></p>
      <h2>{__('What is Web Monetization?', 'likecoin-react')}</h2>
      <p></p>
      <p>{localizedWebMonetizationShortIntro}</p>
      <p>{localizedWebMonetizationLongIntro}</p>
    </div>
  );
}

export default WebMonetizationDescription;
