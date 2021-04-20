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

function onSubmitToISCN(e) {
  e.preventDefault();
  const {
    title,
    ipfsHash,
    tags,
  } = lcPostInfo;
  const { siteurl } = wpApiSettings;
  if (!ipfsHash) return;
  const titleString = encodeURIComponent(title);
  let tagsInput = tags || []; // tags is now string.
  tagsInput = tagsInput.substring(1,tagsInput.length-1); // omit []
  let tagsArray = tagsInput.split(','); // string to array.
  tagsArray = tagsArray.map((tag)=>tag.substring(1,tag.length-1)); // omit "".
  const tagEncoded = tagsArray.map((tag)=>encodeURIComponent(tag)); // encode each array item.
  const tagsCombined = tagEncoded.join(); // to string again.
  const tagsString = encodeURIComponent(tagsCombined).replace(/\-/g, '%2D')
  .replace(/\_/g, '%5F')
  .replace(/\./g, '%2E')
  .replace(/\!/g, '%21')
  .replace(/\"/g, '%22')
  .replace(/\~/g, '%7E')
  .replace(/\*/g, '%2A')
  .replace(/\'/g, '%27')
  .replace(/\(/g, '%28')
  .replace(/\)/g, '%29');

  const redirectString = encodeURIComponent(siteurl);
  const likeCoISCNWidget = `https://like.co/in/widget/iscn/dev?fingerprint=${ipfsHash}&publisher=matters&title=${titleString}&tags=${tagsString}&opener=1&redirect_uri=${redirectString}`;
  window.open(likeCoISCNWidget, '_blank', 'menubar=no,location=no,width=576,height=768');
  window.addEventListener('message', onISCNCallback, false);
}

(() => {
  const refreshBtn = document.getElementById('lcPublishRefreshBtn');
  const submitISCNBtn = document.getElementById('lcISCNPublishBtn');
  if (refreshBtn) refreshBtn.addEventListener('click', onRefreshPublishStatus);
  if (submitISCNBtn) submitISCNBtn.addEventListener('click', onSubmitToISCN);
})();
