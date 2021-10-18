import { useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { __ } from '@wordpress/i18n';
import { debounce } from 'lodash';
import Section from '../components/Section';
import LikecoinInfoTable from '../components/LikecoinInfoTable';
import UserLikerInfoContext from '../context/user-likerInfo-context';
import SiteLikerInfoContext from '../context/site-likerInfo-context';
import SubmitButton from '../components/SubmitButton';
import LikeButtonPreview from '../components/LikeButtonPreview';
import SettingNotice from '../components/SettingNotice';
import LikecoinHeading from '../components/LikecoinHeading';

function LikecoinButtonPage() {
  const siteLikerCtx = useContext(SiteLikerInfoContext);
  const userLikerCtx = useContext(UserLikerInfoContext);
  const DBSiteLikerIdEnable =
    siteLikerCtx.DBSiteLikerIdEnabled === '1' ||
    siteLikerCtx.DBSiteLikerIdEnabled === true
      ? true
      : false;

  const [siteLikerIdEnabled, enableSiteLikerId] = useState(DBSiteLikerIdEnable);
  // If siteLikerId is enabled === not editable, then overwrite the user liker info with site liker info
  const defaultLikerId = siteLikerIdEnabled
    ? siteLikerCtx.DBSiteLikerId
    : userLikerCtx.DBUserLikerId;
  const defaultLikerDisplayName = siteLikerIdEnabled
    ? siteLikerCtx.DBSiteLikerDisplayName
    : userLikerCtx.DBUserLikerDisplayName;
  const defaultLikerWalletAddress = siteLikerIdEnabled
    ? siteLikerCtx.DBSiteLikerWallet
    : userLikerCtx.DBUserLikerWallet;
  const defaultLikerAvatar = siteLikerIdEnabled
    ? siteLikerCtx.DBSiteLikerAvatar
    : userLikerCtx.DBUserLikerAvatar;
  const [likerIdValue, getLikerIdValue] = useState(defaultLikerId);
  const [likerDisplayName, getLikerDisplayName] = useState(
    defaultLikerDisplayName
  );
  const [likerWalletAddress, getLikerWalletAddress] = useState(
    defaultLikerWalletAddress
  );
  const [likerAvatar, getLikerAvatar] = useState(defaultLikerAvatar);
  const [savedSuccessful, setSavedSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisconnect, setIsDisconnect] = useState(false);
  const [isChangingTypingLiker, setIsChangingTypingLiker] = useState(false);
  const [hasValidLikecoinId, setHasValidLikecoinId] = useState(
    userLikerCtx.hasValidLikecoinId
  );
  const [showChangeButton, setShowChangeButton] = useState(true);
  const [showDisconnectButton, setShowDisconnectButton] = useState(false);

  // Update Data based on data returned by likecoin server.
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
          setHasValidLikecoinId(true);
        } catch (error) {
          setIsLoading(false);
          getLikerDisplayName('-');
          getLikerWalletAddress('-');
          getLikerAvatar('-');
          setHasValidLikecoinId(false);
        }
      }, 500),
    []
  );
  useEffect(() => {
    fetchLikeCoinID(likerIdValue);
  }, [fetchLikeCoinID, likerIdValue]);
  useEffect(() => {
    enableSiteLikerId(DBSiteLikerIdEnable);
    getLikerIdValue(defaultLikerId);
    getLikerDisplayName(defaultLikerDisplayName);
    getLikerWalletAddress(defaultLikerWalletAddress);
    getLikerAvatar(defaultLikerAvatar);
    setShowChangeButton(defaultLikerId ? true : false);
    setShowDisconnectButton(defaultLikerId ? true : false);
  }, [
    DBSiteLikerIdEnable,
    defaultLikerId,
    defaultLikerDisplayName,
    defaultLikerWalletAddress,
    defaultLikerAvatar,
  ]);
  async function postUserDataToWordpress(dataToPost) {
    try {
      await axios.post(
        `${window.wpApiSettings.root}likecoin/v1/likecoin-button-page`,
        JSON.stringify(dataToPost),
        {
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': window.wpApiSettings.nonce,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  function confirmHandler(e) {
    setSavedSuccessful(false);
    e.preventDefault();
    setShowChangeButton(false);
    const data = {
      userLikerInfos: {
        likecoin_id:
          likerDisplayName === '-' ? userLikerCtx.DBSiteLikerId : likerIdValue,
        display_name:
          likerDisplayName === '-'
            ? userLikerCtx.DBSiteLikerDisplayName
            : likerDisplayName,
        wallet:
          likerDisplayName === '-'
            ? userLikerCtx.DBSiteLikerWallet
            : likerWalletAddress,
        avatar:
          likerDisplayName === '-'
            ? userLikerCtx.DBSiteLikerAvatar
            : likerAvatar,
      },
    };
    try {
      postUserDataToWordpress(data);
      // Only re-render . Do not refresh page.
      setSavedSuccessful(true);
      setShowDisconnectButton(true);
      setIsChangingTypingLiker(false);
      setShowChangeButton(true);
      setShowDisconnectButton(true);
    } catch (error) {
      console.log('Error occured when saving to Wordpress DB: ', error);
      setIsChangingTypingLiker(false);
      setShowChangeButton(true);
    }
  }

  function handleClickOnChange(e) {
    e.preventDefault();
    setIsChangingTypingLiker(true);
  }

  function handleLikerIdInputChange(e) {
    e.preventDefault();
    setIsChangingTypingLiker(true);
    const typingLikerId = e.target.value;
    getLikerIdValue(typingLikerId); // change liker Id based on user immediate input.
  }
  function handleNoticeDismiss(e) {
    e.preventDefault();
    setSavedSuccessful(false);
  }
  function handleDisconnect(e) {
    e.preventDefault();
    getLikerIdValue('-');
    getLikerDisplayName('-');
    getLikerWalletAddress('-');
    getLikerAvatar('-');
    setIsDisconnect(true);
  }
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
          text={__('Your Liker ID is missing', 'likecoin')}
          className="notice-error"
        />
      )}
      <Section title={__('Your Liker ID', 'likecoin')} />
      <form onSubmit={confirmHandler}>
        <LikecoinInfoTable
          likerIdValue={likerIdValue}
          likerDisplayName={likerDisplayName}
          likerWalletAddress={likerWalletAddress}
          likerAvatar={likerAvatar}
          isLoading={isLoading}
          handleClickOnChange={handleClickOnChange}
          handleLikerIdInputChange={handleLikerIdInputChange}
          isChangingTypingLiker={isChangingTypingLiker}
          handleDisconnect={handleDisconnect}
          hasValidLikecoinId={hasValidLikecoinId}
          editable={!siteLikerIdEnabled}
          setIsDisconnect={setIsDisconnect}
          isMainSettingPage={false}
          showChangeButton={showChangeButton}
          showDisconnectButton={showDisconnectButton}
        />
        <Section title={__('Your Likecoin button', 'likecoin')} />
        {hasValidLikecoinId ? (
          <LikeButtonPreview
            userLikerId={likerIdValue}
            hasValidLikecoinId={hasValidLikecoinId}
          />
        ) : (
          ''
        )}
        <SubmitButton />
      </form>
    </div>
  );
}

export default LikecoinButtonPage;
