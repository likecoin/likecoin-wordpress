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

async function uploadToArweave(data) {
  try {
    const { tx_hash: txHash, error, success } = data;
    if (error || success === false) return;
    const res = await jQuery.ajax({
      type: 'POST',
      url: `${wpApiSettings.root}likecoin/v1/posts/${wpApiSettings.postId}/arweave/upload`,
      dataType: 'json',
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify({ txHash }), // LIKEpay txHash
      method: 'POST',
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', wpApiSettings.nonce);
      },
    });
    if (!res.data || !res.data.arweaveId) {
      throw new Error('NO_ARWEAVE_ID_RETURNED'); // Could be insufficient fund or other error.
    }
  } catch (error) {
    console.error(`Error occurs when uploading to Arweave: ${error}`);
  }
}

function onSubmitToISCN(e) {
  const {
    title, mattersIPFSHash, arweaveIPFSHash, tags, url, arweaveId,
  } = lcPostInfo;
  const { siteurl } = wpApiSettings;
  try {
    if (!mattersIPFSHash && !arweaveIPFSHash && !arweaveId) {
      throw new Error('NO_IPFS_HASH_NOR_ARWEAVE_ID_FOUND');
    }
    const titleString = encodeURIComponent(title);
    const tagsArray = tags || [];
    const tagsString = tagsArray.join(',');
    const urlString = encodeURIComponent(url);
    const redirectString = encodeURIComponent(siteurl);
    let fingerprint = '';
    if (mattersIPFSHash) {
      const mattersIPFSHashFingerprint = `ipfs://${mattersIPFSHash}`;
      if (fingerprint) {
        fingerprint = fingerprint.concat(`,${mattersIPFSHashFingerprint}`);
      } else {
        fingerprint = mattersIPFSHashFingerprint;
      }
    }
    if (arweaveIPFSHash) {
      const arweaveIPFSHashFingerprint = `ipfs://${arweaveIPFSHash}`;
      if (fingerprint) {
        fingerprint = fingerprint.concat(`,${arweaveIPFSHashFingerprint}`);
      } else {
        fingerprint = arweaveIPFSHashFingerprint;
      }
    }
    if (arweaveId) {
      const arweaveFingerprint = `ar://${arweaveId}`;
      fingerprint = fingerprint.concat(`,${arweaveFingerprint}`);
    }
    const likeCoISCNWidget = `https://like.co/in/widget/iscn?fingerprint=${fingerprint}&publisher=matters&title=${titleString}&tags=${tagsString}&opener=1&url=${urlString}&redirect_uri=${redirectString}`;
    window.open(likeCoISCNWidget, '_blank', 'menubar=no,location=no,width=576,height=768');
    window.addEventListener('message', onISCNCallback, false);
  } catch (error) {
    console.error(`error occured when submitting ISCN: ${error}`);
  }
}

async function onLikePayCallback(event) {
  event.preventDefault();
  if (event.origin !== 'https://like.co') { // For development, skip this line.
    return;
  }
  const { action, data } = JSON.parse(event.data);
  if (action !== 'TX_SUBMITTED') return;
  window.removeEventListener('message', onLikePayCallback, false);
  await uploadToArweave(data);
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
    const {
      ipfsHash, LIKE, memo, arweaveId,
    } = res;
    if (arweaveId && ipfsHash) { // skip LIKE Pay & Arweave upload flow
      return;
    }
    const { siteurl } = wpApiSettings;
    const memoString = encodeURIComponent(memo);
    const redirectString = encodeURIComponent(siteurl);
    const likePayWidget = `https://like.co/in/widget/pay?to=like-arweave&amount=${LIKE}&remarks=${memoString}&opener=1&redirect_uri=${redirectString}`;
    window.open(
      likePayWidget,
      '_blank',
      'menubar=no,location=no,width=576,height=768',
    );
    window.addEventListener(
      'message',
      onLikePayCallback,
      false,
    );
  } catch (error) {
    console.error(`error occured when trying to estimate LIKE cost: ${error}`);
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
