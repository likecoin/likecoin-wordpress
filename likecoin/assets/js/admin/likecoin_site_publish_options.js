/* global ajaxurl, jQuery, WP_CONFIG */

const accessTokenField = document.getElementById(WP_CONFIG.accessTokenFieldId);
const settingsForm = document.querySelector("form[action='options.php']");
const ajaxForm = document.querySelector("form[action='admin-ajax.php']");
const errorMessage = document.getElementById('mattersErrorMessage');

async function loginMatters(data) {
  const res = await jQuery.ajax({
    type: 'POST',
    url: ajaxurl,
    data,
  });
  if (res.errors) {
    const mattersPasswordField = document.getElementById('matters_password');
    const password = mattersPasswordField ? mattersPasswordField.value : null;
    errorMessage.textContent = `ERROR: ${res.errors.map((e) => {
      let msg = e.message || e;
      if (password) msg = msg.split(password).join('***');
      return msg;
    }).join(', ')}`;
    return;
  }
  if (!res.data || !res.data.userLogin) {
    errorMessage.textContent = 'INVALID_RESPONSE';
    return;
  }
  if (!res.data.userLogin.auth) {
    errorMessage.textContent = 'INVALID_RESPONSE';
    return;
  }
  const { token } = res.data.userLogin;
  if (accessTokenField && token) {
    accessTokenField.value = token;
    settingsForm.submit.click();
  }
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
  if (accessTokenField) {
    accessTokenField.value = '';
    settingsForm.submit.click();
  }
}

(() => {
  const loginBtn = document.getElementById('mattersIdLoginBtn');
  const logoutBtn = document.getElementById('mattersIdLogoutButton');
  if (loginBtn) loginBtn.addEventListener('click', onMattersLoginClick);
  if (logoutBtn) logoutBtn.addEventListener('click', onMattersLogoutClick);
})();
