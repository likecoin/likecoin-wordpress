/* global jQuery, Web3 */

const CHALLENGE_URL = 'https://api.like.co/api/users/challenge';
let address = null;
let webThreeError = null;
let webThreeInstance = null;
let isInited = false;

function show(selector) {
  const elem = document.querySelector(`.likecoin${selector}`);
  if (elem) elem.style.display = '';
}

function hide(selector) {
  const elem = document.querySelector(`.likecoin${selector}`);
  if (elem) elem.style.display = 'none';
}


function showError(selector) {
  if (!isInited) return;
  webThreeError = selector;
  const elems = document.querySelectorAll('.likecoin.webThreeError');
  elems.forEach((elem) => { elem.style.display = 'none'; }); // eslint-disable-line no-param-reassign
  show(selector);
}


async function checkForWebThree() {
  if (!window.web3) {
    showError('.needMetaMask');
    console.error('no web3'); // eslint-disable-line no-console
    return '';
  }
  webThreeInstance = new Web3(window.web3.currentProvider);
  const network = await webThreeInstance.eth.net.getNetworkType();
  if (network !== 'main') {
    showError('.needMainNet');
    console.error('not mainnet'); // eslint-disable-line no-console
    return '';
  }
  const accounts = await webThreeInstance.eth.getAccounts();
  if (!accounts || !accounts[0]) {
    showError('.needUnlock');
    console.error('not unlocked'); // eslint-disable-line no-console
    return '';
  }
  const selectedAddress = accounts[0];
  webThreeError = null;
  return webThreeInstance.utils.toChecksumAddress(selectedAddress);
}

async function handleUpdateId(user, wallet, displayName) {
  const likecoinId = document.querySelector('#likecoinId');
  const likecoinWallet = document.querySelector('#likecoinWallet');
  const likecoinDisplayName = document.querySelector('#likecoinDisplayName');
  const likecoinPreview = document.querySelector('#likecoinPreview');
  const likecoinIdInput = document.querySelector('input.likecoinId');
  const likecoinDisplayNameInput = document.querySelector('input.likecoinDisplayName');
  const likecoinWalletInput = document.querySelector('input.likecoinWallet');
  if (likecoinId) likecoinId.innerHTML = user || '-';
  if (likecoinWallet) likecoinWallet.innerHTML = wallet || '-';
  if (likecoinDisplayName) likecoinDisplayName.innerHTML = displayName || '-';
  if (likecoinPreview) likecoinPreview.src = user ? `https://button.like.co/in/embed/${user}/button` : 'about:blank';
  if (likecoinIdInput) likecoinIdInput.value = user;
  if (likecoinWalletInput) likecoinWalletInput.value = wallet;
  if (likecoinDisplayNameInput) likecoinDisplayNameInput.value = displayName;
  hide('.loginSection');
  show('.optionsSection');
}

async function fetchLikeCoinID(currentAddress) {
  try {
    show('.loading');
    address = currentAddress; // mark we tried fetching this address
    const { challenge } = await jQuery.ajax({ url: `${CHALLENGE_URL}?wallet=${currentAddress}` });
    hide('.loading');
    showError('.needLogin');
    return challenge;
  } catch (err) {
    hide('.loading');
    if ((err || {}).status === 404) showError('.needLikeCoinId');
    throw err;
  }
}

async function login() {
  if (!address) {
    throw new Error('cannot get web3 address');
  }
  if (webThreeError && webThreeError !== '.needLogin') {
    throw new Error(webThreeError);
  }
  const challenge = await fetchLikeCoinID(address);
  console.log(challenge);
  const signature = await webThreeInstance.eth.personal.sign(challenge, address);
  if (!signature) {
    throw new Error('No signature');
  }
  const body = JSON.stringify({ challenge, signature, wallet: address });
  const res = await fetch(CHALLENGE_URL, {
    body,
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
  });
  const payload = await res.json();
  const { user, wallet, displayName } = payload;
  if (user) {
    handleUpdateId(user, wallet, displayName);
  } else {
    // TODO: Add error msg display to UI
    console.error('Error: user is undefined'); // eslint-disable-line no-console
    console.error(payload); // eslint-disable-line no-console
  }
}

async function likecoinPoll() {
  const newAddress = await checkForWebThree();
  if (address !== newAddress && newAddress) {
    await fetchLikeCoinID(newAddress);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* loop for web3 changes */
/* eslint-disable no-await-in-loop */
const likecoinInit = async () => {
  isInited = true;
  while (true) { // eslint-disable-line no-constant-condition
    try {
      await likecoinPoll();
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
    }
    await sleep(3000);
  }
};
/* eslint-enable no-await-in-loop */

async function onLoginClick() {
  try {
    if (!isInited) {
      /* try to fetch address before starting async */
      if (!address) await likecoinPoll();
      likecoinInit();
    }
    await login();
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
  }
}

function onLogoutClick() {
  handleUpdateId('', '', '');
}

(() => {
  const loginBtn = document.querySelector('#likecoinLoginBtn');
  const changeBtn = document.querySelector('#likecoinChangeBtn');
  const logoutBtn = document.querySelector('#likecoinLogoutBtn');
  if (loginBtn) loginBtn.addEventListener('click', onLoginClick);
  if (changeBtn) changeBtn.addEventListener('click', onLoginClick);
  if (logoutBtn) logoutBtn.addEventListener('click', onLogoutClick);
  checkForWebThree({ slient: true });
})();
