const challengeUrl = 'https://api.rinkeby.like.co/api/users/challenge';
let address = null;

const likecoinId = document.querySelector('#likecoinId');

function show(selector) {
  const elem = document.querySelector(`.likecoin${selector}`);
  elem.style.display = '';
}

async function likecoinInit() {
  if (!window.web3) {
    show('.needMetaMask');
    return;
  }
  const {
    networkVersion,
    selectedAddress,
  } = web3.currentProvider.publicConfigStore._state;
  if (networkVersion !== '1') {
    show('.needMainNet');
    return;
  } else if (!selectedAddress) {
    show('.needUnlock');
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

likecoinInit();
