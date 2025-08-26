import { useState, useCallback } from 'react';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import Section from '../components/Section';
import LikerIdTable from '../components/LikerIdTable';
import SubmitButton from '../components/SubmitButton';
import SettingNotice from '../components/SettingNotice';
import { USER_LIKER_INFO_STORE_NAME } from '../store/user-likerInfo-store';

const { likecoHost } = window.likecoinReactAppData;

function LikecoinButtonPage() {
  const {
    DBUserLikerId,
    DBUserLikerAvatar,
    DBUserLikerDisplayName,
    DBUserLikerWallet,
  } = useSelect((select) => select(USER_LIKER_INFO_STORE_NAME).selectUserLikerInfo());
  const { postUserLikerInfo } = useDispatch(USER_LIKER_INFO_STORE_NAME);
  const [savedSuccessful, setSavedSuccessful] = useState(false);
  const [userLikerInfo, setUserLikerInfo] = useState({});

  const onUserLikerIdUpdate = useCallback((likerInfo) => {
    setUserLikerInfo(likerInfo);
  }, []);

  const updateLikerIdHandler = useCallback((e) => {
    setSavedSuccessful(false);
    e.preventDefault();
    const userData = {
      userLikerInfos: {
        likecoin_id: userLikerInfo.likerIdValue,
        display_name: userLikerInfo.likerDisplayName,
        wallet: userLikerInfo.likerWalletAddress,
        avatar: userLikerInfo.likerAvatar,
      },
    };
    try {
      postUserLikerInfo(userData);
      setSavedSuccessful(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error occured when saving to Wordpress DB: ', error); // eslint-disable-line no-console
    }
  }, [userLikerInfo, postUserLikerInfo]);

  const handleNoticeDismiss = useCallback((e) => {
    e.preventDefault();
    setSavedSuccessful(false);
  }, []);
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
        <Section title={__('Your Liker ID', 'likecoin')} />
        <p>{__('This is your Liker ID, which is used to display LikeCoin button when post is not registered on ISCN yet.', 'likecoin')}</p>
        <LikerIdTable
          likecoHost={likecoHost}
          defaultLikerId={DBUserLikerId}
          defaultLikerDisplayName={DBUserLikerDisplayName}
          defaultLikerWalletAddress={DBUserLikerWallet}
          defaultLikerAvatar={DBUserLikerAvatar}
          editable
          onLikerIdUpdate={onUserLikerIdUpdate}
        />
        <SubmitButton />
      </form>
    </div>
  );
}

export default LikecoinButtonPage;
