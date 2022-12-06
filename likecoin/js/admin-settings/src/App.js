import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MainSettingLayout from './pages/MainSettingLayout';
import MainSettingPage from './pages/MainSettingPage';
import LikecoinButtonPage from './pages/LikecoinButtonPage';
import AdvancedSettingPage from './pages/AdvancedSettingPage';
import SponsorLikecoinPage from './pages/SponsorLikecoinPage';
import LikeCoinHelpPage from './pages/LikeCoinHelpPage';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="" element={<MainSettingLayout />}>
          <Route index element={<MainSettingPage />} />
          <Route path="advanced" element={<AdvancedSettingPage />} />
          <Route path="about" element={<SponsorLikecoinPage />} />
        </Route>
        <Route path="button" element={<LikecoinButtonPage />} />
        <Route path="help" element={<LikeCoinHelpPage />} />
      </Routes>
    </div>
  );
}

export default App;
