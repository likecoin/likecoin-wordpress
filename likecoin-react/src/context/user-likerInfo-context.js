import React, { useState, useEffect } from 'react';
const UserLikerInfoContext = React.createContext({
  DBUserLikerId: '',
  DBUserLikerAvatar: '',
  DBUserLikerDisplayName: '',
  DBUserLikerWallet: '',
  hasValidLikecoinId: false,
});

export const UserLikerInfoProvider = (props) => {
  const [DBUserLikerId, getDBUserLikerId] = useState('');
  const [DBUserLikerAvatar, getDBUserLikerAvatar] = useState('');
  const [DBUserLikerDisplayName, getDBUserLikerDisplayName] = useState('');
  const [DBUserLikerWallet, getDBUserLikerWallet] = useState('');
  const [hasValidLikecoinId, setHasValidLikecoinId] = useState(false);

  async function fetchWordpressDBUserLikerInfoData() {
    fetch(
      `${window.wpApiSettings.root}likecoin-react/v1/likecoin-button-page`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.wpApiSettings.nonce,
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (
          res.data.likecoin_user &&
          res.data.likecoin_id.length > 0 &&
          res.data.likecoin_id !== '-'
        ) {
          getDBUserLikerId(res.data.likecoin_id);
          getDBUserLikerAvatar(res.data.likecoin_user.avatar);
          getDBUserLikerDisplayName(res.data.likecoin_user.display_name);
          getDBUserLikerWallet(res.data.likecoin_user.wallet);
          setHasValidLikecoinId(true);
        }
      });
  }
  useEffect(() => {
    fetchWordpressDBUserLikerInfoData();
  }, []);

  return (
    <UserLikerInfoContext.Provider
      value={{
        DBUserLikerId,
        DBUserLikerAvatar,
        DBUserLikerDisplayName,
        DBUserLikerWallet,
        hasValidLikecoinId,
      }}
    >
      {props.children}
    </UserLikerInfoContext.Provider>
  );
};

export default UserLikerInfoContext;
