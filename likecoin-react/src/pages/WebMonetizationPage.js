import { useRef, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import LikecoinHeading from '../components/LikecoinHeading';
import Section from '../components/Section';
import SettingNotice from '../components/SettingNotice';
import SubmitButton from '../components/SubmitButton';
import WebMonetizationDescription from '../components/WebMonetizationDescription';
import WebMonetizationContext from '../context/web-monetization-context';
import { __ } from '@wordpress/i18n';

function WebMonetizationPage() {
  const webMonetizationCtx = useContext(WebMonetizationContext);
  const { DBPaymentPointer } = webMonetizationCtx;
  const [savedSuccessful, setSavedSuccessful] = useState(false);
  const [paymentPointer, setPaymentPointer] = useState(DBPaymentPointer);
  const paymentPointerRef = useRef();

  async function saveToWordpressMonetizationOption(data) {
    try {
      await axios.post(
        `${window.wpApiSettings.root}likecoin-react/v1/web-monetization-page`,
        JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': window.wpApiSettings.nonce, // prevent CORS attack.
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  async function confirmHandler(e) {
    setSavedSuccessful(false);
    e.preventDefault();
    const data = {
      paymentPointer: paymentPointerRef.current.value,
    };
    try {
      await saveToWordpressMonetizationOption(data);
      setSavedSuccessful(true);
    } catch (error) {
      console.log(error);
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
                  {__('Payment pointer', 'likecoin-react')}
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
                  {__('What is payment pointer?', 'likecoin-react')}
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
