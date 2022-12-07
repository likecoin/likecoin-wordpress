import { __ } from '@wordpress/i18n';
import { Link, Outlet } from 'react-router-dom';
import { useSelect } from '@wordpress/data';
import { SITE_LIKER_INFO_STORE_NAME } from '../store/site-likerInfo-store';

function LikerIdSettingLayout() {
  const {
    DBUserCanEditOption,
  } = useSelect((select) => select(SITE_LIKER_INFO_STORE_NAME).selectSiteLikerInfo());
  return <><nav>
      {DBUserCanEditOption && <Link to="">{__('Website LikerID', 'likecoin')}</Link>}
      <Link to="user">{__('Your LikerID', 'likecoin')}</Link>
    </nav>
    <Outlet />
  </>;
}
export default LikerIdSettingLayout;
