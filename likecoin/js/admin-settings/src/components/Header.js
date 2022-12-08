import { __ } from '@wordpress/i18n';
import Logo from '../assets/logo.png';

function Header() {
  return <header style={{ display: 'flex' }}>
    <img src={Logo} alt={__('liker.land logo', 'likecoin')}/>
    <div style={{ flex: 1 }}></div>
    <div style={{ margin: '5px', padding: '20px' }}>
      <a style={{
        padding: '5px',
        border: 'solid 1px',
        borderRadius: '5px',
      }} href="https://liker.land/dashboard" rel="noopener noreferrer" target="_blank">
        {__('Your Portfolio', 'likecoin')}
      </a>
    </div>
  </header>;
}

export default Header;
