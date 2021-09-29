import { useRef, useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { debounce } from "lodash";
import SubmitButton from "./SubmitButton";
import CheckBox from "./CheckBox";
import SelectDropDown from "./SelectDropDown";
import Section from "./Section";
import LikecoinInfoTable from "./LikecoinInfoTable";
import LikerInfoContext from "../context/likerInfo-context";
import SettingNotice from "./SettingNotice";

function InputForm(props) {
  const ctx = useContext(LikerInfoContext);
  const siteLikerIdEnabledRef = useRef(); // do not want to re-render the whole component until submit. Hence use useRef().
  const displayOptionRef = useRef();
  const perPostOptionEnabledRef = useRef();
  // in existing php method, it will show as '1', in React, it will show as true
  const DBsiteLikerIdEnable =
    ctx.DBsiteLikerIdEnabled === "1" || ctx.DBsiteLikerIdEnabled === true
      ? true
      : false;
  const DBperPostOptionEnabled =
    ctx.DBperPostOptionEnabled === "1" || ctx.DBperPostOptionEnabled === true
      ? true
      : false;
  const [siteLikerIdEnabled, enableSiteLikerId] = useState(
    // need to re-render the component while user typing. Hence use useState.

    DBsiteLikerIdEnable
  );

  const [displayOptionSelected, selectDisplayOption] = useState(
    ctx.DBdisplayOptionSelected
  );
  const [perPostOptionEnabled, allowPerPostOption] = useState(
    DBperPostOptionEnabled
  );
  const [likerIdValue, getLikerIdValue] = useState(ctx.DBLikerId);
  const [likerDisplayName, getLikerDisplayName] = useState(ctx.DBdisplayName);
  const [likerWalletAddress, getLikerWalletAddress] = useState(ctx.DBwallet);
  const [likerAvatar, getLikerAvatar] = useState(ctx.DBavatar);
  const [isLoading, setIsLoading] = useState(false);

  const [savedSuccessful, setSavedSuccessful] = useState(false);
  const [isChangingSiteLiker, setIsChangingSiteLiker] = useState(false);
  function handleLikerIdInputChange(e) {
    const typingLikerId = e.target.value;
    getLikerIdValue(typingLikerId); // change liker Id based on user immediate input.
  }
  // Update Data
  const fetchLikeCoinID = useMemo(
    () =>
      debounce(async (likerId) => {
        setSavedSuccessful(false);
        setIsLoading(true);
        try {
          const response = await axios.get(
            `https://api.like.co/users/id/${likerId}/min`
          );
          getLikerIdValue(response.data.user);
          getLikerDisplayName(response.data.displayName);
          getLikerWalletAddress(response.data.cosmosWallet); // change wallet address based on database.
          getLikerAvatar(response.data.avatar);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
          getLikerDisplayName("-");
          getLikerWalletAddress("-");
          getLikerAvatar("-");
        }
      }, 500),
    []
  );
  useEffect(() => {
    fetchLikeCoinID(likerIdValue);
  }, [fetchLikeCoinID, likerIdValue]);

  useEffect(() => {
    enableSiteLikerId(DBsiteLikerIdEnable);
    selectDisplayOption(ctx.DBdisplayOptionSelected);
    allowPerPostOption(DBperPostOptionEnabled);
  }, [
    DBsiteLikerIdEnable,
    ctx.DBdisplayOptionSelected,
    DBperPostOptionEnabled,
  ]);
  useEffect(() => {
    getLikerIdValue(ctx.DBLikerId);
    getLikerDisplayName(ctx.DBdisplayName);
    getLikerWalletAddress(ctx.DBwallet);
    getLikerAvatar(ctx.DBavatar);
  }, [ctx.DBLikerId, ctx.DBdisplayName, ctx.DBwallet, ctx.DBavatar]);

  function submitHandler(e) {
    setSavedSuccessful(false);
    e.preventDefault();
    const siteLikerIdEnabled = siteLikerIdEnabledRef.current.checked;
    const displayOption = displayOptionRef.current.value;
    const perPostOptionEnabled = perPostOptionEnabledRef.current.checked;
    const data = {
      siteLikerIdEnabled,
      displayOption,
      perPostOptionEnabled,
      likerInfos: {
        likecoin_id: likerDisplayName === "-" ? ctx.DBLikerId : likerIdValue,
        display_name:
          likerDisplayName === "-" ? ctx.DBdisplayName : likerDisplayName,
        wallet: likerDisplayName === "-" ? ctx.DBwallet : likerWalletAddress,
        avatar: likerDisplayName === "-" ? ctx.DBavatar : likerAvatar,
      },
    };
    try {
      props.onAddInput(data);
      // Only re-render . Do not refresh page.
      setSavedSuccessful(true);
    } catch (error) {
      console.log("Error occured when saving to Wordpress DB: ", error);
    }
  }
  function handleIsChangingSiteLiker(e) {
    e.preventDefault();
    setIsChangingSiteLiker(true);
  }
  function handleNoticeDismiss(e) {
    e.preventDefault();
    setSavedSuccessful(false);
  }
  return (
    <div>
      <h1> LikeCoin </h1>
      {!savedSuccessful && ""}
      {savedSuccessful && likerDisplayName !== "-" && (
        <SettingNotice
          text="Settings Saved"
          cssClass="notice-success"
          handleNoticeDismiss={handleNoticeDismiss}
        />
      )}
      {savedSuccessful && likerDisplayName === "-" && (
        <SettingNotice
          text="Site Liker ID is missing"
          cssClass="notice-error"
        />
      )}
      <form onSubmit={submitHandler}>
        <Section title={"Site Liker ID"} />
        <CheckBox
          checked={siteLikerIdEnabled}
          handleCheck={enableSiteLikerId}
          title="Enable site Liker ID"
          details="Override all LikeCoin button with site Liker ID"
          checkRef={siteLikerIdEnabledRef}
        />
        {siteLikerIdEnabled ? (
          <LikecoinInfoTable
            likerIdValue={likerIdValue}
            likerDisplayName={likerDisplayName}
            likerWalletAddress={likerWalletAddress}
            likerAvatar={likerAvatar}
            isLoading={isLoading}
            isChangingSiteLiker={isChangingSiteLiker}
            handleIsChangingSiteLiker={handleIsChangingSiteLiker}
            handleLikerIdInputChange={handleLikerIdInputChange}
          />
        ) : (
          ""
        )}
        <Section title={"Site LikeCoin button display setting"} />
        <SelectDropDown
          selected={displayOptionSelected}
          handleSelect={selectDisplayOption}
          title="Display option"
          selectRef={displayOptionRef}
        />
        <CheckBox
          checked={perPostOptionEnabled}
          handleCheck={allowPerPostOption}
          title="Allow per Post option"
          details="Allow editors to customize display setting per post"
          checkRef={perPostOptionEnabledRef}
        />
        <SubmitButton />
      </form>
    </div>
  );
}

export default InputForm;
