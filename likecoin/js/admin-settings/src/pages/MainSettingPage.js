import {
  useRef, useState, useEffect,
} from 'react';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import DropDown from '../components/DropDown';
import Section from '../components/Section';
import SettingNotice from '../components/SettingNotice';
import { SITE_LIKER_INFO_STORE_NAME } from '../store/site-likerInfo-store';
import { SITE_PUBLISH_STORE_NAME } from '../store/site-publish-store';
import CheckBox from '../components/CheckBox';
import FormTable from '../components/FormTable';
import SubmitButton from '../components/SubmitButton';

function MainSettingPage() {
  const { postSiteLikerInfo } = useDispatch(SITE_LIKER_INFO_STORE_NAME);
  const { postSitePublishOptions } = useDispatch(SITE_PUBLISH_STORE_NAME);
  const {
    DBUserCanEditOption,
    DBDisplayOptionSelected,
  } = useSelect((select) => select(SITE_LIKER_INFO_STORE_NAME).selectSiteLikerInfo());
  const {
    DBISCNBadgeStyleOption,
  } = useSelect((select) => select(SITE_PUBLISH_STORE_NAME).selectSitePublishOptions());
  const [savedSuccessful, setSavedSuccessful] = useState(false);
  const [showInPosts, setShowInPosts] = useState(DBDisplayOptionSelected === 'post' || DBDisplayOptionSelected === 'always');
  const [showInPages, setShowInPages] = useState(DBDisplayOptionSelected === 'page' || DBDisplayOptionSelected === 'always');
  const ISCNBadgeStyleOptionRef = useRef();
  const ISCNStyleOptions = [
    { value: 'light', label: __('Light Mode', 'likecoin') },
    { value: 'dark', label: __('Dark Mode', 'likecoin') },
    { value: 'none', label: __('Not shown', 'likecoin') },
  ];
  const [ISCNBadgeStyleOption, setISCNBadgeStyleOption] = useState(
    DBISCNBadgeStyleOption,
  );
  useEffect(() => {
    setISCNBadgeStyleOption(DBISCNBadgeStyleOption);
  }, [DBISCNBadgeStyleOption]);
  useEffect(() => {
    setShowInPosts(DBDisplayOptionSelected === 'post' || DBDisplayOptionSelected === 'always');
    setShowInPages(DBDisplayOptionSelected === 'page' || DBDisplayOptionSelected === 'always');
  }, [
    DBDisplayOptionSelected,
  ]);

  function handleResetDefault(e) {
    e.preventDefault();
    setShowInPosts(true);
    setShowInPages(false);
    setISCNBadgeStyleOption('none');
  }

  async function confirmHandler(e) {
    setSavedSuccessful(false);
    e.preventDefault();
    const currentISCNBadgeStyleOption = ISCNBadgeStyleOptionRef.current.value;
    let displayOption = 'none';
    if (showInPosts && showInPages) {
      displayOption = 'always';
    } else if (showInPosts) {
      displayOption = 'post';
    } else if (showInPages) {
      displayOption = 'page';
    }
    const buttonData = {
      displayOption,
    };
    const publishData = {
      ISCNBadgeStyleOption: currentISCNBadgeStyleOption,
    };
    try {
      await Promise.all([
        postSiteLikerInfo(buttonData),
        postSitePublishOptions(publishData),
      ]);
      setSavedSuccessful(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
    }
  }
  function handleNoticeDismiss(e) {
    e.preventDefault();
    setSavedSuccessful(false);
  }

  const forbiddenString = __('Sorry, you are not allowed to access this page.', 'likecoin');

  if (!DBUserCanEditOption) {
    return (
      <p>{forbiddenString}</p>
    );
  }
  return (
    <div className="likecoin">
      {savedSuccessful && (
        <SettingNotice
          text={__('Settings Saved', 'likecoin')}
          className="notice-success"
          handleNoticeDismiss={handleNoticeDismiss}
        />
      )}
      <form onSubmit={confirmHandler}>
        <Section title={__('LikeCoin widget', 'likecoin')} />
        <p>{__('Display LikeCoin Button/Widget when author has a Liker ID, or if post is registered on ISCN', 'likecoin')}</p>
        <FormTable>
          <CheckBox
            checked={showInPosts}
            handleCheck={setShowInPosts}
            title={__('Show in Posts', 'likecoin')}
            append={__(' *Recommended', 'likecoin')}
          />
          <CheckBox
            checked={showInPages}
            handleCheck={setShowInPages}
            title={__('Show in Pages', 'likecoin')}
          />
        </FormTable>
        <hr />
        <Section title={__('ISCN Badge', 'likecoin')} />
        <p>{__('Display a badge for ISCN registered post', 'likecoin')}</p>
        <FormTable>
          <DropDown
            selected={ISCNBadgeStyleOption}
            handleSelect={setISCNBadgeStyleOption}
            title={__('Display style', 'likecoin')}
            selectRef={ISCNBadgeStyleOptionRef}
            options={ISCNStyleOptions}
          />
        </FormTable>
        <SubmitButton>
          &nbsp;
          <a
            className="button"
            href="#"
            onClick={handleResetDefault}
          >
            {__('Reset to default', 'likecoin')}
          </a>
        </SubmitButton>
      </form>
    </div>
  );
}

export default MainSettingPage;
