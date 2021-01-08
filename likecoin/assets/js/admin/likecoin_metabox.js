/* global jQuery, wpApiSettings, lcPostInfo */

async function onRefreshPublishStatus() {
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
  const { matters, ipfs, hash } = res;
  mattersTextField.textContent = matters.status;
  ipfsTextField.textContent = ipfs.status;
  lcPostInfo.ipfsHash = hash;
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

function onSubmitToISCN() {
  const {
    title,
    ipfsHash,
    tags,
  } = lcPostInfo;
  const { siteurl } = wpApiSettings;
  if (!ipfsHash) return;
  const titleString = encodeURIComponent(title);
  const tagString = encodeURIComponent(JSON.stringify(tags.map((t) => encodeURIComponent(t))));
  const redirectString = encodeURIComponent(siteurl);
  const likeCoISCNWidget = `https://like.co/in/widget/iscn/dev?fingerprint=${ipfsHash}&publisher=matters&title=${titleString}&tags=${tagString}&opener=1&redirect_uri=${redirectString}`;
  window.open(likeCoISCNWidget);
  window.addEventListener('message', onISCNCallback, false);
}

(() => {
  const refreshBtn = document.getElementById('lcPublishRefreshBtn');
  const submitISCNBtn = document.getElementById('lcISCNPublishBtn');
  if (refreshBtn) refreshBtn.addEventListener('click', onRefreshPublishStatus);
  if (submitISCNBtn) submitISCNBtn.addEventListener('click', onSubmitToISCN);
})();
