import {
  useRef, useState, useEffect,
} from 'react';
import axios from 'axios';
import { useSelect, useDispatch } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import LikecoinHeading from '../components/LikecoinHeading';
import Section from '../components/Section';
import SettingNotice from '../components/SettingNotice';
import SubmitButton from '../components/SubmitButton';
import WebMonetizationDescription from '../components/WebMonetizationDescription';
import { WEB_MONETIZATION_STORE_NAME } from '../store/web-monetization/index';

// import WebMonetizationContext from '../context/web-monetization-context';

function WebMonetizationPage() {
  // eslint-disable-next-line arrow-body-style
  const { DBPaymentPointer } = useSelect((select) => {
    return {
      DBPaymentPointer: select(WEB_MONETIZATION_STORE_NAME).getPaymentPointer(),
    };
  });
  const { postPaymentPointer } = useDispatch(WEB_MONETIZATION_STORE_NAME);
  const [savedSuccessful, setSavedSuccessful] = useState(false);
  const [paymentPointer, setPaymentPointer] = useState(DBPaymentPointer);
  const paymentPointerRef = useRef();

  async function saveToWordpressMonetizationOption(data) {
    try {
      await axios.post(
        `${window.wpApiSettings.root}likecoin/v1/web-monetization-page`,
        JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': window.wpApiSettings.nonce, // prevent CORS attack.
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  }
  const confirmHandler = useCallback(
    async (e) => {
      setSavedSuccessful(false);
      e.preventDefault();
      const data = {
        paymentPointer: paymentPointerRef.current.value,
      };
      try {
        await saveToWordpressMonetizationOption(data); // change real DB
        postPaymentPointer(data.paymentPointer); // change the app-wise context
        setSavedSuccessful(true);
      } catch (error) {
        console.error(error);
        setSavedSuccessful(false);
      }
    },
    [paymentPointerRef, postPaymentPointer],
  );
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
