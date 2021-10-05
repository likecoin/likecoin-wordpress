import React, { useState, useEffect } from 'react';
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
    fetch(`${window.wpApiSettings.root}likecoin-react/v1/main-setting-page`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.wpApiSettings.nonce, // prevent CORS attack.
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (
          res.data.site_likecoin_user.likecoin_id &&
          res.data.site_likecoin_user.avatar &&
          res.data.site_likecoin_user.wallet &&
          res.data.site_likecoin_user.display_name
        ) {
          getDBSiteLikerId(res.data.site_likecoin_user.likecoin_id);
          getDBSiteLikerAvatar(res.data.site_likecoin_user.avatar);
          getDBSiteLikerDisplayName(res.data.site_likecoin_user.display_name);
          getDBSiteLikerWallet(res.data.site_likecoin_user.wallet);
        }
        enableDBSiteLikerId(res.data.site_likecoin_id_enbled);
        selectDBDisplayOption(res.data.button_display_option);
        allowDBPerPostOption(res.data.button_display_author_override);
      });
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
