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
  const [showEditSecret, setShowEditSecret] = useState(
    !DBSiteInternetArchiveAccessKey,
  );

  useEffect(() => {
    setSiteInternetArchiveEnabled(DBSiteInternetArchiveEnabled);
    setSiteInternetArchiveAccessKey(DBSiteInternetArchiveAccessKey);
    setShowEditSecret(!DBSiteInternetArchiveAccessKey);
  }, [DBSiteInternetArchiveAccessKey, DBSiteInternetArchiveEnabled]);
  const {
    postSitePublishOptions,
  } = useDispatch(SITE_PUBLISH_STORE_NAME);
  const confirmHandler = useCallback(
    () => {
      let data = {
        siteInternetArchiveEnabled,
      };
      if (showEditSecret) {
        data = {
          ...data,
          siteInternetArchiveAccessKey,
          siteInternetArchiveSecret,
        };
      }
      postSitePublishOptions(data);
    },
    [
      showEditSecret,
      siteInternetArchiveEnabled,
      siteInternetArchiveAccessKey,
      siteInternetArchiveSecret,
      postSitePublishOptions,
    ],
  );

  useImperativeHandle(ref, () => ({
    submit: confirmHandler,
  }));

  return (<>
    <InternetArchiveDescription />
    <CheckBox
      checked={siteInternetArchiveEnabled}
      handleCheck={setSiteInternetArchiveEnabled}
      title={__('Auto archive', 'likecoin')}
      details={__('Auto publish post to Internet Archive', 'likecoin')}
      disabled={showEditSecret && !(siteInternetArchiveAccessKey && siteInternetArchiveSecret)}
    />
    <label for="internet_archive_access_key">
      {__('Internet Archive S3 access key: ', 'likecoin')}
    </label>
    <input
      type="text"
      id="internet_archive_access_key"
      value={siteInternetArchiveAccessKey}
      disabled={!showEditSecret}
      onChange={(e) => setSiteInternetArchiveAccessKey(e.target.value)}
    />
    {!showEditSecret && <button onClick={setShowEditSecret}>
      {__('Edit', 'likecoin')}
    </button>}
    {showEditSecret && <>
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
    </>}
  </>);
}

export default forwardRef(InternetArchiveSetting);
