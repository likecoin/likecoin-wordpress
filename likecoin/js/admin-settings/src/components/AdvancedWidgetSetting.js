import {
  useRef, useState, useEffect, useImperativeHandle, forwardRef,
} from 'react';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { SITE_LIKER_INFO_STORE_NAME } from '../store/site-likerInfo-store';

import CheckBox from './CheckBox';
import FormTable from './FormTable';
import Section from './Section';

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
      <FormTable>
        <CheckBox
          checked={perPostOptionEnabled}
          handleCheck={setPerPostOptionEnabled}
          title={__('Post option', 'likecoin')}
          details={__(
            'Allow editors to customize display setting per post',
            'likecoin',
          )}
          append={(
            <a
              href='#'
              onClick={handleResetDefault}
            >
              {__('Reset to default', 'likecoin')}
            </a>
          )}
          checkRef={perPostOptionEnabledRef}
        />
      </FormTable>
    </>
  );
}

export default forwardRef(AdvancedWidgetSetting);
