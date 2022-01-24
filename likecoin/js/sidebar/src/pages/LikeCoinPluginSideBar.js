import { PluginSidebar } from '@wordpress/edit-post';
import { useState, useEffect } from 'react';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import LikeCoinIcon from '../components/LikeCoinIcon';
import ShowMoreIcon from '../components/ShowMoreIcon';
import ShowLessIcon from '../components/ShowLessIcon';
import CheckMark from '../components/CheckMark';
import SideBarStatusRow from '../components/SideBarStatusRow';
import StatusTitle from '../components/StatusTitle';
import MoreInfoIcon from '../components/MoreInfoIcon';
import CrossIcon from '../components/CrossIcon';
import MetaPopUpStatusTitle from '../components/MetaPopUpStatusTitle';
import MetaPopUpStatusDetails from '../components/MetaPopUpStatusDetails';
import Tag from '../components/Tag';
import settingPageEndpoint from '../store/constant';
import PublishStatus from '../components/PublishStatus';

const { siteurl } = window.wpApiSettings;

function LikeCoinPluginSideBar(props) {
  const [showMore, setShowMore] = useState(true);
  const [showMetaData, setShowMetaData] = useState(false);
  const [pinBarIconColor, setPinBarIconColor] = useState('#28646E');
  const [distributeToMatters, setDistributeToMatters] = useState(true);
  const isPluginSidebarOpened = useSelect((select) => select('core/edit-post')
    .isPluginSidebarOpened());
  const isCurrentPostPublished = useSelect((select) => select('core/editor')
    .isCurrentPostPublished());
  function handleShowMore(e) {
    e.preventDefault();
    setShowMore(!showMore);
  }
  function handleShowMetaData(e) {
    e.preventDefault();
    setShowMetaData(!showMetaData);
  }
  function handleDistributeToMatters(e) {
    e.preventDefault();
    // TODO: Allow user to decide in next sidebar version.
  }
  useEffect(() => {
    if (isPluginSidebarOpened) {
      setPinBarIconColor('#50E3C2');
    } else {
      setPinBarIconColor('#28646E');
    }
  }, [isPluginSidebarOpened, setPinBarIconColor]);
  useEffect(() => {
    if (!props.mattersId) {
      setDistributeToMatters(false);
    }
  }, [props.mattersId]);

  return (
    <PluginSidebar
      name='likecoin-sidebar'
      title={__('LikeCoin Plugin', 'likecoin')}
      icon={<LikeCoinIcon color={pinBarIconColor} />}
    >
      <div className='divOuterHolder'>
        <div className='dePubMainSidebarDiv'>
          <p className='dePubStatusRed'>#DePub</p>
        </div>
        <div className='likeCoinIconOuterDiv'>
          <LikeCoinIcon color='#9B9B9B' />
        </div>
      </div>
      {!isCurrentPostPublished && (
        <div className='divOuterHolder'>
          <div className='divInnerHolder'>
            <button
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
          </div>
        </div>
      )}
      {isCurrentPostPublished && !props.ISCNId && (
        <div className='divOuterHolder'>
          <div className='divInnerHolder'>
            <button
              className='blueBackgroundWhiteTextBtn'
              onClick={props.handleRegisterISCN}
            >
              {__('DePub', 'likecoin')}
            </button>
          </div>
        </div>
      )}
      <div className='divOuterHolderMainSidebar'>
        <SideBarStatusRow title={__('#DePub State', 'likecoin')} status='' />
        <PublishStatus
          isCurrentPostPublished={isCurrentPostPublished}
          ISCNId={props.ISCNId}
        />
        <SideBarStatusRow
          title={__('ISCN ID', 'likecoin')}
          status={props.ISCNId ? props.ISCNId : '-'}
          link={
            props.ISCNId
              ? `https://app.like.co/view/${encodeURIComponent(props.ISCNId)}`
              : ''
          }
        />
        <SideBarStatusRow
          title={__('Arweave', 'likecoin')}
          status={props.arweaveId ? props.arweaveId : '-'}
          link={props.arweaveId ? `https://arweave.net/${props.arweaveId}` : ''}
        />
        <SideBarStatusRow
          title={__('Version', 'likecoin')}
          status={props.ISCNVersion ? props.ISCNVersion : '-'}
        />
      </div>
      <div className='divOuterHolderMainSidebar'>
        <div
          className='sidebarStatusTitleOuterDivPointer'
          onClick={handleShowMetaData}
        >
          <StatusTitle title={__('Metadata', 'likecoin')} />
          <div className='marginLeftAuto'>
            <MoreInfoIcon />
          </div>
        </div>
        {showMetaData && (
          <div className='popUpWrapper'>
            <div className='popUpMainTitleDiv'>
              <MetaPopUpStatusTitle title={__('Metadata', 'likecoin')} />
              <div className='popUpCrossIconWrapper'>
                <CrossIcon onClick={handleShowMetaData} />
              </div>
            </div>
            <div className='popUpMainContentWrapper'>
              <div className='popUpMainContentRow'>
                <MetaPopUpStatusTitle title={__('Title', 'likecoin')} />
                <MetaPopUpStatusDetails details={props.title} />
              </div>
              <div className='popUpMainContentRow'>
                <MetaPopUpStatusTitle title={__('Description', 'likecoin')} />
                <MetaPopUpStatusDetails details={props.description} />
              </div>
              <div className='popUpMainContentRow'>
                <MetaPopUpStatusTitle title={__('Author', 'likecoin')} />
                <MetaPopUpStatusDetails details={props.author} />
              </div>
              <div className='popUpMainContentRow'>
                <MetaPopUpStatusTitle title={__('Tag', 'likecoin')} />
                <div className='flexBoxRow'>
                  {props.tags
                    && props.tags.length > 0
                    && props.tags.map((tag) => <Tag tag={tag} />)}
                </div>
              </div>
              <div className='popUpMainContentRow'>
                <MetaPopUpStatusTitle title={__('Url', 'likecoin')} />
                <MetaPopUpStatusDetails details={props.url} />
              </div>
              <div className='popUpMainContentRow'>
                <StatusTitle title={__('Word count', 'likecoin')} />
                <MetaPopUpStatusDetails details={props.wordCount} />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className='divOuterHolderMainSidebar'>
        <div
          className='sidebarStatusTitleOuterDivPointer'
          onClick={handleShowMore}
        >
          <StatusTitle title={__('Distribution', 'likecoin')} />
          <div className='marginLeftAuto'>
            {!showMore && <ShowMoreIcon />}
            {showMore && <ShowLessIcon />}
          </div>
        </div>
        {showMore && (
          <>
            <div className='sidebarStatusTitleOuterDiv'>
              <div>
                <p className='greyText'>
                  {__(
                    'Your article will publish to other platform automatically after ISCN registration.',
                    'likecoin',
                  )}
                </p>
              </div>
            </div>
            <div
              className={
                props.mattersArticleId
                  ? 'sidebarStatusTitleOuterDivMatters'
                  : 'sidebarStatusTitleOuterDiv'
              }
            >
              {!props.mattersArticleId && (
                <span className='components-checkbox-control__input-container'>
                  <input
                    type='checkbox'
                    checked={distributeToMatters}
                    onChange={handleDistributeToMatters}
                    ref={props.checkRef}
                    id='inspector-checkbox-control-999'
                    className='components-checkbox-control__input'
                    style={{ margin: '0 10px 10px 0' }}
                  />
                  <CheckMark />
                </span>
              )}
              {!props.mattersArticleId && <div> Matters </div>}

              {props.mattersArticleId && (
                <SideBarStatusRow
                  title='Matters'
                  status={props.mattersArticleId ? props.mattersArticleId : '-'}
                  link={
                    props.mattersArticleId
                      ? `https://matters.news/@${props.mattersId}/${props.mattersArticleSlug}-${props.mattersArticleId}`
                      : ''
                  }
                />
              )}
            </div>
            <div style={{ paddingTop: '10px' }}>
              <a
                href={`${siteurl}/wp-admin/admin.php?page=likecoin${settingPageEndpoint}`}
                target='_blank'
                rel='noreferrer'
                className='settingLink'
              >
                {__('Settings', 'likecoin')}
              </a>
            </div>
          </>
        )}
      </div>
    </PluginSidebar>
  );
}

export default LikeCoinPluginSideBar;
