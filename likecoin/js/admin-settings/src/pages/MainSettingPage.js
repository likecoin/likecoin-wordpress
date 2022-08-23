import { useDispatch } from '@wordpress/data';
import MainSettingTable from '../components/MainSettingTable';
import { SITE_LIKER_INFO_STORE_NAME } from '../store/site-likerInfo-store';

const { likecoHost } = window.likecoinReactAppData;

function MainSettingPage() {
  const { postSiteLikerInfo } = useDispatch(SITE_LIKER_INFO_STORE_NAME);
  return (
    <div>
      <MainSettingTable
        likecoHost={likecoHost}
        onSubmit={postSiteLikerInfo}
      />
    </div>
  );
}

export default MainSettingPage;
