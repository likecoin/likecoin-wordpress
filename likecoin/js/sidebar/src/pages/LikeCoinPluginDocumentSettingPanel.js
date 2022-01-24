import { useState, useEffect } from 'react';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import LikeCoinIcon from '../components/LikeCoinIcon';
import PostStatusRow from '../components/PostStatusRow';
import PublishStatus from '../components/PublishStatus';
import settingPageEndpoint from '../store/constant';

const { siteurl } = window.wpApiSettings;

function LikeCoinPluginDocumentSettingPanel(props) {
  const [numberOfMedia, setNumberOfMedia] = useState(0);
  const isCurrentPostPublished = useSelect((select) => select('core/editor')
    .isCurrentPostPublished());

  useEffect(() => {
    if (props.mattersId) {
      setNumberOfMedia(1);
    }
  }, [props.mattersId]);
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
              {!props.ISCNId && (
                <PostStatusRow
                  title={__('Distribution', 'likecoin')}
                  status={__(`Will distribute to ${numberOfMedia}`, 'likecoin')}
                />
              )}
              {props.ISCNId && (
                <PostStatusRow
                  title={__('Distribution', 'likecoin')}
                  status={numberOfMedia}
                />
              )}
              <div className='postStatusInfoRowOuterDiv'>
                {!isCurrentPostPublished && <button
                  className='blueBackgroundWhiteTextBtn'
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
                }
                {isCurrentPostPublished && !props.ISCNId && <button
                  className='blueBackgroundWhiteTextBtn'
                  onClick={props.handleRegisterISCN}
                >
                {__('DePub', 'likecoin')}
                </button>
                }
              </div>
              <div className='postStatusInfoRowOuterDiv'>
                <button
                  className='whiteBackgroundBlueTextBtn'
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(
                      `${siteurl}/wp-admin/admin.php?page=likecoin${settingPageEndpoint}`,
                      '_blank',
                    );
                  }}
                >
                  {__('Check #DePub Settings', 'likecoin')}
                </button>
              </div>
            </>
          </div>
        </div>
      </div>
    </PluginDocumentSettingPanel>
  );
}

export default LikeCoinPluginDocumentSettingPanel;
