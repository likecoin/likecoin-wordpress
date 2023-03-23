!function(){const t="LikeCoin WordPress Plugin",e=document.querySelector("#lcTitleStatus"),n=document.querySelector("#lcISCNStatus");function o(t,e){let{text:n,className:o,id:s,rel:a,target:i,href:r}=e;const c=document.createElement(t);return n&&(c.innerText=n),s&&c.setAttribute("id",s),o&&c.setAttribute("class",o),a&&c.setAttribute("rel",a),i&&c.setAttribute("target",i),r&&c.setAttribute("href",r),c}const{mainStatusLoading:s,mainStatusFailedPopUp:a,mainStatusLIKEPay:i,mainStatusUploadArweave:r,mainStatusRegisterISCN:c,buttonSubmitISCN:l,buttonRegisterISCN:d,buttonUpdateISCN:u,draft:p}=lcStringInfo,f={loading:s,failedPopup:a,onLIKEPay:i,onUploadArweave:r,onRegisterISCN:c},S=`https://app.${window.wpApiSettings.likecoHost}`;function I(t,n){e.textContent="";const s=o("h1",{text:" · ",className:t}),a=o("h3",{text:n,className:"iscn-status-text"});e.appendChild(s),e.appendChild(a)}function m(t){return f[t]?f[t]:"-"}function h(t,e){t&&(t.textContent="",t.appendChild(e))}function w(t,e){h(t,o("p",{text:e}))}async function g(t){t&&t.preventDefault();const e=document.querySelector("#lcMattersStatus"),s=document.querySelector("#lcArweaveStatus"),a=document.querySelector("#lcIPFSStatus"),{iscnHash:i,iscnId:r,isMattersPublished:c,lastModifiedTime:f,iscnTimestamp:S}=lcPostInfo,g=await jQuery.ajax({type:"POST",url:`${wpApiSettings.root}likecoin/v1/posts/${wpApiSettings.postId}/iscn/refresh`,method:"POST",beforeSend:t=>{t.setRequestHeader("X-WP-Nonce",wpApiSettings.nonce)}}),{matters:P,ipfs:b,arweave:N}=g,T=g.wordpress_published;if(lcPostInfo.isMattersPublished=g.matters.status,lcPostInfo.mattersIPFSHash=g.matters.ipfs_hash,i&&r){const t=encodeURIComponent(r);I("iscn-status-green",lcStringInfo.mainTitleDone);const e=o("a",{text:r,rel:"noopener",target:"_blank",href:`https://app.${window.wpApiSettings.likecoHost}/view/${t}`});h(n,e)}if("publish"!==T||"initial"!==lcPostInfo.mainStatus&&!lcPostInfo.mainStatus.includes("failed")||r&&!(f>S))if("publish"!==T){I("iscn-status-red",lcStringInfo.mainTitleDraft);const t=o("button",{text:l,className:"button button-primary",id:"lcArweaveUploadBtn"});t.disabled="disabled";const e=o("p",{text:lcStringInfo.mainTitleDraft}),s=document.createElement("div");s.appendChild(t),s.appendChild(e),h(n,s)}else I("iscn-status-orange",lcStringInfo.mainTitleIntermediate),w(n,m(lcPostInfo.mainStatus));else{I("iscn-status-orange",lcStringInfo.mainTitleIntermediate);let t=N.url?d:l;r&&(t=u);const e=o("button",{text:t,className:"button button-primary",id:"lcArweaveUploadBtn"});h(n,e),e.addEventListener("click",y)}if(N.url){const{url:t}=N;h(s,o("a",{text:N.arweave_id,rel:"noopener",target:"_blank",href:t}))}if(b.url){const{url:t,hash:e}=b;h(a,o("a",{text:e,rel:"noopener",target:"_blank",href:t}))}if(P.url){const{url:t}=P,n=P.article_id;let s;s="Published"===c?o("a",{text:n,rel:"noopener",target:"_blank",href:t}):0!==n.length?o("a",{text:p,rel:"noopener",target:"_blank",href:t}):o("p",{text:"-"}),h(e,s)}}async function P(e){if(e.origin===S)try{const{action:o,data:s}=JSON.parse(e.data);"ISCN_WIDGET_READY"===o?async function(){const{ISCNWindow:e}=lcPostInfo;if(!e)throw new Error("POPUP_WINDOW_NOT_FOUND");e.postMessage(JSON.stringify({action:"INIT_WIDGET"}),S);try{const n=await jQuery.ajax({type:"GET",url:`${wpApiSettings.root}likecoin/v1/posts/${wpApiSettings.postId}/iscn/arweave/upload`,dataType:"json",method:"GET",beforeSend:t=>{t.setRequestHeader("X-WP-Nonce",wpApiSettings.nonce)}}),{files:o,title:s,tags:a,url:i,author:r,authorDescription:c,description:l,mattersIPFSHash:d}=n,u=[];if(d){const t=`ipfs://${d}`;u.push(t)}e.postMessage(JSON.stringify({action:"SUBMIT_ISCN_DATA",data:{files:o,metadata:{name:s,tags:a,url:i,author:r,authorDescription:c,description:l,fingerprints:u,type:"article",license:"",recordNotes:t,memo:t}}}),S)}catch(t){console.error("error occured when submitting ISCN:"),console.error(t),lcPostInfo.mainStatus="failed"}}():"ARWEAVE_SUBMITTED"===o?async function(t){const{ipfsHash:e,arweaveId:o}=t;if(e&&o){lcPostInfo.arweaveIPFSHash=e,lcPostInfo.arweaveId=o,w(n,m(lcPostInfo.mainStatus));const t={arweaveIPFSHash:e,arweaveId:o};try{await jQuery.ajax({type:"POST",url:`${wpApiSettings.root}likecoin/v1/posts/${wpApiSettings.postId}/iscn/arweave`,dataType:"json",contentType:"application/json; charset=UTF-8",data:JSON.stringify(t),method:"POST",beforeSend:t=>{t.setRequestHeader("X-WP-Nonce",wpApiSettings.nonce)}})}catch(t){console.error(t)}finally{await g()}}}(s):"ISCN_SUBMITTED"===o?async function(t){lcPostInfo.mainStatus="onRegisterISCN";try{const{tx_hash:e,error:n,success:o,iscnId:s}=t;if(n||!1===o)throw new Error("REGISTER_ISCN_SERVER_ERROR");await jQuery.ajax({type:"POST",url:`${wpApiSettings.root}likecoin/v1/posts/${wpApiSettings.postId}/iscn/metadata`,dataType:"json",contentType:"application/json; charset=UTF-8",data:JSON.stringify({iscnHash:e,iscnId:s}),method:"POST",beforeSend:t=>{t.setRequestHeader("X-WP-Nonce",wpApiSettings.nonce)}}),lcPostInfo.iscnHash=e,lcPostInfo.iscnId=s,lcPostInfo.mainStatus="done"}catch(t){console.error(t),lcPostInfo.mainStatus="failed"}finally{await g()}}(s):console.warn(`Unknown event: ${o}`)}catch(t){console.error(t)}}async function y(t){t&&t.preventDefault();const{siteurl:e}=wpApiSettings,{url:o}=lcPostInfo;lcPostInfo.mainStatus="onRegisterISCN",w(n,m(lcPostInfo.mainStatus));const s=encodeURIComponent(e),a=encodeURIComponent(lcPostInfo.iscnId||""),i=encodeURIComponent(o),r=`${S}/nft/url?opener=1&platform=wordpress&redirect_uri=${s}&url=${i}&iscn_id=${a}&update=${a?1:0}`,c=window.open(r,"likeCoISCNWindow","menubar=no,location=no,width=576,height=768");if(!c||c.closed||void 0===c.closed)return lcPostInfo.mainStatus="failedPopup",void w(n,m(lcPostInfo.mainStatus));lcPostInfo.ISCNWindow=c,lcPostInfo.mainStatus="initial",window.addEventListener("message",P,!1)}(()=>{const t=document.getElementById("lcPublishRefreshBtn");t&&t.addEventListener("click",g),g()})()}();