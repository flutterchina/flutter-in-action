!function(t){function n(e){if(r[e])return r[e].exports;var i=r[e]={exports:{},id:e,loaded:!1};return t[e].call(i.exports,i,i.exports,n),i.loaded=!0,i.exports}var r={};return n.m=t,n.c=r,n.p="",n(0)}([function(t,n,r){r(1)(window)},function(t,n){t.exports=function(t){var n="RealXMLHttpRequest";t.hookAjax=function(t){function r(n){return function(){var r=this.hasOwnProperty(n+"_")?this[n+"_"]:this.xhr[n],e=(t[n]||{}).getter;return e&&e(r,this)||r}}function e(n){return function(r){var e=this.xhr,i=this,o=t[n];if("function"==typeof o)e[n]=function(){t[n](i)||r.apply(e,arguments)};else{var u=(o||{}).setter;r=u&&u(r,i)||r;try{e[n]=r}catch(t){this[n+"_"]=r}}}}function i(n){return function(){var r=[].slice.call(arguments);if(!t[n]||!t[n].call(this,r,this.xhr))return this.xhr[n].apply(this.xhr,r)}}return window[n]=window[n]||XMLHttpRequest,XMLHttpRequest=function(){var t=new window[n];for(var o in t){var u="";try{u=typeof t[o]}catch(t){}"function"===u?this[o]=i(o):Object.defineProperty(this,o,{get:r(o),set:e(o),enumerable:!0})}this.xhr=t},window[n]},t.unHookAjax=function(){window[n]&&(XMLHttpRequest=window[n]),window[n]=void 0},t.default=t}}]);

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
    _hmt.push(['_trackPageview', p]);
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

function hookAPI(api, ob, fn) {
    return function () {
        var result = api.apply(ob, [].slice.call(arguments));
        setTimeout(fn, 1000);
        return result;
    }
}

function addAD() {
    if ( $("#book-search-results .ad").length == 0) {
        $(".ad").clone().hide().fadeIn().prependTo("#book-search-results")
    }
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

if (history.pushState) {
    history.pushState = hookAPI(history.pushState, history, init);
}
