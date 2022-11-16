import {
  useRef, useState, useEffect, useMemo,
} from 'react';
import axios from 'axios';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { debounce } from 'lodash';
import SubmitButton from '../components/SubmitButton';
import CheckBox from '../components/CheckBox';
import DropDown from '../components/DropDown';
import Section from '../components/Section';
import LikecoinInfoTable from '../components/LikecoinInfoTable';
import SettingNotice from '../components/SettingNotice';
import LikecoinHeading from '../components/LikecoinHeading';
import { SITE_LIKER_INFO_STORE_NAME } from '../store/site-likerInfo-store';

const { likecoHost } = window.likecoinReactAppData;

function MainSettingPage() {
  const { postSiteLikerInfo } = useDispatch(SITE_LIKER_INFO_STORE_NAME);
  /* do not want to re-render the whole component until submit. Hence use useRef(). */
  const siteLikerIdEnabledRef = useRef();
  const displayOptionRef = useRef();
  const perPostOptionEnabledRef = useRef();
  const {
    DBIsForbidden,
    DBSiteLikerId,
    DBSiteLikerAvatar,
    DBSiteLikerDisplayName,
    DBSiteLikerWallet,
    DBSiteLikerIdEnabled,
    DBDisplayOptionSelected,
    DBPerPostOptionEnabled,
  } = useSelect((select) => select(SITE_LIKER_INFO_STORE_NAME).selectSiteLikerInfo());
  const [siteLikerIdEnabled, setSiteLikerIdEnabled] = useState(DBSiteLikerIdEnabled);
  const [displayOptionSelected, setDisplayOptionSelected] = useState(DBDisplayOptionSelected);
  const [perPostOptionEnabled, setPerPostOptionEnabled] = useState(DBPerPostOptionEnabled);
  const [likerIdValue, setLikerIdValue] = useState(DBSiteLikerId);
  const [likerDisplayName, setLikerDisplayName] = useState(
    DBSiteLikerDisplayName,
  );
  const [likerWalletAddress, setLikerWalletAddress] = useState(
    DBSiteLikerWallet,
  );
  const [likerAvatar, setLikerAvatar] = useState(DBSiteLikerAvatar);
  const [isLoading, setIsLoading] = useState(false);

  const [savedSuccessful, setSavedSuccessful] = useState(false);
  const [submitResponse, setSubmitResponse] = useState(false);
  const [isChangingTypingLiker, setIsChangingTypingLiker] = useState(false);
  function handleLikerIdInputChange(e) {
    e.preventDefault();
    setIsChangingTypingLiker(true);
    const typingLikerId = e.target.value;
    setLikerIdValue(typingLikerId); // change liker Id based on user immediate input.
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
      if (!likerId) return;
      try {
        const response = await axios.get(
          `https://api.${likecoHost}/users/id/${likerId}/min`,
        );
        setLikerIdValue(response.data.user);
        setLikerDisplayName(response.data.displayName);
        setLikerWalletAddress(response.data.likeWallet);
        setLikerAvatar(response.data.avatar);
      } catch (error) {
        console.error(error); // eslint-disable-line no-console
        setLikerDisplayName('-');
        setLikerWalletAddress('-');
        setLikerAvatar('-');
      }
      setIsLoading(false);
    }, 500),
    [],
  );
  useEffect(() => {
    fetchLikeCoinID(likerIdValue);
  }, [fetchLikeCoinID, likerIdValue]);

  useEffect(() => {
    setSiteLikerIdEnabled(DBSiteLikerIdEnabled);
    setDisplayOptionSelected(DBDisplayOptionSelected);
    setPerPostOptionEnabled(DBPerPostOptionEnabled);
  }, [
    DBSiteLikerIdEnabled,
    DBDisplayOptionSelected,
    DBPerPostOptionEnabled,
  ]);
  useEffect(() => {
    setLikerIdValue(DBSiteLikerId);
    setLikerDisplayName(DBSiteLikerDisplayName);
    setLikerWalletAddress(DBSiteLikerWallet);
    setLikerAvatar(DBSiteLikerAvatar);
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

  async function confirmHandler(e) {
    setSubmitResponse(null);
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
        likecoin_id: likerIdValue,
        display_name: likerDisplayName,
        wallet: likerWalletAddress,
        avatar: likerAvatar,
      },
    };
    try {
      // change global state & DB
      const res = await postSiteLikerInfo(data);
      setSubmitResponse(res.message);
      // Only re-render . Do not refresh page.
      setSavedSuccessful(true);
      setIsChangingTypingLiker(false);
    } catch (error) {
      console.error(error);
      setSubmitResponse(error.message.toString());
      setSavedSuccessful(false);
      setIsChangingTypingLiker(false);
    }
  }
  function handleNoticeDismiss(e) {
    e.preventDefault();
    setSavedSuccessful(false);
    setSubmitResponse(null);
  }
  function handleDisconnect(e) {
    e.preventDefault();
    setLikerIdValue('');
    setLikerDisplayName('');
    setLikerWalletAddress('');
    setLikerAvatar('');
  }

  const forbiddenString = __('Sorry, you are not allowed to access this page.', 'likecoin');

  if (DBIsForbidden) {
    return (
      <div className="wrap likecoin">
        <LikecoinHeading />
        <p>{forbiddenString}</p>
      </div>
    );
  }
  return (
    <div className="wrap likecoin">
      <LikecoinHeading />
      {submitResponse && !savedSuccessful && (
        <SettingNotice
          text={__('Settings Saved', 'likecoin')}
          className="notice-success"
          handleNoticeDismiss={handleNoticeDismiss}
        />
      )}
      {submitResponse && savedSuccessful && (
        <SettingNotice
          text={submitResponse}
          className="notice-error"
        />
      )}
      <form onSubmit={confirmHandler}>
        <Section
          title={__('Enable LikeCoin button', 'likecoin')}
        />
        <tbody>
          <DropDown
            selected={displayOptionSelected}
            handleSelect={setDisplayOptionSelected}
            title={__('Display option', 'likecoin')}
            selectRef={displayOptionRef}
            options={pluginSettingOptions}
          />
          <CheckBox
            checked={perPostOptionEnabled}
            handleCheck={setPerPostOptionEnabled}
            title={__('Allow per Post option', 'likecoin')}
            details={__(
              'Allow editors to customize display setting per post',
              'likecoin',
            )}
            checkRef={perPostOptionEnabledRef}
          />
        </tbody>
        <Section title={__('Site Default Liker ID', 'likecoin')} />
        <tbody>
          <LikecoinInfoTable
            likecoHost={likecoHost}
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
            showDisconnectButton={true}
          />
          <CheckBox
            checked={siteLikerIdEnabled}
            handleCheck={setSiteLikerIdEnabled}
            title={__('Override all Liker ID with site default', 'likecoin')}
            details={__(
              'Override all LikeCoin button with site default Liker ID',
              'likecoin',
            )}
            checkRef={siteLikerIdEnabledRef}
          />
        </tbody>
        <SubmitButton />
      </form>
    </div>
  );
}

export default MainSettingPage;
