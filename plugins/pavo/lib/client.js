window.__ModuleLoader__.load({
  id: '@dddrop/dsh-plugin-pavo',
  factory: (require) => {
    const module = { exports: {} }
    const exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
    const React = require('react')
    const XYFlow = (() => {
      const module = { exports: {} }
      const exports = module.exports
      var Td=(E,P)=>()=>{try{return P||E((P={exports:{}}).exports,P),P.exports}catch(_){throw P=0,_}};var Fa=Td((Nn,Ya)=>{(function(E,P){typeof Nn=="object"&&typeof Ya<"u"?P(Nn,require("react/jsx-runtime"),require("react"),require("react-dom")):typeof define=="function"&&define.amd?define(["exports","react/jsx-runtime","react","react-dom"],P):P((E=typeof globalThis<"u"?globalThis:E||self).ReactFlow={},E.jsxRuntime,E.React,E.ReactDOM)})(Nn,function(E,P,_,kn){"use strict";function me(e){if(typeof e=="string"||typeof e=="number")return""+e;let t="";if(Array.isArray(e))for(let n,o=0;o<e.length;o++)(n=me(e[o]))!==""&&(t+=(t&&" ")+n);else for(let n in e)e[n]&&(t+=(t&&" ")+n);return t}var Wa={value:()=>{}};function Zt(){for(var e,t=0,n=arguments.length,o={};t<n;++t){if(!(e=arguments[t]+"")||e in o||/[\s.]/.test(e))throw new Error("illegal type: "+e);o[e]=[]}return new Xt(o)}function Xt(e){this._=e}function Ka(e,t){for(var n,o=0,r=e.length;o<r;++o)if((n=e[o]).name===t)return n.value}function Oo(e,t,n){for(var o=0,r=e.length;o<r;++o)if(e[o].name===t){e[o]=Wa,e=e.slice(0,o).concat(e.slice(o+1));break}return n!=null&&e.push({name:t,value:n}),e}Xt.prototype=Zt.prototype={constructor:Xt,on:function(e,t){var n,o,r=this._,i=(o=r,(e+"").trim().split(/^|\s+/).map(function(l){var c="",u=l.indexOf(".");if(u>=0&&(c=l.slice(u+1),l=l.slice(0,u)),l&&!o.hasOwnProperty(l))throw new Error("unknown type: "+l);return{type:l,name:c}})),a=-1,s=i.length;if(!(arguments.length<2)){if(t!=null&&typeof t!="function")throw new Error("invalid callback: "+t);for(;++a<s;)if(n=(e=i[a]).type)r[n]=Oo(r[n],e.name,t);else if(t==null)for(n in r)r[n]=Oo(r[n],e.name,null);return this}for(;++a<s;)if((n=(e=i[a]).type)&&(n=Ka(r[n],e.name)))return n},copy:function(){var e={},t=this._;for(var n in t)e[n]=t[n].slice();return new Xt(e)},call:function(e,t){if((n=arguments.length-2)>0)for(var n,o,r=new Array(n),i=0;i<n;++i)r[i]=arguments[i+2];if(!this._.hasOwnProperty(e))throw new Error("unknown type: "+e);for(i=0,n=(o=this._[e]).length;i<n;++i)o[i].value.apply(t,r)},apply:function(e,t,n){if(!this._.hasOwnProperty(e))throw new Error("unknown type: "+e);for(var o=this._[e],r=0,i=o.length;r<i;++r)o[r].value.apply(t,n)}};var _n="http://www.w3.org/1999/xhtml",Ao={svg:"http://www.w3.org/2000/svg",xhtml:_n,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};function Yt(e){var t=e+="",n=t.indexOf(":");return n>=0&&(t=e.slice(0,n))!=="xmlns"&&(e=e.slice(n+1)),Ao.hasOwnProperty(t)?{space:Ao[t],local:e}:e}function qa(e){return function(){var t=this.ownerDocument,n=this.namespaceURI;return n===_n&&t.documentElement.namespaceURI===_n?t.createElement(e):t.createElementNS(n,e)}}function Ga(e){return function(){return this.ownerDocument.createElementNS(e.space,e.local)}}function Do(e){var t=Yt(e);return(t.local?Ga:qa)(t)}function Ua(){}function Pn(e){return e==null?Ua:function(){return this.querySelector(e)}}function Qa(){return[]}function Ro(e){return e==null?Qa:function(){return this.querySelectorAll(e)}}function Ja(e){return function(){return(t=e.apply(this,arguments))==null?[]:Array.isArray(t)?t:Array.from(t);var t}}function Lo(e){return function(){return this.matches(e)}}function $o(e){return function(t){return t.matches(e)}}var es=Array.prototype.find;function ts(){return this.firstElementChild}var ns=Array.prototype.filter;function os(){return Array.from(this.children)}function To(e){return new Array(e.length)}function Ft(e,t){this.ownerDocument=e.ownerDocument,this.namespaceURI=e.namespaceURI,this._next=null,this._parent=e,this.__data__=t}function rs(e,t,n,o,r,i){for(var a,s=0,l=t.length,c=i.length;s<c;++s)(a=t[s])?(a.__data__=i[s],o[s]=a):n[s]=new Ft(e,i[s]);for(;s<l;++s)(a=t[s])&&(r[s]=a)}function is(e,t,n,o,r,i,a){var s,l,c,u=new Map,d=t.length,h=i.length,y=new Array(d);for(s=0;s<d;++s)(l=t[s])&&(y[s]=c=a.call(l,l.__data__,s,t)+"",u.has(c)?r[s]=l:u.set(c,l));for(s=0;s<h;++s)c=a.call(e,i[s],s,i)+"",(l=u.get(c))?(o[s]=l,l.__data__=i[s],u.delete(c)):n[s]=new Ft(e,i[s]);for(s=0;s<d;++s)(l=t[s])&&u.get(y[s])===l&&(r[s]=l)}function as(e){return e.__data__}function ss(e){return typeof e=="object"&&"length"in e?e:Array.from(e)}function cs(e,t){return e<t?-1:e>t?1:e>=t?0:NaN}function ls(e){return function(){this.removeAttribute(e)}}function us(e){return function(){this.removeAttributeNS(e.space,e.local)}}function ds(e,t){return function(){this.setAttribute(e,t)}}function hs(e,t){return function(){this.setAttributeNS(e.space,e.local,t)}}function fs(e,t){return function(){var n=t.apply(this,arguments);n==null?this.removeAttribute(e):this.setAttribute(e,n)}}function gs(e,t){return function(){var n=t.apply(this,arguments);n==null?this.removeAttributeNS(e.space,e.local):this.setAttributeNS(e.space,e.local,n)}}function Bo(e){return e.ownerDocument&&e.ownerDocument.defaultView||e.document&&e||e.defaultView}function ps(e){return function(){this.style.removeProperty(e)}}function ms(e,t,n){return function(){this.style.setProperty(e,t,n)}}function ys(e,t,n){return function(){var o=t.apply(this,arguments);o==null?this.style.removeProperty(e):this.style.setProperty(e,o,n)}}function it(e,t){return e.style.getPropertyValue(t)||Bo(e).getComputedStyle(e,null).getPropertyValue(t)}function vs(e){return function(){delete this[e]}}function xs(e,t){return function(){this[e]=t}}function ws(e,t){return function(){var n=t.apply(this,arguments);n==null?delete this[e]:this[e]=n}}function Vo(e){return e.trim().split(/^|\s+/)}function zn(e){return e.classList||new jo(e)}function jo(e){this._node=e,this._names=Vo(e.getAttribute("class")||"")}function Ho(e,t){for(var n=zn(e),o=-1,r=t.length;++o<r;)n.add(t[o])}function Zo(e,t){for(var n=zn(e),o=-1,r=t.length;++o<r;)n.remove(t[o])}function bs(e){return function(){Ho(this,e)}}function Ss(e){return function(){Zo(this,e)}}function Cs(e,t){return function(){(t.apply(this,arguments)?Ho:Zo)(this,e)}}function Es(){this.textContent=""}function Ms(e){return function(){this.textContent=e}}function Ns(e){return function(){var t=e.apply(this,arguments);this.textContent=t??""}}function ks(){this.innerHTML=""}function _s(e){return function(){this.innerHTML=e}}function Ps(e){return function(){var t=e.apply(this,arguments);this.innerHTML=t??""}}function zs(){this.nextSibling&&this.parentNode.appendChild(this)}function Is(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function Os(){return null}function As(){var e=this.parentNode;e&&e.removeChild(this)}function Ds(){var e=this.cloneNode(!1),t=this.parentNode;return t?t.insertBefore(e,this.nextSibling):e}function Rs(){var e=this.cloneNode(!0),t=this.parentNode;return t?t.insertBefore(e,this.nextSibling):e}function Ls(e){return function(){var t=this.__on;if(t){for(var n,o=0,r=-1,i=t.length;o<i;++o)n=t[o],e.type&&n.type!==e.type||n.name!==e.name?t[++r]=n:this.removeEventListener(n.type,n.listener,n.options);++r?t.length=r:delete this.__on}}}function $s(e,t,n){return function(){var o,r=this.__on,i=(function(l){return function(c){l.call(this,c,this.__data__)}})(t);if(r){for(var a=0,s=r.length;a<s;++a)if((o=r[a]).type===e.type&&o.name===e.name)return this.removeEventListener(o.type,o.listener,o.options),this.addEventListener(o.type,o.listener=i,o.options=n),void(o.value=t)}this.addEventListener(e.type,i,n),o={type:e.type,name:e.name,value:t,listener:i,options:n},r?r.push(o):this.__on=[o]}}function Xo(e,t,n){var o=Bo(e),r=o.CustomEvent;typeof r=="function"?r=new r(t,n):(r=o.document.createEvent("Event"),n?(r.initEvent(t,n.bubbles,n.cancelable),r.detail=n.detail):r.initEvent(t,!1,!1)),e.dispatchEvent(r)}function Ts(e,t){return function(){return Xo(this,e,t)}}function Bs(e,t){return function(){return Xo(this,e,t.apply(this,arguments))}}Ft.prototype={constructor:Ft,appendChild:function(e){return this._parent.insertBefore(e,this._next)},insertBefore:function(e,t){return this._parent.insertBefore(e,t)},querySelector:function(e){return this._parent.querySelector(e)},querySelectorAll:function(e){return this._parent.querySelectorAll(e)}},jo.prototype={add:function(e){this._names.indexOf(e)<0&&(this._names.push(e),this._node.setAttribute("class",this._names.join(" ")))},remove:function(e){var t=this._names.indexOf(e);t>=0&&(this._names.splice(t,1),this._node.setAttribute("class",this._names.join(" ")))},contains:function(e){return this._names.indexOf(e)>=0}};var Yo=[null];function _e(e,t){this._groups=e,this._parents=t}function vt(){return new _e([[document.documentElement]],Yo)}function Pe(e){return typeof e=="string"?new _e([[document.querySelector(e)]],[document.documentElement]):new _e([[e]],Yo)}function Ae(e,t){if(e=(function(i){let a;for(;a=i.sourceEvent;)i=a;return i})(e),t===void 0&&(t=e.currentTarget),t){var n=t.ownerSVGElement||t;if(n.createSVGPoint){var o=n.createSVGPoint();return o.x=e.clientX,o.y=e.clientY,[(o=o.matrixTransform(t.getScreenCTM().inverse())).x,o.y]}if(t.getBoundingClientRect){var r=t.getBoundingClientRect();return[e.clientX-r.left-t.clientLeft,e.clientY-r.top-t.clientTop]}}return[e.pageX,e.pageY]}_e.prototype=vt.prototype={constructor:_e,select:function(e){typeof e!="function"&&(e=Pn(e));for(var t=this._groups,n=t.length,o=new Array(n),r=0;r<n;++r)for(var i,a,s=t[r],l=s.length,c=o[r]=new Array(l),u=0;u<l;++u)(i=s[u])&&(a=e.call(i,i.__data__,u,s))&&("__data__"in i&&(a.__data__=i.__data__),c[u]=a);return new _e(o,this._parents)},selectAll:function(e){e=typeof e=="function"?Ja(e):Ro(e);for(var t=this._groups,n=t.length,o=[],r=[],i=0;i<n;++i)for(var a,s=t[i],l=s.length,c=0;c<l;++c)(a=s[c])&&(o.push(e.call(a,a.__data__,c,s)),r.push(a));return new _e(o,r)},selectChild:function(e){return this.select(e==null?ts:(function(t){return function(){return es.call(this.children,t)}})(typeof e=="function"?e:$o(e)))},selectChildren:function(e){return this.selectAll(e==null?os:(function(t){return function(){return ns.call(this.children,t)}})(typeof e=="function"?e:$o(e)))},filter:function(e){typeof e!="function"&&(e=Lo(e));for(var t=this._groups,n=t.length,o=new Array(n),r=0;r<n;++r)for(var i,a=t[r],s=a.length,l=o[r]=[],c=0;c<s;++c)(i=a[c])&&e.call(i,i.__data__,c,a)&&l.push(i);return new _e(o,this._parents)},data:function(e,t){if(!arguments.length)return Array.from(this,as);var n,o=t?is:rs,r=this._parents,i=this._groups;typeof e!="function"&&(n=e,e=function(){return n});for(var a=i.length,s=new Array(a),l=new Array(a),c=new Array(a),u=0;u<a;++u){var d=r[u],h=i[u],y=h.length,m=ss(e.call(d,d&&d.__data__,u,r)),g=m.length,x=l[u]=new Array(g),b=s[u]=new Array(g);o(d,h,x,b,c[u]=new Array(y),m,t);for(var w,p,f=0,C=0;f<g;++f)if(w=x[f]){for(f>=C&&(C=f+1);!(p=b[C])&&++C<g;);w._next=p||null}}return(s=new _e(s,r))._enter=l,s._exit=c,s},enter:function(){return new _e(this._enter||this._groups.map(To),this._parents)},exit:function(){return new _e(this._exit||this._groups.map(To),this._parents)},join:function(e,t,n){var o=this.enter(),r=this,i=this.exit();return typeof e=="function"?(o=e(o))&&(o=o.selection()):o=o.append(e+""),t!=null&&(r=t(r))&&(r=r.selection()),n==null?i.remove():n(i),o&&r?o.merge(r).order():r},merge:function(e){for(var t=e.selection?e.selection():e,n=this._groups,o=t._groups,r=n.length,i=o.length,a=Math.min(r,i),s=new Array(r),l=0;l<a;++l)for(var c,u=n[l],d=o[l],h=u.length,y=s[l]=new Array(h),m=0;m<h;++m)(c=u[m]||d[m])&&(y[m]=c);for(;l<r;++l)s[l]=n[l];return new _e(s,this._parents)},selection:function(){return this},order:function(){for(var e=this._groups,t=-1,n=e.length;++t<n;)for(var o,r=e[t],i=r.length-1,a=r[i];--i>=0;)(o=r[i])&&(a&&4^o.compareDocumentPosition(a)&&a.parentNode.insertBefore(o,a),a=o);return this},sort:function(e){function t(d,h){return d&&h?e(d.__data__,h.__data__):!d-!h}e||(e=cs);for(var n=this._groups,o=n.length,r=new Array(o),i=0;i<o;++i){for(var a,s=n[i],l=s.length,c=r[i]=new Array(l),u=0;u<l;++u)(a=s[u])&&(c[u]=a);c.sort(t)}return new _e(r,this._parents).order()},call:function(){var e=arguments[0];return arguments[0]=this,e.apply(null,arguments),this},nodes:function(){return Array.from(this)},node:function(){for(var e=this._groups,t=0,n=e.length;t<n;++t)for(var o=e[t],r=0,i=o.length;r<i;++r){var a=o[r];if(a)return a}return null},size:function(){let e=0;for(let t of this)++e;return e},empty:function(){return!this.node()},each:function(e){for(var t=this._groups,n=0,o=t.length;n<o;++n)for(var r,i=t[n],a=0,s=i.length;a<s;++a)(r=i[a])&&e.call(r,r.__data__,a,i);return this},attr:function(e,t){var n=Yt(e);if(arguments.length<2){var o=this.node();return n.local?o.getAttributeNS(n.space,n.local):o.getAttribute(n)}return this.each((t==null?n.local?us:ls:typeof t=="function"?n.local?gs:fs:n.local?hs:ds)(n,t))},style:function(e,t,n){return arguments.length>1?this.each((t==null?ps:typeof t=="function"?ys:ms)(e,t,n??"")):it(this.node(),e)},property:function(e,t){return arguments.length>1?this.each((t==null?vs:typeof t=="function"?ws:xs)(e,t)):this.node()[e]},classed:function(e,t){var n=Vo(e+"");if(arguments.length<2){for(var o=zn(this.node()),r=-1,i=n.length;++r<i;)if(!o.contains(n[r]))return!1;return!0}return this.each((typeof t=="function"?Cs:t?bs:Ss)(n,t))},text:function(e){return arguments.length?this.each(e==null?Es:(typeof e=="function"?Ns:Ms)(e)):this.node().textContent},html:function(e){return arguments.length?this.each(e==null?ks:(typeof e=="function"?Ps:_s)(e)):this.node().innerHTML},raise:function(){return this.each(zs)},lower:function(){return this.each(Is)},append:function(e){var t=typeof e=="function"?e:Do(e);return this.select(function(){return this.appendChild(t.apply(this,arguments))})},insert:function(e,t){var n=typeof e=="function"?e:Do(e),o=t==null?Os:typeof t=="function"?t:Pn(t);return this.select(function(){return this.insertBefore(n.apply(this,arguments),o.apply(this,arguments)||null)})},remove:function(){return this.each(As)},clone:function(e){return this.select(e?Rs:Ds)},datum:function(e){return arguments.length?this.property("__data__",e):this.node().__data__},on:function(e,t,n){var o,r,i=(function(d){return d.trim().split(/^|\s+/).map(function(h){var y="",m=h.indexOf(".");return m>=0&&(y=h.slice(m+1),h=h.slice(0,m)),{type:h,name:y}})})(e+""),a=i.length;if(!(arguments.length<2)){for(s=t?$s:Ls,o=0;o<a;++o)this.each(s(i[o],t,n));return this}var s=this.node().__on;if(s){for(var l,c=0,u=s.length;c<u;++c)for(o=0,l=s[c];o<a;++o)if((r=i[o]).type===l.type&&r.name===l.name)return l.value}},dispatch:function(e,t){return this.each((typeof t=="function"?Bs:Ts)(e,t))},[Symbol.iterator]:function*(){for(var e=this._groups,t=0,n=e.length;t<n;++t)for(var o,r=e[t],i=0,a=r.length;i<a;++i)(o=r[i])&&(yield o)}};let Vs={passive:!1},xt={capture:!0,passive:!1};function In(e){e.stopImmediatePropagation()}function at(e){e.preventDefault(),e.stopImmediatePropagation()}function Fo(e){var t=e.document.documentElement,n=Pe(e).on("dragstart.drag",at,xt);"onselectstart"in t?n.on("selectstart.drag",at,xt):(t.__noselect=t.style.MozUserSelect,t.style.MozUserSelect="none")}function Wo(e,t){var n=e.document.documentElement,o=Pe(e).on("dragstart.drag",null);t&&(o.on("click.drag",at,xt),setTimeout(function(){o.on("click.drag",null)},0)),"onselectstart"in n?o.on("selectstart.drag",null):(n.style.MozUserSelect=n.__noselect,delete n.__noselect)}var Wt=e=>()=>e;function On(e,{sourceEvent:t,subject:n,target:o,identifier:r,active:i,x:a,y:s,dx:l,dy:c,dispatch:u}){Object.defineProperties(this,{type:{value:e,enumerable:!0,configurable:!0},sourceEvent:{value:t,enumerable:!0,configurable:!0},subject:{value:n,enumerable:!0,configurable:!0},target:{value:o,enumerable:!0,configurable:!0},identifier:{value:r,enumerable:!0,configurable:!0},active:{value:i,enumerable:!0,configurable:!0},x:{value:a,enumerable:!0,configurable:!0},y:{value:s,enumerable:!0,configurable:!0},dx:{value:l,enumerable:!0,configurable:!0},dy:{value:c,enumerable:!0,configurable:!0},_:{value:u}})}function js(e){return!e.ctrlKey&&!e.button}function Hs(){return this.parentNode}function Zs(e,t){return t??{x:e.x,y:e.y}}function Xs(){return navigator.maxTouchPoints||"ontouchstart"in this}function Ko(){var e,t,n,o,r=js,i=Hs,a=Zs,s=Xs,l={},c=Zt("start","drag","end"),u=0,d=0;function h(f){f.on("mousedown.drag",y).filter(s).on("touchstart.drag",x).on("touchmove.drag",b,Vs).on("touchend.drag touchcancel.drag",w).style("touch-action","none").style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}function y(f,C){if(!o&&r.call(this,f,C)){var M=p(this,i.call(this,f,C),f,C,"mouse");M&&(Pe(f.view).on("mousemove.drag",m,xt).on("mouseup.drag",g,xt),Fo(f.view),In(f),n=!1,e=f.clientX,t=f.clientY,M("start",f))}}function m(f){if(at(f),!n){var C=f.clientX-e,M=f.clientY-t;n=C*C+M*M>d}l.mouse("drag",f)}function g(f){Pe(f.view).on("mousemove.drag mouseup.drag",null),Wo(f.view,n),at(f),l.mouse("end",f)}function x(f,C){if(r.call(this,f,C)){var M,I,O=f.changedTouches,R=i.call(this,f,C),L=O.length;for(M=0;M<L;++M)(I=p(this,R,f,C,O[M].identifier,O[M]))&&(In(f),I("start",f,O[M]))}}function b(f){var C,M,I=f.changedTouches,O=I.length;for(C=0;C<O;++C)(M=l[I[C].identifier])&&(at(f),M("drag",f,I[C]))}function w(f){var C,M,I=f.changedTouches,O=I.length;for(o&&clearTimeout(o),o=setTimeout(function(){o=null},500),C=0;C<O;++C)(M=l[I[C].identifier])&&(In(f),M("end",f,I[C]))}function p(f,C,M,I,O,R){var L,V,v,k=c.copy(),S=Ae(R||M,C);if((v=a.call(f,new On("beforestart",{sourceEvent:M,target:h,identifier:O,active:u,x:S[0],y:S[1],dx:0,dy:0,dispatch:k}),I))!=null)return L=v.x-S[0]||0,V=v.y-S[1]||0,function N(z,D,$){var j,A=S;switch(z){case"start":l[O]=N,j=u++;break;case"end":delete l[O],--u;case"drag":S=Ae($||D,C),j=u}k.call(z,f,new On(z,{sourceEvent:D,subject:v,target:h,identifier:O,active:j,x:S[0]+L,y:S[1]+V,dx:S[0]-A[0],dy:S[1]-A[1],dispatch:k}),I)}}return h.filter=function(f){return arguments.length?(r=typeof f=="function"?f:Wt(!!f),h):r},h.container=function(f){return arguments.length?(i=typeof f=="function"?f:Wt(f),h):i},h.subject=function(f){return arguments.length?(a=typeof f=="function"?f:Wt(f),h):a},h.touchable=function(f){return arguments.length?(s=typeof f=="function"?f:Wt(!!f),h):s},h.on=function(){var f=c.on.apply(c,arguments);return f===c?h:f},h.clickDistance=function(f){return arguments.length?(d=(f=+f)*f,h):Math.sqrt(d)},h}function An(e,t,n){e.prototype=t.prototype=n,n.constructor=e}function qo(e,t){var n=Object.create(e.prototype);for(var o in t)n[o]=t[o];return n}function wt(){}On.prototype.on=function(){var e=this._.on.apply(this._,arguments);return e===this._?this:e};var bt=.7,Kt=1/bt,st="\\s*([+-]?\\d+)\\s*",St="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",Be="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",Ys=/^#([0-9a-f]{3,8})$/,Fs=new RegExp(`^rgb\\(${st},${st},${st}\\)$`),Ws=new RegExp(`^rgb\\(${Be},${Be},${Be}\\)$`),Ks=new RegExp(`^rgba\\(${st},${st},${st},${St}\\)$`),qs=new RegExp(`^rgba\\(${Be},${Be},${Be},${St}\\)$`),Gs=new RegExp(`^hsl\\(${St},${Be},${Be}\\)$`),Us=new RegExp(`^hsla\\(${St},${Be},${Be},${St}\\)$`),Go={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};function Uo(){return this.rgb().formatHex()}function Qo(){return this.rgb().formatRgb()}function Ue(e){var t,n;return e=(e+"").trim().toLowerCase(),(t=Ys.exec(e))?(n=t[1].length,t=parseInt(t[1],16),n===6?Jo(t):n===3?new Ee(t>>8&15|t>>4&240,t>>4&15|240&t,(15&t)<<4|15&t,1):n===8?qt(t>>24&255,t>>16&255,t>>8&255,(255&t)/255):n===4?qt(t>>12&15|t>>8&240,t>>8&15|t>>4&240,t>>4&15|240&t,((15&t)<<4|15&t)/255):null):(t=Fs.exec(e))?new Ee(t[1],t[2],t[3],1):(t=Ws.exec(e))?new Ee(255*t[1]/100,255*t[2]/100,255*t[3]/100,1):(t=Ks.exec(e))?qt(t[1],t[2],t[3],t[4]):(t=qs.exec(e))?qt(255*t[1]/100,255*t[2]/100,255*t[3]/100,t[4]):(t=Gs.exec(e))?nr(t[1],t[2]/100,t[3]/100,1):(t=Us.exec(e))?nr(t[1],t[2]/100,t[3]/100,t[4]):Go.hasOwnProperty(e)?Jo(Go[e]):e==="transparent"?new Ee(NaN,NaN,NaN,0):null}function Jo(e){return new Ee(e>>16&255,e>>8&255,255&e,1)}function qt(e,t,n,o){return o<=0&&(e=t=n=NaN),new Ee(e,t,n,o)}function Dn(e,t,n,o){return arguments.length===1?((r=e)instanceof wt||(r=Ue(r)),r?new Ee((r=r.rgb()).r,r.g,r.b,r.opacity):new Ee):new Ee(e,t,n,o??1);var r}function Ee(e,t,n,o){this.r=+e,this.g=+t,this.b=+n,this.opacity=+o}function er(){return`#${Je(this.r)}${Je(this.g)}${Je(this.b)}`}function tr(){let e=Gt(this.opacity);return`${e===1?"rgb(":"rgba("}${Qe(this.r)}, ${Qe(this.g)}, ${Qe(this.b)}${e===1?")":`, ${e})`}`}function Gt(e){return isNaN(e)?1:Math.max(0,Math.min(1,e))}function Qe(e){return Math.max(0,Math.min(255,Math.round(e)||0))}function Je(e){return((e=Qe(e))<16?"0":"")+e.toString(16)}function nr(e,t,n,o){return o<=0?e=t=n=NaN:n<=0||n>=1?e=t=NaN:t<=0&&(e=NaN),new De(e,t,n,o)}function or(e){if(e instanceof De)return new De(e.h,e.s,e.l,e.opacity);if(e instanceof wt||(e=Ue(e)),!e)return new De;if(e instanceof De)return e;var t=(e=e.rgb()).r/255,n=e.g/255,o=e.b/255,r=Math.min(t,n,o),i=Math.max(t,n,o),a=NaN,s=i-r,l=(i+r)/2;return s?(a=t===i?(n-o)/s+6*(n<o):n===i?(o-t)/s+2:(t-n)/s+4,s/=l<.5?i+r:2-i-r,a*=60):s=l>0&&l<1?0:a,new De(a,s,l,e.opacity)}function De(e,t,n,o){this.h=+e,this.s=+t,this.l=+n,this.opacity=+o}function rr(e){return(e=(e||0)%360)<0?e+360:e}function Ut(e){return Math.max(0,Math.min(1,e||0))}function Rn(e,t,n){return 255*(e<60?t+(n-t)*e/60:e<180?n:e<240?t+(n-t)*(240-e)/60:t)}An(wt,Ue,{copy(e){return Object.assign(new this.constructor,this,e)},displayable(){return this.rgb().displayable()},hex:Uo,formatHex:Uo,formatHex8:function(){return this.rgb().formatHex8()},formatHsl:function(){return or(this).formatHsl()},formatRgb:Qo,toString:Qo}),An(Ee,Dn,qo(wt,{brighter(e){return e=e==null?Kt:Math.pow(Kt,e),new Ee(this.r*e,this.g*e,this.b*e,this.opacity)},darker(e){return e=e==null?bt:Math.pow(bt,e),new Ee(this.r*e,this.g*e,this.b*e,this.opacity)},rgb(){return this},clamp(){return new Ee(Qe(this.r),Qe(this.g),Qe(this.b),Gt(this.opacity))},displayable(){return-.5<=this.r&&this.r<255.5&&-.5<=this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:er,formatHex:er,formatHex8:function(){return`#${Je(this.r)}${Je(this.g)}${Je(this.b)}${Je(255*(isNaN(this.opacity)?1:this.opacity))}`},formatRgb:tr,toString:tr})),An(De,function(e,t,n,o){return arguments.length===1?or(e):new De(e,t,n,o??1)},qo(wt,{brighter(e){return e=e==null?Kt:Math.pow(Kt,e),new De(this.h,this.s,this.l*e,this.opacity)},darker(e){return e=e==null?bt:Math.pow(bt,e),new De(this.h,this.s,this.l*e,this.opacity)},rgb(){var e=this.h%360+360*(this.h<0),t=isNaN(e)||isNaN(this.s)?0:this.s,n=this.l,o=n+(n<.5?n:1-n)*t,r=2*n-o;return new Ee(Rn(e>=240?e-240:e+120,r,o),Rn(e,r,o),Rn(e<120?e+240:e-120,r,o),this.opacity)},clamp(){return new De(rr(this.h),Ut(this.s),Ut(this.l),Gt(this.opacity))},displayable(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl(){let e=Gt(this.opacity);return`${e===1?"hsl(":"hsla("}${rr(this.h)}, ${100*Ut(this.s)}%, ${100*Ut(this.l)}%${e===1?")":`, ${e})`}`}}));var Ln=e=>()=>e;function Qs(e){return(e=+e)==1?ir:function(t,n){return n-t?(function(o,r,i){return o=Math.pow(o,i),r=Math.pow(r,i)-o,i=1/i,function(a){return Math.pow(o+a*r,i)}})(t,n,e):Ln(isNaN(t)?n:t)}}function ir(e,t){var n=t-e;return n?(function(o,r){return function(i){return o+i*r}})(e,n):Ln(isNaN(e)?t:e)}var Qt=(function e(t){var n=Qs(t);function o(r,i){var a=n((r=Dn(r)).r,(i=Dn(i)).r),s=n(r.g,i.g),l=n(r.b,i.b),c=ir(r.opacity,i.opacity);return function(u){return r.r=a(u),r.g=s(u),r.b=l(u),r.opacity=c(u),r+""}}return o.gamma=e,o})(1);function Js(e,t){t||(t=[]);var n,o=e?Math.min(t.length,e.length):0,r=t.slice();return function(i){for(n=0;n<o;++n)r[n]=e[n]*(1-i)+t[n]*i;return r}}function ec(e,t){var n,o=t?t.length:0,r=e?Math.min(o,e.length):0,i=new Array(r),a=new Array(o);for(n=0;n<r;++n)i[n]=Ct(e[n],t[n]);for(;n<o;++n)a[n]=t[n];return function(s){for(n=0;n<r;++n)a[n]=i[n](s);return a}}function tc(e,t){var n=new Date;return e=+e,t=+t,function(o){return n.setTime(e*(1-o)+t*o),n}}function Ve(e,t){return e=+e,t=+t,function(n){return e*(1-n)+t*n}}function nc(e,t){var n,o={},r={};for(n in e!==null&&typeof e=="object"||(e={}),t!==null&&typeof t=="object"||(t={}),t)n in e?o[n]=Ct(e[n],t[n]):r[n]=t[n];return function(i){for(n in o)r[n]=o[n](i);return r}}var $n=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,Tn=new RegExp($n.source,"g");function ar(e,t){var n,o,r,i=$n.lastIndex=Tn.lastIndex=0,a=-1,s=[],l=[];for(e+="",t+="";(n=$n.exec(e))&&(o=Tn.exec(t));)(r=o.index)>i&&(r=t.slice(i,r),s[a]?s[a]+=r:s[++a]=r),(n=n[0])===(o=o[0])?s[a]?s[a]+=o:s[++a]=o:(s[++a]=null,l.push({i:a,x:Ve(n,o)})),i=Tn.lastIndex;return i<t.length&&(r=t.slice(i),s[a]?s[a]+=r:s[++a]=r),s.length<2?l[0]?(function(c){return function(u){return c(u)+""}})(l[0].x):(function(c){return function(){return c}})(t):(t=l.length,function(c){for(var u,d=0;d<t;++d)s[(u=l[d]).i]=u.x(c);return s.join("")})}function Ct(e,t){var n,o,r=typeof t;return t==null||r==="boolean"?Ln(t):(r==="number"?Ve:r==="string"?(n=Ue(t))?(t=n,Qt):ar:t instanceof Ue?Qt:t instanceof Date?tc:(o=t,!ArrayBuffer.isView(o)||o instanceof DataView?Array.isArray(t)?ec:typeof t.valueOf!="function"&&typeof t.toString!="function"||isNaN(t)?nc:Ve:Js))(e,t)}var Jt,sr=180/Math.PI,Bn={translateX:0,translateY:0,rotate:0,skewX:0,scaleX:1,scaleY:1};function cr(e,t,n,o,r,i){var a,s,l;return(a=Math.sqrt(e*e+t*t))&&(e/=a,t/=a),(l=e*n+t*o)&&(n-=e*l,o-=t*l),(s=Math.sqrt(n*n+o*o))&&(n/=s,o/=s,l/=s),e*o<t*n&&(e=-e,t=-t,l=-l,a=-a),{translateX:r,translateY:i,rotate:Math.atan2(t,e)*sr,skewX:Math.atan(l)*sr,scaleX:a,scaleY:s}}function lr(e,t,n,o){function r(i){return i.length?i.pop()+" ":""}return function(i,a){var s=[],l=[];return i=e(i),a=e(a),(function(c,u,d,h,y,m){if(c!==d||u!==h){var g=y.push("translate(",null,t,null,n);m.push({i:g-4,x:Ve(c,d)},{i:g-2,x:Ve(u,h)})}else(d||h)&&y.push("translate("+d+t+h+n)})(i.translateX,i.translateY,a.translateX,a.translateY,s,l),(function(c,u,d,h){c!==u?(c-u>180?u+=360:u-c>180&&(c+=360),h.push({i:d.push(r(d)+"rotate(",null,o)-2,x:Ve(c,u)})):u&&d.push(r(d)+"rotate("+u+o)})(i.rotate,a.rotate,s,l),(function(c,u,d,h){c!==u?h.push({i:d.push(r(d)+"skewX(",null,o)-2,x:Ve(c,u)}):u&&d.push(r(d)+"skewX("+u+o)})(i.skewX,a.skewX,s,l),(function(c,u,d,h,y,m){if(c!==d||u!==h){var g=y.push(r(y)+"scale(",null,",",null,")");m.push({i:g-4,x:Ve(c,d)},{i:g-2,x:Ve(u,h)})}else d===1&&h===1||y.push(r(y)+"scale("+d+","+h+")")})(i.scaleX,i.scaleY,a.scaleX,a.scaleY,s,l),i=a=null,function(c){for(var u,d=-1,h=l.length;++d<h;)s[(u=l[d]).i]=u.x(c);return s.join("")}}}var oc=lr(function(e){let t=new(typeof DOMMatrix=="function"?DOMMatrix:WebKitCSSMatrix)(e+"");return t.isIdentity?Bn:cr(t.a,t.b,t.c,t.d,t.e,t.f)},"px, ","px)","deg)"),rc=lr(function(e){return e==null?Bn:(Jt||(Jt=document.createElementNS("http://www.w3.org/2000/svg","g")),Jt.setAttribute("transform",e),(e=Jt.transform.baseVal.consolidate())?cr((e=e.matrix).a,e.b,e.c,e.d,e.e,e.f):Bn)},", ",")",")");function ur(e){return((e=Math.exp(e))+1/e)/2}var en,Et,tn=(function e(t,n,o){function r(i,a){var s,l,c=i[0],u=i[1],d=i[2],h=a[0],y=a[1],m=a[2],g=h-c,x=y-u,b=g*g+x*x;if(b<1e-12)l=Math.log(m/d)/t,s=function(I){return[c+I*g,u+I*x,d*Math.exp(t*I*l)]};else{var w=Math.sqrt(b),p=(m*m-d*d+o*b)/(2*d*n*w),f=(m*m-d*d-o*b)/(2*m*n*w),C=Math.log(Math.sqrt(p*p+1)-p),M=Math.log(Math.sqrt(f*f+1)-f);l=(M-C)/t,s=function(I){var O,R=I*l,L=ur(C),V=d/(n*w)*(L*(O=t*R+C,((O=Math.exp(2*O))-1)/(O+1))-(function(v){return((v=Math.exp(v))-1/v)/2})(C));return[c+V*g,u+V*x,d*L/ur(t*R+C)]}}return s.duration=1e3*l*t/Math.SQRT2,s}return r.rho=function(i){var a=Math.max(.001,+i),s=a*a;return e(a,s,s*s)},r})(Math.SQRT2,2,4),ct=0,Mt=0,Nt=0,nn=0,et=0,on=0,kt=typeof performance=="object"&&performance.now?performance:Date,dr=typeof window=="object"&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):function(e){setTimeout(e,17)};function Vn(){return et||(dr(ic),et=kt.now()+on)}function ic(){et=0}function rn(){this._call=this._time=this._next=null}function hr(e,t,n){var o=new rn;return o.restart(e,t,n),o}function fr(){et=(nn=kt.now())+on,ct=Mt=0;try{(function(){Vn(),++ct;for(var e,t=en;t;)(e=et-t._time)>=0&&t._call.call(void 0,e),t=t._next;--ct})()}finally{ct=0,(function(){for(var e,t,n=en,o=1/0;n;)n._call?(o>n._time&&(o=n._time),e=n,n=n._next):(t=n._next,n._next=null,n=e?e._next=t:en=t);Et=e,jn(o)})(),et=0}}function ac(){var e=kt.now(),t=e-nn;t>1e3&&(on-=t,nn=e)}function jn(e){ct||(Mt&&(Mt=clearTimeout(Mt)),e-et>24?(e<1/0&&(Mt=setTimeout(fr,e-kt.now()-on)),Nt&&(Nt=clearInterval(Nt))):(Nt||(nn=kt.now(),Nt=setInterval(ac,1e3)),ct=1,dr(fr)))}function gr(e,t,n){var o=new rn;return t=t==null?0:+t,o.restart(r=>{o.stop(),e(r+t)},t,n),o}rn.prototype=hr.prototype={constructor:rn,restart:function(e,t,n){if(typeof e!="function")throw new TypeError("callback is not a function");n=(n==null?Vn():+n)+(t==null?0:+t),this._next||Et===this||(Et?Et._next=this:en=this,Et=this),this._call=e,this._time=n,jn()},stop:function(){this._call&&(this._call=null,this._time=1/0,jn())}};var sc=Zt("start","end","cancel","interrupt"),cc=[];function an(e,t,n,o,r,i){var a=e.__transition;if(a){if(n in a)return}else e.__transition={};(function(s,l,c){var u,d=s.__transition;function h(x){c.state=1,c.timer.restart(y,c.delay,c.time),c.delay<=x&&y(x-c.delay)}function y(x){var b,w,p,f;if(c.state!==1)return g();for(b in d)if((f=d[b]).name===c.name){if(f.state===3)return gr(y);f.state===4?(f.state=6,f.timer.stop(),f.on.call("interrupt",s,s.__data__,f.index,f.group),delete d[b]):+b<l&&(f.state=6,f.timer.stop(),f.on.call("cancel",s,s.__data__,f.index,f.group),delete d[b])}if(gr(function(){c.state===3&&(c.state=4,c.timer.restart(m,c.delay,c.time),m(x))}),c.state=2,c.on.call("start",s,s.__data__,c.index,c.group),c.state===2){for(c.state=3,u=new Array(p=c.tween.length),b=0,w=-1;b<p;++b)(f=c.tween[b].value.call(s,s.__data__,c.index,c.group))&&(u[++w]=f);u.length=w+1}}function m(x){for(var b=x<c.duration?c.ease.call(null,x/c.duration):(c.timer.restart(g),c.state=5,1),w=-1,p=u.length;++w<p;)u[w].call(s,b);c.state===5&&(c.on.call("end",s,s.__data__,c.index,c.group),g())}function g(){for(var x in c.state=6,c.timer.stop(),delete d[l],d)return;delete s.__transition}d[l]=c,c.timer=hr(h,0,c.time)})(e,n,{name:t,index:o,group:r,on:sc,tween:cc,time:i.time,delay:i.delay,duration:i.duration,ease:i.ease,timer:null,state:0})}function Hn(e,t){var n=Re(e,t);if(n.state>0)throw new Error("too late; already scheduled");return n}function je(e,t){var n=Re(e,t);if(n.state>3)throw new Error("too late; already running");return n}function Re(e,t){var n=e.__transition;if(!n||!(n=n[t]))throw new Error("transition not found");return n}function sn(e,t){var n,o,r,i=e.__transition,a=!0;if(i){for(r in t=t==null?null:t+"",i)(n=i[r]).name===t?(o=n.state>2&&n.state<5,n.state=6,n.timer.stop(),n.on.call(o?"interrupt":"cancel",e,e.__data__,n.index,n.group),delete i[r]):a=!1;a&&delete e.__transition}}function lc(e,t){var n,o;return function(){var r=je(this,e),i=r.tween;if(i!==n){for(var a=0,s=(o=n=i).length;a<s;++a)if(o[a].name===t){(o=o.slice()).splice(a,1);break}}r.tween=o}}function uc(e,t,n){var o,r;if(typeof n!="function")throw new Error;return function(){var i=je(this,e),a=i.tween;if(a!==o){r=(o=a).slice();for(var s={name:t,value:n},l=0,c=r.length;l<c;++l)if(r[l].name===t){r[l]=s;break}l===c&&r.push(s)}i.tween=r}}function Zn(e,t,n){var o=e._id;return e.each(function(){var r=je(this,o);(r.value||(r.value={}))[t]=n.apply(this,arguments)}),function(r){return Re(r,o).value[t]}}function pr(e,t){var n;return(typeof t=="number"?Ve:t instanceof Ue?Qt:(n=Ue(t))?(t=n,Qt):ar)(e,t)}function dc(e){return function(){this.removeAttribute(e)}}function hc(e){return function(){this.removeAttributeNS(e.space,e.local)}}function fc(e,t,n){var o,r,i=n+"";return function(){var a=this.getAttribute(e);return a===i?null:a===o?r:r=t(o=a,n)}}function gc(e,t,n){var o,r,i=n+"";return function(){var a=this.getAttributeNS(e.space,e.local);return a===i?null:a===o?r:r=t(o=a,n)}}function pc(e,t,n){var o,r,i;return function(){var a,s,l=n(this);if(l!=null)return(a=this.getAttribute(e))===(s=l+"")?null:a===o&&s===r?i:(r=s,i=t(o=a,l));this.removeAttribute(e)}}function mc(e,t,n){var o,r,i;return function(){var a,s,l=n(this);if(l!=null)return(a=this.getAttributeNS(e.space,e.local))===(s=l+"")?null:a===o&&s===r?i:(r=s,i=t(o=a,l));this.removeAttributeNS(e.space,e.local)}}function yc(e,t){var n,o;function r(){var i=t.apply(this,arguments);return i!==o&&(n=(o=i)&&(function(a,s){return function(l){this.setAttributeNS(a.space,a.local,s.call(this,l))}})(e,i)),n}return r._value=t,r}function vc(e,t){var n,o;function r(){var i=t.apply(this,arguments);return i!==o&&(n=(o=i)&&(function(a,s){return function(l){this.setAttribute(a,s.call(this,l))}})(e,i)),n}return r._value=t,r}function xc(e,t){return function(){Hn(this,e).delay=+t.apply(this,arguments)}}function wc(e,t){return t=+t,function(){Hn(this,e).delay=t}}function bc(e,t){return function(){je(this,e).duration=+t.apply(this,arguments)}}function Sc(e,t){return t=+t,function(){je(this,e).duration=t}}var Cc=vt.prototype.constructor;function mr(e){return function(){this.style.removeProperty(e)}}var Ec=0;function He(e,t,n,o){this._groups=e,this._parents=t,this._name=n,this._id=o}function yr(){return++Ec}var Ze=vt.prototype;He.prototype={constructor:He,select:function(e){var t=this._name,n=this._id;typeof e!="function"&&(e=Pn(e));for(var o=this._groups,r=o.length,i=new Array(r),a=0;a<r;++a)for(var s,l,c=o[a],u=c.length,d=i[a]=new Array(u),h=0;h<u;++h)(s=c[h])&&(l=e.call(s,s.__data__,h,c))&&("__data__"in s&&(l.__data__=s.__data__),d[h]=l,an(d[h],t,n,h,d,Re(s,n)));return new He(i,this._parents,t,n)},selectAll:function(e){var t=this._name,n=this._id;typeof e!="function"&&(e=Ro(e));for(var o=this._groups,r=o.length,i=[],a=[],s=0;s<r;++s)for(var l,c=o[s],u=c.length,d=0;d<u;++d)if(l=c[d]){for(var h,y=e.call(l,l.__data__,d,c),m=Re(l,n),g=0,x=y.length;g<x;++g)(h=y[g])&&an(h,t,n,g,y,m);i.push(y),a.push(l)}return new He(i,a,t,n)},selectChild:Ze.selectChild,selectChildren:Ze.selectChildren,filter:function(e){typeof e!="function"&&(e=Lo(e));for(var t=this._groups,n=t.length,o=new Array(n),r=0;r<n;++r)for(var i,a=t[r],s=a.length,l=o[r]=[],c=0;c<s;++c)(i=a[c])&&e.call(i,i.__data__,c,a)&&l.push(i);return new He(o,this._parents,this._name,this._id)},merge:function(e){if(e._id!==this._id)throw new Error;for(var t=this._groups,n=e._groups,o=t.length,r=n.length,i=Math.min(o,r),a=new Array(o),s=0;s<i;++s)for(var l,c=t[s],u=n[s],d=c.length,h=a[s]=new Array(d),y=0;y<d;++y)(l=c[y]||u[y])&&(h[y]=l);for(;s<o;++s)a[s]=t[s];return new He(a,this._parents,this._name,this._id)},selection:function(){return new Cc(this._groups,this._parents)},transition:function(){for(var e=this._name,t=this._id,n=yr(),o=this._groups,r=o.length,i=0;i<r;++i)for(var a,s=o[i],l=s.length,c=0;c<l;++c)if(a=s[c]){var u=Re(a,t);an(a,e,n,c,s,{time:u.time+u.delay+u.duration,delay:0,duration:u.duration,ease:u.ease})}return new He(o,this._parents,e,n)},call:Ze.call,nodes:Ze.nodes,node:Ze.node,size:Ze.size,empty:Ze.empty,each:Ze.each,on:function(e,t){var n=this._id;return arguments.length<2?Re(this.node(),n).on.on(e):this.each((function(o,r,i){var a,s,l=(function(c){return(c+"").trim().split(/^|\s+/).every(function(u){var d=u.indexOf(".");return d>=0&&(u=u.slice(0,d)),!u||u==="start"})})(r)?Hn:je;return function(){var c=l(this,o),u=c.on;u!==a&&(s=(a=u).copy()).on(r,i),c.on=s}})(n,e,t))},attr:function(e,t){var n=Yt(e),o=n==="transform"?rc:pr;return this.attrTween(e,typeof t=="function"?(n.local?mc:pc)(n,o,Zn(this,"attr."+e,t)):t==null?(n.local?hc:dc)(n):(n.local?gc:fc)(n,o,t))},attrTween:function(e,t){var n="attr."+e;if(arguments.length<2)return(n=this.tween(n))&&n._value;if(t==null)return this.tween(n,null);if(typeof t!="function")throw new Error;var o=Yt(e);return this.tween(n,(o.local?yc:vc)(o,t))},style:function(e,t,n){var o=(e+="")=="transform"?oc:pr;return t==null?this.styleTween(e,(function(r,i){var a,s,l;return function(){var c=it(this,r),u=(this.style.removeProperty(r),it(this,r));return c===u?null:c===a&&u===s?l:l=i(a=c,s=u)}})(e,o)).on("end.style."+e,mr(e)):typeof t=="function"?this.styleTween(e,(function(r,i,a){var s,l,c;return function(){var u=it(this,r),d=a(this),h=d+"";return d==null&&(this.style.removeProperty(r),h=d=it(this,r)),u===h?null:u===s&&h===l?c:(l=h,c=i(s=u,d))}})(e,o,Zn(this,"style."+e,t))).each((function(r,i){var a,s,l,c,u="style."+i,d="end."+u;return function(){var h=je(this,r),y=h.on,m=h.value[u]==null?c||(c=mr(i)):void 0;y===a&&l===m||(s=(a=y).copy()).on(d,l=m),h.on=s}})(this._id,e)):this.styleTween(e,(function(r,i,a){var s,l,c=a+"";return function(){var u=it(this,r);return u===c?null:u===s?l:l=i(s=u,a)}})(e,o,t),n).on("end.style."+e,null)},styleTween:function(e,t,n){var o="style."+(e+="");if(arguments.length<2)return(o=this.tween(o))&&o._value;if(t==null)return this.tween(o,null);if(typeof t!="function")throw new Error;return this.tween(o,(function(r,i,a){var s,l;function c(){var u=i.apply(this,arguments);return u!==l&&(s=(l=u)&&(function(d,h,y){return function(m){this.style.setProperty(d,h.call(this,m),y)}})(r,u,a)),s}return c._value=i,c})(e,t,n??""))},text:function(e){return this.tween("text",typeof e=="function"?(function(t){return function(){var n=t(this);this.textContent=n??""}})(Zn(this,"text",e)):(function(t){return function(){this.textContent=t}})(e==null?"":e+""))},textTween:function(e){var t="text";if(arguments.length<1)return(t=this.tween(t))&&t._value;if(e==null)return this.tween(t,null);if(typeof e!="function")throw new Error;return this.tween(t,(function(n){var o,r;function i(){var a=n.apply(this,arguments);return a!==r&&(o=(r=a)&&(function(s){return function(l){this.textContent=s.call(this,l)}})(a)),o}return i._value=n,i})(e))},remove:function(){return this.on("end.remove",(function(e){return function(){var t=this.parentNode;for(var n in this.__transition)if(+n!==e)return;t&&t.removeChild(this)}})(this._id))},tween:function(e,t){var n=this._id;if(e+="",arguments.length<2){for(var o,r=Re(this.node(),n).tween,i=0,a=r.length;i<a;++i)if((o=r[i]).name===e)return o.value;return null}return this.each((t==null?lc:uc)(n,e,t))},delay:function(e){var t=this._id;return arguments.length?this.each((typeof e=="function"?xc:wc)(t,e)):Re(this.node(),t).delay},duration:function(e){var t=this._id;return arguments.length?this.each((typeof e=="function"?bc:Sc)(t,e)):Re(this.node(),t).duration},ease:function(e){var t=this._id;return arguments.length?this.each((function(n,o){if(typeof o!="function")throw new Error;return function(){je(this,n).ease=o}})(t,e)):Re(this.node(),t).ease},easeVarying:function(e){if(typeof e!="function")throw new Error;return this.each((function(t,n){return function(){var o=n.apply(this,arguments);if(typeof o!="function")throw new Error;je(this,t).ease=o}})(this._id,e))},end:function(){var e,t,n=this,o=n._id,r=n.size();return new Promise(function(i,a){var s={value:a},l={value:function(){--r===0&&i()}};n.each(function(){var c=je(this,o),u=c.on;u!==e&&((t=(e=u).copy())._.cancel.push(s),t._.interrupt.push(s),t._.end.push(l)),c.on=t}),r===0&&i()})},[Symbol.iterator]:Ze[Symbol.iterator]};var Mc={time:null,delay:0,duration:250,ease:function(e){return((e*=2)<=1?e*e*e:(e-=2)*e*e+2)/2}};function Nc(e,t){for(var n;!(n=e.__transition)||!(n=n[t]);)if(!(e=e.parentNode))throw new Error(`transition ${t} not found`);return n}vt.prototype.interrupt=function(e){return this.each(function(){sn(this,e)})},vt.prototype.transition=function(e){var t,n;e instanceof He?(t=e._id,e=e._name):(t=yr(),(n=Mc).time=Vn(),e=e==null?null:e+"");for(var o=this._groups,r=o.length,i=0;i<r;++i)for(var a,s=o[i],l=s.length,c=0;c<l;++c)(a=s[c])&&an(a,e,t,c,s,n||Nc(a,t));return new He(o,this._parents,e,t)};var cn=e=>()=>e;function kc(e,{sourceEvent:t,target:n,transform:o,dispatch:r}){Object.defineProperties(this,{type:{value:e,enumerable:!0,configurable:!0},sourceEvent:{value:t,enumerable:!0,configurable:!0},target:{value:n,enumerable:!0,configurable:!0},transform:{value:o,enumerable:!0,configurable:!0},_:{value:r}})}function Xe(e,t,n){this.k=e,this.x=t,this.y=n}Xe.prototype={constructor:Xe,scale:function(e){return e===1?this:new Xe(this.k*e,this.x,this.y)},translate:function(e,t){return e===0&t===0?this:new Xe(this.k,this.x+this.k*e,this.y+this.k*t)},apply:function(e){return[e[0]*this.k+this.x,e[1]*this.k+this.y]},applyX:function(e){return e*this.k+this.x},applyY:function(e){return e*this.k+this.y},invert:function(e){return[(e[0]-this.x)/this.k,(e[1]-this.y)/this.k]},invertX:function(e){return(e-this.x)/this.k},invertY:function(e){return(e-this.y)/this.k},rescaleX:function(e){return e.copy().domain(e.range().map(this.invertX,this).map(e.invert,e))},rescaleY:function(e){return e.copy().domain(e.range().map(this.invertY,this).map(e.invert,e))},toString:function(){return"translate("+this.x+","+this.y+") scale("+this.k+")"}};var ln=new Xe(1,0,0);function vr(e){for(;!e.__zoom;)if(!(e=e.parentNode))return ln;return e.__zoom}function Xn(e){e.stopImmediatePropagation()}function _t(e){e.preventDefault(),e.stopImmediatePropagation()}function _c(e){return!(e.ctrlKey&&e.type!=="wheel"||e.button)}function Pc(){var e=this;return e instanceof SVGElement?(e=e.ownerSVGElement||e).hasAttribute("viewBox")?[[(e=e.viewBox.baseVal).x,e.y],[e.x+e.width,e.y+e.height]]:[[0,0],[e.width.baseVal.value,e.height.baseVal.value]]:[[0,0],[e.clientWidth,e.clientHeight]]}function xr(){return this.__zoom||ln}function zc(e){return-e.deltaY*(e.deltaMode===1?.05:e.deltaMode?1:.002)*(e.ctrlKey?10:1)}function Ic(){return navigator.maxTouchPoints||"ontouchstart"in this}function Oc(e,t,n){var o=e.invertX(t[0][0])-n[0][0],r=e.invertX(t[1][0])-n[1][0],i=e.invertY(t[0][1])-n[0][1],a=e.invertY(t[1][1])-n[1][1];return e.translate(r>o?(o+r)/2:Math.min(0,o)||Math.max(0,r),a>i?(i+a)/2:Math.min(0,i)||Math.max(0,a))}function wr(){var e,t,n,o=_c,r=Pc,i=Oc,a=zc,s=Ic,l=[0,1/0],c=[[-1/0,-1/0],[1/0,1/0]],u=250,d=tn,h=Zt("start","zoom","end"),y=0,m=10;function g(v){v.property("__zoom",xr).on("wheel.zoom",M,{passive:!1}).on("mousedown.zoom",I).on("dblclick.zoom",O).filter(s).on("touchstart.zoom",R).on("touchmove.zoom",L).on("touchend.zoom touchcancel.zoom",V).style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}function x(v,k){return(k=Math.max(l[0],Math.min(l[1],k)))===v.k?v:new Xe(k,v.x,v.y)}function b(v,k,S){var N=k[0]-S[0]*v.k,z=k[1]-S[1]*v.k;return N===v.x&&z===v.y?v:new Xe(v.k,N,z)}function w(v){return[(+v[0][0]+ +v[1][0])/2,(+v[0][1]+ +v[1][1])/2]}function p(v,k,S,N){v.on("start.zoom",function(){f(this,arguments).event(N).start()}).on("interrupt.zoom end.zoom",function(){f(this,arguments).event(N).end()}).tween("zoom",function(){var z=this,D=arguments,$=f(z,D).event(N),j=r.apply(z,D),A=S==null?w(j):typeof S=="function"?S.apply(z,D):S,Z=Math.max(j[1][0]-j[0][0],j[1][1]-j[0][1]),B=z.__zoom,K=typeof k=="function"?k.apply(z,D):k,J=d(B.invert(A).concat(Z/B.k),K.invert(A).concat(Z/K.k));return function(T){if(T===1)T=K;else{var H=J(T),U=Z/H[2];T=new Xe(U,A[0]-H[0]*U,A[1]-H[1]*U)}$.zoom(null,T)}})}function f(v,k,S){return!S&&v.__zooming||new C(v,k)}function C(v,k){this.that=v,this.args=k,this.active=0,this.sourceEvent=null,this.extent=r.apply(v,k),this.taps=0}function M(v,...k){if(o.apply(this,arguments)){var S=f(this,k).event(v),N=this.__zoom,z=Math.max(l[0],Math.min(l[1],N.k*Math.pow(2,a.apply(this,arguments)))),D=Ae(v);if(S.wheel)S.mouse[0][0]===D[0]&&S.mouse[0][1]===D[1]||(S.mouse[1]=N.invert(S.mouse[0]=D)),clearTimeout(S.wheel);else{if(N.k===z)return;S.mouse=[D,N.invert(D)],sn(this),S.start()}_t(v),S.wheel=setTimeout(function(){S.wheel=null,S.end()},150),S.zoom("mouse",i(b(x(N,z),S.mouse[0],S.mouse[1]),S.extent,c))}}function I(v,...k){if(!n&&o.apply(this,arguments)){var S=v.currentTarget,N=f(this,k,!0).event(v),z=Pe(v.view).on("mousemove.zoom",function(A){if(_t(A),!N.moved){var Z=A.clientX-$,B=A.clientY-j;N.moved=Z*Z+B*B>y}N.event(A).zoom("mouse",i(b(N.that.__zoom,N.mouse[0]=Ae(A,S),N.mouse[1]),N.extent,c))},!0).on("mouseup.zoom",function(A){z.on("mousemove.zoom mouseup.zoom",null),Wo(A.view,N.moved),_t(A),N.event(A).end()},!0),D=Ae(v,S),$=v.clientX,j=v.clientY;Fo(v.view),Xn(v),N.mouse=[D,this.__zoom.invert(D)],sn(this),N.start()}}function O(v,...k){if(o.apply(this,arguments)){var S=this.__zoom,N=Ae(v.changedTouches?v.changedTouches[0]:v,this),z=S.invert(N),D=S.k*(v.shiftKey?.5:2),$=i(b(x(S,D),N,z),r.apply(this,k),c);_t(v),u>0?Pe(this).transition().duration(u).call(p,$,N,v):Pe(this).call(g.transform,$,N,v)}}function R(v,...k){if(o.apply(this,arguments)){var S,N,z,D,$=v.touches,j=$.length,A=f(this,k,v.changedTouches.length===j).event(v);for(Xn(v),N=0;N<j;++N)D=[D=Ae(z=$[N],this),this.__zoom.invert(D),z.identifier],A.touch0?A.touch1||A.touch0[2]===D[2]||(A.touch1=D,A.taps=0):(A.touch0=D,S=!0,A.taps=1+!!e);e&&(e=clearTimeout(e)),S&&(A.taps<2&&(t=D[0],e=setTimeout(function(){e=null},500)),sn(this),A.start())}}function L(v,...k){if(this.__zooming){var S,N,z,D,$=f(this,k).event(v),j=v.changedTouches,A=j.length;for(_t(v),S=0;S<A;++S)z=Ae(N=j[S],this),$.touch0&&$.touch0[2]===N.identifier?$.touch0[0]=z:$.touch1&&$.touch1[2]===N.identifier&&($.touch1[0]=z);if(N=$.that.__zoom,$.touch1){var Z=$.touch0[0],B=$.touch0[1],K=$.touch1[0],J=$.touch1[1],T=(T=K[0]-Z[0])*T+(T=K[1]-Z[1])*T,H=(H=J[0]-B[0])*H+(H=J[1]-B[1])*H;N=x(N,Math.sqrt(T/H)),z=[(Z[0]+K[0])/2,(Z[1]+K[1])/2],D=[(B[0]+J[0])/2,(B[1]+J[1])/2]}else{if(!$.touch0)return;z=$.touch0[0],D=$.touch0[1]}$.zoom("touch",i(b(N,z,D),$.extent,c))}}function V(v,...k){if(this.__zooming){var S,N,z=f(this,k).event(v),D=v.changedTouches,$=D.length;for(Xn(v),n&&clearTimeout(n),n=setTimeout(function(){n=null},500),S=0;S<$;++S)N=D[S],z.touch0&&z.touch0[2]===N.identifier?delete z.touch0:z.touch1&&z.touch1[2]===N.identifier&&delete z.touch1;if(z.touch1&&!z.touch0&&(z.touch0=z.touch1,delete z.touch1),z.touch0)z.touch0[1]=this.__zoom.invert(z.touch0[0]);else if(z.end(),z.taps===2&&(N=Ae(N,this),Math.hypot(t[0]-N[0],t[1]-N[1])<m)){var j=Pe(this).on("dblclick.zoom");j&&j.apply(this,arguments)}}}return g.transform=function(v,k,S,N){var z=v.selection?v.selection():v;z.property("__zoom",xr),v!==z?p(v,k,S,N):z.interrupt().each(function(){f(this,arguments).event(N).start().zoom(null,typeof k=="function"?k.apply(this,arguments):k).end()})},g.scaleBy=function(v,k,S,N){g.scaleTo(v,function(){return this.__zoom.k*(typeof k=="function"?k.apply(this,arguments):k)},S,N)},g.scaleTo=function(v,k,S,N){g.transform(v,function(){var z=r.apply(this,arguments),D=this.__zoom,$=S==null?w(z):typeof S=="function"?S.apply(this,arguments):S,j=D.invert($),A=typeof k=="function"?k.apply(this,arguments):k;return i(b(x(D,A),$,j),z,c)},S,N)},g.translateBy=function(v,k,S,N){g.transform(v,function(){return i(this.__zoom.translate(typeof k=="function"?k.apply(this,arguments):k,typeof S=="function"?S.apply(this,arguments):S),r.apply(this,arguments),c)},null,N)},g.translateTo=function(v,k,S,N,z){g.transform(v,function(){var D=r.apply(this,arguments),$=this.__zoom,j=N==null?w(D):typeof N=="function"?N.apply(this,arguments):N;return i(ln.translate(j[0],j[1]).scale($.k).translate(typeof k=="function"?-k.apply(this,arguments):-k,typeof S=="function"?-S.apply(this,arguments):-S),D,c)},N,z)},C.prototype={event:function(v){return v&&(this.sourceEvent=v),this},start:function(){return++this.active===1&&(this.that.__zooming=this,this.emit("start")),this},zoom:function(v,k){return this.mouse&&v!=="mouse"&&(this.mouse[1]=k.invert(this.mouse[0])),this.touch0&&v!=="touch"&&(this.touch0[1]=k.invert(this.touch0[0])),this.touch1&&v!=="touch"&&(this.touch1[1]=k.invert(this.touch1[0])),this.that.__zoom=k,this.emit("zoom"),this},end:function(){return--this.active===0&&(delete this.that.__zooming,this.emit("end")),this},emit:function(v){var k=Pe(this.that).datum();h.call(v,this.that,new kc(v,{sourceEvent:this.sourceEvent,target:g,transform:this.that.__zoom,dispatch:h}),k)}},g.wheelDelta=function(v){return arguments.length?(a=typeof v=="function"?v:cn(+v),g):a},g.filter=function(v){return arguments.length?(o=typeof v=="function"?v:cn(!!v),g):o},g.touchable=function(v){return arguments.length?(s=typeof v=="function"?v:cn(!!v),g):s},g.extent=function(v){return arguments.length?(r=typeof v=="function"?v:cn([[+v[0][0],+v[0][1]],[+v[1][0],+v[1][1]]]),g):r},g.scaleExtent=function(v){return arguments.length?(l[0]=+v[0],l[1]=+v[1],g):[l[0],l[1]]},g.translateExtent=function(v){return arguments.length?(c[0][0]=+v[0][0],c[1][0]=+v[1][0],c[0][1]=+v[0][1],c[1][1]=+v[1][1],g):[[c[0][0],c[0][1]],[c[1][0],c[1][1]]]},g.constrain=function(v){return arguments.length?(i=v,g):i},g.duration=function(v){return arguments.length?(u=+v,g):u},g.interpolate=function(v){return arguments.length?(d=v,g):d},g.on=function(){var v=h.on.apply(h,arguments);return v===h?g:v},g.clickDistance=function(v){return arguments.length?(y=(v=+v)*v,g):Math.sqrt(y)},g.tapDistance=function(v){return arguments.length?(m=+v,g):m},g}vr.prototype=Xe.prototype;let Ac=(e="react")=>`Seems like you have not used ${e==="svelte"?"SvelteFlowProvider":"ReactFlowProvider"} as an ancestor. Help: https://${e}flow.dev/error#001`,Dc=e=>`Node type "${e}" not found. Using fallback type "default".`,Rc=()=>"The parent container needs a width and a height to render the graph.",Lc=()=>"Only child nodes can use a parent extent.",br=()=>"Can't create edge. An edge needs a source and a target.",$c=e=>`The old edge with id=${e} does not exist.`,Tc=e=>`Marker type "${e}" doesn't exist.`,Bc=(e,{id:t,sourceHandle:n,targetHandle:o})=>`Couldn't create edge for ${e} handle id: "${e==="source"?n:o}", edge id: ${t}.`,Vc=()=>"Handle: No node id found. Make sure to only use a Handle inside a custom Node.",jc=e=>`Edge type "${e}" not found. Using fallback type "default".`,Hc=e=>`Node with id "${e}" does not exist, it may have been removed. This can happen when a node is deleted before the "onNodeClick" handler is called.`,Zc=()=>"useNodeConnections: No node ID found. Call useNodeConnections inside a custom Node or provide a node ID.",Xc=()=>"It seems that you are trying to drag a node that is not initialized. Please use onNodesChange as explained in the docs.",Pt=[[Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY],[Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY]],Sr=["Enter"," ","Escape"],Cr={"node.a11yDescription.default":"Press enter or space to select a node. Press delete to remove it and escape to cancel.","node.a11yDescription.keyboardDisabled":"Press enter or space to select a node. You can then use the arrow keys to move the node around. Press delete to remove it and escape to cancel.","node.a11yDescription.ariaLiveMessage":({direction:e,x:t,y:n})=>`Moved selected node ${e}. New position, x: ${t}, y: ${n}`,"edge.a11yDescription.default":"Press enter or space to select an edge. You can then press delete to remove it or escape to cancel.","controls.ariaLabel":"Control Panel","controls.zoomIn.ariaLabel":"Zoom In","controls.zoomOut.ariaLabel":"Zoom Out","controls.fitView.ariaLabel":"Fit View","controls.interactive.ariaLabel":"Toggle Interactivity","minimap.ariaLabel":"Mini Map","handle.ariaLabel":"Handle"};var Er,Yn,Mr;E.ConnectionMode=void 0,(Er=E.ConnectionMode||(E.ConnectionMode={})).Strict="strict",Er.Loose="loose",E.PanOnScrollMode=void 0,(Yn=E.PanOnScrollMode||(E.PanOnScrollMode={})).Free="free",Yn.Vertical="vertical",Yn.Horizontal="horizontal",E.SelectionMode=void 0,(Mr=E.SelectionMode||(E.SelectionMode={})).Partial="partial",Mr.Full="full";let Nr={inProgress:!1,isValid:null,from:null,fromHandle:null,fromPosition:null,fromNode:null,to:null,toHandle:null,toPosition:null,toNode:null,pointer:null};var zt,kr,un;E.ConnectionLineType=void 0,(zt=E.ConnectionLineType||(E.ConnectionLineType={})).Bezier="default",zt.Straight="straight",zt.Step="step",zt.SmoothStep="smoothstep",zt.SimpleBezier="simplebezier",E.MarkerType=void 0,(kr=E.MarkerType||(E.MarkerType={})).Arrow="arrow",kr.ArrowClosed="arrowclosed",E.Position=void 0,(un=E.Position||(E.Position={})).Left="left",un.Top="top",un.Right="right",un.Bottom="bottom";let _r={[E.Position.Left]:E.Position.Right,[E.Position.Right]:E.Position.Left,[E.Position.Top]:E.Position.Bottom,[E.Position.Bottom]:E.Position.Top};function Pr(e,t){if(!e&&!t)return!0;if(!e||!t||e.size!==t.size)return!1;if(!e.size&&!t.size)return!0;for(let n of e.keys())if(!t.has(n))return!1;return!0}function dn(e,t,n){if(!n)return;let o=[];e.forEach((r,i)=>{t?.has(i)||o.push(r)}),o.length&&n(o)}function zr(e){return e===null?null:e?"valid":"invalid"}let Ir=e=>!!e&&typeof e=="object"&&"id"in e&&"source"in e&&"target"in e,Fn=e=>!!e&&typeof e=="object"&&"id"in e&&"internals"in e&&!("source"in e)&&!("target"in e),It=(e,t=[0,0])=>{let{width:n,height:o}=$e(e),r=e.origin??t,i=n*r[0],a=o*r[1];return{x:e.position.x-i,y:e.position.y-a}},Or=(e,t={nodeOrigin:[0,0]})=>{if(e.length===0)return{x:0,y:0,width:0,height:0};let n=!1,o=e.reduce((r,i)=>{let a=typeof i=="string",s=t.nodeLookup||a?void 0:i;return t.nodeLookup&&(s=a?t.nodeLookup.get(i):Fn(i)?i:t.nodeLookup.get(i.id)),s?(n=!0,hn(r,gn(s,t.nodeOrigin))):r},{x:1/0,y:1/0,x2:-1/0,y2:-1/0});return n?fn(o):{x:0,y:0,width:0,height:0}},lt=(e,t={})=>{let n={x:1/0,y:1/0,x2:-1/0,y2:-1/0},o=!1;return e.forEach(r=>{(t.filter===void 0||t.filter(r))&&(n=hn(n,gn(r)),o=!0)}),o?fn(n):{x:0,y:0,width:0,height:0}},Wn=(e,t,[n,o,r]=[0,0,1],i=!1,a=!1)=>{let s=(t.x-n)/r,l=(t.y-o)/r,c=t.width/r,u=t.height/r,d=[];for(let h of e.values()){let{measured:y,selectable:m=!0,hidden:g=!1}=h;if(a&&!m||g)continue;let x=y.width??h.width??h.initialWidth??0,b=y.height??h.height??h.initialHeight??0,{x:w,y:p}=h.internals.positionAbsolute,f=Tr(s,l,c,u,w,p,x,b),C=x*b,M=i&&f>0;(!h.internals.handleBounds||M||f>=C||h.dragging)&&d.push(h)}return d},Ar=(e,t)=>{let n=new Set;return e.forEach(o=>{n.add(o.id)}),t.filter(o=>n.has(o.source)||n.has(o.target))};async function Yc({nodes:e,width:t,height:n,panZoom:o,minZoom:r,maxZoom:i},a){if(e.size===0)return!0;let s=(function(u,d){let h=new Map,y=d?.nodes?new Set(d.nodes.map(m=>m.id)):null;return u.forEach(m=>{let g;if(d?.includeHiddenNodes){let{width:x,height:b}=$e(m);g=x>0&&b>0}else g=!!(m.measured.width&&m.measured.height&&!m.hidden);!g||y&&!y.has(m.id)||h.set(m.id,m)}),h})(e,a),l=lt(s),c=mn(l,t,n,a?.minZoom??r,a?.maxZoom??i,a?.padding??.1);return await o.setViewport(c,{duration:a?.duration,ease:a?.ease,interpolate:a?.interpolate}),!0}function Dr({nodeId:e,nextPosition:t,nodeLookup:n,nodeOrigin:o=[0,0],nodeExtent:r,onError:i}){let a=n.get(e),s=a.parentId?n.get(a.parentId):void 0,{x:l,y:c}=s?s.internals.positionAbsolute:{x:0,y:0},u=a.origin??o,d=a.extent||r;if(a.extent!=="parent"||a.expandParent)s&&nt(a.extent)&&(d=[[a.extent[0][0]+l,a.extent[0][1]+c],[a.extent[1][0]+l,a.extent[1][1]+c]]);else if(s){let{width:y,height:m}=$e(s);y&&m&&(d=[[l,c],[l+y,c+m]])}else i?.("005",Lc());let h=nt(d)?tt(t,d,a.measured):t;return a.measured.width!==void 0&&a.measured.height!==void 0||i?.("015",Xc()),{position:{x:h.x-l+(a.measured.width??0)*u[0],y:h.y-c+(a.measured.height??0)*u[1]},positionAbsolute:h}}let ut=(e,t=0,n=1)=>Math.min(Math.max(e,t),n),tt=(e={x:0,y:0},t,n)=>({x:ut(e.x,t[0][0],t[1][0]-(n?.width??0)),y:ut(e.y,t[0][1],t[1][1]-(n?.height??0))});function Rr(e,t,n){let{width:o,height:r}=$e(n),{x:i,y:a}=n.internals.positionAbsolute;return tt(e,[[i,a],[i+o,a+r]],t)}let Lr=(e,t,n)=>e<t?ut(Math.abs(e-t),1,t)/t:e>n?-ut(Math.abs(e-n),1,t)/t:0,Kn=(e,t,n=15,o=40)=>[Lr(e.x,o,t.width-o)*n,Lr(e.y,o,t.height-o)*n],hn=(e,t)=>({x:Math.min(e.x,t.x),y:Math.min(e.y,t.y),x2:Math.max(e.x2,t.x2),y2:Math.max(e.y2,t.y2)}),qn=({x:e,y:t,width:n,height:o})=>({x:e,y:t,x2:e+n,y2:t+o}),fn=({x:e,y:t,x2:n,y2:o})=>({x:e,y:t,width:n-e,height:o-t}),Ot=(e,t=[0,0])=>{let{x:n,y:o}=Fn(e)?e.internals.positionAbsolute:It(e,t);return{x:n,y:o,width:e.measured?.width??e.width??e.initialWidth??0,height:e.measured?.height??e.height??e.initialHeight??0}},gn=(e,t=[0,0])=>{let{x:n,y:o}=Fn(e)?e.internals.positionAbsolute:It(e,t);return{x:n,y:o,x2:n+(e.measured?.width??e.width??e.initialWidth??0),y2:o+(e.measured?.height??e.height??e.initialHeight??0)}},$r=(e,t)=>fn(hn(qn(e),qn(t))),Tr=(e,t,n,o,r,i,a,s)=>{let l=Math.max(0,Math.min(e+n,r+a)-Math.max(e,r)),c=Math.max(0,Math.min(t+o,i+s)-Math.max(t,i));return Math.ceil(l*c)},pn=(e,t)=>Tr(e.x,e.y,e.width,e.height,t.x,t.y,t.width,t.height),Br=e=>Le(e.width)&&Le(e.height)&&Le(e.x)&&Le(e.y),Le=e=>!isNaN(e)&&isFinite(e),At=(e,t=[1,1])=>({x:t[0]*Math.round(e.x/t[0]),y:t[1]*Math.round(e.y/t[1])}),Dt=({x:e,y:t},[n,o,r],i=!1,a=[1,1])=>{let s={x:(e-n)/r,y:(t-o)/r};return i?At(s,a):s},dt=({x:e,y:t},[n,o,r])=>({x:e*r+n,y:t*r+o});function ht(e,t){if(typeof e=="number")return Math.floor(.5*(t-t/(1+e)));if(typeof e=="string"&&e.endsWith("px")){let n=parseFloat(e);if(!Number.isNaN(n))return Math.floor(n)}if(typeof e=="string"&&e.endsWith("%")){let n=parseFloat(e);if(!Number.isNaN(n))return Math.floor(t*n*.01)}return console.error(`The padding value "${e}" is invalid. Please provide a number or a string with a valid unit (px or %).`),0}let mn=(e,t,n,o,r,i)=>{let a=(function(x,b,w){if(typeof x=="string"||typeof x=="number"){let p=ht(x,w),f=ht(x,b);return{top:p,right:f,bottom:p,left:f,x:2*f,y:2*p}}if(typeof x=="object"){let p=ht(x.top??x.y??0,w),f=ht(x.bottom??x.y??0,w),C=ht(x.left??x.x??0,b),M=ht(x.right??x.x??0,b);return{top:p,right:M,bottom:f,left:C,x:C+M,y:p+f}}return{top:0,right:0,bottom:0,left:0,x:0,y:0}})(i,t,n),s=(t-a.x)/e.width,l=(n-a.y)/e.height,c=Math.min(s,l),u=ut(c,o,r),d=t/2-(e.x+e.width/2)*u,h=n/2-(e.y+e.height/2)*u,y=(function(x,b,w,p,f,C){let{x:M,y:I}=dt(x,[b,w,p]),{x:O,y:R}=dt({x:x.x+x.width,y:x.y+x.height},[b,w,p]),L=f-O,V=C-R;return{left:Math.floor(M),top:Math.floor(I),right:Math.floor(L),bottom:Math.floor(V)}})(e,d,h,u,t,n),m=Math.min(y.left-a.left,0),g=Math.min(y.top-a.top,0);return{x:d-m+Math.min(y.right-a.right,0),y:h-g+Math.min(y.bottom-a.bottom,0),zoom:u}},Rt=()=>typeof navigator<"u"&&navigator?.userAgent?.indexOf("Mac")>=0;function nt(e){return e!=null&&e!=="parent"}function $e(e){return{width:e.measured?.width??e.width??e.initialWidth??0,height:e.measured?.height??e.height??e.initialHeight??0}}function Gn(e){return(e.measured?.width??e.width??e.initialWidth)!==void 0&&(e.measured?.height??e.height??e.initialHeight)!==void 0}function Vr(e,t={width:0,height:0},n,o,r){let i={...e},a=o.get(n);if(a){let s=a.origin||r;i.x+=a.internals.positionAbsolute.x-(t.width??0)*s[0],i.y+=a.internals.positionAbsolute.y-(t.height??0)*s[1]}return i}function jr(e,t){if(e.size!==t.size)return!1;for(let n of e)if(!t.has(n))return!1;return!0}function Fc(e){return{...Cr,...e||{}}}function Lt(e,{snapGrid:t=[0,0],snapToGrid:n=!1,transform:o,containerBounds:r}){let{x:i,y:a}=Te(e),s=Dt({x:i-(r?.left??0),y:a-(r?.top??0)},o),{x:l,y:c}=n?At(s,t):s;return{xSnapped:l,ySnapped:c,...s}}let Un=e=>({width:e.offsetWidth,height:e.offsetHeight}),Hr=e=>e?.getRootNode?.()||window?.document,Wc=["INPUT","SELECT","TEXTAREA"];function Zr(e){let t=e.composedPath?.()?.[0]||e.target;return t?.nodeType!==1?!1:Wc.includes(t.nodeName)||t.hasAttribute("contenteditable")||!!t.closest(".nokey")}let Xr=e=>"clientX"in e,Te=(e,t)=>{let n=Xr(e),o=n?e.clientX:e.touches?.[0].clientX,r=n?e.clientY:e.touches?.[0].clientY;return{x:o-(t?.left??0),y:r-(t?.top??0)}},Yr=(e,t,n,o,r)=>{let i=t.querySelectorAll(`.${e}`);return i&&i.length?Array.from(i).map(a=>{let s=a.getBoundingClientRect();return{id:a.getAttribute("data-handleid"),type:e,nodeId:r,position:a.getAttribute("data-handlepos"),x:(s.left-n.left)/o,y:(s.top-n.top)/o,...Un(a)}}):null};function Qn({sourceX:e,sourceY:t,targetX:n,targetY:o,sourceControlX:r,sourceControlY:i,targetControlX:a,targetControlY:s}){let l=.125*e+.375*r+.375*a+.125*n,c=.125*t+.375*i+.375*s+.125*o;return[l,c,Math.abs(l-e),Math.abs(c-t)]}function yn(e,t){return e>=0?.5*e:25*t*Math.sqrt(-e)}function Fr({pos:e,x1:t,y1:n,x2:o,y2:r,c:i}){switch(e){case E.Position.Left:return[t-yn(t-o,i),n];case E.Position.Right:return[t+yn(o-t,i),n];case E.Position.Top:return[t,n-yn(n-r,i)];case E.Position.Bottom:return[t,n+yn(r-n,i)]}}function Jn({sourceX:e,sourceY:t,sourcePosition:n=E.Position.Bottom,targetX:o,targetY:r,targetPosition:i=E.Position.Top,curvature:a=.25}){let[s,l]=Fr({pos:n,x1:e,y1:t,x2:o,y2:r,c:a}),[c,u]=Fr({pos:i,x1:o,y1:r,x2:e,y2:t,c:a}),[d,h,y,m]=Qn({sourceX:e,sourceY:t,targetX:o,targetY:r,sourceControlX:s,sourceControlY:l,targetControlX:c,targetControlY:u});return[`M${e},${t} C${s},${l} ${c},${u} ${o},${r}`,d,h,y,m]}function eo({sourceX:e,sourceY:t,targetX:n,targetY:o}){let r=Math.abs(n-e)/2,i=n<e?n+r:n-r,a=Math.abs(o-t)/2;return[i,o<t?o+a:o-a,r,a]}function Kc({sourceNode:e,targetNode:t,width:n,height:o,transform:r}){let i=hn(gn(e),gn(t));i.x===i.x2&&(i.x2+=1),i.y===i.y2&&(i.y2+=1);let a={x:-r[0]/r[2],y:-r[1]/r[2],width:n/r[2],height:o/r[2]};return pn(a,fn(i))>0}let Wr=({source:e,sourceHandle:t,target:n,targetHandle:o})=>`xy-edge__${e}${t||""}-${n}${o||""}`;function to({sourceX:e,sourceY:t,targetX:n,targetY:o}){let[r,i,a,s]=eo({sourceX:e,sourceY:t,targetX:n,targetY:o});return[`M ${e},${t}L ${n},${o}`,r,i,a,s]}let Kr={[E.Position.Left]:{x:-1,y:0},[E.Position.Right]:{x:1,y:0},[E.Position.Top]:{x:0,y:-1},[E.Position.Bottom]:{x:0,y:1}},qr=(e,t)=>Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2));function qc({source:e,sourcePosition:t=E.Position.Bottom,target:n,targetPosition:o=E.Position.Top,center:r,offset:i,stepPosition:a}){let s=Kr[t],l=Kr[o],c={x:e.x+s.x*i,y:e.y+s.y*i},u={x:n.x+l.x*i,y:n.y+l.y*i},d=(({source:I,sourcePosition:O=E.Position.Bottom,target:R})=>O===E.Position.Left||O===E.Position.Right?I.x<R.x?{x:1,y:0}:{x:-1,y:0}:I.y<R.y?{x:0,y:1}:{x:0,y:-1})({source:c,sourcePosition:t,target:u}),h=d.x!==0?"x":"y",y=d[h],m,g,x=[],b={x:0,y:0},w={x:0,y:0},[,,p,f]=eo({sourceX:e.x,sourceY:e.y,targetX:n.x,targetY:n.y});if(s[h]*l[h]===-1){h==="x"?(m=r.x??c.x+(u.x-c.x)*a,g=r.y??(c.y+u.y)/2):(m=r.x??(c.x+u.x)/2,g=r.y??c.y+(u.y-c.y)*a);let I=[{x:m,y:c.y},{x:m,y:u.y}],O=[{x:c.x,y:g},{x:u.x,y:g}];x=s[h]===y?h==="x"?I:O:h==="x"?O:I}else{let I=[{x:c.x,y:u.y}],O=[{x:u.x,y:c.y}];if(x=h==="x"?s.x===y?O:I:s.y===y?I:O,t===o){let V=Math.abs(e[h]-n[h]);if(V<=i){let v=Math.min(i-1,i-V);s[h]===y?b[h]=(c[h]>e[h]?-1:1)*v:w[h]=(u[h]>n[h]?-1:1)*v}}if(t!==o){let V=h==="x"?"y":"x",v=s[h]===l[V],k=c[V]>u[V],S=c[V]<u[V];(s[h]===1&&(!v&&k||v&&S)||s[h]!==1&&(!v&&S||v&&k))&&(x=h==="x"?I:O)}let R={x:c.x+b.x,y:c.y+b.y},L={x:u.x+w.x,y:u.y+w.y};Math.max(Math.abs(R.x-x[0].x),Math.abs(L.x-x[0].x))>=Math.max(Math.abs(R.y-x[0].y),Math.abs(L.y-x[0].y))?(m=(R.x+L.x)/2,g=x[0].y):(m=x[0].x,g=(R.y+L.y)/2)}let C={x:c.x+b.x,y:c.y+b.y},M={x:u.x+w.x,y:u.y+w.y};return[[e,...C.x!==x[0].x||C.y!==x[0].y?[C]:[],...x,...M.x!==x[x.length-1].x||M.y!==x[x.length-1].y?[M]:[],n],m,g,p,f]}function Gc(e,t,n,o){let r=Math.min(qr(e,t)/2,qr(t,n)/2,o),{x:i,y:a}=t;if(e.x===i&&i===n.x||e.y===a&&a===n.y)return`L${i} ${a}`;if(e.y===a)return`L ${i+r*(e.x<n.x?-1:1)},${a}Q ${i},${a} ${i},${a+r*(e.y<n.y?1:-1)}`;let s=e.x<n.x?1:-1;return`L ${i},${a+r*(e.y<n.y?-1:1)}Q ${i},${a} ${i+r*s},${a}`}function vn({sourceX:e,sourceY:t,sourcePosition:n=E.Position.Bottom,targetX:o,targetY:r,targetPosition:i=E.Position.Top,borderRadius:a=5,centerX:s,centerY:l,offset:c=20,stepPosition:u=.5}){let[d,h,y,m,g]=qc({source:{x:e,y:t},sourcePosition:n,target:{x:o,y:r},targetPosition:i,center:{x:s,y:l},offset:c,stepPosition:u}),x=`M${d[0].x} ${d[0].y}`;for(let b=1;b<d.length-1;b++)x+=Gc(d[b-1],d[b],d[b+1],a);return x+=`L${d[d.length-1].x} ${d[d.length-1].y}`,[x,h,y,m,g]}function Gr(e){return e&&!(!e.internals.handleBounds&&!e.handles?.length)&&!!(e.measured.width||e.width||e.initialWidth)}function Ur(e){if(!e)return null;let t=[],n=[];for(let o of e)o.width=o.width??1,o.height=o.height??1,o.type==="source"?t.push(o):o.type==="target"&&n.push(o);return{source:t,target:n}}function ot(e,t,n=E.Position.Left,o=!1){let r=(t?.x??0)+e.internals.positionAbsolute.x,i=(t?.y??0)+e.internals.positionAbsolute.y,{width:a,height:s}=t??$e(e);if(o)return{x:r+a/2,y:i+s/2};switch(t?.position??n){case E.Position.Top:return{x:r+a/2,y:i};case E.Position.Right:return{x:r+a,y:i+s/2};case E.Position.Bottom:return{x:r+a/2,y:i+s};case E.Position.Left:return{x:r,y:i+s/2}}}function Qr(e,t){return e&&(t?e.find(n=>n.id===t):e[0])||null}function no(e,t){return e?typeof e=="string"?e:`${t?`${t}__`:""}${Object.keys(e).sort().map(n=>`${n}=${e[n]}`).join("&")}`:""}function Uc(e,t,n,o,r){let i=.5;r==="start"?i=0:r==="end"&&(i=1);let a=[(e.x+e.width*i)*t.zoom+t.x,e.y*t.zoom+t.y-o],s=[-100*i,-100];switch(n){case E.Position.Right:a=[(e.x+e.width)*t.zoom+t.x+o,(e.y+e.height*i)*t.zoom+t.y],s=[0,-100*i];break;case E.Position.Bottom:a[1]=(e.y+e.height)*t.zoom+t.y+o,s[1]=0;break;case E.Position.Left:a=[e.x*t.zoom+t.x-o,(e.y+e.height*i)*t.zoom+t.y],s=[-100,-100*i]}return`translate(${a[0]}px, ${a[1]}px) translate(${s[0]}%, ${s[1]}%)`}let Qc={left:0,center:50,right:100},Jc={top:0,center:50,bottom:100},oo={nodeOrigin:[0,0],nodeExtent:Pt,elevateNodesOnSelect:!0,zIndexMode:"basic",defaults:{}},el={...oo,checkEquality:!0};function ro(e,t){let n={...e};for(let o in t)t[o]!==void 0&&(n[o]=t[o]);return n}function tl(e,t){if(!e.handles)return e.measured?t?.internals.handleBounds:void 0;let n=[],o=[];for(let r of e.handles){let i={id:r.id,width:r.width??1,height:r.height??1,nodeId:e.id,x:r.x,y:r.y,position:r.position,type:r.type};r.type==="source"?n.push(i):r.type==="target"&&o.push(i)}return{source:n,target:o}}function io(e){return e==="manual"}function ao(e,t,n,o={}){let r=ro(el,o),i={i:0},a=new Map(t),s=r?.elevateNodesOnSelect&&!io(r.zIndexMode)?1e3:0,l=e.length>0,c=!1;t.clear(),n.clear();for(let u of e){let d=a.get(u.id);if(r.checkEquality&&u===d?.internals.userNode)t.set(u.id,d);else{let h=It(u,r.nodeOrigin),y=nt(u.extent)?u.extent:r.nodeExtent,m=tt(h,y,$e(u));d={...r.defaults,...u,measured:{width:u.measured?.width,height:u.measured?.height},internals:{positionAbsolute:m,handleBounds:tl(u,d),z:Jr(u,s,r.zIndexMode),userNode:u}},t.set(u.id,d)}d.measured!==void 0&&d.measured.width!==void 0&&d.measured.height!==void 0||d.hidden||(l=!1),u.parentId&&so(d,t,n,o,i),c||=u.selected??!1}return{nodesInitialized:l,hasSelectedNodes:c}}function so(e,t,n,o,r){let{elevateNodesOnSelect:i,nodeOrigin:a,nodeExtent:s,zIndexMode:l}=ro(oo,o),c=e.parentId,u=t.get(c);if(!u)return void console.warn(`Parent node ${c} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);(function(b,w){if(!b.parentId)return;let p=w.get(b.parentId);p?p.set(b.id,b):w.set(b.parentId,new Map([[b.id,b]]))})(e,n),r&&!u.parentId&&u.internals.rootParentIndex===void 0&&l==="auto"&&(u.internals.rootParentIndex=++r.i,u.internals.z=u.internals.z+10*r.i),r&&u.internals.rootParentIndex!==void 0&&(r.i=u.internals.rootParentIndex);let d=i&&!io(l)?1e3:0,{x:h,y,z:m}=(function(b,w,p,f,C,M){let{x:I,y:O}=w.internals.positionAbsolute,R=$e(b),L=It(b,p),V=nt(b.extent)?tt(L,b.extent,R):L,v=tt({x:I+V.x,y:O+V.y},f,R);b.extent==="parent"&&(v=Rr(v,R,w));let k=Jr(b,C,M),S=w.internals.z??0;return{x:v.x,y:v.y,z:S>=k?S+1:k}})(e,u,a,s,d,l),{positionAbsolute:g}=e.internals,x=h!==g.x||y!==g.y;(x||m!==e.internals.z)&&t.set(e.id,{...e,internals:{...e.internals,positionAbsolute:x?{x:h,y}:g,z:m}})}function Jr(e,t,n){let o=Le(e.zIndex)?e.zIndex:0;return io(n)?o:o+(e.selected?t:0)}function co(e,t,n,o=[0,0]){let r=[],i=new Map;for(let a of e){let s=t.get(a.parentId);if(!s)continue;let l=i.get(a.parentId)?.expandedRect??Ot(s),c=$r(l,a.rect);i.set(a.parentId,{expandedRect:c,parent:s})}return i.size>0&&i.forEach(({expandedRect:a,parent:s},l)=>{let c=s.internals.positionAbsolute,u=$e(s),d=s.origin??o,h=a.x<c.x?Math.round(Math.abs(c.x-a.x)):0,y=a.y<c.y?Math.round(Math.abs(c.y-a.y)):0,m=Math.max(u.width,Math.round(a.width)),g=Math.max(u.height,Math.round(a.height)),x=(m-u.width)*d[0],b=(g-u.height)*d[1];(h>0||y>0||x||b)&&(r.push({id:l,type:"position",position:{x:s.position.x-h+x,y:s.position.y-y+b}}),n.get(l)?.forEach(w=>{e.some(p=>p.id===w.id)||r.push({id:w.id,type:"position",position:{x:w.position.x+h,y:w.position.y+y}})})),(u.width<a.width||u.height<a.height||h||y)&&r.push({id:l,type:"dimensions",setAttributes:!0,dimensions:{width:m+(h?d[0]*h-x:0),height:g+(y?d[1]*y-b:0)}})}),r}function ei(e,t,n,o,r,i){let a=r,s=o.get(a)||new Map;o.set(a,s.set(n,t)),a=`${r}-${e}`;let l=o.get(a)||new Map;if(o.set(a,l.set(n,t)),i){a=`${r}-${e}-${i}`;let c=o.get(a)||new Map;o.set(a,c.set(n,t))}}function ti(e,t,n){e.clear(),t.clear();for(let o of n){let{source:r,target:i,sourceHandle:a=null,targetHandle:s=null}=o,l={edgeId:o.id,source:r,target:i,sourceHandle:a,targetHandle:s},c=`${r}-${a}--${i}-${s}`;ei("source",l,`${i}-${s}--${r}-${a}`,e,r,a),ei("target",l,c,e,i,s),t.set(o.id,o)}}function nl(e,t){if(e===null||t===null)return!1;let n=Array.isArray(e)?e:[e],o=Array.isArray(t)?t:[t];if(n.length!==o.length)return!1;for(let r=0;r<n.length;r++)if(n[r].id!==o[r].id||n[r].type!==o[r].type||!Object.is(n[r].data,o[r].data))return!1;return!0}function ni(e,t){if(!e.parentId)return!1;let n=t.get(e.parentId);return!!n&&(!!n.selected||ni(n,t))}function oi(e,t,n){let o=e;do{if(o?.matches?.(t))return!0;if(o===n)return!1;o=o?.parentElement}while(o);return!1}function lo({nodeId:e,dragItems:t,nodeLookup:n,dragging:o=!0}){let r=[];for(let[a,s]of t){let l=n.get(a)?.internals.userNode;l&&r.push({...l,position:s.position,dragging:o})}if(!e)return[r[0],r];let i=n.get(e)?.internals.userNode;return[i?{...i,position:t.get(e)?.position||i.position,dragging:o}:r[0],r]}function ol({onNodeMouseDown:e,getStoreItems:t,onDragStart:n,onDrag:o,onDragStop:r}){let i={x:null,y:null},a=0,s=new Map,l=!1,c={x:0,y:0},u=null,d=!1,h=null,y=!1,m=!1,g=null;return{update:function({noDragClassName:x,handleSelector:b,domNode:w,isSelectable:p,nodeId:f,nodeClickDistance:C=0}){function M({x:L,y:V}){let{nodeLookup:v,nodeExtent:k,snapGrid:S,snapToGrid:N,nodeOrigin:z,onNodeDrag:D,onSelectionDrag:$,onError:j,updateNodePositions:A}=t();i={x:L,y:V};let Z=!1,B=s.size>1,K=B&&k?qn(lt(s)):null,J=B&&N?(function({dragItems:T,snapGrid:H,x:U,y:Y}){let X=T.values().next().value;if(!X)return null;let F={x:U-X.distance.x,y:Y-X.distance.y},Q=At(F,H);return{x:Q.x-F.x,y:Q.y-F.y}})({dragItems:s,snapGrid:S,x:L,y:V}):null;for(let[T,H]of s){if(!v.has(T))continue;let U={x:L-H.distance.x,y:V-H.distance.y};N&&(U=J?{x:Math.round(U.x+J.x),y:Math.round(U.y+J.y)}:At(U,S));let Y=null;if(B&&k&&!H.extent&&K){let{positionAbsolute:Q}=H.internals,G=Q.x-K.x+k[0][0],W=Q.x+H.measured.width-K.x2+k[1][0];Y=[[G,Q.y-K.y+k[0][1]],[W,Q.y+H.measured.height-K.y2+k[1][1]]]}let{position:X,positionAbsolute:F}=Dr({nodeId:T,nextPosition:U,nodeLookup:v,nodeExtent:Y||k,nodeOrigin:z,onError:j});Z=Z||H.position.x!==X.x||H.position.y!==X.y,H.position=X,H.internals.positionAbsolute=F}if(m=m||Z,Z&&(A(s,!0),g&&(o||D||!f&&$))){let[T,H]=lo({nodeId:f,dragItems:s,nodeLookup:v});o?.(g,s,T,H),D?.(g,T,H),f||$?.(g,H)}}async function I(){if(!u)return;let{transform:L,panBy:V,autoPanSpeed:v,autoPanOnNodeDrag:k}=t();if(!k)return l=!1,void cancelAnimationFrame(a);let[S,N]=Kn(c,u,v);S===0&&N===0||(i.x=(i.x??0)-S/L[2],i.y=(i.y??0)-N/L[2],await V({x:S,y:N})&&M(i)),a=requestAnimationFrame(I)}function O(L){let{nodeLookup:V,multiSelectionActive:v,nodesDraggable:k,transform:S,snapGrid:N,snapToGrid:z,selectNodesOnDrag:D,onNodeDragStart:$,onSelectionDragStart:j,unselectNodesAndEdges:A}=t();d=!0,D&&p||v||!f||V.get(f)?.selected||A(),p&&D&&f&&e?.(f);let Z=Lt(L.sourceEvent,{transform:S,snapGrid:N,snapToGrid:z,containerBounds:u});if(i=Z,s=(function(B,K,J,T){let H=new Map;for(let[U,Y]of B)if((Y.selected||Y.id===T)&&(!Y.parentId||!ni(Y,B))&&(Y.draggable||K&&Y.draggable===void 0)){let X=B.get(U);X&&H.set(U,{id:U,position:X.position||{x:0,y:0},distance:{x:J.x-X.internals.positionAbsolute.x,y:J.y-X.internals.positionAbsolute.y},extent:X.extent,parentId:X.parentId,origin:X.origin,expandParent:X.expandParent,internals:{positionAbsolute:X.internals.positionAbsolute||{x:0,y:0}},measured:{width:X.measured.width??0,height:X.measured.height??0}})}return H})(V,k,Z,f),s.size>0&&(n||$||!f&&j)){let[B,K]=lo({nodeId:f,dragItems:s,nodeLookup:V});n?.(L.sourceEvent,s,B,K),$?.(L.sourceEvent,B,K),f||j?.(L.sourceEvent,K)}}h=Pe(w);let R=Ko().clickDistance(C).on("start",L=>{let{domNode:V,nodeDragThreshold:v,transform:k,snapGrid:S,snapToGrid:N}=t();u=V?.getBoundingClientRect()||null,y=!1,m=!1,g=L.sourceEvent,v===0&&O(L),i=Lt(L.sourceEvent,{transform:k,snapGrid:S,snapToGrid:N,containerBounds:u}),c=Te(L.sourceEvent,u)}).on("drag",L=>{let{autoPanOnNodeDrag:V,transform:v,snapGrid:k,snapToGrid:S,nodeDragThreshold:N,nodeLookup:z}=t(),D=Lt(L.sourceEvent,{transform:v,snapGrid:k,snapToGrid:S,containerBounds:u});if(g=L.sourceEvent,(L.sourceEvent.type==="touchmove"&&L.sourceEvent.touches.length>1||f&&!z.has(f))&&(y=!0),!y){if(!l&&V&&d&&(l=!0,I()),!d){let $=Te(L.sourceEvent,u),j=$.x-c.x,A=$.y-c.y;Math.sqrt(j*j+A*A)>N&&O(L)}(i.x!==D.xSnapped||i.y!==D.ySnapped)&&s&&d&&(c=Te(L.sourceEvent,u),M(D))}}).on("end",L=>{if(d&&!y){if(l=!1,d=!1,cancelAnimationFrame(a),s.size>0){let{nodeLookup:V,updateNodePositions:v,onNodeDragStop:k,onSelectionDragStop:S}=t();if(m&&(v(s,!1),m=!1),r||k||!f&&S){let[N,z]=lo({nodeId:f,dragItems:s,nodeLookup:V,dragging:!1});r?.(L.sourceEvent,s,N,z),k?.(L.sourceEvent,N,z),f||S?.(L.sourceEvent,z)}}}else y&&s.size>0&&t().updateNodePositions(s,!1)}).filter(L=>{let V=L.target;return!L.button&&(!x||!oi(V,`.${x}`,w))&&(!b||oi(V,b,w))});h.call(R)},destroy:function(){h?.on(".drag",null)}}}function rl(e,t,n,o){let r=[],i=1/0,a=(function(s,l,c){let u=[],d={x:s.x-c,y:s.y-c,width:2*c,height:2*c};for(let h of l.values())pn(d,Ot(h))>0&&u.push(h);return u})(e,n,t+250);for(let s of a){let l=[...s.internals.handleBounds?.source??[],...s.internals.handleBounds?.target??[]];for(let c of l){if(o.nodeId===c.nodeId&&o.type===c.type&&o.id===c.id)continue;let{x:u,y:d}=ot(s,c,c.position,!0),h=Math.sqrt(Math.pow(u-e.x,2)+Math.pow(d-e.y,2));h>t||(h<i?(r=[{...c,x:u,y:d}],i=h):h===i&&r.push({...c,x:u,y:d}))}}if(!r.length)return null;if(r.length>1){let s=o.type==="source"?"target":"source";return r.find(l=>l.type===s)??r[0]}return r[0]}function ri(e,t,n,o,r,i=!1){let a=o.get(e);if(!a)return null;let s=r==="strict"?a.internals.handleBounds?.[t]:[...a.internals.handleBounds?.source??[],...a.internals.handleBounds?.target??[]],l=(n?s?.find(c=>c.id===n):s?.[0])??null;return l&&i?{...l,...ot(a,l,l.position,!0)}:l}function ii(e,t){return e||(t?.classList.contains("target")?"target":t?.classList.contains("source")?"source":null)}let ai=()=>!0;function si(e,{handle:t,connectionMode:n,fromNodeId:o,fromHandleId:r,fromType:i,doc:a,lib:s,flowId:l,isValidConnection:c=ai,nodeLookup:u}){let d=i==="target",h=t?a.querySelector(`.${s}-flow__handle[data-id="${l}-${t?.nodeId}-${t?.id}-${t?.type}"]`):null,{x:y,y:m}=Te(e),g=a.elementFromPoint(y,m),x=g?.classList.contains(`${s}-flow__handle`)?g:h,b={handleDomNode:x,isValid:!1,connection:null,toHandle:null};if(x){let w=ii(void 0,x),p=x.getAttribute("data-nodeid"),f=x.getAttribute("data-handleid"),C=x.classList.contains("connectable"),M=x.classList.contains("connectableend");if(!p||!w)return b;let I={source:d?p:o,sourceHandle:d?f:r,target:d?o:p,targetHandle:d?r:f};b.connection=I;let O=C&&M&&(n===E.ConnectionMode.Strict?d&&w==="source"||!d&&w==="target":p!==o||f!==r);b.isValid=O&&c(I),b.toHandle=ri(p,w,f,u,n,!0)}return b}let uo={onPointerDown:function(e,{connectionMode:t,connectionRadius:n,handleId:o,nodeId:r,edgeUpdaterType:i,isTarget:a,domNode:s,nodeLookup:l,lib:c,autoPanOnConnect:u,flowId:d,panBy:h,cancelConnection:y,onConnectStart:m,onConnect:g,onConnectEnd:x,isValidConnection:b=ai,onReconnectEnd:w,updateConnection:p,getTransform:f,getFromHandle:C,autoPanSpeed:M,dragThreshold:I=1,handleDomNode:O}){let R=Hr(e.target),L,V=0,{x:v,y:k}=Te(e),S=ii(i,O),N=s?.getBoundingClientRect(),z=!1;if(!N||!S)return;let D=ri(r,S,o,l,t);if(!D)return;let $=Te(e,N),j=!1,A=null,Z=!1,B=null;function K(){if(!u||!N)return;let[F,Q]=Kn($,N,M);h({x:F,y:Q}),V=requestAnimationFrame(K)}let J={...D,nodeId:r,type:S,position:D.position},T=l.get(r),H={inProgress:!0,isValid:null,from:ot(T,J,E.Position.Left,!0),fromHandle:J,fromPosition:J.position,fromNode:T,to:$,toHandle:null,toPosition:_r[J.position],toNode:null,pointer:$};function U(){z=!0,p(H),m?.(e,{nodeId:r,handleId:o,handleType:S})}function Y(F){if(!z){let{x:ie,y:ce}=Te(F),se=ie-v,te=ce-k;if(!(se*se+te*te>I*I))return;U()}if(!C()||!J)return void X(F);let Q=f();$=Te(F,N),L=rl(Dt($,Q,!1,[1,1]),n,l,J),j||(K(),j=!0);let G=si(F,{handle:L,connectionMode:t,fromNodeId:r,fromHandleId:o,fromType:a?"target":"source",isValidConnection:b,doc:R,lib:c,flowId:d,nodeLookup:l});B=G.handleDomNode,A=G.connection,Z=(function(ie,ce){let se=null;return ce?se=!0:ie&&!ce&&(se=!1),se})(!!L,G.isValid);let W=l.get(r),ee=W?ot(W,J,E.Position.Left,!0):H.from,ne={...H,from:ee,isValid:Z,to:G.toHandle&&Z?dt({x:G.toHandle.x,y:G.toHandle.y},Q):$,toHandle:G.toHandle,toPosition:Z&&G.toHandle?G.toHandle.position:_r[J.position],toNode:G.toHandle?l.get(G.toHandle.nodeId):null,pointer:$};p(ne),H=ne}function X(F){if(!("touches"in F&&F.touches.length>0)){if(z){(L||B)&&A&&Z&&g?.(A);let{inProgress:Q,...G}=H,W={...G,toPosition:H.toHandle?H.toPosition:null};x?.(F,W),i&&w?.(F,W)}y(),cancelAnimationFrame(V),j=!1,Z=!1,A=null,B=null,R.removeEventListener("mousemove",Y),R.removeEventListener("mouseup",X),R.removeEventListener("touchmove",Y),R.removeEventListener("touchend",X)}}I===0&&U(),R.addEventListener("mousemove",Y),R.addEventListener("mouseup",X),R.addEventListener("touchmove",Y),R.addEventListener("touchend",X)},isValid:si},xn=e=>({x:e.x,y:e.y,zoom:e.k}),ho=({x:e,y:t,zoom:n})=>ln.translate(e,t).scale(n),We=(e,t)=>e.target.closest(`.${t}`),ci=(e,t)=>t===2&&Array.isArray(e)&&e.includes(2),il=e=>((e*=2)<=1?e*e*e:(e-=2)*e*e+2)/2,fo=(e,t=0,n=il,o=()=>{})=>{let r=typeof t=="number"&&t>0;return r||o(),r?e.transition().duration(t).ease(n).on("end",o):e},li=e=>{let t=e.ctrlKey&&Rt()?10:1;return-e.deltaY*(e.deltaMode===1?.05:e.deltaMode?1:.002)*t};function al({domNode:e,minZoom:t,maxZoom:n,translateExtent:o,viewport:r,onPanZoom:i,onPanZoomStart:a,onPanZoomEnd:s,onDraggingChange:l}){let c={isZoomingOrPanning:!1,usedRightMouseButton:!1,prevViewport:{},mouseButton:0,timerId:void 0,panScrollTimeout:void 0,isPanScrolling:!1},u=e.getBoundingClientRect(),d=[[0,0],[u.width,u.height]];(typeof ResizeObserver<"u"?new ResizeObserver(f=>{let C=f[0];C&&(d=[[0,0],[C.contentRect.width,C.contentRect.height]])}):null)?.observe(e);let y=wr().extent(()=>d).scaleExtent([t,n]).translateExtent(o),m=Pe(e).call(y);p({x:r.x,y:r.y,zoom:ut(r.zoom,t,n)},[[0,0],[u.width,u.height]],o);let g=m.on("wheel.zoom"),x=m.on("dblclick.zoom");async function b(f,C){return!!m&&new Promise(M=>{y?.interpolate(C?.interpolate==="linear"?Ct:tn).transform(fo(m,C?.duration,C?.ease,()=>M(!0)),f)})}function w(){y.on("zoom",null)}async function p(f,C,M){let I=ho(f),O=y?.constrain()(I,C,M);return O&&await b(O),O}return y.wheelDelta(li),{update:function({noWheelClassName:f,noPanClassName:C,onPaneContextMenu:M,userSelectionActive:I,panOnScroll:O,panOnDrag:R,panOnScrollMode:L,panOnScrollSpeed:V,preventScrolling:v,zoomOnPinch:k,zoomOnScroll:S,zoomOnDoubleClick:N,panActivationKeyPressed:z=!1,zoomActivationKeyPressed:D,lib:$,onTransformChange:j,connectionInProgress:A,paneClickDistance:Z,selectionOnDrag:B}){I&&!c.isZoomingOrPanning&&w();let K=O&&!D&&!I;y.clickDistance(B?1/0:!Le(Z)||Z<0?0:Z);let J=K?(function({zoomPanValues:X,noWheelClassName:F,d3Selection:Q,d3Zoom:G,panOnScrollMode:W,panOnScrollSpeed:ee,zoomOnPinch:ne,onPanZoomStart:ie,onPanZoom:ce,onPanZoomEnd:se}){return te=>{if(We(te,F))return te.ctrlKey&&te.preventDefault(),!1;te.preventDefault(),te.stopImmediatePropagation();let ae=Q.property("__zoom").k||1;if(te.ctrlKey&&ne){let ve=Ae(te),Ie=li(te),ue=ae*Math.pow(2,Ie);return void G.scaleTo(Q,ue,ve,te)}let q=te.deltaMode===1?20:1,re=W===E.PanOnScrollMode.Vertical?0:te.deltaX*q,we=W===E.PanOnScrollMode.Horizontal?0:te.deltaY*q;!Rt()&&te.shiftKey&&W!==E.PanOnScrollMode.Vertical&&(re=te.deltaY*q,we=0),G.translateBy(Q,-re/ae*ee,-we/ae*ee,{internal:!0});let fe=xn(Q.property("__zoom"));clearTimeout(X.panScrollTimeout),X.isPanScrolling?ce?.(te,fe):(X.isPanScrolling=!0,ie?.(te,fe)),X.panScrollTimeout=setTimeout(()=>{se?.(te,fe),X.isPanScrolling=!1},150)}})({zoomPanValues:c,noWheelClassName:f,d3Selection:m,d3Zoom:y,panOnScrollMode:L,panOnScrollSpeed:V,zoomOnPinch:k,onPanZoomStart:a,onPanZoom:i,onPanZoomEnd:s}):(function({noWheelClassName:X,preventScrolling:F,d3ZoomHandler:Q}){return function(G,W){let ee=G.type==="wheel",ne=!F&&ee&&!G.ctrlKey,ie=We(G,X);if(G.ctrlKey&&ee&&ie&&G.preventDefault(),ne||ie)return null;G.preventDefault(),Q.call(this,G,W)}})({noWheelClassName:f,preventScrolling:v,d3ZoomHandler:g});m.on("wheel.zoom",J,{passive:!1});let T=(function({zoomPanValues:X,onDraggingChange:F,onPanZoomStart:Q}){return G=>{if(G.sourceEvent?.internal)return;let W=xn(G.transform);X.mouseButton=G.sourceEvent?.button||0,X.isZoomingOrPanning=!0,X.prevViewport=W,G.sourceEvent?.type==="mousedown"&&F(!0),Q&&Q?.(G.sourceEvent,W)}})({zoomPanValues:c,onDraggingChange:l,onPanZoomStart:a});y.on("start",T);let H=(function({zoomPanValues:X,panOnDrag:F,onPaneContextMenu:Q,onTransformChange:G,onPanZoom:W}){return ee=>{X.usedRightMouseButton=!(!Q||!ci(F,X.mouseButton??0)),ee.sourceEvent?.sync||G([ee.transform.x,ee.transform.y,ee.transform.k]),W&&!ee.sourceEvent?.internal&&W?.(ee.sourceEvent,xn(ee.transform))}})({zoomPanValues:c,panOnDrag:R,onPaneContextMenu:!!M,onPanZoom:i,onTransformChange:j});y.on("zoom",H);let U=(function({zoomPanValues:X,panOnDrag:F,panOnScroll:Q,onDraggingChange:G,onPanZoomEnd:W,onPaneContextMenu:ee}){return ne=>{if(!ne.sourceEvent?.internal&&(X.isZoomingOrPanning=!1,ee&&ci(F,X.mouseButton??0)&&!X.usedRightMouseButton&&ne.sourceEvent&&ee(ne.sourceEvent),X.usedRightMouseButton=!1,G(!1),W)){let ie=xn(ne.transform);X.prevViewport=ie,clearTimeout(X.timerId),X.timerId=setTimeout(()=>{W?.(ne.sourceEvent,ie)},Q?150:0)}}})({zoomPanValues:c,panOnDrag:R,panOnScroll:O,onPaneContextMenu:M,onPanZoomEnd:s,onDraggingChange:l});y.on("end",U);let Y=(function({panActivationKeyPressed:X,zoomActivationKeyPressed:F,zoomOnScroll:Q,zoomOnPinch:G,panOnDrag:W,panOnScroll:ee,zoomOnDoubleClick:ne,userSelectionActive:ie,noWheelClassName:ce,noPanClassName:se,lib:te,connectionInProgress:ae}){return q=>{let re=F||Q,we=G&&q.ctrlKey,fe=q.type==="wheel";if(q.button===1&&q.type==="mousedown"&&(We(q,`${te}-flow__node`)||We(q,`${te}-flow__edge`)||We(q,`${te}-flow__selection`)||We(q,`${te}-flow__nodesselection`)))return!0;if(!(W||re||ee||ne||G)||ie||ae&&!fe||We(q,ce)&&fe||We(q,se)&&(!fe||ee&&fe&&!F)||!G&&q.ctrlKey&&fe)return!1;if(!G&&q.type==="touchstart"&&q.touches?.length>1)return q.preventDefault(),!1;if(!re&&!ee&&!we&&fe||!W&&(q.type==="mousedown"||q.type==="touchstart")||Array.isArray(W)&&!W.includes(q.button)&&q.type==="mousedown")return!1;let ve=Array.isArray(W)&&W.includes(q.button)||!q.button||q.button<=1;return(!q.ctrlKey||fe||X)&&ve}})({panActivationKeyPressed:z,zoomActivationKeyPressed:D,panOnDrag:R,zoomOnScroll:S,panOnScroll:O,zoomOnDoubleClick:N,zoomOnPinch:k,userSelectionActive:I,noPanClassName:C,noWheelClassName:f,lib:$,connectionInProgress:A});y.filter(Y),N?m.on("dblclick.zoom",x):m.on("dblclick.zoom",null)},destroy:w,setViewport:async function(f,C){let M=ho(f);return await b(M,C),M},setViewportConstrained:p,getViewport:function(){let f=m?vr(m.node()):{x:0,y:0,k:1};return{x:f.x,y:f.y,zoom:f.k}},scaleTo:async function(f,C){return!!m&&new Promise(M=>{y?.interpolate(C?.interpolate==="linear"?Ct:tn).scaleTo(fo(m,C?.duration,C?.ease,()=>M(!0)),f)})},scaleBy:async function(f,C){return!!m&&new Promise(M=>{y?.interpolate(C?.interpolate==="linear"?Ct:tn).scaleBy(fo(m,C?.duration,C?.ease,()=>M(!0)),f)})},setScaleExtent:function(f){y?.scaleExtent(f)},setTranslateExtent:function(f){y?.translateExtent(f)},syncViewport:function(f){if(m){let C=ho(f),M=m.property("__zoom");M.k===f.zoom&&M.x===f.x&&M.y===f.y||y?.transform(m,C,null,{sync:!0})}},setClickDistance:function(f){let C=!Le(f)||f<0?0:f;y?.clickDistance(C)}}}var ui;E.ResizeControlVariant=void 0,(ui=E.ResizeControlVariant||(E.ResizeControlVariant={})).Line="line",ui.Handle="handle";let sl=["top-left","top-right","bottom-left","bottom-right"],cl=["top","right","bottom","left"];function di(e){return{isHorizontal:e.includes("right")||e.includes("left"),isVertical:e.includes("bottom")||e.includes("top"),affectsX:e.includes("left"),affectsY:e.includes("top")}}function Ke(e,t){return Math.max(0,t-e)}function qe(e,t){return Math.max(0,e-t)}function wn(e,t,n){return Math.max(0,t-e,e-n)}function hi(e,t){return e?!t:t}let fi={width:0,height:0,x:0,y:0},ll={...fi,pointerX:0,pointerY:0,aspectRatio:1};function ul(e,t,n){let o=t.position.x+e.position.x,r=t.position.y+e.position.y,i=e.measured.width??0,a=e.measured.height??0,s=n[0]*i,l=n[1]*a;return[[o-s,r-l],[o+i-s,r+a-l]]}function dl({domNode:e,nodeId:t,getStoreItems:n,onChange:o,onEnd:r}){let i=Pe(e),a={controlDirection:di("bottom-right"),boundaries:{minWidth:0,minHeight:0,maxWidth:Number.MAX_VALUE,maxHeight:Number.MAX_VALUE},resizeDirection:void 0,keepAspectRatio:!1};return{update:function({controlPosition:s,boundaries:l,keepAspectRatio:c,resizeDirection:u,onResizeStart:d,onResize:h,onResizeEnd:y,shouldResize:m}){let g,x={...fi},b={...ll};a={boundaries:l,resizeDirection:u,keepAspectRatio:c,controlDirection:di(s)};let w,p,f,C=null,M=[],I=!1,O=Ko().on("start",R=>{let{nodeLookup:L,transform:V,snapGrid:v,snapToGrid:k,nodeOrigin:S,paneDomNode:N}=n();if(g=L.get(t),!g)return;C=N?.getBoundingClientRect()??null;let{xSnapped:z,ySnapped:D}=Lt(R.sourceEvent,{transform:V,snapGrid:v,snapToGrid:k,containerBounds:C});x={width:g.measured.width??0,height:g.measured.height??0,x:g.position.x??0,y:g.position.y??0},b={...x,pointerX:z,pointerY:D,aspectRatio:x.width/x.height},w=void 0,p=nt(g.extent)?g.extent:void 0,g.parentId&&(g.extent==="parent"||g.expandParent)&&(w=L.get(g.parentId)),w&&g.extent==="parent"&&(p=[[0,0],[w.measured.width,w.measured.height]]),M=[],f=void 0;for(let[$,j]of L)if(j.parentId===t&&(M.push({id:$,position:{...j.position},extent:j.extent}),j.extent==="parent"||j.expandParent)){let A=ul(j,g,j.origin??S);f=f?[[Math.min(A[0][0],f[0][0]),Math.min(A[0][1],f[0][1])],[Math.max(A[1][0],f[1][0]),Math.max(A[1][1],f[1][1])]]:A}d?.(R,{...x})}).on("drag",R=>{let{transform:L,snapGrid:V,snapToGrid:v,nodeOrigin:k}=n(),S=Lt(R.sourceEvent,{transform:L,snapGrid:V,snapToGrid:v,containerBounds:C}),N=[];if(!g)return;let{x:z,y:D,width:$,height:j}=x,A={},Z=g.origin??k,{width:B,height:K,x:J,y:T}=(function(W,ee,ne,ie,ce,se,te,ae){let{affectsX:q,affectsY:re}=ee,{isHorizontal:we,isVertical:fe}=ee,ve=we&&fe,{xSnapped:Ie,ySnapped:ue}=ne,{minWidth:Ce,maxWidth:Oe,minHeight:ye,maxHeight:Se}=ie,{x:be,y:Me,width:jt,height:Ht,aspectRatio:he}=W,ge=Math.floor(we?Ie-W.pointerX:0),pe=Math.floor(fe?ue-W.pointerY:0),Ye=jt+(q?-ge:ge),Fe=Ht+(re?-pe:pe),mt=-se[0]*jt,yt=-se[1]*Ht,Ne=wn(Ye,Ce,Oe),ke=wn(Fe,ye,Se);if(te){let ze=0,xe=0;q&&ge<0?ze=Ke(be+ge+mt,te[0][0]):!q&&ge>0&&(ze=qe(be+Ye+mt,te[1][0])),re&&pe<0?xe=Ke(Me+pe+yt,te[0][1]):!re&&pe>0&&(xe=qe(Me+Fe+yt,te[1][1])),Ne=Math.max(Ne,ze),ke=Math.max(ke,xe)}if(ae){let ze=0,xe=0;q&&ge>0?ze=qe(be+ge,ae[0][0]):!q&&ge<0&&(ze=Ke(be+Ye,ae[1][0])),re&&pe>0?xe=qe(Me+pe,ae[0][1]):!re&&pe<0&&(xe=Ke(Me+Fe,ae[1][1])),Ne=Math.max(Ne,ze),ke=Math.max(ke,xe)}if(ce){if(we){let ze=wn(Ye/he,ye,Se)*he;if(Ne=Math.max(Ne,ze),te){let xe=0;xe=!q&&!re||q&&!re&&ve?qe(Me+yt+Ye/he,te[1][1])*he:Ke(Me+yt+(q?ge:-ge)/he,te[0][1])*he,Ne=Math.max(Ne,xe)}if(ae){let xe=0;xe=!q&&!re||q&&!re&&ve?Ke(Me+Ye/he,ae[1][1])*he:qe(Me+(q?ge:-ge)/he,ae[0][1])*he,Ne=Math.max(Ne,xe)}}if(fe){let ze=wn(Fe*he,Ce,Oe)/he;if(ke=Math.max(ke,ze),te){let xe=0;xe=!q&&!re||re&&!q&&ve?qe(be+Fe*he+mt,te[1][0])/he:Ke(be+(re?pe:-pe)*he+mt,te[0][0])/he,ke=Math.max(ke,xe)}if(ae){let xe=0;xe=!q&&!re||re&&!q&&ve?Ke(be+Fe*he,ae[1][0])/he:qe(be+(re?pe:-pe)*he,ae[0][0])/he,ke=Math.max(ke,xe)}}}pe+=pe<0?ke:-ke,ge+=ge<0?Ne:-Ne,ce&&(ve?Ye>Fe*he?pe=(hi(q,re)?-ge:ge)/he:ge=(hi(q,re)?-pe:pe)*he:we?(pe=ge/he,re=q):(ge=pe*he,q=re));let ko=q?be+ge:be,_o=re?Me+pe:Me;return{width:jt+(q?-ge:ge),height:Ht+(re?-pe:pe),x:se[0]*ge*(q?-1:1)+ko,y:se[1]*pe*(re?-1:1)+_o}})(b,a.controlDirection,S,a.boundaries,a.keepAspectRatio,Z,p,f),H=B!==$,U=K!==j,Y=J!==z&&H,X=T!==D&&U;if(!(Y||X||H||U))return;if((Y||X||Z[0]===1||Z[1]===1)&&(A.x=Y?J:x.x,A.y=X?T:x.y,x.x=A.x,x.y=A.y,M.length>0)){let W=J-z,ee=T-D;for(let ne of M)ne.position={x:ne.position.x-W+Z[0]*(B-$),y:ne.position.y-ee+Z[1]*(K-j)},N.push(ne)}if((H||U)&&(A.width=!H||a.resizeDirection&&a.resizeDirection!=="horizontal"?x.width:B,A.height=!U||a.resizeDirection&&a.resizeDirection!=="vertical"?x.height:K,x.width=A.width,x.height=A.height),w&&g.expandParent){let W=Z[0]*(A.width??0);A.x&&A.x<W&&(x.x=W,b.x=b.x-(A.x-W));let ee=Z[1]*(A.height??0);A.y&&A.y<ee&&(x.y=ee,b.y=b.y-(A.y-ee))}let F=(function({width:W,prevWidth:ee,height:ne,prevHeight:ie,affectsX:ce,affectsY:se}){let te=W-ee,ae=ne-ie,q=[te>0?1:te<0?-1:0,ae>0?1:ae<0?-1:0];return te&&ce&&(q[0]=-1*q[0]),ae&&se&&(q[1]=-1*q[1]),q})({width:x.width,prevWidth:$,height:x.height,prevHeight:j,affectsX:a.controlDirection.affectsX,affectsY:a.controlDirection.affectsY}),Q={...x,direction:F};m?.(R,Q)!==!1&&(I=!0,h?.(R,Q),o(A,N))}).on("end",R=>{I&&(y?.(R,{...x}),r?.({...x}),I=!1)});i.call(O)},destroy:function(){i.on(".drag",null)}}}function hl(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var gi,pi,mi,yi={exports:{}},go={},vi={exports:{}},po={};function fl(){return pi||(pi=1,vi.exports=(function(){if(gi)return po;gi=1;var e=_,t=typeof Object.is=="function"?Object.is:function(l,c){return l===c&&(l!==0||1/l==1/c)||l!=l&&c!=c},n=e.useState,o=e.useEffect,r=e.useLayoutEffect,i=e.useDebugValue;function a(l){var c=l.getSnapshot;l=l.value;try{var u=c();return!t(l,u)}catch{return!0}}var s=typeof window>"u"||window.document===void 0||window.document.createElement===void 0?function(l,c){return c()}:function(l,c){var u=c(),d=n({inst:{value:u,getSnapshot:c}}),h=d[0].inst,y=d[1];return r(function(){h.value=u,h.getSnapshot=c,a(h)&&y({inst:h})},[l,u,c]),o(function(){return a(h)&&y({inst:h}),l(function(){a(h)&&y({inst:h})})},[l]),i(u),u};return po.useSyncExternalStore=e.useSyncExternalStore!==void 0?e.useSyncExternalStore:s,po})()),vi.exports}yi.exports=(function(){if(mi)return go;mi=1;var e=_,t=fl(),n=typeof Object.is=="function"?Object.is:function(l,c){return l===c&&(l!==0||1/l==1/c)||l!=l&&c!=c},o=t.useSyncExternalStore,r=e.useRef,i=e.useEffect,a=e.useMemo,s=e.useDebugValue;return go.useSyncExternalStoreWithSelector=function(l,c,u,d,h){var y=r(null);if(y.current===null){var m={hasValue:!1,value:null};y.current=m}else m=y.current;y=a(function(){function x(C){if(!p){if(p=!0,b=C,C=d(C),h!==void 0&&m.hasValue){var M=m.value;if(h(M,C))return w=M}return w=C}if(M=w,n(b,C))return M;var I=d(C);return h!==void 0&&h(M,I)?(b=C,M):(b=C,w=I)}var b,w,p=!1,f=u===void 0?null:u;return[function(){return x(c())},f===null?void 0:function(){return x(f())}]},[c,u,d,h]);var g=o(l,y[0],y[1]);return i(function(){m.hasValue=!0,m.value=g},[g]),s(g),g},go})();var gl=hl(yi.exports);let xi=e=>{let t,n=new Set,o=(s,l)=>{let c=typeof s=="function"?s(t):s;if(!Object.is(c,t)){let u=t;t=l??(typeof c!="object"||c===null)?c:Object.assign({},t,c),n.forEach(d=>d(t,u))}},r=()=>t,i={setState:o,getState:r,getInitialState:()=>a,subscribe:s=>(n.add(s),()=>n.delete(s)),destroy:()=>{console.warn("[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."),n.clear()}},a=t=e(o,r,i);return i},{useDebugValue:pl}=_,{useSyncExternalStoreWithSelector:ml}=gl,yl=e=>e;function wi(e,t=yl,n){let o=ml(e.subscribe,e.getState,e.getServerState||e.getInitialState,t,n);return pl(o),o}let bi=(e,t)=>{let n=(r=>r?xi(r):xi)(e),o=(r,i=t)=>wi(n,r,i);return Object.assign(o,n),o},bn=_.createContext(null),vl=bn.Provider,Si=Ac("react");function oe(e,t){let n=_.useContext(bn);if(n===null)throw new Error(Si);return wi(n,e,t)}function le(){let e=_.useContext(bn);if(e===null)throw new Error(Si);return _.useMemo(()=>({getState:e.getState,setState:e.setState,subscribe:e.subscribe}),[e])}let Ci={display:"none"},xl={position:"absolute",width:1,height:1,margin:-1,border:0,padding:0,overflow:"hidden",clip:"rect(0px, 0px, 0px, 0px)",clipPath:"inset(100%)"},Ei="react-flow__node-desc",Mi="react-flow__edge-desc",wl=e=>e.ariaLiveMessage,bl=e=>e.ariaLabelConfig;function Sl({rfId:e}){let t=oe(wl);return P.jsx("div",{id:`react-flow__aria-live-${e}`,"aria-live":"assertive","aria-atomic":"true",style:xl,children:t})}function Cl({rfId:e,disableKeyboardA11y:t}){let n=oe(bl);return P.jsxs(P.Fragment,{children:[P.jsx("div",{id:`${Ei}-${e}`,style:Ci,children:t?n["node.a11yDescription.default"]:n["node.a11yDescription.keyboardDisabled"]}),P.jsx("div",{id:`${Mi}-${e}`,style:Ci,children:n["edge.a11yDescription.default"]}),!t&&P.jsx(Sl,{rfId:e})]})}let $t=_.forwardRef(({position:e="top-left",children:t,className:n,style:o,...r},i)=>{let a=`${e}`.split("-");return P.jsx("div",{className:me(["react-flow__panel",n,...a]),style:o,ref:i,...r,children:t})});$t.displayName="Panel";let Ni="https://reactflow.dev?utm_source=attribution";function El({proOptions:e,position:t="bottom-right"}){return e?.hideAttribution?null:P.jsx($t,{position:t,className:"react-flow__attribution","data-message":`Please only hide this attribution when you are subscribed to React Flow Pro: ${Ni}`,children:P.jsx("a",{href:Ni,target:"_blank",rel:"noopener noreferrer","aria-label":"React Flow attribution",children:"React Flow"})})}function de(e,t){if(Object.is(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;if(e instanceof Map&&t instanceof Map){if(e.size!==t.size)return!1;for(let[o,r]of e)if(!Object.is(r,t.get(o)))return!1;return!0}if(e instanceof Set&&t instanceof Set){if(e.size!==t.size)return!1;for(let o of e)if(!t.has(o))return!1;return!0}let n=Object.keys(e);if(n.length!==Object.keys(t).length)return!1;for(let o of n)if(!Object.prototype.hasOwnProperty.call(t,o)||!Object.is(e[o],t[o]))return!1;return!0}let Ml=e=>{let t=[],n=[];for(let[,o]of e.nodeLookup)o.selected&&t.push(o.internals.userNode);for(let[,o]of e.edgeLookup)o.selected&&n.push(o);return{selectedNodes:t,selectedEdges:n}},Sn=e=>e.id;function Nl(e,t){return de(e.selectedNodes.map(Sn),t.selectedNodes.map(Sn))&&de(e.selectedEdges.map(Sn),t.selectedEdges.map(Sn))}function kl({onSelectionChange:e}){let t=le(),{selectedNodes:n,selectedEdges:o}=oe(Ml,Nl);return _.useEffect(()=>{let r={nodes:n,edges:o};e?.(r),t.getState().onSelectionChangeHandlers.forEach(i=>i(r))},[n,o,e]),null}let _l=e=>!!e.onSelectionChangeHandlers;function Pl({onSelectionChange:e}){let t=oe(_l);return e||t?P.jsx(kl,{onSelectionChange:e}):null}let ki=[0,0],zl={x:0,y:0,zoom:1},_i=["nodes","edges","defaultNodes","defaultEdges","onConnect","onConnectStart","onConnectEnd","onClickConnectStart","onClickConnectEnd","nodesDraggable","autoPanOnNodeFocus","nodesConnectable","nodesFocusable","edgesFocusable","edgesReconnectable","elevateNodesOnSelect","elevateEdgesOnSelect","minZoom","maxZoom","nodeExtent","onNodesChange","onEdgesChange","elementsSelectable","connectionMode","snapGrid","snapToGrid","translateExtent","connectOnClick","defaultEdgeOptions","fitView","fitViewOptions","onNodesDelete","onEdgesDelete","onDelete","onNodeDrag","onNodeDragStart","onNodeDragStop","onSelectionDrag","onSelectionDragStart","onSelectionDragStop","onMoveStart","onMove","onMoveEnd","noPanClassName","nodeOrigin","autoPanOnConnect","autoPanOnNodeDrag","onError","connectionRadius","isValidConnection","selectNodesOnDrag","nodeDragThreshold","connectionDragThreshold","onBeforeDelete","debug","autoPanSpeed","ariaLabelConfig","zIndexMode","rfId"],Il=e=>({setNodes:e.setNodes,setEdges:e.setEdges,setMinZoom:e.setMinZoom,setMaxZoom:e.setMaxZoom,setTranslateExtent:e.setTranslateExtent,setNodeExtent:e.setNodeExtent,reset:e.reset,setDefaultNodesAndEdges:e.setDefaultNodesAndEdges}),Pi={translateExtent:Pt,nodeOrigin:ki,minZoom:.5,maxZoom:2,elementsSelectable:!0,noPanClassName:"nopan",rfId:"1"};function Ol(e){let{setNodes:t,setEdges:n,setMinZoom:o,setMaxZoom:r,setTranslateExtent:i,setNodeExtent:a,reset:s,setDefaultNodesAndEdges:l}=oe(Il,de),c=le();_.useEffect(()=>(l(e.defaultNodes,e.defaultEdges),()=>{u.current=Pi,s()}),[]);let u=_.useRef(Pi);return _.useEffect(()=>{for(let d of _i){let h=e[d];h!==u.current[d]&&e[d]!==void 0&&(d==="nodes"?t(h):d==="edges"?n(h):d==="minZoom"?o(h):d==="maxZoom"?r(h):d==="translateExtent"?i(h):d==="nodeExtent"?a(h):d==="ariaLabelConfig"?c.setState({ariaLabelConfig:Fc(h)}):d==="fitView"?c.setState({fitViewQueued:h}):d==="fitViewOptions"?c.setState({fitViewOptions:h}):c.setState({[d]:h}))}u.current=e},_i.map(d=>e[d])),null}function zi(){return typeof window<"u"&&window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)"):null}let Ii=typeof document<"u"?document:null;function ft(e=null,t={target:Ii,actInsideInputWithModifier:!0}){let[n,o]=_.useState(!1),r=_.useRef(!1),i=_.useRef(new Set([])),[a,s]=_.useMemo(()=>{if(e!==null){let l=(Array.isArray(e)?e:[e]).filter(u=>typeof u=="string").map(u=>u.replace(/\+/g,`
`).replace(`

`,`
+`).split(`
`)),c=l.reduce((u,d)=>u.concat(...d),[]);return[l,c]}return[[],[]]},[e]);return _.useEffect(()=>{let l=t?.target??Ii,c=t?.actInsideInputWithModifier??!0;if(e!==null){let u=y=>{if(r.current=y.ctrlKey||y.metaKey||y.shiftKey||y.altKey,(!r.current||r.current&&!c)&&Zr(y))return!1;let m=Ai(y.code,s);if(i.current.add(y[m]),Oi(a,i.current,!1)){let g=y.composedPath?.()?.[0]||y.target,x=g?.nodeName==="BUTTON"||g?.nodeName==="A";t.preventDefault===!1||!r.current&&x||y.preventDefault(),o(!0)}},d=y=>{let m=Ai(y.code,s);Oi(a,i.current,!0)?(o(!1),i.current.clear()):i.current.delete(y[m]),y.key==="Meta"&&i.current.clear(),r.current=!1},h=()=>{i.current.clear(),o(!1)};return l?.addEventListener("keydown",u),l?.addEventListener("keyup",d),window.addEventListener("blur",h),window.addEventListener("contextmenu",h),()=>{l?.removeEventListener("keydown",u),l?.removeEventListener("keyup",d),window.removeEventListener("blur",h),window.removeEventListener("contextmenu",h)}}},[e,o]),n}function Oi(e,t,n){return e.filter(o=>n||o.length===t.size).some(o=>o.every(r=>t.has(r)))}function Ai(e,t){return t.includes(e)?"code":"key"}function Di(e,t){let n=[],o=new Map,r=[];for(let i of e)if(i.type!=="add")if(i.type==="remove"||i.type==="replace")o.set(i.id,[i]);else{let a=o.get(i.id);a?a.push(i):o.set(i.id,[i])}else r.push(i);for(let i of t){let a=o.get(i.id);if(!a){n.push(i);continue}if(a[0].type==="remove")continue;if(a[0].type==="replace"){n.push({...a[0].item});continue}let s={...i};for(let l of a)Al(l,s);n.push(s)}return r.length&&r.forEach(i=>{i.index!==void 0?n.splice(i.index,0,{...i.item}):n.push({...i.item})}),n}function Al(e,t){switch(e.type){case"select":t.selected=e.selected;break;case"position":e.position!==void 0&&(t.position=e.position),e.dragging!==void 0&&(t.dragging=e.dragging);break;case"dimensions":e.dimensions!==void 0&&(t.measured={...e.dimensions},e.setAttributes&&(e.setAttributes!==!0&&e.setAttributes!=="width"||(t.width=e.dimensions.width),e.setAttributes!==!0&&e.setAttributes!=="height"||(t.height=e.dimensions.height))),typeof e.resizing=="boolean"&&(t.resizing=e.resizing)}}function mo(e,t){return Di(e,t)}function yo(e,t){return Di(e,t)}function rt(e,t){return{id:e,type:"select",selected:t}}function gt(e,t=new Set,n=!1){let o=[];for(let[r,i]of e){let a=t.has(r);i.selected===void 0&&!a||i.selected===a||(n&&(i.selected=a),o.push(rt(i.id,a)))}return o}function Ri({items:e=[],lookup:t}){let n=[],o=new Map(e.map(r=>[r.id,r]));for(let[r,i]of e.entries()){let a=t.get(i.id),s=a?.internals?.userNode??a;s!==void 0&&s!==i&&n.push({id:i.id,item:i,type:"replace"}),s===void 0&&n.push({item:i,type:"add",index:r})}for(let[r]of t)o.get(r)===void 0&&n.push({id:r,type:"remove"});return n}function Li(e){return{id:e.id,type:"remove"}}let $i=(e,t)=>{};function Ti(e,t,n={}){return((o,r,i={})=>{if(!o.source||!o.target)return i.onError?.("006",br()),r;let a=i.getEdgeId||Wr,s;return s=Ir(o)?{...o}:{...o,id:a(o)},((l,c)=>c.some(u=>!(u.source!==l.source||u.target!==l.target||u.sourceHandle!==l.sourceHandle&&(u.sourceHandle||l.sourceHandle)||u.targetHandle!==l.targetHandle&&(u.targetHandle||l.targetHandle))))(s,r)?r:(s.sourceHandle===null&&delete s.sourceHandle,s.targetHandle===null&&delete s.targetHandle,r.concat(s))})(e,t,{...n,onError:n.onError??$i})}let vo=e=>(t=>!!t&&typeof t=="object"&&"id"in t&&"position"in t&&!("source"in t)&&!("target"in t))(e),Bi=e=>Ir(e);function Vi(e){return _.forwardRef(e)}let ji=typeof window<"u"?_.useLayoutEffect:_.useEffect;function Hi(e){let[t,n]=_.useState(BigInt(0)),[o]=_.useState(()=>(function(r){let i=[];return{get:()=>i,reset:()=>{i=[]},push:a=>{i.push(a),r()}}})(()=>n(r=>r+BigInt(1))));return ji(()=>{let r=o.get();r.length&&(e(r),o.reset())},[t]),o}let Zi=_.createContext(null);function Dl({children:e}){let t=le(),n=Hi(_.useCallback(i=>{let{nodes:a=[],setNodes:s,hasDefaultNodes:l,onNodesChange:c,nodeLookup:u,fitViewQueued:d,onNodesChangeMiddlewareMap:h}=t.getState(),y=a;for(let g of i)y=typeof g=="function"?g(y):g;let m=Ri({items:y,lookup:u});for(let g of h.values())m=g(m);l&&s(y),m.length>0?c?.(m):d&&window.requestAnimationFrame(()=>{let{fitViewQueued:g,nodes:x,setNodes:b}=t.getState();g&&b(x)})},[])),o=Hi(_.useCallback(i=>{let{edges:a=[],setEdges:s,hasDefaultEdges:l,onEdgesChange:c,edgeLookup:u}=t.getState(),d=a;for(let h of i)d=typeof h=="function"?h(d):h;l?s(d):c&&c(Ri({items:d,lookup:u}))},[])),r=_.useMemo(()=>({nodeQueue:n,edgeQueue:o}),[]);return P.jsx(Zi.Provider,{value:r,children:e})}let Rl=e=>!!e.panZoom;function Cn(){let e=(()=>{let i=le();return _.useMemo(()=>({zoomIn:async a=>{let{panZoom:s}=i.getState();return!!s&&s.scaleBy(1.2,a)},zoomOut:async a=>{let{panZoom:s}=i.getState();return!!s&&s.scaleBy(.8333333333333334,a)},zoomTo:async(a,s)=>{let{panZoom:l}=i.getState();return!!l&&l.scaleTo(a,s)},getZoom:()=>i.getState().transform[2],setViewport:async(a,s)=>{let{transform:[l,c,u],panZoom:d}=i.getState();return!!d&&(await d.setViewport({x:a.x??l,y:a.y??c,zoom:a.zoom??u},s),!0)},getViewport:()=>{let[a,s,l]=i.getState().transform;return{x:a,y:s,zoom:l}},setCenter:async(a,s,l)=>i.getState().setCenter(a,s,l),fitBounds:async(a,s)=>{let{width:l,height:c,minZoom:u,maxZoom:d,panZoom:h}=i.getState(),y=mn(a,l,c,u,d,s?.padding??.1);return!!h&&(await h.setViewport(y,{duration:s?.duration,ease:s?.ease,interpolate:s?.interpolate}),!0)},screenToFlowPosition:(a,s={})=>{let{transform:l,snapGrid:c,snapToGrid:u,domNode:d}=i.getState();if(!d)return a;let{x:h,y}=d.getBoundingClientRect(),m={x:a.x-h,y:a.y-y},g=s.snapGrid??c,x=s.snapToGrid??u;return Dt(m,l,x,g)},flowToScreenPosition:a=>{let{transform:s,domNode:l}=i.getState();if(!l)return a;let{x:c,y:u}=l.getBoundingClientRect(),d=dt(a,s);return{x:d.x+c,y:d.y+u}}}),[])})(),t=le(),n=(function(){let i=_.useContext(Zi);if(!i)throw new Error("useBatchContext must be used within a BatchProvider");return i})(),o=oe(Rl),r=_.useMemo(()=>{let i=d=>t.getState().nodeLookup.get(d),a=d=>{n.nodeQueue.push(d)},s=d=>{n.edgeQueue.push(d)},l=d=>{let{nodeLookup:h,nodeOrigin:y}=t.getState(),m=vo(d)?d:h.get(d.id),g=m.parentId?Vr(m.position,m.measured,m.parentId,h,y):m.position,x={...m,position:g,width:m.measured?.width??m.width,height:m.measured?.height??m.height};return Ot(x)},c=(d,h,y={replace:!1})=>{a(m=>m.map(g=>{if(g.id===d){let x=typeof h=="function"?h(g):h;return y.replace&&vo(x)?x:{...g,...x}}return g}))},u=(d,h,y={replace:!1})=>{s(m=>m.map(g=>{if(g.id===d){let x=typeof h=="function"?h(g):h;return y.replace&&Bi(x)?x:{...g,...x}}return g}))};return{getNodes:()=>t.getState().nodes.map(d=>({...d})),getNode:d=>i(d)?.internals.userNode,getInternalNode:i,getEdges:()=>{let{edges:d=[]}=t.getState();return d.map(h=>({...h}))},getEdge:d=>t.getState().edgeLookup.get(d),setNodes:a,setEdges:s,addNodes:d=>{let h=Array.isArray(d)?d:[d];n.nodeQueue.push(y=>[...y,...h])},addEdges:d=>{let h=Array.isArray(d)?d:[d];n.edgeQueue.push(y=>[...y,...h])},toObject:()=>{let{nodes:d=[],edges:h=[],transform:y}=t.getState(),[m,g,x]=y;return{nodes:d.map(b=>({...b})),edges:h.map(b=>({...b})),viewport:{x:m,y:g,zoom:x}}},deleteElements:async({nodes:d=[],edges:h=[]})=>{let{nodes:y,edges:m,onNodesDelete:g,onEdgesDelete:x,triggerNodeChanges:b,triggerEdgeChanges:w,onDelete:p,onBeforeDelete:f}=t.getState(),{nodes:C,edges:M}=await(async function({nodesToRemove:R=[],edgesToRemove:L=[],nodes:V,edges:v,onBeforeDelete:k}){let S=new Set(R.map(A=>A.id)),N=[];for(let A of V){if(A.deletable===!1)continue;let Z=S.has(A.id),B=!Z&&A.parentId&&N.find(K=>K.id===A.parentId);(Z||B)&&N.push(A)}let z=new Set(L.map(A=>A.id)),D=v.filter(A=>A.deletable!==!1),$=Ar(N,D);for(let A of D)z.has(A.id)&&!$.find(Z=>Z.id===A.id)&&$.push(A);if(!k)return{edges:$,nodes:N};let j=await k({nodes:N,edges:$});return typeof j=="boolean"?j?{edges:$,nodes:N}:{edges:[],nodes:[]}:j})({nodesToRemove:d,edgesToRemove:h,nodes:y,edges:m,onBeforeDelete:f}),I=M.length>0,O=C.length>0;if(I){let R=M.map(Li);x?.(M),w(R)}if(O){let R=C.map(Li);g?.(C),b(R)}return(O||I)&&p?.({nodes:C,edges:M}),{deletedNodes:C,deletedEdges:M}},getIntersectingNodes:(d,h=!0,y)=>{let m=Br(d),g=m?d:l(d),x=y!==void 0;return g?(y||t.getState().nodes).filter(b=>{let w=t.getState().nodeLookup.get(b.id);if(w&&!m&&(b.id===d.id||!w.internals.positionAbsolute))return!1;let p=Ot(x?b:w),f=pn(p,g);return h&&f>0||f>=p.width*p.height||f>=g.width*g.height}):[]},isNodeIntersecting:(d,h,y=!0)=>{let m=Br(d)?d:l(d);if(!m)return!1;let g=pn(m,h);return y&&g>0||g>=h.width*h.height||g>=m.width*m.height},updateNode:c,updateNodeData:(d,h,y={replace:!1})=>{c(d,m=>{let g=typeof h=="function"?h(m):h;return y.replace?{...m,data:g}:{...m,data:{...m.data,...g}}},y)},updateEdge:u,updateEdgeData:(d,h,y={replace:!1})=>{u(d,m=>{let g=typeof h=="function"?h(m):h;return y.replace?{...m,data:g}:{...m,data:{...m.data,...g}}},y)},getNodesBounds:d=>{let{nodeLookup:h,nodeOrigin:y}=t.getState();return Or(d,{nodeLookup:h,nodeOrigin:y})},getHandleConnections:({type:d,id:h,nodeId:y})=>Array.from(t.getState().connectionLookup.get(`${y}-${d}${h?`-${h}`:""}`)?.values()??[]),getNodeConnections:({type:d,handleId:h,nodeId:y})=>Array.from(t.getState().connectionLookup.get(`${y}${d?h?`-${d}-${h}`:`-${d}`:""}`)?.values()??[]),fitView:async d=>{let h=t.getState().fitViewResolver??(function(){let y,m;return{promise:new Promise((g,x)=>{y=g,m=x}),resolve:y,reject:m}})();return t.setState({fitViewQueued:!0,fitViewOptions:d,fitViewResolver:h}),n.nodeQueue.push(y=>[...y]),h.promise}}},[]);return _.useMemo(()=>({...r,...e,viewportInitialized:o}),[o])}let Xi=e=>e.selected,Ll=typeof window<"u"?window:void 0,En={position:"absolute",width:"100%",height:"100%",top:0,left:0},$l=e=>({userSelectionActive:e.userSelectionActive,lib:e.lib,connectionInProgress:e.connection.inProgress});function Tl({onPaneContextMenu:e,zoomOnScroll:t=!0,zoomOnPinch:n=!0,panOnScroll:o=!1,panActivationKeyPressed:r,panOnScrollSpeed:i=.5,panOnScrollMode:a=E.PanOnScrollMode.Free,zoomOnDoubleClick:s=!0,panOnDrag:l=!0,defaultViewport:c,translateExtent:u,minZoom:d,maxZoom:h,zoomActivationKeyCode:y,preventScrolling:m=!0,children:g,noWheelClassName:x,noPanClassName:b,onViewportChange:w,isControlledViewport:p,paneClickDistance:f,selectionOnDrag:C}){let M=le(),I=_.useRef(null),{userSelectionActive:O,lib:R,connectionInProgress:L}=oe($l,de),V=ft(y),v=_.useRef();(function(S){let N=le();_.useEffect(()=>{let z=()=>{if(!S.current||!(S.current.checkVisibility?.()??1))return!1;let D=Un(S.current);D.height!==0&&D.width!==0||N.getState().onError?.("004",Rc()),N.setState({width:D.width||500,height:D.height||500})};if(S.current){z(),window.addEventListener("resize",z);let D=new ResizeObserver(()=>z());return D.observe(S.current),()=>{window.removeEventListener("resize",z),D&&S.current&&D.unobserve(S.current)}}},[])})(I);let k=_.useCallback(S=>{w?.({x:S[0],y:S[1],zoom:S[2]}),p||M.setState({transform:S})},[w,p]);return _.useEffect(()=>{if(I.current){v.current=al({domNode:I.current,minZoom:d,maxZoom:h,translateExtent:u,viewport:c,onDraggingChange:D=>M.setState($=>$.paneDragging===D?$:{paneDragging:D}),onPanZoomStart:(D,$)=>{let{onViewportChangeStart:j,onMoveStart:A}=M.getState();A?.(D,$),j?.($)},onPanZoom:(D,$)=>{let{onViewportChange:j,onMove:A}=M.getState();A?.(D,$),j?.($)},onPanZoomEnd:(D,$)=>{let{onViewportChangeEnd:j,onMoveEnd:A}=M.getState();A?.(D,$),j?.($)}});let{x:S,y:N,zoom:z}=v.current.getViewport();return M.setState({panZoom:v.current,transform:[S,N,z],domNode:I.current.closest(".react-flow")}),()=>{v.current?.destroy()}}},[]),_.useEffect(()=>{v.current?.update({onPaneContextMenu:e,zoomOnScroll:t,zoomOnPinch:n,panOnScroll:o,panActivationKeyPressed:r,panOnScrollSpeed:i,panOnScrollMode:a,zoomOnDoubleClick:s,panOnDrag:l,zoomActivationKeyPressed:V,preventScrolling:m,noPanClassName:b,userSelectionActive:O,noWheelClassName:x,lib:R,onTransformChange:k,connectionInProgress:L,selectionOnDrag:C,paneClickDistance:f})},[e,t,n,o,r,i,a,s,l,V,m,b,O,x,R,k,L,C,f]),P.jsx("div",{className:"react-flow__renderer",ref:I,style:En,children:g})}let Bl=e=>({userSelectionActive:e.userSelectionActive,userSelectionRect:e.userSelectionRect});function Vl(){let{userSelectionActive:e,userSelectionRect:t}=oe(Bl,de);return e&&t?P.jsx("div",{className:"react-flow__selection react-flow__container",style:{width:t.width,height:t.height,transform:`translate(${t.x}px, ${t.y}px)`}}):null}let xo=(e,t)=>n=>{n.target===t.current&&e?.(n)},jl=e=>({userSelectionActive:e.userSelectionActive,elementsSelectable:e.elementsSelectable,dragging:e.paneDragging,panBy:e.panBy,autoPanSpeed:e.autoPanSpeed});function Hl({isSelecting:e,selectionKeyPressed:t,selectionMode:n=E.SelectionMode.Full,panOnDrag:o,autoPanOnSelection:r,paneClickDistance:i,selectionOnDrag:a,onSelectionStart:s,onSelectionEnd:l,onPaneClick:c,onPaneContextMenu:u,onPaneScroll:d,onPaneMouseEnter:h,onPaneMouseMove:y,onPaneMouseLeave:m,children:g}){let x=_.useRef(0),b=le(),{userSelectionActive:w,elementsSelectable:p,dragging:f,panBy:C,autoPanSpeed:M}=oe(jl,de),I=p&&(e||w),O=_.useRef(null),R=_.useRef(),L=_.useRef(new Set),V=_.useRef(new Set),v=_.useRef(!1),k=_.useRef(!1),S=_.useRef({x:0,y:0}),N=_.useRef(!1),z=B=>{if(k.current||v.current||b.getState().connection.inProgress)return k.current=!1,void(v.current=!1);c?.(B),b.getState().resetSelectedElements(),b.setState({nodesSelectionActive:!1})},D=d?B=>d(B):void 0;function $(B,K){let{userSelectionRect:J}=b.getState();if(!J)return;let{transform:T,nodeLookup:H,edgeLookup:U,connectionLookup:Y,triggerNodeChanges:X,triggerEdgeChanges:F,defaultEdgeOptions:Q}=b.getState(),G={x:J.startX,y:J.startY},{x:W,y:ee}=dt(G,T),ne={startX:G.x,startY:G.y,x:B<W?B:W,y:K<ee?K:ee,width:Math.abs(B-W),height:Math.abs(K-ee)},ie=L.current,ce=V.current;L.current=new Set(Wn(H,ne,T,n===E.SelectionMode.Partial,!0).map(te=>te.id)),V.current=new Set;let se=Q?.selectable??!0;for(let te of L.current){let ae=Y.get(te);if(ae)for(let{edgeId:q}of ae.values()){let re=U.get(q);re&&(re.selectable??se)&&V.current.add(q)}}jr(ie,L.current)||X(gt(H,L.current,!0)),jr(ce,V.current)||F(gt(U,V.current)),b.setState({userSelectionRect:ne,userSelectionActive:!0,nodesSelectionActive:!1})}function j(){if(!r||!R.current)return;let[B,K]=Kn(S.current,R.current,M);C({x:B,y:K}).then(J=>{if(!k.current||!J)return void(x.current=requestAnimationFrame(j));let{x:T,y:H}=S.current;$(T,H),x.current=requestAnimationFrame(j)})}let A=()=>{cancelAnimationFrame(x.current),x.current=0,N.current=!1};_.useEffect(()=>()=>A(),[]);let Z=o===!0||Array.isArray(o)&&o.includes(0);return P.jsxs("div",{className:me(["react-flow__pane",{draggable:Z,dragging:f,selection:e}]),onClick:I?void 0:xo(z,O),onContextMenu:xo(B=>{Array.isArray(o)&&o?.includes(2)?B.preventDefault():u?.(B)},O),onWheel:xo(D,O),onPointerEnter:I?void 0:h,onPointerMove:I?B=>{let{userSelectionRect:K,transform:J,resetSelectedElements:T}=b.getState();if(!R.current||!K)return;let{x:H,y:U}=Te(B.nativeEvent,R.current);S.current={x:H,y:U};let Y=dt({x:K.startX,y:K.startY},J);if(!k.current){let X=t?0:i;if(Math.hypot(H-Y.x,U-Y.y)<=X)return;T(),s?.(B)}k.current=!0,N.current||(j(),N.current=!0),$(H,U)}:y,onPointerUp:B=>{I?B.button===0&&(B.target?.releasePointerCapture?.(B.pointerId),!w&&B.target===O.current&&b.getState().userSelectionRect&&z?.(B),b.setState({userSelectionActive:!1,userSelectionRect:null}),k.current&&(l?.(B),b.setState({nodesSelectionActive:L.current.size>0})),A()):B.target===O.current&&b.getState().connection.inProgress&&(v.current=!0)},onPointerCancel:I?B=>{B.target?.releasePointerCapture?.(B.pointerId),A()}:void 0,onPointerDownCapture:I?B=>{if(B.pointerType==="touch"&&o!==!1&&!t)return;let{domNode:K,transform:J}=b.getState();if(R.current=K?.getBoundingClientRect(),!R.current)return;let T=B.target===O.current;if(!T&&B.target.closest(".nokey")||!e||!(a&&T||t)||B.button!==0||!B.isPrimary)return;B.target?.setPointerCapture?.(B.pointerId),k.current=!1;let{x:H,y:U}=Te(B.nativeEvent,R.current),Y=Dt({x:H,y:U},J);b.setState({userSelectionRect:{width:0,height:0,startX:Y.x,startY:Y.y,x:H,y:U}}),T||(B.stopPropagation(),B.preventDefault())}:void 0,onClickCapture:I?B=>{k.current&&(B.stopPropagation(),k.current=!1)}:void 0,onPointerLeave:m,ref:O,style:En,children:[g,P.jsx(Vl,{})]})}function wo({id:e,store:t,unselect:n=!1,nodeRef:o}){let{addSelectedNodes:r,unselectNodesAndEdges:i,multiSelectionActive:a,nodeLookup:s,onError:l}=t.getState(),c=s.get(e);c?(t.setState({nodesSelectionActive:!1}),c.selected?(n||c.selected&&a)&&(i({nodes:[c],edges:[]}),requestAnimationFrame(()=>o?.current?.blur())):r([e])):l?.("012",Hc(e))}function Yi({nodeRef:e,disabled:t=!1,noDragClassName:n,handleSelector:o,nodeId:r,isSelectable:i,nodeClickDistance:a}){let s=le(),[l,c]=_.useState(!1),u=_.useRef();return _.useEffect(()=>{if(!t)return u.current=ol({getStoreItems:()=>s.getState(),onNodeMouseDown:d=>{wo({id:d,store:s,nodeRef:e})},onDragStart:()=>{c(!0)},onDragStop:()=>{c(!1)}}),()=>{u.current?.destroy(),u.current=void 0}},[t,s,e]),_.useEffect(()=>{!t&&e.current&&u.current&&u.current.update({noDragClassName:n,handleSelector:o,domNode:e.current,isSelectable:i,nodeId:r,nodeClickDistance:a})},[n,o,t,i,e,r,a]),l}function Fi(){let e=le();return _.useCallback(t=>{let{nodeExtent:n,snapToGrid:o,snapGrid:r,nodesDraggable:i,onError:a,updateNodePositions:s,nodeLookup:l,nodeOrigin:c}=e.getState(),u=new Map,d=(x=>b=>b.selected&&(b.draggable||x&&b.draggable===void 0))(i),h=o?r[0]:5,y=o?r[1]:5,m=t.direction.x*h*t.factor,g=t.direction.y*y*t.factor;for(let[,x]of l){if(!d(x))continue;let b={x:x.internals.positionAbsolute.x+m,y:x.internals.positionAbsolute.y+g};o&&(b=At(b,r));let{position:w,positionAbsolute:p}=Dr({nodeId:x.id,nextPosition:b,nodeLookup:l,nodeExtent:n,nodeOrigin:c,onError:a});x.position=w,x.internals.positionAbsolute=p,u.set(x.id,x)}s(u)},[])}let bo=_.createContext(null),Zl=bo.Provider;bo.Consumer;let pt=()=>_.useContext(bo),Xl=e=>({connectOnClick:e.connectOnClick,noPanClassName:e.noPanClassName,rfId:e.rfId}),Wi=_.createContext(null);function Yl({children:e}){let t=oe(Xl,de);return P.jsx(Wi.Provider,{value:t,children:e})}let Fl={connectingFrom:!1,connectingTo:!1,clickConnecting:!1,isPossibleEndHandle:!0,connectionInProcess:!1,clickConnectionInProcess:!1,valid:!1},Tt=_.memo(Vi(function({type:e="source",position:t=E.Position.Top,isValidConnection:n,isConnectable:o=!0,isConnectableStart:r=!0,isConnectableEnd:i=!0,id:a,onConnect:s,children:l,className:c,onMouseDown:u,onTouchStart:d,...h},y){let m=a||null,g=e==="target",x=le(),b=pt(),{connectOnClick:w,noPanClassName:p,rfId:f}=(function(){let S=_.useContext(Wi);if(!S)throw new Error("useHandleConfig must be used within a HandleConfigProvider");return S})(),{connectingFrom:C,connectingTo:M,clickConnecting:I,isPossibleEndHandle:O,connectionInProcess:R,clickConnectionInProcess:L,valid:V}=oe(((S,N,z)=>D=>{let{connectionClickStartHandle:$,connectionMode:j,connection:A}=D,{fromHandle:Z,toHandle:B,isValid:K}=A;if(!Z&&!$)return Fl;let J=B?.nodeId===S&&B?.id===N&&B?.type===z;return{connectingFrom:Z?.nodeId===S&&Z?.id===N&&Z?.type===z,connectingTo:J,clickConnecting:$?.nodeId===S&&$?.id===N&&$?.type===z,isPossibleEndHandle:j===E.ConnectionMode.Strict?Z?.type!==z:S!==Z?.nodeId||N!==Z?.id,connectionInProcess:!!Z,clickConnectionInProcess:!!$,valid:J&&K}})(b,m,e),de);b||x.getState().onError?.("010",Vc());let v=S=>{let{defaultEdgeOptions:N,onConnect:z,hasDefaultEdges:D}=x.getState(),$={...N,...S};if(D){let{edges:j,setEdges:A,onError:Z}=x.getState();A(Ti($,j,{onError:Z}))}z?.($),s?.($)},k=S=>{if(!b)return;let N=Xr(S.nativeEvent);if(r&&(N&&S.button===0||!N)){let z=x.getState();uo.onPointerDown(S.nativeEvent,{handleDomNode:S.currentTarget,autoPanOnConnect:z.autoPanOnConnect,connectionMode:z.connectionMode,connectionRadius:z.connectionRadius,domNode:z.domNode,nodeLookup:z.nodeLookup,lib:z.lib,isTarget:g,handleId:m,nodeId:b,flowId:z.rfId,panBy:z.panBy,cancelConnection:z.cancelConnection,onConnectStart:z.onConnectStart,onConnectEnd:(...D)=>x.getState().onConnectEnd?.(...D),updateConnection:z.updateConnection,onConnect:v,isValidConnection:n||((...D)=>x.getState().isValidConnection?.(...D)??!0),getTransform:()=>x.getState().transform,getFromHandle:()=>x.getState().connection.fromHandle,autoPanSpeed:z.autoPanSpeed,dragThreshold:z.connectionDragThreshold})}N?u?.(S):d?.(S)};return P.jsx("div",{"data-handleid":m,"data-nodeid":b,"data-handlepos":t,"data-id":`${f}-${b}-${m}-${e}`,className:me(["react-flow__handle",`react-flow__handle-${t}`,"nodrag",p,c,{source:!g,target:g,connectable:o,connectablestart:r,connectableend:i,clickconnecting:I,connectingfrom:C,connectingto:M,valid:V,connectionindicator:o&&(!R||O)&&(R||L?i:r)}]),onMouseDown:k,onTouchStart:k,onClick:w?S=>{let{onClickConnectStart:N,onClickConnectEnd:z,connectionClickStartHandle:D,connectionMode:$,isValidConnection:j,lib:A,rfId:Z,nodeLookup:B,connection:K}=x.getState();if(!b||!D&&!r)return;if(!D)return N?.(S.nativeEvent,{nodeId:b,handleId:m,handleType:e}),void x.setState({connectionClickStartHandle:{nodeId:b,type:e,id:m}});let J=Hr(S.target),T=n||j,{connection:H,isValid:U}=uo.isValid(S.nativeEvent,{handle:{nodeId:b,id:m,type:e},connectionMode:$,fromNodeId:D.nodeId,fromHandleId:D.id||null,fromType:D.type,isValidConnection:T,flowId:Z,doc:J,lib:A,nodeLookup:B});U&&H&&v(H);let Y=structuredClone(K);delete Y.inProgress,Y.toPosition=Y.toHandle?Y.toHandle.position:null,z?.(S,Y),x.setState({connectionClickStartHandle:null})}:void 0,ref:y,...h,children:l})})),Mn={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}},Ki={input:function({data:e,isConnectable:t,sourcePosition:n=E.Position.Bottom}){return P.jsxs(P.Fragment,{children:[e?.label,P.jsx(Tt,{type:"source",position:n,isConnectable:t})]})},default:function({data:e,isConnectable:t,targetPosition:n=E.Position.Top,sourcePosition:o=E.Position.Bottom}){return P.jsxs(P.Fragment,{children:[P.jsx(Tt,{type:"target",position:n,isConnectable:t}),e?.label,P.jsx(Tt,{type:"source",position:o,isConnectable:t})]})},output:function({data:e,isConnectable:t,targetPosition:n=E.Position.Top}){return P.jsxs(P.Fragment,{children:[P.jsx(Tt,{type:"target",position:n,isConnectable:t}),e?.label]})},group:function(){return null}},Wl=e=>{let{width:t,height:n,x:o,y:r}=lt(e.nodeLookup,{filter:i=>!!i.selected});return{width:Le(t)?t:null,height:Le(n)?n:null,userSelectionActive:e.userSelectionActive,transformString:`translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]}) translate(${o}px,${r}px)`}};function Kl({onSelectionContextMenu:e,noPanClassName:t,disableKeyboardA11y:n}){let o=le(),{width:r,height:i,transformString:a,userSelectionActive:s}=oe(Wl,de),l=Fi(),c=_.useRef(null);_.useEffect(()=>{n||c.current?.focus({preventScroll:!0})},[n]);let u=!s&&r!==null&&i!==null;if(Yi({nodeRef:c,disabled:!u}),!u)return null;let d=e?h=>{let y=o.getState().nodes.filter(m=>m.selected);e(h,y)}:void 0;return P.jsx("div",{className:me(["react-flow__nodesselection","react-flow__container",t]),style:{transform:a},children:P.jsx("div",{ref:c,className:"react-flow__nodesselection-rect",onContextMenu:d,tabIndex:n?void 0:-1,onKeyDown:n?void 0:h=>{Object.prototype.hasOwnProperty.call(Mn,h.key)&&(h.preventDefault(),l({direction:Mn[h.key],factor:h.shiftKey?4:1}))},style:{width:r,height:i}})})}let qi=typeof window<"u"?window:void 0,ql=e=>({nodesSelectionActive:e.nodesSelectionActive,userSelectionActive:e.userSelectionActive});function Gi({children:e,onPaneClick:t,onPaneMouseEnter:n,onPaneMouseMove:o,onPaneMouseLeave:r,onPaneContextMenu:i,onPaneScroll:a,paneClickDistance:s,deleteKeyCode:l,selectionKeyCode:c,selectionOnDrag:u,selectionMode:d,onSelectionStart:h,onSelectionEnd:y,multiSelectionKeyCode:m,panActivationKeyCode:g,zoomActivationKeyCode:x,elementsSelectable:b,zoomOnScroll:w,zoomOnPinch:p,panOnScroll:f,panOnScrollSpeed:C,panOnScrollMode:M,zoomOnDoubleClick:I,panOnDrag:O,autoPanOnSelection:R,defaultViewport:L,translateExtent:V,minZoom:v,maxZoom:k,preventScrolling:S,onSelectionContextMenu:N,noWheelClassName:z,noPanClassName:D,disableKeyboardA11y:$,onViewportChange:j,isControlledViewport:A}){let{nodesSelectionActive:Z,userSelectionActive:B}=oe(ql,de),K=ft(c,{target:qi}),J=ft(g,{target:qi}),T=J||O,H=J||f,U=u&&T!==!0,Y=K||B||U;return(function({deleteKeyCode:X,multiSelectionKeyCode:F}){let Q=le(),{deleteElements:G}=Cn(),W=ft(X,{actInsideInputWithModifier:!1}),ee=ft(F,{target:Ll});_.useEffect(()=>{if(W){let{edges:ne,nodes:ie}=Q.getState();G({nodes:ie.filter(Xi),edges:ne.filter(Xi)}),Q.setState({nodesSelectionActive:!1})}},[W]),_.useEffect(()=>{Q.setState({multiSelectionActive:ee})},[ee])})({deleteKeyCode:l,multiSelectionKeyCode:m}),P.jsx(Tl,{onPaneContextMenu:i,elementsSelectable:b,zoomOnScroll:w,zoomOnPinch:p,panOnScroll:H,panActivationKeyPressed:J,panOnScrollSpeed:C,panOnScrollMode:M,zoomOnDoubleClick:I,panOnDrag:!K&&T,defaultViewport:L,translateExtent:V,minZoom:v,maxZoom:k,zoomActivationKeyCode:x,preventScrolling:S,noWheelClassName:z,noPanClassName:D,onViewportChange:j,isControlledViewport:A,paneClickDistance:s,selectionOnDrag:U,children:P.jsxs(Hl,{onSelectionStart:h,onSelectionEnd:y,onPaneClick:t,onPaneMouseEnter:n,onPaneMouseMove:o,onPaneMouseLeave:r,onPaneContextMenu:i,onPaneScroll:a,panOnDrag:T,autoPanOnSelection:R,isSelecting:!!Y,selectionMode:d,selectionKeyPressed:K,paneClickDistance:s,selectionOnDrag:U,children:[e,Z&&P.jsx(Kl,{onSelectionContextMenu:N,noPanClassName:D,disableKeyboardA11y:$})]})})}Gi.displayName="FlowRenderer";let Gl=_.memo(Gi);function Ul(e){return oe(_.useCallback((t=>n=>t?Wn(n.nodeLookup,{x:0,y:0,width:n.width,height:n.height},n.transform,!0).map(o=>o.id):Array.from(n.nodeLookup.keys()))(e),[e]),de)}let Ql=e=>e.updateNodeInternals;var Jl=_.memo(function({id:e,onClick:t,onMouseEnter:n,onMouseMove:o,onMouseLeave:r,onContextMenu:i,onDoubleClick:a,nodesDraggable:s,elementsSelectable:l,nodesConnectable:c,nodesFocusable:u,resizeObserver:d,noDragClassName:h,noPanClassName:y,disableKeyboardA11y:m,rfId:g,nodeTypes:x,nodeClickDistance:b,onError:w}){let{node:p,internals:f,isParent:C}=oe(T=>{let H=T.nodeLookup.get(e),U=T.parentLookup.has(e);return{node:H,internals:H.internals,isParent:U}},de),M=p.type||"default",I=x?.[M]||Ki[M];I===void 0&&(w?.("003",Dc(M)),M="default",I=x?.default||Ki.default);let O=!!(p.draggable||s&&p.draggable===void 0),R=!!(p.selectable||l&&p.selectable===void 0),L=!!(p.connectable||c&&p.connectable===void 0),V=!!(p.focusable||u&&p.focusable===void 0),v=le(),k=Gn(p),S=(function({node:T,nodeType:H,hasDimensions:U,resizeObserver:Y}){let X=le(),F=_.useRef(null),Q=_.useRef(null),G=_.useRef(T.sourcePosition),W=_.useRef(T.targetPosition),ee=_.useRef(H),ne=U&&!!T.internals.handleBounds;return _.useEffect(()=>{!F.current||T.hidden||ne&&Q.current===F.current||(Q.current&&Y?.unobserve(Q.current),Y?.observe(F.current),Q.current=F.current)},[ne,T.hidden]),_.useEffect(()=>()=>{Q.current&&(Y?.unobserve(Q.current),Q.current=null)},[]),_.useEffect(()=>{if(F.current){let ie=ee.current!==H,ce=G.current!==T.sourcePosition,se=W.current!==T.targetPosition;(ie||ce||se)&&(ee.current=H,G.current=T.sourcePosition,W.current=T.targetPosition,X.getState().updateNodeInternals(new Map([[T.id,{id:T.id,nodeElement:F.current,force:!0}]])))}},[T.id,H,T.sourcePosition,T.targetPosition]),F})({node:p,nodeType:M,hasDimensions:k,resizeObserver:d}),N=Yi({nodeRef:S,disabled:p.hidden||!O,noDragClassName:h,handleSelector:p.dragHandle,nodeId:e,isSelectable:R,nodeClickDistance:b}),z=Fi();if(p.hidden)return null;let D=$e(p),$=(function(T){return T.internals.handleBounds===void 0?{width:T.width??T.initialWidth??T.style?.width,height:T.height??T.initialHeight??T.style?.height}:{width:T.width??T.style?.width,height:T.height??T.style?.height}})(p),j=R||O||t||n||o||r,A=n?T=>n(T,{...f.userNode}):void 0,Z=o?T=>o(T,{...f.userNode}):void 0,B=r?T=>r(T,{...f.userNode}):void 0,K=i?T=>i(T,{...f.userNode}):void 0,J=a?T=>a(T,{...f.userNode}):void 0;return P.jsx("div",{className:me(["react-flow__node",`react-flow__node-${M}`,{[y]:O},p.className,{selected:p.selected,selectable:R,parent:C,draggable:O,dragging:N}]),ref:S,style:{zIndex:f.z,transform:`translate(${f.positionAbsolute.x}px,${f.positionAbsolute.y}px)`,pointerEvents:j?"all":"none",visibility:k?"visible":"hidden",...p.style,...$},"data-id":e,"data-testid":`rf__node-${e}`,onMouseEnter:A,onMouseMove:Z,onMouseLeave:B,onContextMenu:K,onClick:T=>{let{selectNodesOnDrag:H,nodeDragThreshold:U}=v.getState();R&&(!H||!O||U>0)&&wo({id:e,store:v,nodeRef:S}),t&&t(T,{...f.userNode})},onDoubleClick:J,onKeyDown:V?T=>{if(!Zr(T.nativeEvent)&&!m){if(Sr.includes(T.key)&&R){let H=T.key==="Escape";wo({id:e,store:v,unselect:H,nodeRef:S})}else if(O&&p.selected&&Object.prototype.hasOwnProperty.call(Mn,T.key)){T.preventDefault();let{ariaLabelConfig:H}=v.getState();v.setState({ariaLiveMessage:H["node.a11yDescription.ariaLiveMessage"]({direction:T.key.replace("Arrow","").toLowerCase(),x:~~f.positionAbsolute.x,y:~~f.positionAbsolute.y})}),z({direction:Mn[T.key],factor:T.shiftKey?4:1})}}}:void 0,tabIndex:V?0:void 0,onFocus:V?()=>{if(m||!S.current?.matches(":focus-visible"))return;let{transform:T,width:H,height:U,autoPanOnNodeFocus:Y,setCenter:X}=v.getState();Y&&(Wn(new Map([[e,p]]),{x:0,y:0,width:H,height:U},T,!0).length>0||X(p.position.x+D.width/2,p.position.y+D.height/2,{zoom:T[2]}))}:void 0,role:p.ariaRole??(V?"group":void 0),"aria-roledescription":"node","aria-describedby":m?void 0:`${Ei}-${g}`,"aria-label":p.ariaLabel,...p.domAttributes,children:P.jsx(Zl,{value:e,children:P.jsx(I,{id:e,data:p.data,type:M,positionAbsoluteX:f.positionAbsolute.x,positionAbsoluteY:f.positionAbsolute.y,selected:p.selected??!1,selectable:R,draggable:O,deletable:p.deletable??!0,isConnectable:L,sourcePosition:p.sourcePosition,targetPosition:p.targetPosition,dragging:N,dragHandle:p.dragHandle,zIndex:f.z,parentId:p.parentId,...D})})})});let eu=e=>({nodesConnectable:e.nodesConnectable,nodesFocusable:e.nodesFocusable,elementsSelectable:e.elementsSelectable,onError:e.onError});function Ui(e){let{nodesConnectable:t,nodesFocusable:n,elementsSelectable:o,onError:r}=oe(eu,de),i=Ul(e.onlyRenderVisibleElements),a=(function(){let s=oe(Ql),[l]=_.useState(()=>typeof ResizeObserver>"u"?null:new ResizeObserver(c=>{let u=new Map;c.forEach(d=>{let h=d.target.getAttribute("data-id");u.set(h,{id:h,nodeElement:d.target,force:!0})}),s(u)}));return _.useEffect(()=>()=>{l?.disconnect()},[l]),l})();return P.jsx("div",{className:"react-flow__nodes",style:En,children:i.map(s=>P.jsx(Jl,{id:s,nodeTypes:e.nodeTypes,nodeExtent:e.nodeExtent,onClick:e.onNodeClick,onMouseEnter:e.onNodeMouseEnter,onMouseMove:e.onNodeMouseMove,onMouseLeave:e.onNodeMouseLeave,onContextMenu:e.onNodeContextMenu,onDoubleClick:e.onNodeDoubleClick,noDragClassName:e.noDragClassName,noPanClassName:e.noPanClassName,rfId:e.rfId,disableKeyboardA11y:e.disableKeyboardA11y,resizeObserver:a,nodesDraggable:e.nodesDraggable??!0,nodesConnectable:t,nodesFocusable:n,elementsSelectable:o,nodeClickDistance:e.nodeClickDistance,onError:r},s))})}Ui.displayName="NodeRenderer";let tu=_.memo(Ui),Qi={[E.MarkerType.Arrow]:({color:e="none",strokeWidth:t=1})=>{let n={strokeWidth:t,...e&&{stroke:e}};return P.jsx("polyline",{className:"arrow",style:n,strokeLinecap:"round",fill:"none",strokeLinejoin:"round",points:"-5,-4 0,0 -5,4"})},[E.MarkerType.ArrowClosed]:({color:e="none",strokeWidth:t=1})=>{let n={strokeWidth:t,...e&&{stroke:e,fill:e}};return P.jsx("polyline",{className:"arrowclosed",style:n,strokeLinecap:"round",strokeLinejoin:"round",points:"-5,-4 0,0 -5,4 -5,-4"})}},nu=({id:e,type:t,color:n,width:o=12.5,height:r=12.5,markerUnits:i="strokeWidth",strokeWidth:a,orient:s="auto-start-reverse"})=>{let l=(function(c){let u=le();return _.useMemo(()=>Object.prototype.hasOwnProperty.call(Qi,c)?Qi[c]:(u.getState().onError?.("009",Tc(c)),null),[c])})(t);return l?P.jsx("marker",{className:"react-flow__arrowhead",id:e,markerWidth:`${o}`,markerHeight:`${r}`,viewBox:"-10 -10 20 20",markerUnits:i,orient:s,refX:"0",refY:"0",children:P.jsx(l,{color:n,strokeWidth:a})}):null},Ji=({defaultColor:e,rfId:t})=>{let n=oe(i=>i.edges),o=oe(i=>i.defaultEdgeOptions),r=_.useMemo(()=>(function(a,{id:s,defaultColor:l,defaultMarkerStart:c,defaultMarkerEnd:u}){let d=new Set;return a.reduce((h,y)=>([y.markerStart||c,y.markerEnd||u].forEach(m=>{if(m&&typeof m=="object"){let g=no(m,s);d.has(g)||(h.push({id:g,color:m.color||l,...m}),d.add(g))}}),h),[]).sort((h,y)=>h.id.localeCompare(y.id))})(n,{id:t,defaultColor:e,defaultMarkerStart:o?.markerStart,defaultMarkerEnd:o?.markerEnd}),[n,o,t,e]);return r.length?P.jsx("svg",{className:"react-flow__marker","aria-hidden":"true",children:P.jsx("defs",{children:r.map(i=>P.jsx(nu,{id:i.id,type:i.type,color:i.color,width:i.width,height:i.height,markerUnits:i.markerUnits,strokeWidth:i.strokeWidth,orient:i.orient},i.id))})}):null};Ji.displayName="MarkerDefinitions";var ou=_.memo(Ji);function ea({x:e,y:t,label:n,labelStyle:o,labelShowBg:r=!0,labelBgStyle:i,labelBgPadding:a=[2,4],labelBgBorderRadius:s=2,children:l,className:c,...u}){let[d,h]=_.useState({x:1,y:0,width:0,height:0}),y=me(["react-flow__edge-textwrapper",c]),m=_.useRef(null);return _.useEffect(()=>{if(m.current){let g=m.current.getBBox();h({x:g.x,y:g.y,width:g.width,height:g.height})}},[n]),n?P.jsxs("g",{transform:`translate(${e-d.width/2} ${t-d.height/2})`,className:y,visibility:d.width?"visible":"hidden",...u,children:[r&&P.jsx("rect",{width:d.width+2*a[0],x:-a[0],y:-a[1],height:d.height+2*a[1],className:"react-flow__edge-textbg",style:i,rx:s,ry:s}),P.jsx("text",{className:"react-flow__edge-text",y:d.height/2,dy:"0.3em",ref:m,style:o,children:n}),l]}):null}ea.displayName="EdgeText";let ta=_.memo(ea);function Bt({path:e,labelX:t,labelY:n,label:o,labelStyle:r,labelShowBg:i,labelBgStyle:a,labelBgPadding:s,labelBgBorderRadius:l,interactionWidth:c=20,...u}){return P.jsxs(P.Fragment,{children:[P.jsx("path",{...u,d:e,fill:"none",className:me(["react-flow__edge-path",u.className])}),c?P.jsx("path",{d:e,fill:"none",strokeOpacity:0,strokeWidth:c,className:"react-flow__edge-interaction"}):null,o&&Le(t)&&Le(n)?P.jsx(ta,{x:t,y:n,label:o,labelStyle:r,labelShowBg:i,labelBgStyle:a,labelBgPadding:s,labelBgBorderRadius:l}):null]})}function na({pos:e,x1:t,y1:n,x2:o,y2:r}){return e===E.Position.Left||e===E.Position.Right?[.5*(t+o),n]:[t,.5*(n+r)]}function So({sourceX:e,sourceY:t,sourcePosition:n=E.Position.Bottom,targetX:o,targetY:r,targetPosition:i=E.Position.Top}){let[a,s]=na({pos:n,x1:e,y1:t,x2:o,y2:r}),[l,c]=na({pos:i,x1:o,y1:r,x2:e,y2:t}),[u,d,h,y]=Qn({sourceX:e,sourceY:t,targetX:o,targetY:r,sourceControlX:a,sourceControlY:s,targetControlX:l,targetControlY:c});return[`M${e},${t} C${a},${s} ${l},${c} ${o},${r}`,u,d,h,y]}function oa(e){return _.memo(({id:t,sourceX:n,sourceY:o,targetX:r,targetY:i,sourcePosition:a,targetPosition:s,label:l,labelStyle:c,labelShowBg:u,labelBgStyle:d,labelBgPadding:h,labelBgBorderRadius:y,style:m,markerEnd:g,markerStart:x,interactionWidth:b})=>{let[w,p,f]=So({sourceX:n,sourceY:o,sourcePosition:a,targetX:r,targetY:i,targetPosition:s}),C=e.isInternal?void 0:t;return P.jsx(Bt,{id:C,path:w,labelX:p,labelY:f,label:l,labelStyle:c,labelShowBg:u,labelBgStyle:d,labelBgPadding:h,labelBgBorderRadius:y,style:m,markerEnd:g,markerStart:x,interactionWidth:b})})}let ra=oa({isInternal:!1}),ia=oa({isInternal:!0});function aa(e){return _.memo(({id:t,sourceX:n,sourceY:o,targetX:r,targetY:i,label:a,labelStyle:s,labelShowBg:l,labelBgStyle:c,labelBgPadding:u,labelBgBorderRadius:d,style:h,sourcePosition:y=E.Position.Bottom,targetPosition:m=E.Position.Top,markerEnd:g,markerStart:x,pathOptions:b,interactionWidth:w})=>{let[p,f,C]=vn({sourceX:n,sourceY:o,sourcePosition:y,targetX:r,targetY:i,targetPosition:m,borderRadius:b?.borderRadius,offset:b?.offset,stepPosition:b?.stepPosition}),M=e.isInternal?void 0:t;return P.jsx(Bt,{id:M,path:p,labelX:f,labelY:C,label:a,labelStyle:s,labelShowBg:l,labelBgStyle:c,labelBgPadding:u,labelBgBorderRadius:d,style:h,markerEnd:g,markerStart:x,interactionWidth:w})})}ra.displayName="SimpleBezierEdge",ia.displayName="SimpleBezierEdgeInternal";let Co=aa({isInternal:!1}),sa=aa({isInternal:!0});function ca(e){return _.memo(({id:t,...n})=>{let o=e.isInternal?void 0:t;return P.jsx(Co,{...n,id:o,pathOptions:_.useMemo(()=>({borderRadius:0,offset:n.pathOptions?.offset}),[n.pathOptions?.offset])})})}Co.displayName="SmoothStepEdge",sa.displayName="SmoothStepEdgeInternal";let la=ca({isInternal:!1}),ua=ca({isInternal:!0});function da(e){return _.memo(({id:t,sourceX:n,sourceY:o,targetX:r,targetY:i,label:a,labelStyle:s,labelShowBg:l,labelBgStyle:c,labelBgPadding:u,labelBgBorderRadius:d,style:h,markerEnd:y,markerStart:m,interactionWidth:g})=>{let[x,b,w]=to({sourceX:n,sourceY:o,targetX:r,targetY:i}),p=e.isInternal?void 0:t;return P.jsx(Bt,{id:p,path:x,labelX:b,labelY:w,label:a,labelStyle:s,labelShowBg:l,labelBgStyle:c,labelBgPadding:u,labelBgBorderRadius:d,style:h,markerEnd:y,markerStart:m,interactionWidth:g})})}la.displayName="StepEdge",ua.displayName="StepEdgeInternal";let ha=da({isInternal:!1}),fa=da({isInternal:!0});function ga(e){return _.memo(({id:t,sourceX:n,sourceY:o,targetX:r,targetY:i,sourcePosition:a=E.Position.Bottom,targetPosition:s=E.Position.Top,label:l,labelStyle:c,labelShowBg:u,labelBgStyle:d,labelBgPadding:h,labelBgBorderRadius:y,style:m,markerEnd:g,markerStart:x,pathOptions:b,interactionWidth:w})=>{let[p,f,C]=Jn({sourceX:n,sourceY:o,sourcePosition:a,targetX:r,targetY:i,targetPosition:s,curvature:b?.curvature}),M=e.isInternal?void 0:t;return P.jsx(Bt,{id:M,path:p,labelX:f,labelY:C,label:l,labelStyle:c,labelShowBg:u,labelBgStyle:d,labelBgPadding:h,labelBgBorderRadius:y,style:m,markerEnd:g,markerStart:x,interactionWidth:w})})}ha.displayName="StraightEdge",fa.displayName="StraightEdgeInternal";let pa=ga({isInternal:!1}),ma=ga({isInternal:!0});pa.displayName="BezierEdge",ma.displayName="BezierEdgeInternal";let ya={default:ma,straight:fa,step:ua,smoothstep:sa,simplebezier:ia},va={sourceX:null,sourceY:null,targetX:null,targetY:null,sourcePosition:null,targetPosition:null,zIndex:void 0},ru=(e,t,n)=>n===E.Position.Left?e-t:n===E.Position.Right?e+t:e,iu=(e,t,n)=>n===E.Position.Top?e-t:n===E.Position.Bottom?e+t:e,xa="react-flow__edgeupdater";function wa({position:e,centerX:t,centerY:n,radius:o=10,onMouseDown:r,onMouseEnter:i,onMouseOut:a,type:s}){return P.jsx("circle",{onMouseDown:r,onMouseEnter:i,onMouseOut:a,className:me([xa,`${xa}-${s}`]),cx:ru(t,o,e),cy:iu(n,o,e),r:o,stroke:"transparent",fill:"transparent"})}function au({isReconnectable:e,reconnectRadius:t,edge:n,sourceX:o,sourceY:r,targetX:i,targetY:a,sourcePosition:s,targetPosition:l,onReconnect:c,onReconnectStart:u,onReconnectEnd:d,setReconnecting:h,setUpdateHover:y}){let m=le(),g=(w,p)=>{if(w.button!==0)return;let{autoPanOnConnect:f,domNode:C,connectionMode:M,connectionRadius:I,lib:O,onConnectStart:R,cancelConnection:L,nodeLookup:V,rfId:v,panBy:k,updateConnection:S}=m.getState(),N=p.type==="target";uo.onPointerDown(w.nativeEvent,{autoPanOnConnect:f,connectionMode:M,connectionRadius:I,domNode:C,handleId:p.id,nodeId:p.nodeId,nodeLookup:V,isTarget:N,edgeUpdaterType:p.type,lib:O,flowId:v,cancelConnection:L,panBy:k,isValidConnection:(...z)=>m.getState().isValidConnection?.(...z)??!0,onConnect:z=>c?.(n,z),onConnectStart:(z,D)=>{h(!0),u?.(w,n,p.type),R?.(z,D)},onConnectEnd:(...z)=>m.getState().onConnectEnd?.(...z),onReconnectEnd:(z,D)=>{h(!1),d?.(z,n,p.type,D)},updateConnection:S,getTransform:()=>m.getState().transform,getFromHandle:()=>m.getState().connection.fromHandle,dragThreshold:m.getState().connectionDragThreshold,handleDomNode:w.currentTarget})},x=()=>y(!0),b=()=>y(!1);return P.jsxs(P.Fragment,{children:[(e===!0||e==="source")&&P.jsx(wa,{position:s,centerX:o,centerY:r,radius:t,onMouseDown:w=>g(w,{nodeId:n.target,id:n.targetHandle??null,type:"target"}),onMouseEnter:x,onMouseOut:b,type:"source"}),(e===!0||e==="target")&&P.jsx(wa,{position:l,centerX:i,centerY:a,radius:t,onMouseDown:w=>g(w,{nodeId:n.source,id:n.sourceHandle??null,type:"source"}),onMouseEnter:x,onMouseOut:b,type:"target"})]})}var su=_.memo(function({id:e,edgesFocusable:t,edgesReconnectable:n,elementsSelectable:o,onClick:r,onDoubleClick:i,onContextMenu:a,onMouseEnter:s,onMouseMove:l,onMouseLeave:c,reconnectRadius:u,onReconnect:d,onReconnectStart:h,onReconnectEnd:y,rfId:m,edgeTypes:g,noPanClassName:x,onError:b,disableKeyboardA11y:w}){let p=oe(F=>F.edgeLookup.get(e)),f=oe(F=>F.defaultEdgeOptions);p=f?{...f,...p}:p;let C=p.type||"default",M=g?.[C]||ya[C];M===void 0&&(b?.("011",jc(C)),C="default",M=g?.default||ya.default);let I=!!(p.focusable||t&&p.focusable===void 0),O=d!==void 0&&(p.reconnectable||n&&p.reconnectable===void 0),R=!!(p.selectable||o&&p.selectable===void 0),L=_.useRef(null),[V,v]=_.useState(!1),[k,S]=_.useState(!1),N=le(),{zIndex:z=p.zIndex,sourceX:D,sourceY:$,targetX:j,targetY:A,sourcePosition:Z,targetPosition:B}=oe(_.useCallback(F=>{let Q=F.nodeLookup.get(p.source),G=F.nodeLookup.get(p.target);if(!Q||!G)return va;let W=(function(ne){let{sourceNode:ie,targetNode:ce}=ne;if(!Gr(ie)||!Gr(ce))return null;let se=ie.internals.handleBounds||Ur(ie.handles),te=ce.internals.handleBounds||Ur(ce.handles),ae=Qr(se?.source??[],ne.sourceHandle),q=Qr(ne.connectionMode===E.ConnectionMode.Strict?te?.target??[]:(te?.target??[]).concat(te?.source??[]),ne.targetHandle);if(!ae||!q)return ne.onError?.("008",Bc(ae?"target":"source",{id:ne.id,sourceHandle:ne.sourceHandle,targetHandle:ne.targetHandle})),null;let re=ae?.position||E.Position.Bottom,we=q?.position||E.Position.Top,fe=ot(ie,ae,re),ve=ot(ce,q,we);return{sourceX:fe.x,sourceY:fe.y,targetX:ve.x,targetY:ve.y,sourcePosition:re,targetPosition:we}})({id:e,sourceNode:Q,targetNode:G,sourceHandle:p.sourceHandle||null,targetHandle:p.targetHandle||null,connectionMode:F.connectionMode,onError:b}),ee=(function({sourceNode:ne,targetNode:ie,selected:ce=!1,zIndex:se=0,elevateOnSelect:te=!1,zIndexMode:ae="basic"}){return ae==="manual"?se:(te&&ce?se+1e3:se)+Math.max(ne.parentId||te&&ne.selected?ne.internals.z:0,ie.parentId||te&&ie.selected?ie.internals.z:0)})({selected:p.selected,zIndex:p.zIndex,sourceNode:Q,targetNode:G,elevateOnSelect:F.elevateEdgesOnSelect,zIndexMode:F.zIndexMode});return{...W||va,zIndex:ee}},[p.source,p.target,p.sourceHandle,p.targetHandle,p.selected,p.zIndex,b]),de),K=_.useMemo(()=>p.markerStart?`url('#${no(p.markerStart,m)}')`:void 0,[p.markerStart,m]),J=_.useMemo(()=>p.markerEnd?`url('#${no(p.markerEnd,m)}')`:void 0,[p.markerEnd,m]);if(p.hidden||D===null||$===null||j===null||A===null)return null;let T=i?F=>{i(F,{...p})}:void 0,H=a?F=>{a(F,{...p})}:void 0,U=s?F=>{s(F,{...p})}:void 0,Y=l?F=>{l(F,{...p})}:void 0,X=c?F=>{c(F,{...p})}:void 0;return P.jsx("svg",{style:{zIndex:z},children:P.jsxs("g",{className:me(["react-flow__edge",`react-flow__edge-${C}`,p.className,x,{selected:p.selected,animated:p.animated,inactive:!R&&!r,updating:V,selectable:R}]),onClick:F=>{let{addSelectedEdges:Q,unselectNodesAndEdges:G,multiSelectionActive:W}=N.getState();R&&(N.setState({nodesSelectionActive:!1}),p.selected&&W?(G({nodes:[],edges:[p]}),L.current?.blur()):Q([e])),r&&r(F,p)},onDoubleClick:T,onContextMenu:H,onMouseEnter:U,onMouseMove:Y,onMouseLeave:X,onKeyDown:I?F=>{if(!w&&Sr.includes(F.key)&&R){let{unselectNodesAndEdges:Q,addSelectedEdges:G}=N.getState();F.key==="Escape"?(L.current?.blur(),Q({edges:[p]})):G([e])}}:void 0,tabIndex:I?0:void 0,role:p.ariaRole??(I?"group":"img"),"aria-roledescription":"edge","data-id":e,"data-testid":`rf__edge-${e}`,"aria-label":p.ariaLabel===null?void 0:p.ariaLabel||`Edge from ${p.source} to ${p.target}`,"aria-describedby":I?`${Mi}-${m}`:void 0,ref:L,...p.domAttributes,children:[!k&&P.jsx(M,{id:e,source:p.source,target:p.target,type:p.type,selected:p.selected,animated:p.animated,selectable:R,deletable:p.deletable??!0,label:p.label,labelStyle:p.labelStyle,labelShowBg:p.labelShowBg,labelBgStyle:p.labelBgStyle,labelBgPadding:p.labelBgPadding,labelBgBorderRadius:p.labelBgBorderRadius,sourceX:D,sourceY:$,targetX:j,targetY:A,sourcePosition:Z,targetPosition:B,data:p.data,style:p.style,sourceHandleId:p.sourceHandle,targetHandleId:p.targetHandle,markerStart:K,markerEnd:J,pathOptions:"pathOptions"in p?p.pathOptions:void 0,interactionWidth:p.interactionWidth}),O&&P.jsx(au,{edge:p,isReconnectable:O,reconnectRadius:u,onReconnect:d,onReconnectStart:h,onReconnectEnd:y,sourceX:D,sourceY:$,targetX:j,targetY:A,sourcePosition:Z,targetPosition:B,setUpdateHover:v,setReconnecting:S})]})})});let cu=e=>({edgesFocusable:e.edgesFocusable,edgesReconnectable:e.edgesReconnectable,elementsSelectable:e.elementsSelectable,connectionMode:e.connectionMode,onError:e.onError});function ba({defaultMarkerColor:e,onlyRenderVisibleElements:t,rfId:n,edgeTypes:o,noPanClassName:r,onReconnect:i,onEdgeContextMenu:a,onEdgeMouseEnter:s,onEdgeMouseMove:l,onEdgeMouseLeave:c,onEdgeClick:u,reconnectRadius:d,onEdgeDoubleClick:h,onReconnectStart:y,onReconnectEnd:m,disableKeyboardA11y:g}){let{edgesFocusable:x,edgesReconnectable:b,elementsSelectable:w,onError:p}=oe(cu,de),f=(C=t,oe(_.useCallback(M=>{if(!C)return M.edges.map(O=>O.id);let I=[];if(M.width&&M.height)for(let O of M.edges){let R=M.nodeLookup.get(O.source),L=M.nodeLookup.get(O.target);R&&L&&Kc({sourceNode:R,targetNode:L,width:M.width,height:M.height,transform:M.transform})&&I.push(O.id)}return I},[C]),de));var C;return P.jsxs("div",{className:"react-flow__edges",children:[P.jsx(ou,{defaultColor:e,rfId:n}),f.map(M=>P.jsx(su,{id:M,edgesFocusable:x,edgesReconnectable:b,elementsSelectable:w,noPanClassName:r,onReconnect:i,onContextMenu:a,onMouseEnter:s,onMouseMove:l,onMouseLeave:c,onClick:u,reconnectRadius:d,onDoubleClick:h,onReconnectStart:y,onReconnectEnd:m,rfId:n,onError:p,edgeTypes:o,disableKeyboardA11y:g},M))]})}ba.displayName="EdgeRenderer";let lu=_.memo(ba),Sa=e=>`translate(${e[0]}px,${e[1]}px) scale(${e[2]})`;function uu({children:e}){let t=le(),n=_.useRef(null),[o]=_.useState(()=>t.getState().transform);return ji(()=>{let r=null,i=()=>{let a=t.getState().transform;r&&a[0]===r[0]&&a[1]===r[1]&&a[2]===r[2]||(r=a,n.current&&(n.current.style.transform=Sa(a)))};return i(),t.subscribe(i)},[t]),P.jsx("div",{ref:n,className:"react-flow__viewport xyflow__viewport react-flow__container",style:{transform:Sa(o)},children:e})}let du=e=>e.panZoom?.syncViewport;function Ca(e){return e.connection.inProgress?{...e.connection,to:Dt(e.connection.to,e.transform)}:{...e.connection}}function Ea(e){return oe((function(n){return n?o=>{let r=Ca(o);return n(r)}:Ca})(e),de)}let hu=e=>({nodesConnectable:e.nodesConnectable,isValid:e.connection.isValid,inProgress:e.connection.inProgress,width:e.width,height:e.height});function fu({containerStyle:e,style:t,type:n,component:o}){let{nodesConnectable:r,width:i,height:a,isValid:s,inProgress:l}=oe(hu,de);return i&&r&&l?P.jsx("svg",{style:e,width:i,height:a,className:"react-flow__connectionline react-flow__container",children:P.jsx("g",{className:me(["react-flow__connection",zr(s)]),children:P.jsx(Ma,{style:t,type:n,CustomComponent:o,isValid:s})})}):null}let Ma=({style:e,type:t=E.ConnectionLineType.Bezier,CustomComponent:n,isValid:o})=>{let{inProgress:r,from:i,fromNode:a,fromHandle:s,fromPosition:l,to:c,toNode:u,toHandle:d,toPosition:h,pointer:y}=Ea();if(!r)return;if(n)return P.jsx(n,{connectionLineType:t,connectionLineStyle:e,fromNode:a,fromHandle:s,fromX:i.x,fromY:i.y,toX:c.x,toY:c.y,fromPosition:l,toPosition:h,connectionStatus:zr(o),toNode:u,toHandle:d,pointer:y});let m="",g={sourceX:i.x,sourceY:i.y,sourcePosition:l,targetX:c.x,targetY:c.y,targetPosition:h};switch(t){case E.ConnectionLineType.Bezier:[m]=Jn(g);break;case E.ConnectionLineType.SimpleBezier:[m]=So(g);break;case E.ConnectionLineType.Step:[m]=vn({...g,borderRadius:0});break;case E.ConnectionLineType.SmoothStep:[m]=vn(g);break;default:[m]=to(g)}return P.jsx("path",{d:m,fill:"none",className:"react-flow__connection-path",style:e})};Ma.displayName="ConnectionLine";let gu={};function Na(e=gu){_.useRef(e),le(),_.useEffect(()=>{},[e])}function ka({nodeTypes:e,edgeTypes:t,onInit:n,onNodeClick:o,onEdgeClick:r,onNodeDoubleClick:i,onEdgeDoubleClick:a,onNodeMouseEnter:s,onNodeMouseMove:l,onNodeMouseLeave:c,onNodeContextMenu:u,onSelectionContextMenu:d,onSelectionStart:h,onSelectionEnd:y,connectionLineType:m,connectionLineStyle:g,connectionLineComponent:x,connectionLineContainerStyle:b,selectionKeyCode:w,selectionOnDrag:p,selectionMode:f,multiSelectionKeyCode:C,panActivationKeyCode:M,zoomActivationKeyCode:I,deleteKeyCode:O,onlyRenderVisibleElements:R,elementsSelectable:L,defaultViewport:V,translateExtent:v,minZoom:k,maxZoom:S,preventScrolling:N,defaultMarkerColor:z,zoomOnScroll:D,zoomOnPinch:$,panOnScroll:j,panOnScrollSpeed:A,panOnScrollMode:Z,zoomOnDoubleClick:B,panOnDrag:K,autoPanOnSelection:J,onPaneClick:T,onPaneMouseEnter:H,onPaneMouseMove:U,onPaneMouseLeave:Y,onPaneScroll:X,onPaneContextMenu:F,paneClickDistance:Q,nodeClickDistance:G,onEdgeContextMenu:W,onEdgeMouseEnter:ee,onEdgeMouseMove:ne,onEdgeMouseLeave:ie,reconnectRadius:ce,onReconnect:se,onReconnectStart:te,onReconnectEnd:ae,noDragClassName:q,noWheelClassName:re,noPanClassName:we,disableKeyboardA11y:fe,nodeExtent:ve,rfId:Ie,viewport:ue,onViewportChange:Ce,nodesDraggable:Oe}){return Na(e),Na(t),le(),_.useRef(!1),_.useEffect(()=>{},[]),(function(ye){let Se=Cn(),be=_.useRef(!1);_.useEffect(()=>{!be.current&&Se.viewportInitialized&&ye&&(setTimeout(()=>ye(Se),1),be.current=!0)},[ye,Se.viewportInitialized])})(n),(function(ye){let Se=oe(du),be=le();_.useEffect(()=>{ye&&(Se?.(ye),be.setState({transform:[ye.x,ye.y,ye.zoom]}))},[ye,Se])})(ue),P.jsx(Gl,{onPaneClick:T,onPaneMouseEnter:H,onPaneMouseMove:U,onPaneMouseLeave:Y,onPaneContextMenu:F,onPaneScroll:X,paneClickDistance:Q,deleteKeyCode:O,selectionKeyCode:w,selectionOnDrag:p,selectionMode:f,onSelectionStart:h,onSelectionEnd:y,multiSelectionKeyCode:C,panActivationKeyCode:M,zoomActivationKeyCode:I,elementsSelectable:L,zoomOnScroll:D,zoomOnPinch:$,zoomOnDoubleClick:B,panOnScroll:j,panOnScrollSpeed:A,panOnScrollMode:Z,panOnDrag:K,autoPanOnSelection:J,defaultViewport:V,translateExtent:v,minZoom:k,maxZoom:S,onSelectionContextMenu:d,preventScrolling:N,noDragClassName:q,noWheelClassName:re,noPanClassName:we,disableKeyboardA11y:fe,onViewportChange:Ce,isControlledViewport:!!ue,children:P.jsxs(uu,{children:[P.jsx(lu,{edgeTypes:t,onEdgeClick:r,onEdgeDoubleClick:a,onReconnect:se,onReconnectStart:te,onReconnectEnd:ae,onlyRenderVisibleElements:R,onEdgeContextMenu:W,onEdgeMouseEnter:ee,onEdgeMouseMove:ne,onEdgeMouseLeave:ie,reconnectRadius:ce,defaultMarkerColor:z,noPanClassName:we,disableKeyboardA11y:fe,rfId:Ie}),P.jsx(fu,{style:g,type:m,component:x,containerStyle:b}),P.jsx("div",{className:"react-flow__edgelabel-renderer"}),P.jsx(tu,{nodeTypes:e,onNodeClick:o,onNodeDoubleClick:i,onNodeMouseEnter:s,onNodeMouseMove:l,onNodeMouseLeave:c,onNodeContextMenu:u,nodeClickDistance:G,onlyRenderVisibleElements:R,noPanClassName:we,noDragClassName:q,disableKeyboardA11y:fe,nodeExtent:ve,rfId:Ie,nodesDraggable:Oe}),P.jsx("div",{className:"react-flow__viewport-portal"})]})})}ka.displayName="GraphView";let pu=_.memo(ka),mu=(e,t)=>{},_a=({nodes:e,edges:t,defaultNodes:n,defaultEdges:o,width:r,height:i,fitView:a,fitViewOptions:s,minZoom:l=.5,maxZoom:c=2,nodeOrigin:u,nodeExtent:d,zIndexMode:h="basic"}={})=>{let y=new Map,m=new Map,g=new Map,x=new Map,b=o??t??[],w=n??e??[],p=u??[0,0],f=d??Pt;ti(g,x,b);let{nodesInitialized:C}=ao(w,y,m,{nodeOrigin:p,nodeExtent:f,zIndexMode:h}),M=[0,0,1];if(a&&r&&i){let I=lt(y,{filter:V=>!(!V.width&&!V.initialWidth||!V.height&&!V.initialHeight)}),{x:O,y:R,zoom:L}=mn(I,r,i,l,c,s?.padding??.1);M=[O,R,L]}return{rfId:"1",width:r??0,height:i??0,transform:M,nodes:w,nodesInitialized:C,nodeLookup:y,parentLookup:m,edges:b,edgeLookup:x,connectionLookup:g,onNodesChange:null,onEdgesChange:null,hasDefaultNodes:n!==void 0,hasDefaultEdges:o!==void 0,panZoom:null,minZoom:l,maxZoom:c,translateExtent:Pt,nodeExtent:f,nodesSelectionActive:!1,userSelectionActive:!1,userSelectionRect:null,connectionMode:E.ConnectionMode.Strict,domNode:null,paneDragging:!1,noPanClassName:"nopan",nodeOrigin:p,nodeDragThreshold:1,connectionDragThreshold:1,snapGrid:[15,15],snapToGrid:!1,nodesDraggable:!0,nodesConnectable:!0,nodesFocusable:!0,edgesFocusable:!0,edgesReconnectable:!0,elementsSelectable:!0,elevateNodesOnSelect:!0,elevateEdgesOnSelect:!0,selectNodesOnDrag:!0,multiSelectionActive:!1,fitViewQueued:a??!1,fitViewOptions:s,fitViewResolver:null,connection:{...Nr},connectionClickStartHandle:null,connectOnClick:!0,ariaLiveMessage:"",autoPanOnConnect:!0,autoPanOnNodeDrag:!0,autoPanOnNodeFocus:!0,autoPanSpeed:15,connectionRadius:20,onError:mu,isValidConnection:void 0,onSelectionChangeHandlers:[],lib:"react",debug:!1,ariaLabelConfig:Cr,zIndexMode:h,onNodesChangeMiddlewareMap:new Map,onEdgesChangeMiddlewareMap:new Map}},yu=({nodes:e,edges:t,defaultNodes:n,defaultEdges:o,width:r,height:i,fitView:a,fitViewOptions:s,minZoom:l,maxZoom:c,nodeOrigin:u,nodeExtent:d,zIndexMode:h})=>{return y=(g,x)=>{async function b(){let{nodeLookup:w,panZoom:p,fitViewOptions:f,fitViewResolver:C,width:M,height:I,minZoom:O,maxZoom:R}=x();p&&(await Yc({nodes:w,width:M,height:I,panZoom:p,minZoom:O,maxZoom:R},f),C?.resolve(!0),g({fitViewResolver:null}))}return{..._a({nodes:e,edges:t,width:r,height:i,fitView:a,fitViewOptions:s,minZoom:l,maxZoom:c,nodeOrigin:u,nodeExtent:d,defaultNodes:n,defaultEdges:o,zIndexMode:h}),setNodes:w=>{let{nodeLookup:p,parentLookup:f,nodeOrigin:C,nodeExtent:M,elevateNodesOnSelect:I,fitViewQueued:O,zIndexMode:R,nodesSelectionActive:L}=x(),{nodesInitialized:V,hasSelectedNodes:v}=ao(w,p,f,{nodeOrigin:C,nodeExtent:M,elevateNodesOnSelect:I,checkEquality:!0,zIndexMode:R}),k=L&&v;O&&V?(b(),g({nodes:w,nodesInitialized:V,fitViewQueued:!1,fitViewOptions:void 0,nodesSelectionActive:k})):g({nodes:w,nodesInitialized:V,nodesSelectionActive:k})},setEdges:w=>{let{connectionLookup:p,edgeLookup:f}=x();ti(p,f,w),g({edges:w})},setDefaultNodesAndEdges:(w,p)=>{if(w){let{setNodes:f}=x();f(w),g({hasDefaultNodes:!0})}if(p){let{setEdges:f}=x();f(p),g({hasDefaultEdges:!0})}},updateNodeInternals:w=>{let{triggerNodeChanges:p,nodeLookup:f,parentLookup:C,domNode:M,nodeOrigin:I,nodeExtent:O,debug:R,fitViewQueued:L,zIndexMode:V}=x(),{changes:v,updatedInternals:k}=(function(S,N,z,D,$,j,A){let Z=D?.querySelector(".xyflow__viewport"),B=!1;if(!Z)return{changes:[],updatedInternals:B};let K=[],J=window.getComputedStyle(Z),{m22:T}=new window.DOMMatrixReadOnly(J.transform),H=[];for(let U of S.values()){let Y=N.get(U.id);if(!Y)continue;if(Y.hidden){N.set(Y.id,{...Y,internals:{...Y.internals,handleBounds:void 0}}),B=!0;continue}let X=Un(U.nodeElement),F=Y.measured.width!==X.width||Y.measured.height!==X.height;if(X.width&&X.height&&(F||!Y.internals.handleBounds||U.force)){let Q=U.nodeElement.getBoundingClientRect(),G=nt(Y.extent)?Y.extent:j,{positionAbsolute:W}=Y.internals;if(Y.parentId&&Y.extent==="parent"){let ne=N.get(Y.parentId);ne&&(W=Rr(W,X,ne))}else G&&(W=tt(W,G,X));let ee={...Y,measured:X,internals:{...Y.internals,positionAbsolute:W,handleBounds:{source:Yr("source",U.nodeElement,Q,T,Y.id),target:Yr("target",U.nodeElement,Q,T,Y.id)}}};N.set(Y.id,ee),Y.parentId&&so(ee,N,z,{nodeOrigin:$,zIndexMode:A}),B=!0,F&&(K.push({id:Y.id,type:"dimensions",dimensions:X}),Y.expandParent&&Y.parentId&&H.push({id:Y.id,parentId:Y.parentId,rect:Ot(ee,$)}))}}if(H.length>0){let U=co(H,N,z,$);K.push(...U)}return{changes:K,updatedInternals:B}})(w,f,C,M,I,O,V);k&&((function(S,N,z){let D=ro(oo,z);for(let $ of S.values())if($.parentId)so($,S,N,D);else{let j=It($,D.nodeOrigin),A=nt($.extent)?$.extent:D.nodeExtent,Z=tt(j,A,$e($));$.internals.positionAbsolute=Z}})(f,C,{nodeOrigin:I,nodeExtent:O,zIndexMode:V}),L?(b(),g({fitViewQueued:!1,fitViewOptions:void 0})):g({}),v?.length>0&&(R&&console.log("React Flow: trigger node changes",v),p?.(v)))},updateNodePositions:(w,p=!1)=>{let f=[],C=[],{nodeLookup:M,triggerNodeChanges:I,connection:O,updateConnection:R,onNodesChangeMiddlewareMap:L}=x();for(let[V,v]of w){let k=M.get(V),S=!!(k?.expandParent&&k?.parentId&&v?.position),N={id:V,type:"position",position:S?{x:Math.max(0,v.position.x),y:Math.max(0,v.position.y)}:v.position,dragging:p};if(k&&O.inProgress&&O.fromNode.id===k.id){let z=ot(k,O.fromHandle,E.Position.Left,!0);R({...O,from:z})}S&&k.parentId&&f.push({id:V,parentId:k.parentId,rect:{...v.internals.positionAbsolute,width:v.measured.width??0,height:v.measured.height??0}}),C.push(N)}if(f.length>0){let{parentLookup:V,nodeOrigin:v}=x(),k=co(f,M,V,v);C.push(...k)}for(let V of L.values())C=V(C);I(C)},triggerNodeChanges:w=>{let{onNodesChange:p,setNodes:f,nodes:C,hasDefaultNodes:M,debug:I}=x();w?.length&&(M&&f(mo(w,C)),I&&console.log("React Flow: trigger node changes",w),p?.(w))},triggerEdgeChanges:w=>{let{onEdgesChange:p,setEdges:f,edges:C,hasDefaultEdges:M,debug:I}=x();w?.length&&(M&&f(yo(w,C)),I&&console.log("React Flow: trigger edge changes",w),p?.(w))},addSelectedNodes:w=>{let{multiSelectionActive:p,edgeLookup:f,nodeLookup:C,triggerNodeChanges:M,triggerEdgeChanges:I}=x();p?M(w.map(O=>rt(O,!0))):(M(gt(C,new Set([...w]),!0)),I(gt(f)))},addSelectedEdges:w=>{let{multiSelectionActive:p,edgeLookup:f,nodeLookup:C,triggerNodeChanges:M,triggerEdgeChanges:I}=x();p?I(w.map(O=>rt(O,!0))):(I(gt(f,new Set([...w]))),M(gt(C,new Set,!0)))},unselectNodesAndEdges:({nodes:w,edges:p}={})=>{let{edges:f,nodes:C,nodeLookup:M,triggerNodeChanges:I,triggerEdgeChanges:O}=x(),R=w||C,L=p||f,V=[];for(let k of R){if(!k.selected)continue;let S=M.get(k.id);S&&(S.selected=!1),V.push(rt(k.id,!1))}let v=[];for(let k of L)k.selected&&v.push(rt(k.id,!1));I(V),O(v)},setMinZoom:w=>{let{panZoom:p,maxZoom:f}=x();p?.setScaleExtent([w,f]),g({minZoom:w})},setMaxZoom:w=>{let{panZoom:p,minZoom:f}=x();p?.setScaleExtent([f,w]),g({maxZoom:w})},setTranslateExtent:w=>{x().panZoom?.setTranslateExtent(w),g({translateExtent:w})},resetSelectedElements:()=>{let{edges:w,nodes:p,triggerNodeChanges:f,triggerEdgeChanges:C,elementsSelectable:M}=x();if(!M)return;let I=p.reduce((R,L)=>L.selected?[...R,rt(L.id,!1)]:R,[]),O=w.reduce((R,L)=>L.selected?[...R,rt(L.id,!1)]:R,[]);f(I),C(O)},setNodeExtent:w=>{let{nodes:p,nodeLookup:f,parentLookup:C,nodeOrigin:M,elevateNodesOnSelect:I,nodeExtent:O,zIndexMode:R}=x();w[0][0]===O[0][0]&&w[0][1]===O[0][1]&&w[1][0]===O[1][0]&&w[1][1]===O[1][1]||(ao(p,f,C,{nodeOrigin:M,nodeExtent:w,elevateNodesOnSelect:I,checkEquality:!1,zIndexMode:R}),g({nodeExtent:w}))},panBy:w=>{let{transform:p,width:f,height:C,panZoom:M,translateExtent:I}=x();return(async function({delta:O,panZoom:R,transform:L,translateExtent:V,width:v,height:k}){if(!R||!O.x&&!O.y)return!1;let S=await R.setViewportConstrained({x:L[0]+O.x,y:L[1]+O.y,zoom:L[2]},[[0,0],[v,k]],V);return!!S&&(S.x!==L[0]||S.y!==L[1]||S.k!==L[2])})({delta:w,panZoom:M,transform:p,translateExtent:I,width:f,height:C})},setCenter:async(w,p,f)=>{let{width:C,height:M,maxZoom:I,panZoom:O}=x();if(!O)return!1;let R=f?.zoom!==void 0?f.zoom:I;return await O.setViewport({x:C/2-w*R,y:M/2-p*R,zoom:R},{duration:f?.duration,ease:f?.ease,interpolate:f?.interpolate}),!0},cancelConnection:()=>{g({connection:{...Nr}})},updateConnection:w=>{g({connection:w})},reset:()=>g({..._a()})}},m=Object.is,y?bi(y,m):bi;var y,m};function Pa({initialNodes:e,initialEdges:t,defaultNodes:n,defaultEdges:o,initialWidth:r,initialHeight:i,initialMinZoom:a,initialMaxZoom:s,initialFitViewOptions:l,fitView:c,nodeOrigin:u,nodeExtent:d,zIndexMode:h,children:y}){let[m]=_.useState(()=>yu({nodes:e,edges:t,defaultNodes:n,defaultEdges:o,width:r,height:i,fitView:c,minZoom:a,maxZoom:s,fitViewOptions:l,nodeOrigin:u,nodeExtent:d,zIndexMode:h}));return P.jsx(vl,{value:m,children:P.jsx(Dl,{children:P.jsx(Yl,{children:y})})})}function vu({children:e,nodes:t,edges:n,defaultNodes:o,defaultEdges:r,width:i,height:a,fitView:s,fitViewOptions:l,minZoom:c,maxZoom:u,nodeOrigin:d,nodeExtent:h,zIndexMode:y}){return _.useContext(bn)?P.jsx(P.Fragment,{children:e}):P.jsx(Pa,{initialNodes:t,initialEdges:n,defaultNodes:o,defaultEdges:r,initialWidth:i,initialHeight:a,fitView:s,initialFitViewOptions:l,initialMinZoom:c,initialMaxZoom:u,nodeOrigin:d,nodeExtent:h,zIndexMode:y,children:e})}let xu={width:"100%",height:"100%",overflow:"hidden",position:"relative",zIndex:0};var wu=Vi(function({nodes:e,edges:t,defaultNodes:n,defaultEdges:o,className:r,nodeTypes:i,edgeTypes:a,onNodeClick:s,onEdgeClick:l,onInit:c,onMove:u,onMoveStart:d,onMoveEnd:h,onConnect:y,onConnectStart:m,onConnectEnd:g,onClickConnectStart:x,onClickConnectEnd:b,onNodeMouseEnter:w,onNodeMouseMove:p,onNodeMouseLeave:f,onNodeContextMenu:C,onNodeDoubleClick:M,onNodeDragStart:I,onNodeDrag:O,onNodeDragStop:R,onNodesDelete:L,onEdgesDelete:V,onDelete:v,onSelectionChange:k,onSelectionDragStart:S,onSelectionDrag:N,onSelectionDragStop:z,onSelectionContextMenu:D,onSelectionStart:$,onSelectionEnd:j,onBeforeDelete:A,connectionMode:Z,connectionLineType:B=E.ConnectionLineType.Bezier,connectionLineStyle:K,connectionLineComponent:J,connectionLineContainerStyle:T,deleteKeyCode:H="Backspace",selectionKeyCode:U="Shift",selectionOnDrag:Y=!1,selectionMode:X=E.SelectionMode.Full,panActivationKeyCode:F="Space",multiSelectionKeyCode:Q=Rt()?"Meta":"Control",zoomActivationKeyCode:G=Rt()?"Meta":"Control",snapToGrid:W,snapGrid:ee,onlyRenderVisibleElements:ne=!1,selectNodesOnDrag:ie,nodesDraggable:ce,autoPanOnNodeFocus:se,nodesConnectable:te,nodesFocusable:ae,nodeOrigin:q=ki,edgesFocusable:re,edgesReconnectable:we,elementsSelectable:fe=!0,defaultViewport:ve=zl,minZoom:Ie=.5,maxZoom:ue=2,translateExtent:Ce=Pt,preventScrolling:Oe=!0,nodeExtent:ye,defaultMarkerColor:Se="#b1b1b7",zoomOnScroll:be=!0,zoomOnPinch:Me=!0,panOnScroll:jt=!1,panOnScrollSpeed:Ht=.5,panOnScrollMode:he=E.PanOnScrollMode.Free,zoomOnDoubleClick:ge=!0,panOnDrag:pe=!0,onPaneClick:Ye,onPaneMouseEnter:Fe,onPaneMouseMove:mt,onPaneMouseLeave:yt,onPaneScroll:Ne,onPaneContextMenu:ke,paneClickDistance:ko=1,nodeClickDistance:_o=0,children:ze,onReconnect:xe,onReconnectStart:Ju,onReconnectEnd:ed,onEdgeContextMenu:td,onEdgeDoubleClick:nd,onEdgeMouseEnter:od,onEdgeMouseMove:rd,onEdgeMouseLeave:id,reconnectRadius:ad=10,onNodesChange:sd,onEdgesChange:cd,noDragClassName:ld="nodrag",noWheelClassName:ud="nowheel",noPanClassName:La="nopan",fitView:$a,fitViewOptions:Ta,connectOnClick:dd,attributionPosition:hd,proOptions:fd,defaultEdgeOptions:gd,elevateNodesOnSelect:pd=!0,elevateEdgesOnSelect:md=!1,disableKeyboardA11y:Ba=!1,autoPanOnConnect:yd,autoPanOnNodeDrag:vd,autoPanOnSelection:xd=!0,autoPanSpeed:wd,connectionRadius:bd,isValidConnection:Sd,onError:Cd,style:Ed,id:Va,nodeDragThreshold:Md,connectionDragThreshold:Nd,viewport:kd,onViewportChange:_d,width:Pd,height:zd,colorMode:Id="light",debug:Od,onScroll:ja,ariaLabelConfig:Ad,zIndexMode:Ha="basic",...Dd},Rd){let Po=Va||"1",Ld=(function(Ge){let[Za,Xa]=_.useState(Ge==="system"?null:Ge);return _.useEffect(()=>{if(Ge!=="system")return void Xa(Ge);let zo=zi(),Io=()=>Xa(zo?.matches?"dark":"light");return Io(),zo?.addEventListener("change",Io),()=>{zo?.removeEventListener("change",Io)}},[Ge]),Za!==null?Za:zi()?.matches?"dark":"light"})(Id),$d=_.useCallback(Ge=>{Ge.currentTarget.scrollTo({top:0,left:0,behavior:"instant"}),ja?.(Ge)},[ja]);return P.jsx("div",{"data-testid":"rf__wrapper",...Dd,onScroll:$d,style:{...Ed,...xu},ref:Rd,className:me(["react-flow",r,Ld]),id:Va,role:"application",children:P.jsxs(vu,{nodes:e,edges:t,width:Pd,height:zd,fitView:$a,fitViewOptions:Ta,minZoom:Ie,maxZoom:ue,nodeOrigin:q,nodeExtent:ye,zIndexMode:Ha,children:[P.jsx(Ol,{nodes:e,edges:t,defaultNodes:n,defaultEdges:o,onConnect:y,onConnectStart:m,onConnectEnd:g,onClickConnectStart:x,onClickConnectEnd:b,nodesDraggable:ce,autoPanOnNodeFocus:se,nodesConnectable:te,nodesFocusable:ae,edgesFocusable:re,edgesReconnectable:we,elementsSelectable:fe,elevateNodesOnSelect:pd,elevateEdgesOnSelect:md,minZoom:Ie,maxZoom:ue,nodeExtent:ye,onNodesChange:sd,onEdgesChange:cd,snapToGrid:W,snapGrid:ee,connectionMode:Z,translateExtent:Ce,connectOnClick:dd,defaultEdgeOptions:gd,fitView:$a,fitViewOptions:Ta,onNodesDelete:L,onEdgesDelete:V,onDelete:v,onNodeDragStart:I,onNodeDrag:O,onNodeDragStop:R,onSelectionDrag:N,onSelectionDragStart:S,onSelectionDragStop:z,onMove:u,onMoveStart:d,onMoveEnd:h,noPanClassName:La,nodeOrigin:q,rfId:Po,autoPanOnConnect:yd,autoPanOnNodeDrag:vd,autoPanSpeed:wd,onError:Cd,connectionRadius:bd,isValidConnection:Sd,selectNodesOnDrag:ie,nodeDragThreshold:Md,connectionDragThreshold:Nd,onBeforeDelete:A,debug:Od,ariaLabelConfig:Ad,zIndexMode:Ha}),P.jsx(pu,{onInit:c,onNodeClick:s,onEdgeClick:l,onNodeMouseEnter:w,onNodeMouseMove:p,onNodeMouseLeave:f,onNodeContextMenu:C,onNodeDoubleClick:M,nodeTypes:i,edgeTypes:a,connectionLineType:B,connectionLineStyle:K,connectionLineComponent:J,connectionLineContainerStyle:T,selectionKeyCode:U,selectionOnDrag:Y,selectionMode:X,deleteKeyCode:H,multiSelectionKeyCode:Q,panActivationKeyCode:F,zoomActivationKeyCode:G,onlyRenderVisibleElements:ne,defaultViewport:ve,translateExtent:Ce,minZoom:Ie,maxZoom:ue,preventScrolling:Oe,zoomOnScroll:be,zoomOnPinch:Me,zoomOnDoubleClick:ge,panOnScroll:jt,panOnScrollSpeed:Ht,panOnScrollMode:he,panOnDrag:pe,autoPanOnSelection:xd,onPaneClick:Ye,onPaneMouseEnter:Fe,onPaneMouseMove:mt,onPaneMouseLeave:yt,onPaneScroll:Ne,onPaneContextMenu:ke,paneClickDistance:ko,nodeClickDistance:_o,onSelectionContextMenu:D,onSelectionStart:$,onSelectionEnd:j,onReconnect:xe,onReconnectStart:Ju,onReconnectEnd:ed,onEdgeContextMenu:td,onEdgeDoubleClick:nd,onEdgeMouseEnter:od,onEdgeMouseMove:rd,onEdgeMouseLeave:id,reconnectRadius:ad,defaultMarkerColor:Se,noDragClassName:ld,noWheelClassName:ud,noPanClassName:La,rfId:Po,disableKeyboardA11y:Ba,nodeExtent:ye,viewport:kd,onViewportChange:_d,nodesDraggable:ce}),P.jsx(Pl,{onSelectionChange:k}),ze,P.jsx(El,{proOptions:fd,position:hd}),P.jsx(Cl,{rfId:Po,disableKeyboardA11y:Ba})]})})});let bu=e=>e.domNode?.querySelector(".react-flow__edgelabel-renderer");function za({children:e}){let t=oe(bu);return t?kn.createPortal(e,t):null}let Su=e=>e.domNode?.querySelector(".react-flow__viewport-portal"),Cu=e=>e.nodes,Eu=e=>e.edges,Mu=e=>({x:e.transform[0],y:e.transform[1],zoom:e.transform[2]}),Nu=Zc();function ku({dimensions:e,lineWidth:t,variant:n,className:o}){return P.jsx("path",{strokeWidth:t,d:`M${e[0]/2} 0 V${e[1]} M0 ${e[1]/2} H${e[0]}`,className:me(["react-flow__background-pattern",n,o])})}function _u({radius:e,className:t}){return P.jsx("circle",{cx:e,cy:e,r:e,className:me(["react-flow__background-pattern","dots",t])})}var Eo;E.BackgroundVariant=void 0,(Eo=E.BackgroundVariant||(E.BackgroundVariant={})).Lines="lines",Eo.Dots="dots",Eo.Cross="cross";let Pu={[E.BackgroundVariant.Dots]:1,[E.BackgroundVariant.Lines]:1,[E.BackgroundVariant.Cross]:6},zu=e=>({transform:e.transform,patternId:`pattern-${e.rfId}`});function Ia({id:e,variant:t=E.BackgroundVariant.Dots,gap:n=20,size:o,lineWidth:r=1,offset:i=0,color:a,bgColor:s,style:l,className:c,patternClassName:u}){let d=_.useRef(null),{transform:h,patternId:y}=oe(zu,de),m=o||Pu[t],g=t===E.BackgroundVariant.Dots,x=t===E.BackgroundVariant.Cross,b=Array.isArray(n)?n:[n,n],w=[b[0]*h[2]||1,b[1]*h[2]||1],p=m*h[2],f=Array.isArray(i)?i:[i,i],C=x?[p,p]:w,M=[f[0]*h[2]+C[0]/2,f[1]*h[2]+C[1]/2],I=`${y}${e||""}`;return P.jsxs("svg",{className:me(["react-flow__background",c]),style:{...l,...En,"--xy-background-color-props":s,"--xy-background-pattern-color-props":a},ref:d,"data-testid":"rf__background",children:[P.jsx("pattern",{id:I,x:h[0]%w[0],y:h[1]%w[1],width:w[0],height:w[1],patternUnits:"userSpaceOnUse",patternTransform:`translate(-${M[0]},-${M[1]})`,children:g?P.jsx(_u,{radius:p/2,className:u}):P.jsx(ku,{dimensions:C,lineWidth:r,variant:t,className:u})}),P.jsx("rect",{x:"0",y:"0",width:"100%",height:"100%",fill:`url(#${I})`})]})}Ia.displayName="Background";let Iu=_.memo(Ia);function Ou(){return P.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",children:P.jsx("path",{d:"M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z"})})}function Au(){return P.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 5",children:P.jsx("path",{d:"M0 0h32v4.2H0z"})})}function Du(){return P.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 30",children:P.jsx("path",{d:"M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z"})})}function Ru(){return P.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 25 32",children:P.jsx("path",{d:"M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z"})})}function Lu(){return P.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 25 32",children:P.jsx("path",{d:"M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z"})})}function Vt({children:e,className:t,...n}){return P.jsx("button",{type:"button",className:me(["react-flow__controls-button",t]),...n,children:e})}let $u=e=>({isInteractive:e.nodesDraggable||e.nodesConnectable||e.elementsSelectable,minZoomReached:e.transform[2]<=e.minZoom,maxZoomReached:e.transform[2]>=e.maxZoom,ariaLabelConfig:e.ariaLabelConfig});function Oa({style:e,showZoom:t=!0,showFitView:n=!0,showInteractive:o=!0,fitViewOptions:r,onZoomIn:i,onZoomOut:a,onFitView:s,onInteractiveChange:l,className:c,children:u,position:d="bottom-left",orientation:h="vertical","aria-label":y}){let m=le(),{isInteractive:g,minZoomReached:x,maxZoomReached:b,ariaLabelConfig:w}=oe($u,de),{zoomIn:p,zoomOut:f,fitView:C}=Cn(),M=h==="horizontal"?"horizontal":"vertical";return P.jsxs($t,{className:me(["react-flow__controls",M,c]),position:d,style:e,"data-testid":"rf__controls","aria-label":y??w["controls.ariaLabel"],children:[t&&P.jsxs(P.Fragment,{children:[P.jsx(Vt,{onClick:()=>{p(),i?.()},className:"react-flow__controls-zoomin",title:w["controls.zoomIn.ariaLabel"],"aria-label":w["controls.zoomIn.ariaLabel"],disabled:b,children:P.jsx(Ou,{})}),P.jsx(Vt,{onClick:()=>{f(),a?.()},className:"react-flow__controls-zoomout",title:w["controls.zoomOut.ariaLabel"],"aria-label":w["controls.zoomOut.ariaLabel"],disabled:x,children:P.jsx(Au,{})})]}),n&&P.jsx(Vt,{className:"react-flow__controls-fitview",onClick:()=>{C(r),s?.()},title:w["controls.fitView.ariaLabel"],"aria-label":w["controls.fitView.ariaLabel"],children:P.jsx(Du,{})}),o&&P.jsx(Vt,{className:"react-flow__controls-interactive",onClick:()=>{m.setState({nodesDraggable:!g,nodesConnectable:!g,elementsSelectable:!g}),l?.(!g)},title:w["controls.interactive.ariaLabel"],"aria-label":w["controls.interactive.ariaLabel"],children:g?P.jsx(Lu,{}):P.jsx(Ru,{})}),u]})}Oa.displayName="Controls";let Tu=_.memo(Oa),Aa=_.memo(function({id:e,x:t,y:n,width:o,height:r,style:i,color:a,strokeColor:s,strokeWidth:l,className:c,borderRadius:u,shapeRendering:d,selected:h,onClick:y}){let{background:m,backgroundColor:g}=i||{},x=a||m||g;return P.jsx("rect",{className:me(["react-flow__minimap-node",{selected:h},c]),x:t,y:n,rx:u,ry:u,width:o,height:r,style:{fill:x,stroke:s,strokeWidth:l},shapeRendering:d,onClick:y?b=>y(b,e):void 0})}),Bu=e=>e.nodes.map(t=>t.id),Mo=e=>e instanceof Function?e:()=>e,Vu=_.memo(function({id:e,nodeColorFunc:t,nodeStrokeColorFunc:n,nodeClassNameFunc:o,nodeBorderRadius:r,nodeStrokeWidth:i,shapeRendering:a,NodeComponent:s,onClick:l}){let{node:c,x:u,y:d,width:h,height:y}=oe(m=>{let g=m.nodeLookup.get(e);if(!g)return{node:void 0,x:0,y:0,width:0,height:0};let x=g.internals.userNode,{x:b,y:w}=g.internals.positionAbsolute,{width:p,height:f}=$e(x);return{node:x,x:b,y:w,width:p,height:f}},de);return c&&!c.hidden&&Gn(c)?P.jsx(s,{x:u,y:d,width:h,height:y,style:c.style,selected:!!c.selected,className:o(c),color:t(c),borderRadius:r,strokeColor:n(c),strokeWidth:i,shapeRendering:a,onClick:l,id:c.id}):null});var ju=_.memo(function({nodeStrokeColor:e,nodeColor:t,nodeClassName:n="",nodeBorderRadius:o=5,nodeStrokeWidth:r,nodeComponent:i=Aa,onClick:a}){let s=oe(Bu,de),l=Mo(t),c=Mo(e),u=Mo(n),d=typeof window>"u"||window.chrome?"crispEdges":"geometricPrecision";return P.jsx(P.Fragment,{children:s.map(h=>P.jsx(Vu,{id:h,nodeColorFunc:l,nodeStrokeColorFunc:c,nodeClassNameFunc:u,nodeBorderRadius:o,nodeStrokeWidth:r,NodeComponent:i,onClick:a,shapeRendering:d},h))})});let Hu=e=>!e.hidden,Zu=e=>{let t={x:-e.transform[0]/e.transform[2],y:-e.transform[1]/e.transform[2],width:e.width/e.transform[2],height:e.height/e.transform[2]};return{viewBB:t,boundingRect:e.nodeLookup.size>0?$r(lt(e.nodeLookup,{filter:Hu}),t):t,rfId:e.rfId,panZoom:e.panZoom,translateExtent:e.translateExtent,flowWidth:e.width,flowHeight:e.height,ariaLabelConfig:e.ariaLabelConfig}},Da=(e,t)=>e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height,Xu=(e,t)=>Da(e.viewBB,t.viewBB)&&Da(e.boundingRect,t.boundingRect)&&e.rfId===t.rfId&&e.panZoom===t.panZoom&&e.translateExtent===t.translateExtent&&e.flowWidth===t.flowWidth&&e.flowHeight===t.flowHeight&&e.ariaLabelConfig===t.ariaLabelConfig;function Ra({style:e,className:t,nodeStrokeColor:n,nodeColor:o,nodeClassName:r="",nodeBorderRadius:i=5,nodeStrokeWidth:a,nodeComponent:s,bgColor:l,maskColor:c,maskStrokeColor:u,maskStrokeWidth:d,position:h="bottom-right",onClick:y,onNodeClick:m,pannable:g=!1,zoomable:x=!1,ariaLabel:b,inversePan:w,zoomStep:p=1,offsetScale:f=5}){let C=le(),M=_.useRef(null),{boundingRect:I,viewBB:O,rfId:R,panZoom:L,translateExtent:V,flowWidth:v,flowHeight:k,ariaLabelConfig:S}=oe(Zu,Xu),N=e?.width??200,z=e?.height??150,D=I.width/N,$=I.height/z,j=Math.max(D,$),A=j*N,Z=j*z,B=f*j,K=I.x-(A-I.width)/2-B,J=I.y-(Z-I.height)/2-B,T=A+2*B,H=Z+2*B,U=`react-flow__minimap-desc-${R}`,Y=_.useRef(0),X=_.useRef();Y.current=j,_.useEffect(()=>{if(M.current&&L)return X.current=(function({domNode:W,panZoom:ee,getTransform:ne,getViewScale:ie}){let ce=Pe(W);return{update:function({translateExtent:se,width:te,height:ae,zoomStep:q=1,pannable:re=!0,zoomable:we=!0,inversePan:fe=!1}){let ve=[0,0],Ie=wr().on("start",ue=>{ue.sourceEvent.type!=="mousedown"&&ue.sourceEvent.type!=="touchstart"||(ve=[ue.sourceEvent.clientX??ue.sourceEvent.touches[0].clientX,ue.sourceEvent.clientY??ue.sourceEvent.touches[0].clientY])}).on("zoom",re?ue=>{let Ce=ne();if(ue.sourceEvent.type!=="mousemove"&&ue.sourceEvent.type!=="touchmove"||!ee)return;let Oe=[ue.sourceEvent.clientX??ue.sourceEvent.touches[0].clientX,ue.sourceEvent.clientY??ue.sourceEvent.touches[0].clientY],ye=[Oe[0]-ve[0],Oe[1]-ve[1]];ve=Oe;let Se=ie()*Math.max(Ce[2],Math.log(Ce[2]))*(fe?-1:1),be={x:Ce[0]-ye[0]*Se,y:Ce[1]-ye[1]*Se},Me=[[0,0],[te,ae]];ee.setViewportConstrained({x:be.x,y:be.y,zoom:Ce[2]},Me,se)}:null).on("zoom.wheel",we?ue=>{if(ue.sourceEvent.type!=="wheel"||!ee)return;let Ce=ne(),Oe=ue.sourceEvent.ctrlKey&&Rt()?10:1,ye=-ue.sourceEvent.deltaY*(ue.sourceEvent.deltaMode===1?.05:ue.sourceEvent.deltaMode?1:.002)*q,Se=Ce[2]*Math.pow(2,ye*Oe);ee.scaleTo(Se)}:null);ce.call(Ie,{})},destroy:function(){ce.on("zoom",null)},pointer:Ae}})({domNode:M.current,panZoom:L,getTransform:()=>C.getState().transform,getViewScale:()=>Y.current}),()=>{X.current?.destroy()}},[L]),_.useEffect(()=>{X.current?.update({translateExtent:V,width:v,height:k,inversePan:w,pannable:g,zoomStep:p,zoomable:x})},[g,x,w,p,V,v,k]);let F=y?W=>{let[ee,ne]=X.current?.pointer(W)||[0,0];y(W,{x:ee,y:ne})}:void 0,Q=m?_.useCallback((W,ee)=>{let ne=C.getState().nodeLookup.get(ee).internals.userNode;m(W,ne)},[]):void 0,G=b??S["minimap.ariaLabel"];return P.jsx($t,{position:h,style:{...e,"--xy-minimap-background-color-props":typeof l=="string"?l:void 0,"--xy-minimap-mask-background-color-props":typeof c=="string"?c:void 0,"--xy-minimap-mask-stroke-color-props":typeof u=="string"?u:void 0,"--xy-minimap-mask-stroke-width-props":typeof d=="number"?d*j:void 0,"--xy-minimap-node-background-color-props":typeof o=="string"?o:void 0,"--xy-minimap-node-stroke-color-props":typeof n=="string"?n:void 0,"--xy-minimap-node-stroke-width-props":typeof a=="number"?a:void 0},className:me(["react-flow__minimap",t]),"data-testid":"rf__minimap",children:P.jsxs("svg",{width:N,height:z,viewBox:`${K} ${J} ${T} ${H}`,className:"react-flow__minimap-svg",role:"img","aria-labelledby":U,ref:M,onClick:F,children:[G&&P.jsx("title",{id:U,children:G}),P.jsx(ju,{onClick:Q,nodeColor:o,nodeStrokeColor:n,nodeBorderRadius:i,nodeClassName:r,nodeStrokeWidth:a,nodeComponent:s}),P.jsx("path",{className:"react-flow__minimap-mask",d:`M${K-B},${J-B}h${T+2*B}v${H+2*B}h${-T-2*B}z
        M${O.x},${O.y}h${O.width}v${O.height}h${-O.width}z`,fillRule:"evenodd",pointerEvents:"none"})]})})}Ra.displayName="MiniMap";let Yu=_.memo(Ra),Fu={[E.ResizeControlVariant.Line]:"right",[E.ResizeControlVariant.Handle]:"bottom-right"},No=_.memo(function({nodeId:e,position:t,variant:n=E.ResizeControlVariant.Handle,className:o,style:r,children:i,color:a,minWidth:s=10,minHeight:l=10,maxWidth:c=Number.MAX_VALUE,maxHeight:u=Number.MAX_VALUE,keepAspectRatio:d=!1,resizeDirection:h,autoScale:y=!0,shouldResize:m,onResizeStart:g,onResize:x,onResizeEnd:b}){let w=pt(),p=typeof e=="string"?e:w,f=le(),C=_.useRef(null),M=n===E.ResizeControlVariant.Handle,I=oe(_.useCallback((O=M&&y,v=>O?`${Math.max(1/v.transform[2],1)}`:void 0),[M,y]),de);var O;let R=_.useRef(null),L=t??Fu[n];_.useEffect(()=>{if(C.current&&p)return R.current||(R.current=dl({domNode:C.current,nodeId:p,getStoreItems:()=>{let{nodeLookup:v,transform:k,snapGrid:S,snapToGrid:N,nodeOrigin:z,domNode:D}=f.getState();return{nodeLookup:v,transform:k,snapGrid:S,snapToGrid:N,nodeOrigin:z,paneDomNode:D}},onChange:(v,k)=>{let{triggerNodeChanges:S,nodeLookup:N,parentLookup:z,nodeOrigin:D}=f.getState(),$=[],j={x:v.x,y:v.y},A=N.get(p);if(A&&A.expandParent&&A.parentId){let Z=A.origin??D,B=v.width??A.measured.width??0,K=v.height??A.measured.height??0,J=co([{id:A.id,parentId:A.parentId,rect:{width:B,height:K,...Vr({x:v.x??A.position.x,y:v.y??A.position.y},{width:B,height:K},A.parentId,N,Z)}}],N,z,D);$.push(...J),j.x=v.x?Math.max(Z[0]*B,v.x):void 0,j.y=v.y?Math.max(Z[1]*K,v.y):void 0}if(j.x!==void 0&&j.y!==void 0){let Z={id:p,type:"position",position:{...j}};$.push(Z)}if(v.width!==void 0&&v.height!==void 0){let Z={id:p,type:"dimensions",resizing:!0,setAttributes:!h||(h==="horizontal"?"width":"height"),dimensions:{width:v.width,height:v.height}};$.push(Z)}for(let Z of k){let B={...Z,type:"position"};$.push(B)}S($)},onEnd:({width:v,height:k})=>{let S={id:p,type:"dimensions",resizing:!1,dimensions:{width:v,height:k}};f.getState().triggerNodeChanges([S])}})),R.current.update({controlPosition:L,boundaries:{minWidth:s,minHeight:l,maxWidth:c,maxHeight:u},keepAspectRatio:d,resizeDirection:h,onResizeStart:g,onResize:x,onResizeEnd:b,shouldResize:m}),()=>{R.current?.destroy()}},[L,s,l,c,u,d,g,x,b,m]);let V=L.split("-");return P.jsx("div",{className:me(["react-flow__resize-control","nodrag",...V,n,o]),ref:C,style:{...r,scale:I,...a&&{[M?"backgroundColor":"borderColor"]:a}},children:i})}),Wu=e=>e.domNode?.querySelector(".react-flow__renderer");function Ku({children:e}){let t=oe(Wu);return t?kn.createPortal(e,t):null}let qu=(e,t)=>e?.internals.positionAbsolute.x!==t?.internals.positionAbsolute.x||e?.internals.positionAbsolute.y!==t?.internals.positionAbsolute.y||e?.measured.width!==t?.measured.width||e?.measured.height!==t?.measured.height||e?.selected!==t?.selected||e?.internals.z!==t?.internals.z,Gu=(e,t)=>{if(e.size!==t.size)return!1;for(let[n,o]of e)if(qu(o,t.get(n)))return!1;return!0},Uu=e=>({x:e.transform[0],y:e.transform[1],zoom:e.transform[2],selectedNodesCount:e.nodes.filter(t=>t.selected).length}),Qu=e=>e.transform[2];E.Background=Iu,E.BaseEdge=Bt,E.BezierEdge=pa,E.ControlButton=Vt,E.Controls=Tu,E.EdgeLabelRenderer=za,E.EdgeText=ta,E.EdgeToolbar=function({edgeId:e,x:t,y:n,children:o,className:r,style:i,isVisible:a,alignX:s="center",alignY:l="center",...c}){let u=oe(_.useCallback(g=>g.edgeLookup.get(e),[e]),de),d=typeof a=="boolean"?a:u?.selected,h=oe(Qu);if(!d)return null;let y=(u?.zIndex??0)+1,m=(function(g,x,b,w="center",p="center"){return`translate(${g}px, ${x}px) scale(${1/b}) translate(${-(Qc[w]??50)}%, ${-(Jc[p]??50)}%)`})(t,n,h,s,l);return P.jsx(za,{children:P.jsx("div",{style:{position:"absolute",transform:m,zIndex:y,pointerEvents:"all",transformOrigin:"0 0",...i},className:me(["react-flow__edge-toolbar",r]),"data-id":u?.id??"",...c,children:o})})},E.Handle=Tt,E.MiniMap=Yu,E.MiniMapNode=Aa,E.NodeResizeControl=No,E.NodeResizer=function({nodeId:e,isVisible:t=!0,handleClassName:n,handleStyle:o,lineClassName:r,lineStyle:i,color:a,minWidth:s=10,minHeight:l=10,maxWidth:c=Number.MAX_VALUE,maxHeight:u=Number.MAX_VALUE,keepAspectRatio:d=!1,autoScale:h=!0,shouldResize:y,onResizeStart:m,onResize:g,onResizeEnd:x}){return t?P.jsxs(P.Fragment,{children:[cl.map(b=>P.jsx(No,{className:r,style:i,nodeId:e,position:b,variant:E.ResizeControlVariant.Line,color:a,minWidth:s,minHeight:l,maxWidth:c,maxHeight:u,onResizeStart:m,keepAspectRatio:d,autoScale:h,shouldResize:y,onResize:g,onResizeEnd:x},b)),sl.map(b=>P.jsx(No,{className:n,style:o,nodeId:e,position:b,color:a,minWidth:s,minHeight:l,maxWidth:c,maxHeight:u,onResizeStart:m,keepAspectRatio:d,autoScale:h,shouldResize:y,onResize:g,onResizeEnd:x},b))]}):null},E.NodeToolbar=function({nodeId:e,children:t,className:n,style:o,isVisible:r,position:i=E.Position.Top,offset:a=10,align:s="center",...l}){let c=pt(),u=_.useCallback(f=>(Array.isArray(e)?e:[e||c||""]).reduce((M,I)=>{let O=f.nodeLookup.get(I);return O&&M.set(O.id,O),M},new Map),[e,c]),d=oe(u,Gu),{x:h,y,zoom:m,selectedNodesCount:g}=oe(Uu,de);if(!(typeof r=="boolean"?r:d.size===1&&d.values().next().value?.selected&&g===1)||!d.size)return null;let x=lt(d),b=Array.from(d.values()),w=Math.max(...b.map(f=>f.internals.z+1)),p={position:"absolute",transform:Uc(x,{x:h,y,zoom:m},i,a,s),zIndex:w,...o};return P.jsx(Ku,{children:P.jsx("div",{style:p,className:me(["react-flow__node-toolbar",n]),...l,"data-id":b.reduce((f,C)=>`${f}${C.id} `,"").trim(),children:t})})},E.Panel=$t,E.ReactFlow=wu,E.ReactFlowProvider=Pa,E.SimpleBezierEdge=ra,E.SmoothStepEdge=Co,E.StepEdge=la,E.StraightEdge=ha,E.ViewportPortal=function({children:e}){let t=oe(Su);return t?kn.createPortal(e,t):null},E.addEdge=Ti,E.applyEdgeChanges=yo,E.applyNodeChanges=mo,E.experimental_useOnEdgesChangeMiddleware=function(e){let t=le(),[n]=_.useState(()=>Symbol());_.useEffect(()=>{let{onEdgesChangeMiddlewareMap:o}=t.getState();o.set(n,e)},[e]),_.useEffect(()=>{let{onEdgesChangeMiddlewareMap:o}=t.getState();return()=>{o.delete(n)}},[])},E.experimental_useOnNodesChangeMiddleware=function(e){let t=le(),[n]=_.useState(()=>Symbol());_.useEffect(()=>{let{onNodesChangeMiddlewareMap:o}=t.getState();o.set(n,e)},[e]),_.useEffect(()=>{let{onNodesChangeMiddlewareMap:o}=t.getState();return()=>{o.delete(n)}},[])},E.getBezierEdgeCenter=Qn,E.getBezierPath=Jn,E.getConnectedEdges=Ar,E.getEdgeCenter=eo,E.getIncomers=(e,t,n)=>{if(!e.id)return[];let o=new Set;return n.forEach(r=>{r.target===e.id&&o.add(r.source)}),t.filter(r=>o.has(r.id))},E.getNodesBounds=Or,E.getOutgoers=(e,t,n)=>{if(!e.id)return[];let o=new Set;return n.forEach(r=>{r.source===e.id&&o.add(r.target)}),t.filter(r=>o.has(r.id))},E.getSimpleBezierPath=So,E.getSmoothStepPath=vn,E.getStraightPath=to,E.getViewportForBounds=mn,E.isEdge=Bi,E.isNode=vo,E.reconnectEdge=function(e,t,n,o={shouldReplaceId:!0}){return((r,i,a,s={shouldReplaceId:!0})=>{let{id:l,...c}=r;if(!i.source||!i.target)return s.onError?.("006",br()),a;if(!a.find(h=>h.id===r.id))return s.onError?.("007",$c(l)),a;let u=s.getEdgeId||Wr,d={...c,id:s.shouldReplaceId?u(i):l,source:i.source,target:i.target,sourceHandle:i.sourceHandle,targetHandle:i.targetHandle};return a.filter(h=>h.id!==l).concat(d)})(e,t,n,{...o,onError:o.onError??$i})},E.useConnection=Ea,E.useEdges=function(){return oe(Eu,de)},E.useEdgesState=function(e){let[t,n]=_.useState(e),o=_.useCallback(r=>n(i=>yo(r,i)),[]);return[t,n,o]},E.useHandleConnections=function({type:e,id:t,nodeId:n,onConnect:o,onDisconnect:r}){console.warn("[DEPRECATED] `useHandleConnections` is deprecated. Instead use `useNodeConnections` https://reactflow.dev/api-reference/hooks/useNodeConnections");let i=pt(),a=n??i,s=_.useRef(null),l=oe(c=>c.connectionLookup.get(`${a}-${e}${t?`-${t}`:""}`),Pr);return _.useEffect(()=>{if(s.current&&s.current!==l){let c=l??new Map;dn(s.current,c,r),dn(c,s.current,o)}s.current=l??new Map},[l,o,r]),_.useMemo(()=>Array.from(l?.values()??[]),[l])},E.useInternalNode=function(e){return oe(_.useCallback(t=>t.nodeLookup.get(e),[e]),de)},E.useKeyPress=ft,E.useNodeConnections=function({id:e,handleType:t,handleId:n,onConnect:o,onDisconnect:r}={}){let i=pt(),a=e??i;if(!a)throw new Error(Nu);let s=_.useRef(null),l=oe(c=>c.connectionLookup.get(`${a}${t?n?`-${t}-${n}`:`-${t}`:""}`),Pr);return _.useEffect(()=>{if(s.current&&s.current!==l){let c=l??new Map;dn(s.current,c,r),dn(c,s.current,o)}s.current=l??new Map},[l,o,r]),_.useMemo(()=>Array.from(l?.values()??[]),[l])},E.useNodeId=pt,E.useNodes=function(){return oe(Cu,de)},E.useNodesData=function(e){return oe(_.useCallback(t=>{let n=[],o=Array.isArray(e),r=o?e:[e];for(let i of r){let a=t.nodeLookup.get(i);a&&n.push({id:a.id,type:a.type,data:a.data})}return o?n:n[0]??null},[e]),nl)},E.useNodesInitialized=function(e={includeHiddenNodes:!1}){return oe((t=>n=>{if(!t.includeHiddenNodes)return n.nodesInitialized;if(n.nodeLookup.size===0)return!1;for(let[,{internals:o}]of n.nodeLookup)if(o.handleBounds===void 0||!Gn(o.userNode))return!1;return!0})(e))},E.useNodesState=function(e){let[t,n]=_.useState(e),o=_.useCallback(r=>n(i=>mo(r,i)),[]);return[t,n,o]},E.useOnSelectionChange=function({onChange:e}){let t=le();_.useEffect(()=>{let n=[...t.getState().onSelectionChangeHandlers,e];return t.setState({onSelectionChangeHandlers:n}),()=>{let o=t.getState().onSelectionChangeHandlers.filter(r=>r!==e);t.setState({onSelectionChangeHandlers:o})}},[e])},E.useOnViewportChange=function({onStart:e,onChange:t,onEnd:n}){let o=le();_.useEffect(()=>{o.setState({onViewportChangeStart:e})},[e]),_.useEffect(()=>{o.setState({onViewportChange:t})},[t]),_.useEffect(()=>{o.setState({onViewportChangeEnd:n})},[n])},E.useReactFlow=Cn,E.useStore=oe,E.useStoreApi=le,E.useUpdateNodeInternals=function(){let e=le();return _.useCallback(t=>{let{domNode:n,updateNodeInternals:o}=e.getState(),r=Array.isArray(t)?t:[t],i=new Map;r.forEach(a=>{let s=n?.querySelector(`.react-flow__node[data-id="${a}"]`);s&&i.set(a,{id:a,nodeElement:s,force:!0})}),requestAnimationFrame(()=>o(i,{triggerFitView:!1}))},[])},E.useViewport=function(){return oe(Mu,de)}})});module.exports=Fa();
/*! Bundled license information:

@xyflow/react/dist/umd/index.js:
  (**
     * @license React
     * use-sync-external-store-shim/with-selector.production.js
     *
     * Copyright (c) Meta Platforms, Inc. and affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     *)
*/

      return module.exports
    })()
    const plugin = (function createClientPlugin(React, XYFlow, XYFLOW_STYLES) {
  const {
    Background,
    BackgroundVariant,
    Controls,
    Handle,
    MarkerType,
    MiniMap,
    Panel,
    Position,
    ReactFlow,
    useEdgesState,
    useNodesState,
  } = XYFlow
  const API_PATH = '/_dddrop/pavo'
  const STYLE_ID = '@dddrop/dsh-plugin-pavo/styles'
  const WATER_LEVEL_PATTERN = /^(\d+)(?:\.(\d+))?$/u
  const ROOT_WORKFLOW_ID = 'root'
  const STYLES = [
    '.pavo-root{box-sizing:border-box;display:flex;flex-direction:column;height:100%;min-height:0;overflow:hidden;padding:14px 18px;color:inherit}',
    '.pavo-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 0 12px}',
    '.pavo-heading{display:flex;align-items:baseline;gap:10px;min-width:0}',
    '.pavo-title{font-size:16px;font-weight:650;letter-spacing:-.01em}',
    '.pavo-status{font-size:12px;opacity:.62}',
    '.pavo-toolbar-actions{display:flex;align-items:center;gap:8px}',
    '.pavo-view-switch{display:inline-flex;border:1px solid rgba(128,128,128,.28);border-radius:9px;padding:2px;background:rgba(128,128,128,.055)}',
    '.pavo-view-switch button{min-height:30px;border:0;border-radius:6px;background:transparent;color:inherit;padding:4px 10px;cursor:pointer;font:inherit;font-size:12px;font-weight:620;opacity:.58}',
    '.pavo-view-switch button:hover{opacity:.9}',
    '.pavo-view-switch button[aria-pressed="true"]{background:rgba(80,120,255,.16);color:#2f5fc7;opacity:1}',
    '.pavo-field{display:grid;gap:6px;min-width:0}',
    '.pavo-field>span{font-size:11px;font-weight:650;opacity:.68}',
    '.pavo-input,.pavo-textarea,.pavo-select,.pavo-button{box-sizing:border-box;border:1px solid rgba(128,128,128,.34);border-radius:8px;background:transparent;color:inherit;font:inherit;font-size:13px}',
    '.pavo-input,.pavo-select,.pavo-button{min-height:36px}',
    '.pavo-input,.pavo-textarea{min-width:0;padding:7px 10px;outline:none}',
    '.pavo-textarea{min-height:160px;resize:vertical;line-height:1.5}',
    '.pavo-input:focus,.pavo-textarea:focus,.pavo-select:focus{border-color:rgba(80,120,255,.75);box-shadow:0 0 0 2px rgba(80,120,255,.12);outline:none}',
    '.pavo-select{width:100%;padding:5px 30px 5px 9px}',
    '.pavo-button{cursor:pointer;padding:5px 12px;font-weight:600;white-space:nowrap}',
    '.pavo-button:hover:not(:disabled){background:rgba(128,128,128,.1)}',
    '.pavo-button:active:not(:disabled){transform:translateY(1px)}',
    '.pavo-button:disabled{cursor:not-allowed;opacity:.45}',
    '.pavo-button-primary{border-color:#2f5fc7;background:#2f5fc7;color:#fff}',
    '.pavo-button-primary:hover:not(:disabled){background:#2854b2}',
    '.pavo-button-danger{color:#d85c5c}',
    '.pavo-error{margin:0 0 12px;border:1px solid rgba(220,70,70,.4);border-radius:8px;padding:8px 10px;color:#d85c5c;font-size:13px}',
    '.pavo-notice{margin:0 0 12px;border:1px solid rgba(128,128,128,.25);border-radius:8px;padding:9px 11px;font-size:12px;opacity:.75}',
    '.pavo-loading{padding:20px 0;font-size:13px;opacity:.68}',
    '.pavo-board{display:flex;align-items:stretch;gap:10px;flex:1;min-height:0;overflow-x:auto;padding:0 0 10px}',
    '.pavo-column{display:flex;flex:0 0 280px;flex-direction:column;min-height:0;border:1px solid rgba(128,128,128,.28);border-radius:12px;background:rgba(128,128,128,.045);padding:9px;transition:border-color .15s,background .15s}',
    '.pavo-column.pavo-drop-allowed{border-color:rgba(80,120,255,.58);background:rgba(80,120,255,.07)}',
    '.pavo-column.pavo-drop-blocked{opacity:.58}',
    '.pavo-column-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:2px 5px 9px;font-size:13px;font-weight:620}',
    '.pavo-count{display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;border-radius:10px;background:rgba(128,128,128,.12);font-size:11px;font-weight:560;opacity:.7}',
    '.pavo-work-list{flex:1;min-height:46px;overflow-y:auto}',
    '.pavo-work{margin-bottom:8px;border:1px solid rgba(128,128,128,.27);border-radius:9px;background:rgba(128,128,128,.075);padding:0;cursor:grab;font-size:13px;transition:border-color .15s,background .15s,transform .15s}',
    '.pavo-work:hover{border-color:rgba(80,120,255,.42);background:rgba(128,128,128,.11)}',
    '.pavo-work:active{cursor:grabbing}',
    '.pavo-work-open{display:block;width:100%;border:0;background:transparent;color:inherit;padding:10px;text-align:left;cursor:pointer;font:inherit}',
    '.pavo-work-open:focus-visible{outline:2px solid rgba(80,120,255,.75);outline-offset:2px;border-radius:8px}',
    '.pavo-work-copy{display:grid;gap:7px;min-width:0}',
    '.pavo-work-kicker{display:flex;align-items:center;gap:6px;font-size:10px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;opacity:.62}',
    '.pavo-work-workspace{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.pavo-work-key{border:1px solid rgba(128,128,128,.25);border-radius:5px;padding:1px 4px}',
    '.pavo-work-title{font-weight:620;line-height:1.4;overflow-wrap:anywhere}',
    '.pavo-work-body{margin:0;max-height:120px;overflow:hidden;white-space:pre-wrap;font:inherit;font-size:12px;line-height:1.45;opacity:.76}',
    '.pavo-work-meta{display:flex;flex-wrap:wrap;gap:5px 9px;font-size:11px;opacity:.68}',
    '.pavo-work-id{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:9px;opacity:.42}',
    '.pavo-flow-shell{display:flex;flex:1;min-height:0;flex-direction:column;gap:9px}',
    '.pavo-flow-breadcrumbs{display:flex;align-items:center;gap:5px;min-height:30px;overflow-x:auto;font-size:12px}',
    '.pavo-flow-breadcrumbs button{border:0;background:transparent;color:inherit;padding:4px 5px;cursor:pointer;font:inherit;font-weight:620;opacity:.58;white-space:nowrap}',
    '.pavo-flow-breadcrumbs button:hover{opacity:1}',
    '.pavo-flow-breadcrumbs button[aria-current="page"]{cursor:default;opacity:1}',
    '.pavo-flow-breadcrumb-separator{opacity:.3}',
    '.pavo-flow{display:grid;grid-template-columns:minmax(0,1fr) 308px;gap:12px;flex:1;min-height:0;overflow:hidden}',
    '.pavo-flow-canvas{position:relative;min-width:0;overflow:hidden;border:1px solid rgba(128,128,128,.24);border-radius:14px;background:rgba(128,128,128,.025)}',
    '.pavo-flow-canvas .react-flow{color:inherit;--xy-edge-stroke:#7d91bf;--xy-edge-stroke-width:1.6;--xy-edge-stroke-selected:#2f5fc7;--xy-connectionline-stroke:#2f5fc7;--xy-handle-background-color:#2f5fc7;--xy-handle-border-color:Canvas;--xy-minimap-background-color:Canvas;--xy-minimap-mask-background-color:rgba(80,120,255,.08)}',
    '.pavo-flow-canvas .react-flow__pane{cursor:grab}',
    '.pavo-flow-canvas .react-flow__pane.dragging{cursor:grabbing}',
    '.pavo-flow-canvas .react-flow__edge-path{transition:stroke .16s,stroke-width .16s}',
    '.pavo-flow-canvas .react-flow__edge.selected .react-flow__edge-path,.pavo-flow-canvas .react-flow__edge:focus .react-flow__edge-path{stroke:#2f5fc7;stroke-width:2.4}',
    '.pavo-flow-canvas .react-flow__controls{overflow:hidden;border:1px solid rgba(128,128,128,.24);border-radius:9px;box-shadow:none}',
    '.pavo-flow-canvas .react-flow__controls-button{border:0;border-bottom:1px solid rgba(128,128,128,.18);background:Canvas;color:CanvasText}',
    '.pavo-flow-canvas .react-flow__controls-button:hover{background:rgba(80,120,255,.1)}',
    '.pavo-flow-canvas .react-flow__minimap{overflow:hidden;border:1px solid rgba(128,128,128,.2);border-radius:9px;box-shadow:none}',
    '.pavo-flow-panel{display:flex;align-items:center;gap:8px;border:1px solid rgba(128,128,128,.22);border-radius:9px;background:Canvas;padding:6px 8px;color:CanvasText;font-size:11px}',
    '.pavo-flow-panel strong{font-size:12px;font-weight:680}',
    '.pavo-flow-panel span{opacity:.56}',
    '.pavo-work-node{position:relative;width:218px;overflow:hidden;border:1px solid rgba(128,128,128,.3);border-radius:12px;background:Canvas;color:CanvasText;box-shadow:0 8px 24px rgba(25,48,92,.08);transition:border-color .16s,box-shadow .16s,transform .16s}',
    '.pavo-work-node:hover{border-color:rgba(80,120,255,.6);box-shadow:0 10px 28px rgba(25,48,92,.13)}',
    '.pavo-work-node:focus-visible{border-color:#2f5fc7;box-shadow:0 0 0 3px rgba(47,95,199,.18);outline:none}',
    '.pavo-work-node.pavo-work-node-selected{border-color:#2f5fc7;box-shadow:0 0 0 2px rgba(47,95,199,.13),0 12px 30px rgba(25,48,92,.15)}',
    '.pavo-work-node-accent{height:3px;background:#2f5fc7;opacity:.28}',
    '.pavo-work-node-selected .pavo-work-node-accent{opacity:1}',
    '.pavo-work-node-body{display:grid;gap:11px;padding:13px 14px 12px}',
    '.pavo-work-node-topline{display:flex;align-items:center;justify-content:space-between;gap:10px}',
    '.pavo-work-node-index{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;font-weight:700;letter-spacing:.08em;opacity:.42}',
    '.pavo-work-node-count{display:inline-flex;align-items:center;justify-content:center;min-width:25px;height:20px;border-radius:10px;background:rgba(80,120,255,.12);color:#2f5fc7;font-size:10px;font-weight:750}',
    '.pavo-work-node-title{font-size:14px;font-weight:680;letter-spacing:-.015em;line-height:1.25}',
    '.pavo-work-node-metrics{display:grid;grid-template-columns:1fr auto;align-items:center;gap:10px}',
    '.pavo-work-node-progress{height:3px;overflow:hidden;border-radius:2px;background:rgba(128,128,128,.16)}',
    '.pavo-work-node-progress span{display:block;height:100%;border-radius:inherit;background:#2f5fc7}',
    '.pavo-work-node-exits{font-size:10px;opacity:.52}',
    '.pavo-work-node .react-flow__handle{width:8px;height:8px;border:2px solid Canvas;background:#2f5fc7}',
    '.pavo-workflow-node{position:relative;width:238px;overflow:hidden;border:1px solid rgba(96,118,158,.38);border-radius:14px;background:Canvas;color:CanvasText;box-shadow:0 8px 24px rgba(25,48,92,.08);cursor:pointer;transition:border-color .16s,box-shadow .16s,transform .16s}',
    '.pavo-workflow-node:hover,.pavo-workflow-node-selected{border-color:#7656b5;box-shadow:0 0 0 2px rgba(118,86,181,.12),0 12px 30px rgba(41,27,73,.14)}',
    '.pavo-workflow-node-accent{height:4px;background:#7656b5}',
    '.pavo-workflow-node-body{display:grid;gap:10px;padding:15px}',
    '.pavo-workflow-node-kicker{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:9px;font-weight:750;letter-spacing:.08em;text-transform:uppercase;color:#7656b5}',
    '.pavo-workflow-node-title{font-size:15px;font-weight:700;line-height:1.3;letter-spacing:-.015em}',
    '.pavo-workflow-node-meta{font-size:10px;opacity:.56}',
    '.pavo-work-type{display:inline-flex;align-items:center;gap:5px;font-size:9px;font-weight:720;letter-spacing:.06em;text-transform:uppercase;opacity:.58}',
    '.pavo-work-type::before{content:"";width:6px;height:6px;border-radius:2px;background:#2f5fc7}',
    '.pavo-work-type-ongoing::before{border-radius:50%}',
    '.pavo-work-level{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;font-variant-numeric:tabular-nums;opacity:.56}',
    '.pavo-dependency-state{display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:650}',
    '.pavo-dependency-state::before{content:"";width:6px;height:6px;border-radius:50%;background:#76907e}',
    '.pavo-dependency-state-changed::before{background:#c28a34}',
    '.pavo-dependency-state-rollback::before{background:#c65d5d}',
    '.pavo-flow-detail{display:flex;min-height:0;flex-direction:column;border:1px solid rgba(128,128,128,.22);border-radius:14px;background:rgba(128,128,128,.025);overflow:hidden}',
    '.pavo-flow-detail-head{display:grid;gap:10px;border-bottom:1px solid rgba(128,128,128,.18);padding:15px}',
    '.pavo-flow-detail-kicker{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.5}',
    '.pavo-flow-detail-title{display:grid;gap:4px}',
    '.pavo-flow-detail-title strong{font-size:16px;letter-spacing:-.02em}',
    '.pavo-flow-detail-title span{font-size:11px;line-height:1.45;opacity:.58}',
    '.pavo-flow-route-list{display:flex;flex-wrap:wrap;gap:6px}',
    '.pavo-flow-route{border-radius:6px;background:rgba(80,120,255,.1);padding:4px 6px;color:#2f5fc7;font-size:10px;font-weight:650}',
    '.pavo-flow-card-list{display:grid;align-content:start;gap:7px;overflow-y:auto;padding:10px}',
    '.pavo-flow-card{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;width:100%;border:1px solid transparent;border-radius:9px;background:rgba(128,128,128,.065);color:inherit;padding:10px;text-align:left;cursor:pointer;font:inherit}',
    '.pavo-flow-card:hover,.pavo-flow-card:focus-visible{border-color:rgba(80,120,255,.52);background:rgba(80,120,255,.07);outline:none}',
    '.pavo-flow-card-copy{display:grid;gap:4px;min-width:0}',
    '.pavo-flow-card small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:9px;font-weight:720;letter-spacing:.05em;opacity:.52}',
    '.pavo-flow-card span{font-size:12px;font-weight:620;line-height:1.4}',
    '.pavo-flow-card-arrow{align-self:center;font-size:14px;opacity:.32}',
    '.pavo-flow-empty{margin:10px;border:1px dashed rgba(128,128,128,.28);border-radius:9px;padding:18px;font-size:12px;line-height:1.5;opacity:.6}',
    '.pavo-flow-work-copy{display:grid;gap:8px;padding:14px 15px;overflow-y:auto}',
    '.pavo-flow-description{margin:0;white-space:pre-wrap;font-size:12px;line-height:1.55;opacity:.72}',
    '.pavo-upstream-list{display:grid;gap:7px;margin:0;padding:0;list-style:none}',
    '.pavo-upstream-row{display:grid;gap:7px;border:1px solid rgba(128,128,128,.2);border-radius:9px;padding:9px}',
    '.pavo-upstream-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}',
    '.pavo-upstream-title{display:grid;gap:2px;min-width:0;font-size:11px}',
    '.pavo-upstream-title strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.pavo-upstream-title span{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:9px;opacity:.48}',
    '.pavo-upstream-levels{display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:10px;opacity:.68}',
    '.pavo-upstream-actions{display:flex;gap:6px}',
    '.pavo-upstream-actions .pavo-button{min-height:28px;padding:3px 8px;font-size:10px}',
    '.pavo-dependency-editor{display:grid;gap:9px;border-top:1px solid rgba(128,128,128,.2);padding-top:16px}',
    '.pavo-dependency-editor-head{display:grid;gap:3px}',
    '.pavo-dependency-editor-head strong{font-size:12px}',
    '.pavo-dependency-editor-head span{font-size:11px;line-height:1.45;opacity:.58}',
    '.pavo-dependency-choice{display:grid;grid-template-columns:auto minmax(0,1fr) 104px;align-items:center;gap:8px;border:1px solid rgba(128,128,128,.2);border-radius:8px;padding:8px}',
    '.pavo-dependency-choice label{display:grid;gap:2px;min-width:0;cursor:pointer}',
    '.pavo-dependency-choice strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px}',
    '.pavo-dependency-choice small{font-size:9px;opacity:.5}',
    '.pavo-drawer-backdrop{position:fixed;inset:0;z-index:900;background:rgba(12,16,24,.42);animation:pavo-fade-in .18s ease-out}',
    '.pavo-drawer{position:absolute;inset:0 0 0 auto;display:flex;width:min(480px,100vw);box-sizing:border-box;flex-direction:column;border-left:1px solid rgba(128,128,128,.28);background:var(--color-background,Canvas);color:inherit;box-shadow:-18px 0 54px rgba(0,0,0,.24);animation:pavo-drawer-in .22s cubic-bezier(.2,.8,.2,1)}',
    '.pavo-drawer-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;border-bottom:1px solid rgba(128,128,128,.22);padding:18px 20px 16px}',
    '.pavo-drawer-heading{display:grid;gap:4px;min-width:0}',
    '.pavo-drawer-eyebrow{font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;opacity:.55}',
    '.pavo-drawer-title{margin:0;font-size:20px;line-height:1.25;letter-spacing:-.02em}',
    '.pavo-drawer-close{display:inline-flex;align-items:center;justify-content:center;min-width:58px;height:34px;flex:none;padding:0 10px;border:1px solid rgba(128,128,128,.28);border-radius:8px;background:transparent;color:inherit;cursor:pointer;font-size:20px;line-height:1}',
    '.pavo-drawer-close:hover{background:rgba(128,128,128,.1)}',
    '.pavo-drawer-content{flex:1;min-height:0;overflow-y:auto;padding:20px}',
    '.pavo-drawer-form{display:grid;gap:16px}',
    '.pavo-drawer-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}',
    '.pavo-drawer-meta{display:grid;gap:10px;border-top:1px solid rgba(128,128,128,.2);padding-top:16px}',
    '.pavo-drawer-meta-row{display:grid;grid-template-columns:88px minmax(0,1fr);gap:12px;font-size:12px;line-height:1.45}',
    '.pavo-drawer-meta-label{font-weight:650;opacity:.55}',
    '.pavo-drawer-id{overflow-wrap:anywhere;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;opacity:.68}',
    '.pavo-drawer-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;border-top:1px solid rgba(128,128,128,.22);padding:14px 20px}',
    '.pavo-drawer-footer-end{display:flex;justify-content:flex-end;gap:8px;margin-left:auto}',
    '.pavo-template-list{display:grid;gap:10px}',
    '.pavo-template-row{display:grid;gap:10px;border:1px solid rgba(128,128,128,.24);border-radius:11px;padding:12px;background:rgba(128,128,128,.035)}',
    '.pavo-template-row-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}',
    '.pavo-template-row-title{display:grid;gap:3px;min-width:0}',
    '.pavo-template-row-title strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}',
    '.pavo-template-row-title span{font-size:10px;opacity:.56}',
    '.pavo-template-kind{display:inline-flex;border-radius:999px;padding:3px 7px;background:rgba(118,86,181,.12);color:#7656b5;font-size:9px;font-weight:750;letter-spacing:.05em;text-transform:uppercase}',
    '.pavo-template-row-actions{display:flex;flex-wrap:wrap;gap:6px}',
    '.pavo-template-row-actions .pavo-button{min-height:30px;padding:3px 8px;font-size:10px}',
    '.pavo-template-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px}',
    '.pavo-template-summary{border:1px solid rgba(118,86,181,.22);border-radius:10px;padding:10px;background:rgba(118,86,181,.055);font-size:11px;line-height:1.5}',
    '.pavo-settings{box-sizing:border-box;display:grid;align-content:start;gap:18px;width:min(680px,100%);padding:4px 2px 24px;color:inherit}',
    '.pavo-settings h2{margin:0;font-size:22px;letter-spacing:-.02em}',
    '.pavo-settings-copy{margin:-8px 0 0;font-size:13px;line-height:1.55;opacity:.68}',
    '.pavo-settings-section{display:grid;gap:14px;border-top:1px solid rgba(128,128,128,.2);padding-top:18px}',
    '.pavo-settings-section:first-of-type{border-top:0;padding-top:0}',
    '.pavo-settings-section h3{margin:0;font-size:15px;letter-spacing:-.01em}',
    '.pavo-settings-section>p{margin:-8px 0 0;font-size:12px;line-height:1.5;opacity:.62}',
    '.pavo-settings-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}',
    '.pavo-settings-span{grid-column:1/-1}',
    '.pavo-checks{display:flex;flex-wrap:wrap;gap:10px 18px}',
    '.pavo-check{display:inline-flex;align-items:center;gap:7px;font-size:12px;cursor:pointer}',
    '.pavo-check input{accent-color:#2f5fc7}',
    '.pavo-settings-actions{display:flex;align-items:center;justify-content:space-between;gap:12px}',
    '.pavo-settings-saved{font-size:12px;color:#438a61}',
    '.pavo-settings-warning{border:1px solid rgba(210,145,45,.35);border-radius:9px;padding:10px 11px;font-size:12px;line-height:1.45;color:#b47b28}',
    '.pavo-workspace-list{display:grid;gap:8px;margin:0;padding:0;list-style:none}',
    '.pavo-workspace-row{display:flex;align-items:center;justify-content:space-between;gap:12px;border:1px solid rgba(128,128,128,.25);border-radius:9px;padding:9px 10px}',
    '.pavo-workspace-row small{opacity:.62}',
    '.pavo-workspace-empty{border:1px dashed rgba(128,128,128,.3);border-radius:9px;padding:16px;font-size:13px;opacity:.62}',
    '.pavo-snackbar{position:fixed;right:22px;bottom:22px;z-index:1000;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:start;gap:10px;width:min(380px,calc(100vw - 32px));box-sizing:border-box;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:rgba(30,30,32,.96);box-shadow:0 14px 38px rgba(0,0,0,.28);padding:12px 13px;color:#fff;animation:pavo-snackbar-in .18s ease-out}',
    '.pavo-snackbar-icon{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:#d85c5c;color:#fff;font-size:12px;font-weight:750}',
    '.pavo-snackbar-copy{display:grid;gap:2px;min-width:0}',
    '.pavo-snackbar-title{font-size:13px;font-weight:650;line-height:1.35}',
    '.pavo-snackbar-message{font-size:12px;line-height:1.45;color:rgba(255,255,255,.7)}',
    '.pavo-snackbar-close{border:0;background:transparent;color:#fff;cursor:pointer;font-size:17px;line-height:1;opacity:.55;padding:1px 2px}',
    '.pavo-snackbar-close:hover{opacity:1}',
    '@keyframes pavo-snackbar-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}',
    '@keyframes pavo-fade-in{from{opacity:0}to{opacity:1}}',
    '@keyframes pavo-drawer-in{from{transform:translateX(100%)}to{transform:translateX(0)}}',
    '@media(prefers-reduced-motion:reduce){.pavo-snackbar,.pavo-drawer-backdrop,.pavo-drawer{animation:none}.pavo-work{transition:none}}',
    '@media(max-width:720px){.pavo-root{padding:12px}.pavo-column{flex-basis:84vw}.pavo-toolbar{align-items:flex-start;flex-wrap:wrap}.pavo-heading{display:grid;gap:2px}.pavo-toolbar-actions{width:100%;justify-content:space-between}.pavo-flow{grid-template-columns:1fr;overflow-y:auto}.pavo-flow-canvas{min-height:420px}.pavo-flow-detail{min-height:280px}.pavo-settings-grid{grid-template-columns:1fr}.pavo-settings-span{grid-column:auto}.pavo-drawer-grid{grid-template-columns:1fr}.pavo-drawer-header,.pavo-drawer-content,.pavo-drawer-footer{padding-left:16px;padding-right:16px}.pavo-snackbar{right:16px;bottom:16px}}',
  ].join('\n')

  async function request(method, args) {
    const response = await fetch(API_PATH, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ method, args }),
    })
    const payload = await response.json().catch(() => null)

    if (!response.ok || payload?.ok !== true) {
      throw new Error(payload?.error || `Pavo request failed (${response.status}).`)
    }
    return payload.value
  }

  function compareWaterLevels(left, right) {
    const normalize = (value) => {
      const match = WATER_LEVEL_PATTERN.exec(String(value).trim())
      if (!match) return ['0', '']
      return [match[1].replace(/^0+(?=\d)/u, ''), (match[2] || '').replace(/0+$/u, '')]
    }
    const [leftInteger, leftFraction] = normalize(left)
    const [rightInteger, rightFraction] = normalize(right)
    if (leftInteger.length !== rightInteger.length) {
      return leftInteger.length < rightInteger.length ? -1 : 1
    }
    if (leftInteger !== rightInteger) return leftInteger < rightInteger ? -1 : 1
    const width = Math.max(leftFraction.length, rightFraction.length)
    const paddedLeft = leftFraction.padEnd(width, '0')
    const paddedRight = rightFraction.padEnd(width, '0')
    return paddedLeft === paddedRight ? 0 : paddedLeft < paddedRight ? -1 : 1
  }

  function dependencyState(current, acknowledged) {
    const comparison = compareWaterLevels(current, acknowledged)
    return comparison > 0 ? 'changed' : comparison < 0 ? 'rollback' : 'synchronized'
  }

  function emptyDraft(workspaceId = '', workflowId = ROOT_WORKFLOW_ID) {
    return {
      type: 'goal',
      workspaceId,
      workflowId,
      key: '',
      title: '',
      description: '',
      assignee: { kind: 'unassigned' },
      waterLevel: '0',
      upstreamWaterLevels: {},
    }
  }

  function isValidDraft(draft) {
    return (
      ['goal', 'ongoing'].includes(draft.type) &&
      draft.title.trim().length > 0 &&
      WATER_LEVEL_PATTERN.test(draft.waterLevel.trim()) &&
      Object.values(draft.upstreamWaterLevels).every((value) =>
        WATER_LEVEL_PATTERN.test(value.trim()),
      )
    )
  }

  function workMatchesDraft(work, draft) {
    if (!work) return false
    const fields = [
      'type',
      'workspaceId',
      'legacyWorkspaceTitle',
      'workflowId',
      'key',
      'title',
      'description',
      'waterLevel',
    ]
    if (fields.some((name) => work[name] !== draft[name])) return false
    if (JSON.stringify(work.assignee) !== JSON.stringify(draft.assignee)) return false
    const left = Object.entries(work.upstreamWaterLevels)
    const right = Object.entries(draft.upstreamWaterLevels)
    return (
      left.length === right.length &&
      left.every(([id, value]) => draft.upstreamWaterLevels[id] === value)
    )
  }

  function field(label, control, className = '') {
    return React.createElement(
      'label',
      { className: `pavo-field${className ? ` ${className}` : ''}` },
      React.createElement('span', null, label),
      control,
    )
  }

  const LEGACY_WORKSPACE_VALUE = '__pavo_legacy_workspace__'

  function workspaceRosterLabel(workspace, workspaces) {
    const duplicateTitle = workspaces.some(
      (candidate) =>
        candidate.id !== workspace.id && candidate.title === workspace.title,
    )
    return `${workspace.title}${duplicateTitle ? ` · ${workspace.id}` : ''}${workspace.unavailable ? ' · unavailable' : ''}`
  }

  function workspaceLabel(work, workspaces) {
    if (work?.workspaceId) {
      const workspace = workspaces.find(
        (candidate) => candidate.id === work.workspaceId,
      )
      if (!workspace) return `Unavailable Workspace · ${work.workspaceId}`
      return workspaceRosterLabel(workspace, workspaces)
    }
    if (work?.legacyWorkspaceTitle) {
      return `Unassigned · previous Project: ${work.legacyWorkspaceTitle}`
    }
    return 'No Workspace'
  }

  function workspaceOptions(workspaces, current) {
    const nodes = [
      React.createElement('option', { key: '', value: '' }, 'No Workspace'),
    ]
    if (!current?.workspaceId && current?.legacyWorkspaceTitle) {
      nodes.push(
        React.createElement(
          'option',
          { key: LEGACY_WORKSPACE_VALUE, value: LEGACY_WORKSPACE_VALUE },
          `Unassigned · previous Project: ${current.legacyWorkspaceTitle}`,
        ),
      )
    }
    if (
      current?.workspaceId &&
      !workspaces.some((workspace) => workspace.id === current.workspaceId)
    ) {
      nodes.push(
        React.createElement(
          'option',
          { key: `missing:${current.workspaceId}`, value: current.workspaceId },
          `Unavailable Workspace · ${current.workspaceId}`,
        ),
      )
    }
    for (const workspace of workspaces) {
      nodes.push(
        React.createElement(
          'option',
          {
            key: workspace.id,
            value: workspace.id,
            disabled:
              Boolean(workspace.unavailable) &&
              workspace.id !== current?.workspaceId,
          },
          workspaceRosterLabel(workspace, workspaces),
        ),
      )
    }
    return nodes
  }

  function workspaceControl({ work, workspaces, busy, onChange }) {
    const value = work?.workspaceId
      ? work.workspaceId
      : work?.legacyWorkspaceTitle
        ? LEGACY_WORKSPACE_VALUE
        : ''
    return React.createElement(
      'select',
      {
        className: 'pavo-select',
        value,
        disabled: busy,
        'data-testid': 'pavo-workspace-select',
        onChange: (event) => {
          if (event.target.value === LEGACY_WORKSPACE_VALUE) return
          onChange({
            workspaceId: event.target.value,
            legacyWorkspaceTitle: undefined,
          })
        },
      },
      workspaceOptions(workspaces, work),
    )
  }

  function assigneeValue(assignee) {
    if (assignee?.kind === 'human') return 'human'
    if (assignee?.kind === 'agent-preset') {
      return `agent-preset:${assignee.presetId}`
    }
    if (assignee?.legacyLabel) return 'legacy'
    return 'unassigned'
  }

  function assigneeFromValue(value) {
    if (value === 'human') return { kind: 'human' }
    if (value.startsWith('agent-preset:')) {
      return { kind: 'agent-preset', presetId: value.slice('agent-preset:'.length) }
    }
    return { kind: 'unassigned' }
  }

  function assigneeLabel(assignee, agentPresets) {
    if (assignee?.kind === 'human') return 'Me'
    if (assignee?.kind === 'agent-preset') {
      const preset = agentPresets.find(
        (candidate) => candidate.id === assignee.presetId,
      )
      if (!preset) return `Unavailable Agent Preset · ${assignee.presetId}`
      return `${preset.name || preset.id}${preset.broken ? ' · unavailable' : ''}`
    }
    if (assignee?.legacyLabel) {
      return `Unassigned · previous label: ${assignee.legacyLabel}`
    }
    return 'Unassigned'
  }

  function assigneeOptions(agentPresets, currentAssignee) {
    const nodes = [
      React.createElement('option', { key: 'unassigned', value: 'unassigned' }, 'Unassigned'),
      React.createElement('option', { key: 'human', value: 'human' }, 'Me (human)'),
    ]
    if (currentAssignee?.legacyLabel) {
      nodes.push(
        React.createElement(
          'option',
          { key: 'legacy', value: 'legacy' },
          `Unassigned · previous label: ${currentAssignee.legacyLabel}`,
        ),
      )
    }
    const currentPresetId =
      currentAssignee?.kind === 'agent-preset'
        ? currentAssignee.presetId
        : undefined
    if (
      currentPresetId &&
      !agentPresets.some((preset) => preset.id === currentPresetId)
    ) {
      nodes.push(
        React.createElement(
          'option',
          { key: `missing:${currentPresetId}`, value: `agent-preset:${currentPresetId}` },
          `Unavailable Agent Preset · ${currentPresetId}`,
        ),
      )
    }
    for (const preset of agentPresets) {
      nodes.push(
        React.createElement(
          'option',
          {
            key: preset.id,
            value: `agent-preset:${preset.id}`,
            disabled: Boolean(preset.broken),
          },
          `${preset.name || preset.id}${preset.broken ? ' · unavailable' : ''}`,
        ),
      )
    }
    return nodes
  }

  function assigneeControl({ assignee, agentPresets, busy, onChange }) {
    return React.createElement(
      'select',
      {
        className: 'pavo-select',
        value: assigneeValue(assignee),
        disabled: busy,
        'data-testid': 'pavo-assignee-select',
        onChange: (event) => onChange(assigneeFromValue(event.target.value)),
      },
      assigneeOptions(agentPresets, assignee),
    )
  }

  function workflowPath(workflows, workflowId) {
    const byId = new Map(workflows.map((workflow) => [workflow.id, workflow]))
    const result = []
    const visited = new Set()
    let current = byId.get(workflowId)
    while (current && !visited.has(current.id)) {
      visited.add(current.id)
      result.unshift(current)
      current = current.parentWorkflowId ? byId.get(current.parentWorkflowId) : undefined
    }
    return result
  }

  function workflowOptions(workflows) {
    return workflows.map((workflow) =>
      React.createElement(
        'option',
        { key: workflow.id, value: workflow.id },
        workflowPath(workflows, workflow.id).map((item) => item.title).join(' / '),
      ),
    )
  }

  function editFieldControls({
    draft,
    setDraft,
    workspaces,
    workflows,
    agentPresets,
    busy,
    compact = false,
  }) {
    const update = (name) => (event) =>
      setDraft((current) => ({ ...current, [name]: event.target.value }))
    const controls = [
      field(
        'Work type',
        React.createElement(
          'select',
          {
            className: 'pavo-select',
            value: draft.type,
            disabled: busy,
            onChange: update('type'),
          },
          React.createElement('option', { value: 'goal' }, 'Goal Work'),
          React.createElement('option', { value: 'ongoing' }, 'Ongoing Work'),
        ),
      ),
      field(
        'Workspace',
        workspaceControl({
          work: draft,
          workspaces,
          busy,
          onChange: (workspace) =>
            setDraft((current) => ({ ...current, ...workspace })),
        }),
      ),
      field(
        'Workflow',
        React.createElement(
          'select',
          {
            className: 'pavo-select',
            value: draft.workflowId,
            disabled: busy,
            onChange: update('workflowId'),
          },
          workflowOptions(workflows),
        ),
      ),
      field(
        'KEY',
        React.createElement('input', {
          className: 'pavo-input',
          value: draft.key,
          disabled: busy,
          maxLength: 128,
          onChange: update('key'),
        }),
      ),
      field(
        'Title',
        React.createElement('input', {
          className: 'pavo-input',
          value: draft.title,
          disabled: busy,
          maxLength: 500,
          onChange: update('title'),
        }),
        compact ? '' : 'pavo-field-title',
      ),
      field(
        'Assignee',
        assigneeControl({
          assignee: draft.assignee,
          agentPresets,
          busy,
          onChange: (assignee) =>
            setDraft((current) => ({ ...current, assignee })),
        }),
      ),
      field(
        'WaterLevel',
        React.createElement('input', {
          className: 'pavo-input',
          value: draft.waterLevel,
          disabled: busy,
          inputMode: 'decimal',
          pattern: '\\d+(?:\\.\\d+)?',
          onChange: update('waterLevel'),
        }),
      ),
      field(
        'Description',
        React.createElement('textarea', {
          className: 'pavo-textarea',
          value: draft.description,
          disabled: busy,
          maxLength: 50000,
          placeholder: 'Describe the Work. An Agent uses this text directly as its Prompt.',
          onChange: update('description'),
        }),
        compact ? '' : 'pavo-field-description',
      ),
    ]
    return controls
  }

  function DependencyEditor({ work, works, draft, setDraft, busy }) {
    const candidates = works.filter((candidate) => candidate.id !== work?.id)
    const toggle = (candidate, checked) => {
      setDraft((current) => {
        const upstreamWaterLevels = { ...current.upstreamWaterLevels }
        if (checked) upstreamWaterLevels[candidate.id] = candidate.waterLevel
        else delete upstreamWaterLevels[candidate.id]
        return { ...current, upstreamWaterLevels }
      })
    }
    const updateLevel = (id, value) => {
      setDraft((current) => ({
        ...current,
        upstreamWaterLevels: {
          ...current.upstreamWaterLevels,
          [id]: value,
        },
      }))
    }

    return React.createElement(
      'section',
      { className: 'pavo-dependency-editor' },
      React.createElement(
        'div',
        { className: 'pavo-dependency-editor-head' },
        React.createElement('strong', null, 'Upstream Works'),
        React.createElement(
          'span',
          null,
          'Select dependencies and record the last upstream WaterLevel this Work has handled.',
        ),
      ),
      candidates.length === 0
        ? React.createElement(
            'div',
            { className: 'pavo-flow-empty' },
            'Create another Work to add an upstream dependency.',
          )
        : candidates.map((candidate) => {
            const checked = Object.prototype.hasOwnProperty.call(
              draft.upstreamWaterLevels,
              candidate.id,
            )
            return React.createElement(
              'div',
              { className: 'pavo-dependency-choice', key: candidate.id },
              React.createElement('input', {
                id: `pavo-dependency-${candidate.id}`,
                type: 'checkbox',
                checked,
                disabled: busy,
                onChange: (event) => toggle(candidate, event.target.checked),
              }),
              React.createElement(
                'label',
                { htmlFor: `pavo-dependency-${candidate.id}` },
                React.createElement(
                  'strong',
                  null,
                  `${candidate.key || 'NO KEY'} · ${candidate.title}`,
                ),
                React.createElement(
                  'small',
                  null,
                  `Current WaterLevel ${candidate.waterLevel}`,
                ),
              ),
              checked
                ? React.createElement('input', {
                    className: 'pavo-input',
                    value: draft.upstreamWaterLevels[candidate.id],
                    disabled: busy,
                    inputMode: 'decimal',
                    'aria-label': `Acknowledged WaterLevel for ${candidate.title}`,
                    onChange: (event) => updateLevel(candidate.id, event.target.value),
                  })
                : React.createElement('span', null),
            )
          }),
    )
  }

  function WorkDrawer({
    mode,
    work,
    works,
    columns,
    workspaces,
    workflows,
    agentPresets,
    draft,
    setDraft,
    targetColumn,
    setTargetColumn,
    busy,
    stale,
    closeRef,
    onClose,
    onCreate,
    onSave,
    onRemove,
    onSaveTemplate,
  }) {
    if (!mode) return null
    const creating = mode === 'create'
    if (!creating && !work) return null
    const valid = !stale && isValidDraft(draft)
    const workIsSaved = creating || workMatchesDraft(work, draft)
    const column = work
      ? columns.find((candidate) => candidate.id === work.columnId)
      : undefined
    const heading = creating ? 'Create Work' : draft.title || 'Work details'
    const eyebrow = creating
      ? 'New Work'
      : [draft.key || 'NO KEY', workspaceLabel(draft, workspaces)].join(' · ')

    return React.createElement(
      'div',
      {
        className: 'pavo-drawer-backdrop',
        onMouseDown: (event) => {
          if (event.target === event.currentTarget) onClose()
        },
      },
      React.createElement(
        'aside',
        {
          className: 'pavo-drawer',
          role: 'dialog',
          'aria-modal': 'true',
          'aria-labelledby': 'pavo-drawer-title',
        },
        React.createElement(
          'header',
          { className: 'pavo-drawer-header' },
          React.createElement(
            'div',
            { className: 'pavo-drawer-heading' },
            React.createElement('span', { className: 'pavo-drawer-eyebrow' }, eyebrow),
            React.createElement(
              'h2',
              { className: 'pavo-drawer-title', id: 'pavo-drawer-title' },
              heading,
            ),
          ),
          React.createElement(
            'button',
            {
              ref: closeRef,
              type: 'button',
              className: 'pavo-drawer-close',
              disabled: busy,
              onClick: onClose,
            },
            'Close',
          ),
        ),
        React.createElement(
          'div',
          { className: 'pavo-drawer-content' },
          stale
            ? React.createElement(
                'div',
                { className: 'pavo-notice' },
                'The board changed after this drawer opened. Close and reopen it to review the latest values before saving.',
              )
            : null,
          React.createElement(
            'div',
            { className: 'pavo-drawer-form' },
            ...editFieldControls({
              draft,
              setDraft,
              workspaces,
              workflows,
              agentPresets,
              busy,
              compact: true,
            }),
            React.createElement(DependencyEditor, {
              work,
              works,
              draft,
              setDraft,
              busy,
            }),
            creating
              ? field(
                  'Column',
                  React.createElement(
                    'select',
                    {
                      className: 'pavo-select',
                      value: targetColumn,
                      disabled: busy,
                      onChange: (event) => setTargetColumn(event.target.value),
                    },
                    columns.map((candidate) =>
                      React.createElement(
                        'option',
                        { key: candidate.id, value: candidate.id },
                        candidate.title,
                      ),
                    ),
                  ),
                )
              : React.createElement(
                  'div',
                  { className: 'pavo-drawer-meta' },
                  React.createElement(
                    'div',
                    { className: 'pavo-drawer-meta-row' },
                    React.createElement(
                      'span',
                      { className: 'pavo-drawer-meta-label' },
                      'Column',
                    ),
                    React.createElement('span', null, column?.title || work?.columnId || ''),
                  ),
                  React.createElement(
                    'div',
                    { className: 'pavo-drawer-meta-row' },
                    React.createElement(
                      'span',
                      { className: 'pavo-drawer-meta-label' },
                      'Created',
                    ),
                    React.createElement(
                      'span',
                      null,
                      work?.createdAt ? new Date(work.createdAt).toLocaleString() : '',
                    ),
                  ),
                  React.createElement(
                    'div',
                    { className: 'pavo-drawer-meta-row' },
                    React.createElement(
                      'span',
                      { className: 'pavo-drawer-meta-label' },
                      'Updated',
                    ),
                    React.createElement(
                      'span',
                      null,
                      work?.updatedAt ? new Date(work.updatedAt).toLocaleString() : '',
                    ),
                  ),
                  React.createElement(
                    'div',
                    { className: 'pavo-drawer-meta-row' },
                    React.createElement(
                      'span',
                      { className: 'pavo-drawer-meta-label' },
                      'ID',
                    ),
                    React.createElement(
                      'span',
                      { className: 'pavo-drawer-id' },
                      work?.id || '',
                    ),
                  ),
                ),
          ),
        ),
        React.createElement(
          'footer',
          { className: 'pavo-drawer-footer' },
          !creating
            ? React.createElement(
                'button',
                {
                  type: 'button',
                  className: 'pavo-button',
                  disabled: busy || stale || !workIsSaved,
                  title: workIsSaved
                    ? 'Save the current Work as a reusable template.'
                    : 'Save the Work changes before creating a template.',
                  onClick: () => onSaveTemplate(work),
                },
                'Save as template',
              )
            : null,
          !creating
            ? React.createElement(
                'button',
                {
                  type: 'button',
                  className: 'pavo-button pavo-button-danger',
                  disabled: busy || stale,
                  onClick: () => onRemove(work.id),
                },
                'Delete',
              )
            : null,
          React.createElement(
            'div',
            { className: 'pavo-drawer-footer-end' },
            React.createElement(
              'button',
              {
                type: 'button',
                className: 'pavo-button',
                disabled: busy,
                onClick: onClose,
              },
              'Cancel',
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                className: 'pavo-button pavo-button-primary',
                disabled: busy || !valid,
                onClick: creating ? onCreate : onSave,
              },
              creating ? 'Create Work' : 'Save changes',
            ),
          ),
        ),
      ),
    )
  }

  function WorkflowDrawer({
    mode,
    workflow,
    title,
    setTitle,
    busy,
    stale,
    closeRef,
    onClose,
    onCreate,
    onSave,
  }) {
    if (!mode) return null
    const creating = mode === 'create-workflow'
    return React.createElement(
      'div',
      {
        className: 'pavo-drawer-backdrop',
        onMouseDown: (event) => {
          if (event.target === event.currentTarget) onClose()
        },
      },
      React.createElement(
        'aside',
        {
          className: 'pavo-drawer',
          role: 'dialog',
          'aria-modal': 'true',
          'aria-labelledby': 'pavo-workflow-drawer-title',
        },
        React.createElement(
          'header',
          { className: 'pavo-drawer-header' },
          React.createElement(
            'div',
            { className: 'pavo-drawer-heading' },
            React.createElement(
              'span',
              { className: 'pavo-drawer-eyebrow' },
              creating ? 'New Workflow' : 'Workflow details',
            ),
            React.createElement(
              'h2',
              { className: 'pavo-drawer-title', id: 'pavo-workflow-drawer-title' },
              creating ? 'Create Workflow' : workflow?.title || 'Rename Workflow',
            ),
          ),
          React.createElement(
            'button',
            {
              ref: closeRef,
              type: 'button',
              className: 'pavo-drawer-close',
              disabled: busy,
              onClick: onClose,
            },
            'Close',
          ),
        ),
        React.createElement(
          'div',
          { className: 'pavo-drawer-content' },
          stale
            ? React.createElement(
                'div',
                { className: 'pavo-notice' },
                'The board changed after this drawer opened. Close and reopen it before saving.',
              )
            : null,
          field(
            'Workflow title',
            React.createElement('input', {
              className: 'pavo-input',
              value: title,
              disabled: busy,
              maxLength: 500,
              autoFocus: true,
              onChange: (event) => setTitle(event.target.value),
            }),
          ),
        ),
        React.createElement(
          'footer',
          { className: 'pavo-drawer-footer' },
          React.createElement(
            'div',
            { className: 'pavo-drawer-footer-end' },
            React.createElement(
              'button',
              { type: 'button', className: 'pavo-button', disabled: busy, onClick: onClose },
              'Cancel',
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                className: 'pavo-button pavo-button-primary',
                disabled: busy || stale || title.trim().length === 0,
                onClick: creating ? onCreate : onSave,
              },
              creating ? 'Create Workflow' : 'Save changes',
            ),
          ),
        ),
      ),
    )
  }

  function templateCounts(template) {
    if (template.kind === 'work') {
      return { works: 1, workflows: 0, dependencies: 0 }
    }
    return {
      works: template.content.works.length,
      workflows:
        template.content.workflows.length -
        (template.content.mapRootToTarget ? 1 : 0),
      dependencies: template.content.works.reduce(
        (count, work) => count + Object.keys(work.upstreamWaterLevels).length,
        0,
      ),
    }
  }

  let templateDraftIdSequence = 0

  function templateDraftId(prefix) {
    templateDraftIdSequence += 1
    return `${prefix}-${Date.now().toString(36)}-${templateDraftIdSequence}`
  }

  function WorkflowTemplateEditor({
    draft,
    setDraft,
    workspaces,
    columns,
    agentPresets,
    busy,
  }) {
    const content = draft.content
    if (!content) return null
    const setContent = (updater) =>
      setDraft((current) => ({
        ...current,
        content: updater(current.content),
      }))
    const childIds = (workflowId) => {
      const result = new Set([workflowId])
      let changed = true
      while (changed) {
        changed = false
        for (const workflow of content.workflows) {
          if (workflow.parentWorkflowId && result.has(workflow.parentWorkflowId) && !result.has(workflow.id)) {
            result.add(workflow.id)
            changed = true
          }
        }
      }
      return result
    }
    const updateWorkflow = (workflowId, fieldName, value) =>
      setContent((current) => ({
        ...current,
        workflows: current.workflows.map((workflow) =>
          workflow.id === workflowId
            ? { ...workflow, [fieldName]: value }
            : workflow,
        ),
      }))
    const addWorkflow = () => {
      const id = templateDraftId('workflow')
      setContent((current) => ({
        ...current,
        workflows: [
          ...current.workflows,
          {
            id,
            title: 'New Workflow',
            parentWorkflowId: current.rootWorkflowId,
          },
        ],
      }))
    }
    const removeWorkflow = (workflowId) =>
      setContent((current) => ({
        ...current,
        workflows: current.workflows.filter((workflow) => workflow.id !== workflowId),
      }))
    const addTemplateWork = () => {
      const id = templateDraftId('work')
      setContent((current) => ({
        ...current,
        works: [
          ...current.works,
          {
            id,
            type: 'goal',
            workspaceId: '',
            key: '',
            title: 'New Work',
            description: '',
            assignee: { kind: 'unassigned' },
            waterLevel: '0',
            upstreamWaterLevels: {},
            workflowId: current.rootWorkflowId,
            columnId: columns[0]?.id || '',
          },
        ],
      }))
    }
    const updateTemplateWork = (workId, fieldName, value) =>
      setContent((current) => ({
        ...current,
        works: current.works.map((work) =>
          work.id === workId ? { ...work, [fieldName]: value } : work,
        ),
      }))
    const removeTemplateWork = (workId) =>
      setContent((current) => ({
        ...current,
        works: current.works
          .filter((work) => work.id !== workId)
          .map((work) => {
            const upstreamWaterLevels = { ...work.upstreamWaterLevels }
            delete upstreamWaterLevels[workId]
            return { ...work, upstreamWaterLevels }
          }),
      }))
    const updateTemplateDependency = (workId, upstreamId, checked, value) =>
      setContent((current) => ({
        ...current,
        works: current.works.map((work) => {
          if (work.id !== workId) return work
          const upstreamWaterLevels = { ...work.upstreamWaterLevels }
          if (checked) upstreamWaterLevels[upstreamId] = value ?? '0'
          else delete upstreamWaterLevels[upstreamId]
          return { ...work, upstreamWaterLevels }
        }),
      }))

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        'div',
        { className: 'pavo-template-summary', 'data-testid': 'pavo-template-tree-editor' },
        `${content.workflows.length} Workflows · ${content.works.length} Works. Internal dependency cycles are allowed.`,
      ),
      React.createElement(
        'div',
        { className: 'pavo-template-list' },
        content.workflows.map((workflow) => {
          const root = workflow.id === content.rootWorkflowId
          const blockedRemoval =
            root ||
            content.workflows.some((item) => item.parentWorkflowId === workflow.id) ||
            content.works.some((work) => work.workflowId === workflow.id)
          const descendants = childIds(workflow.id)
          return React.createElement(
            'div',
            { className: 'pavo-template-row', key: workflow.id },
            React.createElement(
              'div',
              { className: 'pavo-template-row-head' },
              React.createElement('span', { className: 'pavo-template-kind' }, root ? 'Template root' : 'Workflow'),
              !root
                ? React.createElement(
                    'button',
                    {
                      type: 'button', className: 'pavo-button pavo-button-danger',
                      disabled: busy || blockedRemoval,
                      title: blockedRemoval ? 'Move or remove its contents first.' : 'Remove Workflow',
                      onClick: () => removeWorkflow(workflow.id),
                    },
                    'Remove',
                  )
                : null,
            ),
            field('Title', React.createElement('input', {
              className: 'pavo-input', value: workflow.title, disabled: busy,
              maxLength: 500,
              onChange: (event) => updateWorkflow(workflow.id, 'title', event.target.value),
            })),
            !root
              ? field(
                  'Parent Workflow',
                  React.createElement(
                    'select',
                    {
                      className: 'pavo-select', value: workflow.parentWorkflowId,
                      disabled: busy,
                      onChange: (event) => updateWorkflow(workflow.id, 'parentWorkflowId', event.target.value),
                    },
                    content.workflows
                      .filter((candidate) => !descendants.has(candidate.id))
                      .map((candidate) =>
                        React.createElement('option', { key: candidate.id, value: candidate.id }, candidate.title),
                      ),
                  ),
                )
              : null,
          )
        }),
      ),
      React.createElement(
        'button',
        { type: 'button', className: 'pavo-button', disabled: busy, onClick: addWorkflow },
        'Add child Workflow',
      ),
      content.works.length
        ? React.createElement(
            'div',
            { className: 'pavo-template-list' },
            content.works.map((work) =>
              React.createElement(
                'div',
                { className: 'pavo-template-row', key: work.id },
                React.createElement(
                  'div',
                  { className: 'pavo-template-row-head' },
                  React.createElement('span', { className: 'pavo-template-kind' }, work.type === 'goal' ? 'Goal Work' : 'Ongoing Work'),
                  React.createElement(
                    'button',
                    {
                      type: 'button', className: 'pavo-button pavo-button-danger', disabled: busy,
                      onClick: () => removeTemplateWork(work.id),
                    },
                    'Remove',
                  ),
                ),
                field('Title', React.createElement('input', {
                  className: 'pavo-input', value: work.title, disabled: busy, maxLength: 500,
                  onChange: (event) => updateTemplateWork(work.id, 'title', event.target.value),
                })),
                React.createElement(
                  'div',
                  { className: 'pavo-drawer-grid' },
                  field('Type', React.createElement(
                    'select',
                    {
                      className: 'pavo-select', value: work.type, disabled: busy,
                      onChange: (event) => updateTemplateWork(work.id, 'type', event.target.value),
                    },
                    React.createElement('option', { value: 'goal' }, 'Goal'),
                    React.createElement('option', { value: 'ongoing' }, 'Ongoing'),
                  )),
                  field('Workflow', React.createElement(
                    'select',
                    {
                      className: 'pavo-select', value: work.workflowId, disabled: busy,
                      onChange: (event) => updateTemplateWork(work.id, 'workflowId', event.target.value),
                    },
                    content.workflows.map((candidate) =>
                      React.createElement('option', { key: candidate.id, value: candidate.id }, candidate.title),
                    ),
                  )),
                  field('Workspace', workspaceControl({
                    work,
                    workspaces,
                    busy,
                    onChange: (workspace) =>
                      setContent((current) => ({
                        ...current,
                        works: current.works.map((candidate) =>
                          candidate.id === work.id
                            ? { ...candidate, ...workspace }
                            : candidate,
                        ),
                      })),
                  })),
                  field('KEY', React.createElement('input', {
                    className: 'pavo-input', value: work.key, disabled: busy, maxLength: 128,
                    onChange: (event) => updateTemplateWork(work.id, 'key', event.target.value),
                  })),
                  field('Assignee', assigneeControl({
                    assignee: work.assignee,
                    agentPresets,
                    busy,
                    onChange: (assignee) =>
                      updateTemplateWork(work.id, 'assignee', assignee),
                  })),
                  field('WaterLevel', React.createElement('input', {
                    className: 'pavo-input', value: work.waterLevel, disabled: busy, inputMode: 'decimal',
                    onChange: (event) => updateTemplateWork(work.id, 'waterLevel', event.target.value),
                  })),
                  field('Column', React.createElement(
                    'select',
                    {
                      className: 'pavo-select', value: work.columnId, disabled: busy,
                      onChange: (event) => updateTemplateWork(work.id, 'columnId', event.target.value),
                    },
                    columns.map((column) =>
                      React.createElement('option', { key: column.id, value: column.id }, column.title),
                    ),
                  )),
                ),
                field('Description', React.createElement('textarea', {
                  className: 'pavo-textarea', value: work.description, disabled: busy, maxLength: 50000,
                  onChange: (event) => updateTemplateWork(work.id, 'description', event.target.value),
                })),
                content.works.length > 1
                  ? React.createElement(
                      'div',
                      { className: 'pavo-dependency-editor' },
                      React.createElement('strong', null, 'Internal upstream Works'),
                      content.works
                        .filter((candidate) => candidate.id !== work.id)
                        .map((candidate) => {
                          const checked = Object.hasOwn(work.upstreamWaterLevels, candidate.id)
                          return React.createElement(
                            'div',
                            { className: 'pavo-dependency-choice', key: candidate.id },
                            React.createElement('input', {
                              type: 'checkbox', checked, disabled: busy,
                              onChange: (event) => updateTemplateDependency(work.id, candidate.id, event.target.checked, '0'),
                            }),
                            React.createElement('label', null, React.createElement('strong', null, candidate.title)),
                            checked
                              ? React.createElement('input', {
                                  className: 'pavo-input', value: work.upstreamWaterLevels[candidate.id],
                                  disabled: busy, inputMode: 'decimal',
                                  'aria-label': `Acknowledged WaterLevel for ${candidate.title}`,
                                  onChange: (event) => updateTemplateDependency(work.id, candidate.id, true, event.target.value),
                                })
                              : React.createElement('span', null),
                          )
                        }),
                    )
                  : null,
              ),
            ),
          )
        : null,
      React.createElement(
        'button',
        { type: 'button', className: 'pavo-button', disabled: busy, onClick: addTemplateWork },
        'Add Work',
      ),
    )
  }

  function TemplateLibraryDrawer({
    mode,
    templates,
    workspaces,
    columns,
    workflows,
    agentPresets,
    draft,
    setDraft,
    targetWorkflowId,
    setTargetWorkflowId,
    busy,
    stale,
    closeRef,
    onClose,
    onShowLibrary,
    onCreate,
    onEdit,
    onApply,
    onDelete,
    onSave,
    onInstantiate,
  }) {
    if (!mode) return null
    const update = (name) => (event) =>
      setDraft((current) => ({ ...current, [name]: event.target.value }))
    const selected = templates.find((template) => template.id === draft?.templateId)
    const editing = mode === 'template-edit'
    const applying = mode === 'template-apply'
    const title = editing
      ? draft?.templateId
        ? 'Edit template'
        : draft?.sourceWorkId || draft?.sourceWorkflowId
          ? 'Save as template'
          : 'Create template'
      : applying
        ? 'Use template'
        : 'Reusable structures'
    const workEditor = editing && draft?.kind === 'work'
    const workflowEditor = editing && draft?.kind === 'workflow'
    const scratch = !draft?.sourceWorkId && !draft?.sourceWorkflowId
    const workflowDraftValid =
      !workflowEditor ||
      !scratch ||
      Boolean(
        draft?.content?.workflows?.every((workflow) => workflow.title.trim()) &&
          draft?.content?.works?.every(
            (work) => work.title.trim() && /^\d+(?:\.\d+)?$/.test(work.waterLevel),
          ),
      )

    return React.createElement(
      'div',
      {
        className: 'pavo-drawer-backdrop',
        onMouseDown: (event) => {
          if (event.target === event.currentTarget) onClose()
        },
      },
      React.createElement(
        'aside',
        {
          className: 'pavo-drawer',
          role: 'dialog',
          'aria-modal': 'true',
          'aria-labelledby': 'pavo-template-drawer-title',
          'data-testid': 'pavo-template-library',
        },
        React.createElement(
          'header',
          { className: 'pavo-drawer-header' },
          React.createElement(
            'div',
            { className: 'pavo-drawer-heading' },
            React.createElement(
              'span',
              { className: 'pavo-drawer-eyebrow' },
              'Template Library',
            ),
            React.createElement(
              'h2',
              { className: 'pavo-drawer-title', id: 'pavo-template-drawer-title' },
              title,
            ),
          ),
          React.createElement(
            'button',
            {
              ref: closeRef,
              type: 'button',
              className: 'pavo-drawer-close',
              disabled: busy,
              onClick: onClose,
            },
            'Close',
          ),
        ),
        React.createElement(
          'div',
          { className: 'pavo-drawer-content' },
          stale
            ? React.createElement(
                'div',
                { className: 'pavo-notice' },
                'The board changed after the Template Library opened. Reopen it before saving.',
              )
            : null,
          mode === 'template-library'
            ? React.createElement(
                React.Fragment,
                null,
                React.createElement(
                  'div',
                  { className: 'pavo-template-actions' },
                  React.createElement(
                    'button',
                    {
                      type: 'button',
                      className: 'pavo-button',
                      disabled: busy,
                      onClick: () => onCreate('work'),
                    },
                    'New Work template',
                  ),
                  React.createElement(
                    'button',
                    {
                      type: 'button',
                      className: 'pavo-button',
                      disabled: busy,
                      onClick: () => onCreate('workflow'),
                    },
                    'New Workflow template',
                  ),
                ),
                templates.length === 0
                  ? React.createElement(
                      'div',
                      { className: 'pavo-flow-empty' },
                      'No templates yet. Create one from scratch or save a current Work or Workflow subtree.',
                    )
                  : React.createElement(
                      'div',
                      { className: 'pavo-template-list' },
                      templates.map((template) => {
                        const counts = templateCounts(template)
                        return React.createElement(
                          'article',
                          {
                            className: 'pavo-template-row',
                            key: template.id,
                            'data-testid': 'pavo-template-row',
                          },
                          React.createElement(
                            'div',
                            { className: 'pavo-template-row-head' },
                            React.createElement(
                              'div',
                              { className: 'pavo-template-row-title' },
                              React.createElement('strong', null, template.name),
                              React.createElement(
                                'span',
                                { 'data-testid': 'pavo-template-counts' },
                                `${counts.workflows} Workflows · ${counts.works} Works · ${counts.dependencies} internal dependencies`,
                              ),
                            ),
                            React.createElement(
                              'span',
                              { className: 'pavo-template-kind' },
                              template.kind === 'work' ? 'Work' : 'Workflow subtree',
                            ),
                          ),
                          template.excludedExternalDependencies > 0
                            ? React.createElement(
                                'div',
                                { className: 'pavo-notice' },
                                `${template.excludedExternalDependencies} external dependencies were excluded when captured.`,
                              )
                            : null,
                          React.createElement(
                            'div',
                            { className: 'pavo-template-row-actions' },
                            React.createElement(
                              'button',
                              {
                                type: 'button',
                                className: 'pavo-button pavo-button-primary',
                                disabled: busy,
                                onClick: () => onApply(template),
                              },
                              'Use',
                            ),
                            React.createElement(
                              'button',
                              {
                                type: 'button',
                                className: 'pavo-button',
                                disabled: busy,
                                onClick: () => onEdit(template),
                              },
                              'Edit',
                            ),
                            React.createElement(
                              'button',
                              {
                                type: 'button',
                                className: 'pavo-button pavo-button-danger',
                                disabled: busy,
                                onClick: () => onDelete(template.id),
                              },
                              'Delete',
                            ),
                          ),
                        )
                      }),
                    ),
              )
            : editing
              ? React.createElement(
                  'div',
                  { className: 'pavo-drawer-form', 'data-testid': 'pavo-template-editor' },
                  field(
                    'Template name',
                    React.createElement('input', {
                      className: 'pavo-input',
                      value: draft.name,
                      disabled: busy,
                      maxLength: 500,
                      onChange: update('name'),
                    }),
                  ),
                  !scratch
                    ? React.createElement(
                        'div',
                        { className: 'pavo-template-summary' },
                        draft.sourceWorkId
                          ? 'The current Work fields will be captured. External dependencies are excluded.'
                          : 'The selected Workflow, all descendants, Works, and internal dependencies will be captured.',
                      )
                    : null,
                  workEditor && scratch
                    ? React.createElement(
                        React.Fragment,
                        null,
                        field(
                          'Work type',
                          React.createElement(
                            'select',
                            {
                              className: 'pavo-select',
                              value: draft.type,
                              disabled: busy,
                              onChange: update('type'),
                            },
                            React.createElement('option', { value: 'goal' }, 'Goal Work'),
                            React.createElement('option', { value: 'ongoing' }, 'Ongoing Work'),
                          ),
                        ),
                        field(
                          'Workspace',
                          workspaceControl({
                            work: draft,
                            workspaces,
                            busy,
                            onChange: (workspace) =>
                              setDraft((current) => ({
                                ...current,
                                ...workspace,
                              })),
                          }),
                        ),
                        field('KEY', React.createElement('input', {
                          className: 'pavo-input', value: draft.key, disabled: busy,
                          maxLength: 128, onChange: update('key'),
                        })),
                        field('Work title', React.createElement('input', {
                          className: 'pavo-input', value: draft.title, disabled: busy,
                          maxLength: 500, onChange: update('title'),
                        })),
                        field('Assignee', assigneeControl({
                          assignee: draft.assignee,
                          agentPresets,
                          busy,
                          onChange: (assignee) =>
                            setDraft((current) => ({ ...current, assignee })),
                        })),
                        field('WaterLevel', React.createElement('input', {
                          className: 'pavo-input', value: draft.waterLevel, disabled: busy,
                          inputMode: 'decimal', onChange: update('waterLevel'),
                        })),
                        field(
                          'Initial column',
                          React.createElement(
                            'select',
                            {
                              className: 'pavo-select', value: draft.columnId,
                              disabled: busy, onChange: update('columnId'),
                            },
                            columns.map((column) =>
                              React.createElement('option', { key: column.id, value: column.id }, column.title),
                            ),
                          ),
                        ),
                        field('Description', React.createElement('textarea', {
                          className: 'pavo-textarea', value: draft.description,
                          disabled: busy, maxLength: 50000, onChange: update('description'),
                        })),
                      )
                    : null,
                  workflowEditor && scratch
                    ? React.createElement(WorkflowTemplateEditor, {
                        draft,
                        setDraft,
                        workspaces,
                        columns,
                        agentPresets,
                        busy,
                      })
                    : null,
                )
              : applying && selected
                ? React.createElement(
                    'div',
                    { className: 'pavo-drawer-form', 'data-testid': 'pavo-template-instantiate' },
                    React.createElement(
                      'div',
                      { className: 'pavo-template-summary', 'data-testid': 'pavo-template-preview' },
                      `${selected.name} creates passive Pavo records only. It does not run Agents, update WaterLevels, or acknowledge dependencies.`,
                    ),
                    field(
                      'Destination Workflow',
                      React.createElement(
                        'select',
                        {
                          className: 'pavo-select', value: targetWorkflowId,
                          disabled: busy, onChange: (event) => setTargetWorkflowId(event.target.value),
                          'data-testid': 'pavo-template-target-workflow',
                        },
                        workflowOptions(workflows),
                      ),
                    ),
                  )
                : null,
        ),
        mode === 'template-library'
          ? null
          : React.createElement(
              'footer',
              { className: 'pavo-drawer-footer' },
              React.createElement(
                'button',
                { type: 'button', className: 'pavo-button', disabled: busy, onClick: onShowLibrary },
                'Back to library',
              ),
              React.createElement(
                'div',
                { className: 'pavo-drawer-footer-end' },
                React.createElement(
                  'button',
                  {
                    type: 'button', className: 'pavo-button pavo-button-primary',
                    disabled:
                      busy || stale ||
                      (editing && (!draft?.name?.trim() || (scratch && workEditor && !draft?.title?.trim()) || !workflowDraftValid)),
                    onClick: applying ? onInstantiate : onSave,
                  },
                  applying ? 'Create from template' : 'Save template',
                ),
              ),
            ),
      ),
    )
  }

  function WorkNode({ data: nodeData }) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Handle, {
        id: 'target-left',
        type: 'target',
        position: Position.Left,
        style: { top: '38%' },
      }),
      React.createElement(Handle, {
        id: 'source-left',
        type: 'source',
        position: Position.Left,
        style: { top: '64%' },
      }),
      React.createElement(
        'article',
        {
          className: `pavo-work-node${nodeData.selected ? ' pavo-work-node-selected' : ''}`,
          role: 'button',
          tabIndex: 0,
          'aria-pressed': nodeData.selected,
          'aria-label': `${nodeData.title}, ${nodeData.type} Work, WaterLevel ${nodeData.waterLevel}`,
          onClick: () => nodeData.onSelect(nodeData.id),
          onKeyDown: (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              nodeData.onSelect(nodeData.id)
            }
          },
        },
        React.createElement('div', { className: 'pavo-work-node-accent' }),
        React.createElement(
          'div',
          { className: 'pavo-work-node-body' },
          React.createElement(
            'div',
            { className: 'pavo-work-node-topline' },
            React.createElement(
              'span',
              { className: `pavo-work-type pavo-work-type-${nodeData.type}` },
              nodeData.type === 'goal' ? 'Goal' : 'Ongoing',
            ),
            React.createElement(
              'span',
              { className: 'pavo-work-level' },
              `WL ${nodeData.waterLevel}`,
            ),
          ),
          React.createElement(
            'div',
            { className: 'pavo-work-node-title' },
            nodeData.title,
          ),
          React.createElement(
            'div',
            { className: 'pavo-work-node-metrics' },
            React.createElement(
              'span',
              { className: 'pavo-work-node-index' },
              nodeData.key || 'NO KEY',
            ),
            React.createElement(
              'span',
              { className: 'pavo-work-node-exits' },
              `${nodeData.upstreamCount} upstream`,
            ),
          ),
        ),
      ),
      React.createElement(Handle, {
        id: 'target-right',
        type: 'target',
        position: Position.Right,
        style: { top: '38%' },
      }),
      React.createElement(Handle, {
        id: 'source-right',
        type: 'source',
        position: Position.Right,
        style: { top: '64%' },
      }),
    )
  }

  function WorkflowNode({ data: nodeData }) {
    return React.createElement(
      'article',
      {
        className: `pavo-workflow-node${nodeData.selected ? ' pavo-workflow-node-selected' : ''}`,
        role: 'button',
        tabIndex: 0,
        'aria-pressed': nodeData.selected,
        'aria-label': `${nodeData.title}, Workflow, ${nodeData.workCount} Works and ${nodeData.workflowCount} Workflows`,
        onClick: () => nodeData.onSelect(nodeData.id),
        onKeyDown: (event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            nodeData.onOpen(nodeData.id)
          } else if (event.key === ' ') {
            event.preventDefault()
            nodeData.onSelect(nodeData.id)
          }
        },
      },
      React.createElement('div', { className: 'pavo-workflow-node-accent' }),
      React.createElement(
        'div',
        { className: 'pavo-workflow-node-body' },
        React.createElement(
          'div',
          { className: 'pavo-workflow-node-kicker' },
          React.createElement('span', null, 'Workflow'),
          React.createElement('span', null, 'Open →'),
        ),
        React.createElement('div', { className: 'pavo-workflow-node-title' }, nodeData.title),
        React.createElement(
          'div',
          { className: 'pavo-workflow-node-meta' },
          `${nodeData.workCount} Works · ${nodeData.workflowCount} Workflows`,
        ),
      ),
    )
  }

  const FLOW_NODE_TYPES = { work: WorkNode, workflow: WorkflowNode }
  const FLOW_POSITIONS_KEY = '@dddrop/dsh-plugin-pavo/flow-positions:v2'
  const VIEW_MODE_KEY = '@dddrop/dsh-plugin-pavo/view-mode:v1'

  function readViewMode() {
    if (typeof localStorage === 'undefined') return 'flow'
    try {
      const value = localStorage.getItem(VIEW_MODE_KEY)
      return value === 'board' || value === 'flow' ? value : 'flow'
    } catch {
      return 'flow'
    }
  }

  function writeViewMode(viewMode) {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem(VIEW_MODE_KEY, viewMode)
    } catch {
      // Browser storage can be disabled without affecting Pavo navigation.
    }
  }

  function readFlowPositions(layoutKey) {
    if (typeof localStorage === 'undefined') return {}
    try {
      const value = JSON.parse(
        localStorage.getItem(`${FLOW_POSITIONS_KEY}:${layoutKey}`) || '{}',
      )
      if (value === null || typeof value !== 'object' || Array.isArray(value)) {
        return {}
      }
      return Object.fromEntries(
        Object.entries(value).filter(
          ([, position]) =>
            position &&
            Number.isFinite(position.x) &&
            Number.isFinite(position.y),
        ),
      )
    } catch {
      return {}
    }
  }

  function writeFlowPositions(layoutKey, positions) {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem(
        `${FLOW_POSITIONS_KEY}:${layoutKey}`,
        JSON.stringify(positions),
      )
    } catch {
      // Browser storage can be disabled without affecting the canvas.
    }
  }

  const workNodeId = (id) => `work:${id}`
  const workflowNodeId = (id) => `workflow:${id}`
  const domainNodeId = (id, prefix) =>
    typeof id === 'string' && id.startsWith(prefix) ? id.slice(prefix.length) : ''

  function flowNodes(
    data,
    currentWorkflowId,
    selectedNodeId,
    positions,
    onSelectNode,
    onOpenWork,
    onOpenWorkflow,
  ) {
    const childWorkflows = data.workflows.filter(
      (workflow) => workflow.parentWorkflowId === currentWorkflowId,
    )
    const directWorks = data.works.filter(
      (work) => work.workflowId === currentWorkflowId,
    )
    const workflowNodes = childWorkflows.map((workflow, index) => {
      const id = workflowNodeId(workflow.id)
      return {
        id,
        type: 'workflow',
        position: positions[id] ?? { x: index * 286, y: 40 },
        selected: id === selectedNodeId,
        data: {
          id: workflow.id,
          onOpen: onOpenWorkflow,
          onSelect: (workflowId) => onSelectNode(workflowNodeId(workflowId)),
          selected: id === selectedNodeId,
          title: workflow.title,
          workCount: data.works.filter((work) => work.workflowId === workflow.id).length,
          workflowCount: data.workflows.filter(
            (candidate) => candidate.parentWorkflowId === workflow.id,
          ).length,
        },
      }
    })
    const workNodes = directWorks.map((work, index) => {
      const id = workNodeId(work.id)
      return {
        id,
        type: 'work',
        position: positions[id] ?? {
          x: (index % 4) * 286,
          y: Math.floor(index / 4) * 190 + (childWorkflows.length > 0 ? 240 : 48),
        },
        selected: id === selectedNodeId,
        data: {
          id: work.id,
          key: work.key,
          onOpen: (workId) =>
            onOpenWork(data.works.find((candidate) => candidate.id === workId)),
          onSelect: (workId) => onSelectNode(workNodeId(workId)),
          selected: id === selectedNodeId,
          title: work.title,
          type: work.type,
          upstreamCount: Object.keys(work.upstreamWaterLevels).length,
          waterLevel: work.waterLevel,
        },
      }
    })
    return [...workflowNodes, ...workNodes]
  }

  function flowEdges(data, currentWorkflowId) {
    const visibleWorks = data.works.filter(
      (work) => work.workflowId === currentWorkflowId,
    )
    const indexById = new Map(visibleWorks.map((work, index) => [work.id, index]))
    const workById = new Map(data.works.map((work) => [work.id, work]))
    const visibleIds = new Set(visibleWorks.map((work) => work.id))
    const edges = []
    for (const target of visibleWorks) {
      for (const [sourceId, acknowledged] of Object.entries(target.upstreamWaterLevels)) {
        const source = workById.get(sourceId)
        if (!source || !visibleIds.has(sourceId)) continue
        const forwards = indexById.get(target.id) >= indexById.get(sourceId)
        const state = dependencyState(source.waterLevel, acknowledged)
        const color = state === 'changed' ? '#b27b2d' : state === 'rollback' ? '#bd5b5b' : '#6f83ae'
        edges.push({
          id: `${workNodeId(sourceId)}::${workNodeId(target.id)}`,
          source: workNodeId(sourceId),
          sourceHandle: forwards ? 'source-right' : 'source-left',
          target: workNodeId(target.id),
          targetHandle: forwards ? 'target-left' : 'target-right',
          type: 'smoothstep',
          label: state === 'synchronized' ? undefined : state,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color,
            height: 14,
            width: 14,
          },
          style: { stroke: color, strokeWidth: state === 'synchronized' ? 1.6 : 2.2 },
        })
      }
    }
    return edges
  }

  function FlowCanvas({
    data,
    currentWorkflowId,
    selectedNodeId,
    onSelectNode,
    onOpenWork,
    onOpenWorkflow,
    onEditWorkflow,
    onRemoveWorkflow,
    onSaveWorkTemplate,
    onSaveWorkflowTemplate,
    onUpdateDependencies,
    agentPresets,
    workspaces,
    busy,
    layoutKey,
  }) {
    const positionsRef = React.useRef(null)
    if (positionsRef.current === null) {
      positionsRef.current = readFlowPositions(layoutKey)
    }
    const generatedNodes = React.useMemo(
      () =>
        flowNodes(
          data,
          currentWorkflowId,
          selectedNodeId,
          positionsRef.current,
          onSelectNode,
          onOpenWork,
          onOpenWorkflow,
        ),
      [
        data,
        currentWorkflowId,
        selectedNodeId,
        onSelectNode,
        onOpenWork,
        onOpenWorkflow,
      ],
    )
    const generatedEdges = React.useMemo(
      () => flowEdges(data, currentWorkflowId),
      [data, currentWorkflowId],
    )
    const [nodes, setNodes, onNodesChange] = useNodesState(generatedNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(generatedEdges)
    const handleNodesChange = React.useCallback(
      (changes) => {
        onNodesChange(changes)
        let shouldWrite = false
        for (const change of changes) {
          if (change.type !== 'position' || !change.position) continue
          positionsRef.current[change.id] = {
            x: change.position.x,
            y: change.position.y,
          }
          if (change.dragging === false) shouldWrite = true
        }
        if (shouldWrite) writeFlowPositions(layoutKey, positionsRef.current)
      },
      [layoutKey, onNodesChange],
    )

    React.useEffect(() => {
      setNodes((current) => {
        const positions = new Map(current.map((node) => [node.id, node.position]))
        return generatedNodes.map((node) => ({
          ...node,
          position: positions.get(node.id) ?? node.position,
        }))
      })
    }, [generatedNodes, setNodes])

    React.useEffect(() => setEdges(generatedEdges), [generatedEdges, setEdges])

    const selectedWorkId = domainNodeId(selectedNodeId, 'work:')
    const selectedWorkflowId = domainNodeId(selectedNodeId, 'workflow:')
    const selected = data.works.find((work) => work.id === selectedWorkId)
    const selectedWorkflow = data.workflows.find(
      (workflow) => workflow.id === selectedWorkflowId,
    )
    const visibleWorks = data.works.filter(
      (work) => work.workflowId === currentWorkflowId,
    )
    const visibleWorkflows = data.workflows.filter(
      (workflow) => workflow.parentWorkflowId === currentWorkflowId,
    )
    const upstreams = selected
      ? Object.entries(selected.upstreamWaterLevels).map(([id, acknowledged]) => {
          const work = data.works.find((candidate) => candidate.id === id)
          return work
            ? {
                work,
                acknowledged,
                state: dependencyState(work.waterLevel, acknowledged),
              }
            : null
        }).filter(Boolean)
      : []

    const connect = (connection) => {
      if (busy || !connection.source || !connection.target) return
      if (connection.source === connection.target) return
      const sourceId = domainNodeId(connection.source, 'work:')
      const targetId = domainNodeId(connection.target, 'work:')
      const source = data.works.find((work) => work.id === sourceId)
      const target = data.works.find((work) => work.id === targetId)
      if (
        !source ||
        !target ||
        Object.prototype.hasOwnProperty.call(target.upstreamWaterLevels, source.id)
      ) return
      onUpdateDependencies(target.id, {
        ...target.upstreamWaterLevels,
        [source.id]: source.waterLevel,
      })
    }

    const validConnection = (connection) => {
      const sourceId = domainNodeId(connection.source, 'work:')
      const targetId = domainNodeId(connection.target, 'work:')
      return (
        sourceId.length > 0 &&
        targetId.length > 0 &&
        sourceId !== targetId &&
        visibleWorks.some((work) => work.id === sourceId) &&
        visibleWorks.some(
          (work) =>
            work.id === targetId &&
            !Object.prototype.hasOwnProperty.call(
              work.upstreamWaterLevels,
              sourceId,
            ),
        )
      )
    }

    return React.createElement(
      'div',
      { className: 'pavo-flow' },
      React.createElement(
        'div',
        {
          className: 'pavo-flow-canvas',
          role: 'region',
          'aria-label': 'Interactive Work dependency canvas',
        },
        React.createElement(
          ReactFlow,
          {
            nodes,
            edges,
            nodeTypes: FLOW_NODE_TYPES,
            onNodesChange: handleNodesChange,
            onEdgesChange,
            onConnect: connect,
            isValidConnection: validConnection,
            onNodeClick: (_event, node) => onSelectNode(node.id),
            onNodeDoubleClick: (_event, node) => {
              const workflowId = domainNodeId(node.id, 'workflow:')
              if (workflowId) onOpenWorkflow(workflowId)
              else {
                const workId = domainNodeId(node.id, 'work:')
                onOpenWork(data.works.find((work) => work.id === workId))
              }
            },
            fitView: true,
            fitViewOptions: { padding: 0.22, duration: 450 },
            minZoom: 0.3,
            maxZoom: 1.8,
            nodesConnectable: !busy,
            nodesDraggable: true,
            nodesFocusable: false,
            edgesFocusable: true,
            elementsSelectable: true,
            panOnScroll: true,
            selectionOnDrag: false,
            snapToGrid: true,
            snapGrid: [16, 16],
            proOptions: { hideAttribution: true },
            deleteKeyCode: null,
          },
          React.createElement(Background, {
            variant: BackgroundVariant.Dots,
            gap: 22,
            size: 1.2,
            color: 'rgba(108,124,158,.38)',
          }),
          React.createElement(Controls, {
            position: 'bottom-left',
            showInteractive: false,
          }),
          nodes.length > 3
            ? React.createElement(MiniMap, {
                position: 'bottom-right',
                pannable: true,
                zoomable: true,
                nodeColor: (node) =>
                  node.type === 'workflow'
                    ? '#7656b5'
                    : node.id === selectedNodeId
                      ? '#2f5fc7'
                      : '#8b96aa',
                nodeStrokeWidth: 2,
              })
            : null,
          React.createElement(
            Panel,
            { position: 'top-left' },
            React.createElement(
              'div',
              { className: 'pavo-flow-panel' },
              React.createElement(
                'strong',
                null,
                `${visibleWorks.length} Works · ${visibleWorkflows.length} Workflows`,
              ),
              React.createElement(
                'span',
                null,
                'Connect handles to add dependencies · cycles are allowed',
              ),
            ),
          ),
        ),
      ),
      React.createElement(
        'aside',
        { className: 'pavo-flow-detail', 'aria-live': 'polite' },
        selected
          ? React.createElement(
              React.Fragment,
              null,
              React.createElement(
                'header',
                { className: 'pavo-flow-detail-head' },
                React.createElement(
                  'div',
                  { className: 'pavo-flow-detail-kicker' },
                  React.createElement('span', null, 'Work inspector'),
                  React.createElement(
                    'span',
                    { className: `pavo-work-type pavo-work-type-${selected.type}` },
                    selected.type === 'goal' ? 'Goal' : 'Ongoing',
                  ),
                ),
                React.createElement(
                  'div',
                  { className: 'pavo-flow-detail-title' },
                  React.createElement('strong', null, selected.title),
                  React.createElement(
                    'span',
                    null,
                    `${selected.key || 'NO KEY'} · ${workspaceLabel(selected, workspaces)} · ${assigneeLabel(selected.assignee, agentPresets)} · WaterLevel ${selected.waterLevel}`,
                  ),
                ),
                React.createElement(
                  'button',
                  {
                    type: 'button',
                    className: 'pavo-button',
                    disabled: busy,
                    onClick: () => onOpenWork(selected),
                  },
                  'Edit Work',
                ),
                React.createElement(
                  'button',
                  {
                    type: 'button',
                    className: 'pavo-button',
                    disabled: busy,
                    onClick: () => onSaveWorkTemplate(selected),
                  },
                  'Save as template',
                ),
              ),
              React.createElement(
                'div',
                { className: 'pavo-flow-work-copy' },
                selected.description
                  ? React.createElement(
                      'p',
                      { className: 'pavo-flow-description' },
                      selected.description,
                    )
                  : React.createElement(
                      'div',
                      { className: 'pavo-flow-empty' },
                      'This Work has no Description yet.',
                    ),
                React.createElement(
                  'div',
                  { className: 'pavo-flow-detail-kicker' },
                  React.createElement('span', null, 'Upstream dependencies'),
                  React.createElement('span', null, String(upstreams.length)),
                ),
                upstreams.length === 0
                  ? React.createElement(
                      'div',
                      { className: 'pavo-flow-empty' },
                      'Drag from another Work handle to this Work to add an upstream dependency.',
                    )
                  : React.createElement(
                      'ul',
                      { className: 'pavo-upstream-list' },
                      upstreams.map(({ work, acknowledged, state }) =>
                        React.createElement(
                          'li',
                          { className: 'pavo-upstream-row', key: work.id },
                          React.createElement(
                            'div',
                            { className: 'pavo-upstream-head' },
                            React.createElement(
                              'span',
                              { className: 'pavo-upstream-title' },
                              React.createElement('strong', null, work.title),
                              React.createElement('span', null, work.id),
                            ),
                            React.createElement(
                              'span',
                              { className: `pavo-dependency-state pavo-dependency-state-${state}` },
                              state,
                            ),
                          ),
                          React.createElement(
                            'div',
                            { className: 'pavo-upstream-levels' },
                            React.createElement('span', null, `Current ${work.waterLevel}`),
                            React.createElement('span', null, `Handled ${acknowledged}`),
                          ),
                          React.createElement(
                            'div',
                            { className: 'pavo-upstream-actions' },
                            React.createElement(
                              'button',
                              {
                                type: 'button',
                                className: 'pavo-button',
                                disabled: busy || state === 'synchronized',
                                onClick: () =>
                                  onUpdateDependencies(selected.id, {
                                    ...selected.upstreamWaterLevels,
                                    [work.id]: work.waterLevel,
                                  }),
                              },
                              'Acknowledge current',
                            ),
                            React.createElement(
                              'button',
                              {
                                type: 'button',
                                className: 'pavo-button pavo-button-danger',
                                disabled: busy,
                                onClick: () => {
                                  const next = { ...selected.upstreamWaterLevels }
                                  delete next[work.id]
                                  onUpdateDependencies(selected.id, next)
                                },
                              },
                              'Remove',
                            ),
                          ),
                        ),
                      ),
                    ),
              ),
            )
          : selectedWorkflow
            ? React.createElement(
                React.Fragment,
                null,
                React.createElement(
                  'header',
                  { className: 'pavo-flow-detail-head' },
                  React.createElement(
                    'div',
                    { className: 'pavo-flow-detail-kicker' },
                    React.createElement('span', null, 'Workflow inspector'),
                    React.createElement('span', null, 'Container'),
                  ),
                  React.createElement(
                    'div',
                    { className: 'pavo-flow-detail-title' },
                    React.createElement('strong', null, selectedWorkflow.title),
                    React.createElement(
                      'span',
                      null,
                      `${data.works.filter((work) => work.workflowId === selectedWorkflow.id).length} direct Works · ${data.workflows.filter((item) => item.parentWorkflowId === selectedWorkflow.id).length} child Workflows`,
                    ),
                  ),
                  React.createElement(
                    'button',
                    {
                      type: 'button',
                      className: 'pavo-button pavo-button-primary',
                      disabled: busy,
                      onClick: () => onOpenWorkflow(selectedWorkflow.id),
                    },
                    'Open Workflow',
                  ),
                ),
                React.createElement(
                  'div',
                  { className: 'pavo-flow-work-copy' },
                  React.createElement(
                    'div',
                    { className: 'pavo-flow-empty' },
                    'Workflow containers organize direct children only. They do not execute Works, own WaterLevels, or aggregate dependencies.',
                  ),
                  React.createElement(
                    'button',
                    {
                      type: 'button',
                      className: 'pavo-button',
                      disabled: busy,
                      onClick: () => onEditWorkflow(selectedWorkflow),
                    },
                    'Rename Workflow',
                  ),
                  React.createElement(
                    'button',
                    {
                      type: 'button',
                      className: 'pavo-button',
                      disabled: busy,
                      onClick: () => onSaveWorkflowTemplate(selectedWorkflow),
                    },
                    'Save subtree as template',
                  ),
                  React.createElement(
                    'button',
                    {
                      type: 'button',
                      className: 'pavo-button pavo-button-danger',
                      disabled: busy,
                      onClick: () => onRemoveWorkflow(selectedWorkflow.id),
                    },
                    'Delete empty Workflow',
                  ),
                ),
              )
            : React.createElement(
                'div',
                { className: 'pavo-flow-empty' },
                'Add a Work or Workflow to this container.',
              ),
      ),
    )
  }

  function Board() {
    const [snapshot, setSnapshot] = React.useState(null)
    const [agentPresets, setAgentPresets] = React.useState([])
    const [dshWorkspaces, setDshWorkspaces] = React.useState([])
    const [error, setError] = React.useState(null)
    const [busy, setBusy] = React.useState(false)
    const [drawerMode, setDrawerMode] = React.useState('')
    const [drawerWorkId, setDrawerWorkId] = React.useState('')
    const [drawerRevision, setDrawerRevision] = React.useState('')
    const [drawerDraft, setDrawerDraft] = React.useState(() => emptyDraft())
    const [targetColumn, setTargetColumn] = React.useState('')
    const [viewMode, setViewMode] = React.useState(() => readViewMode())
    const [currentWorkflowId, setCurrentWorkflowId] = React.useState(ROOT_WORKFLOW_ID)
    const [selectedFlowNodeId, setSelectedFlowNodeId] = React.useState('')
    const [workflowDrawerMode, setWorkflowDrawerMode] = React.useState('')
    const [workflowDrawerId, setWorkflowDrawerId] = React.useState('')
    const [workflowDrawerTitle, setWorkflowDrawerTitle] = React.useState('')
    const [workflowDrawerRevision, setWorkflowDrawerRevision] = React.useState('')
    const [templateDrawerMode, setTemplateDrawerMode] = React.useState('')
    const [templateDrawerRevision, setTemplateDrawerRevision] = React.useState('')
    const [templateDraft, setTemplateDraft] = React.useState(null)
    const [templateTargetWorkflowId, setTemplateTargetWorkflowId] = React.useState(ROOT_WORKFLOW_ID)
    const [draggedWorkId, setDraggedWorkId] = React.useState('')
    const [snackbar, setSnackbar] = React.useState(null)
    const drawerCloseRef = React.useRef(null)
    const lastFocusRef = React.useRef(null)
    const requestSequence = React.useRef(0)
    const busyRef = React.useRef(false)
    const pollInFlight = React.useRef(false)

    const applySnapshot = React.useCallback((next) => {
      setSnapshot((current) =>
        current?.revision === next.revision &&
        current?.repositoryRevision === next.repositoryRevision
          ? current
          : next,
      )
      setTargetColumn((current) => current || next.board.columns[0]?.id || '')
      setSelectedFlowNodeId((current) => current)
      setError(typeof next.syncError === 'string' ? next.syncError : null)
    }, [])

    const load = React.useCallback(
      async (background = false) => {
        if (background && (pollInFlight.current || busyRef.current)) return
        if (background) pollInFlight.current = true
        const sequence = ++requestSequence.current
        try {
          const [next, presetResult, workspaceResult] = await Promise.all([
            request('overview', {}),
            request('agentPresets', {}).catch(() => null),
            request('workspaces', {}).catch(() => null),
          ])
          if (sequence === requestSequence.current) {
            if (Array.isArray(presetResult?.presets)) {
              setAgentPresets(presetResult.presets)
            }
            if (Array.isArray(workspaceResult?.workspaces)) {
              setDshWorkspaces(workspaceResult.workspaces)
            }
            applySnapshot(next)
          }
        } catch (nextError) {
          if (sequence === requestSequence.current) {
            setError(
              nextError instanceof Error ? nextError.message : String(nextError),
            )
          }
        } finally {
          if (background) pollInFlight.current = false
        }
      },
      [applySnapshot],
    )

    React.useEffect(() => {
      void load()
    }, [load])

    React.useEffect(() => {
      const intervalMs = snapshot?.pollIntervalMs
      if (!Number.isFinite(intervalMs) || intervalMs < 1_000) return undefined
      const timer = setInterval(() => {
        if (typeof document !== 'undefined' && document.hidden) return
        if (typeof navigator !== 'undefined' && navigator.onLine === false) return
        void load(true)
      }, intervalMs)
      return () => clearInterval(timer)
    }, [load, snapshot?.pollIntervalMs])

    React.useEffect(() => {
      const resume = () => {
        if (typeof document !== 'undefined' && document.hidden) return
        if (typeof navigator !== 'undefined' && navigator.onLine === false) return
        void load(true)
      }
      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', resume)
      }
      if (typeof window !== 'undefined') {
        window.addEventListener('focus', resume)
        window.addEventListener('online', resume)
      }
      return () => {
        if (typeof document !== 'undefined') {
          document.removeEventListener('visibilitychange', resume)
        }
        if (typeof window !== 'undefined') {
          window.removeEventListener('focus', resume)
          window.removeEventListener('online', resume)
        }
      }
    }, [load])

    React.useEffect(() => {
      if (!snapshot) return
      if (!snapshot.board.columns.some((column) => column.id === targetColumn)) {
        setTargetColumn(snapshot.board.columns[0]?.id || '')
      }
      if (
        !snapshot.board.workflows.some(
          (workflow) => workflow.id === currentWorkflowId,
        )
      ) {
        setCurrentWorkflowId(ROOT_WORKFLOW_ID)
        setSelectedFlowNodeId('')
        return
      }
      const selectedWorkId = domainNodeId(selectedFlowNodeId, 'work:')
      const selectedWorkflowId = domainNodeId(selectedFlowNodeId, 'workflow:')
      const selectedVisible =
        snapshot.board.works.some(
          (work) =>
            work.id === selectedWorkId && work.workflowId === currentWorkflowId,
        ) ||
        snapshot.board.workflows.some(
          (workflow) =>
            workflow.id === selectedWorkflowId &&
            workflow.parentWorkflowId === currentWorkflowId,
        )
      if (selectedFlowNodeId && !selectedVisible) setSelectedFlowNodeId('')
    }, [snapshot, targetColumn, currentWorkflowId, selectedFlowNodeId])

    React.useEffect(() => {
      if (!snackbar) return undefined
      const timer = setTimeout(() => setSnackbar(null), 6_000)
      return () => clearTimeout(timer)
    }, [snackbar])

    React.useEffect(() => {
      if (!drawerMode && !workflowDrawerMode && !templateDrawerMode) return undefined
      drawerCloseRef.current?.focus()
      const handleDrawerKeyDown = (event) => {
        if (event.key === 'Escape' && !busyRef.current) {
          if (templateDrawerMode) closeTemplateDrawer()
          else if (workflowDrawerMode) closeWorkflowDrawer()
          else closeDrawer()
          return
        }
        if (event.key !== 'Tab') return
        const drawer = drawerCloseRef.current?.closest('.pavo-drawer')
        const focusable = drawer
          ? Array.from(
              drawer.querySelectorAll(
                'button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled)',
              ),
            )
          : []
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
      document.addEventListener('keydown', handleDrawerKeyDown)
      return () => document.removeEventListener('keydown', handleDrawerKeyDown)
    }, [drawerMode, workflowDrawerMode, templateDrawerMode])

    React.useEffect(() => {
      if (!drawerWorkId || !snapshot) return
      if (!snapshot.board.works.some((card) => card.id === drawerWorkId)) {
        closeDrawer()
      }
    }, [drawerWorkId, snapshot])

    function selectViewMode(nextViewMode) {
      writeViewMode(nextViewMode)
      setViewMode(nextViewMode)
    }

    function friendlyMoveError(nextError) {
      const message =
        nextError instanceof Error ? nextError.message : String(nextError)
      if (/changed since it was loaded|stale|cannot move/iu.test(message)) {
        return 'The board changed elsewhere. The Work was restored while the latest board reloads.'
      }
      if (/git|repository|push|pull|sync/iu.test(message)) {
        return 'The move could not be synced to Git. The Work was restored; please try again.'
      }
      return 'The move could not be saved. The Work was restored; please try again.'
    }

    async function run(action) {
      if (busyRef.current) return false
      busyRef.current = true
      setBusy(true)
      const sequence = ++requestSequence.current
      try {
        const next = await action()
        if (sequence === requestSequence.current) applySnapshot(next)
        return true
      } catch (nextError) {
        if (sequence === requestSequence.current) {
          setError(nextError instanceof Error ? nextError.message : String(nextError))
        }
        return false
      } finally {
        busyRef.current = false
        setBusy(false)
      }
    }

    function mutationArgs(args) {
      return { ...args, expectedRevision: snapshot?.revision }
    }

    function rememberFocus() {
      if (typeof document !== 'undefined') {
        lastFocusRef.current = document.activeElement
      }
    }

    function openCreateDrawer() {
      if (!snapshot) return
      rememberFocus()
      setDrawerWorkId('')
      setDrawerRevision(snapshot.revision)
      setDrawerDraft(
        emptyDraft('', currentWorkflowId),
      )
      setTargetColumn(snapshot.board.columns[0]?.id || '')
      setDrawerMode('create')
    }

    function openDetailDrawer(work) {
      if (!work) return
      rememberFocus()
      setDrawerWorkId(work.id)
      setDrawerRevision(snapshot?.revision || '')
      setDrawerDraft({
        type: work.type,
        workspaceId: work.workspaceId,
        ...(work.legacyWorkspaceTitle
          ? { legacyWorkspaceTitle: work.legacyWorkspaceTitle }
          : {}),
        workflowId: work.workflowId,
        key: work.key,
        title: work.title,
        description: work.description,
        assignee: work.assignee,
        waterLevel: work.waterLevel,
        upstreamWaterLevels: { ...work.upstreamWaterLevels },
      })
      setDrawerMode('detail')
    }

    function closeDrawer() {
      if (busyRef.current) return
      setDrawerMode('')
      setDrawerWorkId('')
      setDrawerRevision('')
      setDrawerDraft(emptyDraft())
      lastFocusRef.current?.focus?.()
      lastFocusRef.current = null
    }

    function openCreateWorkflowDrawer() {
      if (!snapshot) return
      rememberFocus()
      setWorkflowDrawerId('')
      setWorkflowDrawerTitle('')
      setWorkflowDrawerRevision(snapshot.revision)
      setWorkflowDrawerMode('create-workflow')
    }

    function openEditWorkflowDrawer(workflow) {
      if (!snapshot || !workflow) return
      rememberFocus()
      setWorkflowDrawerId(workflow.id)
      setWorkflowDrawerTitle(workflow.title)
      setWorkflowDrawerRevision(snapshot.revision)
      setWorkflowDrawerMode('edit-workflow')
    }

    function closeWorkflowDrawer() {
      if (busyRef.current) return
      setWorkflowDrawerMode('')
      setWorkflowDrawerId('')
      setWorkflowDrawerTitle('')
      setWorkflowDrawerRevision('')
      lastFocusRef.current?.focus?.()
      lastFocusRef.current = null
    }

    function createWorkflow() {
      if (!snapshot || workflowDrawerTitle.trim().length === 0) return
      void run(() =>
        request('addWorkflow', {
          title: workflowDrawerTitle.trim(),
          parentWorkflowId: currentWorkflowId,
          expectedRevision: workflowDrawerRevision,
        }),
      ).then((saved) => {
        if (saved) closeWorkflowDrawer()
      })
    }

    function saveWorkflow() {
      if (!snapshot || !workflowDrawerId || workflowDrawerTitle.trim().length === 0) {
        return
      }
      void run(async () => {
        const next = await request('updateWorkflow', {
          workflowId: workflowDrawerId,
          title: workflowDrawerTitle.trim(),
          expectedRevision: workflowDrawerRevision,
        })
        setWorkflowDrawerRevision(next.revision)
        return next
      })
    }

    function removeWorkflow(workflowId) {
      if (!snapshot) return
      void run(() =>
        request('removeWorkflow', {
          workflowId,
          expectedRevision: snapshot.revision,
        }),
      ).then((saved) => {
        if (saved) setSelectedFlowNodeId('')
      })
    }

    function openWorkflow(workflowId) {
      if (!snapshot?.board.workflows.some((workflow) => workflow.id === workflowId)) {
        return
      }
      setCurrentWorkflowId(workflowId)
      setSelectedFlowNodeId('')
    }

    function openTemplateLibrary() {
      if (!snapshot) return
      rememberFocus()
      setTemplateDrawerRevision(snapshot.revision)
      setTemplateTargetWorkflowId(currentWorkflowId)
      setTemplateDraft(null)
      setTemplateDrawerMode('template-library')
    }

    function openCreateTemplate(kind) {
      if (!snapshot) return
      setTemplateDraft(
        kind === 'work'
          ? {
              kind: 'work',
              name: '',
              type: 'goal',
              workspaceId: '',
              key: '',
              title: '',
              description: '',
              assignee: { kind: 'unassigned' },
              waterLevel: '0',
              columnId: snapshot.board.columns[0]?.id || '',
            }
          : {
              kind: 'workflow',
              name: '',
              content: {
                rootWorkflowId: 'root',
                workflows: [
                  { id: 'root', title: 'New Workflow', parentWorkflowId: null },
                ],
                works: [],
              },
            },
      )
      setTemplateDrawerMode('template-edit')
    }

    function openCaptureTemplate(kind, source) {
      if (!snapshot || !source) return
      rememberFocus()
      setTemplateDrawerRevision(snapshot.revision)
      setTemplateDraft({
        kind,
        name: source.title,
        ...(kind === 'work'
          ? { sourceWorkId: source.id }
          : { sourceWorkflowId: source.id }),
      })
      setTemplateDrawerMode('template-edit')
    }

    function openEditTemplate(template) {
      if (!template) return
      if (template.kind === 'work') {
        setTemplateDraft({
          templateId: template.id,
          kind: 'work',
          name: template.name,
          ...template.content,
        })
      } else {
        setTemplateDraft({
          templateId: template.id,
          kind: 'workflow',
          name: template.name,
          content: template.content,
        })
      }
      setTemplateDrawerMode('template-edit')
    }

    function openApplyTemplate(template) {
      if (!template) return
      setTemplateDraft({ templateId: template.id, kind: template.kind })
      setTemplateTargetWorkflowId(currentWorkflowId)
      setTemplateDrawerMode('template-apply')
    }

    function showTemplateLibrary() {
      setTemplateDraft(null)
      setTemplateDrawerMode('template-library')
    }

    function closeTemplateDrawer() {
      if (busyRef.current) return
      setTemplateDrawerMode('')
      setTemplateDrawerRevision('')
      setTemplateDraft(null)
      lastFocusRef.current?.focus?.()
      lastFocusRef.current = null
    }

    function templateContentFromDraft() {
      if (templateDraft.kind === 'work') {
        return {
          type: templateDraft.type,
          workspaceId: templateDraft.workspaceId,
          ...(templateDraft.legacyWorkspaceTitle
            ? { legacyWorkspaceTitle: templateDraft.legacyWorkspaceTitle }
            : {}),
          key: templateDraft.key.trim(),
          title: templateDraft.title.trim(),
          description: templateDraft.description,
          assignee: templateDraft.assignee,
          waterLevel: templateDraft.waterLevel.trim(),
          columnId: templateDraft.columnId,
        }
      }
      return templateDraft.content
    }

    function saveTemplate() {
      if (!snapshot || !templateDraft?.name?.trim()) return
      const creating = !templateDraft.templateId
      const args = {
        name: templateDraft.name.trim(),
        expectedRevision: templateDrawerRevision,
        ...(creating
          ? { kind: templateDraft.kind }
          : { templateId: templateDraft.templateId }),
        ...(templateDraft.sourceWorkId
          ? { sourceWorkId: templateDraft.sourceWorkId }
          : templateDraft.sourceWorkflowId
            ? { sourceWorkflowId: templateDraft.sourceWorkflowId }
            : { content: templateContentFromDraft() }),
      }
      void run(async () => {
        const next = await request(
          creating ? 'addTemplate' : 'updateTemplate',
          args,
        )
        setTemplateDrawerRevision(next.revision)
        return next
      }).then((saved) => {
        if (saved) showTemplateLibrary()
      })
    }

    function deleteTemplate(templateId) {
      if (!snapshot) return
      if (
        typeof window !== 'undefined' &&
        typeof window.confirm === 'function' &&
        !window.confirm('Delete this template? Existing Works and Workflows are not affected.')
      ) {
        return
      }
      void run(async () => {
        const next = await request('removeTemplate', {
          templateId,
          expectedRevision: templateDrawerRevision,
        })
        setTemplateDrawerRevision(next.revision)
        return next
      })
    }

    function applySelectedTemplate() {
      if (!snapshot || !templateDraft?.templateId) return
      void run(async () => {
        const next = await request('instantiateTemplate', {
          templateId: templateDraft.templateId,
          targetWorkflowId: templateTargetWorkflowId,
          expectedRevision: templateDrawerRevision,
        })
        setTemplateDrawerRevision(next.revision)
        return next
      }).then((saved) => {
        if (saved) showTemplateLibrary()
      })
    }

    function addWork() {
      if (!snapshot || !isValidDraft(drawerDraft)) return
      const values = {
        type: drawerDraft.type,
        workspaceId: drawerDraft.workspaceId,
        ...(drawerDraft.legacyWorkspaceTitle
          ? { legacyWorkspaceTitle: drawerDraft.legacyWorkspaceTitle }
          : {}),
        workflowId: drawerDraft.workflowId,
        key: drawerDraft.key.trim(),
        title: drawerDraft.title.trim(),
        description: drawerDraft.description,
        assignee: drawerDraft.assignee,
        waterLevel: drawerDraft.waterLevel.trim(),
        upstreamWaterLevels: drawerDraft.upstreamWaterLevels,
        columnId: targetColumn,
      }
      void run(() =>
        request('addWork', { ...values, expectedRevision: drawerRevision }),
      ).then((saved) => {
        if (saved) closeDrawer()
      })
    }

    function moveCard(cardId, columnId) {
      if (!snapshot || busyRef.current) return
      const card = snapshot.board.works.find((candidate) => candidate.id === cardId)
      if (!card || card.columnId === columnId) return

      const previousSnapshot = snapshot
      const optimisticSnapshot = {
        ...previousSnapshot,
        board: {
          ...previousSnapshot.board,
          works: previousSnapshot.board.works.map((candidate) =>
            candidate.id === cardId ? { ...candidate, columnId } : candidate,
          ),
        },
      }
      const expectedRevision = previousSnapshot.revision
      busyRef.current = true
      setBusy(true)
      setError(null)
      setSnapshot(optimisticSnapshot)
      const sequence = ++requestSequence.current

      void request('moveWork', { workId: cardId, columnId, expectedRevision })
        .then((next) => {
          if (sequence === requestSequence.current) applySnapshot(next)
        })
        .catch((nextError) => {
          if (sequence !== requestSequence.current) return
          setSnapshot(previousSnapshot)
          setSnackbar({
            title: 'Move not saved',
            message: friendlyMoveError(nextError),
          })
        })
        .finally(() => {
          busyRef.current = false
          setBusy(false)
          if (sequence === requestSequence.current) void load(true)
        })
    }

    function removeWork(workId) {
      if (!snapshot) return
      void run(() =>
        request('removeWork', { workId, expectedRevision: drawerRevision }),
      ).then((saved) => {
        if (saved) closeDrawer()
      })
    }

    function saveDetails() {
      if (!drawerWorkId || !snapshot) return
      const currentCard = snapshot.board.works.find(
        (card) => card.id === drawerWorkId,
      )
      const valid = isValidDraft(drawerDraft)
      if (!currentCard || !valid) return
      const values = {
        workId: drawerWorkId,
        type: drawerDraft.type,
        workspaceId: drawerDraft.workspaceId,
        ...(drawerDraft.legacyWorkspaceTitle
          ? { legacyWorkspaceTitle: drawerDraft.legacyWorkspaceTitle }
          : {}),
        workflowId: drawerDraft.workflowId,
        key: drawerDraft.key.trim(),
        title: drawerDraft.title.trim(),
        description: drawerDraft.description,
        assignee: drawerDraft.assignee,
        waterLevel: drawerDraft.waterLevel.trim(),
        upstreamWaterLevels: drawerDraft.upstreamWaterLevels,
      }
      void run(async () => {
        const next = await request('updateWork', {
          ...values,
          expectedRevision: drawerRevision,
        })
        setDrawerRevision(next.revision)
        return next
      })
    }

    function updateDependencies(workId, upstreamWaterLevels) {
      if (!snapshot) return
      void run(() =>
        request(
          'updateWork',
          mutationArgs({ workId, upstreamWaterLevels }),
        ),
      )
    }

    function canMove(card, columnId) {
      if (!snapshot || card.columnId === columnId) return false
      const source = snapshot.workflow.find(
        (column) => column.id === card.columnId,
      )
      return source?.allowedTransitions.includes(columnId) === true
    }

    if (snapshot === null) {
      return React.createElement(
        'div',
        { className: 'pavo-root' },
        error
          ? React.createElement(
              React.Fragment,
              null,
              React.createElement('div', { className: 'pavo-error' }, error),
              React.createElement(
                'button',
                { className: 'pavo-button', onClick: () => void load() },
                'Retry',
              ),
            )
          : React.createElement('div', { className: 'pavo-loading' }, 'Loading board…'),
      )
    }

    const data = snapshot.board
    const currentWorkflowPath = workflowPath(data.workflows, currentWorkflowId)
    const draggedCard = data.works.find((card) => card.id === draggedWorkId)
    const columns = data.columns.map((column) => {
      const cards = data.works.filter((card) => card.columnId === column.id)
      const cardNodes = cards.map((card) =>
        React.createElement(
          'article',
          {
            key: card.id,
            className: 'pavo-work',
            draggable: !busy,
            onDragStart: (event) => {
              setDraggedWorkId(card.id)
              event.dataTransfer.setData('text/plain', card.id)
              event.dataTransfer.effectAllowed = 'move'
            },
            onDragEnd: () => setDraggedWorkId(''),
          },
          React.createElement(
            'button',
            {
              type: 'button',
              className: 'pavo-work-open',
              disabled: busy,
              'aria-label': `Open details for ${card.title}`,
              onClick: () => openDetailDrawer(card),
            },
            React.createElement(
              'div',
              { className: 'pavo-work-copy' },
              React.createElement(
                'div',
                { className: 'pavo-work-kicker' },
                React.createElement(
                  'span',
                  { className: 'pavo-work-key' },
                  card.key || 'NO KEY',
                ),
                React.createElement(
                  'span',
                  { className: 'pavo-work-workspace' },
                  workspaceLabel(card, dshWorkspaces),
                ),
              ),
              React.createElement('div', { className: 'pavo-work-title' }, card.title),
              card.description
                ? React.createElement(
                    'p',
                    { className: 'pavo-work-body' },
                    card.description,
                  )
                : null,
              React.createElement(
                'div',
                { className: 'pavo-work-meta' },
                React.createElement(
                  'span',
                  { className: `pavo-work-type pavo-work-type-${card.type}` },
                  card.type === 'goal' ? 'Goal' : 'Ongoing',
                ),
                React.createElement(
                  'span',
                  null,
                  `Assignee: ${assigneeLabel(card.assignee, agentPresets)}`,
                ),
                React.createElement('span', null, `WaterLevel: ${card.waterLevel}`),
                React.createElement(
                  'span',
                  null,
                  `${Object.keys(card.upstreamWaterLevels).length} upstream`,
                ),
              ),
            ),
          ),
        ),
      )

      const dropAllowed = draggedCard ? canMove(draggedCard, column.id) : false
      const dropBlocked =
        draggedCard && draggedCard.columnId !== column.id && !dropAllowed
      return React.createElement(
        'section',
        {
          key: column.id,
          className: `pavo-column${dropAllowed ? ' pavo-drop-allowed' : ''}${dropBlocked ? ' pavo-drop-blocked' : ''}`,
          onDragOver: (event) => {
            if (dropAllowed) event.preventDefault()
          },
          onDrop: (event) => {
            event.preventDefault()
            const cardId = event.dataTransfer.getData('text/plain')
            if (cardId && dropAllowed) moveCard(cardId, column.id)
            setDraggedWorkId('')
          },
        },
        React.createElement(
          'header',
          { className: 'pavo-column-head' },
          React.createElement('span', null, column.title),
          React.createElement('span', { className: 'pavo-count' }, String(cards.length)),
        ),
        React.createElement('div', { className: 'pavo-work-list' }, cardNodes),
      )
    })

    return React.createElement(
      'div',
      { className: 'pavo-root' },
      React.createElement(
        'div',
        { className: 'pavo-toolbar' },
        React.createElement(
          'div',
          { className: 'pavo-heading' },
          React.createElement('span', { className: 'pavo-title' }, 'Pavo'),
          React.createElement(
            'span',
            { className: 'pavo-status' },
            busy ? 'Committing and syncing…' : 'Git-backed · auto-sync on',
          ),
        ),
        React.createElement(
          'div',
          { className: 'pavo-toolbar-actions' },
          React.createElement(
            'div',
            { className: 'pavo-view-switch', 'aria-label': 'Pavo view' },
            React.createElement(
              'button',
              {
                type: 'button',
                'aria-pressed': viewMode === 'board',
                onClick: () => selectViewMode('board'),
              },
              'Board',
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                'aria-pressed': viewMode === 'flow',
                onClick: () => selectViewMode('flow'),
              },
              'Flow Canvas',
            ),
          ),
          React.createElement(
            'button',
            {
              type: 'button',
              className: 'pavo-button',
              disabled: busy,
              onClick: openTemplateLibrary,
            },
            'Templates',
          ),
          viewMode === 'flow'
            ? React.createElement(
                'button',
                {
                  type: 'button',
                  className: 'pavo-button',
                  disabled: busy,
                  onClick: openCreateWorkflowDrawer,
                },
                'New Workflow',
              )
            : null,
          React.createElement(
            'button',
            {
              type: 'button',
              className: 'pavo-button pavo-button-primary',
              disabled: busy,
              onClick: openCreateDrawer,
            },
            'New Work',
          ),
        ),
      ),
      error ? React.createElement('div', { className: 'pavo-error' }, error) : null,
      viewMode === 'flow'
        ? React.createElement(
            'div',
            { className: 'pavo-flow-shell' },
            React.createElement(
              'nav',
              { className: 'pavo-flow-breadcrumbs', 'aria-label': 'Workflow path' },
              ...currentWorkflowPath.flatMap((workflow, index) => [
                index > 0
                  ? React.createElement(
                      'span',
                      {
                        className: 'pavo-flow-breadcrumb-separator',
                        key: `separator-${workflow.id}`,
                      },
                      '/',
                    )
                  : null,
                React.createElement(
                  'button',
                  {
                    key: workflow.id,
                    type: 'button',
                    'aria-current': workflow.id === currentWorkflowId ? 'page' : undefined,
                    disabled: workflow.id === currentWorkflowId,
                    onClick: () => openWorkflow(workflow.id),
                  },
                  workflow.title,
                ),
              ]),
            ),
            React.createElement(FlowCanvas, {
              key: `${snapshot.repository?.repositoryPath || 'default'}:${snapshot.repository?.dataDirectory || 'kanban'}:${currentWorkflowId}`,
              layoutKey: `${snapshot.repository?.repositoryPath || 'default'}:${snapshot.repository?.dataDirectory || 'kanban'}:${currentWorkflowId}`,
              data,
              currentWorkflowId,
              selectedNodeId: selectedFlowNodeId,
              onSelectNode: setSelectedFlowNodeId,
              onOpenWork: openDetailDrawer,
              onOpenWorkflow: openWorkflow,
              onEditWorkflow: openEditWorkflowDrawer,
              onRemoveWorkflow: removeWorkflow,
              onSaveWorkTemplate: (work) => openCaptureTemplate('work', work),
              onSaveWorkflowTemplate: (workflow) =>
                openCaptureTemplate('workflow', workflow),
              onUpdateDependencies: updateDependencies,
              agentPresets,
              workspaces: dshWorkspaces,
              busy,
            }),
          )
        : React.createElement('div', { className: 'pavo-board' }, columns),
      React.createElement(WorkDrawer, {
        mode: drawerMode,
        work: data.works.find((work) => work.id === drawerWorkId),
        works: data.works,
        columns: data.columns,
        workspaces: dshWorkspaces,
        workflows: data.workflows,
        agentPresets,
        draft: drawerDraft,
        setDraft: setDrawerDraft,
        targetColumn,
        setTargetColumn,
        busy,
        stale: Boolean(drawerRevision && drawerRevision !== snapshot.revision),
        closeRef: drawerCloseRef,
        onClose: closeDrawer,
        onCreate: addWork,
        onSave: saveDetails,
        onRemove: removeWork,
        onSaveTemplate: (work) => {
          closeDrawer()
          openCaptureTemplate('work', work)
        },
      }),
      React.createElement(WorkflowDrawer, {
        mode: workflowDrawerMode,
        workflow: data.workflows.find(
          (workflow) => workflow.id === workflowDrawerId,
        ),
        title: workflowDrawerTitle,
        setTitle: setWorkflowDrawerTitle,
        busy,
        stale: Boolean(
          workflowDrawerRevision && workflowDrawerRevision !== snapshot.revision,
        ),
        closeRef: drawerCloseRef,
        onClose: closeWorkflowDrawer,
        onCreate: createWorkflow,
        onSave: saveWorkflow,
      }),
      React.createElement(TemplateLibraryDrawer, {
        mode: templateDrawerMode,
        templates: data.templates,
        workspaces: dshWorkspaces,
        columns: data.columns,
        workflows: data.workflows,
        agentPresets,
        draft: templateDraft,
        setDraft: setTemplateDraft,
        targetWorkflowId: templateTargetWorkflowId,
        setTargetWorkflowId: setTemplateTargetWorkflowId,
        busy,
        stale: Boolean(
          templateDrawerRevision && templateDrawerRevision !== snapshot.revision,
        ),
        closeRef: drawerCloseRef,
        onClose: closeTemplateDrawer,
        onShowLibrary: showTemplateLibrary,
        onCreate: openCreateTemplate,
        onEdit: openEditTemplate,
        onApply: openApplyTemplate,
        onDelete: deleteTemplate,
        onSave: saveTemplate,
        onInstantiate: applySelectedTemplate,
      }),
      snackbar
        ? React.createElement(
            'div',
            {
              className: 'pavo-snackbar',
              role: 'alert',
              'aria-live': 'assertive',
            },
            React.createElement('span', { className: 'pavo-snackbar-icon' }, '!'),
            React.createElement(
              'div',
              { className: 'pavo-snackbar-copy' },
              React.createElement(
                'strong',
                { className: 'pavo-snackbar-title' },
                snackbar.title,
              ),
              React.createElement(
                'span',
                { className: 'pavo-snackbar-message' },
                snackbar.message,
              ),
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                className: 'pavo-snackbar-close',
                title: 'Dismiss',
                'aria-label': 'Dismiss notification',
                onClick: () => setSnackbar(null),
              },
              '×',
            ),
          )
        : null,
    )
  }

  function PavoSettings() {
    const [repositoryInfo, setRepositoryInfo] = React.useState(null)
    const [repositoryDraft, setRepositoryDraft] = React.useState(null)
    const [dshWorkspaces, setDshWorkspaces] = React.useState([])
    const [busy, setBusy] = React.useState(false)
    const [error, setError] = React.useState(null)
    const [saved, setSaved] = React.useState(false)

    const applyRepositoryInfo = React.useCallback((info) => {
      setRepositoryInfo(info)
      setRepositoryDraft({ ...info.repository })
    }, [])

    const load = React.useCallback(async () => {
      try {
        const [info, workspaceResult] = await Promise.all([
          request('repositorySettings', {}),
          request('workspaces', {}),
        ])
        applyRepositoryInfo(info)
        setDshWorkspaces(
          Array.isArray(workspaceResult.workspaces)
            ? workspaceResult.workspaces
            : [],
        )
        setError(null)
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : String(nextError))
      }
    }, [applyRepositoryInfo])

    React.useEffect(() => {
      void load()
    }, [load])

    function updateRepositoryField(name, value) {
      setRepositoryDraft((current) => ({ ...current, [name]: value }))
      setSaved(false)
    }

    function saveRepository() {
      if (!repositoryDraft || !repositoryInfo || busy) return
      setBusy(true)
      setSaved(false)
      const repository = {
        ...repositoryDraft,
        repositoryPath: repositoryDraft.repositoryPath.trim(),
        dataDirectory: repositoryDraft.dataDirectory.trim(),
        branch: repositoryDraft.branch.trim(),
        remote: repositoryDraft.remote.trim(),
        pollIntervalMs: Number(repositoryDraft.pollIntervalMs),
        pullIntervalMs: Number(repositoryDraft.pullIntervalMs),
      }
      void request('saveRepository', {
        repository,
        expectedRepositoryRevision: repositoryInfo.repositoryRevision,
      })
        .then((info) => {
          applyRepositoryInfo(info)
          setSaved(true)
          setError(null)
        })
        .catch((nextError) => {
          setError(nextError instanceof Error ? nextError.message : String(nextError))
        })
        .finally(() => setBusy(false))
    }

    const repositoryValid =
      repositoryDraft &&
      repositoryDraft.repositoryPath.trim().length > 0 &&
      repositoryDraft.dataDirectory.trim().length > 0 &&
      repositoryDraft.branch.trim().length > 0 &&
      repositoryDraft.remote.trim().length > 0 &&
      Number.isSafeInteger(Number(repositoryDraft.pollIntervalMs)) &&
      Number(repositoryDraft.pollIntervalMs) >= 1_000 &&
      Number.isSafeInteger(Number(repositoryDraft.pullIntervalMs)) &&
      Number(repositoryDraft.pullIntervalMs) >= 1_000

    return React.createElement(
      'section',
      { className: 'pavo-settings' },
      React.createElement('h2', null, 'Pavo'),
      React.createElement(
        'p',
        { className: 'pavo-settings-copy' },
        'Manage the Git repository used by Pavo. Workspace choices come directly from DSH.'
      ),
      repositoryInfo?.settingsWarning
        ? React.createElement(
            'div',
            { className: 'pavo-settings-warning' },
            repositoryInfo.settingsWarning,
          )
        : null,
      error ? React.createElement('div', { className: 'pavo-error' }, error) : null,
      React.createElement(
        'section',
        { className: 'pavo-settings-section' },
        React.createElement('h3', null, 'Repository'),
        React.createElement(
          'p',
          null,
          'Pavo validates the checkout before switching. Saved values override the profile defaults on the next Host start.',
        ),
        repositoryDraft === null
          ? React.createElement(
              'div',
              { className: 'pavo-loading' },
              'Loading repository settings…',
            )
          : React.createElement(
              React.Fragment,
              null,
              React.createElement(
                'div',
                { className: 'pavo-settings-grid' },
                field(
                  'Repository path',
                  React.createElement('input', {
                    className: 'pavo-input',
                    value: repositoryDraft.repositoryPath,
                    disabled: busy,
                    spellCheck: false,
                    onChange: (event) =>
                      updateRepositoryField('repositoryPath', event.target.value),
                  }),
                  'pavo-settings-span',
                ),
                field(
                  'Data directory',
                  React.createElement('input', {
                    className: 'pavo-input',
                    value: repositoryDraft.dataDirectory,
                    disabled: busy,
                    spellCheck: false,
                    onChange: (event) =>
                      updateRepositoryField('dataDirectory', event.target.value),
                  }),
                ),
                field(
                  'Branch',
                  React.createElement('input', {
                    className: 'pavo-input',
                    value: repositoryDraft.branch,
                    disabled: busy,
                    spellCheck: false,
                    onChange: (event) =>
                      updateRepositoryField('branch', event.target.value),
                  }),
                ),
                field(
                  'Remote',
                  React.createElement('input', {
                    className: 'pavo-input',
                    value: repositoryDraft.remote,
                    disabled: busy,
                    spellCheck: false,
                    onChange: (event) =>
                      updateRepositoryField('remote', event.target.value),
                  }),
                ),
                field(
                  'Browser poll interval (ms)',
                  React.createElement('input', {
                    className: 'pavo-input',
                    type: 'number',
                    min: 1000,
                    step: 500,
                    value: repositoryDraft.pollIntervalMs,
                    disabled: busy,
                    onChange: (event) =>
                      updateRepositoryField('pollIntervalMs', event.target.value),
                  }),
                ),
                field(
                  'Git sync interval (ms)',
                  React.createElement('input', {
                    className: 'pavo-input',
                    type: 'number',
                    min: 1000,
                    step: 500,
                    value: repositoryDraft.pullIntervalMs,
                    disabled: busy,
                    onChange: (event) =>
                      updateRepositoryField('pullIntervalMs', event.target.value),
                  }),
                ),
              ),
              React.createElement(
                'div',
                { className: 'pavo-checks' },
                ...[
                  ['autoPull', 'Pull remote changes automatically'],
                  ['autoPush', 'Push Pavo commits automatically'],
                  ['initializeRepository', 'Initialize a missing repository'],
                ].map(([name, label]) =>
                  React.createElement(
                    'label',
                    { className: 'pavo-check', key: name },
                    React.createElement('input', {
                      type: 'checkbox',
                      checked: repositoryDraft[name],
                      disabled: busy,
                      onChange: (event) =>
                        updateRepositoryField(name, event.target.checked),
                    }),
                    React.createElement('span', null, label),
                  ),
                ),
              ),
              React.createElement(
                'div',
                { className: 'pavo-settings-actions' },
                saved
                  ? React.createElement(
                      'span',
                      { className: 'pavo-settings-saved', role: 'status' },
                      'Repository settings saved.',
                    )
                  : React.createElement('span'),
                React.createElement(
                  'button',
                  {
                    type: 'button',
                    className: 'pavo-button pavo-button-primary',
                    disabled: busy || !repositoryValid,
                    onClick: saveRepository,
                  },
                  busy ? 'Validating…' : 'Save repository',
                ),
              ),
            ),
      ),
      React.createElement(
        'section',
        { className: 'pavo-settings-section' },
        React.createElement('h3', null, 'DSH Workspaces'),
        React.createElement(
          'p',
          null,
          'Workspace choices are managed by DSH. Add, rename, reorder, or remove them from the DSH sidebar; Pavo stores stable Workspace IDs and follows title changes automatically.',
        ),
        dshWorkspaces.length === 0
          ? React.createElement(
              'div',
              { className: 'pavo-workspace-empty' },
              'No DSH Workspaces are currently registered.',
            )
          : React.createElement(
              'ul',
              { className: 'pavo-workspace-list' },
              dshWorkspaces.map((workspace) =>
                React.createElement(
                  'li',
                  { className: 'pavo-workspace-row', key: workspace.id },
                  React.createElement(
                    'span',
                    null,
                    workspaceRosterLabel(workspace, dshWorkspaces),
                  ),
                  React.createElement(
                    'small',
                    null,
                    workspace.unavailable ? 'Unavailable' : 'Available',
                  ),
                ),
              ),
            ),
      ),
    )
  }

  function apply(ctx) {
    const slots = ctx.get('slots')
    if (!slots) return

    ctx.effect(() => {
      if (typeof document === 'undefined') return () => {}
      if (document.querySelector(`style[data-plugin-css="${STYLE_ID}"]`)) {
        return () => {}
      }

      const element = document.createElement('style')
      element.dataset.plugin = '@dddrop/dsh-plugin-pavo'
      element.dataset.pluginCss = STYLE_ID
      element.textContent = `${XYFLOW_STYLES}\n${STYLES}`
      document.head.appendChild(element)
      return () => element.remove()
    })

    slots.inject('conversation.view', () =>
      slots.register(
        {
          name: 'conversation.view',
          id: 'pavo',
          order: 5,
          label: 'Pavo',
        },
        () => React.createElement(Board),
      ),
    )

    slots.inject('settings.section', () =>
      slots.register(
        {
          name: 'settings.section',
          id: 'pavo',
          order: 60,
          label: 'Pavo',
        },
        () => React.createElement(PavoSettings),
      ),
    )
  }

  return { apply }
})(React, XYFlow, "/* this gets exported as style.css and can be used for the default theming */\n/* these are the necessary styles for React/Svelte Flow, they get used by base.css and style.css */\n.react-flow {\n  direction: ltr;\n\n  --xy-edge-stroke-default: #b1b1b7;\n  --xy-edge-stroke-width-default: 1;\n  --xy-edge-stroke-selected-default: #555;\n\n  --xy-connectionline-stroke-default: #b1b1b7;\n  --xy-connectionline-stroke-width-default: 1;\n\n  --xy-attribution-background-color-default: rgba(255, 255, 255, 0.5);\n\n  --xy-minimap-background-color-default: #fff;\n  --xy-minimap-mask-background-color-default: rgba(240, 240, 240, 0.6);\n  --xy-minimap-mask-stroke-color-default: transparent;\n  --xy-minimap-mask-stroke-width-default: 1;\n  --xy-minimap-node-background-color-default: #e2e2e2;\n  --xy-minimap-node-stroke-color-default: transparent;\n  --xy-minimap-node-stroke-width-default: 2;\n\n  --xy-background-color-default: transparent;\n  --xy-background-pattern-dots-color-default: #91919a;\n  --xy-background-pattern-lines-color-default: #eee;\n  --xy-background-pattern-cross-color-default: #e2e2e2;\n  background-color: var(--xy-background-color, var(--xy-background-color-default));\n  --xy-node-color-default: inherit;\n  --xy-node-border-default: 1px solid #1a192b;\n  --xy-node-background-color-default: #fff;\n  --xy-node-group-background-color-default: rgba(240, 240, 240, 0.25);\n  --xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(0, 0, 0, 0.08);\n  --xy-node-boxshadow-selected-default: 0 0 0 0.5px #1a192b;\n  --xy-node-border-radius-default: 3px;\n\n  --xy-handle-background-color-default: #1a192b;\n  --xy-handle-border-color-default: #fff;\n\n  --xy-selection-background-color-default: rgba(0, 89, 220, 0.08);\n  --xy-selection-border-default: 1px dotted rgba(0, 89, 220, 0.8);\n\n  --xy-controls-button-background-color-default: #fefefe;\n  --xy-controls-button-background-color-hover-default: #f4f4f4;\n  --xy-controls-button-color-default: inherit;\n  --xy-controls-button-color-hover-default: inherit;\n  --xy-controls-button-border-color-default: #eee;\n  --xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, 0.08);\n\n  --xy-edge-label-background-color-default: #ffffff;\n  --xy-edge-label-color-default: inherit;\n  --xy-resize-background-color-default: #3367d9;\n}\n.react-flow.dark {\n  --xy-edge-stroke-default: #3e3e3e;\n  --xy-edge-stroke-width-default: 1;\n  --xy-edge-stroke-selected-default: #727272;\n\n  --xy-connectionline-stroke-default: #b1b1b7;\n  --xy-connectionline-stroke-width-default: 1;\n\n  --xy-attribution-background-color-default: rgba(150, 150, 150, 0.25);\n\n  --xy-minimap-background-color-default: #141414;\n  --xy-minimap-mask-background-color-default: rgba(60, 60, 60, 0.6);\n  --xy-minimap-mask-stroke-color-default: transparent;\n  --xy-minimap-mask-stroke-width-default: 1;\n  --xy-minimap-node-background-color-default: #2b2b2b;\n  --xy-minimap-node-stroke-color-default: transparent;\n  --xy-minimap-node-stroke-width-default: 2;\n\n  --xy-background-color-default: #141414;\n  --xy-background-pattern-dots-color-default: #555;\n  --xy-background-pattern-lines-color-default: #333;\n  --xy-background-pattern-cross-color-default: #333;\n  --xy-node-color-default: #f8f8f8;\n  --xy-node-border-default: 1px solid #3c3c3c;\n  --xy-node-background-color-default: #1e1e1e;\n  --xy-node-group-background-color-default: rgba(240, 240, 240, 0.25);\n  --xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(255, 255, 255, 0.08);\n  --xy-node-boxshadow-selected-default: 0 0 0 0.5px #999;\n\n  --xy-handle-background-color-default: #bebebe;\n  --xy-handle-border-color-default: #1e1e1e;\n\n  --xy-selection-background-color-default: rgba(200, 200, 220, 0.08);\n  --xy-selection-border-default: 1px dotted rgba(200, 200, 220, 0.8);\n\n  --xy-controls-button-background-color-default: #2b2b2b;\n  --xy-controls-button-background-color-hover-default: #3e3e3e;\n  --xy-controls-button-color-default: #f8f8f8;\n  --xy-controls-button-color-hover-default: #fff;\n  --xy-controls-button-border-color-default: #5b5b5b;\n  --xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, 0.08);\n\n  --xy-edge-label-background-color-default: #141414;\n  --xy-edge-label-color-default: #f8f8f8;\n}\n.react-flow__background {\n  background-color: var(--xy-background-color-props, var(--xy-background-color, var(--xy-background-color-default)));\n  pointer-events: none;\n  z-index: -1;\n}\n.react-flow__container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n}\n.react-flow__pane {\n  z-index: 1;\n  touch-action: none;\n}\n.react-flow__pane.draggable {\n    cursor: grab;\n  }\n.react-flow__pane.dragging {\n    cursor: grabbing;\n  }\n.react-flow__pane.selection {\n    cursor: pointer;\n  }\n.react-flow__viewport {\n  transform-origin: 0 0;\n  z-index: 2;\n  pointer-events: none;\n}\n.react-flow__renderer {\n  z-index: 4;\n}\n.react-flow__selection {\n  z-index: 6;\n}\n.react-flow__nodesselection-rect:focus,\n.react-flow__nodesselection-rect:focus-visible {\n  outline: none;\n}\n.react-flow__edge-path {\n  stroke: var(--xy-edge-stroke, var(--xy-edge-stroke-default));\n  stroke-width: var(--xy-edge-stroke-width, var(--xy-edge-stroke-width-default));\n  fill: none;\n}\n.react-flow__connection-path {\n  stroke: var(--xy-connectionline-stroke, var(--xy-connectionline-stroke-default));\n  stroke-width: var(--xy-connectionline-stroke-width, var(--xy-connectionline-stroke-width-default));\n  fill: none;\n}\n.react-flow .react-flow__edges {\n  position: absolute;\n}\n.react-flow .react-flow__edges svg {\n    overflow: visible;\n    position: absolute;\n    pointer-events: none;\n  }\n.react-flow__edge {\n  pointer-events: visibleStroke;\n}\n.react-flow__edge.selectable {\n    cursor: pointer;\n  }\n.react-flow__edge.animated path {\n    stroke-dasharray: 5;\n    animation: dashdraw 0.5s linear infinite;\n  }\n.react-flow__edge.animated path.react-flow__edge-interaction {\n    stroke-dasharray: none;\n    animation: none;\n  }\n.react-flow__edge.inactive {\n    pointer-events: none;\n  }\n.react-flow__edge.selected,\n  .react-flow__edge:focus,\n  .react-flow__edge:focus-visible {\n    outline: none;\n  }\n.react-flow__edge.selected .react-flow__edge-path,\n  .react-flow__edge.selectable:focus .react-flow__edge-path,\n  .react-flow__edge.selectable:focus-visible .react-flow__edge-path {\n    stroke: var(--xy-edge-stroke-selected, var(--xy-edge-stroke-selected-default));\n  }\n.react-flow__edge-textwrapper {\n    pointer-events: all;\n  }\n.react-flow__edge .react-flow__edge-text {\n    pointer-events: none;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n            user-select: none;\n  }\n/* Arrowhead marker styles - use CSS custom properties as default */\n.react-flow__arrowhead polyline {\n  stroke: var(--xy-edge-stroke, var(--xy-edge-stroke-default));\n}\n.react-flow__arrowhead polyline.arrowclosed {\n  fill: var(--xy-edge-stroke, var(--xy-edge-stroke-default));\n}\n.react-flow__connection {\n  pointer-events: none;\n}\n.react-flow__connection .animated {\n    stroke-dasharray: 5;\n    animation: dashdraw 0.5s linear infinite;\n  }\nsvg.react-flow__connectionline {\n  z-index: 1001;\n  overflow: visible;\n  position: absolute;\n}\n.react-flow__nodes {\n  pointer-events: none;\n  transform-origin: 0 0;\n}\n.react-flow__node {\n  position: absolute;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n  pointer-events: all;\n  transform-origin: 0 0;\n  box-sizing: border-box;\n  cursor: default;\n}\n.react-flow__node.selectable {\n    cursor: pointer;\n  }\n.react-flow__node.draggable {\n    cursor: grab;\n    pointer-events: all;\n  }\n.react-flow__node.draggable.dragging {\n      cursor: grabbing;\n    }\n.react-flow__nodesselection {\n  z-index: 3;\n  transform-origin: left top;\n  pointer-events: none;\n}\n.react-flow__nodesselection-rect {\n    position: absolute;\n    pointer-events: all;\n    cursor: grab;\n  }\n.react-flow__handle {\n  position: absolute;\n  pointer-events: none;\n  min-width: 5px;\n  min-height: 5px;\n  width: 6px;\n  height: 6px;\n  background-color: var(--xy-handle-background-color, var(--xy-handle-background-color-default));\n  border: 1px solid var(--xy-handle-border-color, var(--xy-handle-border-color-default));\n  border-radius: 100%;\n}\n.react-flow__handle.connectingfrom {\n    pointer-events: all;\n  }\n.react-flow__handle.connectionindicator {\n    pointer-events: all;\n    cursor: crosshair;\n  }\n.react-flow__handle-bottom {\n    top: auto;\n    left: 50%;\n    bottom: 0;\n    transform: translate(-50%, 50%);\n  }\n.react-flow__handle-top {\n    top: 0;\n    left: 50%;\n    transform: translate(-50%, -50%);\n  }\n.react-flow__handle-left {\n    top: 50%;\n    left: 0;\n    transform: translate(-50%, -50%);\n  }\n.react-flow__handle-right {\n    top: 50%;\n    right: 0;\n    transform: translate(50%, -50%);\n  }\n.react-flow__edgeupdater {\n  cursor: move;\n  pointer-events: all;\n}\n.react-flow__pane.selection .react-flow__panel {\n  pointer-events: none;\n}\n.react-flow__panel {\n  position: absolute;\n  z-index: 5;\n  margin: 15px;\n}\n.react-flow__panel.top {\n    top: 0;\n  }\n.react-flow__panel.bottom {\n    bottom: 0;\n  }\n.react-flow__panel.top.center, .react-flow__panel.bottom.center {\n      left: 50%;\n      transform: translateX(-15px) translateX(-50%);\n    }\n.react-flow__panel.left {\n    left: 0;\n  }\n.react-flow__panel.right {\n    right: 0;\n  }\n.react-flow__panel.left.center, .react-flow__panel.right.center {\n      top: 50%;\n      transform: translateY(-15px) translateY(-50%);\n    }\n.react-flow__attribution {\n  font-size: 10px;\n  background: var(--xy-attribution-background-color, var(--xy-attribution-background-color-default));\n  padding: 2px 3px;\n  margin: 0;\n}\n.react-flow__attribution a {\n    text-decoration: none;\n    color: #999;\n  }\n@keyframes dashdraw {\n  from {\n    stroke-dashoffset: 10;\n  }\n}\n.react-flow__edgelabel-renderer {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n  left: 0;\n  top: 0;\n}\n.react-flow__viewport-portal {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  left: 0;\n  top: 0;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n}\n.react-flow__minimap {\n  background: var(\n    --xy-minimap-background-color-props,\n    var(--xy-minimap-background-color, var(--xy-minimap-background-color-default))\n  );\n}\n.react-flow__minimap-svg {\n    display: block;\n  }\n.react-flow__minimap-mask {\n    fill: var(\n      --xy-minimap-mask-background-color-props,\n      var(--xy-minimap-mask-background-color, var(--xy-minimap-mask-background-color-default))\n    );\n    stroke: var(\n      --xy-minimap-mask-stroke-color-props,\n      var(--xy-minimap-mask-stroke-color, var(--xy-minimap-mask-stroke-color-default))\n    );\n    stroke-width: var(\n      --xy-minimap-mask-stroke-width-props,\n      var(--xy-minimap-mask-stroke-width, var(--xy-minimap-mask-stroke-width-default))\n    );\n  }\n.react-flow__minimap-node {\n    fill: var(\n      --xy-minimap-node-background-color-props,\n      var(--xy-minimap-node-background-color, var(--xy-minimap-node-background-color-default))\n    );\n    stroke: var(\n      --xy-minimap-node-stroke-color-props,\n      var(--xy-minimap-node-stroke-color, var(--xy-minimap-node-stroke-color-default))\n    );\n    stroke-width: var(\n      --xy-minimap-node-stroke-width-props,\n      var(--xy-minimap-node-stroke-width, var(--xy-minimap-node-stroke-width-default))\n    );\n  }\n.react-flow__background-pattern.dots {\n    fill: var(\n      --xy-background-pattern-color-props,\n      var(--xy-background-pattern-color, var(--xy-background-pattern-dots-color-default))\n    );\n  }\n.react-flow__background-pattern.lines {\n    stroke: var(\n      --xy-background-pattern-color-props,\n      var(--xy-background-pattern-color, var(--xy-background-pattern-lines-color-default))\n    );\n  }\n.react-flow__background-pattern.cross {\n    stroke: var(\n      --xy-background-pattern-color-props,\n      var(--xy-background-pattern-color, var(--xy-background-pattern-cross-color-default))\n    );\n  }\n.react-flow__controls {\n  display: flex;\n  flex-direction: column;\n  box-shadow: var(--xy-controls-box-shadow, var(--xy-controls-box-shadow-default));\n}\n.react-flow__controls.horizontal {\n    flex-direction: row;\n  }\n.react-flow__controls-button {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    height: 26px;\n    width: 26px;\n    padding: 4px;\n    border: none;\n    background: var(--xy-controls-button-background-color, var(--xy-controls-button-background-color-default));\n    border-bottom: 1px solid\n      var(\n        --xy-controls-button-border-color-props,\n        var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default))\n      );\n    color: var(\n      --xy-controls-button-color-props,\n      var(--xy-controls-button-color, var(--xy-controls-button-color-default))\n    );\n    cursor: pointer;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n            user-select: none;\n  }\n.react-flow__controls-button svg {\n      width: 100%;\n      max-width: 12px;\n      max-height: 12px;\n      fill: currentColor;\n    }\n.react-flow__edge.updating .react-flow__edge-path {\n      stroke: #777;\n    }\n.react-flow__edge-text {\n    font-size: 10px;\n  }\n.react-flow__node.selectable:focus,\n  .react-flow__node.selectable:focus-visible {\n    outline: none;\n  }\n.react-flow__node-input,\n.react-flow__node-default,\n.react-flow__node-output,\n.react-flow__node-group {\n  padding: 10px;\n  border-radius: var(--xy-node-border-radius, var(--xy-node-border-radius-default));\n  width: 150px;\n  font-size: 12px;\n  color: var(--xy-node-color, var(--xy-node-color-default));\n  text-align: center;\n  border: var(--xy-node-border, var(--xy-node-border-default));\n  background-color: var(--xy-node-background-color, var(--xy-node-background-color-default));\n}\n.react-flow__node-input.selectable:hover, .react-flow__node-default.selectable:hover, .react-flow__node-output.selectable:hover, .react-flow__node-group.selectable:hover {\n      box-shadow: var(--xy-node-boxshadow-hover, var(--xy-node-boxshadow-hover-default));\n    }\n.react-flow__node-input.selectable.selected,\n    .react-flow__node-input.selectable:focus,\n    .react-flow__node-input.selectable:focus-visible,\n    .react-flow__node-default.selectable.selected,\n    .react-flow__node-default.selectable:focus,\n    .react-flow__node-default.selectable:focus-visible,\n    .react-flow__node-output.selectable.selected,\n    .react-flow__node-output.selectable:focus,\n    .react-flow__node-output.selectable:focus-visible,\n    .react-flow__node-group.selectable.selected,\n    .react-flow__node-group.selectable:focus,\n    .react-flow__node-group.selectable:focus-visible {\n      box-shadow: var(--xy-node-boxshadow-selected, var(--xy-node-boxshadow-selected-default));\n    }\n.react-flow__node-group {\n  background-color: var(--xy-node-group-background-color, var(--xy-node-group-background-color-default));\n}\n.react-flow__nodesselection-rect,\n.react-flow__selection {\n  background: var(--xy-selection-background-color, var(--xy-selection-background-color-default));\n  border: var(--xy-selection-border, var(--xy-selection-border-default));\n}\n.react-flow__nodesselection-rect:focus,\n  .react-flow__nodesselection-rect:focus-visible,\n  .react-flow__selection:focus,\n  .react-flow__selection:focus-visible {\n    outline: none;\n  }\n.react-flow__controls-button:hover {\n      background: var(\n        --xy-controls-button-background-color-hover-props,\n        var(--xy-controls-button-background-color-hover, var(--xy-controls-button-background-color-hover-default))\n      );\n      color: var(\n        --xy-controls-button-color-hover-props,\n        var(--xy-controls-button-color-hover, var(--xy-controls-button-color-hover-default))\n      );\n    }\n.react-flow__controls-button:disabled {\n      pointer-events: none;\n    }\n.react-flow__controls-button:disabled svg {\n        fill-opacity: 0.4;\n      }\n.react-flow__controls-button:last-child {\n    border-bottom: none;\n  }\n.react-flow__controls.horizontal .react-flow__controls-button {\n    border-bottom: none;\n    border-right: 1px solid\n      var(\n        --xy-controls-button-border-color-props,\n        var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default))\n      );\n  }\n.react-flow__controls.horizontal .react-flow__controls-button:last-child {\n    border-right: none;\n  }\n.react-flow__resize-control {\n  position: absolute;\n}\n.react-flow__resize-control.left,\n.react-flow__resize-control.right {\n  cursor: ew-resize;\n}\n.react-flow__resize-control.top,\n.react-flow__resize-control.bottom {\n  cursor: ns-resize;\n}\n.react-flow__resize-control.top.left,\n.react-flow__resize-control.bottom.right {\n  cursor: nwse-resize;\n}\n.react-flow__resize-control.bottom.left,\n.react-flow__resize-control.top.right {\n  cursor: nesw-resize;\n}\n/* handle styles */\n.react-flow__resize-control.handle {\n  width: 5px;\n  height: 5px;\n  border: 1px solid #fff;\n  border-radius: 1px;\n  background-color: var(--xy-resize-background-color, var(--xy-resize-background-color-default));\n  translate: -50% -50%;\n}\n.react-flow__resize-control.handle.left {\n  left: 0;\n  top: 50%;\n}\n.react-flow__resize-control.handle.right {\n  left: 100%;\n  top: 50%;\n}\n.react-flow__resize-control.handle.top {\n  left: 50%;\n  top: 0;\n}\n.react-flow__resize-control.handle.bottom {\n  left: 50%;\n  top: 100%;\n}\n.react-flow__resize-control.handle.top.left {\n  left: 0;\n}\n.react-flow__resize-control.handle.bottom.left {\n  left: 0;\n}\n.react-flow__resize-control.handle.top.right {\n  left: 100%;\n}\n.react-flow__resize-control.handle.bottom.right {\n  left: 100%;\n}\n/* line styles */\n.react-flow__resize-control.line {\n  border-color: var(--xy-resize-background-color, var(--xy-resize-background-color-default));\n  border-width: 0;\n  border-style: solid;\n}\n.react-flow__resize-control.line.left,\n.react-flow__resize-control.line.right {\n  width: 1px;\n  transform: translate(-50%, 0);\n  top: 0;\n  height: 100%;\n}\n.react-flow__resize-control.line.left {\n  left: 0;\n  border-left-width: 1px;\n}\n.react-flow__resize-control.line.right {\n  left: 100%;\n  border-right-width: 1px;\n}\n.react-flow__resize-control.line.top,\n.react-flow__resize-control.line.bottom {\n  height: 1px;\n  transform: translate(0, -50%);\n  left: 0;\n  width: 100%;\n}\n.react-flow__resize-control.line.top {\n  top: 0;\n  border-top-width: 1px;\n}\n.react-flow__resize-control.line.bottom {\n  border-bottom-width: 1px;\n  top: 100%;\n}\n.react-flow__edge-textbg {\n  fill: var(--xy-edge-label-background-color, var(--xy-edge-label-background-color-default));\n}\n.react-flow__edge-text {\n  fill: var(--xy-edge-label-color, var(--xy-edge-label-color-default));\n}\n")
    exports.apply = plugin.apply
    return module.exports
  },
})
