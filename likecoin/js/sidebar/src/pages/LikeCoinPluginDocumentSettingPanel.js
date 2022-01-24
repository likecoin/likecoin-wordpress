import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import LikeCoinIcon from '../components/LikeCoinIcon';
import PublishStatus from '../components/PublishStatus';
import StatusTitle from '../components/StatusTitle';
import settingPageEndpoint from '../store/constant';

const { siteurl } = window.wpApiSettings;

function LikeCoinPluginDocumentSettingPanel(props) {
  const isCurrentPostPublished = useSelect((select) => select('core/editor')
    .isCurrentPostPublished());
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
              {!props.ISCNId && !props.mattersId && (
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
              {!props.ISCNId && props.mattersId && (
                <div className='flexBoxRow'>
                  <StatusTitle title={__('Distribution', 'likecoin')} />
                  <div>
                    <a
                      rel='noopener noreferrer'
                      target='_blank'
                      className='icon'
                      href={`${siteurl}/wp-admin/admin.php?page=likecoin${settingPageEndpoint}`}
                    >
                      Matters
                    </a>
                  </div>
                </div>
              )}
              {props.ISCNId && props.mattersArticleId && (
                <div className='flexBoxRow'>
                  <StatusTitle title={__('Distribution', 'likecoin')} />
                  <div>
                    <a
                      rel='noopener noreferrer'
                      target='_blank'
                      className='icon'
                      href={`https://matters.news/@${props.mattersId}/${props.mattersArticleSlug}-${props.mattersArticleId}`}
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
              </div>
            </>
          </div>
        </div>
      </div>
    </PluginDocumentSettingPanel>
  );
}

export default LikeCoinPluginDocumentSettingPanel;
