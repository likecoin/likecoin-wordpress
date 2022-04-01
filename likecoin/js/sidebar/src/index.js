import './style.css';
import { useSelect, useDispatch } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';
import { ISCN_INFO_STORE_NAME } from './store/iscn-info-store';
import LikeCoinPlugin from './pages/LikeCoinPlugin';

function LikeCoinSideBar() {
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
    DBArweaveIPFSHash,
    DBMattersIPFSHash,
    DBMattersPublishedArticleHash,
    DBISCNVersion,
    DBISCNTimestamp,
    DBMattersDraftId,
    DBMattersArticleId,
    DBMattersId,
    DBMattersArticleSlug,
  } = useSelect((select) => select(ISCN_INFO_STORE_NAME).selectISCNInfo());
  const {
    fetchISCNRegisterData,
    postArweaveInfoData,
    postISCNInfoData,
  } = useDispatch(ISCN_INFO_STORE_NAME);
  return (
    <LikeCoinPlugin
      DBLIKEPayAmount={DBLIKEPayAmount}
      DBMemo={DBMemo}
      DBArticleTitle={DBArticleTitle}
      DBAuthorDescription={DBAuthorDescription}
      DBDescription={DBDescription}
      DBAuthor={DBAuthor}
      DBArticleURL={DBArticleURL}
      DBArticleTags={DBArticleTags}
      DBISCNId={DBISCNId}
      DBArweaveId={DBArweaveId}
      DBArweaveIPFSHash={DBArweaveIPFSHash}
      DBMattersIPFSHash={DBMattersIPFSHash}
      DBMattersPublishedArticleHash={DBMattersPublishedArticleHash}
      DBISCNVersion={DBISCNVersion}
      DBISCNTimestamp={DBISCNTimestamp}
      DBMattersDraftId={DBMattersDraftId}
      DBMattersArticleId={DBMattersArticleId}
      DBMattersId={DBMattersId}
      DBMattersArticleSlug={DBMattersArticleSlug}
      fetchISCNRegisterData={fetchISCNRegisterData}
      postArweaveInfoData={postArweaveInfoData}
      postISCNInfoData={postISCNInfoData}
    />
  );
}

registerPlugin('likecoin-sidebar', { render: LikeCoinSideBar });
