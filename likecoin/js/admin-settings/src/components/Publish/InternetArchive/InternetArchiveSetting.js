import {
  useState, useEffect, useCallback, useImperativeHandle, forwardRef,
} from 'react';
import { useSelect, useDispatch } from '@wordpress/data';
import { createInterpolateElement, createElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { SITE_PUBLISH_STORE_NAME } from '../../../store/site-publish-store';

import CheckBox from '../../CheckBox';
import FormTable from '../../FormTable';
import FormTableRow from '../../FormTableRow';
import Link from '../../Link';

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

  const localizedInternetSecretIntro = createInterpolateElement(
    __(
      'An <Register/> is needed for auto publishing your post to Internet Archive.',
      'likecoin',
    ),
    {
      Register: createElement(Link, {
        text: __('Internet Archive S3 API Key', 'likecoin'),
        linkAddress: 'https://archive.org/account/s3.php',
      }),
    },
  );

  return (
    <FormTable>
      <CheckBox
        checked={siteInternetArchiveEnabled}
        handleCheck={setSiteInternetArchiveEnabled}
        title={__('Auto archive', 'likecoin')}
        details={__('Auto publish post to Internet Archive', 'likecoin')}
        disabled={showEditSecret && !(siteInternetArchiveAccessKey && siteInternetArchiveSecret)}
      />
      <FormTableRow title={__('Internet Archive S3 Config', 'likecoin')}>
        <p>{localizedInternetSecretIntro}</p>
        <FormTable>
          <FormTableRow title={__('S3 Access Key', 'likecoin')}>
            <input
              id="internet_archive_access_key"
              type="text"
              value={siteInternetArchiveAccessKey}
              disabled={!showEditSecret}
              onChange={(e) => setSiteInternetArchiveAccessKey(e.target.value)}
            />
          </FormTableRow>
          <FormTableRow title={__('S3 Secret', 'likecoin')}>
            {!showEditSecret ? (
              <button class="button" onClick={setShowEditSecret}>
                {__('Edit', 'likecoin')}
              </button>
            ) : (
              <input
                id="internet_archive_secret"
                type="password"
                value={siteInternetArchiveSecret}
                onChange={(e) => setSiteInternetArchiveSecret(e.target.value)}
              />
            )}
          </FormTableRow>
        </FormTable>
      </FormTableRow>
    </FormTable>
  );
}

export default forwardRef(InternetArchiveSetting);
