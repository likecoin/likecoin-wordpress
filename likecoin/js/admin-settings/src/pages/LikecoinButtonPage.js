import {
  useState, useEffect, useMemo,
} from 'react';
import axios from 'axios';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { debounce } from 'lodash';
import Section from '../components/Section';
import LikecoinInfoTable from '../components/LikecoinInfoTable';
import SubmitButton from '../components/SubmitButton';
import LikeButtonPreview from '../components/LikeButtonPreview';
import SettingNotice from '../components/SettingNotice';
import LikecoinHeading from '../components/LikecoinHeading';
import { SITE_LIKER_INFO_STORE_NAME } from '../store/site-likerInfo-store';
import { USER_LIKER_INFO_STORE_NAME } from '../store/user-likerInfo-store';

const { likecoHost } = window.likecoinReactAppData;

function PureLikecoinButtonPage(props) {
  const [siteLikerIdEnabled] = useState(props.DBSiteLikerIdEnabled);
  const [likerIdValue, setLikerIdValue] = useState(props.defaultLikerId);
  const [likerDisplayName, setLikerDisplayName] = useState(
    props.defaultLikerDisplayName,
  );
  const [likerWalletAddress, setLikerWalletAddress] = useState(
    props.defaultLikerWalletAddress,
  );
  const [likerAvatar, setLikerAvatar] = useState(props.defaultLikerAvatar);
  const [savedSuccessful, setSavedSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingTypingLiker, setIsChangingTypingLiker] = useState(false);
  const [hasValidLikecoinId, setHasValidLikecoinId] = useState(false);
  const [showChangeButton, setShowChangeButton] = useState(true);
  const [showDisconnectButton, setShowDisconnectButton] = useState(false);

  // Update Data based on data returned by likecoin server.
  const fetchLikeCoinID = useMemo(
    () => debounce(async (likerId) => {
      setSavedSuccessful(false);
      if (!likerId) return;
      try {
        const response = await axios.get(
          `https://api.${likecoHost}/users/id/${likerId}/min`,
        );
        setLikerIdValue(response.data.user);
        setLikerDisplayName(response.data.displayName);
        setLikerWalletAddress(response.data.likeWallet);
        setLikerAvatar(response.data.avatar);
        setIsLoading(false);
        setHasValidLikecoinId(true);
      } catch (error) {
        setIsLoading(false);
        setLikerIdValue('');
        setLikerDisplayName('');
        setLikerWalletAddress('');
        setLikerAvatar('');
        setHasValidLikecoinId(false);
      }
    }, 500),
    [],
  );
  useEffect(() => {
    fetchLikeCoinID(likerIdValue);
  }, [fetchLikeCoinID, likerIdValue]);
  useEffect(() => {
    setLikerIdValue(props.defaultLikerId);
    setLikerDisplayName(props.defaultLikerDisplayName);
    setLikerWalletAddress(props.defaultLikerWalletAddress);
    setLikerAvatar(props.defaultLikerAvatar);
    setShowChangeButton(!!props.defaultLikerId);
    setShowDisconnectButton(!!props.defaultLikerId);
    setHasValidLikecoinId(!!props.defaultLikerId);
  }, [
    props.defaultLikerId,
    props.defaultLikerDisplayName,
    props.defaultLikerWalletAddress,
    props.defaultLikerAvatar,
  ]);
  function confirmHandler(e) {
    setSavedSuccessful(false);
    e.preventDefault();
    setShowChangeButton(false);
    const data = {
      userLikerInfos: {},
    };
    data.userLikerInfos.likecoin_id = likerIdValue;
    data.userLikerInfos.display_name = likerDisplayName;
    data.userLikerInfos.wallet = likerWalletAddress;
    data.userLikerInfos.avatar = likerAvatar;
    try {
      // Change global state & DB
      props.postUserLikerInfo(data);

      // Only re-render . Do not refresh page.
      setSavedSuccessful(true);
      setShowDisconnectButton(true);
      setIsChangingTypingLiker(false);
      setShowChangeButton(true);
      setShowDisconnectButton(true);
    } catch (error) {
      console.error('Error occured when saving to Wordpress DB: ', error); // eslint-disable-line no-console
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
    setIsLoading(true);
    const typingLikerId = e.target.value;
    setLikerIdValue(typingLikerId); // change liker Id based on user immediate input.
  }
  function handleNoticeDismiss(e) {
    e.preventDefault();
    setSavedSuccessful(false);
  }
  function handleDisconnect(e) {
    e.preventDefault();
    setLikerIdValue('');
    setLikerDisplayName('');
    setLikerWalletAddress('');
    setLikerAvatar('');
  }
  return (
    <div className="wrap likecoin">
      <LikecoinHeading />
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
          likecoHost={likecoHost}
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
          isMainSettingPage={false}
          showChangeButton={showChangeButton}
          showDisconnectButton={showDisconnectButton}
        />
        <Section title={__('Your Likecoin button', 'likecoin')} />
        {hasValidLikecoinId && (
          <LikeButtonPreview
            userLikerId={likerIdValue}
            hasValidLikecoinId={hasValidLikecoinId}
            likecoHost={likecoHost}
          />
        )}
        <SubmitButton />
      </form>
    </div>
  );
}
function LikecoinButtonPage() {
  const {
    DBSiteLikerId,
    DBSiteLikerAvatar,
    DBSiteLikerDisplayName,
    DBSiteLikerWallet,
    DBSiteLikerIdEnabled,
  } = useSelect((select) => select(SITE_LIKER_INFO_STORE_NAME).selectSiteLikerInfo());

  const {
    DBUserLikerId,
    DBUserLikerAvatar,
    DBUserLikerDisplayName,
    DBUserLikerWallet,
  } = useSelect((select) => select(USER_LIKER_INFO_STORE_NAME).selectUserLikerInfo());

  const { postUserLikerInfo } = useDispatch(USER_LIKER_INFO_STORE_NAME);

  const defaultLikerId = useMemo(
    () => (DBSiteLikerIdEnabled ? DBSiteLikerId : (DBUserLikerId || DBSiteLikerId)),
    [DBSiteLikerIdEnabled, DBSiteLikerId, DBUserLikerId],
  );
  const defaultLikerDisplayName = useMemo(
    () => (DBSiteLikerIdEnabled ? DBSiteLikerDisplayName : DBUserLikerDisplayName),
    [DBSiteLikerIdEnabled, DBSiteLikerDisplayName, DBUserLikerDisplayName],
  );
  const defaultLikerWalletAddress = useMemo(
    () => (DBSiteLikerIdEnabled ? DBSiteLikerWallet : DBUserLikerWallet),
    [DBSiteLikerIdEnabled, DBSiteLikerWallet, DBUserLikerWallet],
  );
  const defaultLikerAvatar = useMemo(
    () => (DBSiteLikerIdEnabled ? DBSiteLikerAvatar : DBUserLikerAvatar),
    [DBSiteLikerIdEnabled, DBSiteLikerAvatar, DBUserLikerAvatar],
  );

  return (
    <PureLikecoinButtonPage
      DBSiteLikerIdEnabled={DBSiteLikerIdEnabled}
      defaultLikerId={defaultLikerId}
      defaultLikerDisplayName={defaultLikerDisplayName}
      defaultLikerWalletAddress={defaultLikerWalletAddress}
      defaultLikerAvatar={defaultLikerAvatar}
      postUserLikerInfo={postUserLikerInfo}
    />
  );
}

export default LikecoinButtonPage;
