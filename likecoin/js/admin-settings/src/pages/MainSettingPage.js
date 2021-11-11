import { useDispatch } from '@wordpress/data';
import MainSettingTable from '../components/MainSettingTable';
import { SITE_LIKER_INFO_STORE_NAME } from '../store/site-likerInfo-store';

function MainSettingPage() {
  const { postSiteLikerInfo } = useDispatch(SITE_LIKER_INFO_STORE_NAME);
  async function postMainOptionDataToWordpress(data) {
    try {
      postSiteLikerInfo(data);
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  }
  return (
    <div>
      <MainSettingTable onSubmit={postMainOptionDataToWordpress} />
    </div>
  );
}

export default MainSettingPage;
