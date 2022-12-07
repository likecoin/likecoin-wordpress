import { __ } from '@wordpress/i18n';
import { Link, Outlet } from 'react-router-dom';
import { useSelect } from '@wordpress/data';
import { SITE_LIKER_INFO_STORE_NAME } from '../store/site-likerInfo-store';

function MainSettingLayout() {
  const {
    DBUserCanEditOption,
  } = useSelect((select) => select(SITE_LIKER_INFO_STORE_NAME).selectSiteLikerInfo());
  return <><nav>
      {DBUserCanEditOption && (<Link to="">{__('General', 'likecoin')}</Link>)}
      {DBUserCanEditOption && (<Link to="advanced">{__('Advanced', 'likecoin')}</Link>)}
      <Link to="about">{__('About', 'likecoin')}</Link>
    </nav>
    <Outlet />
  </>;
}
export default MainSettingLayout;
