import { __ } from '@wordpress/i18n';
import AdvancedWidgetSetting from '../components/AdvancedWidgetSetting';
import PublishSetting from '../components/PublishSetting';
import WebMonetizationSetting from '../components/WebMonetization/WebMonetizationSetting';

function AdvancedSettingPage() {
  return (
    <>
      <AdvancedWidgetSetting />
      <hr />
      <PublishSetting />
      <hr />
      <WebMonetizationSetting />
    </>
  );
}

export default AdvancedSettingPage;
