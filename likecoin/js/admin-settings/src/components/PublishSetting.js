import {
  useRef, useState, useEffect, useImperativeHandle, forwardRef,
} from 'react';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import Section from './Section';
import CheckBox from './CheckBox';
import { SITE_PUBLISH_STORE_NAME } from '../store/site-publish-store';
import MattersSetting from './Publish/Matters/MattersSetting';

function PublishSetting(_, ref) {
  // eslint-disable-next-line arrow-body-style
  const {
    DBSiteMattersId,
    DBSiteMattersAutoSaveDraft,
    DBSiteMattersAutoPublish,
  } = useSelect((select) => select(SITE_PUBLISH_STORE_NAME).selectSitePublishOptions());

  const mattersSettingRef = useRef();

  const [showMatters, setShowMatters] = useState(!!(DBSiteMattersId
    || DBSiteMattersAutoSaveDraft || DBSiteMattersAutoPublish));

  useEffect(() => {
    setShowMatters(DBSiteMattersId || DBSiteMattersAutoSaveDraft || DBSiteMattersAutoPublish);
  }, [
    DBSiteMattersId,
    DBSiteMattersAutoSaveDraft,
    DBSiteMattersAutoPublish,
  ]);

  async function confirmHandler() {
    if (showMatters) {
      await Promise.all([
        mattersSettingRef.current.submit(),
      ]);
    }
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
    </>
  );
}

export default forwardRef(PublishSetting);
