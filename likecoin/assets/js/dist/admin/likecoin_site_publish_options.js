!function(){"use strict";function t(t,e){return t(e={exports:{}},e.exports),e.exports}var e,a=t(function(t){var e=function(a){var c,t=Object.prototype,s=t.hasOwnProperty,e="function"==typeof Symbol?Symbol:{},n=e.iterator||"@@iterator",r=e.asyncIterator||"@@asyncIterator",o=e.toStringTag||"@@toStringTag";function i(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{i({},"")}catch(t){i=function(t,e,r){return t[e]=r}}function u(t,e,r,n){var o,i,a,u,e=e&&e.prototype instanceof v?e:v,e=Object.create(e.prototype),n=new I(n||[]);return e._invoke=(o=t,i=r,a=n,u=f,function(t,e){if(u===p)throw new Error("Generator is already running");if(u===d){if("throw"===t)throw e;return j()}for(a.method=t,a.arg=e;;){var r=a.delegate;if(r){var n=function t(e,r){var n=e.iterator[r.method];if(n===c){if(r.delegate=null,"throw"===r.method){if(e.iterator.return&&(r.method="return",r.arg=c,t(e,r),"throw"===r.method))return y;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method")}return y}n=l(n,e.iterator,r.arg);if("throw"===n.type)return r.method="throw",r.arg=n.arg,r.delegate=null,y;var n=n.arg;if(!n)return r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,y;{if(!n.done)return n;r[e.resultName]=n.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=c)}r.delegate=null;return y}(r,a);if(n){if(n===y)continue;return n}}if("next"===a.method)a.sent=a._sent=a.arg;else if("throw"===a.method){if(u===f)throw u=d,a.arg;a.dispatchException(a.arg)}else"return"===a.method&&a.abrupt("return",a.arg);u=p;n=l(o,i,a);if("normal"===n.type){if(u=a.done?d:h,n.arg!==y)return{value:n.arg,done:a.done}}else"throw"===n.type&&(u=d,a.method="throw",a.arg=n.arg)}}),e}function l(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}a.wrap=u;var f="suspendedStart",h="suspendedYield",p="executing",d="completed",y={};function v(){}function m(){}function g(){}var w={};w[n]=function(){return this};e=Object.getPrototypeOf,e=e&&e(e(O([])));e&&e!==t&&s.call(e,n)&&(w=e);var x=g.prototype=v.prototype=Object.create(w);function L(t){["next","throw","return"].forEach(function(e){i(t,e,function(t){return this._invoke(e,t)})})}function E(a,u){var e;this._invoke=function(r,n){function t(){return new u(function(t,e){!function e(t,r,n,o){t=l(a[t],a,r);if("throw"!==t.type){var i=t.arg,r=i.value;return r&&"object"==typeof r&&s.call(r,"__await")?u.resolve(r.__await).then(function(t){e("next",t,n,o)},function(t){e("throw",t,n,o)}):u.resolve(r).then(function(t){i.value=t,n(i)},function(t){return e("throw",t,n,o)})}o(t.arg)}(r,n,t,e)})}return e=e?e.then(t,t):t()}}function b(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function _(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function I(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(b,this),this.reset(!0)}function O(e){if(e){var t=e[n];if(t)return t.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var r=-1,t=function t(){for(;++r<e.length;)if(s.call(e,r))return t.value=e[r],t.done=!1,t;return t.value=c,t.done=!0,t};return t.next=t}}return{next:j}}function j(){return{value:c,done:!0}}return((m.prototype=x.constructor=g).constructor=m).displayName=i(g,o,"GeneratorFunction"),a.isGeneratorFunction=function(t){t="function"==typeof t&&t.constructor;return!!t&&(t===m||"GeneratorFunction"===(t.displayName||t.name))},a.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,g):(t.__proto__=g,i(t,o,"GeneratorFunction")),t.prototype=Object.create(x),t},a.awrap=function(t){return{__await:t}},L(E.prototype),E.prototype[r]=function(){return this},a.AsyncIterator=E,a.async=function(t,e,r,n,o){void 0===o&&(o=Promise);var i=new E(u(t,e,r,n),o);return a.isGeneratorFunction(e)?i:i.next().then(function(t){return t.done?t.value:i.next()})},L(x),i(x,o,"Generator"),x[n]=function(){return this},x.toString=function(){return"[object Generator]"},a.keys=function(r){var t,n=[];for(t in r)n.push(t);return n.reverse(),function t(){for(;n.length;){var e=n.pop();if(e in r)return t.value=e,t.done=!1,t}return t.done=!0,t}},a.values=O,I.prototype={constructor:I,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=c,this.done=!1,this.delegate=null,this.method="next",this.arg=c,this.tryEntries.forEach(_),!t)for(var e in this)"t"===e.charAt(0)&&s.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=c)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(r){if(this.done)throw r;var n=this;function t(t,e){return i.type="throw",i.arg=r,n.next=t,e&&(n.method="next",n.arg=c),!!e}for(var e=this.tryEntries.length-1;0<=e;--e){var o=this.tryEntries[e],i=o.completion;if("root"===o.tryLoc)return t("end");if(o.tryLoc<=this.prev){var a=s.call(o,"catchLoc"),u=s.call(o,"finallyLoc");if(a&&u){if(this.prev<o.catchLoc)return t(o.catchLoc,!0);if(this.prev<o.finallyLoc)return t(o.finallyLoc)}else if(a){if(this.prev<o.catchLoc)return t(o.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return t(o.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;0<=r;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&s.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=t,i.arg=e,o?(this.method="next",this.next=o.finallyLoc,y):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),y},finish:function(t){for(var e=this.tryEntries.length-1;0<=e;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),_(r),y}},catch:function(t){for(var e=this.tryEntries.length-1;0<=e;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n,o=r.completion;return"throw"===o.type&&(n=o.arg,_(r)),n}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:O(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=c),y}},a}(t.exports);try{regeneratorRuntime=e}catch(t){Function("r","regeneratorRuntime = r")(e)}}),r=t(function(t){function c(t,e,r,n,o,i,a){try{var u=t[i](a),c=u.value}catch(t){return void r(t)}u.done?e(c):Promise.resolve(c).then(n,o)}t.exports=function(u){return function(){var t=this,a=arguments;return new Promise(function(e,r){var n=u.apply(t,a);function o(t){c(n,e,r,o,i,"next",t)}function i(t){c(n,e,r,o,i,"throw",t)}o(void 0)})}},t.exports.default=t.exports,t.exports.__esModule=!0}),n=(e=r)&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e,u=document.getElementById(WP_CONFIG.mattersAccessTokenFieldId),c=document.getElementById(WP_CONFIG.mattersIdFieldId),s=document.querySelector("form[action='options.php']"),o=document.querySelector("form[action='admin-ajax.php']"),l=document.getElementById("lcMattersErrorMessage");function i(){return(i=n(a.mark(function t(e){var r,n,o,i;return a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,jQuery.ajax({type:"POST",url:ajaxurl,data:e});case 2:if((r=t.sent).errors||r.error)return i=r.errors||[r.error],n=document.getElementById("matters_password"),o=n?n.value:null,l.textContent="ERROR: ".concat(i.map(function(t){t=t.message||t;return o&&(t=t.split(o).join("***")),t}).join(", ")),t.abrupt("return");t.next=9;break;case 9:if(r.userLogin){t.next=12;break}return l.textContent="INVALID_RESPONSE",t.abrupt("return");case 12:if(r.userLogin.auth){t.next=15;break}return l.textContent="INVALID_RESPONSE",t.abrupt("return");case 15:i=r.userLogin.token,u&&i&&(u.value=i),i=r.viewer.userName,c&&i&&(c.value=i),s.submit.click();case 20:case"end":return t.stop()}},t)}))).apply(this,arguments)}function f(t){t.preventDefault(),o&&(t=jQuery(o).serialize(),console.log("data to send to matters: ",t),function(){i.apply(this,arguments)}(t))}function h(t){t.preventDefault(),u&&(u.value=""),c&&(c.value=""),s.submit.click()}r=document.getElementById("lcMattersIdLoginBtn"),e=document.getElementById("lcMattersIdLogoutButton"),r&&r.addEventListener("click",f),e&&e.addEventListener("click",h)}();
//# sourceMappingURL=likecoin_site_publish_options.js.map
