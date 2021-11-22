/* global jQuery, wpApiSettings, lcPostInfo */

async function onRefreshPublishStatus(e) {
  e.preventDefault();
  const mattersTextField = document.querySelector('#lcMattersStatus');
  const ipfsTextField = document.querySelector('#lcIPFSStatus');
  const res = await jQuery.ajax({
    type: 'POST',
    url: `${wpApiSettings.root}likecoin/v1/posts/${wpApiSettings.postId}/publish/refresh`,
    method: 'POST',
    beforeSend: (xhr) => {
      xhr.setRequestHeader('X-WP-Nonce', wpApiSettings.nonce);
    },
  });
  const { matters, ipfs } = res;
  if (matters.url) {
    const { url, status } = matters;
    mattersTextField.innerHTML = `<a rel="noopener" target="_blank" href="${url}">${status}</a>`;
  } else {
    mattersTextField.textContent = matters.status;
  }
  if (ipfs.url) {
    const { url, status } = ipfs;
    ipfsTextField.innerHTML = `<a rel="noopener" target="_blank" href="${url}">${status}</a>`;
  } else {
    ipfsTextField.textContent = ipfs.status;
  }
  if (ipfs.hash) {
    lcPostInfo.ipfsHash = ipfs.hash;
    const ISCNPublishSession = document.getElementById('lcISCNPublish');
    if (ISCNPublishSession) ISCNPublishSession.style.display = '';
  }
}

async function onISCNCallback(event) {
  if (event.origin !== 'https://like.co') {
    return;
  }
  const { action, data } = JSON.parse(event.data);
  if (action !== 'ISCN_SUBMITTED') return;
  const { tx_hash: txHash, error, success } = data;
  if (error || success === false) return;
  const ISCNTextField = document.querySelector('#lcISCNStatus');
  const res = await jQuery.ajax({
    type: 'POST',
    url: `${wpApiSettings.root}likecoin/v1/posts/${wpApiSettings.postId}/publish/iscn`,
    dataType: 'json',
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify({ iscnHash: txHash }),
    method: 'POST',
    beforeSend: (xhr) => {
      xhr.setRequestHeader('X-WP-Nonce', wpApiSettings.nonce);
    },
  });
  const { url, status } = res;
  ISCNTextField.innerHTML = `<a rel="noopener" target="_blank" href="${url}">${status}</a>`;
}

async function onLikePayCallbackAndUploadArweave(event) {
  if (event.origin !== 'https://like.co') { // For development, skip this chunk of code.
    return;
  }
  try {
    const { action, data } = JSON.parse(event.data);
    if (action !== 'TX_FEE_SUBMITTED') return;
    const { tx_hash: txHash, error, success } = data;
    if (error || success === false) return;
    const res = await jQuery.ajax({
      type: 'POST',
      url: `${wpApiSettings.root}likecoin/v1/posts/${wpApiSettings.postId}/arweave/upload`,
      dataType: 'json',
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify({ txHash }),
      method: 'POST',
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', wpApiSettings.nonce);
      },
    });
    if (!res.data) {
      window.alert('Something went wrong when uploading to Arweave. Please re-submit.');
      return;
    }
    if (res.data.arweaveId && res.data.ipfsHash) {
      submitToISCNAfterArweaveUpload(res.data);
    }
  } catch (error) {
    console.error(`Error occurs when uploading to Arweave: ${error.message}`);
  }
}

async function submitToISCNAfterArweaveUpload(arweaveInfo) {
  const { title, tags, url } = lcPostInfo;
  const { arweaveId } = arweaveInfo;
  const { siteurl } = wpApiSettings;
  // ipfsHash is from Wordpress DB. Could be matters-formatted or likecoin-formatted
  const { ipfsHash } = arweaveInfo;
  if (!arweaveId || !ipfsHash) return;
  const titleString = encodeURIComponent(title);
  const tagsArray = tags || [];
  const tagsString = tagsArray.join(',');
  const urlString = encodeURIComponent(url);
  const redirectString = encodeURIComponent(siteurl);
  const likeCoISCNWidget = `https://like.co/in/widget/iscn?fingerprint=${ipfsHash}&publisher=matters&title=${titleString}&tags=${tagsString}&opener=1&url=${urlString}&redirect_uri=${redirectString}`;
  window.open(
    likeCoISCNWidget,
    '_blank',
    'menubar=no,location=no,width=576,height=768',
  );
  window.addEventListener('message', onISCNCallback, false);
}
function onSubmitToISCN(e) {
  e.preventDefault();
  const {
    title,
    ipfsHash,
    tags,
    url,
  } = lcPostInfo;
  const { siteurl } = wpApiSettings;
  if (!ipfsHash) return;
  const titleString = encodeURIComponent(title);
  const tagsArray = tags || [];
  const tagsString = tagsArray.join(',');
  const urlString = encodeURIComponent(url);
  const redirectString = encodeURIComponent(siteurl);
  const likeCoISCNWidget = `https://like.co/in/widget/iscn?fingerprint=${ipfsHash}&publisher=matters&title=${titleString}&tags=${tagsString}&opener=1&url=${urlString}&redirect_uri=${redirectString}`;
  window.open(likeCoISCNWidget, '_blank', 'menubar=no,location=no,width=576,height=768');
  window.addEventListener('message', onISCNCallback, false);
}

async function onEstimateAndUploadArweave(e) {
  e.preventDefault();
  try {
    const res = await jQuery.ajax({
      type: 'POST',
      url: `${wpApiSettings.root}likecoin/v1/posts/${wpApiSettings.postId}/arweave/estimate`,
      method: 'POST',
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', wpApiSettings.nonce);
      },
    });
    const { ipfsHash, LIKE, memo } = res;
    if (LIKE === '0' || LIKE === 0) {
      // exact same files are already exist in Arweave.
      // skip Arweave upload flow to directly register an ISCN
      const { arweaveId } = res;
      const arweaveInfo = {
        ipfsHash,
        arweaveId,
      };
      submitToISCNAfterArweaveUpload(arweaveInfo);
      return;
    }
    const { siteurl } = wpApiSettings;
    const redirectString = encodeURIComponent(siteurl);
    const likePayWidget = `http://localhost:3000/in/widget/pay?to=like-arweave&amount=${LIKE}&remarks=${memo}&opener=1&redirect_uri=${redirectString}`; // TODO: Change to test and mainnet.
    window.open(
      likePayWidget,
      '_blank',
      'menubar=no,location=no,width=576,height=768',
    );
    window.addEventListener(
      'message',
      onLikePayCallbackAndUploadArweave,
      false,
    );
  } catch (error) {
    console.log(`error occured when trying to estimate LIKE cost: ${error}`);
  }
}
(() => {
  const submitISCNHash = window.location.hash;
  const refreshBtn = document.getElementById('lcPublishRefreshBtn');
  const submitISCNBtn = document.getElementById('lcISCNPublishBtn');
  const uploadArweaveBtn = document.getElementById('lcArweaveUploadBtn');
  if (submitISCNHash === '#likecoin_submit_iscn') {
    setTimeout(() => {
      window.scrollTo(0, document.querySelector('#likecoin_submit_iscn').scrollHeight);
    }, 500);
  }
  if (refreshBtn) refreshBtn.addEventListener('click', onRefreshPublishStatus);
  if (submitISCNBtn) submitISCNBtn.addEventListener('click', onSubmitToISCN);
  if (uploadArweaveBtn) uploadArweaveBtn.addEventListener('click', onEstimateAndUploadArweave);
})();
