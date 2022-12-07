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

function MainSettingLayout() {
  const {
    DBUserCanEditOption,
  } = useSelect((select) => select(SITE_LIKER_INFO_STORE_NAME).selectSiteLikerInfo());
  return <><nav style={navStyle}>
      {DBUserCanEditOption && (<Link style={tabStyle} to="">{__('General', 'likecoin')}</Link>)}
      {DBUserCanEditOption && (<Link style={tabStyle} to="advanced">{__('Advanced', 'likecoin')}</Link>)}
      <Link style={tabStyle} to="about">{__('About', 'likecoin')}</Link>
    </nav>
    <Outlet />
  </>;
}
export default MainSettingLayout;
