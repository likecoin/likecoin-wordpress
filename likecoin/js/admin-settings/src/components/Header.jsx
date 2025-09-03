import { __ } from '@wordpress/i18n';
import Logo from '../assets/w3p_logo.png';

function Header() {
  return (
    <header className="lcp-admin-header">
      <img src={Logo} alt={__('Web3Press logo', 'likecoin')} />
      <a
        className="lcp-admin-header__portfolio-button"
        href="https://liker.land/dashboard"
        rel="noopener noreferrer"
        target="_blank"
      >
        {__('Your Portfolio (Legacy)', 'likecoin')}
        &nbsp;
        <span className="dashicons dashicons-external" />
      </a>
    </header>
  );
}

export default Header;
