const challengeUrl = 'https://api.like.co/api/users/challenge';
let address = null;
let webThreeInstance = null;

const loginBtn = document.querySelector('.loginBtn');
const changeBtn = document.querySelector('.changeBtn');
const likecoinId = document.querySelector('#likecoinId');
const likecoinWallet = document.querySelector('#likecoinWallet');
const likecoinPreview = document.querySelector('#likecoinPreview');
const updateBtn = document.querySelector('#updateLikeCoinId');
const updateStatus = document.querySelector('#updateLikeCoinIdStatus');

function show(selector) {
  const elem = document.querySelector(`.likecoin${selector}`);
  elem.style.display = '';
}

function hide(selector) {
  const elem = document.querySelector(`.likecoin${selector}`);
  elem.style.display = 'none';
}

async function likecoinInit() {
  if (!window.web3) {
    show('.needMetaMask');
    console.error('no web3');
    return;
  }
  webThreeInstance = new Web3(window.web3.currentProvider);
  const network = await webThreeInstance.eth.net.getNetworkType();
  if (network !== 'main') {
    show('.needMainNet');
    console.error('not mainnet');
    return;
  }
  const accounts = await webThreeInstance.eth.getAccounts();
  if (!accounts || !accounts[0]) {
    show('.needUnlock');
    console.error('not unlocked');
    return;
  }
  const selectedAddress = accounts[0];

  address = webThreeInstance.utils.toChecksumAddress(selectedAddress);
  try {
    const res = await fetch(`${challengeUrl}?wallet=${address}`);
    await res.json();
    show('.needLogin');
  } catch (e) {
    show('.needLikeCoinId');
  }
}

async function login() {
  let res = await fetch(`${challengeUrl}?wallet=${address}`);
  const { challenge } = await res.json();
  const signature = await webThreeInstance.eth.personal.sign(challenge, address);
  if (err || !signature) {
    throw (err || 'No signature');
  }
  const body = JSON.stringify({ challenge, signature, wallet: address });
  res = await fetch(challengeUrl, {
    body,
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST'
  });
  const { user, wallet } = await res.json();
  handleUpdateId(user, wallet);
  if (user) {
    likecoinId.innerHTML = user;
    likecoinWallet.innerHTML = wallet;
    likecoinPreview.src = 'https://button.like.co/in/embed/' + user + '/button';
    hide('.loginSection');
    show('.optionsSection');
  }
}

async function onLoginClick() {
  try {
    await login();
  } catch (e) {
    console.error(e);
  }
}

async function onChangeClick() {
  show('.loginSection');
  hide('.optionsSection');
  try {
    await login();
  } catch (e) {
    console.error(e);
    hide('.loginSection');
    show('.optionsSection');
  }
}


async function handleUpdateId(newId, newWallet) {
  const res = await fetch(WP_CONFIG.adminAjaxUrl, {
    body: 'action=likecoin_update_id&likecoin_id=' + newId + '&likecoin_wallet=' + newWallet,
    credentials: 'include',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'POST'
  });
  updateStatus.textContent = await res.text();
}

loginBtn.addEventListener('click', onLoginClick);
changeBtn.addEventListener('click', onChangeClick);

likecoinInit();
