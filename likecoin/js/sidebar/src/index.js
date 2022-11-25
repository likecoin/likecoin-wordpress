import './style.css';
import { registerPlugin } from '@wordpress/plugins';
import LikeCoinPlugin from './pages/LikeCoinPlugin';

function LikeCoinSideBar() {
  return (
    <LikeCoinPlugin/>
  );
}

registerPlugin('likecoin-sidebar', { render: LikeCoinSideBar });
