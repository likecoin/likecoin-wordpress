import {
  useRef, useState, useEffect, useMemo,
} from 'react';
import axios from 'axios';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { debounce } from 'lodash';
import SubmitButton from './SubmitButton';
import CheckBox from './CheckBox';
import DropDown from './DropDown';
import Section from './Section';
import LikecoinInfoTable from './LikecoinInfoTable';
import SettingNotice from './SettingNotice';
import LikecoinHeading from './LikecoinHeading';
import { SITE_LIKER_INFO_STORE_NAME } from '../store/site-likerInfo-store';

function MainSettingTable(props) {
  /* do not want to re-render the whole component until submit. Hence use useRef(). */
  const siteLikerIdEnabledRef = useRef();
  const displayOptionRef = useRef();
  const perPostOptionEnabledRef = useRef();
  const {
    DBSiteLikerId,
    DBSiteLikerAvatar,
    DBSiteLikerDisplayName,
    DBSiteLikerWallet,
    DBSiteLikerIdEnabled,
    DBDisplayOptionSelected,
    DBPerPostOptionEnabled,
  } = useSelect((select) => select(SITE_LIKER_INFO_STORE_NAME).selectSiteLikerInfo());
  const [siteLikerIdEnabled, enableSiteLikerId] = useState(DBSiteLikerIdEnabled);
  const [displayOptionSelected, selectDisplayOption] = useState(
    DBDisplayOptionSelected,
  );
  const [perPostOptionEnabled, allowPerPostOption] = useState(
    DBPerPostOptionEnabled,
  );
  const [likerIdValue, getLikerIdValue] = useState(DBSiteLikerId);
  const [likerDisplayName, getLikerDisplayName] = useState(
    DBSiteLikerDisplayName,
  );
  const [likerWalletAddress, getLikerWalletAddress] = useState(
    DBSiteLikerWallet,
  );
  const [likerAvatar, getLikerAvatar] = useState(DBSiteLikerAvatar);
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
        getLikerWalletAddress(response.data.cosmosWallet);
        getLikerAvatar(response.data.avatar);
      } catch (error) {
        console.error(error); // eslint-disable-line no-console
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
    enableSiteLikerId(DBSiteLikerIdEnabled);
    selectDisplayOption(DBDisplayOptionSelected);
    allowPerPostOption(DBPerPostOptionEnabled);
  }, [
    DBSiteLikerIdEnabled,
    DBDisplayOptionSelected,
    DBPerPostOptionEnabled,
  ]);
  useEffect(() => {
    getLikerIdValue(DBSiteLikerId);
    getLikerDisplayName(DBSiteLikerDisplayName);
    getLikerWalletAddress(DBSiteLikerWallet);
    getLikerAvatar(DBSiteLikerAvatar);
  }, [
    DBSiteLikerId,
    DBSiteLikerDisplayName,
    DBSiteLikerWallet,
    DBSiteLikerAvatar,
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
          likerDisplayName === '-' ? DBSiteLikerId : likerIdValue,
        display_name:
          likerDisplayName === '-'
            ? DBSiteLikerDisplayName
            : likerDisplayName,
        wallet:
          likerDisplayName === '-' ? DBSiteLikerWallet : likerWalletAddress,
        avatar: likerDisplayName === '-' ? DBSiteLikerAvatar : likerAvatar,
      },
    };
    try {
      // change global state & DB
      props.onSubmit(data);
      // Only re-render . Do not refresh page.
      setSavedSuccessful(true);
      setIsChangingTypingLiker(false);
    } catch (error) {
      console.error('Error occured when saving to Wordpress DB: ', error); // eslint-disable-line no-console
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
