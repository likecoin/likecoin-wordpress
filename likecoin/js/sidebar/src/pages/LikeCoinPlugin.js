import '../style.css';
import { useState, useEffect, useCallback } from 'react';
import LikeCoinPluginPrePublishPanel from './LikeCoinPluginPrePublishPanel';
import LikeCoinPluginDocumentSettingPanel from './LikeCoinPluginDocumentSettingPanel';
import LikeCoinPluginSideBar from './LikeCoinPluginSideBar';
import LikeCoinPluginPostPublishPanel from './LikeCoinPluginPostPublishPanel';

const { siteurl } = window.wpApiSettings;

const ISCN_WIDGET_ORIGIN = 'https://like.co';

function LikeCoinPlugin(props) {
  const [title, setTitle] = useState(props.DBArticleTitle);
  const [authorDescription, setAuthorDescription] = useState(props.DBAuthorDescription);
  const [description, setDescription] = useState(props.DBDescription);
  const [author, setAuthor] = useState(props.DBAuthor);
  const [url, setUrl] = useState(props.DBArticleURL);
  const [tags, setTags] = useState(props.DBArticleTags);
  const [ISCNId, setISCNId] = useState(props.DBISCNId);
  const [arweaveId, setArweaveId] = useState(props.DBArweaveId);
  const [mattersIPFSHash, setMattersIPFSHash] = useState(props.DBMattersIPFSHash);
  const [mattersPublishedArticleHash, setMattersPublishedArticleHash] = useState(
    props.DBMattersPublishedArticleHash,
  );
  const [ISCNVersion, setISCNVersion] = useState(props.DBISCNVersion);
  const [mattersDraftId, setMattersDraftId] = useState(props.DBMattersDraftId);
  const [mattersArticleId, setMattersArticleId] = useState(props.DBMattersArticleId);
  const [mattersId, setMattersId] = useState(props.DBMattersId);
  const [mattersArticleSlug, setMattersArticleSlug] = useState(props.DBMattersArticleSlug);
  const [fingerprints, setFingerprints] = useState([]);
  const [shouldStartProcess, setShouldStartProcess] = useState(false);
  const [shouldSendISCNRegisterData, setShouldSendISCNRegisterData] = useState(false);
  const [popUpWindow, setPopUpWindow] = useState(null);
  const onArweaveCallback = useCallback(
    (data) => {
      const {
        ipfsHash, arweaveId: newArweaveId,
      } = data;
      props.postArweaveInfoData({
        ipfsHash, arweaveId: newArweaveId,
      });
    },
    [props],
  );
  const onISCNCallback = useCallback(
    (data) => {
      const {
        tx_hash: txHash, iscnId, iscnVersion, timestamp,
      } = data;
      props.postISCNInfoData({
        iscnHash: txHash,
        iscnId,
        iscnVersion,
        timestamp,
      });
    },
    [props],
  );
  const sendISCNRegisterData = useCallback(async () => {
    popUpWindow.postMessage(JSON.stringify({ action: 'INIT_WIDGET' }), ISCN_WIDGET_ORIGIN);
    const res = await props.fetchISCNRegisterData();
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
          license: '',
        },
        files,
      },
    });
    popUpWindow.postMessage(payload, ISCN_WIDGET_ORIGIN);
  }, [props, fingerprints, popUpWindow]);

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
            console.log(`Unknown event: ${action}`);
          }
        } catch (err) {
          console.error(err);
        }
      }
    },
    [onArweaveCallback, onISCNCallback],
  );
  const openISCNWidget = useCallback(() => {
    const redirectString = encodeURIComponent(siteurl);
    const popUpWidget = `${ISCN_WIDGET_ORIGIN}/in/widget/iscn-ar?opener=1&redirect_uri=${redirectString}`;
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
  }, [onPostMessageCallback]);
  useEffect(() => {
    setTitle(props.DBArticleTitle);
    if (props.DBAuthorDescription) {
      const { length } = props.DBAuthorDescription.split(' ');
      if (length > 200) {
        const cutDescription = props.DBAuthorDescription.split(' ')
          .slice(0, 197)
          .join(' ')
          .concat('...')
          .concat(props.DBAuthorDescription.split(' ')[length - 1]);
        setAuthorDescription(cutDescription);
      } else {
        setAuthorDescription(props.DBAuthorDescription);
      }
    }
    // default length for excerpt is 55. Hence, no need 197 length guard.
    if (props.DBDescription) {
      setDescription(props.DBDescription);
    }
    setAuthor(props.DBAuthor);
    setUrl(props.DBArticleURL);
    setTags(props.DBArticleTags);
    setISCNId(props.DBISCNId);
    setISCNVersion(props.DBISCNVersion);
    setMattersDraftId(props.DBMattersDraftId);
    setMattersArticleId(props.DBMattersArticleId);
    setMattersId(props.DBMattersId);
    setMattersArticleSlug(props.DBMattersArticleSlug);
    setMattersPublishedArticleHash(props.DBMattersPublishedArticleHash);
    setArweaveId(props.DBArweaveId);
  }, [
    props.DBLIKEPayAmount,
    props.DBMemo,
    props.DBArticleTitle,
    props.DBAuthorDescription,
    props.DBDescription,
    props.DBAuthor,
    props.DBArticleURL,
    props.DBArticleTags,
    props.DBISCNId,
    props.DBISCNVersion,
    props.DBMattersDraftId,
    props.DBMattersArticleId,
    props.DBMattersId,
    props.DBMattersArticleSlug,
    props.DBMattersPublishedArticleHash,
    props.DBArweaveId,
  ]);
  useEffect(() => {
    setMattersIPFSHash(props.DBMattersIPFSHash);
    const fingerprintsArr = [];
    if (props.DBMattersIPFSHash && props.DBMattersIPFSHash !== '-') {
      const mattersIPFSHashFingerprint = `ipfs://${props.DBMattersIPFSHash}`;
      fingerprintsArr.push(mattersIPFSHashFingerprint);
    }
    if (fingerprintsArr.length > 1) {
      setFingerprints(fingerprintsArr);
    }
  }, [props.DBMattersIPFSHash]);
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
  return (
    <>
      <LikeCoinPluginSideBar
        handleRegisterISCN={handleRegisterISCN}
        ISCNId={ISCNId}
        arweaveId={arweaveId}
        ISCNVersion={ISCNVersion}
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
      <LikeCoinPluginPrePublishPanel />
      <LikeCoinPluginDocumentSettingPanel
        handleRegisterISCN={handleRegisterISCN}
        ISCNId={ISCNId}
        arweaveId={arweaveId}
        ISCNVersion={ISCNVersion}
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