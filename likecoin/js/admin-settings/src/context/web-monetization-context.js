import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WebMonetizationContext = React.createContext({
  DBPaymentPointer: '',
});

export const WebMonetizationProvider = (props) => {
  const [DBPaymentPointer, getDBPaymentPointer] = useState('');
  async function fetchWordpressDBWebMonetizationData() {
    try {
      const response = await axios.get(
        `${window.wpApiSettings.root}likecoin/v1/web-monetization-page`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': window.wpApiSettings.nonce, // prevent CORS attack.
          },
        },
      );
      if (response.data) {
        if (response.data.data) {
          if (response.data.data.site_payment_pointer) {
            getDBPaymentPointer(response.data.data.site_payment_pointer);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchWordpressDBWebMonetizationData();
  }, []);

  return (
    <WebMonetizationContext.Provider
      value={{
        DBPaymentPointer,
      }}
    >
      {props.children}
    </WebMonetizationContext.Provider>
  );
};

export default WebMonetizationContext;
