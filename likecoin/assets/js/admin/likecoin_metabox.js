/* global jQuery, wpApiSettings */

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
  const { matters, ipfs } = res;
  mattersTextField.textContent = matters.status;
  ipfsTextField.textContent = ipfs.status;
}

(() => {
  const refreshBtn = document.getElementById('lcPublishRefreshBtn');
  if (refreshBtn) refreshBtn.addEventListener('click', onRefreshPublishStatus);
})();
