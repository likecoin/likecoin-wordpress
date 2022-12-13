import {
  useState, useEffect, useCallback, useImperativeHandle, forwardRef,
} from 'react';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import CheckBox from '../../CheckBox';
import InternetArchiveDescription from './InternetArchiveDescription';
import { SITE_PUBLISH_STORE_NAME } from '../../../store/site-publish-store';

function InternetArchiveSetting(_, ref) {
  const {
    DBSiteInternetArchiveEnabled,
    DBSiteInternetArchiveAccessKey,
  } = useSelect((select) => select(SITE_PUBLISH_STORE_NAME).selectSitePublishOptions());
  const [siteInternetArchiveEnabled, setSiteInternetArchiveEnabled] = useState(
    DBSiteInternetArchiveEnabled,
  );
  const [siteInternetArchiveAccessKey, setSiteInternetArchiveAccessKey] = useState(
    DBSiteInternetArchiveAccessKey,
  );
  const [siteInternetArchiveSecret, setSiteInternetArchiveSecret] = useState('');

  const {
    postSitePublishOptions,
  } = useDispatch(SITE_PUBLISH_STORE_NAME);
  const confirmHandler = useCallback(
    () => {
      let enabled = siteInternetArchiveEnabled;
      if (!DBSiteInternetArchiveEnabled
          && siteInternetArchiveEnabled
          && !(siteInternetArchiveAccessKey && siteInternetArchiveSecret)) {
        // throw new Error(__('Internet Archive access key and secret must be set.'));
        enabled = false;
      }
      const data = {
        siteInternetArchiveEnabled: enabled,
        siteInternetArchiveAccessKey,
        siteInternetArchiveSecret,
      };
      postSitePublishOptions(data);
    },
    [
      DBSiteInternetArchiveEnabled,
      siteInternetArchiveEnabled,
      siteInternetArchiveAccessKey,
      siteInternetArchiveSecret,
      postSitePublishOptions,
    ],
  );

  useImperativeHandle(ref, () => ({
    submit: confirmHandler,
  }));
  useEffect(() => {
    setSiteInternetArchiveEnabled(DBSiteInternetArchiveEnabled);
    setSiteInternetArchiveAccessKey(DBSiteInternetArchiveAccessKey);
  }, [DBSiteInternetArchiveAccessKey, DBSiteInternetArchiveEnabled]);

  return (<>
    <InternetArchiveDescription />
    <CheckBox
      checked={siteInternetArchiveEnabled}
      handleCheck={setSiteInternetArchiveEnabled}
      title={__('Auto archive', 'likecoin')}
      details={__('Auto publish post to Internet Archive', 'likecoin')}
    />
    <label for="internet_archive_access_key">
      {__('Internet Archive S3 access key: ', 'likecoin')}
    </label>
    <input
      type="text"
      id="internet_archive_access_key"
      value={siteInternetArchiveAccessKey}
      onChange={(e) => setSiteInternetArchiveAccessKey(e.target.value)}
    />
    <br />
    <label for="internet_archive_secret">
      {__('Internet Archive S3 secret: ', 'likecoin')}
    </label>
    <input
      type="password"
      id="internet_archive_secret"
      value={siteInternetArchiveSecret}
      onChange={(e) => setSiteInternetArchiveSecret(e.target.value)}
    />
  </>);
}

export default forwardRef(InternetArchiveSetting);
