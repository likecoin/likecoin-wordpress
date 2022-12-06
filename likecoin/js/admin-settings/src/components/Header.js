import { __ } from '@wordpress/i18n';
import Logo from '../assets/logo.png';

function Header() {
  return <header>
    <img src={Logo} alt={__('liker.land logo', 'likecoin')}/>
    <a href="https://liker.land/dashboard" rel="noopenner">
      {__('Your Portfolio', 'likecoin')}
    </a>
  </header>;
}

export default Header;
