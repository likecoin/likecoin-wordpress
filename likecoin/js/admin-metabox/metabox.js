/* global jQuery, likecoinApiSettings, lcPostInfo, lcStringInfo */

const ISCN_RECORD_NOTE = 'LikeCoin WordPress Plugin';

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
  mainStatusFailedPopUp,
  mainStatusLIKEPay,
  mainStatusUploadArweave,
  mainStatusRegisterISCN,
  buttonSubmitISCN,
  buttonRegisterISCN,
  buttonUpdateISCN,
  draft,
} = lcStringInfo;
const MAIN_STATUS_TEXT_MAP = {
  loading: mainStatusLoading,
  failedPopup: mainStatusFailedPopUp,
  onLIKEPay: mainStatusLIKEPay,
  onUploadArweave: mainStatusUploadArweave,
  onRegisterISCN: mainStatusRegisterISCN,
};

const ISCN_WIDGET_ORIGIN = `https://app.${window.likecoinApiSettings.likecoHost}`;

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
    lastModifiedTime,
    iscnTimestamp,
  } = lcPostInfo;
  const res = await jQuery.ajax({
    type: 'POST',
    url: `${likecoinApiSettings.root}likecoin/v1/posts/${likecoinApiSettings.postId}/iscn/refresh`,
    method: 'POST',
    beforeSend: (xhr) => {
      xhr.setRequestHeader('X-WP-Nonce', likecoinApiSettings.nonce);
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
      href: `https://app.${window.likecoinApiSettings.likecoHost}/view/${iscnIdString}`,
    });
    updateFieldStatusElement(ISCNStatusTextField, ISCNLink);
  }
  if ( // show button
    isWordpressPublished === 'publish'
    && (lcPostInfo.mainStatus === 'initial' || lcPostInfo.mainStatus.includes('failed'))
    && (!iscnId || lastModifiedTime > iscnTimestamp)
  ) {
    updateMainTitleField(
      'iscn-status-orange',
      lcStringInfo.mainTitleIntermediate,
    );
    let text = arweave.url ? buttonRegisterISCN : buttonSubmitISCN;
    if (iscnId) text = buttonUpdateISCN;
    const arweaveISCNBtn = createElementWithAttrbutes('button', {
      text,
      className: 'button button-primary',
      id: 'lcArweaveUploadBtn',
    });
    updateFieldStatusElement(ISCNStatusTextField, arweaveISCNBtn);
    arweaveISCNBtn.addEventListener('click', onSubmitToISCN);
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

async function onPostMessage(event) {
  if (event.origin !== ISCN_WIDGET_ORIGIN) {
    return;
  }
  try {
    const { action, data } = JSON.parse(event.data);
    if (action === 'ISCN_WIDGET_READY') {
      onISCNWidgetReady();
    } else if (action === 'ARWEAVE_SUBMITTED') {
      onArweaveIdCallback(data);
    } else if (action === 'ISCN_SUBMITTED') {
      onISCNCallback(data);
    } else {
      console.warn(`Unknown event: ${action}`);
    }
  } catch (err) {
    console.error(err);
  }
}

async function onArweaveIdCallback(data) {
  const {
    ipfsHash, arweaveId,
  } = data;
  if (ipfsHash && arweaveId) {
    lcPostInfo.arweaveIPFSHash = ipfsHash;
    lcPostInfo.arweaveId = arweaveId;
    updateFieldStatusText(ISCNStatusTextField, getStatusText(lcPostInfo.mainStatus));
    const payload = {
      arweaveIPFSHash: ipfsHash,
      arweaveId,
    };
    // save to Wordpress DB
    try {
      await jQuery.ajax({
        type: 'POST',
        url: `${likecoinApiSettings.root}likecoin/v1/posts/${likecoinApiSettings.postId}/iscn/arweave`,
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(payload),
        method: 'POST',
        beforeSend: (xhr) => {
          xhr.setRequestHeader('X-WP-Nonce', likecoinApiSettings.nonce);
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      await onRefreshPublishStatus();
    }
  }
}

async function onISCNCallback(data) {
  lcPostInfo.mainStatus = 'onRegisterISCN';
  try {
    const {
      tx_hash: txHash, error, success, iscnId,
    } = data;
    if (error || success === false) {
      throw new Error('REGISTER_ISCN_SERVER_ERROR');
    }
    await jQuery.ajax({
      type: 'POST',
      url: `${likecoinApiSettings.root}likecoin/v1/posts/${likecoinApiSettings.postId}/iscn/metadata`,
      dataType: 'json',
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify({ iscnHash: txHash, iscnId }),
      method: 'POST',
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', likecoinApiSettings.nonce);
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

async function onSubmitToISCN(e) {
  if (e) e.preventDefault();
  const { siteurl } = likecoinApiSettings;
  const { url } = lcPostInfo;
  lcPostInfo.mainStatus = 'onRegisterISCN';
  updateFieldStatusText(ISCNStatusTextField, getStatusText(lcPostInfo.mainStatus));
  const redirectString = encodeURIComponent(siteurl);
  const iscnId = encodeURIComponent(lcPostInfo.iscnId || '');
  const urlString = encodeURIComponent(url);
  const iscnWidgetURL = `${ISCN_WIDGET_ORIGIN}/nft/url?opener=1&platform=wordpress&redirect_uri=${redirectString}&url=${urlString}&iscn_id=${iscnId}&update=${iscnId ? 1 : 0}`;
  const ISCNWindow = window.open(
    iscnWidgetURL,
    'likeCoISCNWindow',
    'menubar=no,location=no,width=576,height=768',
  );
  if (!ISCNWindow || ISCNWindow.closed || typeof ISCNWindow.closed == 'undefined') {
    lcPostInfo.mainStatus = 'failedPopup';
    updateFieldStatusText(ISCNStatusTextField, getStatusText(lcPostInfo.mainStatus));
    return;
  }
  lcPostInfo.ISCNWindow = ISCNWindow;
  lcPostInfo.mainStatus = 'initial';
  window.addEventListener('message', onPostMessage, false);
}

async function onISCNWidgetReady() {
  const { ISCNWindow } = lcPostInfo;
  if (!ISCNWindow) throw new Error('POPUP_WINDOW_NOT_FOUND');
  ISCNWindow.postMessage(JSON.stringify({ action: 'INIT_WIDGET' }), ISCN_WIDGET_ORIGIN);
  try {
    const res = await jQuery.ajax({
      type: 'GET',
      url: `${likecoinApiSettings.root}likecoin/v1/posts/${likecoinApiSettings.postId}/iscn/arweave/upload`,
      dataType: 'json',
      method: 'GET',
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', likecoinApiSettings.nonce);
      },
    });
    const {
      files,
      title,
      tags,
      url,
      author,
      authorDescription,
      description,
      mattersIPFSHash,
    } = res;
    const fingerprints = [];
    if (mattersIPFSHash) {
      const mattersIPFSHashFingerprint = `ipfs://${mattersIPFSHash}`;
      fingerprints.push(mattersIPFSHashFingerprint);
    }
    ISCNWindow.postMessage(JSON.stringify({
      action: 'SUBMIT_ISCN_DATA',
      data: {
        files,
        metadata: {
          name: title,
          tags,
          url,
          author,
          authorDescription,
          description,
          fingerprints,
          type: 'article',
          license: '',
          recordNotes: ISCN_RECORD_NOTE,
          memo: ISCN_RECORD_NOTE,
        },
      },
    }), ISCN_WIDGET_ORIGIN);
  } catch (error) {
    console.error('error occured when submitting ISCN:');
    console.error(error);
    lcPostInfo.mainStatus = 'failed';
  }
}

(() => {
  const refreshBtn = document.getElementById('lcPublishRefreshBtn');
  if (refreshBtn) refreshBtn.addEventListener('click', onRefreshPublishStatus);
  onRefreshPublishStatus();
})();
