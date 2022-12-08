import { useState } from 'react';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import Section from '../components/Section';
import LikerIdTable from '../components/LikerIdTable';
import SubmitButton from '../components/SubmitButton';
import SettingNotice from '../components/SettingNotice';
import { SITE_LIKER_INFO_STORE_NAME } from '../store/site-likerInfo-store';

const { likecoHost } = window.likecoinReactAppData;

function SiteLikerSetting() {
  const {
    DBUserCanEditOption,
    DBSiteLikerId,
    DBSiteLikerAvatar,
    DBSiteLikerDisplayName,
    DBSiteLikerWallet,
  } = useSelect((select) => select(SITE_LIKER_INFO_STORE_NAME).selectSiteLikerInfo());
  const { postSiteLikerInfo } = useDispatch(SITE_LIKER_INFO_STORE_NAME);
  const [savedSuccessful, setSavedSuccessful] = useState(false);

  const [siteLikerInfo, setSiteLikerInfo] = useState({});

  function onSiteLikerIdUpdate(likerInfo) {
    setSiteLikerInfo(likerInfo);
  }
  function updateLikerIdHandler(e) {
    setSavedSuccessful(false);
    e.preventDefault();
    const siteData = {
      siteLikerInfos: {
        likecoin_id: siteLikerInfo.likerIdValue,
        display_name: siteLikerInfo.likerDisplayName,
        wallet: siteLikerInfo.likerWalletAddress,
        avatar: siteLikerInfo.likerAvatar,
      },
    };
    const userData = {
      userLikerInfos: {
        likecoin_id: siteLikerInfo.likerIdValue,
        display_name: siteLikerInfo.likerDisplayName,
        wallet: siteLikerInfo.likerWalletAddress,
        avatar: siteLikerInfo.likerAvatar,
      },
    };
    try {
      // Change global state & DB
      if (DBUserCanEditOption) {
        postSiteLikerInfo(siteData);
      }
      // Only re-render . Do not refresh page.
      setSavedSuccessful(true);
    } catch (error) {
      console.error('Error occured when saving to Wordpress DB: ', error); // eslint-disable-line no-console
    }
  }
  function handleNoticeDismiss(e) {
    e.preventDefault();
    setSavedSuccessful(false);
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
      <form onSubmit={updateLikerIdHandler}>
        <Section title={__('Site Default Liker ID', 'likecoin')} />
        <p>{__('This will be the site default Liker ID if any author has not set one.', 'likecoin')}</p>
        <LikerIdTable
          likecoHost={likecoHost}
          defaultLikerId={DBSiteLikerId}
          defaultLikerDisplayName={DBSiteLikerDisplayName}
          defaultLikerWalletAddress={DBSiteLikerWallet}
          defaultLikerAvatar={DBSiteLikerAvatar}
          editable={DBUserCanEditOption}
          onLikerIdUpdate={onSiteLikerIdUpdate}
        />
        <br />
        <hr />
        {(DBUserCanEditOption) && (
          <SubmitButton />
        )}
      </form>
    </div>
  );
}

export default SiteLikerSetting;
