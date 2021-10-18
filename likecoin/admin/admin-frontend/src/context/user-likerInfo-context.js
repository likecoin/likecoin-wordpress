import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    try {
      const response = await axios.get(
        `${window.wpApiSettings.root}likecoin/v1/likecoin-button-page`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': window.wpApiSettings.nonce,
          },
        }
      );
      if (
        response.data.data.likecoin_user &&
        response.data.data.likecoin_id.length > 0 &&
        response.data.data.likecoin_id !== '-'
      ) {
        getDBUserLikerId(response.data.data.likecoin_id);
        getDBUserLikerAvatar(response.data.data.likecoin_user.avatar);
        getDBUserLikerDisplayName(
          response.data.data.likecoin_user.display_name
        );
        getDBUserLikerWallet(response.data.data.likecoin_user.wallet);
        setHasValidLikecoinId(true);
      }
    } catch (error) {
      console.log(error);
    }
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
