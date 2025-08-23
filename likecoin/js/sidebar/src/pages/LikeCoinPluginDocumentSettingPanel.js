import { useState, useEffect } from 'react';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import Web3PressIcon from '../components/Web3PressIcon';
import PublishStatus from '../components/PublishStatus';

function LikeCoinPluginDocumentSettingPanel(props) {
  const [showNFTButton, setShowNFTButton] = useState(true);
  const isCurrentPostPublished = useSelect((select) => select('core/editor')
    .isCurrentPostPublished());
  useEffect(() => setShowNFTButton(!!props.ISCNId), [props.ISCNId]);
  return (
    <PluginDocumentSettingPanel
      name='depub-panel'
      title={__('Web3Press', 'likecoin')}
      className='depub-panel'
      icon={<Web3PressIcon color='#9B9B9B' paddingLeft='10px' />}
    >
      <div className='postStatusInfoPanelOuterDiv'>
        <div className='flexBoxRow'>
          <div className='divOuterHolderStatusInfoPanel'>
            <>
              <PublishStatus
                isCurrentPostPublished={isCurrentPostPublished}
                ISCNId={props.ISCNId}
              />
              <div className='postStatusInfoRowOuterDiv'>
                {!isCurrentPostPublished && (
                  <button
                    className='blueBackgroundWhiteTextBtn'
                    style={{ minWidth: '0', width: '100%' }}
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementsByClassName(
                          'editor-post-publish-button__button',
                        )[0]
                        .click();
                    }}
                  >
                    {__('Publish your post first', 'likecoin')}
                  </button>
                )}
                {isCurrentPostPublished && !props.ISCNId && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      width: '100%',
                    }}
                  >
                    <button
                      className='whiteBackgroundBlueTextSmallBtn'
                      onClick={(e) => {
                        e.preventDefault();
                        document
                          .querySelector('[aria-label="Web3Press"]')
                          .click();
                      }}
                    >
                      {__('Details', 'likecoin')}
                    </button>
                  </div>
                )}
                {showNFTButton && (
                  <button
                    className='blueBackgroundWhiteTextSmallBtn'
                    onClick={props.handleNFTAction}
                  >
                    { props.NFTClassId ? __('View NFT', 'likecoin') : __('Mint NFT', 'likecoin')}
                  </button>
                )}
              </div>
            </>
          </div>
        </div>
      </div>
    </PluginDocumentSettingPanel>
  );
}

export default LikeCoinPluginDocumentSettingPanel;
