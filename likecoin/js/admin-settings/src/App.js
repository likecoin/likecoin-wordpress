import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelect } from '@wordpress/data';
import { SITE_LIKER_INFO_STORE_NAME } from './store/site-likerInfo-store';
import Header from './components/Header';
import MainSettingLayout from './pages/MainSettingLayout';
import MainSettingPage from './pages/MainSettingPage';
import LikerIdSettingLayout from './pages/LikerIdSettingLayout';
import AdvancedSettingPage from './pages/AdvancedSettingPage';
import UserLikerIdSettingPage from './pages/UserLikerIdSettingPage';
import SiteLikerIdSettingPage from './pages/SiteLikerIdSettingPage';
import SponsorLikecoinPage from './pages/SponsorLikecoinPage';
import LikeCoinHelpPage from './pages/LikeCoinHelpPage';

function App() {
  const {
    DBUserCanEditOption,
  } = useSelect((select) => select(SITE_LIKER_INFO_STORE_NAME).selectSiteLikerInfo());
  // An empty h2 under .wrap is used for displaying notice
  // https://wordpress.stackexchange.com/questions/220650/how-to-change-the-location-of-admin-notice-in-html-without-using-javascript
  return (
    <div className="wrap">
      <h2> </h2>
      <Header />
      <Routes>
        <Route path="" element={<MainSettingLayout />}>
          <Route index element={DBUserCanEditOption ? <MainSettingPage /> : <Navigate to="/about" replace />} />
          <Route path="advanced" element={<AdvancedSettingPage />} />
          <Route path="about" element={<SponsorLikecoinPage />} />
        </Route>
        <Route path="liker-id" element={<LikerIdSettingLayout />}>
          <Route index element={DBUserCanEditOption ? <SiteLikerIdSettingPage /> : <Navigate to="user" replace />} />
          <Route path="user" element={<UserLikerIdSettingPage />} />
        </Route>
        <Route path="help" element={<LikeCoinHelpPage />} />
      </Routes>
    </div>
  );
}

export default App;
