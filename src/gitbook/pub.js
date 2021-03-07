!function(t,n){for(var r in n)t[r]=n[r]}(window,function(t){function n(o){if(r[o])return r[o].exports;var e=r[o]={i:o,l:!1,exports:{}};return t[o].call(e.exports,e,e.exports,n),e.l=!0,e.exports}var r={};return n.m=t,n.c=r,n.i=function(t){return t},n.d=function(t,r,o){n.o(t,r)||Object.defineProperty(t,r,{configurable:!1,enumerable:!0,get:o})},n.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(r,"a",r),r},n.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},n.p="",n(n.s=2)}([function(t,n,r){"use strict";function o(t,n){var r={};for(var o in t)r[o]=t[o];return r.target=r.currentTarget=n,r}function e(t){function n(n){return function(){var r=this.hasOwnProperty(n+"_")?this[n+"_"]:this.xhr[n],o=(t[n]||{}).getter;return o&&o(r,this)||r}}function r(n){return function(r){var e=this.xhr,i=this,u=t[n];if("on"===n.substring(0,2))i[n+"_"]=r,e[n]=function(u){u=o(u,i),t[n]&&t[n].call(i,e,u)||r.call(i,u)};else{var c=(u||{}).setter;r=c&&c(r,i)||r,this[n+"_"]=r;try{e[n]=r}catch(t){}}}}function e(n){return function(){var r=[].slice.call(arguments);if(t[n]){var o=t[n].call(this,r,this.xhr);if(o)return o}return this.xhr[n].apply(this.xhr,r)}}return window[c]=window[c]||XMLHttpRequest,XMLHttpRequest=function(){var t=new window[c];for(var o in t){var i="";try{i=u(t[o])}catch(t){}"function"===i?this[o]=e(o):Object.defineProperty(this,o,{get:n(o),set:r(o),enumerable:!0})}var f=this;t.getProxy=function(){return f},this.xhr=t},window[c]}function i(){window[c]&&(XMLHttpRequest=window[c]),window[c]=void 0}Object.defineProperty(n,"__esModule",{value:!0});var u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};n.configEvent=o,n.hook=e,n.unHook=i;var c="_rxhr"},,function(t,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.ah=void 0;var o=r(0);n.ah={hook:o.hook,unHook:o.unHook}}]));

var _hmt = _hmt || [];
$("#bd").remove();
(function () {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?170231fea4f81697eb046edc1a91fe5b";
    var s = document.getElementsByTagName("script")[0];
    hm.id = "bd"
    s.parentNode.insertBefore(hm, s);
})();
var timer;
function init() {
    var p = location.pathname;
    if (p[p.length - 1] === '/') {
        p += "index.md"
    } else {
        p = p.split(".")[0] + ".md";
    }
    p = "https://github.com/flutterchina/flutter-in-action/blob/master/docs" + p;
    $(".pull-right .fa-edit").parent("a").attr("href", p);
    $("table").wrap("<div style='overflow: auto'></div>");
    //百度统计
    var e = /([http|https]:\/\/[a-zA-Z0-9\_\.]+\.baidu\.com)/gi, r = window.location.href,
        t = document.referrer;
    if (!e.test(r)) {
        var o = "https://sp0.baidu.com/9_Q4simg2RQJ8t7jm9iCKT-xh_/s.gif";
        t ? (o += "?r=" + encodeURIComponent(document.referrer), r && (o += "&l=" + r)) : r && (o += "?l=" + r);
        var i = new Image;
        i.src = o
    }
    $(".copyright,.maoyun").remove();
    $("<div class='copyright'> 版权所有，禁止私自转发、克隆网站。</div><div style='text-align: center' class='f-links'><a onclick='buy(\"link\")' href='https://item.jd.com/12816296.html' title='点击购买' target='_blank' > 购买实体书 </a> | <a  href='https://flutterchina.club/docs'> Flutter中文网 </a></div>").appendTo(".page-inner");
    $("<div style='text-align: center' class='maoyun'> <span style='position: relative; top: -3px; left: -4px'>感谢</span><a href='https://www.maoyuncloud.com/' target='_blank'><img src=//pcdn.flutterchina.club/imgs/maoyun.png height='20'></a></div>").appendTo(".page-inner");
}

function _track(p,url) {
    _hmt.push(['_trackEvent', 'ad', 'click', p]);
    setTimeout(function () {
        location.href = url
    }, 100);
}

function buy(p){
    _hmt.push(['_trackEvent', 'buy', 'click', p]);
}

init();

ah.hook({
    open: function (arg, xhr) {
        if (location.hostname !== 'localhost') {
            if (arg[1][0] === '.') arg[1] = arg[1].slice(1);
            arg[1] = "https://pcdn.flutterchina.club" + arg[1].replace(".html", ".1")
        }
    },
    setRequestHeader: function (arg) {
        if (arg[0] !== 'Accept') return true;
    },
    onload:function(xhr){
        setTimeout(function () {
            if ( $("#book-search-results .ad").length === 0) {
                $(".ad").clone().show().prependTo("#book-search-results")
            }
            var extension=xhr.responseURL.split(".").pop()
            if(extension!=='json'){
                console.log("jump:"+location.href)
                _hmt.push(['_trackPageview', location.pathname]);
                init()
            }
        });
    }
})
