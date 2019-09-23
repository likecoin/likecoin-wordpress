/* global jQuery, _ */

function getUserMinAPI(userId) { return `https://api.like.co/users/id/${userId}/min`; }

function formatWallet(wallet) {
  if (!wallet) return wallet;
  return `${wallet.substr(0, 6)}...${wallet.substr(38, 4)}`;
}

function show(selector) {
  const elems = document.querySelectorAll(`.likecoin${selector}`);
  elems.forEach((elem) => { elem.style.display = ''; }); // eslint-disable-line no-param-reassign
}

function hide(selector) {
  const elems = document.querySelectorAll(`.likecoin${selector}`);
  elems.forEach((elem) => { elem.style.display = 'none'; }); // eslint-disable-line no-param-reassign
}

function showError(selector) {
  const elems = document.querySelectorAll('.likecoin.likecoinError');
  elems.forEach((elem) => { elem.style.display = 'none'; }); // eslint-disable-line no-param-reassign
  show(selector);
}

async function handleUpdateId({
  user,
  wallet,
  displayName,
  avatar,
}) {
  const likecoinId = document.querySelector('#likecoinId');
  const likecoinWallet = document.querySelector('#likecoinWallet');
  const likecoinDisplayName = document.querySelector('#likecoinDisplayName');
  const likecoinAvatar = document.querySelector('#likecoinAvatar');
  const likecoinPreview = document.querySelector('#likecoinPreview');
  const likecoinIdInput = document.querySelector('input.likecoinId');
  const likecoinDisplayNameInput = document.querySelector('input.likecoinDisplayName');
  const likecoinWalletInput = document.querySelector('input.likecoinWallet');
  const likecoinAvatarInput = document.querySelector('input.likecoinAvatar');
  if (likecoinId) likecoinId.innerHTML = user || '-';
  if (likecoinWallet) likecoinWallet.innerHTML = formatWallet(wallet) || '-';
  if (likecoinDisplayName) likecoinDisplayName.innerHTML = displayName || '-';
  if (likecoinAvatar) likecoinAvatar.src = avatar || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
  if (likecoinPreview) likecoinPreview.src = user ? `https://button.like.co/in/embed/${user}/button?type=wp` : 'about:blank';
  if (likecoinIdInput) likecoinIdInput.value = user;
  if (likecoinWalletInput) likecoinWalletInput.value = wallet;
  if (likecoinDisplayNameInput) likecoinDisplayNameInput.value = displayName;
  if (likecoinAvatarInput) likecoinAvatarInput.value = avatar;
  if (user) {
    hide('.loginSection');
    show('.optionsSection');
  } else {
    show('.loginSection');
    hide('.optionsSection');
  }
}

async function fetchLikeCoinID(likercoinId) {
  try {
    show('.loading');
    const payload = await jQuery.ajax({ url: getUserMinAPI(likercoinId) });
    hide('.loading');
    const {
      user = '',
      wallet = '',
      displayName = '',
      avatar = '',
    } = payload;
    if (user) {
      handleUpdateId({
        user,
        wallet,
        displayName,
        avatar,
      });
    }
  } catch (err) {
    hide('.loading');
    if ((err || {}).status === 404) {
      handleUpdateId({
        user: '',
        wallet: '',
        displayName: '',
        avatar: '',
      });
      showError('.userNotFound');
    }
    throw err;
  }
}

function onLoginClick() {
  hide('#likecoinId');
  show('.likecoinIdInputArea');
  document.getElementById('likecoinIdInputBox').focus();
}

function onFindMyIdClick() {
  showError('.findMyLikerId');
}

function onLogoutClick() {
  handleUpdateId({
    user: '',
    wallet: '',
    displayName: '',
    avatar: '',
  });
}

(() => {
  const loginBtn = document.querySelector('#likecoinLoginBtn');
  const changeBtn = document.querySelector('#likecoinChangeBtn');
  const logoutBtn = document.querySelector('#likecoinLogoutBtn');
  const likercoinIdInputBox = document.querySelector('#likecoinIdInputBox');
  const likercoinIdInputLabel = document.querySelector('#likecoinInputLabel');
  if (loginBtn) loginBtn.addEventListener('click', onLoginClick);
  if (changeBtn) changeBtn.addEventListener('click', onLoginClick);
  if (logoutBtn) logoutBtn.addEventListener('click', onLogoutClick);
  if (likercoinIdInputBox) {
    likercoinIdInputBox.addEventListener('keyup',
      _.debounce((e) => {
        hide('.likecoinError');
        fetchLikeCoinID(e.target.value);
      }, 500));
  }
  if (likercoinIdInputLabel) likercoinIdInputLabel.addEventListener('click', onFindMyIdClick);
})();
