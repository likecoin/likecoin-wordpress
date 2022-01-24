import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from 'react';
import LikeCoinIcon from '../components/LikeCoinIcon';
import PostStatusRow from '../components/PostStatusRow';
import settingPageEndpoint from '../store/constant';

const { siteurl } = window.wpApiSettings;

function LikeCoinPluginDocumentSettingPanel(props) {
  const [numberOfMedia, setNumberOfMedia] = useState(0);

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
              <PostStatusRow
                title={__('State', 'likecoin')}
                status={
                  <div className='flexBoxRow'>
                    <div className={props.ISCNId ? 'greenDot' : 'redDot'}></div>{' '}
                    <div className='postStatusDiv'>
                      {props.ISCNId
                        ? `${__('Registered', 'likecoin')}`
                        : `${__('None', 'likecoin')}`}
                    </div>
                  </div>
                }
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
