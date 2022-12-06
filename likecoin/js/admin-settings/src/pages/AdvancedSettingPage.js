import { __ } from '@wordpress/i18n';
import AdvancedWidgetSetting from '../components/AdvancedWidgetSetting';
import PublishSetting from '../components/PublishSetting';
import WebmonitizationSetting from '../components/WebMonetizationSetting';

function AdvancedSettingPage() {
  return (
    <>
      <AdvancedWidgetSetting />
      <hr />
      <PublishSetting />
      <hr />
      <WebmonitizationSetting />
    </>
  );
}

export default AdvancedSettingPage;
