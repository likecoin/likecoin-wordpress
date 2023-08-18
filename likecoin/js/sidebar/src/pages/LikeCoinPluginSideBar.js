import { PluginSidebar } from '@wordpress/edit-post';
import { useState, useEffect } from 'react';
import { useSelect, useDispatch } from '@wordpress/data';
import {
  CheckboxControl, TextControl, Panel, PanelBody, PanelRow,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { count as wordCount } from '@wordpress/wordcount';
import { ISCN_INFO_STORE_NAME } from '../store/iscn-info-store';
import Web3PressIcon from '../components/Web3PressIcon';
import SideBarStatusRow from '../components/SideBarStatusRow';
import StatusTitle from '../components/StatusTitle';
import MoreInfoIcon from '../components/MoreInfoIcon';
import CrossIcon from '../components/CrossIcon';
import MetaPopUpStatusTitle from '../components/MetaPopUpStatusTitle';
import MetaPopUpStatusDetails from '../components/MetaPopUpStatusDetails';
import Tag from '../components/Tag';
import PublishStatus from '../components/PublishStatus';
import LicensePicker from '../components/LicensePicker';
import Web3PressIconPinbar from '../components/Web3PressPinbar';
import { BUTTON_INFO_STORE_NAME } from '../store/button-info-store';

const { likecoHost, likerlandHost } = window.likecoinApiSettings;

function LikeCoinPluginSideBar(props) {
  const content = useSelect((select) => select('core/editor').getEditedPostAttribute('content'));
  const {
    postISCNInfoData,
    postArweaveInfoData,
    setISCNLicense,
  } = useDispatch(ISCN_INFO_STORE_NAME);
  const iscnLicense = useSelect((select) => select(ISCN_INFO_STORE_NAME).getLicense());
  const {
    isWidgetEnabled: isEnabledButton,
    isOptionDisabled: isHideButtonSetting,
  } = useSelect((select) => select(BUTTON_INFO_STORE_NAME).getButtonSettings());
  const { setButtonSettings, postButtonSettings } = useDispatch(BUTTON_INFO_STORE_NAME);
  const numberOfWords = wordCount(content, 'words', {});
  const [showMetaData, setShowMetaData] = useState(false);
  const [ISCNVersionString, setISCNVersionString] = useState(true);
  const [showPublishISCNButton, setShowPublisnISCNButton] = useState(true);
  const [showUpdateISCNButton, setShowUpdateISCNButton] = useState(true);
  const [showNFTButton, setShowNFTButton] = useState(true);
  const [pinBarIconColor, setPinBarIconColor] = useState('#3973B9');
  const isPluginSidebarOpened = useSelect((select) => select('core/edit-post')
    .isPluginSidebarOpened());
  const isCurrentPostPublished = useSelect((select) => select('core/editor')
    .isCurrentPostPublished());
  const postDate = useSelect((select) => select('core/editor').getEditedPostAttribute('modified_gmt'));
  useEffect(() => {
    setShowPublisnISCNButton(!!isCurrentPostPublished && !props.ISCNId);
  }, [isCurrentPostPublished, props.ISCNId]);
  useEffect(() => {
    setShowUpdateISCNButton(!!(isCurrentPostPublished
      && Date.parse(`${postDate}Z`) > (props.ISCNTimestamp || 0))); // force parsing as gmt
  }, [isCurrentPostPublished, postDate, props.ISCNTimestamp]);
  useEffect(() => setShowNFTButton(!!props.ISCNId), [props.ISCNId]);
  useEffect(() => {
    const iscnVersionString = props.ISCNVersion ? `${props.ISCNVersion} (${(new Date(props.ISCNTimestamp)).toGMTString()})` : '-';
    setISCNVersionString(iscnVersionString);
  }, [props.ISCNVersion, props.ISCNTimestamp]);
  function handleOnLicenseSelect(license) {
    setISCNLicense(license);
  }
  function handleOnButtonSettingChange() {
    const isEnabled = !isEnabledButton;
    postButtonSettings({ isEnabled });
    setButtonSettings({ isWidgetEnabled: isEnabled });
  }
  function handleShowMetaData(e) {
    e.preventDefault();
    setShowMetaData(!showMetaData);
  }
  useEffect(() => {
    if (isPluginSidebarOpened) {
      setPinBarIconColor('white');
    } else {
      setPinBarIconColor('#3973B9');
    }
  }, [isPluginSidebarOpened, setPinBarIconColor]);

  return (
    <PluginSidebar
      name='likecoin-sidebar'
      title={__('Web3Press', 'likecoin')}
      icon={<Web3PressIconPinbar color={pinBarIconColor} />}
    >
      <div className='divOuterHolder'>
        <div className='dePubMainSidebarDiv'>
          <p className='dePubStatusRed'>{__('Decentralized Publishing', 'likecoin')}</p>
        </div>
        <div className='likeCoinIconOuterDiv'>
          <Web3PressIcon color='#9B9B9B' />
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
      {showPublishISCNButton && (
        <div className='divOuterHolder'>
          <div className='divInnerHolder'>
            <button
              className='blueBackgroundWhiteTextBtn'
              onClick={props.handleRegisterISCN}
            >
              {__('Publish', 'likecoin')}
            </button>
          </div>
        </div>
      )}
      {showUpdateISCNButton && (
        <div className='divOuterHolder'>
          <div className='divInnerHolder'>
            <button
              className='blueBackgroundWhiteTextBtn'
              onClick={props.handleRegisterISCN}
            >
              {__('Update', 'likecoin')}
            </button>
          </div>
        </div>
      )}
      {showNFTButton && (
        <div className='divOuterHolder'>
          <div className='divInnerHolder'>
            <button
              className='blueBackgroundWhiteTextBtn'
              onClick={props.handleNFTAction}
            >
              {props.NFTClassId ? __('View NFT', 'likecoin') : __('Mint NFT', 'likecoin')}
            </button>
          </div>
        </div>
      )}
      <div className='divOuterHolderMainSidebar'>
        <SideBarStatusRow title={__('Publishing Status', 'likecoin')} status='' />
        <PublishStatus
          isCurrentPostPublished={isCurrentPostPublished}
          ISCNId={props.ISCNId}
        />
        <SideBarStatusRow
          title={__('ISCN ID', 'likecoin')}
          status={props.ISCNId ? props.ISCNId : '-'}
          link={
            props.ISCNId
              ? `https://app.${likecoHost}/view/${encodeURIComponent(
                props.ISCNId,
              )}`
              : ''
          }
        />
        {props.ISCNId && (
          <SideBarStatusRow
            title={__('NFT', 'likecoin')}
            status={props.NFTClassId ? props.NFTClassId : __('Mint Now', 'likecoin')}
            link={
              props.NFTClassId
                ? `https://${likerlandHost}/nft/class/${encodeURIComponent(
                  props.NFTClassId,
                )}`
                : ''
            }
          />
        )}
        <SideBarStatusRow
          title={__('Storage', 'likecoin')}
          status={props.arweaveId ? props.arweaveId : '-'}
          link={props.arweaveId ? `https://arweave.net/${props.arweaveId}` : ''}
        />
        <SideBarStatusRow
          title={__('Version', 'likecoin')}
          status={ISCNVersionString}
        />
      </div>
      {!isHideButtonSetting && (
        <div className='divOuterHolderMainSidebar'>
          <StatusTitle title={__('Widget', 'likecoin')} />
          <CheckboxControl
            label={__('Enable in-post widget', 'likecoin')}
            help={__('Embed widget in this post (Overrides site setting)', 'likecoin')}
            checked={!!isEnabledButton}
            onChange={handleOnButtonSettingChange}
          />
        </div>
      )}
      <div className='divOuterHolderMainSidebar'>
        <LicensePicker
          defaultLicense={iscnLicense}
          onSelect={handleOnLicenseSelect}
          disabled={!(!isCurrentPostPublished || showPublishISCNButton || showUpdateISCNButton)}
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
                <MetaPopUpStatusDetails details={numberOfWords} />
              </div>
            </div>
          </div>
        )}
      </div>
      <Panel>
        <PanelBody title={__('Advanced', 'likecoin')} initialOpen={false}>
          <PanelRow>
            <TextControl
              label={__('Override ISCN ID', 'likecoin')}
              value={props.ISCNId}
              onChange={(value) => postISCNInfoData({ iscnId: value })}
            />
          </PanelRow>
          <PanelRow>
            <TextControl
              label={__('Override Arweave ID', 'likecoin')}
              value={props.arweaveId}
              onChange={(value) => {
                postArweaveInfoData({ arweaveId: value });
              }}
            />
          </PanelRow>
        </PanelBody>
      </Panel>
    </PluginSidebar>
  );
}

export default LikeCoinPluginSideBar;
