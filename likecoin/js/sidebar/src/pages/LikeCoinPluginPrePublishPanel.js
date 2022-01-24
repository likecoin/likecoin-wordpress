import {
  PluginPrePublishPanel,
} from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import CrossIcon from '../components/CrossIcon';
import LikeCoinIcon from '../components/LikeCoinIcon';
import ShowLessIcon from '../components/ShowLessIcon';
import ShowMoreIcon from '../components/ShowMoreIcon';
import settingPageEndpoint from '../store/constant';

const { siteurl } = window.wpApiSettings;

function LikeCoinPluginPrePublishPanel(props) {
  const [showMore, setShowMore] = useState(true);
  function handleShowMore(e) {
    e.preventDefault();
    setShowMore(!showMore);
  }
  return (
    <PluginPrePublishPanel>
      <div className='divOuterHolderStatusInfoPanel'>
        <div className='flexBoxRow'>
          <div className='dePubDiv'>
            <p className='dePubStatusRed'>#DePub</p>
          </div>
          <div className='likeCoinIconOuterDiv'>
            <LikeCoinIcon color='#9B9B9B' />
          </div>
          <div onClick={handleShowMore} className='marginLeftAuto'>
            {!showMore && <ShowMoreIcon />}
            {showMore && <ShowLessIcon />}
          </div>
        </div>
        {showMore && (
          <>
            <div className='flexBoxRow'>
              <div className='crossIconOuterDiv'>
                <CrossIcon />
              </div>
              <div>
                <p className='lineThroughText'>
                  {__('Start register ISCN automatically', 'likecoin')}
                </p>
              </div>
            </div>
            <div className='flexBoxRowCheckDePub'>
              <button
                className='whiteBackgroundBlueTextBtn'
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementsByClassName('components-button is-secondary')[0]
                    .click();
                }}
              >
                {__('Check #DePub', 'likecoin')}
              </button>
            </div>
          </>
        )}
      </div>
    </PluginPrePublishPanel>
  );
}

export default LikeCoinPluginPrePublishPanel;
