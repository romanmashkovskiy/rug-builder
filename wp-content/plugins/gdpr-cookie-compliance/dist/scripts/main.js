!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.postscribe=e():t.postscribe=e()}(this,function(){return function(t){function e(r){if(o[r])return o[r].exports;var n=o[r]={exports:{},id:r,loaded:!1};return t[r].call(n.exports,n,n.exports,e),n.loaded=!0,n.exports}var o={};return e.m=t,e.c=o,e.p="",e(0)}([function(t,e,o){"use strict";var r=o(1),n=function(t){return t&&t.__esModule?t:{default:t}}(r);t.exports=n.default},function(t,e,o){"use strict";function r(){}function n(){var t=h.shift();if(t){var e=l.last(t);e.afterDequeue(),t.stream=i.apply(void 0,t),e.afterStreamStart()}}function i(t,e,o){function i(t){t=o.beforeWrite(t),m.write(t),o.afterWrite(t)}m=new u.default(t,o),m.id=f++,m.name=o.name||m.id,s.streams[m.name]=m;var c=t.ownerDocument,p={close:c.close,open:c.open,write:c.write,writeln:c.writeln};a(c,{close:r,open:r,write:function(){for(var t=arguments.length,e=Array(t),o=0;o<t;o++)e[o]=arguments[o];return i(e.join(""))},writeln:function(){for(var t=arguments.length,e=Array(t),o=0;o<t;o++)e[o]=arguments[o];return i(e.join("")+"\n")}});var l=m.win.onerror||r;return m.win.onerror=function(t,e,r){o.error({msg:t+" - "+e+": "+r}),l.apply(m.win,[t,e,r])},m.write(e,function(){a(c,p),m.win.onerror=l,o.done(),m=null,n()}),m}function s(t,e,o){if(l.isFunction(o))o={done:o};else if("clear"===o)return h=[],m=null,void(f=0);o=l.defaults(o,d),t=/^#/.test(t)?window.document.getElementById(t.substr(1)):t.jquery?t[0]:t;var i=[t,e,o];return t.postscribe={cancel:function(){i.stream?i.stream.abort():i[1]=r}},o.beforeEnqueue(i),h.push(i),m||n(),t.postscribe}e.__esModule=!0;var a=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var o=arguments[e];for(var r in o)Object.prototype.hasOwnProperty.call(o,r)&&(t[r]=o[r])}return t};e.default=s;var c=o(2),u=function(t){return t&&t.__esModule?t:{default:t}}(c),p=o(4),l=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e.default=t,e}(p),d={afterAsync:r,afterDequeue:r,afterStreamStart:r,afterWrite:r,autoFix:!0,beforeEnqueue:r,beforeWriteToken:function(t){return t},beforeWrite:function(t){return t},done:r,error:function(t){throw new Error(t.msg)},releaseAsync:!1},f=0,h=[],m=null;a(s,{streams:{},queue:h,WriteStream:u.default})},function(t,e,o){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function n(t,e){var o=l+e,r=t.getAttribute(o);return p.existy(r)?String(r):r}function i(t,e){var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,r=l+e;p.existy(o)&&""!==o?t.setAttribute(r,o):t.removeAttribute(r)}e.__esModule=!0;var s=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var o=arguments[e];for(var r in o)Object.prototype.hasOwnProperty.call(o,r)&&(t[r]=o[r])}return t},a=o(3),c=function(t){return t&&t.__esModule?t:{default:t}}(a),u=o(4),p=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e.default=t,e}(u),l="data-ps-",d="ps-style",f="ps-script",h=function(){function t(e){var o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};r(this,t),this.root=e,this.options=o,this.doc=e.ownerDocument,this.win=this.doc.defaultView||this.doc.parentWindow,this.parser=new c.default("",{autoFix:o.autoFix}),this.actuals=[e],this.proxyHistory="",this.proxyRoot=this.doc.createElement(e.nodeName),this.scriptStack=[],this.writeQueue=[],i(this.proxyRoot,"proxyof",0)}return t.prototype.write=function(){var t;for((t=this.writeQueue).push.apply(t,arguments);!this.deferredRemote&&this.writeQueue.length;){var e=this.writeQueue.shift();p.isFunction(e)?this._callFunction(e):this._writeImpl(e)}},t.prototype._callFunction=function(t){var e={type:"function",value:t.name||t.toString()};this._onScriptStart(e),t.call(this.win,this.doc),this._onScriptDone(e)},t.prototype._writeImpl=function(t){this.parser.append(t);for(var e=void 0,o=void 0,r=void 0,n=[];(e=this.parser.readToken())&&!(o=p.isScript(e))&&!(r=p.isStyle(e));)(e=this.options.beforeWriteToken(e))&&n.push(e);n.length>0&&this._writeStaticTokens(n),o&&this._handleScriptToken(e),r&&this._handleStyleToken(e)},t.prototype._writeStaticTokens=function(t){var e=this._buildChunk(t);return e.actual?(e.html=this.proxyHistory+e.actual,this.proxyHistory+=e.proxy,this.proxyRoot.innerHTML=e.html,this._walkChunk(),e):null},t.prototype._buildChunk=function(t){for(var e=this.actuals.length,o=[],r=[],n=[],i=t.length,s=0;s<i;s++){var a=t[s],c=a.toString();if(o.push(c),a.attrs){if(!/^noscript$/i.test(a.tagName)){var u=e++;r.push(c.replace(/(\/?>)/," "+l+"id="+u+" $1")),a.attrs.id!==f&&a.attrs.id!==d&&n.push("atomicTag"===a.type?"":"<"+a.tagName+" "+l+"proxyof="+u+(a.unary?" />":">"))}}else r.push(c),n.push("endTag"===a.type?c:"")}return{tokens:t,raw:o.join(""),actual:r.join(""),proxy:n.join("")}},t.prototype._walkChunk=function(){for(var t=void 0,e=[this.proxyRoot];p.existy(t=e.shift());){var o=1===t.nodeType;if(!(o&&n(t,"proxyof"))){o&&(this.actuals[n(t,"id")]=t,i(t,"id"));var r=t.parentNode&&n(t.parentNode,"proxyof");r&&this.actuals[r].appendChild(t)}e.unshift.apply(e,p.toArray(t.childNodes))}},t.prototype._handleScriptToken=function(t){var e=this,o=this.parser.clear();o&&this.writeQueue.unshift(o),t.src=t.attrs.src||t.attrs.SRC,(t=this.options.beforeWriteToken(t))&&(t.src&&this.scriptStack.length?this.deferredRemote=t:this._onScriptStart(t),this._writeScriptToken(t,function(){e._onScriptDone(t)}))},t.prototype._handleStyleToken=function(t){var e=this.parser.clear();e&&this.writeQueue.unshift(e),t.type=t.attrs.type||t.attrs.TYPE||"text/css",t=this.options.beforeWriteToken(t),t&&this._writeStyleToken(t),e&&this.write()},t.prototype._writeStyleToken=function(t){var e=this._buildStyle(t);this._insertCursor(e,d),t.content&&(e.styleSheet&&!e.sheet?e.styleSheet.cssText=t.content:e.appendChild(this.doc.createTextNode(t.content)))},t.prototype._buildStyle=function(t){var e=this.doc.createElement(t.tagName);return e.setAttribute("type",t.type),p.eachKey(t.attrs,function(t,o){e.setAttribute(t,o)}),e},t.prototype._insertCursor=function(t,e){this._writeImpl('<span id="'+e+'"/>');var o=this.doc.getElementById(e);o&&o.parentNode.replaceChild(t,o)},t.prototype._onScriptStart=function(t){t.outerWrites=this.writeQueue,this.writeQueue=[],this.scriptStack.unshift(t)},t.prototype._onScriptDone=function(t){return t!==this.scriptStack[0]?void this.options.error({msg:"Bad script nesting or script finished twice"}):(this.scriptStack.shift(),this.write.apply(this,t.outerWrites),void(!this.scriptStack.length&&this.deferredRemote&&(this._onScriptStart(this.deferredRemote),this.deferredRemote=null)))},t.prototype._writeScriptToken=function(t,e){var o=this._buildScript(t),r=this._shouldRelease(o),n=this.options.afterAsync;t.src&&(o.src=t.src,this._scriptLoadHandler(o,r?n:function(){e(),n()}));try{this._insertCursor(o,f),o.src&&!r||e()}catch(t){this.options.error(t),e()}},t.prototype._buildScript=function(t){var e=this.doc.createElement(t.tagName);return p.eachKey(t.attrs,function(t,o){e.setAttribute(t,o)}),t.content&&(e.text=t.content),e},t.prototype._scriptLoadHandler=function(t,e){function o(){t=t.onload=t.onreadystatechange=t.onerror=null}function r(){o(),null!=e&&e(),e=null}function n(t){o(),a(t),null!=e&&e(),e=null}function i(t,e){var o=t["on"+e];null!=o&&(t["_on"+e]=o)}var a=this.options.error;i(t,"load"),i(t,"error"),s(t,{onload:function(){if(t._onload)try{t._onload.apply(this,Array.prototype.slice.call(arguments,0))}catch(e){n({msg:"onload handler failed "+e+" @ "+t.src})}r()},onerror:function(){if(t._onerror)try{t._onerror.apply(this,Array.prototype.slice.call(arguments,0))}catch(e){return void n({msg:"onerror handler failed "+e+" @ "+t.src})}n({msg:"remote script failed "+t.src})},onreadystatechange:function(){/^(loaded|complete)$/.test(t.readyState)&&r()}})},t.prototype._shouldRelease=function(t){return!/^script$/i.test(t.nodeName)||!!(this.options.releaseAsync&&t.src&&t.hasAttribute("async"))},t}();e.default=h},function(t,e,o){!function(e,o){t.exports=function(){return function(t){function e(r){if(o[r])return o[r].exports;var n=o[r]={exports:{},id:r,loaded:!1};return t[r].call(n.exports,n,n.exports,e),n.loaded=!0,n.exports}var o={};return e.m=t,e.c=o,e.p="",e(0)}([function(t,e,o){"use strict";var r=o(1),n=function(t){return t&&t.__esModule?t:{default:t}}(r);t.exports=n.default},function(t,e,o){"use strict";function r(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e.default=t,e}function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}e.__esModule=!0;var i=o(2),s=r(i),a=o(3),c=r(a),u=o(6),p=function(t){return t&&t.__esModule?t:{default:t}}(u),l=o(5),d={comment:/^<!--/,endTag:/^<\//,atomicTag:/^<\s*(script|style|noscript|iframe|textarea)[\s\/>]/i,startTag:/^</,chars:/^[^<]/},f=function(){function t(){var e=this,o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};n(this,t),this.stream=o;var i=!1,a={};for(var c in s)s.hasOwnProperty(c)&&(r.autoFix&&(a[c+"Fix"]=!0),i=i||a[c+"Fix"]);i?(this._readToken=(0,p.default)(this,a,function(){return e._readTokenImpl()}),this._peekToken=(0,p.default)(this,a,function(){return e._peekTokenImpl()})):(this._readToken=this._readTokenImpl,this._peekToken=this._peekTokenImpl)}return t.prototype.append=function(t){this.stream+=t},t.prototype.prepend=function(t){this.stream=t+this.stream},t.prototype._readTokenImpl=function(){var t=this._peekTokenImpl();if(t)return this.stream=this.stream.slice(t.length),t},t.prototype._peekTokenImpl=function(){for(var t in d)if(d.hasOwnProperty(t)&&d[t].test(this.stream)){var e=c[t](this.stream);if(e)return"startTag"===e.type&&/script|style/i.test(e.tagName)?null:(e.text=this.stream.substr(0,e.length),e)}},t.prototype.peekToken=function(){return this._peekToken()},t.prototype.readToken=function(){return this._readToken()},t.prototype.readTokens=function(t){for(var e=void 0;e=this.readToken();)if(t[e.type]&&!1===t[e.type](e))return},t.prototype.clear=function(){var t=this.stream;return this.stream="",t},t.prototype.rest=function(){return this.stream},t}();e.default=f,f.tokenToString=function(t){return t.toString()},f.escapeAttributes=function(t){var e={};for(var o in t)t.hasOwnProperty(o)&&(e[o]=(0,l.escapeQuotes)(t[o],null));return e},f.supports=s;for(var h in s)s.hasOwnProperty(h)&&(f.browserHasFlaw=f.browserHasFlaw||!s[h]&&h)},function(t,e){"use strict";e.__esModule=!0;var o=!1,r=!1,n=window.document.createElement("div");try{var i="<P><I></P></I>";n.innerHTML=i,e.tagSoup=o=n.innerHTML!==i}catch(t){e.tagSoup=o=!1}try{n.innerHTML="<P><i><P></P></i></P>",e.selfClose=r=2===n.childNodes.length}catch(t){e.selfClose=r=!1}n=null,e.tagSoup=o,e.selfClose=r},function(t,e,o){"use strict";function r(t){var e=t.indexOf("--\x3e");if(e>=0)return new u.CommentToken(t.substr(4,e-1),e+3)}function n(t){var e=t.indexOf("<");return new u.CharsToken(e>=0?e:t.length)}function i(t){if(-1!==t.indexOf(">")){var e=t.match(p.startTag);if(e){var o=function(){var t={},o={},r=e[2];return e[2].replace(p.attr,function(e,n){arguments[2]||arguments[3]||arguments[4]||arguments[5]?arguments[5]?(t[arguments[5]]="",o[arguments[5]]=!0):t[n]=arguments[2]||arguments[3]||arguments[4]||p.fillAttr.test(n)&&n||"":t[n]="",r=r.replace(e,"")}),{v:new u.StartTagToken(e[1],e[0].length,t,o,!!e[3],r.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,""))}}();if("object"===(void 0===o?"undefined":c(o)))return o.v}}}function s(t){var e=i(t);if(e){var o=t.slice(e.length);if(o.match(new RegExp("</\\s*"+e.tagName+"\\s*>","i"))){var r=o.match(new RegExp("([\\s\\S]*?)</\\s*"+e.tagName+"\\s*>","i"));if(r)return new u.AtomicTagToken(e.tagName,r[0].length+e.length,e.attrs,e.booleanAttrs,r[1])}}}function a(t){var e=t.match(p.endTag);if(e)return new u.EndTagToken(e[1],e[0].length)}e.__esModule=!0;var c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};e.comment=r,e.chars=n,e.startTag=i,e.atomicTag=s,e.endTag=a;var u=o(4),p={startTag:/^<([\-A-Za-z0-9_]+)((?:\s+[\w\-]+(?:\s*=?\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,endTag:/^<\/([\-A-Za-z0-9_]+)[^>]*>/,attr:/(?:([\-A-Za-z0-9_]+)\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))|(?:([\-A-Za-z0-9_]+)(\s|$)+)/g,fillAttr:/^(checked|compact|declare|defer|disabled|ismap|multiple|nohref|noresize|noshade|nowrap|readonly|selected)$/i}},function(t,e,o){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}e.__esModule=!0,e.EndTagToken=e.AtomicTagToken=e.StartTagToken=e.TagToken=e.CharsToken=e.CommentToken=e.Token=void 0;var n=o(5),i=(e.Token=function t(e,o){r(this,t),this.type=e,this.length=o,this.text=""},e.CommentToken=function(){function t(e,o){r(this,t),this.type="comment",this.length=o||(e?e.length:0),this.text="",this.content=e}return t.prototype.toString=function(){return"\x3c!--"+this.content},t}(),e.CharsToken=function(){function t(e){r(this,t),this.type="chars",this.length=e,this.text=""}return t.prototype.toString=function(){return this.text},t}(),e.TagToken=function(){function t(e,o,n,i,s){r(this,t),this.type=e,this.length=n,this.text="",this.tagName=o,this.attrs=i,this.booleanAttrs=s,this.unary=!1,this.html5Unary=!1}return t.formatTag=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,o="<"+t.tagName;for(var r in t.attrs)if(t.attrs.hasOwnProperty(r)){o+=" "+r;var i=t.attrs[r];void 0!==t.booleanAttrs&&void 0!==t.booleanAttrs[r]||(o+='="'+(0,n.escapeQuotes)(i)+'"')}return t.rest&&(o+=" "+t.rest),o+=t.unary&&!t.html5Unary?"/>":">",void 0!==e&&null!==e&&(o+=e+"</"+t.tagName+">"),o},t}());e.StartTagToken=function(){function t(e,o,n,i,s,a){r(this,t),this.type="startTag",this.length=o,this.text="",this.tagName=e,this.attrs=n,this.booleanAttrs=i,this.html5Unary=!1,this.unary=s,this.rest=a}return t.prototype.toString=function(){return i.formatTag(this)},t}(),e.AtomicTagToken=function(){function t(e,o,n,i,s){r(this,t),this.type="atomicTag",this.length=o,this.text="",this.tagName=e,this.attrs=n,this.booleanAttrs=i,this.unary=!1,this.html5Unary=!1,this.content=s}return t.prototype.toString=function(){return i.formatTag(this,this.content)},t}(),e.EndTagToken=function(){function t(e,o){r(this,t),this.type="endTag",this.length=o,this.text="",this.tagName=e}return t.prototype.toString=function(){return"</"+this.tagName+">"},t}()},function(t,e){"use strict";function o(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return t?t.replace(/([^"]*)"/g,function(t,e){return/\\/.test(e)?e+'"':e+'\\"'}):e}e.__esModule=!0,e.escapeQuotes=o},function(t,e){"use strict";function o(t){return t&&"startTag"===t.type&&(t.unary=a.test(t.tagName)||t.unary,t.html5Unary=!/\/>$/.test(t.text)),t}function r(t,e){var r=t.stream,n=o(e());return t.stream=r,n}function n(t,e){var o=e.pop();t.prepend("</"+o.tagName+">")}function i(){var t=[];return t.last=function(){return this[this.length-1]},t.lastTagNameEq=function(t){var e=this.last();return e&&e.tagName&&e.tagName.toUpperCase()===t.toUpperCase()},t.containsTagName=function(t){for(var e,o=0;e=this[o];o++)if(e.tagName===t)return!0;return!1},t}function s(t,e,s){function a(){var e=r(t,s);e&&p[e.type]&&p[e.type](e)}var u=i(),p={startTag:function(o){var r=o.tagName;"TR"===r.toUpperCase()&&u.lastTagNameEq("TABLE")?(t.prepend("<TBODY>"),a()):e.selfCloseFix&&c.test(r)&&u.containsTagName(r)?u.lastTagNameEq(r)?n(t,u):(t.prepend("</"+o.tagName+">"),a()):o.unary||u.push(o)},endTag:function(o){u.last()?e.tagSoupFix&&!u.lastTagNameEq(o.tagName)?n(t,u):u.pop():e.tagSoupFix&&(s(),a())}};return function(){return a(),o(s())}}e.__esModule=!0,e.default=s;var a=/^(AREA|BASE|BASEFONT|BR|COL|FRAME|HR|IMG|INPUT|ISINDEX|LINK|META|PARAM|EMBED)$/i,c=/^(COLGROUP|DD|DT|LI|OPTIONS|P|TD|TFOOT|TH|THEAD|TR)$/i}])}()}()},function(t,e){"use strict";function o(t){return void 0!==t&&null!==t}function r(t){return"function"==typeof t}function n(t,e,o){var r=void 0,n=t&&t.length||0;for(r=0;r<n;r++)e.call(o,t[r],r)}function i(t,e,o){for(var r in t)t.hasOwnProperty(r)&&e.call(o,r,t[r])}function s(t,e){return t=t||{},i(e,function(e,r){o(t[e])||(t[e]=r)}),t}function a(t){try{return Array.prototype.slice.call(t)}catch(o){var e=function(){var e=[];return n(t,function(t){e.push(t)}),{v:e}}();if("object"===(void 0===e?"undefined":d(e)))return e.v}}function c(t){return t[t.length-1]}function u(t,e){return!(!t||"startTag"!==t.type&&"atomicTag"!==t.type||!("tagName"in t)||!~t.tagName.toLowerCase().indexOf(e))}function p(t){return u(t,"script")}function l(t){return u(t,"style")}e.__esModule=!0;var d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};e.existy=o,e.isFunction=r,e.each=n,e.eachKey=i,e.defaults=s,e.toArray=a,e.last=c,e.isTag=u,e.isScript=p,e.isStyle=l}])}),function(t){var e={common:{init:function(){"use strict";function e(){n("moove_gdpr_popup",JSON.stringify({strict:"1",thirdparty:"1",advanced:"1"}),365),location.reload()}function o(){t("#moove_gdpr_cookie_info_bar").addClass("moove-gdpr-info-bar-hidden")}function r(){t("#moove_gdpr_cookie_info_bar").removeClass("moove-gdpr-info-bar-hidden"),t("#moove_gdpr_save_popup_settings_button").hide()}function n(t,e,o){var r;if(o){var n=new Date;n.setTime(n.getTime()+24*o*60*60*1e3),r="; expires="+n.toGMTString()}else r="";document.cookie=encodeURIComponent(t)+"="+encodeURIComponent(e)+r+"; path=/"}function i(t){for(var e=encodeURIComponent(t)+"=",o=document.cookie.split(";"),r=0;r<o.length;r++){for(var n=o[r];" "===n.charAt(0);)n=n.substring(1,n.length);if(0===n.indexOf(e))return decodeURIComponent(n.substring(e.length,n.length))}return null}function s(){var e=!0;t("#moove_gdpr_cookie_modal").find("input[type=checkbox]").each(function(){t(this).is(":checked")||(e=!1)}),e?t(".moove-gdpr-button-holder .moove-gdpr-modal-allow-all").hide():t(".moove-gdpr-button-holder .moove-gdpr-modal-allow-all").show()}function a(){var e=i("moove_gdpr_popup"),r="0",s="0",a="0",c=!1;e&&(r=e.strict,s=e.advanced,a=e.thirdparty),t("#moove_gdpr_strict_cookies").is(":checked")?(r="1",c=!0):r="0",t("#moove_gdpr_performance_cookies").is(":checked")?(a="1",c=!0):a="0",t("#moove_gdpr_advanced_cookies").is(":checked")?(s="1",c=!0):s="0",!e&&c?(n("moove_gdpr_popup",JSON.stringify({strict:r,thirdparty:a,advanced:s}),365),o()):e&&n("moove_gdpr_popup",JSON.stringify({strict:r,thirdparty:a,advanced:s}),365);var e=i("moove_gdpr_popup");e&&"0"===e.strict&&"0"===e.advanced&&"0"===e.thirdparty&&(d("moove_gdpr_popup"),location.reload())}if("undefined"==typeof lity){var c=moove_frontend_gdpr_scripts.plugin_dir+"/dist/scripts/lity.js";console.log(c);var u=moove_frontend_gdpr_scripts.plugin_dir+"/dist/styles/lity.css";postscribe(document.body,'<script src="'+c+'"><\/script>'),postscribe(document.head,'<link href="'+u+'" rel="stylesheet">')}var p="",l=!1;if(window.location.hash){"moove_gdpr_cookie_modal"===window.location.hash.substring(1)&&(l=!0,setTimeout(function(){p=lity("#moove_gdpr_cookie_modal"),t(".lity").addClass("moove_gdpr_cookie_modal_open")},500))}!function(){if(location.pathname,t("#moove_gdpr_save_popup_settings_button").show(),document.cookie.indexOf("moove_gdpr_popup")>=0){var e=i("moove_gdpr_popup");e?(e=JSON.parse(e),t.post(moove_frontend_gdpr_scripts.ajaxurl,{action:"moove_gdpr_get_scripts",strict:e.strict,thirdparty:e.thirdparty,advanced:e.advanced},function(e){var o=JSON.parse(e);o.header&&postscribe(document.head,o.header),o.body&&t(o.body).prependTo(document.body),o.footer&&postscribe(document.body,o.footer)})):r()}else r()}(),t(document).on("click",'[data-href*="#moove_gdpr_cookie_modal"],[href*="#moove_gdpr_cookie_modal"]',function(e){e.preventDefault(),l=!0,p=lity("#moove_gdpr_cookie_modal"),t(".lity").addClass("moove_gdpr_cookie_modal_open")}),t(document).on("click","#moove_gdpr_cookie_info_bar .moove-gdpr-close-modal-button a, #moove_gdpr_cookie_info_bar .moove-gdpr-close-modal-button button",function(t){t.preventDefault(),o()}),t(document).on("click",".moove-gdpr-modal-close",function(e){e.preventDefault(),t(".lity .lity-close").click()}),t(document).on("click","#moove-gdpr-menu .moove-gdpr-tab-nav",function(e){e.preventDefault(),e.stopPropagation(),t("#moove-gdpr-menu li").removeClass("menu-item-selected"),t(this).parent().addClass("menu-item-selected"),t(".moove-gdpr-tab-content .moove-gdpr-tab-main").hide(),t(t(this).attr("href")).show(),t(t(this).attr("data-href")).show()}),t(document).on("lity:close",function(t,e){l&&(a(),l=!1)}),t(document).on("lity:open",function(e,o){if(l){var r=i("moove_gdpr_popup");t(".moove-gdpr-status-bar input[type=checkbox]").each(function(){t(this).is(":checked")?t(this).closest(".moove-gdpr-tab-main").find(".moove-gdpr-strict-warning-message").slideUp():t(this).closest(".moove-gdpr-tab-main").find(".moove-gdpr-strict-warning-message").slideDown()}),r&&(r=JSON.parse(r),"1"===r.strict?t("#moove_gdpr_strict_cookies").is(":checked")||t("#moove_gdpr_strict_cookies").click():t("#moove_gdpr_strict_cookies").is(":checked")&&t("#moove_gdpr_strict_cookies").click(),"1"===r.thirdparty?t("#moove_gdpr_performance_cookies").is(":checked")||t("#moove_gdpr_performance_cookies").click():t("#moove_gdpr_performance_cookies").is(":checked")&&t("#moove_gdpr_performance_cookies").click(),"1"===r.advanced?t("#moove_gdpr_advanced_cookies").is(":checked")||t("#moove_gdpr_advanced_cookies").click():t("#moove_gdpr_advanced_cookies").is(":checked")&&t("#moove_gdpr_advanced_cookies").click()),t(".moove-gdpr-modal-save-settings").hide()}}),t(document).on("click",".fl-disabled",function(e){t(".moove-gdpr-tab-main").hide(),t("#moove-gdpr-menu li").removeClass("menu-item-selected"),t(".menu-item-strict-necesarry-cookies").addClass("menu-item-selected"),t("#strict-necesarry-cookies").show()}),t(document).on("change",".moove-gdpr-status-bar input[type=checkbox]",function(e){t(".moove-gdpr-modal-save-settings").show();var o=t(this).closest(".moove-gdpr-tab-main").attr("id");t(this).closest(".moove-gdpr-status-bar").toggleClass("checkbox-selected"),t(this).closest(".moove-gdpr-tab-main").toggleClass("checkbox-selected"),t("#moove-gdpr-menu .menu-item-"+o).toggleClass("menu-item-off"),t(this).is(":checked")?t(this).closest(".moove-gdpr-tab-main").find(".moove-gdpr-strict-warning-message").slideUp():t(this).closest(".moove-gdpr-tab-main").find(".moove-gdpr-strict-warning-message").slideDown(),t(this).is("#moove_gdpr_strict_cookies")&&(t(this).is(":checked")?(t("#third_party_cookies fieldset").removeClass("fl-disabled"),t("#moove_gdpr_performance_cookies").prop("disabled",!1),t("#advanced-cookies fieldset").removeClass("fl-disabled"),t("#moove_gdpr_advanced_cookies").prop("disabled",!1)):(t("#third_party_cookies fieldset").addClass("fl-disabled").closest(".moove-gdpr-status-bar").removeClass("checkbox-selected"),t("#moove_gdpr_performance_cookies").prop("disabled",!0).prop("checked",!1),t("#advanced-cookies fieldset").addClass("fl-disabled").closest(".moove-gdpr-status-bar").removeClass("checkbox-selected"),t("#moove_gdpr_advanced_cookies").prop("disabled",!0).prop("checked",!1))),s()}),t(document).on("click",".moove-gdpr-modal-allow-all",function(r){r.preventDefault(),t("#moove_gdpr_cookie_modal").find("input[type=checkbox]").each(function(){var r=t(this);r.is(":checked")||r.click(),e(),t(".lity .lity-close").click(),o()})}),t(document).on("click",".moove-gdpr-infobar-allow-all",function(t){t.preventDefault(),e()}),t(document).on("click",".moove-gdpr-modal-save-settings",function(e){e.preventDefault(),a(),t(".lity .lity-close").click(),location.reload()});var d=function(t){document.cookie=t+"=;expires=Thu, 01 Jan 1970 00:00:01 GMT;"}},finalize:function(){}}},o={fire:function(t,o,r){var n,i=e;o=void 0===o?"init":o,n=""!==t,n=n&&i[t],(n=n&&"function"==typeof i[t][o])&&i[t][o](r)},loadEvents:function(){o.fire("common"),t.each(document.body.className.replace(/-/g,"_").split(/\s+/),function(t,e){o.fire(e),o.fire(e,"finalize")}),o.fire("common","finalize")}};t(document).ready(o.loadEvents)}(jQuery);