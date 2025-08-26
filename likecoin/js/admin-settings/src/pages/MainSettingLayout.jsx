import { __ } from '@wordpress/i18n';
import { NavLink, Outlet } from 'react-router-dom';
import { useSelect } from '@wordpress/data';
import { SITE_LIKER_INFO_STORE_NAME } from '../store/site-likerInfo-store';
import NavTabWrapper, { navLinkClasses } from '../components/NavTabWrapper';

function MainSettingLayout() {
  const {
    DBUserCanEditOption,
  } = useSelect((select) => select(SITE_LIKER_INFO_STORE_NAME).selectSiteLikerInfo());
  return (
    <>
      <NavTabWrapper>
        {DBUserCanEditOption && (
          <NavLink
            className={navLinkClasses}
            to=""
            end
          >
            {__('General', 'likecoin')}
          </NavLink>
        )}
        {DBUserCanEditOption && (
          <NavLink
            className={navLinkClasses}
            to="advanced"
          >
            {__('Advanced', 'likecoin')}
          </NavLink>
        )}
        <NavLink
          className={navLinkClasses}
          to="about"
        >
          {__('About', 'likecoin')}
        </NavLink>
      </NavTabWrapper>
      <div className="lcp-nav-tab-panel">
        <Outlet />
      </div>
    </>
  );
}
export default MainSettingLayout;
