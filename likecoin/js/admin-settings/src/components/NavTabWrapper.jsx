import PropTypes from 'prop-types';

export const navLinkClasses = ({ isActive }) => `nav-tab${isActive ? ' nav-tab-active' : ''}`;

function NavTabWrapper({ children }) {
  return (
    <nav className="lcp-nav-tab-wrapper nav-tab-wrapper wp-clearfix">
      {children}
    </nav>
  );
}

NavTabWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NavTabWrapper;
