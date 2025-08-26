import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import Web3PressIcon from '../components/Web3PressIcon';
import PublishStatus from '../components/PublishStatus';

function LikeCoinPluginDocumentSettingPanel({
  ISCNId,
  NFTClassId,
  handleNFTAction,
}) {
  const [showNFTButton, setShowNFTButton] = useState(true);
  const isCurrentPostPublished = useSelect((select) => select('core/editor')
    .isCurrentPostPublished());
  useEffect(() => setShowNFTButton(!!ISCNId), [ISCNId]);
  return (
    <PluginDocumentSettingPanel
      name="depub-panel"
      title={__('Web3Press', 'likecoin')}
      className="depub-panel"
      icon={<Web3PressIcon color="#9B9B9B" paddingLeft="10px" />}
    >
      <div className="postStatusInfoPanelOuterDiv">
        <div className="flexBoxRow">
          <div className="divOuterHolderStatusInfoPanel">
            <PublishStatus
              isCurrentPostPublished={isCurrentPostPublished}
              ISCNId={ISCNId}
            />
            <div className="postStatusInfoRowOuterDiv">
              {!isCurrentPostPublished && (
              <button
                type="button"
                className="blueBackgroundWhiteTextBtn"
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
              {isCurrentPostPublished && !ISCNId && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                }}
              >
                <button
                  type="button"
                  className="whiteBackgroundBlueTextSmallBtn"
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
                type="button"
                className="blueBackgroundWhiteTextSmallBtn"
                onClick={handleNFTAction}
              >
                {NFTClassId ? __('View NFT', 'likecoin') : __('Mint NFT', 'likecoin')}
              </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </PluginDocumentSettingPanel>
  );
}

LikeCoinPluginDocumentSettingPanel.propTypes = {
  ISCNId: PropTypes.string,
  NFTClassId: PropTypes.string,
  handleNFTAction: PropTypes.func.isRequired,
};

LikeCoinPluginDocumentSettingPanel.defaultProps = {
  ISCNId: null,
  NFTClassId: null,
};

export default LikeCoinPluginDocumentSettingPanel;
