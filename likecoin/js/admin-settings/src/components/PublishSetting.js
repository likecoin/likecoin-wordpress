import {
  useRef, useState, useEffect, useImperativeHandle, forwardRef,
} from 'react';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import Section from './Section';
import CheckBox from './CheckBox';
import { SITE_PUBLISH_STORE_NAME } from '../store/site-publish-store';
import MattersSetting from './Publish/Matters/MattersSetting';
import InternetArchiveSetting from './Publish/InternetArchive/InternetArchiveSetting';

function PublishSetting(_, ref) {
  // eslint-disable-next-line arrow-body-style
  const {
    DBSiteMattersId,
    DBSiteMattersAutoSaveDraft,
    DBSiteMattersAutoPublish,
    DBSiteInternetArchiveEnabled,
  } = useSelect((select) => select(SITE_PUBLISH_STORE_NAME).selectSitePublishOptions());

  const mattersSettingRef = useRef();
  const internetArchiveSettingRef = useRef();

  const [showMatters, setShowMatters] = useState(!!(DBSiteMattersId
    || DBSiteMattersAutoSaveDraft || DBSiteMattersAutoPublish));
  const [showInternetArchive, setShowInternetArchive] = useState(!!(DBSiteInternetArchiveEnabled));

  useEffect(() => {
    setShowMatters(!!(DBSiteMattersId || DBSiteMattersAutoSaveDraft || DBSiteMattersAutoPublish));
  }, [
    DBSiteMattersId,
    DBSiteMattersAutoSaveDraft,
    DBSiteMattersAutoPublish,
  ]);
  useEffect(() => {
    setShowInternetArchive(!!DBSiteInternetArchiveEnabled);
  }, [DBSiteInternetArchiveEnabled]);

  async function confirmHandler() {
    const promises = [];
    if (showMatters) promises.push(mattersSettingRef.current.submit());
    if (showInternetArchive) promises.push(internetArchiveSettingRef.current.submit());
    await Promise.all(promises);
  }
  useImperativeHandle(ref, () => ({
    submit: confirmHandler,
  }));
  return (
    <>
      <Section title={__('Publish to other platforms', 'likecoin')} />
      <p>{__('LikeCoin plugin can help you to publish you post to other platform.', 'likecoin')}</p>
      <CheckBox
        checked={showMatters}
        handleCheck={setShowMatters}
        title={__('Matters', 'likecoin')}
        details={__('Publish to Matters.news', 'likecoin')}
      />
      {showMatters && (
        <MattersSetting ref={mattersSettingRef} />
      )}
      <CheckBox
        checked={showInternetArchive}
        handleCheck={setShowInternetArchive}
        title={__('Internet Archive', 'likecoin')}
        details={__('Publish to Internet Archive', 'likecoin')}
      />
      {showInternetArchive && (
        <InternetArchiveSetting ref={internetArchiveSettingRef} />
      )}
    </>
  );
}

export default forwardRef(PublishSetting);
