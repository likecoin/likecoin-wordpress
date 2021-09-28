import React, { useState, useEffect, useMemo } from "react";
const LikerInfoContext = React.createContext({
  DBLikerId: "",
  DBavatar: "",
  DBdisplayName: "",
  DBwallet: "",
  DBsiteLikerIdEnabled: false,
  DBdisplayOptionSelected: "Nonee",
  DBperPostOptionEnabled: false,
});

export const LikerInfoProvider = (props) => {
  const [DBLikerId, getDBLikerId] = useState("");
  const [DBavatar, getDBavatar] = useState("");
  const [DBdisplayName, getDBdisplayName] = useState("");
  const [DBwallet, getDBwallet] = useState("");
  const [DBsiteLikerIdEnabled, enableDBSiteLikerId] = useState(false);
  const [DBdisplayOptionSelected, selectDBDisplayOption] = useState("Nonee");
  const [DBperPostOptionEnabled, allowDBPerPostOption] = useState(false);
  // Get stored Data from DB when refreshing page
  async function fetchInitialLikerInfoData() {
    fetch(`${window.wpApiSettings.root}likecoin-react/v1/main-settingpage`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": window.wpApiSettings.nonce, // prevent CORS attack.
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("2 GET res.data: ", res.data);
        console.log("2 Update UI based on data from GET");
        if (
          res.data.site_likecoin_user.likecoin_id &&
          res.data.site_likecoin_user.avatar &&
          res.data.site_likecoin_user.wallet &&
          res.data.site_likecoin_user.display_name
        ) {
          getDBLikerId(res.data.site_likecoin_user.likecoin_id);
          getDBavatar(res.data.site_likecoin_user.avatar);
          getDBdisplayName(res.data.site_likecoin_user.wallet);
          getDBwallet(res.data.site_likecoin_user.display_name);
        }
        enableDBSiteLikerId(res.data.site_likecoin_id_enabled);
        selectDBDisplayOption(res.data.button_display_option);
        allowDBPerPostOption(res.data.button_display_author_override);
      });
  }
  useEffect(() => {
    fetchInitialLikerInfoData();
  }, []);

  return (
    <LikerInfoContext.Provider
      value={{
        DBLikerId: DBLikerId,
        DBavatar: DBavatar,
        DBdisplayName: DBdisplayName,
        DBwallet: DBwallet,
        DBsiteLikerIdEnabled: DBsiteLikerIdEnabled,
        DBdisplayOptionSelected: DBdisplayOptionSelected,
        DBperPostOptionEnabled: DBperPostOptionEnabled,
      }}
    >
      {props.children}
    </LikerInfoContext.Provider>
  );
};

export default LikerInfoContext;
