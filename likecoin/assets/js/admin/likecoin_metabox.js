!function(){"use strict";function t(t,e){return t(e={exports:{}},e.exports),e.exports}var y=t(function(t){var e=function(i){var s,t=Object.prototype,u=t.hasOwnProperty,e="function"==typeof Symbol?Symbol:{},r=e.iterator||"@@iterator",n=e.asyncIterator||"@@asyncIterator",o=e.toStringTag||"@@toStringTag";function a(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{a({},"")}catch(t){a=function(t,e,n){return t[e]=n}}function c(t,e,n,r){var o,a,i,c,e=e&&e.prototype instanceof v?e:v,e=Object.create(e.prototype),r=new E(r||[]);return e._invoke=(o=t,a=n,i=r,c=p,function(t,e){if(c===h)throw new Error("Generator is already running");if(c===d){if("throw"===t)throw e;return _()}for(i.method=t,i.arg=e;;){var n=i.delegate;if(n){var r=function t(e,n){var r=e.iterator[n.method];if(r===s){if(n.delegate=null,"throw"===n.method){if(e.iterator.return&&(n.method="return",n.arg=s,t(e,n),"throw"===n.method))return m;n.method="throw",n.arg=new TypeError("The iterator does not provide a 'throw' method")}return m}r=l(r,e.iterator,n.arg);if("throw"===r.type)return n.method="throw",n.arg=r.arg,n.delegate=null,m;var r=r.arg;if(!r)return n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,m;{if(!r.done)return r;n[e.resultName]=r.value,n.next=e.nextLoc,"return"!==n.method&&(n.method="next",n.arg=s)}n.delegate=null;return m}(n,i);if(r){if(r===m)continue;return r}}if("next"===i.method)i.sent=i._sent=i.arg;else if("throw"===i.method){if(c===p)throw c=d,i.arg;i.dispatchException(i.arg)}else"return"===i.method&&i.abrupt("return",i.arg);c=h;r=l(o,a,i);if("normal"===r.type){if(c=i.done?d:f,r.arg!==m)return{value:r.arg,done:i.done}}else"throw"===r.type&&(c=d,i.method="throw",i.arg=r.arg)}}),e}function l(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}i.wrap=c;var p="suspendedStart",f="suspendedYield",h="executing",d="completed",m={};function v(){}function y(){}function w(){}var g={};g[r]=function(){return this};e=Object.getPrototypeOf,e=e&&e(e(k([])));e&&e!==t&&u.call(e,r)&&(g=e);var S=w.prototype=v.prototype=Object.create(g);function I(t){["next","throw","return"].forEach(function(e){a(t,e,function(t){return this._invoke(e,t)})})}function x(i,c){var e;this._invoke=function(n,r){function t(){return new c(function(t,e){!function e(t,n,r,o){t=l(i[t],i,n);if("throw"!==t.type){var a=t.arg,n=a.value;return n&&"object"==typeof n&&u.call(n,"__await")?c.resolve(n.__await).then(function(t){e("next",t,r,o)},function(t){e("throw",t,r,o)}):c.resolve(n).then(function(t){a.value=t,r(a)},function(t){return e("throw",t,r,o)})}o(t.arg)}(n,r,t,e)})}return e=e?e.then(t,t):t()}}function b(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function P(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function E(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(b,this),this.reset(!0)}function k(e){if(e){var t=e[r];if(t)return t.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var n=-1,t=function t(){for(;++n<e.length;)if(u.call(e,n))return t.value=e[n],t.done=!1,t;return t.value=s,t.done=!0,t};return t.next=t}}return{next:_}}function _(){return{value:s,done:!0}}return((y.prototype=S.constructor=w).constructor=y).displayName=a(w,o,"GeneratorFunction"),i.isGeneratorFunction=function(t){t="function"==typeof t&&t.constructor;return!!t&&(t===y||"GeneratorFunction"===(t.displayName||t.name))},i.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,w):(t.__proto__=w,a(t,o,"GeneratorFunction")),t.prototype=Object.create(S),t},i.awrap=function(t){return{__await:t}},I(x.prototype),x.prototype[n]=function(){return this},i.AsyncIterator=x,i.async=function(t,e,n,r,o){void 0===o&&(o=Promise);var a=new x(c(t,e,n,r),o);return i.isGeneratorFunction(e)?a:a.next().then(function(t){return t.done?t.value:a.next()})},I(S),a(S,o,"Generator"),S[r]=function(){return this},S.toString=function(){return"[object Generator]"},i.keys=function(n){var t,r=[];for(t in n)r.push(t);return r.reverse(),function t(){for(;r.length;){var e=r.pop();if(e in n)return t.value=e,t.done=!1,t}return t.done=!0,t}},i.values=k,E.prototype={constructor:E,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=s,this.done=!1,this.delegate=null,this.method="next",this.arg=s,this.tryEntries.forEach(P),!t)for(var e in this)"t"===e.charAt(0)&&u.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=s)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(n){if(this.done)throw n;var r=this;function t(t,e){return a.type="throw",a.arg=n,r.next=t,e&&(r.method="next",r.arg=s),!!e}for(var e=this.tryEntries.length-1;0<=e;--e){var o=this.tryEntries[e],a=o.completion;if("root"===o.tryLoc)return t("end");if(o.tryLoc<=this.prev){var i=u.call(o,"catchLoc"),c=u.call(o,"finallyLoc");if(i&&c){if(this.prev<o.catchLoc)return t(o.catchLoc,!0);if(this.prev<o.finallyLoc)return t(o.finallyLoc)}else if(i){if(this.prev<o.catchLoc)return t(o.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return t(o.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;0<=n;--n){var r=this.tryEntries[n];if(r.tryLoc<=this.prev&&u.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var o=r;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=e,o?(this.method="next",this.next=o.finallyLoc,m):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;0<=e;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),P(n),m}},catch:function(t){for(var e=this.tryEntries.length-1;0<=e;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r,o=n.completion;return"throw"===o.type&&(r=o.arg,P(n)),r}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:k(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=s),m}},i}(t.exports);try{regeneratorRuntime=e}catch(t){Function("r","regeneratorRuntime = r")(e)}}),e=t(function(t){function s(t,e,n,r,o,a,i){try{var c=t[a](i),s=c.value}catch(t){return void n(t)}c.done?e(s):Promise.resolve(s).then(r,o)}t.exports=function(c){return function(){var t=this,i=arguments;return new Promise(function(e,n){var r=c.apply(t,i);function o(t){s(r,e,n,o,a,"next",t)}function a(t){s(r,e,n,o,a,"throw",t)}o(void 0)})}},t.exports.default=t.exports,t.exports.__esModule=!0}),n=(c=e)&&c.__esModule&&Object.prototype.hasOwnProperty.call(c,"default")?c.default:c,r=document.querySelector("#lcTitleStatus"),w=document.querySelector("#lcISCNStatus");function g(t,e){var n=e.text,r=e.className,o=e.id,a=e.rel,i=e.target,e=e.href,t=document.createElement(t);return n&&(t.innerText=n),o&&t.setAttribute("id",o),r&&t.setAttribute("class",r),a&&t.setAttribute("rel",a),i&&t.setAttribute("target",i),e&&t.setAttribute("href",e),t}var o=lcStringInfo,a=o.mainStatusLoading,i=o.mainStatusLIKEPay,e=o.mainStatusUploadArweave,c=o.mainStatusRegisterISCN,S=o.buttonSubmitISCN,I=o.buttonRegisterISCN,x=o.draft,s={loading:a,onLIKEPay:i,onUploadArweave:e,onRegisterISCN:c};function b(t,e){r.textContent="";t=g("h1",{text:" · ",className:t}),e=g("h3",{text:e,className:"iscn-status-text"});r.appendChild(t),r.appendChild(e)}function P(t){return s[t]||"-"}function E(t,e){t&&(t.textContent="",t.appendChild(e))}function k(t,e){E(t,g("p",{text:e}))}function u(t){return l.apply(this,arguments)}function l(){return(l=n(y.mark(function t(e){var n,r,o,a,i,c,s,u,l,p,f,h,d,m,v;return y.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e&&e.preventDefault(),n=document.querySelector("#lcMattersStatus"),r=document.querySelector("#lcArweaveStatus"),o=document.querySelector("#lcIPFSStatus"),p=lcPostInfo,a=p.iscnHash,i=p.iscnId,c=p.isMattersPublished,t.next=7,jQuery.ajax({type:"POST",url:"".concat(wpApiSettings.root,"likecoin/v1/posts/").concat(wpApiSettings.postId,"/publish/refresh"),method:"POST",beforeSend:function(t){t.setRequestHeader("X-WP-Nonce",wpApiSettings.nonce)}});case 7:s=t.sent,m=s.matters,d=s.ipfs,f=s.arweave,p=s.wordpress_published,lcPostInfo.isMattersPublished=s.matters.status,lcPostInfo.mattersIPFSHash=s.matters.ipfs_hash,a&&i?(u=encodeURIComponent(i),b("iscn-status-green",lcStringInfo.mainTitleDone),l=g("a",{text:i,rel:"noopener",target:"_blank",href:"https://app.like.co/view/".concat(u)}),E(w,l)):"publish"!==p||"initial"!==lcPostInfo.mainStatus&&"failed"!==lcPostInfo.mainStatus?"publish"!==p?(b("iscn-status-red",lcStringInfo.mainTitleDraft),(u=g("button",{text:S,className:"button button-primary",id:"lcArweaveUploadBtn"})).disabled="disabled",l=g("p",{text:lcStringInfo.mainTitleDraft}),(p=document.createElement("div")).appendChild(u),p.appendChild(l),E(w,p)):(b("iscn-status-orange",lcStringInfo.mainTitleIntermediate),k(w,P(lcPostInfo.mainStatus))):(b("iscn-status-orange",lcStringInfo.mainTitleIntermediate),h=g("button",{text:f.url?I:S,className:"button button-primary",id:"lcArweaveUploadBtn"}),E(w,h),f.url?h.addEventListener("click",_):h.addEventListener("click",N)),f.url&&(h=f.url,f=f.arweave_id,h=g("a",{text:f,rel:"noopener",target:"_blank",href:h}),E(r,h)),d.url&&(v=d.url,d=d.hash,v=g("a",{text:d,rel:"noopener",target:"_blank",href:v}),E(o,v)),m.url&&(v=m.url,m=m.article_id,v="Published"===c?g("a",{text:m,rel:"noopener",target:"_blank",href:v}):0!==m.length?g("a",{text:x,rel:"noopener",target:"_blank",href:v}):g("p",{text:"-"}),E(n,v));case 16:case"end":return t.stop()}},t)}))).apply(this,arguments)}function v(t){return p.apply(this,arguments)}function p(){return(p=n(y.mark(function t(e){var n,r,o,a,i;return y.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if("https://like.co"!==e.origin)return t.abrupt("return");t.next=2;break;case 2:if(lcPostInfo.mainStatus="onRegisterISCN",t.prev=3,o=JSON.parse(e.data),a=o.action,n=o.data,"ISCN_SUBMITTED"!==a)return t.abrupt("return");t.next=7;break;case 7:if(r=n.tx_hash,o=n.error,a=n.success,i=n.iscnId,o||!1===a)throw new Error("REGISTER_ISCN_SERVER_ERROR");t.next=10;break;case 10:return t.next=12,jQuery.ajax({type:"POST",url:"".concat(wpApiSettings.root,"likecoin/v1/posts/").concat(wpApiSettings.postId,"/publish/iscn"),dataType:"json",contentType:"application/json; charset=UTF-8",data:JSON.stringify({iscnHash:r,iscnId:i}),method:"POST",beforeSend:function(t){t.setRequestHeader("X-WP-Nonce",wpApiSettings.nonce)}});case 12:lcPostInfo.iscnHash=r,lcPostInfo.iscnId=i,lcPostInfo.mainStatus="done",t.next=21;break;case 17:t.prev=17,t.t0=t.catch(3),console.error(t.t0),lcPostInfo.mainStatus="failed";case 21:return t.prev=21,t.next=24,u();case 24:return t.finish(21);case 25:case"end":return t.stop()}},t,null,[[3,17,21,25]])}))).apply(this,arguments)}function f(){return(f=n(y.mark(function t(e){var n,r,o,a;return y.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,lcPostInfo.mainStatus="onUploadArweave",k(w,P(lcPostInfo.mainStatus)),n=e.tx_hash,a=e.error,o=e.success,a||!1===o)return lcPostInfo.mainStatus="failed",t.abrupt("return");t.next=7;break;case 7:return t.next=9,jQuery.ajax({type:"POST",url:"".concat(wpApiSettings.root,"likecoin/v1/posts/").concat(wpApiSettings.postId,"/arweave/upload"),dataType:"json",contentType:"application/json; charset=UTF-8",data:JSON.stringify({txHash:n}),method:"POST",beforeSend:function(t){t.setRequestHeader("X-WP-Nonce",wpApiSettings.nonce)}});case 9:if((r=t.sent).data&&r.data.arweaveId){t.next=12;break}throw new Error("NO_ARWEAVE_ID_RETURNED");case 12:a=r.data,o=a.arweaveId,a=a.ipfsHash,lcPostInfo.arweaveIPFSHash=a,lcPostInfo.arweaveId=o,t.next=24;break;case 17:return t.prev=17,t.t0=t.catch(0),console.error("Error occurs when uploading to Arweave:"),console.error(t.t0),lcPostInfo.mainStatus="failed",t.next=24,u();case 24:case"end":return t.stop()}},t,null,[[0,17]])}))).apply(this,arguments)}function _(t){t&&t.preventDefault();var t=lcPostInfo,e=t.title,n=t.mattersIPFSHash,r=t.arweaveIPFSHash,o=t.tags,a=t.url,i=t.arweaveId,c=wpApiSettings.siteurl;lcPostInfo.mainStatus="onRegisterISCN",k(w,P(lcPostInfo.mainStatus));try{if(!n&&!r&&!i)throw new Error("NO_IPFS_HASH_NOR_ARWEAVE_ID_FOUND");var s,u,l=encodeURIComponent(e),p=(o||[]).join(","),f=encodeURIComponent(a),h=encodeURIComponent(c),d=[],m="";n&&(s="ipfs://".concat(n),d.push(s),m="matters"),r&&(u="ipfs://".concat(r),d.push(u)),i&&(u="ar://".concat(i),d.push(u));d=d.join(","),h="https://like.co/in/widget/iscn?fingerprint=".concat(d,"&publisher=").concat(m,"&title=").concat(l,"&tags=").concat(p,"&opener=1&blocking=1&url=").concat(f,"&redirect_uri=").concat(h);window.open(h,"likeCoISCNWindow","menubar=no,location=no,width=576,height=768"),window.addEventListener("message",v,!1)}catch(t){console.error("error occured when submitting ISCN:"),console.error(t),lcPostInfo.mainStatus="failed"}}function h(t){return d.apply(this,arguments)}function d(){return(d=n(y.mark(function t(e){var n,r;return y.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(e.preventDefault(),"https://like.co"!==e.origin)return t.abrupt("return");t.next=3;break;case 3:if(t.prev=3,r=JSON.parse(e.data),n=r.action,r=r.data,"TX_SUBMITTED"!==n)return t.abrupt("return");t.next=7;break;case 7:return lcPostInfo.mainStatus="onUploadArweave",t.next=10,function(){return f.apply(this,arguments)}(r);case 10:return t.next=12,Promise.all([u().catch(function(t){return console.error(t)}),_()]);case 12:t.next=18;break;case 14:t.prev=14,t.t0=t.catch(3),console.error(t.t0),lcPostInfo.mainStatus="failed";case 18:case"end":return t.stop()}},t,null,[[3,14]])}))).apply(this,arguments)}function N(t){return m.apply(this,arguments)}function m(){return(m=n(y.mark(function t(e){var n,r,o,a,i;return y.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.preventDefault(),lcPostInfo.mainStatus="loading",k(w,P(lcPostInfo.mainStatus)),t.prev=3,t.next=6,jQuery.ajax({type:"POST",url:"".concat(wpApiSettings.root,"likecoin/v1/posts/").concat(wpApiSettings.postId,"/arweave/estimate"),method:"POST",beforeSend:function(t){t.setRequestHeader("X-WP-Nonce",wpApiSettings.nonce)}});case 6:if(a=t.sent,n=a.ipfsHash,r=a.LIKE,o=a.memo,a=a.arweaveId,n&&a)return lcPostInfo.arweaveIPFSHash=n,lcPostInfo.arweaveId=a,lcPostInfo.mainStatus="onRegisterISCN",k(w,P(lcPostInfo.mainStatus)),i={arweaveIPFSHash:n,arweaveId:a},t.next=16,jQuery.ajax({type:"POST",url:"".concat(wpApiSettings.root,"likecoin/v1/posts/").concat(wpApiSettings.postId,"/arweave/save-metadata"),dataType:"json",contentType:"application/json; charset=UTF-8",data:JSON.stringify(i),method:"POST",beforeSend:function(t){t.setRequestHeader("X-WP-Nonce",wpApiSettings.nonce)}});t.next=22;break;case 16:if(t.sent.data){t.next=19;break}throw new Error("SERVER_ERROR");case 19:return t.next=21,_();case 21:return t.abrupt("return");case 22:if(r||o){t.next=24;break}throw new Error("CANNOT_GET_LIKE_ESTIMATE");case 24:a=wpApiSettings,i=a.siteurl,a=encodeURIComponent(o),i=encodeURIComponent(i),i="https://like.co/in/widget/pay?to=like-arweave&amount=".concat(r,"&remarks=").concat(a,"&opener=1&redirect_uri=").concat(i),window.open(i,"likePayWindow","menubar=no,location=no,width=576,height=768"),window.addEventListener("message",h,!1),lcPostInfo.mainStatus="onLIKEPay",k(w,P(lcPostInfo.mainStatus)),t.next=39;break;case 34:t.prev=34,t.t0=t.catch(3),console.error("error occured when trying to estimate LIKE cost: "),console.error(t.t0),lcPostInfo.mainStatus="failed";case 39:case"end":return t.stop()}},t,null,[[3,34]])}))).apply(this,arguments)}(c=document.getElementById("lcPublishRefreshBtn"))&&c.addEventListener("click",u),u()}();
//# sourceMappingURL=likecoin_metabox.js.map
