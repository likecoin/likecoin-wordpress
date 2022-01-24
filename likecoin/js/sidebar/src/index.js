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
    DBAuthor,
    DBwordCount,
    DBArticleURL,
    DBArticleTags,
    DBISCNId,
    DBArweaveId,
    DBArweaveIPFSHash,
    DBMattersIPFSHash,
    DBMattersPublishedArticleHash,
    DBISCNVersion,
    DBMattersDraftId,
    DBMattersArticleId,
    DBMattersId,
    DBMattersArticleSlug,
  } = useSelect((select) => select(ISCN_INFO_STORE_NAME).selectISCNInfo());
  const {
    postArweaveEstimateData,
    postArweaveUploadAndIPFSData,
    postISCNInfoData,
  } = useDispatch(ISCN_INFO_STORE_NAME);
  return (
    <LikeCoinPlugin
      DBLIKEPayAmount={DBLIKEPayAmount}
      DBMemo={DBMemo}
      DBArticleTitle={DBArticleTitle}
      DBAuthorDescription={DBAuthorDescription}
      DBAuthor={DBAuthor}
      DBwordCount={DBwordCount}
      DBArticleURL={DBArticleURL}
      DBArticleTags={DBArticleTags}
      DBISCNId={DBISCNId}
      DBArweaveId={DBArweaveId}
      DBArweaveIPFSHash={DBArweaveIPFSHash}
      DBMattersIPFSHash={DBMattersIPFSHash}
      DBMattersPublishedArticleHash={DBMattersPublishedArticleHash}
      DBISCNVersion={DBISCNVersion}
      DBMattersDraftId={DBMattersDraftId}
      DBMattersArticleId={DBMattersArticleId}
      DBMattersId={DBMattersId}
      DBMattersArticleSlug={DBMattersArticleSlug}
      postArweaveEstimateData={postArweaveEstimateData}
      postArweaveUploadAndIPFSData={postArweaveUploadAndIPFSData}
      postISCNInfoData={postISCNInfoData}
    />
  );
}

registerPlugin('likecoin-sidebar', { render: LikeCoinSideBar });
