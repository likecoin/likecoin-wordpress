import {
  useState, useEffect,
} from 'react';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import Section from '../components/Section';
import LikecoinInfoTable from '../components/LikecoinInfoTable';
import SubmitButton from '../components/SubmitButton';
import LikeButtonPreview from '../components/LikeButtonPreview';
import SettingNotice from '../components/SettingNotice';
import { SITE_LIKER_INFO_STORE_NAME } from '../store/site-likerInfo-store';
import { USER_LIKER_INFO_STORE_NAME } from '../store/user-likerInfo-store';

const { likecoHost } = window.likecoinReactAppData;

function LikecoinButtonPage() {
  const {
    DBUserCanEditOption,
    DBSiteLikerId,
    DBSiteLikerAvatar,
    DBSiteLikerDisplayName,
    DBSiteLikerWallet,
  } = useSelect((select) => select(SITE_LIKER_INFO_STORE_NAME).selectSiteLikerInfo());
  const {
    DBUserLikerId,
    DBUserLikerAvatar,
    DBUserLikerDisplayName,
    DBUserLikerWallet,
  } = useSelect((select) => select(USER_LIKER_INFO_STORE_NAME).selectUserLikerInfo());
  const { postSiteLikerInfo } = useDispatch(SITE_LIKER_INFO_STORE_NAME);
  const { postUserLikerInfo } = useDispatch(USER_LIKER_INFO_STORE_NAME);
  const [currentLikerId, setCurrentLikerId] = useState(
    DBUserLikerId || DBSiteLikerId,
  );
  useEffect(() => {
    setCurrentLikerId(DBUserLikerId || DBSiteLikerId);
  }, [DBSiteLikerId, DBUserLikerId]);
  const [savedSuccessful, setSavedSuccessful] = useState(false);
  const [siteLikerInfo, setSiteLikerInfo] = useState({});
  const [userLikerInfo, setUserLikerInfo] = useState({});

  function onSiteLikerIdUpdate(likerInfo) {
    setSiteLikerInfo(likerInfo);
  }
  function onUserLikerIdUpdate(likerInfo) {
    setUserLikerInfo(likerInfo);
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
        likecoin_id: userLikerInfo.likerIdValue,
        display_name: userLikerInfo.likerDisplayName,
        wallet: userLikerInfo.likerWalletAddress,
        avatar: userLikerInfo.likerAvatar,
      },
    };
    try {
      // Change global state & DB
      if (DBUserCanEditOption) {
        postSiteLikerInfo(siteData);
      }
      postUserLikerInfo(userData);
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
    <div className="wrap likecoin">
      {savedSuccessful && (
        <SettingNotice
          text={__('Settings Saved', 'likecoin')}
          className="notice-success"
          handleNoticeDismiss={handleNoticeDismiss}
        />
      )}
      <form onSubmit={updateLikerIdHandler}>
        {DBUserCanEditOption && (
          <><Section title={__('Site Default Liker ID', 'likecoin')} />
            <LikecoinInfoTable
              likecoHost={likecoHost}
              defaultLikerId={DBSiteLikerId}
              defaultLikerDisplayName={DBSiteLikerDisplayName}
              defaultLikerWalletAddress={DBSiteLikerWallet}
              defaultLikerAvatar={DBSiteLikerAvatar}
              editable={DBUserCanEditOption}
              onLikerIdUpdate={onSiteLikerIdUpdate}
            />
            <br />
          </>
        )}
        <hr />
        <Section title={__('Your Liker ID', 'likecoin')} />
        <LikecoinInfoTable
          likecoHost={likecoHost}
          defaultLikerId={DBUserLikerId}
          defaultLikerDisplayName={DBUserLikerDisplayName}
          defaultLikerWalletAddress={DBUserLikerWallet}
          defaultLikerAvatar={DBUserLikerAvatar}
          onLikerIdUpdate={onUserLikerIdUpdate}
        />
        {(DBUserCanEditOption) && (
          <SubmitButton />
        )}
      </form>
      <Section title={__('Your LikeCoin button preview', 'likecoin')} />
      {currentLikerId && (
        <LikeButtonPreview
          userLikerId={currentLikerId}
          likecoHost={likecoHost}
        />
      )}
    </div>
  );
}

export default LikecoinButtonPage;
