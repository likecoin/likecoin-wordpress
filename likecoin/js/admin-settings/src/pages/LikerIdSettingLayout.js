import { __ } from '@wordpress/i18n';
import { NavLink, Outlet } from 'react-router-dom';
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
  textDecoration: 'none',
};
const tableStyleFn = ({ isActive }) => (isActive
  ? tabStyle
  : {
    ...tabStyle,
    color: '#9B9B9B',
    background: '#EBEBEB;',
  });

function LikerIdSettingLayout() {
  const {
    DBUserCanEditOption,
  } = useSelect((select) => select(SITE_LIKER_INFO_STORE_NAME).selectSiteLikerInfo());
  return <><nav style={navStyle}>
      {DBUserCanEditOption && <NavLink style={tableStyleFn} to="" end={true}>{__('Website Liker ID', 'likecoin')}</NavLink>}
      <NavLink style={tableStyleFn} to="user">{__('Your Liker ID', 'likecoin')}</NavLink>
    </nav>
    <Outlet />
  </>;
}
export default LikerIdSettingLayout;
