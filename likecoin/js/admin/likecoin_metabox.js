/* global jQuery, wpApiSettings, lcPostInfo */

async function onRefreshPublishStatus(e) {
  e.preventDefault();
  const mattersTextField = document.querySelector('#lcMattersStatus');
  const arweaveTextField = document.querySelector('#lcArweaveStatus');
  const ipfsTextField = document.querySelector('#lcIPFSStatus');
  const ISCNTextField = document.querySelector('#lcISCNStatus');
  const { iscnHash, arweaveUploadStatus } = lcPostInfo;
  const res = await jQuery.ajax({
    type: 'POST',
    url: `${wpApiSettings.root}likecoin/v1/posts/${wpApiSettings.postId}/publish/refresh`,
    method: 'POST',
    beforeSend: (xhr) => {
      xhr.setRequestHeader('X-WP-Nonce', wpApiSettings.nonce);
    },
  });
  const { matters, ipfs, arweave } = res;
  const wordpressPublished = res.wordpress_published;
  if (arweave.url) {
    const { url, status } = arweave;
    arweaveTextField.innerHTML = `<a rel="noopener" target="_blank" href="${url}">${status}</a>`;
    // allow ISCN submit button to show
    if (!iscnHash) {
      const submitISCNBtn = document.createElement('button');
      submitISCNBtn.innerText = 'Submit to ISCN';
      submitISCNBtn.setAttribute('id', 'lcISCNPublishBtn');
      submitISCNBtn.setAttribute('class', 'button button-primary');
      ISCNTextField.textContent = '';
      ISCNTextField.appendChild(submitISCNBtn);
      submitISCNBtn.addEventListener('click', onSubmitToISCN);
    }
  } else if (wordpressPublished === 'publish' && arweaveUploadStatus !== 'loading') {
    const uploadArweaveBtn = document.createElement('button');
    uploadArweaveBtn.innerText = 'Submit to Arweave';
    uploadArweaveBtn.setAttribute('id', 'lcArweaveUploadBtn');
    uploadArweaveBtn.setAttribute('class', 'button button-primary');
    arweaveTextField.textContent = '';
    arweaveTextField.appendChild(uploadArweaveBtn);
    uploadArweaveBtn.addEventListener('click', onEstimateAndUploadArweave);
  }
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
    lcPostInfo.mattersIPFSHash = ipfs.hash;
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
  lcPostInfo.iscnHash = txHash;
  ISCNTextField.innerHTML = `<a rel="noopener" target="_blank" href="${url}">${status}</a>`;
}

async function uploadToArweave(data) {
  const arweaveTextField = document.querySelector('#lcArweaveStatus');
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
    const { arweaveId, ipfsHash } = res.data;
    lcPostInfo.arweaveIPFSHash = ipfsHash;
    lcPostInfo.arweaveId = arweaveId;
    lcPostInfo.arweaveUploadStatus = 'success';
    arweaveTextField.innerHTML = `<a rel="noopener" target="_blank" href="https://arweave.net/${arweaveId}">Published</a>`;
  } catch (error) {
    console.error(`Error occurs when uploading to Arweave: ${error}`);
    const uploadArweaveBtn = document.createElement('button');
    uploadArweaveBtn.innerText = 'Submit to Arweave';
    uploadArweaveBtn.setAttribute('id', 'lcArweaveUploadBtn');
    uploadArweaveBtn.setAttribute('class', 'button button-primary');
    arweaveTextField.textContent = '';
    arweaveTextField.appendChild(uploadArweaveBtn);
    uploadArweaveBtn.addEventListener('click', onEstimateAndUploadArweave);
    lcPostInfo.arweaveUploadStatus = 'failed';
  }
}

function onSubmitToISCN(e) {
  e.preventDefault();
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
    const fingerprints = [];
    if (mattersIPFSHash) {
      const mattersIPFSHashFingerprint = `ipfs://${mattersIPFSHash}`;
      fingerprints.push(mattersIPFSHashFingerprint);
    }
    if (arweaveIPFSHash) {
      const arweaveIPFSHashFingerprint = `ipfs://${arweaveIPFSHash}`;
      fingerprints.push(arweaveIPFSHashFingerprint);
    }
    if (arweaveId) {
      const arweaveFingerprint = `ar://${arweaveId}`;
      fingerprints.push(arweaveFingerprint);
    }
    const fingerprint = fingerprints.join(',');
    const likeCoISCNWidget = `https://like.co/in/widget/iscn?fingerprint=${fingerprint}&publisher=matters&title=${titleString}&tags=${tagsString}&opener=1&url=${urlString}&redirect_uri=${redirectString}`;
    window.open(likeCoISCNWidget, 'likeCoISCNWindow', 'menubar=no,location=no,width=576,height=768');
    window.addEventListener('message', onISCNCallback, false);
  } catch (error) {
    console.error('error occured when submitting ISCN:');
    console.error(error);
  }
}

async function onLikePayCallback(event) {
  event.preventDefault();
  if (event.origin !== 'https://like.co') { // For development, skip this line.
    return;
  }
  const { action, data } = JSON.parse(event.data);
  if (action !== 'TX_SUBMITTED') return;
  await uploadToArweave(data);
}
async function onEstimateAndUploadArweave(e) {
  e.preventDefault();
  lcPostInfo.arweaveUploadStatus = 'loading';
  const arweaveTextField = document.querySelector('#lcArweaveStatus');
  arweaveTextField.innerHTML = 'loading...';
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
      arweaveTextField.innerHTML = `<a rel="noopener" target="_blank" href="https://arweave.net/${arweaveId}">Published</a>`;
      return;
    }
    const { siteurl } = wpApiSettings;
    const memoString = encodeURIComponent(memo);
    const redirectString = encodeURIComponent(siteurl);
    const likePayWidget = `https://like.co/in/widget/pay?to=like-arweave&amount=${LIKE}&remarks=${memoString}&opener=1&redirect_uri=${redirectString}`;
    window.open(
      likePayWidget,
      'likePayWindow',
      'menubar=no,location=no,width=576,height=768',
    );
    window.addEventListener(
      'message',
      onLikePayCallback,
      false,
    );
  } catch (error) {
    console.error('error occured when trying to estimate LIKE cost: ');
    console.error(error);
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
