import axios from 'axios';
import MainSettingTable from '../components/MainSettingTable';
function MainSettingPage() {
  async function postMainOptionDataToWordpress(data) {
    try {
      await axios.post(
        `${window.wpApiSettings.root}likecoin-react/v1/main-setting-page`,
        JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': window.wpApiSettings.nonce, // prevent CORS attack.
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <MainSettingTable onSubmit={postMainOptionDataToWordpress} />
    </div>
  );
}

export default MainSettingPage;
