const challengeUrl = 'https://api.rinkeby.like.co/api/users/challenge';
let address = null;

const loginBtn = document.querySelector('.loginBtn');
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
  const {
    networkVersion,
    selectedAddress,
  } = web3.currentProvider.publicConfigStore._state;
  if (networkVersion !== '1') {
    show('.needMainNet');
    console.error('not mainnet');
    return;
  } else if (!selectedAddress) {
    show('.needUnlock');
    console.error('not unlocked');
    return;
  }

  address = web3.toChecksumAddress(selectedAddress);
  try {
    const res = await fetch(`${challengeUrl}?wallet=${address}`);
    await res.json();
    show('.needLogin');
  } catch (e) {
    show('.needLikeCoinId');
  }
}

async function login() {
  try {
    let res = await fetch(`${challengeUrl}?wallet=${address}`);
    const { challenge } = await res.json();
    web3.personal.sign(challenge, address, async (err, signature) => {
      if (err || !signature) {
        return;
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
    });
  } catch (e) {
    console.error(e);
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

loginBtn.addEventListener('click', login);

likecoinInit();
