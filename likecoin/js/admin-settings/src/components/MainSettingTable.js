import {
  useRef, useContext, useState, useEffect, useMemo,
} from 'react';
import axios from 'axios';
import { __ } from '@wordpress/i18n';
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
  /* do not want to re-render the whole component until submit. Hence use useRef(). */
  const siteLikerIdEnabledRef = useRef();
  const displayOptionRef = useRef();
  const perPostOptionEnabledRef = useRef();

  // in existing php method, it will show as '1', in React, it will show as true
  const DBSiteLikerIdEnable = !!(ctx.DBSiteLikerIdEnabled === '1' || ctx.DBSiteLikerIdEnabled === true);
  const DBPerPostOptionEnabled = !!(ctx.DBPerPostOptionEnabled === '1' || ctx.DBPerPostOptionEnabled === true);
  const [siteLikerIdEnabled, enableSiteLikerId] = useState(DBSiteLikerIdEnable);

  const [displayOptionSelected, selectDisplayOption] = useState(
    ctx.DBDisplayOptionSelected,
  );
  const [perPostOptionEnabled, allowPerPostOption] = useState(
    DBPerPostOptionEnabled,
  );
  const [likerIdValue, getLikerIdValue] = useState(ctx.DBSiteLikerId);
  const [likerDisplayName, getLikerDisplayName] = useState(
    ctx.DBSiteLikerDisplayName,
  );
  const [likerWalletAddress, getLikerWalletAddress] = useState(
    ctx.DBSiteLikerWallet,
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
    { value: 'always', label: __('Page and Post', 'likecoin') },
    { value: 'post', label: __('Post Only', 'likecoin') },
    { value: 'none', label: __('None', 'likecoin') },
  ];
  // Update Data
  const fetchLikeCoinID = useMemo(
    () => debounce(async (likerId) => {
      setSavedSuccessful(false);
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://api.like.co/users/id/${likerId}/min`,
        );
        getLikerIdValue(response.data.user);
        getLikerDisplayName(response.data.displayName);
        /* change wallet address based on database. */
        getLikerWalletAddress(response.data.cosmosWallet);
        getLikerAvatar(response.data.avatar);
      } catch (error) {
        console.error(error);
        getLikerDisplayName('-');
        getLikerWalletAddress('-');
        getLikerAvatar('-');
      }
      setIsLoading(false);
    }, 500),
    [],
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
    const isSiteLikerIdEnabled = siteLikerIdEnabledRef.current.checked;
    const displayOption = displayOptionRef.current.value;
    const isPerPostOptionEnabled = perPostOptionEnabledRef.current.checked;
    const data = {
      siteLikerIdEnabled: isSiteLikerIdEnabled,
      displayOption,
      perPostOptionEnabled: isPerPostOptionEnabled,
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
      ctx.setSiteLikerIdEnabled(isSiteLikerIdEnabled);
      setIsChangingTypingLiker(false);
    } catch (error) {
      console.error('Error occured when saving to Wordpress DB: ', error);
      setIsChangingTypingLiker(false);
    }
  }
  function handleNoticeDismiss(e) {
    e.preventDefault();
    setSavedSuccessful(false);
  }
  const handleDisconnect = () => {};
  return (
    <div className="wrap likecoin">
      <LikecoinHeading />
      {!savedSuccessful && ''}
      {savedSuccessful && likerDisplayName !== '-' && (
        <SettingNotice
          text={__('Settings Saved', 'likecoin')}
          className="notice-success"
          handleNoticeDismiss={handleNoticeDismiss}
        />
      )}
      {savedSuccessful && likerDisplayName === '-' && (
        <SettingNotice
          text={__('Site Liker ID is missing', 'likecoin')}
          className="notice-error"
        />
      )}
      <form onSubmit={confirmHandler}>
        <Section title={__('Site Liker ID', 'likecoin')} />
        <CheckBox
          checked={siteLikerIdEnabled}
          handleCheck={enableSiteLikerId}
          title={__('Enable site Liker ID', 'likecoin')}
          details={__(
            'Override all LikeCoin button with site Liker ID',
            'likecoin',
          )}
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
        <Section
          title={__('Site LikeCoin button display setting', 'likecoin')}
        />
        <DropDown
          selected={displayOptionSelected}
          handleSelect={selectDisplayOption}
          title={__('Display option', 'likecoin')}
          selectRef={displayOptionRef}
          options={pluginSettingOptions}
        />
        <CheckBox
          checked={perPostOptionEnabled}
          handleCheck={allowPerPostOption}
          title={__('Allow per Post option', 'likecoin')}
          details={__(
            'Allow editors to customize display setting per post',
            'likecoin',
          )}
          checkRef={perPostOptionEnabledRef}
        />
        <SubmitButton />
      </form>
    </div>
  );
}

export default MainSettingTable;
