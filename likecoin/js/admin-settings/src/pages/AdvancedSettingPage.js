import { __ } from '@wordpress/i18n';
import PublishSetting from '../components/PublishSetting';
import WebmonitizationSetting from '../components/WebMonetizationSetting';

function AdvancedSettingPage() {
  return (
    <>
        <PublishSetting />
        <hr />
        <WebmonitizationSetting />
    </>
  );
}

export default AdvancedSettingPage;
