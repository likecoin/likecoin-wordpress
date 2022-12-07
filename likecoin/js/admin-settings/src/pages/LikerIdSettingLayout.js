import { __ } from '@wordpress/i18n';
import { Link, Outlet } from 'react-router-dom';
import { useSelect } from '@wordpress/data';
import { SITE_LIKER_INFO_STORE_NAME } from '../store/site-likerInfo-store';

const navStyle = {
  padding: '3px',
  marginRight: '20px',
  borderBottom: 'solid 1px',
};
const tabStyle = {
  padding: '5px',
  border: 'solid 1px',
};

function LikerIdSettingLayout() {
  const {
    DBUserCanEditOption,
  } = useSelect((select) => select(SITE_LIKER_INFO_STORE_NAME).selectSiteLikerInfo());
  return <><nav style={navStyle}>
      {DBUserCanEditOption && <Link style={tabStyle} to="">{__('Website Liker ID', 'likecoin')}</Link>}
      <Link style={tabStyle} to="user">{__('Your Liker ID', 'likecoin')}</Link>
    </nav>
    <Outlet />
  </>;
}
export default LikerIdSettingLayout;
