import _regeneratorRuntime from "@babel/runtime-corejs2/regenerator";
import "regenerator-runtime/runtime";
import _asyncToGenerator from "@babel/runtime-corejs2/helpers/asyncToGenerator";

/* global jQuery, WP_CONFIG */
var accessTokenFieldId = document.querySelector("#".concat(WP_CONFIG.accessTokenFieldId));
var MATTERS_API_ENDPOINT = WP_CONFIG.mattersApiEndpoint;

function loginMatters(_x, _x2) {
  return _loginMatters.apply(this, arguments);
}

function _loginMatters() {
  _loginMatters = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(email, password) {
    var payload, res, token, tokenField;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            payload = {
              query: "mutation {\n  userLogin(input: {email: ".concat(email, ", password: ").concat(password, "}) {\n    auth\n    token\n  }\n}")
            };
            _context.next = 3;
            return jQuery.ajax({
              type: 'POST',
              url: MATTERS_API_ENDPOINT,
              dataType: 'json',
              data: payload
            });

          case 3:
            res = _context.sent;
            // if (!res.data || !res.data.userLogin) showError('INVALID_RESPONSE');
            // if (!res.data.userLogin.auth) showError('INVALID_RESPONSE');
            token = res.data.userLogin.token;
            tokenField = document.getElementById(accessTokenFieldId);
            if (tokenField) tokenField.value = token;

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _loginMatters.apply(this, arguments);
}

function onMattersLoginClick() {
  var mattersIdField = document.getElementById('matters_id');
  var mattersPasswordField = document.getElementById('matters_password');

  if (mattersIdField && mattersPasswordField) {
    loginMatters(mattersIdField, mattersPasswordField);
  }
}

function onMattersLogoutClick() {
  var tokenField = document.getElementById(accessTokenFieldId);
  if (tokenField) tokenField.value = '';
}

(function () {
  var loginBtn = document.getElementById('mattersIdLoginBtn');
  var logoutBtn = document.getElementById('mattersIdLogoutButton');
  if (loginBtn) loginBtn.addEventListener('click', onMattersLoginClick);
  if (logoutBtn) logoutBtn.addEventListener('click', onMattersLogoutClick);
})();