import { PluginPostPublishPanel } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import LikeCoinIcon from '../components/LikeCoinIcon';
import ShowLessIcon from '../components/ShowLessIcon';
import ShowMoreIcon from '../components/ShowMoreIcon';
import settingPageEndpoint from '../store/constant';

const { siteurl } = window.wpApiSettings;

function LikeCoinPluginPostPublishPanel(props) {
  const [showMore, setShowMore] = useState(true);
  function handleShowMore(e) {
    e.preventDefault();
    setShowMore(!showMore);
  }
  return (
    <PluginPostPublishPanel>
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
              <div>
                <p className='flexBoxRowNormalText'>
                  {__('Register ISCN to Decentralized storage, and distribute to:', 'likecoin')}
                </p>
                <p className='flexBoxRowNormalText'> • {__('Matters (when connected)', 'likecoin')} </p>
              </div>
            </div>
            <div className='registerISCNBtnOuterDiv'>
              <button
                className='blueBackgroundWhiteTextSmallBtn'
                onClick={props.handleRegisterISCN}
              >
                {__('DePub', 'likecoin')}
              </button>
              <button
                className='whiteBackgroundBlueTextSmallBtn'
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('[aria-label="Close panel"]').click();
                }}
              >
                {__('Check #DePub', 'likecoin')}
              </button>
            </div>
          </>
        )}
      </div>
    </PluginPostPublishPanel>
  );
}

export default LikeCoinPluginPostPublishPanel;
