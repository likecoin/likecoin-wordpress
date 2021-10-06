import React, { useState, useEffect } from 'react';
import axios from 'axios';
const SiteLikerInfoContext = React.createContext({
  DBSiteLikerId: '',
  DBSiteLikerAvatar: '',
  DBSiteLikerDisplayName: '',
  DBSiteLikerWallet: '',
  DBSiteLikerIdEnabled: false,
  DBDisplayOptionSelected: 'Nonee',
  DBPerPostOptionEnabled: false,
  setSiteLikerIdEnabled: () => {},
});

export const SiteLikerInfoProvider = (props) => {
  const [DBSiteLikerId, getDBSiteLikerId] = useState('');
  const [DBSiteLikerAvatar, getDBSiteLikerAvatar] = useState('');
  const [DBSiteLikerDisplayName, getDBSiteLikerDisplayName] = useState('');
  const [DBSiteLikerWallet, getDBSiteLikerWallet] = useState('');
  const [DBSiteLikerIdEnabled, enableDBSiteLikerId] = useState(false);
  const [DBDisplayOptionSelected, selectDBDisplayOption] = useState('Nonee');
  const [DBPerPostOptionEnabled, allowDBPerPostOption] = useState(false);
  const setSiteLikerIdEnabled = (status) => enableDBSiteLikerId(status);
  // Get stored Data from DB when refreshing page
  async function fetchWordpressDBSiteLikerInfoData() {
    try {
      const response = await axios.get(
        `${window.wpApiSettings.root}likecoin-react/v1/main-setting-page`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': window.wpApiSettings.nonce, // prevent CORS attack.
          },
        }
      );
      if (response.data) {
        if (
          response.data.data.site_likecoin_user.likecoin_id &&
          response.data.data.site_likecoin_user.avatar &&
          response.data.data.site_likecoin_user.wallet &&
          response.data.data.site_likecoin_user.display_name
        ) {
          getDBSiteLikerId(response.data.data.site_likecoin_user.likecoin_id);
          getDBSiteLikerAvatar(response.data.data.site_likecoin_user.avatar);
          getDBSiteLikerDisplayName(
            response.data.data.site_likecoin_user.display_name
          );
          getDBSiteLikerWallet(response.data.data.site_likecoin_user.wallet);
        }
        enableDBSiteLikerId(response.data.data.site_likecoin_id_enbled);
        selectDBDisplayOption(response.data.data.button_display_option);
        allowDBPerPostOption(response.data.data.button_display_author_override);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchWordpressDBSiteLikerInfoData();
  }, []);

  return (
    <SiteLikerInfoContext.Provider
      value={{
        DBSiteLikerId,
        DBSiteLikerAvatar,
        DBSiteLikerDisplayName,
        DBSiteLikerWallet,
        DBSiteLikerIdEnabled,
        DBDisplayOptionSelected,
        DBPerPostOptionEnabled,
        setSiteLikerIdEnabled,
      }}
    >
      {props.children}
    </SiteLikerInfoContext.Provider>
  );
};

export default SiteLikerInfoContext;
