import { useState, useEffect } from 'react';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import LikeCoinIcon from '../components/LikeCoinIcon';
import PublishStatus from '../components/PublishStatus';
import StatusTitle from '../components/StatusTitle';
import settingPageEndpoint from '../store/constant';

const { siteurl } = window.wpApiSettings;

function LikeCoinPluginDocumentSettingPanel(props) {
  const [showDashLink, setShowDashLink] = useState(true);
  const [showMattersDraftLink, setShowMattersDraftLink] = useState(false);
  const [showMattersArticleLink, setShowMattersArticleLink] = useState(false);
  const [showUpdateISCNButton, setShowUpdateISCNButton] = useState(true);
  const [showNFTButton, setShowNFTButton] = useState(true);
  const isCurrentPostPublished = useSelect((select) => select('core/editor')
    .isCurrentPostPublished());
  const postDate = useSelect((select) => select('core/editor').getEditedPostAttribute('modified_gmt'));
  useEffect(() => {
    setShowUpdateISCNButton(!!(isCurrentPostPublished
      && props.ISCNTimestamp
      && Date.parse(`${postDate}Z`) > props.ISCNTimestamp)); // force parsing as gmt;
  }, [isCurrentPostPublished, postDate, props.ISCNTimestamp]);
  useEffect(() => setShowNFTButton(!!props.ISCNId), [props.ISCNId]);
  useEffect(() => {
    setShowDashLink((!isCurrentPostPublished && !props.mattersDraftId)
      || (isCurrentPostPublished && !props.mattersArticleId));
    setShowMattersDraftLink(!isCurrentPostPublished && props.mattersDraftId);
    setShowMattersArticleLink(isCurrentPostPublished && props.mattersArticleId);
  }, [isCurrentPostPublished, props]);
  return (
    <PluginDocumentSettingPanel
      name='depub-panel'
      title='#DePub  '
      className='depub-panel'
      icon={<LikeCoinIcon color='#9B9B9B' paddingLeft='10px' />}
    >
      <div className='postStatusInfoPanelOuterDiv'>
        <div className='flexBoxRow'>
          <div className='divOuterHolderStatusInfoPanel'>
            <>
              <PublishStatus
                isCurrentPostPublished={isCurrentPostPublished}
                ISCNId={props.ISCNId}
              />
              {showDashLink && (
                <div className='flexBoxRow'>
                  <StatusTitle title={__('Distribution', 'likecoin')} />
                  <div>
                    <a
                      rel='noopener noreferrer'
                      target='_blank'
                      className='icon'
                      href={`${siteurl}/wp-admin/admin.php?page=likecoin${settingPageEndpoint}`}
                    >
                      -
                    </a>
                  </div>
                </div>
              )}
              {showMattersDraftLink && (
                <div className='flexBoxRow'>
                  <StatusTitle title={__('Distribution', 'likecoin')} />
                  <div>
                    <a
                      rel='noopener noreferrer'
                      target='_blank'
                      className='icon'
                      href={`https://matters.news/me/drafts/${props.mattersDraftId}`}
                    >
                      Matters
                    </a>
                  </div>
                </div>
              )}
              {showMattersArticleLink && (
                <div className='flexBoxRow'>
                  <StatusTitle title={__('Distribution', 'likecoin')} />
                  <div>
                    <a
                      rel='noopener noreferrer'
                      target='_blank'
                      className='icon'
                      href={`https://matters.news/@${props.mattersId}/${props.mattersArticleSlug}-${props.mattersPublishedArticleHash}`}
                    >
                      Matters
                    </a>
                  </div>
                </div>
              )}
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
                      className='blueBackgroundWhiteTextSmallBtn'
                      onClick={props.handleRegisterISCN}
                    >
                      {__('DePub', 'likecoin')}
                    </button>
                    <button
                      className='whiteBackgroundBlueTextSmallBtn'
                      onClick={(e) => {
                        e.preventDefault();
                        document
                          .querySelector('[aria-label="LikeCoin Plugin"]')
                          .click();
                      }}
                    >
                      {__('Check #DePub', 'likecoin')}
                    </button>
                  </div>
                )}
                {showUpdateISCNButton && (
                  <button
                    className='blueBackgroundWhiteTextSmallBtn'
                    onClick={props.handleRegisterISCN}
                  >
                    {__('Update DePub', 'likecoin')}
                  </button>
                )}
                {showNFTButton && (
                  <button
                    className='blueBackgroundWhiteTextSmallBtn'
                    onClick={props.handleNFTAction}
                  >
                    { props.NFTClassID ? __('View NFT', 'likecoin') : __('Mint NFT', 'likecoin')}
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
