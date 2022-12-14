import { __ } from '@wordpress/i18n';
import { useRef, useState } from 'react';
import AdvancedWidgetSetting from '../components/AdvancedWidgetSetting';
import PublishSetting from '../components/PublishSetting';
import WebMonetizationSetting from '../components/WebMonetization/WebMonetizationSetting';
import SubmitButton from '../components/SubmitButton';
import SettingNotice from '../components/SettingNotice';

function AdvancedSettingPage() {
  const [savedSuccessful, setSavedSuccessful] = useState(false);
  const widgetSettingRef = useRef();
  const publishSettingRef = useRef();
  const webMonetizationSettingRef = useRef();
  async function confirmHandler(e) {
    setSavedSuccessful(false);
    e.preventDefault();
    try {
      await Promise.all([
        widgetSettingRef.current.submit(),
        publishSettingRef.current.submit(),
        webMonetizationSettingRef.current.submit(),
      ]);
      setSavedSuccessful(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
    }
  }
  function handleNoticeDismiss(e) {
    e.preventDefault();
    setSavedSuccessful(false);
  }
  return (
    <form className="likecoin" onSubmit={confirmHandler}>
      {savedSuccessful && (
        <SettingNotice
          text={__('Settings Saved', 'likecoin')}
          className="notice-success"
          handleNoticeDismiss={handleNoticeDismiss}
        />
      )}
      <AdvancedWidgetSetting ref={widgetSettingRef}/>
      <hr />
      <PublishSetting ref={publishSettingRef}/>
      <hr />
      <WebMonetizationSetting ref={webMonetizationSettingRef}/>
      <SubmitButton />
    </form>
  );
}

export default AdvancedSettingPage;
