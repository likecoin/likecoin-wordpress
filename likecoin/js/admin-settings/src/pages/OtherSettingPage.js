import { useRef, useState, useEffect } from 'react';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import CheckBox from '../components/CheckBox';
import Section from '../components/Section';
import SettingNotice from '../components/SettingNotice';
import SubmitButton from '../components/SubmitButton';
import WebMonetizationDescription from '../components/WebMonetizationDescription';
import { OTHER_SETTING_STORE_NAME } from '../store/other-setting-store';

function OtherSettingPage() {
  // eslint-disable-next-line arrow-body-style
  const DBPaymentPointer = useSelect((select) => select(OTHER_SETTING_STORE_NAME)
    .selectPaymentPointer());
  const { postPaymentPointer } = useDispatch(OTHER_SETTING_STORE_NAME);
  const [savedSuccessful, setSavedSuccessful] = useState(false);
  const [showWebMonetization, setShowWebMonetization] = useState(!!DBPaymentPointer);
  useEffect(() => { setShowWebMonetization(!!DBPaymentPointer); }, [DBPaymentPointer]);
  const paymentPointerRef = useRef();
  async function confirmHandler(e) {
    setSavedSuccessful(false);
    e.preventDefault();
    try {
      postPaymentPointer(paymentPointerRef.current.value); // change global state & DB
      setSavedSuccessful(true);
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
      setSavedSuccessful(false);
    }
  }
  function handleNoticeDismiss(e) {
    e.preventDefault();
    setSavedSuccessful(false);
  }

  return (
    <div className="wrap likecoin">
      {savedSuccessful && (
        <SettingNotice
          text={__('Settings Saved', 'likecoin')}
          className="notice-success"
          handleNoticeDismiss={handleNoticeDismiss}
        />
      )}
      <Section title={__('Other settings', 'likecoin')} />
      <CheckBox
        checked={showWebMonetization}
        handleCheck={setShowWebMonetization}
        title={__('Web Monetization', 'likecoin')}
        details={__('Show Web Monetization settings', 'likecoin')} />
      {showWebMonetization && (
        <><WebMonetizationDescription /><form onSubmit={confirmHandler}>
          <table className="form-table" role="presentation">
            <tbody>
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
                  ></input>{' '}
                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://webmonetization.org/docs/ilp-wallets/"
                  >
                    {__('What is payment pointer?', 'likecoin')}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <SubmitButton />
        </form></>
      )}
    </div>
  );
}

export default OtherSettingPage;
