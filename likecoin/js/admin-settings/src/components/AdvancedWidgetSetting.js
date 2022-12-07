import {
  useRef, useState, useEffect, useImperativeHandle, forwardRef,
} from 'react';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import Section from './Section';
import CheckBox from './CheckBox';
import { SITE_LIKER_INFO_STORE_NAME } from '../store/site-likerInfo-store';

function AdvancedWidgetSetting(_, ref) {
  const { postSiteLikerInfo } = useDispatch(SITE_LIKER_INFO_STORE_NAME);
  const {
    DBPerPostOptionEnabled,
  } = useSelect((select) => select(SITE_LIKER_INFO_STORE_NAME).selectSiteLikerInfo());
  const perPostOptionEnabledRef = useRef();
  useEffect(() => {
    setPerPostOptionEnabled(DBPerPostOptionEnabled);
  }, [DBPerPostOptionEnabled]);
  const [perPostOptionEnabled, setPerPostOptionEnabled] = useState(DBPerPostOptionEnabled);
  async function confirmHandler(e) {
    const isPerPostOptionEnabled = perPostOptionEnabledRef.current.checked;
    const buttonData = {
      perPostOptionEnabled: isPerPostOptionEnabled,
    };
    await postSiteLikerInfo(buttonData);
  }

  function handleResetDefault(e) {
    e.preventDefault();
    setPerPostOptionEnabled(false);
  }

  useImperativeHandle(ref, () => ({
    submit: confirmHandler,
  }));
  return (
    <>
    <Section title={__('LikeCoin widget advanced settings', 'likecoin')} />
    <CheckBox
      checked={perPostOptionEnabled}
      handleCheck={setPerPostOptionEnabled}
      title={__('Allow per Post option', 'likecoin')}
      details={__(
        'Allow editors to customize display setting per post',
        'likecoin',
      )}
      checkRef={perPostOptionEnabledRef} />
    <a
      href='#'
      onClick={handleResetDefault}
    >
      {__('Reset to default', 'likecoin')}
    </a>
    </>
  );
}

export default forwardRef(AdvancedWidgetSetting);
