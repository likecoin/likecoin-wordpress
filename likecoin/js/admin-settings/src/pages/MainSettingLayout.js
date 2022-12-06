import { __ } from '@wordpress/i18n';
import { Link, Outlet } from 'react-router-dom';

function MainSettingLayout() {
  return <><nav>
      <Link to="">{__('General', 'likecoin')}</Link>
      <Link to="advanced">{__('Advanced', 'likecoin')}</Link>
      <Link to="other">{__('Other', 'likecoin')}</Link>
      <Link to="about">{__('About', 'likecoin')}</Link>
    </nav>
    <Outlet />
  </>;
}
export default MainSettingLayout;
