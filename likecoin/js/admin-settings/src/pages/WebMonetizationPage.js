import {
  useRef, useState, useEffect,
} from 'react';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import LikecoinHeading from '../components/LikecoinHeading';
import Section from '../components/Section';
import SettingNotice from '../components/SettingNotice';
import SubmitButton from '../components/SubmitButton';
import WebMonetizationDescription from '../components/WebMonetizationDescription';
import { WEB_MONETIZATION_STORE_NAME } from '../store/web-monetization-store';

function WebMonetizationPage() {
  // eslint-disable-next-line arrow-body-style
  const { DBPaymentPointer } = useSelect((select) => select(WEB_MONETIZATION_STORE_NAME)
    .selectPaymentPointer());
  const { postPaymentPointer } = useDispatch(WEB_MONETIZATION_STORE_NAME);
  const [savedSuccessful, setSavedSuccessful] = useState(false);
  const [paymentPointer, setPaymentPointer] = useState(DBPaymentPointer);
  const paymentPointerRef = useRef();
  async function confirmHandler(e) {
    setSavedSuccessful(false);
    e.preventDefault();
    const data = {
      paymentPointer: paymentPointerRef.current.value,
    };
    try {
      postPaymentPointer(data.paymentPointer); // change global state & DB
      setSavedSuccessful(true);
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
      setSavedSuccessful(false);
    }
  }
  function handlePaymentPointerChange(e) {
    e.preventDefault();
    const typingInput = e.target.value;
    setPaymentPointer(typingInput); // change liker Id based on user immediate input.
  }
  function handleNoticeDismiss(e) {
    e.preventDefault();
    setSavedSuccessful(false);
  }
  useEffect(() => {
    setPaymentPointer(DBPaymentPointer);
  }, [DBPaymentPointer]);

  return (
    <div className="wrap likecoin">
      <LikecoinHeading />
      {!savedSuccessful && ''}
      {savedSuccessful && (
        <SettingNotice
          text="Settings Saved"
          className="notice-success"
          handleNoticeDismiss={handleNoticeDismiss}
        />
      )}
      <WebMonetizationDescription />
      <form onSubmit={confirmHandler}>
        <Section title={'Web Monetization'} />
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
                  value={paymentPointer}
                  ref={paymentPointerRef}
                  onChange={handlePaymentPointerChange}
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
      </form>
    </div>
  );
}

export default WebMonetizationPage;
