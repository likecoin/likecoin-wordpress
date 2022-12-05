import { useState, useEffect, useCallback } from 'react';
import { useSelect, useDispatch } from '@wordpress/data';
import LikeCoinPluginDocumentSettingPanel from './LikeCoinPluginDocumentSettingPanel';
import LikeCoinPluginSideBar from './LikeCoinPluginSideBar';
import LikeCoinPluginPostPublishPanel from './LikeCoinPluginPostPublishPanel';
import { ISCN_INFO_STORE_NAME } from '../store/iscn-info-store';

const { siteurl, likecoHost, likerlandHost } = window.wpApiSettings;

const ISCN_WIDGET_ORIGIN = `https://${likecoHost}`;
const NFT_WIDGET_ORIGIN = `https://app.${likecoHost}`;
const ISCN_RECORD_NOTE = 'LikeCoin WordPress Plugin';

function LikeCoinPlugin() {
  const {
    DBLIKEPayAmount,
    DBMemo,
    DBArticleTitle,
    DBAuthorDescription,
    DBDescription,
    DBAuthor,
    DBArticleURL,
    DBArticleTags,
    DBISCNId,
    DBArweaveId,
    DBMattersIPFSHash,
    DBMattersPublishedArticleHash,
    DBISCNVersion,
    DBISCNTimestamp,
    DBMattersDraftId,
    DBMattersArticleId,
    DBMattersId,
    DBMattersArticleSlug,
    DBLicense,
  } = useSelect((select) => select(ISCN_INFO_STORE_NAME).selectISCNInfo());
  const {
    DBNFTClassId,
  } = useSelect((select) => select(ISCN_INFO_STORE_NAME).selectNFTInfo(DBISCNId));
  const {
    fetchISCNRegisterData,
    postArweaveInfoData,
    postISCNInfoData,
  } = useDispatch(ISCN_INFO_STORE_NAME);
  const [title, setTitle] = useState(DBArticleTitle);
  const [authorDescription, setAuthorDescription] = useState(DBAuthorDescription);
  const [description, setDescription] = useState(DBDescription);
  const [author, setAuthor] = useState(DBAuthor);
  const [url, setUrl] = useState(DBArticleURL);
  const [tags, setTags] = useState(DBArticleTags);
  const [ISCNId, setISCNId] = useState(DBISCNId);
  const [NFTClassId, setNFTClassId] = useState(DBNFTClassId);
  const [arweaveId, setArweaveId] = useState(DBArweaveId);
  const [mattersIPFSHash, setMattersIPFSHash] = useState(DBMattersIPFSHash);
  const [mattersPublishedArticleHash, setMattersPublishedArticleHash] = useState(
    DBMattersPublishedArticleHash,
  );
  const [ISCNVersion, setISCNVersion] = useState(DBISCNVersion);
  const [ISCNTimestamp, setISCNTimestamp] = useState(DBISCNTimestamp);
  const [mattersDraftId, setMattersDraftId] = useState(DBMattersDraftId);
  const [mattersArticleId, setMattersArticleId] = useState(DBMattersArticleId);
  const [mattersId, setMattersId] = useState(DBMattersId);
  const [mattersArticleSlug, setMattersArticleSlug] = useState(DBMattersArticleSlug);
  const [fingerprints, setFingerprints] = useState([]);
  const [shouldStartProcess, setShouldStartProcess] = useState(false);
  const [shouldSendISCNRegisterData, setShouldSendISCNRegisterData] = useState(false);
  const [popUpWindow, setPopUpWindow] = useState(null);
  const onArweaveCallback = useCallback(
    (data) => {
      const {
        ipfsHash, arweaveId: newArweaveId,
      } = data;
      setArweaveId(newArweaveId);
      postArweaveInfoData({
        ipfsHash, arweaveId: newArweaveId,
      });
    },
    [postArweaveInfoData],
  );
  const onISCNCallback = useCallback(
    (data) => {
      const {
        tx_hash: txHash, iscnId, iscnVersion, timestamp,
      } = data;
      postISCNInfoData({
        iscnHash: txHash,
        iscnId,
        iscnVersion,
        timestamp,
        license: DBLicense,
      });
    },
    [DBLicense, postISCNInfoData],
  );
  const sendISCNRegisterData = useCallback(async () => {
    popUpWindow.postMessage(JSON.stringify({ action: 'INIT_WIDGET' }), ISCN_WIDGET_ORIGIN);
    const res = await fetchISCNRegisterData();
    const {
      files,
      title: refreshedTitle,
      tags: refreshedTags,
      url: refreshedUrl,
      author: refreshedAuthor,
      authorDescription: refreshedAuthorDescription,
      description: refreshedDescription,
    } = res.data;
    setTitle(refreshedTitle);
    setTags(refreshedTags);
    setUrl(refreshedUrl);
    setAuthor(refreshedAuthor);
    setAuthorDescription(refreshedAuthorDescription);
    setDescription(refreshedDescription);
    const payload = JSON.stringify({
      action: 'SUBMIT_ISCN_DATA',
      data: {
        metadata: {
          fingerprints,
          name: refreshedTitle,
          tags: refreshedTags,
          url: refreshedUrl,
          author: refreshedAuthor,
          authorDescription: refreshedAuthorDescription,
          description: refreshedDescription,
          type: 'article',
          license: DBLicense,
          recordNotes: ISCN_RECORD_NOTE,
          memo: ISCN_RECORD_NOTE,
        },
        files,
      },
    });
    popUpWindow.postMessage(payload, ISCN_WIDGET_ORIGIN);
  }, [DBLicense, fetchISCNRegisterData, fingerprints, popUpWindow]);

  const onPostMessageCallback = useCallback(
    async (event) => {
      if (event && event.data && event.origin === ISCN_WIDGET_ORIGIN && typeof event.data === 'string') {
        try {
          const { action, data } = JSON.parse(event.data);
          if (action === 'ISCN_WIDGET_READY') {
            setShouldSendISCNRegisterData(true);
          } else if (action === 'ARWEAVE_SUBMITTED') {
            onArweaveCallback(data);
          } else if (action === 'ISCN_SUBMITTED') {
            onISCNCallback(data);
          } else {
            console.warn(`Unknown event: ${action}`);
          }
        } catch (err) {
          console.error(err);
        }
      }
    },
    [onArweaveCallback, onISCNCallback],
  );
  const openISCNWidget = useCallback(() => {
    const iscnId = encodeURIComponent(ISCNId || '');
    const redirectString = encodeURIComponent(siteurl);
    const popUpWidget = `${ISCN_WIDGET_ORIGIN}/in/widget/iscn-ar?opener=1&mint=1&redirect_uri=${redirectString}&iscn_id=${iscnId}`;
    try {
      const popUp = window.open(
        popUpWidget,
        'likePayWindow',
        'menubar=no,location=no,width=576,height=768',
      );
      if (!popUp || popUp.closed || typeof popUp.closed == 'undefined') {
        // TODO: show error in UI
        console.error('POPUP_BLOCKED');
        return;
      }
      setPopUpWindow(popUp);
      window.addEventListener('message', onPostMessageCallback, false);
    } catch (error) {
      console.error(error);
    }
  }, [ISCNId, onPostMessageCallback]);
  useEffect(() => {
    setTitle(DBArticleTitle);
    if (DBAuthorDescription) {
      const { length } = DBAuthorDescription.split(' ');
      if (length > 200) {
        const cutDescription = DBAuthorDescription.split(' ')
          .slice(0, 197)
          .join(' ')
          .concat('...')
          .concat(DBAuthorDescription.split(' ')[length - 1]);
        setAuthorDescription(cutDescription);
      } else {
        setAuthorDescription(DBAuthorDescription);
      }
    }
    // default length for excerpt is 55. Hence, no need 197 length guard.
    if (DBDescription) {
      setDescription(DBDescription);
    }
    setAuthor(DBAuthor);
    setUrl(DBArticleURL);
    setTags(DBArticleTags);
    setISCNId(DBISCNId);
    setNFTClassId(DBNFTClassId);
    setISCNVersion(DBISCNVersion);
    setISCNTimestamp(DBISCNTimestamp);
    setMattersDraftId(DBMattersDraftId);
    setMattersArticleId(DBMattersArticleId);
    setMattersId(DBMattersId);
    setMattersArticleSlug(DBMattersArticleSlug);
    setMattersPublishedArticleHash(DBMattersPublishedArticleHash);
    setArweaveId(DBArweaveId);
  }, [
    DBLIKEPayAmount,
    DBMemo,
    DBArticleTitle,
    DBAuthorDescription,
    DBDescription,
    DBAuthor,
    DBArticleURL,
    DBArticleTags,
    DBISCNId,
    DBISCNVersion,
    DBISCNTimestamp,
    DBNFTClassId,
    DBMattersDraftId,
    DBMattersArticleId,
    DBMattersId,
    DBMattersArticleSlug,
    DBMattersPublishedArticleHash,
    DBArweaveId,
  ]);
  useEffect(() => {
    setMattersIPFSHash(DBMattersIPFSHash);
    const fingerprintsArr = [];
    if (DBMattersIPFSHash && DBMattersIPFSHash !== '-') {
      const mattersIPFSHashFingerprint = `ipfs://${DBMattersIPFSHash}`;
      fingerprintsArr.push(mattersIPFSHashFingerprint);
    }
    if (fingerprintsArr.length > 1) {
      setFingerprints(fingerprintsArr);
    }
  }, [DBMattersIPFSHash]);
  useEffect(() => {
    if (shouldStartProcess) {
      openISCNWidget();
      setShouldStartProcess(false);
    }
    if (shouldSendISCNRegisterData) {
      sendISCNRegisterData();
      setShouldSendISCNRegisterData(false);
    }
  }, [
    shouldStartProcess,
    shouldSendISCNRegisterData,
    openISCNWidget,
    sendISCNRegisterData,
  ]);

  async function handleRegisterISCN(e) {
    e.preventDefault();
    setShouldStartProcess(true);
  }

  const onNFTPostMessageCallback = async (event) => {
    if (event && event.data && event.origin === NFT_WIDGET_ORIGIN && typeof event.data === 'string') {
      try {
        const { action, data } = JSON.parse(event.data);
        if (action === 'NFT_MINT_DATA') {
          if (data.classId) setNFTClassId(data.classId);
        } else {
          console.warn(`Unknown event: ${action}`);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  const handleNFTAction = useCallback((e) => {
    e.preventDefault();
    if (!ISCNId) return;
    const redirectString = encodeURIComponent(siteurl);
    const nftUrl = NFTClassId ? `https://${likerlandHost}/nft/class/${encodeURIComponent(
      NFTClassId,
    )}` : `${NFT_WIDGET_ORIGIN}/nft/iscn/${encodeURIComponent(ISCNId)}?opener=1&redirect_uri=${redirectString}`;
    const nftWindow = window.open(nftUrl, '_blank');
    if (nftWindow && !NFTClassId) {
      window.addEventListener('message', onNFTPostMessageCallback, false);
    }
  }, [ISCNId, NFTClassId]);
  return (
    <>
      <LikeCoinPluginSideBar
        handleRegisterISCN={handleRegisterISCN}
        handleNFTAction={handleNFTAction}
        ISCNId={ISCNId}
        arweaveId={arweaveId}
        ISCNVersion={ISCNVersion}
        ISCNTimestamp={ISCNTimestamp}
        NFTClassId={NFTClassId}
        mattersDraftId={mattersDraftId}
        mattersArticleId={mattersArticleId}
        mattersId={mattersId}
        mattersArticleSlug={mattersArticleSlug}
        mattersIPFSHash={mattersIPFSHash}
        mattersPublishedArticleHash={mattersPublishedArticleHash}
        title={title}
        authorDescription={authorDescription}
        description={description}
        author={author}
        tags={tags}
        url={url}
      />
      <LikeCoinPluginDocumentSettingPanel
        handleRegisterISCN={handleRegisterISCN}
        handleNFTAction={handleNFTAction}
        ISCNId={ISCNId}
        arweaveId={arweaveId}
        ISCNVersion={ISCNVersion}
        ISCNTimestamp={ISCNTimestamp}
        NFTClassId={NFTClassId}
        mattersDraftId={mattersDraftId}
        mattersArticleId={mattersArticleId}
        mattersId={mattersId}
        mattersArticleSlug={mattersArticleSlug}
        mattersIPFSHash={mattersIPFSHash}
        mattersPublishedArticleHash={mattersPublishedArticleHash}
      />
      <LikeCoinPluginPostPublishPanel handleRegisterISCN={handleRegisterISCN} />
    </>
  );
}

export default LikeCoinPlugin;
