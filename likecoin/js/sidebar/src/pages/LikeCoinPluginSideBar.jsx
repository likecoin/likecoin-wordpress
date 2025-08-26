import PropTypes from 'prop-types';
import { PluginSidebar } from '@wordpress/edit-post';
import { useState, useEffect, useCallback } from 'react';
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

function LikeCoinPluginSideBar({
  handleNFTAction,
  ISCNId,
  arweaveId,
  ISCNVersion,
  ISCNTimestamp,
  NFTClassId,
  title,
  description,
  author,
  tags,
  url,
}) {
  const content = useSelect((select) => select('core/editor').getEditedPostAttribute('content'));
  const {
    postISCNInfoData,
    postArweaveInfoData,
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
  const [showNFTButton, setShowNFTButton] = useState(true);
  const [pinBarIconColor, setPinBarIconColor] = useState('#3973B9');
  const isPluginSidebarOpened = useSelect((select) => select('core/edit-post')
    .isPluginSidebarOpened());
  const isCurrentPostPublished = useSelect((select) => select('core/editor')
    .isCurrentPostPublished());
  useEffect(() => setShowNFTButton(!!NFTClassId), [NFTClassId]);
  useEffect(() => {
    const iscnVersionString = ISCNVersion ? `${ISCNVersion} (${(new Date(ISCNTimestamp)).toGMTString()})` : '-';
    setISCNVersionString(iscnVersionString);
  }, [ISCNVersion, ISCNTimestamp]);
  const handleOnButtonSettingChange = useCallback(() => {
    const isEnabled = !isEnabledButton;
    postButtonSettings({ isEnabled });
    setButtonSettings({ isWidgetEnabled: isEnabled });
  }, [isEnabledButton, postButtonSettings, setButtonSettings]);
  const handleShowMetaData = useCallback((e) => {
    e.preventDefault();
    setShowMetaData((prev) => !prev);
  }, []);
  useEffect(() => {
    if (isPluginSidebarOpened) {
      setPinBarIconColor('white');
    } else {
      setPinBarIconColor('#3973B9');
    }
  }, [isPluginSidebarOpened, setPinBarIconColor]);

  return (
    <PluginSidebar
      name="likecoin-sidebar"
      title={__('Web3Press', 'likecoin')}
      icon={<Web3PressIconPinbar color={pinBarIconColor} />}
    >
      <div className="divOuterHolder">
        <div className="dePubMainSidebarDiv">
          <p className="dePubStatusRed">{__('Decentralized Publishing', 'likecoin')}</p>
        </div>
        <div className="likeCoinIconOuterDiv">
          <Web3PressIcon color="#9B9B9B" />
        </div>
      </div>
      {showNFTButton && (
        <div className="divOuterHolder">
          <div className="divInnerHolder">
            <button
              type="button"
              className="blueBackgroundWhiteTextBtn"
              onClick={handleNFTAction}
            >
              {NFTClassId ? __('View NFT', 'likecoin') : __('Mint NFT', 'likecoin')}
            </button>
          </div>
        </div>
      )}
      <div className="divOuterHolderMainSidebar">
        <SideBarStatusRow title={__('Publishing Status', 'likecoin')} status="" />
        <PublishStatus
          isCurrentPostPublished={isCurrentPostPublished}
          ISCNId={ISCNId}
        />
        <SideBarStatusRow
          title={__('ISCN ID', 'likecoin')}
          status={ISCNId || '-'}
          link={
            ISCNId
              ? `https://app.${likecoHost}/view/${encodeURIComponent(
                ISCNId,
              )}`
              : ''
          }
        />
        {ISCNId && (
          <SideBarStatusRow
            title={__('NFT', 'likecoin')}
            status={NFTClassId || __('Mint Now', 'likecoin')}
            link={
              NFTClassId
                ? `https://${likerlandHost}/nft/class/${encodeURIComponent(
                  NFTClassId,
                )}`
                : ''
            }
          />
        )}
        <SideBarStatusRow
          title={__('Storage', 'likecoin')}
          status={arweaveId || '-'}
          link={arweaveId ? `https://arweave.net/${arweaveId}` : ''}
        />
        <SideBarStatusRow
          title={__('Version', 'likecoin')}
          status={ISCNVersionString}
        />
      </div>
      {!isHideButtonSetting && (
        <div className="divOuterHolderMainSidebar">
          <StatusTitle title={__('Widget', 'likecoin')} />
          <CheckboxControl
            label={__('Enable in-post widget', 'likecoin')}
            help={__('Embed widget in this post (Overrides site setting)', 'likecoin')}
            checked={!!isEnabledButton}
            onChange={handleOnButtonSettingChange}
          />
        </div>
      )}
      <div className="divOuterHolderMainSidebar">
        {isCurrentPostPublished && (
        <LicensePicker
          defaultLicense={iscnLicense}
          disabled
        />
        )}
      </div>
      <div className="divOuterHolderMainSidebar">
        <div
          className="sidebarStatusTitleOuterDivPointer"
          onClick={handleShowMetaData}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleShowMetaData(e);
            }
          }}
        >
          <StatusTitle title={__('Metadata', 'likecoin')} />
          <div className="marginLeftAuto">
            <MoreInfoIcon />
          </div>
        </div>
        {showMetaData && (
          <div className="popUpWrapper">
            <div className="popUpMainTitleDiv">
              <MetaPopUpStatusTitle title={__('Metadata', 'likecoin')} />
              <div className="popUpCrossIconWrapper">
                <CrossIcon onClick={handleShowMetaData} />
              </div>
            </div>
            <div className="popUpMainContentWrapper">
              <div className="popUpMainContentRow">
                <MetaPopUpStatusTitle title={__('Title', 'likecoin')} />
                <MetaPopUpStatusDetails details={title} />
              </div>
              <div className="popUpMainContentRow">
                <MetaPopUpStatusTitle title={__('Description', 'likecoin')} />
                <MetaPopUpStatusDetails details={description} />
              </div>
              <div className="popUpMainContentRow">
                <MetaPopUpStatusTitle title={__('Author', 'likecoin')} />
                <MetaPopUpStatusDetails details={author} />
              </div>
              <div className="popUpMainContentRow">
                <MetaPopUpStatusTitle title={__('Tag', 'likecoin')} />
                <div className="flexBoxRow">
                  {tags
                    && tags.length > 0
                    && tags.map((tag) => <Tag key={tag} tag={tag} />)}
                </div>
              </div>
              <div className="popUpMainContentRow">
                <MetaPopUpStatusTitle title={__('Url', 'likecoin')} />
                <MetaPopUpStatusDetails details={url} />
              </div>
              <div className="popUpMainContentRow">
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
              value={ISCNId}
              onChange={(value) => postISCNInfoData({ iscnId: value })}
            />
          </PanelRow>
          <PanelRow>
            <TextControl
              label={__('Override Arweave ID', 'likecoin')}
              value={arweaveId}
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

LikeCoinPluginSideBar.propTypes = {
  handleNFTAction: PropTypes.func.isRequired,
  ISCNId: PropTypes.string,
  arweaveId: PropTypes.string,
  ISCNVersion: PropTypes.number,
  ISCNTimestamp: PropTypes.string,
  NFTClassId: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  author: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  url: PropTypes.string,
};

LikeCoinPluginSideBar.defaultProps = {
  ISCNId: null,
  arweaveId: null,
  ISCNVersion: null,
  ISCNTimestamp: null,
  NFTClassId: null,
  title: '',
  description: '',
  author: '',
  tags: [],
  url: '',
};

export default LikeCoinPluginSideBar;
