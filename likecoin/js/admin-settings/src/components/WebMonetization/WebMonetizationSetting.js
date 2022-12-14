import {
  useRef, useState, useEffect, useImperativeHandle, forwardRef,
} from 'react';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { OTHER_SETTING_STORE_NAME } from '../../store/other-setting-store';

import CheckBox from '../CheckBox';
import FormTable from '../FormTable';
import Section from '../Section';

import WebMonetizationDescription from './WebMonetizationDescription';

function WebMonetizationSetting(_, ref) {
  const DBPaymentPointer = useSelect((select) => select(OTHER_SETTING_STORE_NAME)
    .selectPaymentPointer());
  const { postPaymentPointer } = useDispatch(OTHER_SETTING_STORE_NAME);
  const [showWebMonetization, setShowWebMonetization] = useState(!!DBPaymentPointer);
  useEffect(() => { setShowWebMonetization(!!DBPaymentPointer); }, [DBPaymentPointer]);
  const paymentPointerRef = useRef();
  async function confirmHandler() {
    if (!showWebMonetization) return;
    try {
      postPaymentPointer(paymentPointerRef.current.value); // change global state & DB
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  }
  useImperativeHandle(ref, () => ({
    submit: confirmHandler,
  }));
  return (
    <>
      <Section title={__('Web Monetization', 'likecoin')} />
      <WebMonetizationDescription />
      <FormTable>
        <CheckBox
          checked={showWebMonetization}
          handleCheck={setShowWebMonetization}
          title={__('Web Monetization', 'likecoin')}
          details={__('Enable', 'likecoin')}
        />
      </FormTable>
      {showWebMonetization && (
        <FormTable>
          <tr>
            <th scope="row">
              <label for="site_payment_pointer">
                {__('Payment pointer', 'likecoin')}
              </label>
            </th>
            <td>
              <input
                type="text"
                placeholder="$wallet.example.com/alice"
                defaultValue={DBPaymentPointer}
                ref={paymentPointerRef}
              ></input>
              {' '}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://webmonetization.org/docs/ilp-wallets/"
              >
                {__('What is payment pointer?', 'likecoin')}
              </a>
            </td>
          </tr>
        </FormTable>
      )}
    </>
  );
}

export default forwardRef(WebMonetizationSetting);
