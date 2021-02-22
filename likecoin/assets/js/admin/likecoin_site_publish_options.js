/* global ajaxurl, jQuery, WP_CONFIG */

const mattersAccessTokenFieldId = document.getElementById(WP_CONFIG.mattersAccessTokenFieldId);
const mattersIdFieldId = document.getElementById(WP_CONFIG.mattersIdFieldId);
const settingsForm = document.querySelector("form[action='options.php']");
const ajaxForm = document.querySelector("form[action='admin-ajax.php']");
const errorMessage = document.getElementById('lcMattersErrorMessage');

async function loginMatters(data) {
  const res = await jQuery.ajax({
    type: 'POST',
    url: ajaxurl,
    data,
  });
  if (res.errors || res.error) {
    const errors = res.errors || [res.error];
    const mattersPasswordField = document.getElementById('matters_password');
    const password = mattersPasswordField ? mattersPasswordField.value : null;
    errorMessage.textContent = `ERROR: ${errors.map((e) => {
      let msg = e.message || e;
      if (password) msg = msg.split(password).join('***');
      return msg;
    }).join(', ')}`;
    return;
  }
  if (!res.userLogin) {
    errorMessage.textContent = 'INVALID_RESPONSE';
    return;
  }
  if (!res.userLogin.auth) {
    errorMessage.textContent = 'INVALID_RESPONSE';
    return;
  }
  const { token } = res.userLogin;
  if (mattersAccessTokenFieldId && token) {
    mattersAccessTokenFieldId.value = token;
  }
  const { userName } = res.viewer;
  if (mattersIdFieldId && userName) {
    mattersIdFieldId.value = userName;
  }
  settingsForm.submit.click();
}

function onMattersLoginClick(e) {
  e.preventDefault();
  if (ajaxForm) {
    const data = jQuery(ajaxForm).serialize();
    loginMatters(data);
  }
}

function onMattersLogoutClick(e) {
  e.preventDefault();
  if (mattersAccessTokenFieldId) {
    mattersAccessTokenFieldId.value = '';
  }
  if (mattersIdFieldId) {
    mattersIdFieldId.value = '';
  }
  settingsForm.submit.click();
}

(() => {
  const loginBtn = document.getElementById('lcMattersIdLoginBtn');
  const logoutBtn = document.getElementById('lcMattersIdLogoutButton');
  if (loginBtn) loginBtn.addEventListener('click', onMattersLoginClick);
  if (logoutBtn) logoutBtn.addEventListener('click', onMattersLogoutClick);
})();
