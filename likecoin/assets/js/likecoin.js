/* global Web3, WP_CONFIG */

const CHALLENGE_URL = 'https://api.like.co/api/users/challenge';
let address = null;
let webThreeError = null;
let webThreeInstance = null;

const loginBtn = document.querySelector('.loginBtn');
const changeBtn = document.querySelector('.changeBtn');
const likecoinId = document.querySelector('#likecoinId');
const likecoinWallet = document.querySelector('#likecoinWallet');
const likecoinPreview = document.querySelector('#likecoinPreview');
const updateStatus = document.querySelector('#updateLikeCoinIdStatus');

function show(selector) {
  const elem = document.querySelector(`.likecoin${selector}`);
  elem.style.display = '';
}

function hide(selector) {
  const elem = document.querySelector(`.likecoin${selector}`);
  elem.style.display = 'none';
}


function showError(selector) {
  webThreeError = selector;
  const elems = document.querySelectorAll('.likecoin.webThreeError');
  elems.forEach((elem) => { elem.style.display = 'none'; }); // eslint-disable-line no-param-reassign
  show(selector);
}


async function pollForWebThree() {
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

async function handleUpdateId(newId, newWallet) {
  const res = await fetch(WP_CONFIG.adminAjaxUrl, {
    body: `action=likecoin_update_id&likecoin_id=${newId}&likecoin_wallet=${newWallet}&nonce=${WP_CONFIG.nonce}`,
    credentials: 'include',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  });
  updateStatus.textContent = await res.text();
}

async function login() {
  if (webThreeError && webThreeError !== '.needLogin') {
    throw new Error(webThreeError);
  }
  let res = await fetch(`${CHALLENGE_URL}?wallet=${address}`);
  const { challenge } = await res.json();
  const signature = await webThreeInstance.eth.personal.sign(challenge, address);
  if (!signature) {
    throw new Error('No signature');
  }
  const body = JSON.stringify({ challenge, signature, wallet: address });
  res = await fetch(CHALLENGE_URL, {
    body,
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
  });
  const payload = await res.json();
  const { user, wallet } = payload;
  if (user) {
    handleUpdateId(user, wallet);
    likecoinId.innerHTML = user;
    likecoinWallet.innerHTML = wallet;
    likecoinPreview.src = `https://button.like.co/in/embed/${user}/button`;
    hide('.loginSection');
    show('.optionsSection');
  } else {
    // TODO: Add error msg display to UI
    console.error('Error: user is undefined'); // eslint-disable-line no-console
    console.error(payload); // eslint-disable-line no-console
  }
}

async function onLoginClick() {
  try {
    await login();
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
  }
}

async function onChangeClick() {
  show('.loginSection');
  hide('.optionsSection');
  try {
    await login();
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
    hide('.loginSection');
    show('.optionsSection');
  }
}

loginBtn.addEventListener('click', onLoginClick);
changeBtn.addEventListener('click', onChangeClick);

async function fetchLikeCoinID(newAddress) {
  try {
    const res = await fetch(`${CHALLENGE_URL}?wallet=${newAddress}`);
    await res.json();
    address = newAddress;
    showError('.needLogin');
  } catch (e) {
    showError('.needLikeCoinId');
  }
}

async function likecoinInit() {
  const newAddress = await pollForWebThree();
  if (address !== newAddress && newAddress) {
    await fetchLikeCoinID(newAddress);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* loop for web3 changes */
/* eslint-disable no-await-in-loop */
(async () => {
  while (true) { // eslint-disable-line no-constant-condition
    try {
      await likecoinInit();
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
    }
    await sleep(3000);
  }
})();
/* eslint-enable no-await-in-loop */
