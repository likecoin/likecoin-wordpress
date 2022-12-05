import { registerPlugin } from '@wordpress/plugins';
import './index.css';
import LikeCoinPlugin from './pages/LikeCoinPlugin';

function LikeCoinSideBar() {
  return (
    <LikeCoinPlugin/>
  );
}

registerPlugin('likecoin-sidebar', { render: LikeCoinSideBar });
