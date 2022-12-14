import { __ } from '@wordpress/i18n';
import { NavLink, Outlet } from 'react-router-dom';
import { useSelect } from '@wordpress/data';
import { SITE_LIKER_INFO_STORE_NAME } from '../store/site-likerInfo-store';
import NavTabWrapper, { navLinkClasses } from '../components/NavTabWrapper';

function LikerIdSettingLayout() {
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
            end={true}
          >{__('Website Liker ID', 'likecoin')}</NavLink>
        )}
        <NavLink
          className={navLinkClasses}
          to="user"
        >{__('Your Liker ID', 'likecoin')}</NavLink>
      </NavTabWrapper>
      <div className="lcp-nav-tab-panel">
        <Outlet />
      </div>
    </>
  );
}
export default LikerIdSettingLayout;
