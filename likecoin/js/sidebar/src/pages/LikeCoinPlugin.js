import { useState, useEffect, useCallback } from 'react';
import { useSelect } from '@wordpress/data';
import LikeCoinPluginDocumentSettingPanel from './LikeCoinPluginDocumentSettingPanel';
import LikeCoinPluginSideBar from './LikeCoinPluginSideBar';
import { ISCN_INFO_STORE_NAME } from '../store/iscn-info-store';

const { likerlandHost } = window.likecoinApiSettings;

function LikeCoinPlugin() {
  const {
    DBArticleTitle,
    DBAuthorDescription,
    DBDescription,
    DBAuthor,
    DBArticleURL,
    DBArticleTags,
    DBISCNId,
    DBArweaveId,
    DBISCNVersion,
    DBISCNTimestamp,
  } = useSelect((select) => select(ISCN_INFO_STORE_NAME).selectISCNInfo());
  const {
    DBNFTClassId,
  } = useSelect((select) => select(ISCN_INFO_STORE_NAME).selectNFTInfo(DBISCNId));
  const [title, setTitle] = useState(DBArticleTitle);
  const [authorDescription, setAuthorDescription] = useState(DBAuthorDescription);
  const [description, setDescription] = useState(DBDescription);
  const [author, setAuthor] = useState(DBAuthor);
  const [url, setUrl] = useState(DBArticleURL);
  const [tags, setTags] = useState(DBArticleTags);
  const [ISCNId, setISCNId] = useState(DBISCNId);
  const [NFTClassId, setNFTClassId] = useState(DBNFTClassId);
  const [arweaveId, setArweaveId] = useState(DBArweaveId);
  const [ISCNVersion, setISCNVersion] = useState(DBISCNVersion);
  const [ISCNTimestamp, setISCNTimestamp] = useState(DBISCNTimestamp);

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
    setArweaveId(DBArweaveId);
  }, [
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
    DBArweaveId,
  ]);

  const handleNFTAction = useCallback((e) => {
    e.preventDefault();
    if (!ISCNId) return;
    if (!NFTClassId) return;
    const nftUrl = `https://${likerlandHost}/nft/class/${encodeURIComponent(
      NFTClassId,
    )}`;
    window.open(nftUrl, '_blank');
  }, [ISCNId, NFTClassId]);
  return (
    <>
      <LikeCoinPluginSideBar
        handleNFTAction={handleNFTAction}
        ISCNId={ISCNId}
        arweaveId={arweaveId}
        ISCNVersion={ISCNVersion}
        ISCNTimestamp={ISCNTimestamp}
        NFTClassId={NFTClassId}
        title={title}
        authorDescription={authorDescription}
        description={description}
        author={author}
        tags={tags}
        url={url}
      />
      <LikeCoinPluginDocumentSettingPanel
        handleNFTAction={handleNFTAction}
        ISCNId={ISCNId}
        arweaveId={arweaveId}
        ISCNVersion={ISCNVersion}
        ISCNTimestamp={ISCNTimestamp}
        NFTClassId={NFTClassId}
      />
    </>
  );
}

export default LikeCoinPlugin;
