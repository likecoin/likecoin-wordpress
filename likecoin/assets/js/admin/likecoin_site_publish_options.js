/* global jQuery, WP_CONFIG */

const accessTokenField = document.getElementById(WP_CONFIG.accessTokenFieldId);
const MATTERS_API_ENDPOINT = WP_CONFIG.mattersApiEndpoint;
const settingsForm = document.querySelector("form[action='options.php']");

async function loginMatters(email, password) {
  const payload = { query: `mutation {\n  userLogin(input: {email: "${email}", password: "${password}"}) {\n    auth\n    token\n  }\n}` };
  const res = await jQuery.ajax({
    type: 'POST',
    url: MATTERS_API_ENDPOINT,
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(payload),
  });
  // if (!res.data || !res.data.userLogin) showError('INVALID_RESPONSE');
  // if (!res.data.userLogin.auth) showError('INVALID_RESPONSE');
  const { token } = res.data.userLogin;
  if (accessTokenField && token) {
    accessTokenField.value = token;
    settingsForm.submit.click();
  }
}


function onMattersLoginClick(e) {
  e.preventDefault();
  const mattersIdField = document.getElementById('matters_id');
  const mattersPasswordField = document.getElementById('matters_password');
  if (mattersIdField && mattersPasswordField) {
    loginMatters(mattersIdField.value, mattersPasswordField.value);
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
