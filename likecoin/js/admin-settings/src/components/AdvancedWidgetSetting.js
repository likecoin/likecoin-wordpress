import {
  useRef, useState, useEffect,
} from 'react';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import Section from './Section';
import CheckBox from './CheckBox';
import SettingNotice from './SettingNotice';
import SubmitButton from './SubmitButton';
import { SITE_LIKER_INFO_STORE_NAME } from '../store/site-likerInfo-store';

function AdvancedWidgetSetting() {
  const { postSiteLikerInfo } = useDispatch(SITE_LIKER_INFO_STORE_NAME);
  const {
    DBPerPostOptionEnabled,
  } = useSelect((select) => select(SITE_LIKER_INFO_STORE_NAME).selectSiteLikerInfo());
  const perPostOptionEnabledRef = useRef();
  useEffect(() => {
    setPerPostOptionEnabled(DBPerPostOptionEnabled);
  }, [DBPerPostOptionEnabled]);
  const [perPostOptionEnabled, setPerPostOptionEnabled] = useState(DBPerPostOptionEnabled);
  const [savedSuccessful, setSavedSuccessful] = useState(false);
  async function confirmHandler(e) {
    e.preventDefault();
    setSavedSuccessful(false);
    const isPerPostOptionEnabled = perPostOptionEnabledRef.current.checked;
    const buttonData = {
      perPostOptionEnabled: isPerPostOptionEnabled,
    };
    try {
      await postSiteLikerInfo(buttonData);
      setSavedSuccessful(true);
    } catch (error) {
      console.error(error);
    }
  }
  function handleNoticeDismiss(e) {
    e.preventDefault();
    setSavedSuccessful(false);
  }
  return (
    <><Section title={__('LikeCoin widget advanced settings', 'likecoin')} />
    {savedSuccessful && (
      <SettingNotice
        text={__('Settings Saved', 'likecoin')}
        className="notice-success"
        handleNoticeDismiss={handleNoticeDismiss}
      />
    )}
    <form onSubmit={confirmHandler}>
      <CheckBox
        checked={perPostOptionEnabled}
        handleCheck={setPerPostOptionEnabled}
        title={__('Allow per Post option', 'likecoin')}
        details={__(
          'Allow editors to customize display setting per post',
          'likecoin',
        )}
        checkRef={perPostOptionEnabledRef} />
      <SubmitButton />
    </form></>
  );
}

export default AdvancedWidgetSetting;
