/* global jQuery, wpApiSettings, lcPostInfo, lcStringInfo */

const mainTitleField = document.querySelector('#lcTitleStatus');
const ISCNStatusTextField = document.querySelector('#lcISCNStatus');
function createElementWithAttrbutes(el, {
  text, className, id, rel, target, href,
}) {
  const element = document.createElement(el);
  if (text) element.innerText = text;
  if (id) element.setAttribute('id', id);
  if (className) element.setAttribute('class', className);
  if (rel) element.setAttribute('rel', rel);
  if (target) element.setAttribute('target', target);
  if (href) element.setAttribute('href', href);
  return element;
}

const {
  mainStatusLoading,
  mainStatusLIKEPay,
  mainStatusUploadArweave,
  mainStatusRegisterISCN,
  buttonSubmitISCN,
  buttonRegisterISCN,
  draft,
} = lcStringInfo;
const MAIN_STATUS_TEXT_MAP = {
  loading: mainStatusLoading,
  onLIKEPay: mainStatusLIKEPay,
  onUploadArweave: mainStatusUploadArweave,
  onRegisterISCN: mainStatusRegisterISCN,
};

function updateMainTitleField(signalCSSClass, text) {
  mainTitleField.textContent = '';
  const statusDot = createElementWithAttrbutes('h1', {
    text: ' · ',
    className: signalCSSClass,
  });
  const statusText = createElementWithAttrbutes('h3', {
    text,
    className: 'iscn-status-text',
  });
  mainTitleField.appendChild(statusDot);
  mainTitleField.appendChild(statusText);
}

function getStatusText(status) {
  if (MAIN_STATUS_TEXT_MAP[status]) {
    return MAIN_STATUS_TEXT_MAP[status];
  }
  return '-';
}

function updateFieldStatusElement(statusField, status) {
  if (!statusField) return;
  statusField.textContent = ''; // eslint-disable-line no-param-reassign
  statusField.appendChild(status);
}

function updateFieldStatusText(statusField, text) {
  const p = createElementWithAttrbutes('p', {
    text,
  });
  updateFieldStatusElement(statusField, p);
}

async function onRefreshPublishStatus(e) {
  if (e) e.preventDefault();
  const mattersTextField = document.querySelector('#lcMattersStatus');
  const arweaveTextField = document.querySelector('#lcArweaveStatus');
  const ipfsTextField = document.querySelector('#lcIPFSStatus');
  const {
    iscnHash,
    iscnId,
    isMattersPublished,
  } = lcPostInfo;
  const res = await jQuery.ajax({
    type: 'POST',
    url: `${wpApiSettings.root}likecoin/v1/posts/${wpApiSettings.postId}/publish/refresh`,
    method: 'POST',
    beforeSend: (xhr) => {
      xhr.setRequestHeader('X-WP-Nonce', wpApiSettings.nonce);
    },
  });
  const { matters, ipfs, arweave } = res;
  const isWordpressPublished = res.wordpress_published;
  lcPostInfo.isMattersPublished = res.matters.status;
  lcPostInfo.mattersIPFSHash = res.matters.ipfs_hash;
  if (iscnHash && iscnId) { // state done
    const iscnIdString = encodeURIComponent(iscnId);
    updateMainTitleField('iscn-status-green', lcStringInfo.mainTitleDone);
    const ISCNLink = createElementWithAttrbutes('a', {
      text: iscnId,
      rel: 'noopener',
      target: '_blank',
      href: `https://app.like.co/view/${iscnIdString}`,
    });
    updateFieldStatusElement(ISCNStatusTextField, ISCNLink);
  } else if ( // show button
    isWordpressPublished === 'publish'
    && (lcPostInfo.mainStatus === 'initial' || lcPostInfo.mainStatus === 'failed')
  ) {
    updateMainTitleField(
      'iscn-status-orange',
      lcStringInfo.mainTitleIntermediate,
    );
    const arweaveISCNBtn = createElementWithAttrbutes('button', {
      text: arweave.url ? buttonRegisterISCN : buttonSubmitISCN,
      className: 'button button-primary',
      id: 'lcArweaveUploadBtn',
    });
    updateFieldStatusElement(ISCNStatusTextField, arweaveISCNBtn);
    if (arweave.url) {
      arweaveISCNBtn.addEventListener('click', onSubmitToISCN);
    } else {
      arweaveISCNBtn.addEventListener('click', onEstimateAndUploadArweave);
    }
  } else if (isWordpressPublished !== 'publish') { // state draft
    updateMainTitleField('iscn-status-red', lcStringInfo.mainTitleDraft);
    const disabledarweaveISCNBtn = createElementWithAttrbutes('button', {
      text: buttonSubmitISCN,
      className: 'button button-primary',
      id: 'lcArweaveUploadBtn',
    });
    disabledarweaveISCNBtn.disabled = 'disabled';
    const draftDescription = createElementWithAttrbutes('p', {
      text: lcStringInfo.mainTitleDraft,
    });
    const element = document.createElement('div');
    element.appendChild(disabledarweaveISCNBtn);
    element.appendChild(draftDescription);
    updateFieldStatusElement(ISCNStatusTextField, element);
  } else {
    // state intermediate but show status
    updateMainTitleField(
      'iscn-status-orange',
      lcStringInfo.mainTitleIntermediate,
    );
    updateFieldStatusText(ISCNStatusTextField, getStatusText(lcPostInfo.mainStatus));
  }
  if (arweave.url) {
    const { url } = arweave;
    const arweaveId = arweave.arweave_id;
    const arweaveLink = createElementWithAttrbutes('a', {
      text: arweaveId,
      rel: 'noopener',
      target: '_blank',
      href: url,
    });
    updateFieldStatusElement(arweaveTextField, arweaveLink);
  }
  if (ipfs.url) {
    const { url, hash } = ipfs;
    const IPFSLink = createElementWithAttrbutes('a', {
      text: hash,
      rel: 'noopener',
      target: '_blank',
      href: url,
    });
    updateFieldStatusElement(ipfsTextField, IPFSLink);
  }
  if (matters.url) {
    const { url } = matters;
    const articleId = matters.article_id;
    let mattersLink;
    if (isMattersPublished === 'Published') {
      mattersLink = createElementWithAttrbutes('a', {
        text: articleId,
        rel: 'noopener',
        target: '_blank',
        href: url,
      });
    } else if (articleId.length !== 0) {
      mattersLink = createElementWithAttrbutes('a', {
        text: draft,
        rel: 'noopener',
        target: '_blank',
        href: url,
      });
    } else {
      mattersLink = createElementWithAttrbutes('p', {
        text: '-',
      });
    }
    updateFieldStatusElement(mattersTextField, mattersLink);
  }
}

async function onISCNCallback(event) {
  if (event.origin !== 'https://like.co') {
    return;
  }
  lcPostInfo.mainStatus = 'onRegisterISCN';
  try {
    const { action, data } = JSON.parse(event.data);
    if (action !== 'ISCN_SUBMITTED') {
      return;
    }
    const {
      tx_hash: txHash, error, success, iscnId,
    } = data;
    if (error || success === false) {
      throw new Error('REGISTER_ISCN_SERVER_ERROR');
    }
    await jQuery.ajax({
      type: 'POST',
      url: `${wpApiSettings.root}likecoin/v1/posts/${wpApiSettings.postId}/publish/iscn`,
      dataType: 'json',
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify({ iscnHash: txHash, iscnId }),
      method: 'POST',
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', wpApiSettings.nonce);
      },
    });
    lcPostInfo.iscnHash = txHash;
    lcPostInfo.iscnId = iscnId;
    lcPostInfo.mainStatus = 'done';
  } catch (err) {
    console.error(err);
    lcPostInfo.mainStatus = 'failed';
  } finally {
    await onRefreshPublishStatus();
  }
}

async function uploadToArweave(data) {
  try {
    lcPostInfo.mainStatus = 'onUploadArweave';
    updateFieldStatusText(ISCNStatusTextField, getStatusText(lcPostInfo.mainStatus));
    const { tx_hash: txHash, error, success } = data;
    if (error || success === false) {
      lcPostInfo.mainStatus = 'failed';
      return;
    }
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
  } catch (error) {
    console.error('Error occurs when uploading to Arweave:');
    console.error(error);
    lcPostInfo.mainStatus = 'failed';
    await onRefreshPublishStatus();
  }
}

function onSubmitToISCN(e) {
  if (e) e.preventDefault();
  const {
    title, mattersIPFSHash, arweaveIPFSHash, tags, url, arweaveId,
  } = lcPostInfo;
  const { siteurl } = wpApiSettings;
  lcPostInfo.mainStatus = 'onRegisterISCN';
  updateFieldStatusText(ISCNStatusTextField, getStatusText(lcPostInfo.mainStatus));
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
    let publisher = '';
    if (mattersIPFSHash) {
      const mattersIPFSHashFingerprint = `ipfs://${mattersIPFSHash}`;
      fingerprints.push(mattersIPFSHashFingerprint);
      publisher = 'matters';
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
    const likeCoISCNWidget = `https://like.co/in/widget/iscn?fingerprint=${fingerprint}&publisher=${publisher}&title=${titleString}&tags=${tagsString}&opener=1&blocking=1&url=${urlString}&redirect_uri=${redirectString}`;
    window.open(
      likeCoISCNWidget,
      'likeCoISCNWindow',
      'menubar=no,location=no,width=576,height=768',
    );
    window.addEventListener('message', onISCNCallback, false);
  } catch (error) {
    console.error('error occured when submitting ISCN:');
    console.error(error);
    lcPostInfo.mainStatus = 'failed';
  }
}

async function onLikePayCallback(event) {
  event.preventDefault();
  if (event.origin !== 'https://like.co') { // For development, skip this line.
    return;
  }
  try {
    const { action, data } = JSON.parse(event.data);
    if (action !== 'TX_SUBMITTED') {
      return;
    }
    lcPostInfo.mainStatus = 'onUploadArweave';
    await uploadToArweave(data);
    await Promise.all([
      onRefreshPublishStatus().catch((e) => console.error(e)),
      onSubmitToISCN(),
    ]);
  } catch (error) {
    console.error(error);
    lcPostInfo.mainStatus = 'failed';
  }
}

async function onEstimateAndUploadArweave(e) {
  e.preventDefault();
  lcPostInfo.mainStatus = 'loading';
  updateFieldStatusText(ISCNStatusTextField, getStatusText(lcPostInfo.mainStatus));
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
    if (ipfsHash && arweaveId) { // same content existed in Arweave net
      lcPostInfo.arweaveIPFSHash = ipfsHash;
      lcPostInfo.arweaveId = arweaveId;
      lcPostInfo.mainStatus = 'onRegisterISCN';
      updateFieldStatusText(ISCNStatusTextField, getStatusText(lcPostInfo.mainStatus));
      const data = {
        arweaveIPFSHash: ipfsHash,
        arweaveId,
      };
      // save to Wordpress DB
      const response = await jQuery.ajax({
        type: 'POST',
        url: `${wpApiSettings.root}likecoin/v1/posts/${wpApiSettings.postId}/arweave/save-metadata`,
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(data),
        method: 'POST',
        beforeSend: (xhr) => {
          xhr.setRequestHeader('X-WP-Nonce', wpApiSettings.nonce);
        },
      });
      if (!response.data) {
        throw new Error('SERVER_ERROR');
      }
      await onSubmitToISCN();
      return;
    }
    if (!LIKE && !memo) {
      throw new Error('CANNOT_GET_LIKE_ESTIMATE');
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
    lcPostInfo.mainStatus = 'onLIKEPay';
    updateFieldStatusText(ISCNStatusTextField, getStatusText(lcPostInfo.mainStatus));
  } catch (error) {
    console.error('error occured when trying to estimate LIKE cost: ');
    console.error(error);
    lcPostInfo.mainStatus = 'failed';
  }
}
(() => {
  const refreshBtn = document.getElementById('lcPublishRefreshBtn');
  if (refreshBtn) refreshBtn.addEventListener('click', onRefreshPublishStatus);
  onRefreshPublishStatus();
})();
