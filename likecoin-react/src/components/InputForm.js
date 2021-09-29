import { useRef, useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { debounce } from "lodash";
import SubmitButton from "./SubmitButton";
import CheckBox from "./CheckBox";
import SelectDropDown from "./SelectDropDown";
import Section from "./Section";
import LikecoinInfoTable from "./LikecoinInfoTable";
import LikerInfoContext from "../context/likerInfo-context";

function InputForm(props) {
  const ctx = useContext(LikerInfoContext);
  console.log("ctx at InputForm: ", ctx);
  const siteLikerIdEnabledRef = useRef();
  const displayOptionRef = useRef();
  const perPostOptionEnabledRef = useRef();
  const [siteLikerIdEnabled, enableSiteLikerId] = useState(
    ctx.DBsiteLikerIdEnabled
  );
  const [displayOptionSelected, selectDisplayOption] = useState(
    ctx.DBdisplayOptionSelected
  );
  const [perPostOptionEnabled, allowPerPostOption] = useState(
    ctx.DBperPostOptionEnabled
  );
  const [likerIdValue, getLikerIdValue] = useState(ctx.DBLikerId);
  const [likerDisplayName, getLikerDisplayName] = useState(ctx.DBdisplayName);
  const [likerWalletAddress, getLikerWalletAddress] = useState(ctx.DBwallet);
  const [likerAvatar, getLikerAvatar] = useState(ctx.DBavatar);
  const [isLoading, setIsLoading] = useState(false);

  function handleLikerIdInputChange(e) {
    const typingLikerId = e.target.value;
    getLikerIdValue(typingLikerId); // change liker Id based on user immediate input.
  }
  // Update Data
  const fetchLikeCoinID = useMemo(
    () =>
      debounce(async (likerId) => {
        console.log("Fetch likecoin API");
        setIsLoading(true);
        try {
          const response = await axios.get(
            `https://api.like.co/users/id/${likerId}/min`
          );
          getLikerIdValue(response.data.user);
          getLikerDisplayName(response.data.displayName);
          getLikerWalletAddress(response.data.cosmosWallet); // change wallet address based on database.
          getLikerAvatar(response.data.avatar);
          console.log("response from likecoin API: ", response);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
      }, 500),
    []
  );
  useEffect(() => {
    fetchLikeCoinID(likerIdValue);
  }, [fetchLikeCoinID, likerIdValue]);

  useEffect(() => {
    enableSiteLikerId(ctx.DBsiteLikerIdEnabled);
    selectDisplayOption(ctx.DBdisplayOptionSelected);
    allowPerPostOption(ctx.DBperPostOptionEnabled);
  }, [
    ctx.DBsiteLikerIdEnabled,
    ctx.DBdisplayOptionSelected,
    ctx.DBperPostOptionEnabled,
  ]);
    useEffect(() => {
      getLikerIdValue(ctx.DBLikerId);
      getLikerDisplayName(ctx.DBdisplayName);
      getLikerWalletAddress(ctx.DBwallet);
      getLikerAvatar(ctx.DBavatar);
    }, [ctx.DBLikerId, ctx.DBdisplayName, ctx.DBwallet, ctx.DBavatar]);
  
  function submitHandler(e) {
    e.preventDefault();
    const siteLikerIdEnabled = siteLikerIdEnabledRef.current.checked;
    const displayOption = displayOptionRef.current.value;
    const perPostOptionEnabled = perPostOptionEnabledRef.current.checked;
    const data = {
      siteLikerIdEnabled,
      displayOption,
      perPostOptionEnabled,
      likerInfos: {
        likecoin_id: likerIdValue,
        display_name: likerDisplayName,
        wallet: likerWalletAddress,
        avatar: likerAvatar,
      },
    };
    console.log("data to store in Wordpress DB:", data);
    props.onAddInput(data);
  }

  return (
    <div>
      <h1> LikeCoin </h1>
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
      {siteLikerIdEnabled ? <p>Liker ID YES</p> : <p>Liker ID No</p>}
      {displayOptionSelected}
      {perPostOptionEnabled ? <p>Per post YES</p> : <p>Per post NO</p>}
    </div>
  );
}

export default InputForm;