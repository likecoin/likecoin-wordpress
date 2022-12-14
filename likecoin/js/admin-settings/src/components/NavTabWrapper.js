export const navLinkClasses = ({ isActive }) => `nav-tab${isActive ? ' nav-tab-active' : ''}`;

function NavTabWrapper(props) {
  return (
    <nav className="lcp-nav-tab-wrapper nav-tab-wrapper wp-clearfix">
      {props.children}
    </nav>
  );
}
export default NavTabWrapper;
