import { __ } from '@wordpress/i18n';
import { Link, Outlet } from 'react-router-dom';

function LikerIdSettingLayout() {
  return <><nav>
      <Link to="">{__('Website LikerID', 'likecoin')}</Link>
      <Link to="user">{__('Your LikerID', 'likecoin')}</Link>
    </nav>
    <Outlet />
  </>;
}
export default LikerIdSettingLayout;
