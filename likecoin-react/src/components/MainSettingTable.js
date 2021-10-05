import { useRef, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import SubmitButton from './SubmitButton';
import CheckBox from './CheckBox';
import DropDown from './DropDown';
import Section from './Section';
import LikecoinInfoTable from './LikecoinInfoTable';
import SiteLikerInfoContext from '../context/site-likerInfo-context';
import SettingNotice from './SettingNotice';
import LikecoinHeading from './LikecoinHeading';

function MainSettingTable(props) {
  const ctx = useContext(SiteLikerInfoContext);
  const siteLikerIdEnabledRef = useRef(); // do not want to re-render the whole component until submit. Hence use useRef().
  const displayOptionRef = useRef();
  const perPostOptionEnabledRef = useRef();

  // in existing php method, it will show as '1', in React, it will show as true
  const DBSiteLikerIdEnable =
    ctx.DBSiteLikerIdEnabled === '1' || ctx.DBSiteLikerIdEnabled === true
      ? true
      : false;
  const DBPerPostOptionEnabled =
    ctx.DBPerPostOptionEnabled === '1' || ctx.DBPerPostOptionEnabled === true
      ? true
      : false;
  const [siteLikerIdEnabled, enableSiteLikerId] = useState(DBSiteLikerIdEnable);
  const [displayOptionSelected, selectDisplayOption] = useState(
    ctx.DBDisplayOptionSelected
  );
  const [perPostOptionEnabled, allowPerPostOption] = useState(
    DBPerPostOptionEnabled
  );
  const [likerIdValue, getLikerIdValue] = useState(ctx.DBSiteLikerId);
  const [likerDisplayName, getLikerDisplayName] = useState(
    ctx.DBSiteLikerDisplayName
  );
  const [likerWalletAddress, getLikerWalletAddress] = useState(
    ctx.DBSiteLikerWallet
  );
  const [likerAvatar, getLikerAvatar] = useState(ctx.DBSiteLikerAvatar);
  const [isLoading, setIsLoading] = useState(false);

  const [savedSuccessful, setSavedSuccessful] = useState(false);
  const [isChangingTypingLiker, setIsChangingTypingLiker] = useState(false);
  function handleLikerIdInputChange(e) {
    e.preventDefault();
    setIsChangingTypingLiker(true);
    const typingLikerId = e.target.value;
    getLikerIdValue(typingLikerId); // change liker Id based on user immediate input.
  }
  const pluginSettingOptions = [
    { value: 'always', label: 'Page and Post' },
    { value: 'post', label: 'Post Only' },
    { value: 'none', label: 'None' },
  ];
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
          getLikerDisplayName('-');
          getLikerWalletAddress('-');
          getLikerAvatar('-');
        }
      }, 500),
    []
  );
  useEffect(() => {
    fetchLikeCoinID(likerIdValue);
  }, [fetchLikeCoinID, likerIdValue]);

  useEffect(() => {
    enableSiteLikerId(DBSiteLikerIdEnable);
    selectDisplayOption(ctx.DBDisplayOptionSelected);
    allowPerPostOption(DBPerPostOptionEnabled);
  }, [
    DBSiteLikerIdEnable,
    ctx.DBDisplayOptionSelected,
    DBPerPostOptionEnabled,
  ]);
  useEffect(() => {
    getLikerIdValue(ctx.DBSiteLikerId);
    getLikerDisplayName(ctx.DBSiteLikerDisplayName);
    getLikerWalletAddress(ctx.DBSiteLikerWallet);
    getLikerAvatar(ctx.DBSiteLikerAvatar);
  }, [
    ctx.DBSiteLikerId,
    ctx.DBSiteLikerDisplayName,
    ctx.DBSiteLikerWallet,
    ctx.DBSiteLikerAvatar,
  ]);

  function handleClickOnChange(e) {
    e.preventDefault();
    setIsChangingTypingLiker(true);
  }

  function confirmHandler(e) {
    setSavedSuccessful(false);
    e.preventDefault();
    const siteLikerIdEnabled = siteLikerIdEnabledRef.current.checked;
    const displayOption = displayOptionRef.current.value;
    const perPostOptionEnabled = perPostOptionEnabledRef.current.checked;
    const data = {
      siteLikerIdEnabled,
      displayOption,
      perPostOptionEnabled,
      siteLikerInfos: {
        likecoin_id:
          likerDisplayName === '-' ? ctx.DBSiteLikerId : likerIdValue,
        display_name:
          likerDisplayName === '-'
            ? ctx.DBSiteLikerDisplayName
            : likerDisplayName,
        wallet:
          likerDisplayName === '-' ? ctx.DBSiteLikerWallet : likerWalletAddress,
        avatar: likerDisplayName === '-' ? ctx.DBSiteLikerAvatar : likerAvatar,
      },
    };
    try {
      props.onSubmit(data);
      // Only re-render . Do not refresh page.
      setSavedSuccessful(true);
      // Update parent context component.
      ctx.setSiteLikerIdEnabled(siteLikerIdEnabled);
      setIsChangingTypingLiker(false);
    } catch (error) {
      console.log('Error occured when saving to Wordpress DB: ', error);
      setIsChangingTypingLiker(false);
    }
  }
  function handleNoticeDismiss(e) {
    e.preventDefault();
    setSavedSuccessful(false);
  }
  const handleDisconnect = () => {};
  return (
    <div>
      <LikecoinHeading />
      {!savedSuccessful && ''}
      {savedSuccessful && likerDisplayName !== '-' && (
        <SettingNotice
          text="Settings Saved"
          className="notice-success"
          handleNoticeDismiss={handleNoticeDismiss}
        />
      )}
      {savedSuccessful && likerDisplayName === '-' && (
        <SettingNotice
          text="Site Liker ID is missing"
          className="notice-error"
        />
      )}
      <form onSubmit={confirmHandler}>
        <Section title={'Site Liker ID'} />
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
            isChangingTypingLiker={isChangingTypingLiker}
            handleClickOnChange={handleClickOnChange}
            handleLikerIdInputChange={handleLikerIdInputChange}
            handleDisconnect={handleDisconnect}
            editable={true}
            isMainSettingPage={true}
            showChangeButton={true}
            showDisconnectButton={false}
          />
        ) : (
          ''
        )}
        <Section title={'Site LikeCoin button display setting'} />
        <DropDown
          selected={displayOptionSelected}
          handleSelect={selectDisplayOption}
          title="Display option"
          selectRef={displayOptionRef}
          options={pluginSettingOptions}
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

export default MainSettingTable;
