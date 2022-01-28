import BigNumber from 'bignumber.js';
import '../style.css';
import { useState, useEffect, useCallback } from 'react';
import LikeCoinPluginPrePublishPanel from './LikeCoinPluginPrePublishPanel';
import LikeCoinPluginDocumentSettingPanel from './LikeCoinPluginDocumentSettingPanel';
import LikeCoinPluginSideBar from './LikeCoinPluginSideBar';
import LikeCoinPluginPostPublishPanel from './LikeCoinPluginPostPublishPanel';

const { siteurl } = window.wpApiSettings;

function LikeCoinPlugin(props) {
  const [LIKE, setLIKE] = useState(props.DBLIKEPayAmount);
  const [memo, setMemo] = useState(props.DBMemo);
  const [title, setTitle] = useState(props.DBArticleTitle);
  const [authorDescription, setAuthorDescription] = useState(props.DBAuthorDescription);
  const [description, setDescription] = useState(props.DBDescription);
  const [author, setAuthor] = useState(props.DBAuthor);
  const [url, setUrl] = useState(props.DBArticleURL);
  const [tags, setTags] = useState(props.DBArticleTags);
  const [ISCNId, setISCNId] = useState(props.DBISCNId);
  const [arweaveId, setArweaveId] = useState(props.DBArweaveId);
  const [arweaveIPFSHash, setArweaveIPFSHash] = useState(
    props.DBArweaveIPFSHash,
  );
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
  const [shouldUploadArweave, setShouldUploadArweave] = useState(false);
  const [shouldStartLIKEPay, setShouldStartLIKEPay] = useState(false);
  const [shouldSendISCNReadyMessage, setShouldSendISCNReadyMessage] = useState(false);
  const [shouldSkipArweave, setShouldSkipArweave] = useState(false);
  const [popUpWindow, setPopUpWindow] = useState(null);
  const uploadToArweave = useCallback(
    async (data) => {
      try {
        const { tx_hash: txHash } = data;
        props.postArweaveUploadAndIPFSData({ txHash });
      } catch (error) {
        console.error('Error occurs when uploading to Arweave:');
        console.error(error);
      }
    },
    [props],
  );
  const onLIKEPayCallback = useCallback(
    async (event) => {
      if (event && event.data && event.origin === 'https://like.co' && typeof event.data === 'string') {
        const { action, data } = JSON.parse(event.data);
        if (action === 'TX_SUBMITTED') {
          try {
            await uploadToArweave(data);
          } catch (error) {
            console.error(error);
          }
        }
      }
    },
    [uploadToArweave],
  );
  const onISCNCallback = useCallback(
    async (event) => {
      if (event && event.data && event.origin === 'https://like.co' && typeof event.data === 'string') {
        const { action, data } = JSON.parse(event.data);
        const {
          tx_hash: txHash, iscnId, iscnVersion, timestamp,
        } = data;
        if (action === 'ISCN_SUBMITTED') {
          props.postISCNInfoData({
            iscnHash: txHash,
            iscnId,
            iscnVersion,
            timestamp,
          });
        }
      }
    },
    [props],
  );
  const openLIKEPayWidget = useCallback(() => {
    try {
      if (!memo) throw Error('NO_MEMO');
      if (!siteurl) throw Error('NO_SITE_URL');
      if (!title) throw Error('NO_TITLE');
      const memoString = encodeURIComponent(memo);
      const redirectString = encodeURIComponent(siteurl);
      const titleString = encodeURIComponent(title);
      const popUpWidget = `https://like.co/in/widget/iscn-ar?to=like-arweave&amount=${LIKE}&remarks=${memoString}&opener=1&redirect_uri=${redirectString}&title=${titleString}`;
      setPopUpWindow(
        window.open(
          popUpWidget,
          'likePayWindow',
          'menubar=no,location=no,width=576,height=768',
        ),
      );
      window.addEventListener(
        'message',
        (event) => onLIKEPayCallback(event),
        false,
      );
    } catch (error) {
      console.error(error);
    }
  }, [memo, title, LIKE, onLIKEPayCallback]);
  const openISCNWidget = useCallback(() => {
    try {
      const tagsArray = tags || [];
      const tagsString = tagsArray.join(',');
      if (!url) throw Error('NO_URL');
      if (!title) throw Error('NO_TITLE');
      if (!fingerprints) throw Error('NO_FINGERPRINTS');
      if (url && memo && title && fingerprints.length > 0) {
        const urlString = encodeURIComponent(url);
        const redirectString = encodeURIComponent(siteurl);
        const titleString = encodeURIComponent(title);
        const fingerprint = fingerprints.join(',');
        const authorString = encodeURIComponent(author);
        const authorDescriptionString = encodeURIComponent(authorDescription);
        const descriptionString = encodeURIComponent(description);
        const popUpWidget = `https://like.co/in/widget/iscn-ar?fingerprint=${fingerprint}&author=${authorString}&author_description=${authorDescriptionString}&description=${descriptionString}&publisher=&title=${titleString}&tags=${tagsString}&url=${urlString}&to=like-arweave&amount=0&opener=1&redirect_uri=${redirectString}`;
        setPopUpWindow(
          window.open(
            popUpWidget,
            'likePayWindow',
            'menubar=no,location=no,width=576,height=768',
          ),
        );
        window.addEventListener('message', onISCNCallback, false);
      }
    } catch (error) {
      console.error(error);
    }
  }, [memo, title, fingerprints, tags, url, author,
    authorDescription, description, onISCNCallback]);
  const sendISCNReadyMessage = useCallback(() => {
    const startRegisterISCNMessage = JSON.stringify({
      action: 'REGISTER_ISCN',
      data: {
        fingerprints,
        title,
        tags,
        url,
        type: 'article',
        license: '',
        author,
        authorDescription,
        description,
      },
    });
    popUpWindow.postMessage(startRegisterISCNMessage, 'https://like.co');
    window.addEventListener('message', onISCNCallback, false);
  }, [fingerprints, title, tags, url, author, authorDescription, description,
    onISCNCallback, popUpWindow]);

  useEffect(() => {
    setLIKE(props.DBLIKEPayAmount);
    setMemo(props.DBMemo);
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
  ]);
  useEffect(() => {
    setArweaveId(props.DBArweaveId);
    setArweaveIPFSHash(props.DBArweaveIPFSHash);
    setMattersIPFSHash(props.DBMattersIPFSHash);
    const fingerprintsArr = [];
    if (props.DBArweaveId && props.DBArweaveId !== '-') {
      const arweaveFingerprint = `ar://${props.DBArweaveId}`;
      fingerprintsArr.push(arweaveFingerprint);
    }
    if (props.DBArweaveIPFSHash && props.DBArweaveIPFSHash !== '-') {
      const arweaveIPFSHashFingerprint = `ipfs://${props.DBArweaveIPFSHash}`;
      fingerprintsArr.push(arweaveIPFSHashFingerprint);
    }
    if (props.DBMattersIPFSHash && props.DBMattersIPFSHash !== '-') {
      const mattersIPFSHashFingerprint = `ipfs://${props.DBMattersIPFSHash}`;
      fingerprintsArr.push(mattersIPFSHashFingerprint);
    }
    if (fingerprintsArr.length > 1) {
      setFingerprints(fingerprintsArr);
    }
  }, [props.DBArweaveId, props.DBArweaveIPFSHash, props.DBMattersIPFSHash]);
  useEffect(() => {
    setShouldStartLIKEPay(shouldStartProcess && LIKE.gt(0));
    setShouldSkipArweave(
      shouldStartProcess
        && LIKE.eq(0)
        && arweaveId
        && arweaveId.length > 1,
    );
    setShouldSendISCNReadyMessage(
      shouldUploadArweave
        && arweaveId
        && arweaveId.length > 1
        && !shouldSkipArweave,
    );

    if (shouldStartProcess && shouldStartLIKEPay && !shouldSkipArweave) {
      openLIKEPayWidget();
      setShouldStartProcess(false);
      setShouldStartLIKEPay(false);
      // intermediate step such as setShouldUploadArweave state
      // need to be defined inside if statement rather than defining above
      // otherwise, it will cause infinite loop
      setShouldUploadArweave(true);
    } else if (shouldStartProcess && shouldSkipArweave) {
      openISCNWidget();
      setShouldStartProcess(false);
      setShouldSkipArweave(false);
    }
    if (shouldSendISCNReadyMessage) {
      sendISCNReadyMessage();
      setShouldUploadArweave(false);
      setShouldSendISCNReadyMessage(false);
    }
  }, [
    LIKE,
    arweaveIPFSHash,
    arweaveId,
    fingerprints,
    memo,
    tags,
    title,
    url,
    popUpWindow,
    props,
    shouldStartProcess,
    shouldUploadArweave,
    shouldStartLIKEPay,
    shouldSkipArweave,
    shouldSendISCNReadyMessage,
    onISCNCallback,
    onLIKEPayCallback,
    openLIKEPayWidget,
    openISCNWidget,
    sendISCNReadyMessage,
  ]);

  async function handleRegisterISCN(e) {
    e.preventDefault();
    setShouldStartProcess(true);
    setLIKE(BigNumber('-1.0'));
    await props.postArweaveEstimateData();
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
