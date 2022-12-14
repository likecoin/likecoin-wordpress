import { __ } from '@wordpress/i18n';
import Logo from '../assets/logo.png';

function Header() {
  return (
    <header className="lcp-admin-header">
      <img src={Logo} alt={__('liker.land logo', 'likecoin')} />
      <a
        className="lcp-admin-header__portfolio-button"
        href="https://liker.land/dashboard"
        rel="noopener noreferrer"
        target="_blank"
      >
        {__('Your Portfolio', 'likecoin')}
      </a>
    </header>
  );
}

export default Header;
