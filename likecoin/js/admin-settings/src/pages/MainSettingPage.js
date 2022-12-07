import {
  useRef, useState, useEffect,
} from 'react';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import CheckBox from '../components/CheckBox';
import DropDown from '../components/DropDown';
import Section from '../components/Section';
import SettingNotice from '../components/SettingNotice';
import LikecoinHeading from '../components/LikecoinHeading';
import { SITE_LIKER_INFO_STORE_NAME } from '../store/site-likerInfo-store';
import { SITE_PUBLISH_STORE_NAME } from '../store/site-publish-store';
import SubmitButton from '../components/SubmitButton';

function MainSettingPage() {
  const { postSiteLikerInfo } = useDispatch(SITE_LIKER_INFO_STORE_NAME);
  const { postSitePublishOptions } = useDispatch(SITE_PUBLISH_STORE_NAME);
  /* do not want to re-render the whole component until submit. Hence use useRef(). */
  const displayOptionRef = useRef();
  const perPostOptionEnabledRef = useRef();
  const {
    DBUserCanEditOption,
    DBDisplayOptionSelected,
    DBPerPostOptionEnabled,
  } = useSelect((select) => select(SITE_LIKER_INFO_STORE_NAME).selectSiteLikerInfo());
  const {
    DBISCNBadgeStyleOption,
  } = useSelect((select) => select(SITE_PUBLISH_STORE_NAME).selectSitePublishOptions());
  const [displayOptionSelected, setDisplayOptionSelected] = useState(DBDisplayOptionSelected);
  const [perPostOptionEnabled, setPerPostOptionEnabled] = useState(DBPerPostOptionEnabled);
  const [savedSuccessful, setSavedSuccessful] = useState(false);
  const [submitResponse, setSubmitResponse] = useState(false);
  const pluginSettingOptions = [
    { value: 'always', label: __('Page and Post', 'likecoin') },
    { value: 'post', label: __('Post Only', 'likecoin') },
    { value: 'none', label: __('None', 'likecoin') },
  ];
  const ISCNBadgeStyleOptionRef = useRef();
  const ISCNStyleOptions = [
    { value: 'light', label: __('Light Mode', 'likecoin') },
    { value: 'dark', label: __('Dark Mode', 'likecoin') },
    { value: 'none', label: __('None', 'likecoin') },
  ];
  const [ISCNBadgeStyleOption, setISCNBadgeStyleOption] = useState(
    DBISCNBadgeStyleOption,
  );
  useEffect(() => {
    setISCNBadgeStyleOption(DBISCNBadgeStyleOption);
  }, [DBISCNBadgeStyleOption]);
  useEffect(() => {
    setDisplayOptionSelected(DBDisplayOptionSelected);
    setPerPostOptionEnabled(DBPerPostOptionEnabled);
  }, [
    DBDisplayOptionSelected,
    DBPerPostOptionEnabled,
  ]);
  async function confirmHandler(e) {
    setSubmitResponse(null);
    setSavedSuccessful(false);
    e.preventDefault();
    const displayOption = displayOptionRef.current.value;
    const isPerPostOptionEnabled = perPostOptionEnabledRef.current.checked;
    const currentISCNBadgeStyleOption = ISCNBadgeStyleOptionRef.current.value;
    const buttonData = {
      displayOption,
      perPostOptionEnabled: isPerPostOptionEnabled,
    };
    const publishData = {
      ISCNBadgeStyleOption: currentISCNBadgeStyleOption,
    };
    try {
      // change global state & DB
      const res = await Promise.all([
        postSiteLikerInfo(buttonData),
        postSitePublishOptions(publishData),
      ]);
      setSubmitResponse(res.message);
      // Only re-render . Do not refresh page.
      setSavedSuccessful(true);
    } catch (error) {
      console.error(error);
      setSubmitResponse(error.message.toString());
      setSavedSuccessful(false);
    }
  }
  function handleNoticeDismiss(e) {
    e.preventDefault();
    setSavedSuccessful(false);
    setSubmitResponse(null);
  }

  const forbiddenString = __('Sorry, you are not allowed to access this page.', 'likecoin');

  if (!DBUserCanEditOption) {
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
      {submitResponse && savedSuccessful && (
        <SettingNotice
          text={__('Settings Saved', 'likecoin')}
          className="notice-success"
          handleNoticeDismiss={handleNoticeDismiss}
        />
      )}
      {submitResponse && !savedSuccessful && (
        <SettingNotice
          text={submitResponse}
          className="notice-error"
        />
      )}
      <form onSubmit={confirmHandler}>
        <Section
          title={__('LikeCoin widget', 'likecoin')}
        />
        <div style={{ textAlign: 'left' }}>
          <p>{__('Enable for Liker ID or ISCN registered post', 'likecoin')}</p>
        </div>
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
        <hr />
        <Section title={__('ISCN Badge', 'likecoin')} />
        <div style={{ textAlign: 'left' }}>
          <p>{__('Display a badge for registered post', 'likecoin')}</p>
        </div>
        <table className="form-table" role="presentation">
          <DropDown
            selected={ISCNBadgeStyleOption}
            handleSelect={setISCNBadgeStyleOption}
            title={__('Display style', 'likecoin')}
            selectRef={ISCNBadgeStyleOptionRef}
            options={ISCNStyleOptions}
          />
        </table>
        <SubmitButton />
      </form>
    </div>
  );
}

export default MainSettingPage;
