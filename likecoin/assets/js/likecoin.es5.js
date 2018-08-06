import _regeneratorRuntime from "@babel/runtime/regenerator";
import "regenerator-runtime/runtime";
import "core-js/modules/es6.promise";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import "core-js/modules/web.dom.iterable";

/* global Web3, WP_CONFIG */
var CHALLENGE_URL = 'https://api.like.co/api/users/challenge';
var address = null;
var webThreeError = null;
var webThreeInstance = null;
var loginBtn = document.querySelector('.loginBtn');
var changeBtn = document.querySelector('.changeBtn');
var likecoinId = document.querySelector('#likecoinId');
var likecoinWallet = document.querySelector('#likecoinWallet');
var likecoinPreview = document.querySelector('#likecoinPreview');
var updateStatus = document.querySelector('#updateLikeCoinIdStatus');

function show(selector) {
  var elem = document.querySelector(".likecoin".concat(selector));
  elem.style.display = '';
}

function hide(selector) {
  var elem = document.querySelector(".likecoin".concat(selector));
  elem.style.display = 'none';
}

function showError(selector) {
  webThreeError = selector;
  var elems = document.querySelectorAll('.likecoin.webThreeError');
  elems.forEach(function (elem) {
    elem.style.display = 'none';
  }); // eslint-disable-line no-param-reassign

  show(selector);
}

function pollForWebThree() {
  return _pollForWebThree.apply(this, arguments);
}

function _pollForWebThree() {
  _pollForWebThree = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee2() {
    var network, accounts, selectedAddress;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (window.web3) {
              _context2.next = 4;
              break;
            }

            showError('.needMetaMask');
            console.error('no web3'); // eslint-disable-line no-console

            return _context2.abrupt("return", '');

          case 4:
            webThreeInstance = new Web3(window.web3.currentProvider);
            _context2.next = 7;
            return webThreeInstance.eth.net.getNetworkType();

          case 7:
            network = _context2.sent;

            if (!(network !== 'main')) {
              _context2.next = 12;
              break;
            }

            showError('.needMainNet');
            console.error('not mainnet'); // eslint-disable-line no-console

            return _context2.abrupt("return", '');

          case 12:
            _context2.next = 14;
            return webThreeInstance.eth.getAccounts();

          case 14:
            accounts = _context2.sent;

            if (!(!accounts || !accounts[0])) {
              _context2.next = 19;
              break;
            }

            showError('.needUnlock');
            console.error('not unlocked'); // eslint-disable-line no-console

            return _context2.abrupt("return", '');

          case 19:
            selectedAddress = accounts[0];
            webThreeError = null;
            return _context2.abrupt("return", webThreeInstance.utils.toChecksumAddress(selectedAddress));

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _pollForWebThree.apply(this, arguments);
}

function handleUpdateId(_x, _x2) {
  return _handleUpdateId.apply(this, arguments);
}

function _handleUpdateId() {
  _handleUpdateId = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee3(newId, newWallet) {
    var res;
    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return fetch(WP_CONFIG.adminAjaxUrl, {
              body: "action=likecoin_update_id&likecoin_id=".concat(newId, "&likecoin_wallet=").concat(newWallet, "&nonce=").concat(WP_CONFIG.nonce),
              credentials: 'include',
              headers: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              method: 'POST'
            });

          case 2:
            res = _context3.sent;
            _context3.next = 5;
            return res.text();

          case 5:
            updateStatus.textContent = _context3.sent;

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _handleUpdateId.apply(this, arguments);
}

function login() {
  return _login.apply(this, arguments);
}

function _login() {
  _login = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee4() {
    var res, _ref2, challenge, signature, body, payload, user, wallet;

    return _regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!webThreeError) {
              _context4.next = 2;
              break;
            }

            return _context4.abrupt("return");

          case 2:
            _context4.next = 4;
            return fetch("".concat(CHALLENGE_URL, "?wallet=").concat(address));

          case 4:
            res = _context4.sent;
            _context4.next = 7;
            return res.json();

          case 7:
            _ref2 = _context4.sent;
            challenge = _ref2.challenge;
            _context4.next = 11;
            return webThreeInstance.eth.personal.sign(challenge, address);

          case 11:
            signature = _context4.sent;

            if (signature) {
              _context4.next = 14;
              break;
            }

            throw new Error('No signature');

          case 14:
            body = JSON.stringify({
              challenge: challenge,
              signature: signature,
              wallet: address
            });
            _context4.next = 17;
            return fetch(CHALLENGE_URL, {
              body: body,
              headers: {
                'content-type': 'application/json'
              },
              method: 'POST'
            });

          case 17:
            res = _context4.sent;
            _context4.next = 20;
            return res.json();

          case 20:
            payload = _context4.sent;
            user = payload.user, wallet = payload.wallet;

            if (user) {
              handleUpdateId(user, wallet);
              likecoinId.innerHTML = user;
              likecoinWallet.innerHTML = wallet;
              likecoinPreview.src = "https://button.like.co/in/embed/".concat(user, "/button");
              hide('.loginSection');
              show('.optionsSection');
            } else {
              // TODO: Add error msg display to UI
              console.error('Error: user is undefined'); // eslint-disable-line no-console

              console.error(payload); // eslint-disable-line no-console
            }

          case 23:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return _login.apply(this, arguments);
}

function onLoginClick() {
  return _onLoginClick.apply(this, arguments);
}

function _onLoginClick() {
  _onLoginClick = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee5() {
    return _regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return login();

          case 3:
            _context5.next = 8;
            break;

          case 5:
            _context5.prev = 5;
            _context5.t0 = _context5["catch"](0);
            console.error(_context5.t0); // eslint-disable-line no-console

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this, [[0, 5]]);
  }));
  return _onLoginClick.apply(this, arguments);
}

function onChangeClick() {
  return _onChangeClick.apply(this, arguments);
}

function _onChangeClick() {
  _onChangeClick = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee6() {
    return _regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            show('.loginSection');
            hide('.optionsSection');
            _context6.prev = 2;
            _context6.next = 5;
            return login();

          case 5:
            _context6.next = 12;
            break;

          case 7:
            _context6.prev = 7;
            _context6.t0 = _context6["catch"](2);
            console.error(_context6.t0); // eslint-disable-line no-console

            hide('.loginSection');
            show('.optionsSection');

          case 12:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this, [[2, 7]]);
  }));
  return _onChangeClick.apply(this, arguments);
}

loginBtn.addEventListener('click', onLoginClick);
changeBtn.addEventListener('click', onChangeClick);

function fetchLikeCoinID(_x3) {
  return _fetchLikeCoinID.apply(this, arguments);
}

function _fetchLikeCoinID() {
  _fetchLikeCoinID = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee7(newAddress) {
    var res;
    return _regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.next = 3;
            return fetch("".concat(CHALLENGE_URL, "?wallet=").concat(newAddress));

          case 3:
            res = _context7.sent;
            _context7.next = 6;
            return res.json();

          case 6:
            address = newAddress;
            showError('.needLogin');
            _context7.next = 13;
            break;

          case 10:
            _context7.prev = 10;
            _context7.t0 = _context7["catch"](0);
            showError('.needLikeCoinId');

          case 13:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this, [[0, 10]]);
  }));
  return _fetchLikeCoinID.apply(this, arguments);
}

function likecoinInit() {
  return _likecoinInit.apply(this, arguments);
}

function _likecoinInit() {
  _likecoinInit = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee8() {
    var newAddress;
    return _regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return pollForWebThree();

          case 2:
            newAddress = _context8.sent;

            if (!(address !== newAddress && newAddress)) {
              _context8.next = 6;
              break;
            }

            _context8.next = 6;
            return fetchLikeCoinID(newAddress);

          case 6:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));
  return _likecoinInit.apply(this, arguments);
}

function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}
/* loop for web3 changes */

/* eslint-disable no-await-in-loop */


_asyncToGenerator(
/*#__PURE__*/
_regeneratorRuntime.mark(function _callee() {
  return _regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!true) {
            _context.next = 13;
            break;
          }

          _context.prev = 1;
          _context.next = 4;
          return likecoinInit();

        case 4:
          _context.next = 9;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](1);
          console.error(_context.t0); // eslint-disable-line no-console

        case 9:
          _context.next = 11;
          return sleep(3000);

        case 11:
          _context.next = 0;
          break;

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this, [[1, 6]]);
}))();
/* eslint-enable no-await-in-loop */
