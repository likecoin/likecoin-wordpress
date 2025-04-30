import {
  useRef, useState, useEffect, useImperativeHandle, forwardRef,
} from 'react';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { SITE_PUBLISH_STORE_NAME } from '../store/site-publish-store';

import InternetArchiveDescription from './Publish/InternetArchive/InternetArchiveDescription';
import InternetArchiveSetting from './Publish/InternetArchive/InternetArchiveSetting';

import CheckBox from './CheckBox';
import FormTable from './FormTable';

function PublishSetting(_, ref) {
  // eslint-disable-next-line arrow-body-style
  const {
    DBSiteInternetArchiveEnabled,
  } = useSelect((select) => select(SITE_PUBLISH_STORE_NAME).selectSitePublishOptions());

  const internetArchiveSettingRef = useRef();

  const [showInternetArchive, setShowInternetArchive] = useState(!!(DBSiteInternetArchiveEnabled));

  useEffect(() => {
    setShowInternetArchive(!!DBSiteInternetArchiveEnabled);
  }, [DBSiteInternetArchiveEnabled]);

  async function confirmHandler() {
    const promises = [];
    if (showInternetArchive) promises.push(internetArchiveSettingRef.current.submit());
    await Promise.all(promises);
  }
  useImperativeHandle(ref, () => ({
    submit: confirmHandler,
  }));
  return (
    <>
      <h2>{__('Publish to Internet Archive', 'likecoin')}</h2>
      <InternetArchiveDescription />
      {!showInternetArchive && (
        <FormTable>
          <CheckBox
            checked={showInternetArchive}
            handleCheck={setShowInternetArchive}
            title={__('Show settings', 'likecoin')}
          />
        </FormTable>
      )}
      {showInternetArchive && (
        <InternetArchiveSetting ref={internetArchiveSettingRef} />
      )}
    </>
  );
}

export default forwardRef(PublishSetting);
