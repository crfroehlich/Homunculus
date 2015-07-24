(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.FrontEnd = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MetaFire = require('./js/integrations/firebase');
var usersnap = require('./js/integrations/usersnap');
var riot = window.riot;
var Router = require('./js/core/Router');
var ga = require('./js/integrations/google.js');
var twitter = require('./js/integrations/twitter.js');
var facebook = require('./js/integrations/facebook.js');
var addThis = require('./js/integrations/addthis.js');

var config = function config() {
    var SITES = {
        CRL: {
            db: 'meta-map-production'
        },
        THINK_WATER: {
            db: 'thinkwater-production'
        }
    };

    var ret = {
        host: window.location.host,
        site: {}
    };
    var segments = ret.host.split('.');
    var first = segments[0];
    if (first === 'www') {
        first = segments[1];
    }
    switch (first.toLowerCase()) {
        case 'crlab':
        case 'meta-map-staging':
        case 'frontend':
            ret.site = SITES['CRL'];
            break;
        case 'thinkwater-production':
        case 'thinkwater-staging':
        case 'thinkwater':
            ret.site = SITES['THINK_WATER'];
            break;
        default:
            //For now, default to CRL
            ret.site = SITES['CRL'];
            break;
    }

    return ret;
};

var FrontEnd = (function () {
    function FrontEnd(tags) {
        _classCallCheck(this, FrontEnd);

        this.tags = tags;
        this.config = config();

        this.MetaFire = new MetaFire(this.config);
        this.socialFeatures = [];
    }

    _createClass(FrontEnd, [{
        key: 'initSocial',
        value: function initSocial() {
            _.each(this.socialFeatures, function (feature) {
                if (feature) feature();
            });
        }
    }, {
        key: 'init',
        value: function init() {
            var _this = this;

            this.MetaFire.on('config', function (data) {
                _.extend(_this.config.site, data);
                document.title = _this.config.site.title;
                var favico = document.getElementById('favico');
                favico.setAttribute('href', _this.config.site.imageUrl + 'favicon.ico');

                ga(_this.config.site.google);
                _this.socialFeatures.push(twitter());
                _this.socialFeatures.push(facebook());
                _this.socialFeatures.push(addThis(_this.config.site.addthis.pubid));
                usersnap();

                riot.mount('*');
                _this.Router = new Router();
            });
        }
    }, {
        key: 'log',
        value: function log(val) {
            if (window.ga) {
                window.ga('send', 'event', 'log', 'label', val);
            }
            console.log(val);
        }
    }, {
        key: 'error',
        value: function error(val) {
            if (window.ga) {
                window.ga('send', 'exception', {
                    'exDescription': val.message,
                    'exFatal': true
                });
            }
            console.log(val);
        }
    }, {
        key: 'login',
        value: function login() {
            var self = this;
            this.Auth0.login().then(function (profile) {});
        }
    }, {
        key: 'logout',
        value: function logout() {
            this.MetaFire.logout();
        }
    }, {
        key: 'site',
        get: function get() {
            return 'frontend';
        }
    }]);

    return FrontEnd;
})();

module.exports = FrontEnd;

},{"./js/core/Router":3,"./js/integrations/addthis.js":4,"./js/integrations/facebook.js":5,"./js/integrations/firebase":6,"./js/integrations/google.js":7,"./js/integrations/twitter.js":8,"./js/integrations/usersnap":9}],2:[function(require,module,exports){
'use strict';

require('babel/polyfill');
window.riot = require('riot');
window._ = require('lodash');
window.Promise = require('bluebird');
require('core-js');
window.$ = window.jQuery = require('jquery');
require('jquery-ui');
require('bootstrap');
window.Firebase = require('firebase');
window.Firepad = require('firepad');
window.Humanize = require('humanize-plus');
window.moment = require('moment');
window.URI = require('URIjs');
window.localforage = require('localforage');
window.Ps = require('perfect-scrollbar');

var tags = ['page-head', 'page-banner', 'page-impact', 'page-countmein', 'page-footer', 'page-navbar-menu', 'page-navbar', 'page-news', 'page-explore', 'page-message', 'page-methodology', 'page-testimonials'];

require('./tags/pages/blog-page.tag');
require('./tags/pages/manifesto-page.tag');
require('./tags/pages/stms-page.tag');
require('./tags/pages/not-found-page.tag');
require('./tags/components/buttons.tag');
require('./tags/components/dynamic-page.tag');
require('./tags/page-banner.tag');
require('./tags/page-impact.tag');
require('./tags/page-countmein.tag');
require('./tags/page-footer.tag');
require('./tags/page-navbar-menu.tag');
require('./tags/page-navbar.tag');
require('./tags/page-news.tag');
require('./tags/page-explore.tag');
require('./tags/page-message.tag');
require('./tags/page-methodology.tag');
require('./tags/page-testimonials.tag');
require('./tags/page-main.tag');

var configMixin = require('./js/mixins/config.js');
riot.mixin('config', configMixin);

riot.tag('raw', '<span></span>', function (opts) {
    var _this = this;

    this.updateContent = function () {
        this.root.innerHTML = opts ? opts.content || '' : '';
    };

    this.on('update', function () {
        _this.updateContent();
    });

    this.updateContent();
});

var FrontEnd = require('./FrontEnd');
module.exports = new FrontEnd(tags);

},{"./FrontEnd":1,"./js/mixins/config.js":10,"./tags/components/buttons.tag":11,"./tags/components/dynamic-page.tag":12,"./tags/page-banner.tag":13,"./tags/page-countmein.tag":14,"./tags/page-explore.tag":15,"./tags/page-footer.tag":16,"./tags/page-impact.tag":17,"./tags/page-main.tag":18,"./tags/page-message.tag":19,"./tags/page-methodology.tag":20,"./tags/page-navbar-menu.tag":21,"./tags/page-navbar.tag":22,"./tags/page-news.tag":23,"./tags/page-testimonials.tag":24,"./tags/pages/blog-page.tag":25,"./tags/pages/manifesto-page.tag":26,"./tags/pages/not-found-page.tag":27,"./tags/pages/stms-page.tag":28,"URIjs":undefined,"babel/polyfill":"babel/polyfill","bluebird":undefined,"bootstrap":undefined,"core-js":undefined,"firebase":undefined,"firepad":undefined,"humanize-plus":undefined,"jquery":undefined,"jquery-ui":undefined,"localforage":undefined,"lodash":undefined,"moment":undefined,"perfect-scrollbar":undefined,"riot":"riot"}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var staticRoutes = {
    'contact': true,
    'home': true,
    'explore': true
};

var isHidden = false;
var toggleMain = function toggleMain(hide, path) {
    track(path);
    if (hide) {
        isHidden = true;
        $('#main').hide();
        $('#at4-share').parent().show();
    } else {
        isHidden = false;
        $('#at4-share').parent().hide();
        $('#main').show();
        $('dynamic-page').empty();
    }
};

var track = function track(path) {
    if (window.ga) {
        window.ga('set', {
            page: path
        });
        window.ga('send', 'pageview');
    }
};

var Router = (function () {
    function Router() {
        var _this = this;

        _classCallCheck(this, Router);

        riot.route.start();
        riot.route(function (target) {
            var path = _this.getPath(target);
            if (!staticRoutes[path]) {
                toggleMain(true, path);
                riot.mount('dynamic-page', { id: path });
            } else {
                toggleMain(false, path);
            }
        });
        this.to(window.location.hash || 'home');
    }

    _createClass(Router, [{
        key: 'getPath',
        value: function getPath(path) {
            return route.getPath(path);
        }
    }, {
        key: 'to',
        value: function to(path) {
            return route.to(path);
        }
    }], [{
        key: 'getPath',
        value: function getPath(path) {
            if (path) {
                while (path.startsWith('!') || path.startsWith('#')) {
                    path = path.substr(1);
                }
            }
            return path;
        }
    }, {
        key: 'to',
        value: function to(path) {
            path = route.getPath(path);
            if (path) {
                if (staticRoutes[path]) {
                    toggleMain(false, path);
                    riot.route(path);
                } else {
                    toggleMain(true, path);
                    riot.route('!' + path);
                }
            }
        }
    }]);

    return Router;
})();

var route = Router;

module.exports = Router;

},{}],4:[function(require,module,exports){
"use strict";

var addThis = function addThis(apiKey) {

    (function (d, s, id) {
        var js,
            fjs = d.getElementsByTagName(s)[0],
            t = window.addthis || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "//s7.addthis.com/js/300/addthis_widget.js#pubid=" + apiKey;
        fjs.parentNode.insertBefore(js, fjs);

        t._e = [];
        t.ready = function (f) {
            t._e.push(f);
        };

        return t;
    })(document, "script", "add-this-js");

    var init = function init() {
        window.addthis.ready(function () {
            if (["#home", "#contact"].indexOf(window.location.hash) >= 0) {
                var tryCount = 0;
                var hideShares = function hideShares(keepGoing) {
                    if ($("#at4-share") && $("#at4-share").length >= 1) {
                        $("#at4-share").parent().hide();
                        if (keepGoing) {
                            _.delay(hideShares, 3000);
                        }
                    } else {
                        tryCount += 1;
                        if (tryCount < 60) {
                            _.delay(hideShares, 250);
                        }
                    }
                };
                hideShares(true);
            }
        });
    };
    return init;
};

module.exports = addThis;

},{}],5:[function(require,module,exports){
'use strict';

var facebookApi = function facebookApi(apiKey) {

    window.fbAsyncInit = function () {
        window.FB.init({
            appId: '847702775304906',
            xfbml: true,
            version: 'v2.3'
        });

        window.FB.Event.subscribe('edge.create', function (targetUrl) {
            window.ga('send', 'social', 'facebook', 'like', targetUrl);
        });

        window.FB.Event.subscribe('edge.remove', function (targetUrl) {
            window.ga('send', 'social', 'facebook', 'unlike', targetUrl);
        });

        window.FB.Event.subscribe('message.send', function (targetUrl) {
            window.ga('send', 'social', 'facebook', 'send', targetUrl);
        });
    };

    (function (d, s, id) {
        var js,
            fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = '//connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');

    return window.fbAsyncInit;
};

module.exports = facebookApi;

},{}],6:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Firebase = window.Firebase; //require('firebase');
var Promise = window.Promise;
var localforage = window.localforage;
var MetaMap = window.MetaMap;

var MetaFire = (function () {
    function MetaFire(config) {
        _classCallCheck(this, MetaFire);

        this.config = config;
        this.fb = new Firebase('https://' + this.config.site.db + '.firebaseio.com');
    }

    _createClass(MetaFire, [{
        key: 'login',
        value: function login() {
            var _this = this;

            var that = this;
            var ret = new Promise(function (fulfill, reject) {
                localforage.getItem('id_token').then(function (id_token) {
                    MetaMap.Auth0.getSession().then(function (profile) {

                        MetaMap.Auth0.lock.getClient().getDelegationToken({
                            target: profile.clientID,
                            id_token: id_token,
                            api_type: 'firebase'
                        }, function (err, delegationResult) {
                            that.firebase_token = delegationResult.id_token;
                            localforage.setItem('firebase_token', that.firebase_token);
                            _this.fb.authWithCustomToken(that.firebase_token, function (error, authData) {
                                if (error) {
                                    reject(error);
                                } else {
                                    fulfill(authData);
                                }
                            });
                        });
                    });
                });
            });
            return ret;
        }
    }, {
        key: 'getChild',
        value: function getChild(path) {
            return this.fb.child(path);
        }
    }, {
        key: 'getData',
        value: function getData(path) {
            var child = this.fb;
            if (path) {
                child = this.getChild(path);
            }
            var promise = new Promise(function (resolve, reject) {
                child.orderByChild('order').on('value', function (snapshot) {
                    var data = snapshot.val();
                    try {
                        resolve(data);
                    } catch (e) {
                        window.FrontEnd.error(e);
                    }
                }, function (error) {
                    reject(error);
                });
            });

            return promise;
        }
    }, {
        key: 'on',
        value: function on(path, callback) {
            var event = arguments.length <= 2 || arguments[2] === undefined ? 'value' : arguments[2];

            if (path) {
                var child = this.getChild(path);
                child.orderByChild('order').on(event, function (snapshot) {
                    var data = snapshot.val();
                    try {
                        callback(data);
                    } catch (e) {
                        window.FrontEnd.error(e);
                    }
                });
            }
        }
    }, {
        key: 'setData',
        value: function setData(data, path) {
            var child = this.fb;
            if (path) {
                child = this.getChild(path);
            }
            return child.set(data);
        }
    }, {
        key: 'logout',
        value: function logout() {
            this.fb.unauth();
        }
    }]);

    return MetaFire;
})();

module.exports = MetaFire;

},{}],7:[function(require,module,exports){
'use strict';

var googleAnalytics = function googleAnalytics(api) {

    // Google Plus API
    (function () {
        var po = document.createElement('script');po.type = 'text/javascript';po.async = true;
        po.src = 'https://apis.google.com/js/platform.js';
        var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(po, s);
    })();

    //Google Tag Manager API
    (function (w, d, s, l, i) {
        w[l] = w[l] || [];w[l].push({
            'gtm.start': new Date().getTime(), event: 'gtm.js'
        });var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = l != 'dataLayer' ? '&l=' + l : '';j.async = true;j.src = '//www.googletagmanager.com/gtm.js?id=' + i + dl;f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', api.tagmanager);

    // Google Analytics API
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments);
        }, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;
        m.parentNode.insertBefore(a, m);
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

    window.ga('create', api.analytics, 'auto');
    window.ga('send', 'pageview');
    return window.ga;
};

module.exports = googleAnalytics;

},{}],8:[function(require,module,exports){
// Define our custom event handlers
'use strict';

function clickEventToAnalytics(intentEvent) {
    if (!intentEvent) return;
    var label = intentEvent.region;
    window.ga('send', 'social', 'twitter', intentEvent.type, label);
}

function tweetIntentToAnalytics(intentEvent) {
    if (!intentEvent) return;
    var label = 'tweet';
    window.ga('send', 'social', 'twitter', intentEvent.type, label);
}

function favIntentToAnalytics(intentEvent) {
    tweetIntentToAnalytics(intentEvent);
}

function retweetIntentToAnalytics(intentEvent) {
    if (!intentEvent) return;
    var label = intentEvent.data.source_tweet_id;
    window.ga('send', 'social', 'twitter', intentEvent.type, label);
}

function followIntentToAnalytics(intentEvent) {
    if (!intentEvent) return;
    var label = intentEvent.data.user_id + ' (' + intentEvent.data.screen_name + ')';
    window.ga('send', 'social', 'twitter', intentEvent.type, label);
}

var twitterApi = function twitterApi(apiKey) {

    window.twttr = (function (d, s, id) {
        var js,
            fjs = d.getElementsByTagName(s)[0],
            t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = 'https://platform.twitter.com/widgets.js';
        fjs.parentNode.insertBefore(js, fjs);

        t._e = [];
        t.ready = function (f) {
            t._e.push(f);
        };

        return t;
    })(document, 'script', 'twitter-wjs');

    window.twttr.ready(function (twitter) {
        twitter.widgets.load();
        twitter.events.bind('click', clickEventToAnalytics);
        twitter.events.bind('tweet', tweetIntentToAnalytics);
        twitter.events.bind('retweet', retweetIntentToAnalytics);
        twitter.events.bind('favorite', favIntentToAnalytics);
        twitter.events.bind('follow', followIntentToAnalytics);
    });

    var tryCount = 0;
    var load = function load() {
        if (window.twttr && window.twttr.widgets) {
            return window.twttr.widgets.load();
        } else if (tryCount < 5) {
            tryCount += 1;
            _.delay(load, 250);
        }
    };

    return load;
};

module.exports = twitterApi;

},{}],9:[function(require,module,exports){
'use strict';

var userSnap = function userSnap(config) {
    var apiKey = '032baf87-8545-4ebc-a557-934859371fa5.js',
        s,
        x;
    if (config == null) {
        config = {};
    }
    apiKey = config.USER_SNAP_API_KEY;
    if (apiKey && window.location.hostname !== 'localhost') {
        window.usersnapconfig = {
            mode: 'report',
            shortcut: true,
            beforeOpen: function beforeOpen(obj) {
                return UserSnap.setEmailBox(Doc.app.user.userName);
            }
        };
        s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = '//api.usersnap.com/load/' + apiKey + '.js';
        x = document.getElementsByTagName('head')[0];
        return x.appendChild(s);
    }
};

module.exports = userSnap;

},{}],10:[function(require,module,exports){
'use strict';

var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function inWords(num) {
    if (!num || (num = num.toString()).length > 9) return 'overflow';
    var n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;var str = '';
    str += n[1] != 0 ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += n[2] != 0 ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += n[3] != 0 ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += n[4] != 0 ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += n[5] != 0 ? (str != '' ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + '' : '';
    return str;
}

var config = {
    pathImg: function pathImg(folder) {
        var ret = '' + window.FrontEnd.config.site.imageUrl;
        if (folder) {
            ret += folder + '/';
        }
        return ret;
    },
    getData: function getData(path, callback, that) {
        window.FrontEnd.MetaFire.on(window.FrontEnd.site + '/' + path, function (data) {
            that.data = data;
            that.update();
            if (callback) {
                callback(data);
            }
        });
    },
    watchData: function watchData(path, callback) {
        window.FrontEnd.MetaFire.on(window.FrontEnd.site + '/' + path, function (data) {
            if (callback) {
                callback(data);
            }
        });
    },
    numberToWords: inWords
};

module.exports = config;

},{}],11:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('buttons', '<div class="row center-heading"> <span each="{ _.sortBy(opts.buttons,\'order\') }"> <a if="{ !amazonid }" role="button" href="{ link }" target="_blank" class="btn btn-lg btn-theme-dark" style="margin-right: 10px;"> { title } </a> <div if="{ amazonid }" class="col-sm-{ parent.cell } "> <iframe style="width: 120px; height: 240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" riot-src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=cabrreselab-20&marketplace=amazon&region=US&placement={ amazonid }&asins={ amazonid }&linkId=DIY3TUOPDFH3NQWF&show_border=false&link_opens_in_new_window=true"></iframe> </div> </span> </div>', function(opts) {var _this = this;

this.cell = 6;
this.on('mount', function () {
    if (opts && opts.buttons) {
        _this.cell = Math.round(12 / _.keys(opts.buttons).length);
        _this.update();
    }
});
});
},{"riot":"riot"}],12:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('dynamic-page', '<section id="{ _.kebabCase(data.title) }" > <div class="divide50"></div> <div class="container"> <div id="modal_dialog_container"> </div> </div> </section>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();
this.height = window.innerHeight - 75;
this.on('mount', function () {
    if (opts && opts.id && opts.id != '#') {

        FrontEnd.MetaFire.getData(FrontEnd.site + '/explore/items/' + opts.id).then(function (data) {
            var dialogClass = 'blog-page';

            if (opts.id == 'the-systems-thinking-manifesto-poster') {
                data = data || {};
                dialogClass = 'manifesto-page';
            } else if (opts.id == 'stms') {
                data = data || {};
                dialogClass = 'stms-page';
            } else if (!data) {
                data = data || {};
                dialogClass = 'not-found-page';
            }

            if (data) {

                _this.update();

                opts.event = {
                    item: data,
                    id: opts.id,
                    dialog: _this.modal
                };

                riot.mount(_this.modal_dialog_container, dialogClass, opts);
            }
        });
    }
});
});
},{"riot":"riot"}],13:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-banner', '<div class="fullwidthbanner"> <div id="tp_banner" class="tp-banner"> <ul>  <li each="{ data }" data-transition="fade" data-slotamount="5" data-title="{ title }" style="background: rgb(240,110,30);" >  <img if="{ !youtubeid && img && img != \'undefined\' }" riot-src="{ parent.url + img + \'?banner\' }" alt="darkblurbg" data-bgfit="cover" data-bgposition="left top" data-bgrepeat="no-repeat"> <div if="{ !youtubeid && title }" class="caption title-2 sft" data-x="50" data-y="100" data-speed="1000" data-start="1000" data-easing="easeOutExpo"> <raw content="{ title }"></raw> </div> <div if="{ !youtubeid && subtext }" class="caption text sfl" data-x="50" data-y="220" data-speed="1000" data-start="1800" data-easing="easeOutExpo"> <raw content="{ subtext }"></raw> </div> <div if="{ !youtubeid }" each="{ _.sortBy(buttons, \'order\') }"> <div class="caption sfb rev-buttons tp-resizeme" data-x="50" data-y="355" data-speed="500" data-start="1800" data-easing="Sine.easeOut" onclick="{ parent.getLink }"> <a href="{ link || \'\' }" target="{ target || \'\'}" class="btn btn-lg btn-theme-dark">{ title }</a> </div> </div> <div if="{ youtubeid }" class="tp-caption sft customout tp-videolayer" data-x="center" data-hoffset="0" data-y="center" data-voffset="0" data-customin="x:0;y:0;z:0;rotationX:0;rotationY:0;rotationZ:0;scaleX:5;scaleY:5;skewX:0;skewY:0;opacity:0;transformPerspective:600;transformOrigin:50% 50%;" data-customout="x:0;y:0;z:0;rotationX:0;rotationY:0;rotationZ:0;scaleX:0.75;scaleY:0.75;skewX:0;skewY:0;opacity:0;transformPerspective:600;transformOrigin:50% 50%;" data-speed="600" data-start="1000" data-easing="Power4.easeOut" data-endspeed="500" data-endeasing="Power4.easeOut" data-autoplay="true" data-autoplayonlyfirsttime="false" data-nextslideatend="false" data-thumbimage="https://img.youtube.com/vi/{ youtubeid }/mqdefault.jpg"> <iframe riot-src="https://www.youtube.com/embed/{ youtubeid }?hd=1&wmode=opaque&controls=1&showinfo=0" width="1066px" height="600px" style="width:1066px;height:600px;" > </iframe> </div> </li> </ul> </div> </div>', 'id="home"', function(opts) {var _this = this;

this.data = [];
this.mixin('config');
this.url = this.pathImg('site');
this.mounted = false;

this.watchData('/banner', function (data) {
    try {
        if (false == _this.mounted) {
            _this.mounted = true;
            _this.data = _.filter(_.sortBy(data, 'order'), function (i) {
                return i.archive != true;
            });
            _this.update();

            $(_this.tp_banner).revolution({
                stopAtSlide: 1,
                stopAfterLoops: 0,
                startwidth: 1170,
                startheight: 600,
                hideThumbs: 10
                //fullWidth: "on",
                //forceFullWidth: "on",
                //lazyLoad: "on"
                // navigationStyle: "preview4"
            });
        }
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],14:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-countmein', '<section if="{ data }" style="background: rgb(212, 214, 215);"> <div class="divide50"></div> <div class="container"> <div class="row"> <div id="impact_img" class="col-md-6"> <img class="img-responsive" alt="7 billion thinkers" riot-src="{ url+impact.img + \'?countmein\' }"></img> </div> <div class="col-md-6"> <br> <div class="facts-in"> <h3> <span id="counter" class="counter">{ Humanize.formatNumber(data.total) }</span>+ </h3> <br> <h3 style="font-size: 35px; font-weight: 700;">{ engage.subtext }</h3> <div id="mc_embed_signup"> <form action="//cabreralabs.us4.list-manage.com/subscribe/post?u=58947385383d323caf9047f39&amp;id=9799d3a7b9" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="" target="_blank" novalidate=""> <p style="color: #fff;">{ data.newsletter.text }</p> <div id="mc_embed_signup_scroll"> <div class="mc-field-group"> <div class="input-group"> <input type="email" placeholder="Email..." style="height: 31px;" value="" name="EMAIL" class="form-control" id="mce-EMAIL"> <span class="input-group-btn"> <input role="button" type="submit" style="font-variant: small-caps; text-transform: none;" value="{ impact.text }" name="subscribe" id="mc-embedded-subscribe" class="btn btn-theme-bg">{ impact.text }</input> </span> </div> </div>  <div style="position: absolute; left: -5000px;"> <input type="text" name="b_58947385383d323caf9047f39_9799d3a7b9" tabindex="-1" value=""> </div> <div id="mce-responses" class="clear" style="margin-top: 5px;"> <div class="response" id="mce-error-response" style="color: red; display:none"></div> <div class="response" id="mce-success-response" style="color: #fff; display:none"></div> </div> </div> </form> </div> <div class="row"> <div class="col-md-4 col-sm-4 col-xs-4"> </div> <div class="col-md-6 col-sm-4 col-xs-4"> <div class="addthis_horizontal_follow_toolbox"></div> </div> <div class="col-md-3 margin30 hidden-xs hidden-sm"> </div> </div> </div> </div> <div class="row"> <div class="col-md-12"> <div class="row"> <div class="col-md-12"> <div class="no-padding-inner gray"> <h3 class="wow animated fadeInDownfadeInRight animated" style="visibility: visible; text-align: center;"> { numberToWords(engage.options.length) } more things you can do: </h3> <div class="row"> <div class="col-md-4" each="{ val, i in engage.options }"> <div class="services-box margin30 wow animated fadeInRight animated" style="visibility: visible; animation-name: fadeInRight; -webkit-animation-name: fadeInRight;"> <div class="services-box-icon"> <i class="{ val.icon }"></i> </div> <div class="services-box-info"> <h4>{ val.title }</h4> <p>{ val.text }</p> <div if="{ val.buttons }" each="{ _.sortBy(val.buttons, \'order\') }"> <a href="{ link || \'\' }" target="{ target || \'\'}" class="btn btn-lg btn-theme-dark">{ title }</a> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </section>', 'id="countmein"', function(opts) {var _this = this;

this.data = null;
this.mixin('config');
this.url = this.pathImg('site');

FrontEnd.MetaFire.getData(FrontEnd.site + '/count-me-in').then(function (data) {
    try {
        _this.data = data;
        _this.impact = data.impact;
        _this.engage = data.engage;
        _this.engage.options = _.filter(_.sortBy(data.engage.options, 'order'), function (opt) {
            return opt.archive != true;
        });
        _this.header = data.header;

        _this.update();

        $(_this.counter).counterUp({
            delay: 100,
            time: 800
        });
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],15:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-explore', '<div if="{ header }" class="container"> <div class="row"> <div class="col-md-12"> <div class="center-heading"> <h2> <strong>{ header.title }</strong> </h2> <span class="center-line"></span> </div> </div> </div> </div> <div if="{ filters }" class="container"> <div class="cube-masonry"> <div id="filters_container" class="cbp-l-filters-alignCenter"> <div each="{ val, i in filters }" data-filter=".{ val.tag }" class="cbp-filter-item { \'cbp-filter-item-active\': i == 0 }"> { val.name } <div class="cbp-filter-counter"></div> </div> </div> <div id="masonry_container" class="cbp"> <a id="{ id }" href="{ link || \'#!\'+id }" target="_blank" onclick="{ parent.onClick }" each="{ content }" class="cbp-item { type } { _.keys(tags).join(\' \') }"> <div class="cbp-caption"> <div class="cbp-caption-defaultWrap"> <img if="{ img }" riot-src="{ parent.url + type + \'/\' + img }" alt="{ title }"> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div if="{ title }" class="{ \'cbp-l-caption-title\': true }" >{ title }</div> </div> </div> </div> </div> </a> </div> </div>  </div> <div class="divide50"></div> <div class="text-center"> <a href="javascript:;" onclick="{ showAll }" class="btn btn-theme-dark btn-lg">Explore All</a> </div>', 'id="explore"', function(opts) {var _this = this;

this.filters = [];
this.header = [];
this.content = [];

this.mixin('config');
this.url = this.pathImg();

this.showAll = function () {
    $(_this.masonry_container).cubeportfolio('filter', '*');
};

this.onClick = function (e) {
    if (this.link) return true;
    FrontEnd.Router.to(_.kebabCase(e.item.id), e, this);
};

FrontEnd.MetaFire.getData(FrontEnd.site + '/explore').then(function (data) {
    try {
        _this.filters = _.filter(_.sortBy(data.filters, 'order'), function (i) {
            return i.archive != true;
        });
        _this.header = data.header;
        _this.items = _.sortBy(_.map(data.items, function (val, key) {
            if (val && !(val.archive === true)) {
                val.id = key;
                return val;
            }
        }), 'order');
        _this.content = _this.items;
        _this.update();

        var defaultFilter = _.first(_this.filters, function (filter) {
            return filter['default'] === true;
        });

        $(_this.masonry_container).cubeportfolio({
            filters: '#filters_container',
            layoutMode: 'grid',
            defaultFilter: '.' + defaultFilter.tag,
            animationType: 'flipOutDelay',
            gapHorizontal: 25,
            gapVertical: 25,
            gridAdjustment: 'responsive',
            mediaQueries: [{
                width: 1100,
                cols: 4
            }, {
                width: 800,
                cols: 3
            }, {
                width: 500,
                cols: 2
            }, {
                width: 320,
                cols: 1
            }],
            displayType: 'lazyLoading',
            displayTypeSpeed: 100
        });
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],16:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-footer', '<footer id="footer"> <div id="contact" class="container"> <div class="row"> <div class="col-md-4 col-sm-6 margin30"> <div class="footer-col"> <h3>{ data.about.title }</h3> <p style="color: #fff;">{ data.about.text }</p> <ul class="list-unstyled contact"> <li each="{ _.sortBy(data.contact,\'order\') }"> <p style="color: #fff;"> <strong> <i class="{ icon }"></i>{ title || \'\' } </strong> <a if="{ link }" href="{ link }" style="color: #fff" >{ text || link }</a> <span if="{ !link }">{ text }</span> </p> </li> </ul> <ul id="social_follow" class="list-inline social-1"> <li each="{ _.sortBy(data.about.social, \'order\') }"> <a href="{ link }" alt="{ title }"> <i class="{ icon }"></i> </a> </li> </ul> </div> </div>  <div class="col-md-4 col-sm-6 margin30 hidden-xs hidden-sm"> <div class="footer-col"> <h3>Follow Us</h3> <a if="{ social.twitter }" class="twitter-timeline" href="https://twitter.com/{ social.twitter.title }" data-widget-id="{ social.twitter.api }">Tweets by @{ social.twitter.title }</a> </div> </div>  <div class="col-md-4 col-sm-6 margin30 hidden-xs hidden-sm" style="padding-right: 1px;"> <div class="footer-col"> <h3>Like Us</h3> <div if="{ social.facebook }" class="fb-page" data-href="https://www.facebook.com/{ social.facebook.title }" data-small-header="true" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true" data-height="300" data-show-posts="true"> <div class="fb-xfbml-parse-ignore"> <blockquote cite="https://www.facebook.com/{ social.facebook.title }"> <a href="https://www.facebook.com/{ social.facebook.title }">{ title }</a> </blockquote> </div> </div> </div> </div> </div> <div if="{ data.copyright }" class="row"> <div class="col-md-12 text-center"> <div class="footer-btm"> <span> <raw content="{ data.copyright.text }"></raw> </span> <img style="display: block; margin-left: auto; margin-right: auto; height: 5%; width: 5%;" riot-src="{ url+data.copyright.img+\'?copy1\' }"></img> <span style="font-size: 8px;">{ data.copyright.license }</span> <img style="display: block; margin-left: auto; margin-right: auto; height: 3%; width: 3%;" riot-src="{ url+data.copyright.img2+\'?copy2\' }"></img> </div> </div> </div> </div> </footer>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg('site');

this.social = null;
this.data = null;
this.title = FrontEnd.config.site.title;

FrontEnd.MetaFire.getData(FrontEnd.site + '/footer').then(function (data) {
    try {
        _this.data = data;
        _this.update();

        FrontEnd.MetaFire.getData(FrontEnd.site + '/social').then(function (social) {
            _this.social = social;
            _this.update();
            FrontEnd.initSocial();
        });
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],17:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-impact', '<section> <div class="container"> <div class="row"> <div class="col-md-12"> <div class="center-heading"> <h2 if="{ header }">{ header.title }</h2> <span class="center-line"></span> <p if="{ header }" class="lead"> { header.text } </p> </div> </div> </div> <div id="impact_slider" class="owl-carousel"> <div class="item" each="{ items }"> <a href="javascript:;"> <img if="{ img }" width="200px" height="125px" riot-src="{ parent.url }impact/{ img }" alt="{ title }"> </a> </div> </div> </div> </section>', 'id="impact"', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();

FrontEnd.MetaFire.getData(FrontEnd.site + '/impact').then(function (data) {
    try {
        _this.header = data.header;
        _this.items = _.filter(_.sortBy(data.items, 'order'), function (i) {
            return i.archive != true;
        });
        _this.update();

        $(_this.impact_slider).owlCarousel({
            autoPlay: 5000,
            pagination: false,
            items: 4,
            loop: true,
            itemsDesktop: [1199, 4],
            itemsDesktopSmall: [991, 2]
        });
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],18:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-main', '<page-banner></page-banner> <div class="divide60"></div> <page-message></page-message> <div class="divide80"></div> <page-methodology></page-methodology> <div class="divide50"></div> <page-testimonials></page-testimonials> <div class="divide50"></div> <page-impact></page-impact> <div class="divide50"></div> <page-countmein></page-countmein> <div class="divide70"></div> <page-news></page-news> <div class="divide50"></div> <div id="explore_container"> </div> <div class="divide40"></div>', 'id="main"', function(opts) {var _this = this;

var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
if (!isSafari) {
    this.on('mount', function () {
        window.setTimeout(function () {
            riot.mount(_this.explore_container, 'page-explore', { items: [] });
        }, 250);
    });
}
});
},{"riot":"riot"}],19:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-message', '<div class="container"> <div class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ header.title }</h2> <span class="center-line"></span> <p><raw content="{ header.text }"></raw> </p> </div> </div> </div> <div class="row special-feature"> <div each="{ items }" class="col-md-4 col-sm-4 margin10"> <div class="s-feature-box text-center wow animated fadeIn" data-wow-duration="700ms" data-wow-delay="200ms"> <div class="mask-top">  <i class="{ icon }"></i>  <h4>{ title }</h4> </div> <div class="mask-bottom">  <i class="{ icon }"></i>  <h4>{ title }</h4>  <p>{ text }</p> </div> </div> </div> </div> </div>', 'id="message"', function(opts) {var _this = this;

this.header = {};
this.items = [];

FrontEnd.MetaFire.getData(FrontEnd.site + '/message').then(function (data) {

    try {
        _this.header = data.header;
        _this.items = _.filter(_.sortBy(data.items, 'order'), function (i) {
            return i.archive != true;
        });
        _this.update();
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],20:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-methodology', '<div class="container"> <div class="row"> <div class="col-md-12"> <div class="center-heading"> <h2>{ header.title }</h2> <span class="center-line"></span> <p class="lead">{ header.text }</p> </div> </div> </div> <div class="divide30"></div> <div class="row"> <div class="col-md-6"> <div class="center-heading"> <h4>{ frameworks.header.title }</h4> <p class="lead">{ frameworks.header.text }</p> </div> <div class="panel-group" id="frameworks"> <div each="{ val, i in _.sortBy(frameworks.items, \'order\') }" class="panel panel-default"> <div class="panel-heading"> <h4 class="panel-title"> <a data-toggle="collapse" data-parent="#frameworks" href="#collapseFrameworks_{ i }"> { val.title } </a> </h4> </div> <div id="collapseFrameworks_{ i }" class="panel-collapse collapse { in: i == 0 }"> <div class="panel-body"> { val.text } </div> </div> </div> </div> </div>  <div class="col-md-6"> <div class="center-heading"> <h4>{ partners.header.title }</h4> <p class="lead">{ partners.header.text }</p> </div> <div class="panel-group" id="accordion"> <div each="{ val, i in _.sortBy(partners.items, \'order\') }" class="panel panel-default"> <div class="panel-heading"> <h4 class="panel-title"> <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne_{ i }"> { val.title } </a> </h4> </div> <div id="collapseOne_{ i }" class="panel-collapse collapse { in: i == 0 }"> <div class="panel-body"> { val.text } </div> </div> </div> </div> </div> </div> </div>', 'id="methodology"', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();

FrontEnd.MetaFire.getData(FrontEnd.site + '/methodology').then(function (data) {
    try {
        _this.header = data.header;
        _this.frameworks = data.frameworks;
        _this.partners = data.partners;

        _this.update();
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],21:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-menu-navbar', '<div class="navbar-collapse collapse"> <ul class="nav navbar-nav navbar-right"> <li class="{ dropdown: true, active: i == 0 }" each="{ val, i in data }"> <a if="{ val.title }" href="{ val.link || \'#\' }" target="{ _blank: val.link.startsWith(\'http\') }" > <i if="{ val.icon }" class="{ val.icon }" ></i> { val.title } <i if="{ val.menu && val.menu.length }" class="fa fa-angle-down" ></i> </a> </li> </ul> </div>', function(opts) {var _this = this;

this.data = [];

FrontEnd.MetaFire.getData(FrontEnd.site + '/navbar').then(function (data) {

    try {
        _this.data = _.filter(_.sortBy(data, 'order'), function (i) {
            return i.archive != true;
        });
        _this.update();
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],22:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-navbar', '<div class="navbar navbar-default navbar-static-top yamm sticky" role="navigation"> <div class="container"> <div class="navbar-header"> <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <div> <a href="#home"><img if="{ data }" style="margin-top: 7px; margin-right: 15px;" riot-src="{ url }site/{ data.img }" alt="{ data.alt }"> </a> </div> </div> <page-menu-navbar></page-menu-navbar> </div> </div>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();

FrontEnd.MetaFire.getData(FrontEnd.site + '/logo').then(function (data) {

    try {
        _this.data = data;
        _this.update();
        $(".sticky").sticky({ topSpacing: 0 });
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],23:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-news', '<div class="container"> <div class="row"> <div class="col-md-12"> <h3 class="heading">Latest News</h3> <div id="news_carousel" class="owl-carousel owl-spaced"> <div each="{ data }"> <div class="news-desc"> <p> <a href="{ link }" target="_blank">{ Humanize.truncate(title, 125) }</a> </p> </div> </div> </div> </div> </div> </div>', 'id="news"', function(opts) {var _this = this;

this.data = [];

FrontEnd.MetaFire.getData(FrontEnd.site + '/news').then(function (data) {
    try {
        _this.data = _.filter(_.sortBy(data, 'order'), function (i) {
            return i.archive != true;
        });
        _this.update();
        $(_this.news_carousel).owlCarousel({
            // Most important owl features
            items: 4,
            itemsCustom: false,
            itemsDesktop: [1199, 4],
            itemsDesktopSmall: [980, 2],
            itemsTablet: [768, 2],
            itemsTabletSmall: false,
            itemsMobile: [479, 1],
            singleItem: false,
            startDragging: true,
            autoPlay: 5000,
            loop: true
        });
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],24:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-testimonials', '<div id="testimonials-carousel" class="testimonials testimonials-v-2 wow animated fadeInUp" data-wow-duration="700ms" data-wow-delay="100ms"> <div class="container"> <div class="row"> <div class="col-sm-8 col-sm-offset-2"> <div class="center-heading"> <h2>{ header.title }</h2> <span class="center-line"></span> <p>{ header.text }</p> </div> </div> </div>  <div class="row"> <div class="col-sm-8 col-sm-offset-2"> <div id="testimonial_slide" class="testi-slide"> <ul class="slides"> <li each="{ items }"> <img riot-src="{ parent.url + img }" alt="{ user }"> <h4> <i class="fa fa-quote-left ion-quote"></i> { text} </h4> <p class="test-author"> { user } - <em>{ subtext }</em> </p> </li> </ul> </div> </div> </div> <div class="divide30"></div> </div> </div>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg('testimonials');

FrontEnd.MetaFire.getData(FrontEnd.site + '/testimonials').then(function (data) {
    try {
        _this.header = data.header;
        _this.items = _.filter(_.sortBy(data.items, 'order'), function (i) {
            return i.archive != true;
        });
        _this.update();

        $(_this.testimonial_slide).flexslider({
            slideshowSpeed: 5000,
            directionNav: false,
            animation: "fade"
        });
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],25:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('blog-page', '<div if="opts" class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> </div> <iframe if="{ data.youtubeid }" id="ytplayer" type="text/html" width="720" height="405" riot-src="https://www.youtube.com/embed/{ data.youtubeid }?autoplay=1" frameborder="0" allowfullscreen="" class="fitvids" style="height: 405px; width: 720px; display: block; margin-left: auto; margin-right: auto;"></iframe> <iframe if="{ data.vimeoid }" riot-src="https://player.vimeo.com/video/{ data.vimeoid }" width="720" height="405" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" class="fitvids" style="height: 405px; width: 720px; display: block; margin-left: auto; margin-right: auto;"></iframe> <div if="{ blog }" class="row"> <div class="col-sm-12 "> <div > <raw content="{ blog }"></raw> </div> <buttons buttons="{ data.buttons }"></buttons> </div> </div> <buttons if="{ !blog }" buttons="{ data.buttons }"></buttons> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts && opts.event.id) {
        _this.data = opts.event.item;

        _this.url = window.location.href;

        _this.update();

        var ref = FrontEnd.MetaFire.getChild(FrontEnd.site + '/content/' + opts.event.id);
        var firepad = new Firepad.Headless(ref);
        firepad.getHtml(function (html) {
            _this.blog = html;
            _this.update();
        });
    }
});
});
},{"riot":"riot"}],26:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('manifesto-page', '<div class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> <img src="https://c68f7981a8bbe926a1e0154cbfbd5af1b4df0f21.googledrive.com/host/0B6GAN4gX1bnSflRndTRJeFZ5NEszSEFlSzVKZDZJSzFxeDdicFpoLXVwSDNFRWN0RFhfS2c/crlab/site/manifesto_poster_no_diagram.png" alt="Systems Thinking Manifesto" class="img-responsive"></img> </div> <div if="{ blog }" class="row"> <div class="col-sm-12 "> <div > <raw content="{ blog }"></raw> </div> <buttons buttons="{ data.buttons }"></buttons> </div> </div> <buttons if="{ !blog }" buttons="{ data.buttons }"></buttons> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts && opts.event.id) {
        _this.data = opts.event.item;

        _this.url = window.location.href;

        _this.update();

        var ref = FrontEnd.MetaFire.getChild(FrontEnd.site + '/content/systems-thinking-manifesto');
        var firepad = new Firepad.Headless(ref);
        firepad.getHtml(function (html) {
            _this.blog = html;
            _this.update();
        });
    }
});
});
},{"riot":"riot"}],27:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('not-found-page', '<div class="divide80"></div> <div class="container"> <div class="row"> <div class="col-md-12 text-center error-text"> <div class="divide30"></div> <h1 class="error-digit wow animated fadeInUp margin20 animated" style="visibility: visible; animation-name: fadeInUp; -webkit-animation-name: fadeInUp;"><i class="fa fa-thumbs-down"></i></h1> <h2>{ data.message }</h2> <p><a href="#explore" class="btn btn-lg btn-theme-dark">Go Back</a></p> </div> </div> </div>', function(opts) {var _this = this;

this.data = {
    message: 'Oops, that page could not be found!'
};

this.on('mount', function () {
    _this.update();
});
});
},{"riot":"riot"}],28:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('stms-page', '<div class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.header.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.header.text }"></raw> </p> </div> <div class="row"> <div each="{ _.sortBy(data.items,\'order\') }" class="col-sm-6"> <div > <iframe if="{ youtubeid }" id="ytplayer_{ youtubeid }" type="text/html" height="400" riot-src="https://www.youtube.com/embed/{ youtubeid }?autoplay=0" frameborder="0" allowfullscreen=""></iframe> </div> </div> </div> </div> </div>', function(opts) {var _this = this;

this.data = null;
this.on('mount', function () {
    FrontEnd.MetaFire.getData(FrontEnd.site + '/stms').then(function (data) {
        _this.data = data;
        _this.update();
    });
});
});
},{"riot":"riot"}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvRnJvbnRFbmQuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvZW50cnkuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvY29yZS9Sb3V0ZXIuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvaW50ZWdyYXRpb25zL2FkZHRoaXMuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvaW50ZWdyYXRpb25zL2ZhY2Vib29rLmpzIiwiQzovR2l0aHViL01ldGFNYXAvZnJvbnRlbmQvc3JjL2pzL2ludGVncmF0aW9ucy9maXJlYmFzZS5qcyIsIkM6L0dpdGh1Yi9NZXRhTWFwL2Zyb250ZW5kL3NyYy9qcy9pbnRlZ3JhdGlvbnMvZ29vZ2xlLmpzIiwiQzovR2l0aHViL01ldGFNYXAvZnJvbnRlbmQvc3JjL2pzL2ludGVncmF0aW9ucy90d2l0dGVyLmpzIiwiQzovR2l0aHViL01ldGFNYXAvZnJvbnRlbmQvc3JjL2pzL2ludGVncmF0aW9ucy91c2Vyc25hcC5qcyIsIkM6L0dpdGh1Yi9NZXRhTWFwL2Zyb250ZW5kL3NyYy9qcy9taXhpbnMvY29uZmlnLmpzIiwiZnJvbnRlbmQvc3JjL3RhZ3MvY29tcG9uZW50cy9idXR0b25zLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL2NvbXBvbmVudHMvZHluYW1pYy1wYWdlLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtYmFubmVyLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtY291bnRtZWluLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtZXhwbG9yZS50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLWZvb3Rlci50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLWltcGFjdC50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLW1haW4udGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1tZXNzYWdlLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtbWV0aG9kb2xvZ3kudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1uYXZiYXItbWVudS50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLW5hdmJhci50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLW5ld3MudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS10ZXN0aW1vbmlhbHMudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZXMvYmxvZy1wYWdlLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2VzL21hbmlmZXN0by1wYWdlLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2VzL25vdC1mb3VuZC1wYWdlLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2VzL3N0bXMtcGFnZS50YWciXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUNyRCxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUNyRCxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3pDLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQ2hELElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0FBQ3RELElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBQ3hELElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDOztBQUV0RCxJQUFNLE1BQU0sR0FBRyxTQUFULE1BQU0sR0FBUztB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QUMsQ0FBQyxDQUFDO1lBQ3hDLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUFFLEVBQUUsR0FBRyxDQUFDLElBQUksV0FBVyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEFBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQUFBQyxDQUFDLENBQUMsR0FBRyxHQUNyRix1Q0FBdUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEFBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3JGLENBQUEsQ0FBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDOzs7QUFHNUQsS0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUM1QixTQUFDLENBQUMsdUJBQXVCLENBQUMsR0FBRyxDQUFDLENBQUMsQUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFlBQVk7QUFDdkQsYUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBLENBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQzNDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxBQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEFBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQUFBQyxD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QyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQSxHQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDeEYsT0FBRyxJQUFJLEFBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQSxHQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDdkYsT0FBRyxJQUFJLEFBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQSxHQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDM0YsT0FBRyxJQUFJLEFBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQSxHQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDMUYsT0FBRyxJQUFJLEFBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBSSxDQUFD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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImxldCBNZXRhRmlyZSA9IHJlcXVpcmUoJy4vanMvaW50ZWdyYXRpb25zL2ZpcmViYXNlJyk7XHJcbmxldCB1c2Vyc25hcCA9IHJlcXVpcmUoJy4vanMvaW50ZWdyYXRpb25zL3VzZXJzbmFwJyk7XHJcbmxldCByaW90ID0gd2luZG93LnJpb3Q7XHJcbmxldCBSb3V0ZXIgPSByZXF1aXJlKCcuL2pzL2NvcmUvUm91dGVyJyk7XHJcbmxldCBnYSA9IHJlcXVpcmUoJy4vanMvaW50ZWdyYXRpb25zL2dvb2dsZS5qcycpO1xyXG5sZXQgdHdpdHRlciA9IHJlcXVpcmUoJy4vanMvaW50ZWdyYXRpb25zL3R3aXR0ZXIuanMnKTtcclxubGV0IGZhY2Vib29rID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvZmFjZWJvb2suanMnKTtcclxubGV0IGFkZFRoaXMgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy9hZGR0aGlzLmpzJyk7XHJcblxyXG5jb25zdCBjb25maWcgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBTSVRFUyA9IHtcclxuICAgICAgICBDUkw6IHtcclxuICAgICAgICAgICAgZGI6ICdtZXRhLW1hcC1wcm9kdWN0aW9uJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgVEhJTktfV0FURVI6IHtcclxuICAgICAgICAgICAgZGI6ICd0aGlua3dhdGVyLXByb2R1Y3Rpb24nXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJldCA9IHtcclxuICAgICAgICBob3N0OiB3aW5kb3cubG9jYXRpb24uaG9zdCxcclxuICAgICAgICBzaXRlOiB7fVxyXG4gICAgfVxyXG4gICAgbGV0IHNlZ21lbnRzID0gcmV0Lmhvc3Quc3BsaXQoJy4nKTtcclxuICAgIGxldCBmaXJzdCA9IHNlZ21lbnRzWzBdO1xyXG4gICAgaWYgKGZpcnN0ID09PSAnd3d3Jykge1xyXG4gICAgICAgIGZpcnN0ID0gc2VnbWVudHNbMV07XHJcbiAgICB9XHJcbiAgICBzd2l0Y2ggKGZpcnN0LnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICBjYXNlICdjcmxhYic6XHJcbiAgICAgICAgY2FzZSAnbWV0YS1tYXAtc3RhZ2luZyc6XHJcbiAgICAgICAgY2FzZSAnZnJvbnRlbmQnOlxyXG4gICAgICAgICAgICByZXQuc2l0ZSA9IFNJVEVTWydDUkwnXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAndGhpbmt3YXRlci1wcm9kdWN0aW9uJzpcclxuICAgICAgICBjYXNlICd0aGlua3dhdGVyLXN0YWdpbmcnOlxyXG4gICAgICAgIGNhc2UgJ3RoaW5rd2F0ZXInOlxyXG4gICAgICAgICAgICByZXQuc2l0ZSA9IFNJVEVTWydUSElOS19XQVRFUiddO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAvL0ZvciBub3csIGRlZmF1bHQgdG8gQ1JMXHJcbiAgICAgICAgICAgIHJldC5zaXRlID0gU0lURVNbJ0NSTCddO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmV0O1xyXG59O1xyXG5cclxuY2xhc3MgRnJvbnRFbmQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRhZ3MpIHtcclxuICAgICAgICB0aGlzLnRhZ3MgPSB0YWdzO1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnKCk7XHJcblxyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUgPSBuZXcgTWV0YUZpcmUodGhpcy5jb25maWcpO1xyXG4gICAgICAgIHRoaXMuc29jaWFsRmVhdHVyZXMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0U29jaWFsKCkge1xyXG4gICAgICAgIF8uZWFjaCh0aGlzLnNvY2lhbEZlYXR1cmVzLCAoZmVhdHVyZSkgPT4ge1xyXG4gICAgICAgICAgICBpZihmZWF0dXJlKSBmZWF0dXJlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNpdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuICdmcm9udGVuZCc7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICB0aGlzLk1ldGFGaXJlLm9uKCdjb25maWcnLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBfLmV4dGVuZCh0aGlzLmNvbmZpZy5zaXRlLCBkYXRhKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQudGl0bGUgPSB0aGlzLmNvbmZpZy5zaXRlLnRpdGxlO1xyXG4gICAgICAgICAgICBsZXQgZmF2aWNvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZhdmljbycpO1xyXG4gICAgICAgICAgICBmYXZpY28uc2V0QXR0cmlidXRlKCdocmVmJywgYCR7dGhpcy5jb25maWcuc2l0ZS5pbWFnZVVybH1mYXZpY29uLmljb2ApO1xyXG5cclxuICAgICAgICAgICAgZ2EodGhpcy5jb25maWcuc2l0ZS5nb29nbGUpO1xyXG4gICAgICAgICAgICB0aGlzLnNvY2lhbEZlYXR1cmVzLnB1c2godHdpdHRlcigpKTtcclxuICAgICAgICAgICAgdGhpcy5zb2NpYWxGZWF0dXJlcy5wdXNoKGZhY2Vib29rKCkpO1xyXG4gICAgICAgICAgICB0aGlzLnNvY2lhbEZlYXR1cmVzLnB1c2goYWRkVGhpcyh0aGlzLmNvbmZpZy5zaXRlLmFkZHRoaXMucHViaWQpKTtcclxuICAgICAgICAgICAgdXNlcnNuYXAoKTtcclxuXHJcbiAgICAgICAgICAgIHJpb3QubW91bnQoJyonKTtcclxuICAgICAgICAgICAgdGhpcy5Sb3V0ZXIgPSBuZXcgUm91dGVyKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9nKHZhbCkge1xyXG4gICAgICAgIGlmICh3aW5kb3cuZ2EpIHtcclxuICAgICAgICAgICAgd2luZG93LmdhKCdzZW5kJywgJ2V2ZW50JywgJ2xvZycsICdsYWJlbCcsIHZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXJyb3IodmFsKSB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5nYSkge1xyXG4gICAgICAgICAgICB3aW5kb3cuZ2EoJ3NlbmQnLCAnZXhjZXB0aW9uJywge1xyXG4gICAgICAgICAgICAgICAgJ2V4RGVzY3JpcHRpb24nOiB2YWwubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgICdleEZhdGFsJzogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2codmFsKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbigpIHtcclxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5BdXRoMC5sb2dpbigpLnRoZW4oKHByb2ZpbGUpID0+IHtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUubG9nb3V0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRnJvbnRFbmQ7IiwicmVxdWlyZSgnYmFiZWwvcG9seWZpbGwnKTtcclxud2luZG93LnJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbndpbmRvdy5fID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcbndpbmRvdy5Qcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcclxucmVxdWlyZSgnY29yZS1qcycpO1xyXG53aW5kb3cuJCA9IHdpbmRvdy5qUXVlcnkgPSByZXF1aXJlKCdqcXVlcnknKTtcclxucmVxdWlyZSgnanF1ZXJ5LXVpJyk7XHJcbnJlcXVpcmUoJ2Jvb3RzdHJhcCcpO1xyXG53aW5kb3cuRmlyZWJhc2UgPSByZXF1aXJlKCdmaXJlYmFzZScpO1xyXG53aW5kb3cuRmlyZXBhZCA9IHJlcXVpcmUoJ2ZpcmVwYWQnKTtcclxud2luZG93Lkh1bWFuaXplID0gcmVxdWlyZSgnaHVtYW5pemUtcGx1cycpO1xyXG53aW5kb3cubW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcbndpbmRvdy5VUkkgPSByZXF1aXJlKCdVUklqcycpO1xyXG53aW5kb3cubG9jYWxmb3JhZ2UgPSByZXF1aXJlKCdsb2NhbGZvcmFnZScpO1xyXG53aW5kb3cuUHMgPSByZXF1aXJlKCdwZXJmZWN0LXNjcm9sbGJhcicpO1xyXG5cclxubGV0IHRhZ3MgPSBbXHJcbiAgICAncGFnZS1oZWFkJyxcclxuICAgICdwYWdlLWJhbm5lcicsXHJcbiAgICAncGFnZS1pbXBhY3QnLFxyXG4gICAgJ3BhZ2UtY291bnRtZWluJyxcclxuICAgICdwYWdlLWZvb3RlcicsXHJcbiAgICAncGFnZS1uYXZiYXItbWVudScsXHJcbiAgICAncGFnZS1uYXZiYXInLFxyXG4gICAgJ3BhZ2UtbmV3cycsXHJcbiAgICAncGFnZS1leHBsb3JlJyxcclxuICAgICdwYWdlLW1lc3NhZ2UnLFxyXG4gICAgJ3BhZ2UtbWV0aG9kb2xvZ3knLFxyXG4gICAgJ3BhZ2UtdGVzdGltb25pYWxzJ1xyXG5dO1xyXG5cclxucmVxdWlyZSgnLi90YWdzL3BhZ2VzL2Jsb2ctcGFnZS50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2VzL21hbmlmZXN0by1wYWdlLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZXMvc3Rtcy1wYWdlLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZXMvbm90LWZvdW5kLXBhZ2UudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9jb21wb25lbnRzL2J1dHRvbnMudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9jb21wb25lbnRzL2R5bmFtaWMtcGFnZS50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtYmFubmVyLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1pbXBhY3QudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWNvdW50bWVpbi50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtZm9vdGVyLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1uYXZiYXItbWVudS50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbmF2YmFyLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1uZXdzLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1leHBsb3JlLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1tZXNzYWdlLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1tZXRob2RvbG9neS50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtdGVzdGltb25pYWxzLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1tYWluLnRhZycpO1xyXG5cclxudmFyIGNvbmZpZ01peGluID0gcmVxdWlyZSgnLi9qcy9taXhpbnMvY29uZmlnLmpzJyk7XHJcbnJpb3QubWl4aW4oJ2NvbmZpZycsIGNvbmZpZ01peGluKTtcclxuXHJcbnJpb3QudGFnKCdyYXcnLCAnPHNwYW4+PC9zcGFuPicsIGZ1bmN0aW9uIChvcHRzKSB7XHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5yb290LmlubmVySFRNTCA9IChvcHRzKSA/IChvcHRzLmNvbnRlbnQgfHwgJycpIDogJyc7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMub24oJ3VwZGF0ZScsICgpID0+IHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNvbnRlbnQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMudXBkYXRlQ29udGVudCgpO1xyXG59KTtcclxuXHJcbnZhciBGcm9udEVuZCA9IHJlcXVpcmUoJy4vRnJvbnRFbmQnKTtcclxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRnJvbnRFbmQodGFncyk7IiwiY29uc3Qgc3RhdGljUm91dGVzID0ge1xyXG4gICAgJ2NvbnRhY3QnOiB0cnVlLFxyXG4gICAgJ2hvbWUnOiB0cnVlLFxyXG4gICAgJ2V4cGxvcmUnOiB0cnVlXHJcbn1cclxuXHJcbmxldCBpc0hpZGRlbiA9IGZhbHNlO1xyXG5sZXQgdG9nZ2xlTWFpbiA9IChoaWRlLCBwYXRoKSA9PiB7XHJcbiAgICB0cmFjayhwYXRoKTtcclxuICAgIGlmIChoaWRlKSB7XHJcbiAgICAgICAgaXNIaWRkZW4gPSB0cnVlO1xyXG4gICAgICAgICQoJyNtYWluJykuaGlkZSgpO1xyXG4gICAgICAgICQoJyNhdDQtc2hhcmUnKS5wYXJlbnQoKS5zaG93KCk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpc0hpZGRlbiA9IGZhbHNlO1xyXG4gICAgICAgICQoJyNhdDQtc2hhcmUnKS5wYXJlbnQoKS5oaWRlKCk7XHJcbiAgICAgICAgJCgnI21haW4nKS5zaG93KCk7XHJcbiAgICAgICAgJCgnZHluYW1pYy1wYWdlJykuZW1wdHkoKTtcclxuICAgIH1cclxufVxyXG5cclxubGV0IHRyYWNrID0gKHBhdGgpID0+IHtcclxuICAgIGlmICh3aW5kb3cuZ2EpIHtcclxuICAgICAgICB3aW5kb3cuZ2EoJ3NldCcsIHtcclxuICAgICAgICAgICAgcGFnZTogcGF0aFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHdpbmRvdy5nYSgnc2VuZCcsICdwYWdldmlldycpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBSb3V0ZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHJpb3Qucm91dGUuc3RhcnQoKTtcclxuICAgICAgICByaW90LnJvdXRlKCh0YXJnZXQsIC4uLnBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcGF0aCA9IHRoaXMuZ2V0UGF0aCh0YXJnZXQpO1xyXG4gICAgICAgICAgICBpZiAoIXN0YXRpY1JvdXRlc1twYXRoXSkge1xyXG4gICAgICAgICAgICAgICAgdG9nZ2xlTWFpbih0cnVlLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgIHJpb3QubW91bnQoJ2R5bmFtaWMtcGFnZScsIHsgaWQ6IHBhdGggfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0b2dnbGVNYWluKGZhbHNlLCBwYXRoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudG8od2luZG93LmxvY2F0aW9uLmhhc2ggfHwgJ2hvbWUnKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0UGF0aChwYXRoKSB7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgd2hpbGUgKHBhdGguc3RhcnRzV2l0aCgnIScpIHx8IHBhdGguc3RhcnRzV2l0aCgnIycpKSB7XHJcbiAgICAgICAgICAgICAgICBwYXRoID0gcGF0aC5zdWJzdHIoMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGF0aChwYXRoKSB7XHJcbiAgICAgICAgcmV0dXJuIHJvdXRlLmdldFBhdGgocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHRvKHBhdGgpIHtcclxuICAgICAgICBwYXRoID0gcm91dGUuZ2V0UGF0aChwYXRoKTtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICBpZiAoc3RhdGljUm91dGVzW3BhdGhdKSB7XHJcbiAgICAgICAgICAgICAgICB0b2dnbGVNYWluKGZhbHNlLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgIHJpb3Qucm91dGUocGF0aCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0b2dnbGVNYWluKHRydWUsIHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgcmlvdC5yb3V0ZShgISR7cGF0aH1gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0byhwYXRoKSB7XHJcbiAgICAgICAgcmV0dXJuIHJvdXRlLnRvKHBhdGgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCByb3V0ZSA9IFJvdXRlcjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUm91dGVyOyIsInZhciBhZGRUaGlzID0gZnVuY3Rpb24gKGFwaUtleSkge1xyXG4gICAgXHJcbiAgICAoZnVuY3Rpb24gKGQsIHMsIGlkKSB7XHJcbiAgICAgICAgdmFyIGpzLCBmanMgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdLFxyXG4gICAgICAgICAgdCA9IHdpbmRvdy5hZGR0aGlzIHx8IHt9O1xyXG4gICAgICAgIGlmIChkLmdldEVsZW1lbnRCeUlkKGlkKSkgcmV0dXJuIHQ7XHJcbiAgICAgICAganMgPSBkLmNyZWF0ZUVsZW1lbnQocyk7XHJcbiAgICAgICAganMuaWQgPSBpZDtcclxuICAgICAgICBqcy5zcmMgPSBgLy9zNy5hZGR0aGlzLmNvbS9qcy8zMDAvYWRkdGhpc193aWRnZXQuanMjcHViaWQ9JHthcGlLZXl9YDtcclxuICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XHJcblxyXG4gICAgICAgIHQuX2UgPSBbXTtcclxuICAgICAgICB0LnJlYWR5ID0gZnVuY3Rpb24gKGYpIHtcclxuICAgICAgICAgICAgdC5fZS5wdXNoKGYpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfShkb2N1bWVudCwgXCJzY3JpcHRcIiwgXCJhZGQtdGhpcy1qc1wiKSk7XHJcblxyXG4gICAgbGV0IGluaXQgPSAoKSA9PiB7XHJcbiAgICAgICAgd2luZG93LmFkZHRoaXMucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmIChbJyNob21lJywgJyNjb250YWN0J10uaW5kZXhPZih3aW5kb3cubG9jYXRpb24uaGFzaCkgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRyeUNvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgIHZhciBoaWRlU2hhcmVzID0gZnVuY3Rpb24oa2VlcEdvaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQoJyNhdDQtc2hhcmUnKSAmJiAkKCcjYXQ0LXNoYXJlJykubGVuZ3RoID49IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2F0NC1zaGFyZScpLnBhcmVudCgpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtlZXBHb2luZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5kZWxheShoaWRlU2hhcmVzLCAzMDAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeUNvdW50ICs9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cnlDb3VudCA8IDYwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmRlbGF5KGhpZGVTaGFyZXMsIDI1MCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBoaWRlU2hhcmVzKHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGluaXQ7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFkZFRoaXM7XHJcblxyXG5cclxuIiwiXHJcbnZhciBmYWNlYm9va0FwaSA9IGZ1bmN0aW9uIChhcGlLZXkpIHtcclxuICAgIFxyXG4gICAgd2luZG93LmZiQXN5bmNJbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHdpbmRvdy5GQi5pbml0KHtcclxuICAgICAgICAgICAgYXBwSWQ6ICc4NDc3MDI3NzUzMDQ5MDYnLFxyXG4gICAgICAgICAgICB4ZmJtbDogdHJ1ZSxcclxuICAgICAgICAgICAgdmVyc2lvbjogJ3YyLjMnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5GQi5FdmVudC5zdWJzY3JpYmUoJ2VkZ2UuY3JlYXRlJywgZnVuY3Rpb24gKHRhcmdldFVybCkge1xyXG4gICAgICAgICAgICB3aW5kb3cuZ2EoJ3NlbmQnLCAnc29jaWFsJywgJ2ZhY2Vib29rJywgJ2xpa2UnLCB0YXJnZXRVcmwpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB3aW5kb3cuRkIuRXZlbnQuc3Vic2NyaWJlKCdlZGdlLnJlbW92ZScsIGZ1bmN0aW9uICh0YXJnZXRVcmwpIHtcclxuICAgICAgICAgICAgd2luZG93LmdhKCdzZW5kJywgJ3NvY2lhbCcsICdmYWNlYm9vaycsICd1bmxpa2UnLCB0YXJnZXRVcmwpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB3aW5kb3cuRkIuRXZlbnQuc3Vic2NyaWJlKCdtZXNzYWdlLnNlbmQnLCBmdW5jdGlvbiAodGFyZ2V0VXJsKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5nYSgnc2VuZCcsICdzb2NpYWwnLCAnZmFjZWJvb2snLCAnc2VuZCcsIHRhcmdldFVybCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIChmdW5jdGlvbiAoZCwgcywgaWQpIHtcclxuICAgICAgICB2YXIganMsIGZqcyA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF07XHJcbiAgICAgICAgaWYgKGQuZ2V0RWxlbWVudEJ5SWQoaWQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAganMgPSBkLmNyZWF0ZUVsZW1lbnQocyk7XHJcbiAgICAgICAganMuaWQgPSBpZDtcclxuICAgICAgICBqcy5zcmMgPSBcIi8vY29ubmVjdC5mYWNlYm9vay5uZXQvZW5fVVMvc2RrLmpzXCI7XHJcbiAgICAgICAgZmpzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGpzLCBmanMpO1xyXG4gICAgfShkb2N1bWVudCwgJ3NjcmlwdCcsICdmYWNlYm9vay1qc3NkaycpKTtcclxuXHJcbiAgICByZXR1cm4gd2luZG93LmZiQXN5bmNJbml0O1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmYWNlYm9va0FwaTtcclxuXHJcblxyXG4iLCJsZXQgRmlyZWJhc2UgPSB3aW5kb3cuRmlyZWJhc2U7IC8vcmVxdWlyZSgnZmlyZWJhc2UnKTtcclxubGV0IFByb21pc2UgPSB3aW5kb3cuUHJvbWlzZTtcclxubGV0IGxvY2FsZm9yYWdlID0gd2luZG93LmxvY2FsZm9yYWdlO1xyXG5sZXQgTWV0YU1hcCA9IHdpbmRvdy5NZXRhTWFwO1xyXG5cclxuY2xhc3MgTWV0YUZpcmUge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChjb25maWcpIHtcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcclxuICAgICAgICB0aGlzLmZiID0gbmV3IEZpcmViYXNlKGBodHRwczovLyR7dGhpcy5jb25maWcuc2l0ZS5kYn0uZmlyZWJhc2Vpby5jb21gKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbigpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgbGV0IHJldCA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbG9jYWxmb3JhZ2UuZ2V0SXRlbSgnaWRfdG9rZW4nKS50aGVuKChpZF90b2tlbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgTWV0YU1hcC5BdXRoMC5nZXRTZXNzaW9uKCkudGhlbigocHJvZmlsZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBNZXRhTWFwLkF1dGgwLmxvY2suZ2V0Q2xpZW50KCkuZ2V0RGVsZWdhdGlvblRva2VuKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBwcm9maWxlLmNsaWVudElELFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZF90b2tlbjogaWRfdG9rZW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaV90eXBlOiAnZmlyZWJhc2UnXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgKGVyciwgZGVsZWdhdGlvblJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmZpcmViYXNlX3Rva2VuID0gZGVsZWdhdGlvblJlc3VsdC5pZF90b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgnZmlyZWJhc2VfdG9rZW4nLCB0aGF0LmZpcmViYXNlX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mYi5hdXRoV2l0aEN1c3RvbVRva2VuKHRoYXQuZmlyZWJhc2VfdG9rZW4sIChlcnJvciwgYXV0aERhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoYXV0aERhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTsgXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDaGlsZChwYXRoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmIuY2hpbGQocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGF0YSAocGF0aCkge1xyXG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNoaWxkLm9yZGVyQnlDaGlsZCgnb3JkZXInKS5vbigndmFsdWUnLFxyXG4gICAgICAgICAgICAgICAgKHNuYXBzaG90KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBzbmFwc2hvdC52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LkZyb250RW5kLmVycm9yKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgb24gKHBhdGgsIGNhbGxiYWNrLCBldmVudCA9ICd2YWx1ZScgKSB7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcclxuICAgICAgICAgICAgY2hpbGQub3JkZXJCeUNoaWxkKCdvcmRlcicpLm9uKGV2ZW50LCAoc25hcHNob3QpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gc25hcHNob3QudmFsKCk7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5Gcm9udEVuZC5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldERhdGEgKGRhdGEsIHBhdGgpIHtcclxuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmZiO1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNoaWxkLnNldChkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dvdXQgKCkge1xyXG4gICAgICAgIHRoaXMuZmIudW5hdXRoKCk7XHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBNZXRhRmlyZTsiLCJcclxudmFyIGdvb2dsZUFuYWx5dGljcyA9IGZ1bmN0aW9uIChhcGkpIHtcclxuICAgIFxyXG4gICAgLy8gR29vZ2xlIFBsdXMgQVBJXHJcbiAgICAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBwbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpOyBwby50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7IHBvLmFzeW5jID0gdHJ1ZTtcclxuICAgICAgICBwby5zcmMgPSAnaHR0cHM6Ly9hcGlzLmdvb2dsZS5jb20vanMvcGxhdGZvcm0uanMnO1xyXG4gICAgICAgIHZhciBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdOyBzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHBvLCBzKTtcclxuICAgIH0pKCk7XHJcblxyXG4gICAgLy9Hb29nbGUgVGFnIE1hbmFnZXIgQVBJXHJcbiAgKGZ1bmN0aW9uICh3LCBkLCBzLCBsLCBpKSB7XHJcbiAgICAgIHdbbF0gPSB3W2xdIHx8IFtdOyB3W2xdLnB1c2goe1xyXG4gICAgICAgICAgJ2d0bS5zdGFydCc6XHJcbiAgICAgICAgICBuZXcgRGF0ZSgpLmdldFRpbWUoKSwgZXZlbnQ6ICdndG0uanMnXHJcbiAgICAgIH0pOyB2YXIgZiA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF0sXHJcbiAgICAgIGogPSBkLmNyZWF0ZUVsZW1lbnQocyksIGRsID0gbCAhPSAnZGF0YUxheWVyJyA/ICcmbD0nICsgbCA6ICcnOyBqLmFzeW5jID0gdHJ1ZTsgai5zcmMgPVxyXG4gICAgICAnLy93d3cuZ29vZ2xldGFnbWFuYWdlci5jb20vZ3RtLmpzP2lkPScgKyBpICsgZGw7IGYucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoaiwgZik7XHJcbiAgfSkod2luZG93LCBkb2N1bWVudCwgJ3NjcmlwdCcsICdkYXRhTGF5ZXInLCBhcGkudGFnbWFuYWdlcik7XHJcblxyXG4gICAgLy8gR29vZ2xlIEFuYWx5dGljcyBBUElcclxuICAoZnVuY3Rpb24gKGksIHMsIG8sIGcsIHIsIGEsIG0pIHtcclxuICAgICAgaVsnR29vZ2xlQW5hbHl0aWNzT2JqZWN0J10gPSByOyBpW3JdID0gaVtyXSB8fCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAoaVtyXS5xID0gaVtyXS5xIHx8IFtdKS5wdXNoKGFyZ3VtZW50cyk7XHJcbiAgICAgIH0sIGlbcl0ubCA9IDEgKiBuZXcgRGF0ZSgpOyBhID0gcy5jcmVhdGVFbGVtZW50KG8pLFxyXG4gICAgICBtID0gcy5nZXRFbGVtZW50c0J5VGFnTmFtZShvKVswXTsgYS5hc3luYyA9IDE7IGEuc3JjID0gZztcclxuICAgICAgbS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShhLCBtKTtcclxuICB9KSh3aW5kb3csIGRvY3VtZW50LCAnc2NyaXB0JywgJy8vd3d3Lmdvb2dsZS1hbmFseXRpY3MuY29tL2FuYWx5dGljcy5qcycsICdnYScpO1xyXG5cclxuICAgIHdpbmRvdy5nYSgnY3JlYXRlJywgYXBpLmFuYWx5dGljcywgJ2F1dG8nKTtcclxuICAgIHdpbmRvdy5nYSgnc2VuZCcsICdwYWdldmlldycpO1xyXG4gICAgcmV0dXJuIHdpbmRvdy5nYTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZ29vZ2xlQW5hbHl0aWNzO1xyXG5cclxuXHJcbiIsIi8vIERlZmluZSBvdXIgY3VzdG9tIGV2ZW50IGhhbmRsZXJzXHJcbmZ1bmN0aW9uIGNsaWNrRXZlbnRUb0FuYWx5dGljcyhpbnRlbnRFdmVudCkge1xyXG4gICAgaWYgKCFpbnRlbnRFdmVudCkgcmV0dXJuO1xyXG4gICAgdmFyIGxhYmVsID0gaW50ZW50RXZlbnQucmVnaW9uO1xyXG4gICAgd2luZG93LmdhKCdzZW5kJywgJ3NvY2lhbCcsICd0d2l0dGVyJywgaW50ZW50RXZlbnQudHlwZSwgbGFiZWwpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0d2VldEludGVudFRvQW5hbHl0aWNzKGludGVudEV2ZW50KSB7XHJcbiAgICBpZiAoIWludGVudEV2ZW50KSByZXR1cm47XHJcbiAgICB2YXIgbGFiZWwgPSBcInR3ZWV0XCI7XHJcbiAgICB3aW5kb3cuZ2EoJ3NlbmQnLCAnc29jaWFsJywgJ3R3aXR0ZXInLCBpbnRlbnRFdmVudC50eXBlLCBsYWJlbCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZhdkludGVudFRvQW5hbHl0aWNzKGludGVudEV2ZW50KSB7XHJcbiAgICB0d2VldEludGVudFRvQW5hbHl0aWNzKGludGVudEV2ZW50KTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmV0d2VldEludGVudFRvQW5hbHl0aWNzKGludGVudEV2ZW50KSB7XHJcbiAgICBpZiAoIWludGVudEV2ZW50KSByZXR1cm47XHJcbiAgICB2YXIgbGFiZWwgPSBpbnRlbnRFdmVudC5kYXRhLnNvdXJjZV90d2VldF9pZDtcclxuICAgIHdpbmRvdy5nYSgnc2VuZCcsICdzb2NpYWwnLCAndHdpdHRlcicsIGludGVudEV2ZW50LnR5cGUsIGxhYmVsKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZm9sbG93SW50ZW50VG9BbmFseXRpY3MoaW50ZW50RXZlbnQpIHtcclxuICAgIGlmICghaW50ZW50RXZlbnQpIHJldHVybjtcclxuICAgIHZhciBsYWJlbCA9IGludGVudEV2ZW50LmRhdGEudXNlcl9pZCArIFwiIChcIiArIGludGVudEV2ZW50LmRhdGEuc2NyZWVuX25hbWUgKyBcIilcIjtcclxuICAgIHdpbmRvdy5nYSgnc2VuZCcsICdzb2NpYWwnLCAndHdpdHRlcicsIGludGVudEV2ZW50LnR5cGUsIGxhYmVsKTtcclxufVxyXG5cclxuXHJcbnZhciB0d2l0dGVyQXBpID0gZnVuY3Rpb24gKGFwaUtleSkge1xyXG4gICAgXHJcbiAgICB3aW5kb3cudHd0dHIgPSAoZnVuY3Rpb24gKGQsIHMsIGlkKSB7XHJcbiAgICAgICAgdmFyIGpzLCBmanMgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdLFxyXG4gICAgICAgICAgdCA9IHdpbmRvdy50d3R0ciB8fCB7fTtcclxuICAgICAgICBpZiAoZC5nZXRFbGVtZW50QnlJZChpZCkpIHJldHVybiB0O1xyXG4gICAgICAgIGpzID0gZC5jcmVhdGVFbGVtZW50KHMpO1xyXG4gICAgICAgIGpzLmlkID0gaWQ7XHJcbiAgICAgICAganMuc3JjID0gXCJodHRwczovL3BsYXRmb3JtLnR3aXR0ZXIuY29tL3dpZGdldHMuanNcIjtcclxuICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XHJcblxyXG4gICAgICAgIHQuX2UgPSBbXTtcclxuICAgICAgICB0LnJlYWR5ID0gZnVuY3Rpb24gKGYpIHtcclxuICAgICAgICAgICAgdC5fZS5wdXNoKGYpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfShkb2N1bWVudCwgXCJzY3JpcHRcIiwgXCJ0d2l0dGVyLXdqc1wiKSk7XHJcblxyXG4gICAgd2luZG93LnR3dHRyLnJlYWR5KCh0d2l0dGVyKSA9PiB7XHJcbiAgICAgICAgdHdpdHRlci53aWRnZXRzLmxvYWQoKTtcclxuICAgICAgICB0d2l0dGVyLmV2ZW50cy5iaW5kKCdjbGljaycsIGNsaWNrRXZlbnRUb0FuYWx5dGljcyk7XHJcbiAgICAgICAgdHdpdHRlci5ldmVudHMuYmluZCgndHdlZXQnLCB0d2VldEludGVudFRvQW5hbHl0aWNzKTtcclxuICAgICAgICB0d2l0dGVyLmV2ZW50cy5iaW5kKCdyZXR3ZWV0JywgcmV0d2VldEludGVudFRvQW5hbHl0aWNzKTtcclxuICAgICAgICB0d2l0dGVyLmV2ZW50cy5iaW5kKCdmYXZvcml0ZScsIGZhdkludGVudFRvQW5hbHl0aWNzKTtcclxuICAgICAgICB0d2l0dGVyLmV2ZW50cy5iaW5kKCdmb2xsb3cnLCBmb2xsb3dJbnRlbnRUb0FuYWx5dGljcyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBsZXQgdHJ5Q291bnQgPSAwO1xyXG4gICAgbGV0IGxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy50d3R0ciAmJiB3aW5kb3cudHd0dHIud2lkZ2V0cykge1xyXG4gICAgICAgICAgICByZXR1cm4gd2luZG93LnR3dHRyLndpZGdldHMubG9hZCgpO1xyXG4gICAgICAgIH0gZWxzZSBpZih0cnlDb3VudCA8IDUpIHtcclxuICAgICAgICAgICAgdHJ5Q291bnQgKz0gMTtcclxuICAgICAgICAgICAgXy5kZWxheShsb2FkLCAyNTApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbG9hZDtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHR3aXR0ZXJBcGk7XHJcblxyXG5cclxuIiwiXHJcbnZhciB1c2VyU25hcCA9IGZ1bmN0aW9uIChjb25maWcpIHtcclxuICAgIHZhciBhcGlLZXkgPSAnMDMyYmFmODctODU0NS00ZWJjLWE1NTctOTM0ODU5MzcxZmE1LmpzJywgcywgeDtcclxuICAgIGlmIChjb25maWcgPT0gbnVsbCkge1xyXG4gICAgICAgIGNvbmZpZyA9IHt9O1xyXG4gICAgfVxyXG4gICAgYXBpS2V5ID0gY29uZmlnLlVTRVJfU05BUF9BUElfS0VZO1xyXG4gICAgaWYgKGFwaUtleSAmJiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgIT09ICdsb2NhbGhvc3QnKSB7XHJcbiAgICAgICAgd2luZG93LnVzZXJzbmFwY29uZmlnID0ge1xyXG4gICAgICAgICAgICBtb2RlOiAncmVwb3J0JyxcclxuICAgICAgICAgICAgc2hvcnRjdXQ6IHRydWUsXHJcbiAgICAgICAgICAgIGJlZm9yZU9wZW46IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBVc2VyU25hcC5zZXRFbWFpbEJveChEb2MuYXBwLnVzZXIudXNlck5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgcy50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XHJcbiAgICAgICAgcy5hc3luYyA9IHRydWU7XHJcbiAgICAgICAgcy5zcmMgPSAnLy9hcGkudXNlcnNuYXAuY29tL2xvYWQvJyArIGFwaUtleSArICcuanMnO1xyXG4gICAgICAgIHggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xyXG4gICAgICAgIHJldHVybiB4LmFwcGVuZENoaWxkKHMpO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB1c2VyU25hcDtcclxuXHJcblxyXG4iLCJjb25zdCBhID0gWycnLCAnb25lICcsICd0d28gJywgJ3RocmVlICcsICdmb3VyICcsICdmaXZlICcsICdzaXggJywgJ3NldmVuICcsICdlaWdodCAnLCAnbmluZSAnLCAndGVuICcsICdlbGV2ZW4gJywgJ3R3ZWx2ZSAnLCAndGhpcnRlZW4gJywgJ2ZvdXJ0ZWVuICcsICdmaWZ0ZWVuICcsICdzaXh0ZWVuICcsICdzZXZlbnRlZW4gJywgJ2VpZ2h0ZWVuICcsICduaW5ldGVlbiAnXTtcclxuY29uc3QgYiA9IFsnJywgJycsICd0d2VudHknLCAndGhpcnR5JywgJ2ZvcnR5JywgJ2ZpZnR5JywgJ3NpeHR5JywgJ3NldmVudHknLCAnZWlnaHR5JywgJ25pbmV0eSddO1xyXG5cclxuZnVuY3Rpb24gaW5Xb3JkcyhudW0pIHtcclxuICAgIGlmICghbnVtIHx8ICgobnVtID0gbnVtLnRvU3RyaW5nKCkpLmxlbmd0aCA+IDkpKSByZXR1cm4gJ292ZXJmbG93JztcclxuICAgIGxldCBuID0gKCcwMDAwMDAwMDAnICsgbnVtKS5zdWJzdHIoLTkpLm1hdGNoKC9eKFxcZHsyfSkoXFxkezJ9KShcXGR7Mn0pKFxcZHsxfSkoXFxkezJ9KSQvKTtcclxuICAgIGlmICghbikgcmV0dXJuOyB2YXIgc3RyID0gJyc7XHJcbiAgICBzdHIgKz0gKG5bMV0gIT0gMCkgPyAoYVtOdW1iZXIoblsxXSldIHx8IGJbblsxXVswXV0gKyAnICcgKyBhW25bMV1bMV1dKSArICdjcm9yZSAnIDogJyc7XHJcbiAgICBzdHIgKz0gKG5bMl0gIT0gMCkgPyAoYVtOdW1iZXIoblsyXSldIHx8IGJbblsyXVswXV0gKyAnICcgKyBhW25bMl1bMV1dKSArICdsYWtoICcgOiAnJztcclxuICAgIHN0ciArPSAoblszXSAhPSAwKSA/IChhW051bWJlcihuWzNdKV0gfHwgYltuWzNdWzBdXSArICcgJyArIGFbblszXVsxXV0pICsgJ3Rob3VzYW5kICcgOiAnJztcclxuICAgIHN0ciArPSAobls0XSAhPSAwKSA/IChhW051bWJlcihuWzRdKV0gfHwgYltuWzRdWzBdXSArICcgJyArIGFbbls0XVsxXV0pICsgJ2h1bmRyZWQgJyA6ICcnO1xyXG4gICAgc3RyICs9IChuWzVdICE9IDApID8gKChzdHIgIT0gJycpID8gJ2FuZCAnIDogJycpICsgKGFbTnVtYmVyKG5bNV0pXSB8fCBiW25bNV1bMF1dICsgJyAnICsgYVtuWzVdWzFdXSkgKyAnJyA6ICcnO1xyXG4gICAgcmV0dXJuIHN0cjtcclxufVxyXG5cclxubGV0IGNvbmZpZyA9IHtcclxuICAgIHBhdGhJbWc6IChmb2xkZXIpID0+IHtcclxuICAgICAgICBsZXQgcmV0ID0gYCR7d2luZG93LkZyb250RW5kLmNvbmZpZy5zaXRlLmltYWdlVXJsfWA7XHJcbiAgICAgICAgaWYgKGZvbGRlcikge1xyXG4gICAgICAgICAgICByZXQgKz0gYCR7Zm9sZGVyfS9gO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfSxcclxuICAgIGdldERhdGE6IChwYXRoLCBjYWxsYmFjaywgdGhhdCkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5Gcm9udEVuZC5NZXRhRmlyZS5vbihgJHt3aW5kb3cuRnJvbnRFbmQuc2l0ZX0vJHtwYXRofWAsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIHRoYXQudXBkYXRlKCk7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICB3YXRjaERhdGE6IChwYXRoLCBjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5Gcm9udEVuZC5NZXRhRmlyZS5vbihgJHt3aW5kb3cuRnJvbnRFbmQuc2l0ZX0vJHtwYXRofWAsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBudW1iZXJUb1dvcmRzOiBpbldvcmRzXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNvbmZpZzsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ2J1dHRvbnMnLCAnPGRpdiBjbGFzcz1cInJvdyBjZW50ZXItaGVhZGluZ1wiPiA8c3BhbiBlYWNoPVwieyBfLnNvcnRCeShvcHRzLmJ1dHRvbnMsXFwnb3JkZXJcXCcpIH1cIj4gPGEgaWY9XCJ7ICFhbWF6b25pZCB9XCIgcm9sZT1cImJ1dHRvblwiIGhyZWY9XCJ7IGxpbmsgfVwiIHRhcmdldD1cIl9ibGFua1wiIGNsYXNzPVwiYnRuIGJ0bi1sZyBidG4tdGhlbWUtZGFya1wiIHN0eWxlPVwibWFyZ2luLXJpZ2h0OiAxMHB4O1wiPiB7IHRpdGxlIH0gPC9hPiA8ZGl2IGlmPVwieyBhbWF6b25pZCB9XCIgY2xhc3M9XCJjb2wtc20teyBwYXJlbnQuY2VsbCB9IFwiPiA8aWZyYW1lIHN0eWxlPVwid2lkdGg6IDEyMHB4OyBoZWlnaHQ6IDI0MHB4O1wiIG1hcmdpbndpZHRoPVwiMFwiIG1hcmdpbmhlaWdodD1cIjBcIiBzY3JvbGxpbmc9XCJub1wiIGZyYW1lYm9yZGVyPVwiMFwiIHJpb3Qtc3JjPVwiLy93cy1uYS5hbWF6b24tYWRzeXN0ZW0uY29tL3dpZGdldHMvcT9TZXJ2aWNlVmVyc2lvbj0yMDA3MDgyMiZPbmVKUz0xJk9wZXJhdGlvbj1HZXRBZEh0bWwmTWFya2V0UGxhY2U9VVMmc291cmNlPWFjJnJlZj10Zl90aWwmYWRfdHlwZT1wcm9kdWN0X2xpbmsmdHJhY2tpbmdfaWQ9Y2FicnJlc2VsYWItMjAmbWFya2V0cGxhY2U9YW1hem9uJnJlZ2lvbj1VUyZwbGFjZW1lbnQ9eyBhbWF6b25pZCB9JmFzaW5zPXsgYW1hem9uaWQgfSZsaW5rSWQ9RElZM1RVT1BERkgzTlFXRiZzaG93X2JvcmRlcj1mYWxzZSZsaW5rX29wZW5zX2luX25ld193aW5kb3c9dHJ1ZVwiPjwvaWZyYW1lPiA8L2Rpdj4gPC9zcGFuPiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5jZWxsID0gNjtcbnRoaXMub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChvcHRzICYmIG9wdHMuYnV0dG9ucykge1xuICAgICAgICBfdGhpcy5jZWxsID0gTWF0aC5yb3VuZCgxMiAvIF8ua2V5cyhvcHRzLmJ1dHRvbnMpLmxlbmd0aCk7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdkeW5hbWljLXBhZ2UnLCAnPHNlY3Rpb24gaWQ9XCJ7IF8ua2ViYWJDYXNlKGRhdGEudGl0bGUpIH1cIiA+IDxkaXYgY2xhc3M9XCJkaXZpZGU1MFwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgaWQ9XCJtb2RhbF9kaWFsb2dfY29udGFpbmVyXCI+IDwvZGl2PiA8L2Rpdj4gPC9zZWN0aW9uPicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCk7XG50aGlzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIDc1O1xudGhpcy5vbignbW91bnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKG9wdHMgJiYgb3B0cy5pZCAmJiBvcHRzLmlkICE9ICcjJykge1xuXG4gICAgICAgIEZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvZXhwbG9yZS9pdGVtcy8nICsgb3B0cy5pZCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgdmFyIGRpYWxvZ0NsYXNzID0gJ2Jsb2ctcGFnZSc7XG5cbiAgICAgICAgICAgIGlmIChvcHRzLmlkID09ICd0aGUtc3lzdGVtcy10aGlua2luZy1tYW5pZmVzdG8tcG9zdGVyJykge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xuICAgICAgICAgICAgICAgIGRpYWxvZ0NsYXNzID0gJ21hbmlmZXN0by1wYWdlJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0cy5pZCA9PSAnc3RtcycpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgICAgICAgICAgICAgICBkaWFsb2dDbGFzcyA9ICdzdG1zLXBhZ2UnO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghZGF0YSkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xuICAgICAgICAgICAgICAgIGRpYWxvZ0NsYXNzID0gJ25vdC1mb3VuZC1wYWdlJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgb3B0cy5ldmVudCA9IHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgaWQ6IG9wdHMuaWQsXG4gICAgICAgICAgICAgICAgICAgIGRpYWxvZzogX3RoaXMubW9kYWxcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgcmlvdC5tb3VudChfdGhpcy5tb2RhbF9kaWFsb2dfY29udGFpbmVyLCBkaWFsb2dDbGFzcywgb3B0cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWJhbm5lcicsICc8ZGl2IGNsYXNzPVwiZnVsbHdpZHRoYmFubmVyXCI+IDxkaXYgaWQ9XCJ0cF9iYW5uZXJcIiBjbGFzcz1cInRwLWJhbm5lclwiPiA8dWw+ICA8bGkgZWFjaD1cInsgZGF0YSB9XCIgZGF0YS10cmFuc2l0aW9uPVwiZmFkZVwiIGRhdGEtc2xvdGFtb3VudD1cIjVcIiBkYXRhLXRpdGxlPVwieyB0aXRsZSB9XCIgc3R5bGU9XCJiYWNrZ3JvdW5kOiByZ2IoMjQwLDExMCwzMCk7XCIgPiAgPGltZyBpZj1cInsgIXlvdXR1YmVpZCAmJiBpbWcgJiYgaW1nICE9IFxcJ3VuZGVmaW5lZFxcJyB9XCIgcmlvdC1zcmM9XCJ7IHBhcmVudC51cmwgKyBpbWcgKyBcXCc/YmFubmVyXFwnIH1cIiBhbHQ9XCJkYXJrYmx1cmJnXCIgZGF0YS1iZ2ZpdD1cImNvdmVyXCIgZGF0YS1iZ3Bvc2l0aW9uPVwibGVmdCB0b3BcIiBkYXRhLWJncmVwZWF0PVwibm8tcmVwZWF0XCI+IDxkaXYgaWY9XCJ7ICF5b3V0dWJlaWQgJiYgdGl0bGUgfVwiIGNsYXNzPVwiY2FwdGlvbiB0aXRsZS0yIHNmdFwiIGRhdGEteD1cIjUwXCIgZGF0YS15PVwiMTAwXCIgZGF0YS1zcGVlZD1cIjEwMDBcIiBkYXRhLXN0YXJ0PVwiMTAwMFwiIGRhdGEtZWFzaW5nPVwiZWFzZU91dEV4cG9cIj4gPHJhdyBjb250ZW50PVwieyB0aXRsZSB9XCI+PC9yYXc+IDwvZGl2PiA8ZGl2IGlmPVwieyAheW91dHViZWlkICYmIHN1YnRleHQgfVwiIGNsYXNzPVwiY2FwdGlvbiB0ZXh0IHNmbFwiIGRhdGEteD1cIjUwXCIgZGF0YS15PVwiMjIwXCIgZGF0YS1zcGVlZD1cIjEwMDBcIiBkYXRhLXN0YXJ0PVwiMTgwMFwiIGRhdGEtZWFzaW5nPVwiZWFzZU91dEV4cG9cIj4gPHJhdyBjb250ZW50PVwieyBzdWJ0ZXh0IH1cIj48L3Jhdz4gPC9kaXY+IDxkaXYgaWY9XCJ7ICF5b3V0dWJlaWQgfVwiIGVhY2g9XCJ7IF8uc29ydEJ5KGJ1dHRvbnMsIFxcJ29yZGVyXFwnKSB9XCI+IDxkaXYgY2xhc3M9XCJjYXB0aW9uIHNmYiByZXYtYnV0dG9ucyB0cC1yZXNpemVtZVwiIGRhdGEteD1cIjUwXCIgZGF0YS15PVwiMzU1XCIgZGF0YS1zcGVlZD1cIjUwMFwiIGRhdGEtc3RhcnQ9XCIxODAwXCIgZGF0YS1lYXNpbmc9XCJTaW5lLmVhc2VPdXRcIiBvbmNsaWNrPVwieyBwYXJlbnQuZ2V0TGluayB9XCI+IDxhIGhyZWY9XCJ7IGxpbmsgfHwgXFwnXFwnIH1cIiB0YXJnZXQ9XCJ7IHRhcmdldCB8fCBcXCdcXCd9XCIgY2xhc3M9XCJidG4gYnRuLWxnIGJ0bi10aGVtZS1kYXJrXCI+eyB0aXRsZSB9PC9hPiA8L2Rpdj4gPC9kaXY+IDxkaXYgaWY9XCJ7IHlvdXR1YmVpZCB9XCIgY2xhc3M9XCJ0cC1jYXB0aW9uIHNmdCBjdXN0b21vdXQgdHAtdmlkZW9sYXllclwiIGRhdGEteD1cImNlbnRlclwiIGRhdGEtaG9mZnNldD1cIjBcIiBkYXRhLXk9XCJjZW50ZXJcIiBkYXRhLXZvZmZzZXQ9XCIwXCIgZGF0YS1jdXN0b21pbj1cIng6MDt5OjA7ejowO3JvdGF0aW9uWDowO3JvdGF0aW9uWTowO3JvdGF0aW9uWjowO3NjYWxlWDo1O3NjYWxlWTo1O3NrZXdYOjA7c2tld1k6MDtvcGFjaXR5OjA7dHJhbnNmb3JtUGVyc3BlY3RpdmU6NjAwO3RyYW5zZm9ybU9yaWdpbjo1MCUgNTAlO1wiIGRhdGEtY3VzdG9tb3V0PVwieDowO3k6MDt6OjA7cm90YXRpb25YOjA7cm90YXRpb25ZOjA7cm90YXRpb25aOjA7c2NhbGVYOjAuNzU7c2NhbGVZOjAuNzU7c2tld1g6MDtza2V3WTowO29wYWNpdHk6MDt0cmFuc2Zvcm1QZXJzcGVjdGl2ZTo2MDA7dHJhbnNmb3JtT3JpZ2luOjUwJSA1MCU7XCIgZGF0YS1zcGVlZD1cIjYwMFwiIGRhdGEtc3RhcnQ9XCIxMDAwXCIgZGF0YS1lYXNpbmc9XCJQb3dlcjQuZWFzZU91dFwiIGRhdGEtZW5kc3BlZWQ9XCI1MDBcIiBkYXRhLWVuZGVhc2luZz1cIlBvd2VyNC5lYXNlT3V0XCIgZGF0YS1hdXRvcGxheT1cInRydWVcIiBkYXRhLWF1dG9wbGF5b25seWZpcnN0dGltZT1cImZhbHNlXCIgZGF0YS1uZXh0c2xpZGVhdGVuZD1cImZhbHNlXCIgZGF0YS10aHVtYmltYWdlPVwiaHR0cHM6Ly9pbWcueW91dHViZS5jb20vdmkveyB5b3V0dWJlaWQgfS9tcWRlZmF1bHQuanBnXCI+IDxpZnJhbWUgcmlvdC1zcmM9XCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC97IHlvdXR1YmVpZCB9P2hkPTEmd21vZGU9b3BhcXVlJmNvbnRyb2xzPTEmc2hvd2luZm89MFwiIHdpZHRoPVwiMTA2NnB4XCIgaGVpZ2h0PVwiNjAwcHhcIiBzdHlsZT1cIndpZHRoOjEwNjZweDtoZWlnaHQ6NjAwcHg7XCIgPiA8L2lmcmFtZT4gPC9kaXY+IDwvbGk+IDwvdWw+IDwvZGl2PiA8L2Rpdj4nLCAnaWQ9XCJob21lXCInLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5kYXRhID0gW107XG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCdzaXRlJyk7XG50aGlzLm1vdW50ZWQgPSBmYWxzZTtcblxudGhpcy53YXRjaERhdGEoJy9iYW5uZXInLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmIChmYWxzZSA9PSBfdGhpcy5tb3VudGVkKSB7XG4gICAgICAgICAgICBfdGhpcy5tb3VudGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIF90aGlzLmRhdGEgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaS5hcmNoaXZlICE9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICAgICAkKF90aGlzLnRwX2Jhbm5lcikucmV2b2x1dGlvbih7XG4gICAgICAgICAgICAgICAgc3RvcEF0U2xpZGU6IDEsXG4gICAgICAgICAgICAgICAgc3RvcEFmdGVyTG9vcHM6IDAsXG4gICAgICAgICAgICAgICAgc3RhcnR3aWR0aDogMTE3MCxcbiAgICAgICAgICAgICAgICBzdGFydGhlaWdodDogNjAwLFxuICAgICAgICAgICAgICAgIGhpZGVUaHVtYnM6IDEwXG4gICAgICAgICAgICAgICAgLy9mdWxsV2lkdGg6IFwib25cIixcbiAgICAgICAgICAgICAgICAvL2ZvcmNlRnVsbFdpZHRoOiBcIm9uXCIsXG4gICAgICAgICAgICAgICAgLy9sYXp5TG9hZDogXCJvblwiXG4gICAgICAgICAgICAgICAgLy8gbmF2aWdhdGlvblN0eWxlOiBcInByZXZpZXc0XCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB3aW5kb3cuRnJvbnRFbmQuZXJyb3IoZSk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtY291bnRtZWluJywgJzxzZWN0aW9uIGlmPVwieyBkYXRhIH1cIiBzdHlsZT1cImJhY2tncm91bmQ6IHJnYigyMTIsIDIxNCwgMjE1KTtcIj4gPGRpdiBjbGFzcz1cImRpdmlkZTUwXCI+PC9kaXY+IDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGlkPVwiaW1wYWN0X2ltZ1wiIGNsYXNzPVwiY29sLW1kLTZcIj4gPGltZyBjbGFzcz1cImltZy1yZXNwb25zaXZlXCIgYWx0PVwiNyBiaWxsaW9uIHRoaW5rZXJzXCIgcmlvdC1zcmM9XCJ7IHVybCtpbXBhY3QuaW1nICsgXFwnP2NvdW50bWVpblxcJyB9XCI+PC9pbWc+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY29sLW1kLTZcIj4gPGJyPiA8ZGl2IGNsYXNzPVwiZmFjdHMtaW5cIj4gPGgzPiA8c3BhbiBpZD1cImNvdW50ZXJcIiBjbGFzcz1cImNvdW50ZXJcIj57IEh1bWFuaXplLmZvcm1hdE51bWJlcihkYXRhLnRvdGFsKSB9PC9zcGFuPisgPC9oMz4gPGJyPiA8aDMgc3R5bGU9XCJmb250LXNpemU6IDM1cHg7IGZvbnQtd2VpZ2h0OiA3MDA7XCI+eyBlbmdhZ2Uuc3VidGV4dCB9PC9oMz4gPGRpdiBpZD1cIm1jX2VtYmVkX3NpZ251cFwiPiA8Zm9ybSBhY3Rpb249XCIvL2NhYnJlcmFsYWJzLnVzNC5saXN0LW1hbmFnZS5jb20vc3Vic2NyaWJlL3Bvc3Q/dT01ODk0NzM4NTM4M2QzMjNjYWY5MDQ3ZjM5JmFtcDtpZD05Nzk5ZDNhN2I5XCIgbWV0aG9kPVwicG9zdFwiIGlkPVwibWMtZW1iZWRkZWQtc3Vic2NyaWJlLWZvcm1cIiBuYW1lPVwibWMtZW1iZWRkZWQtc3Vic2NyaWJlLWZvcm1cIiBjbGFzcz1cIlwiIHRhcmdldD1cIl9ibGFua1wiIG5vdmFsaWRhdGU9XCJcIj4gPHAgc3R5bGU9XCJjb2xvcjogI2ZmZjtcIj57IGRhdGEubmV3c2xldHRlci50ZXh0IH08L3A+IDxkaXYgaWQ9XCJtY19lbWJlZF9zaWdudXBfc2Nyb2xsXCI+IDxkaXYgY2xhc3M9XCJtYy1maWVsZC1ncm91cFwiPiA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj4gPGlucHV0IHR5cGU9XCJlbWFpbFwiIHBsYWNlaG9sZGVyPVwiRW1haWwuLi5cIiBzdHlsZT1cImhlaWdodDogMzFweDtcIiB2YWx1ZT1cIlwiIG5hbWU9XCJFTUFJTFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJtY2UtRU1BSUxcIj4gPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj4gPGlucHV0IHJvbGU9XCJidXR0b25cIiB0eXBlPVwic3VibWl0XCIgc3R5bGU9XCJmb250LXZhcmlhbnQ6IHNtYWxsLWNhcHM7IHRleHQtdHJhbnNmb3JtOiBub25lO1wiIHZhbHVlPVwieyBpbXBhY3QudGV4dCB9XCIgbmFtZT1cInN1YnNjcmliZVwiIGlkPVwibWMtZW1iZWRkZWQtc3Vic2NyaWJlXCIgY2xhc3M9XCJidG4gYnRuLXRoZW1lLWJnXCI+eyBpbXBhY3QudGV4dCB9PC9pbnB1dD4gPC9zcGFuPiA8L2Rpdj4gPC9kaXY+ICA8ZGl2IHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAtNTAwMHB4O1wiPiA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiYl81ODk0NzM4NTM4M2QzMjNjYWY5MDQ3ZjM5Xzk3OTlkM2E3YjlcIiB0YWJpbmRleD1cIi0xXCIgdmFsdWU9XCJcIj4gPC9kaXY+IDxkaXYgaWQ9XCJtY2UtcmVzcG9uc2VzXCIgY2xhc3M9XCJjbGVhclwiIHN0eWxlPVwibWFyZ2luLXRvcDogNXB4O1wiPiA8ZGl2IGNsYXNzPVwicmVzcG9uc2VcIiBpZD1cIm1jZS1lcnJvci1yZXNwb25zZVwiIHN0eWxlPVwiY29sb3I6IHJlZDsgZGlzcGxheTpub25lXCI+PC9kaXY+IDxkaXYgY2xhc3M9XCJyZXNwb25zZVwiIGlkPVwibWNlLXN1Y2Nlc3MtcmVzcG9uc2VcIiBzdHlsZT1cImNvbG9yOiAjZmZmOyBkaXNwbGF5Om5vbmVcIj48L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Zvcm0+IDwvZGl2PiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtNCBjb2wtc20tNCBjb2wteHMtNFwiPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNvbC1tZC02IGNvbC1zbS00IGNvbC14cy00XCI+IDxkaXYgY2xhc3M9XCJhZGR0aGlzX2hvcml6b250YWxfZm9sbG93X3Rvb2xib3hcIj48L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMyBtYXJnaW4zMCBoaWRkZW4teHMgaGlkZGVuLXNtXCI+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMTJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyXCI+IDxkaXYgY2xhc3M9XCJuby1wYWRkaW5nLWlubmVyIGdyYXlcIj4gPGgzIGNsYXNzPVwid293IGFuaW1hdGVkIGZhZGVJbkRvd25mYWRlSW5SaWdodCBhbmltYXRlZFwiIHN0eWxlPVwidmlzaWJpbGl0eTogdmlzaWJsZTsgdGV4dC1hbGlnbjogY2VudGVyO1wiPiB7IG51bWJlclRvV29yZHMoZW5nYWdlLm9wdGlvbnMubGVuZ3RoKSB9IG1vcmUgdGhpbmdzIHlvdSBjYW4gZG86IDwvaDM+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC00XCIgZWFjaD1cInsgdmFsLCBpIGluIGVuZ2FnZS5vcHRpb25zIH1cIj4gPGRpdiBjbGFzcz1cInNlcnZpY2VzLWJveCBtYXJnaW4zMCB3b3cgYW5pbWF0ZWQgZmFkZUluUmlnaHQgYW5pbWF0ZWRcIiBzdHlsZT1cInZpc2liaWxpdHk6IHZpc2libGU7IGFuaW1hdGlvbi1uYW1lOiBmYWRlSW5SaWdodDsgLXdlYmtpdC1hbmltYXRpb24tbmFtZTogZmFkZUluUmlnaHQ7XCI+IDxkaXYgY2xhc3M9XCJzZXJ2aWNlcy1ib3gtaWNvblwiPiA8aSBjbGFzcz1cInsgdmFsLmljb24gfVwiPjwvaT4gPC9kaXY+IDxkaXYgY2xhc3M9XCJzZXJ2aWNlcy1ib3gtaW5mb1wiPiA8aDQ+eyB2YWwudGl0bGUgfTwvaDQ+IDxwPnsgdmFsLnRleHQgfTwvcD4gPGRpdiBpZj1cInsgdmFsLmJ1dHRvbnMgfVwiIGVhY2g9XCJ7IF8uc29ydEJ5KHZhbC5idXR0b25zLCBcXCdvcmRlclxcJykgfVwiPiA8YSBocmVmPVwieyBsaW5rIHx8IFxcJ1xcJyB9XCIgdGFyZ2V0PVwieyB0YXJnZXQgfHwgXFwnXFwnfVwiIGNsYXNzPVwiYnRuIGJ0bi1sZyBidG4tdGhlbWUtZGFya1wiPnsgdGl0bGUgfTwvYT4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9zZWN0aW9uPicsICdpZD1cImNvdW50bWVpblwiJywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuZGF0YSA9IG51bGw7XG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCdzaXRlJyk7XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvY291bnQtbWUtaW4nKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIF90aGlzLmltcGFjdCA9IGRhdGEuaW1wYWN0O1xuICAgICAgICBfdGhpcy5lbmdhZ2UgPSBkYXRhLmVuZ2FnZTtcbiAgICAgICAgX3RoaXMuZW5nYWdlLm9wdGlvbnMgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLmVuZ2FnZS5vcHRpb25zLCAnb3JkZXInKSwgZnVuY3Rpb24gKG9wdCkge1xuICAgICAgICAgICAgcmV0dXJuIG9wdC5hcmNoaXZlICE9IHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgICBfdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcblxuICAgICAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAkKF90aGlzLmNvdW50ZXIpLmNvdW50ZXJVcCh7XG4gICAgICAgICAgICBkZWxheTogMTAwLFxuICAgICAgICAgICAgdGltZTogODAwXG4gICAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgd2luZG93LkZyb250RW5kLmVycm9yKGUpO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWV4cGxvcmUnLCAnPGRpdiBpZj1cInsgaGVhZGVyIH1cIiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMTJcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj4gPHN0cm9uZz57IGhlYWRlci50aXRsZSB9PC9zdHJvbmc+IDwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGlmPVwieyBmaWx0ZXJzIH1cIiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwiY3ViZS1tYXNvbnJ5XCI+IDxkaXYgaWQ9XCJmaWx0ZXJzX2NvbnRhaW5lclwiIGNsYXNzPVwiY2JwLWwtZmlsdGVycy1hbGlnbkNlbnRlclwiPiA8ZGl2IGVhY2g9XCJ7IHZhbCwgaSBpbiBmaWx0ZXJzIH1cIiBkYXRhLWZpbHRlcj1cIi57IHZhbC50YWcgfVwiIGNsYXNzPVwiY2JwLWZpbHRlci1pdGVtIHsgXFwnY2JwLWZpbHRlci1pdGVtLWFjdGl2ZVxcJzogaSA9PSAwIH1cIj4geyB2YWwubmFtZSB9IDxkaXYgY2xhc3M9XCJjYnAtZmlsdGVyLWNvdW50ZXJcIj48L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGlkPVwibWFzb25yeV9jb250YWluZXJcIiBjbGFzcz1cImNicFwiPiA8YSBpZD1cInsgaWQgfVwiIGhyZWY9XCJ7IGxpbmsgfHwgXFwnIyFcXCcraWQgfVwiIHRhcmdldD1cIl9ibGFua1wiIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNsaWNrIH1cIiBlYWNoPVwieyBjb250ZW50IH1cIiBjbGFzcz1cImNicC1pdGVtIHsgdHlwZSB9IHsgXy5rZXlzKHRhZ3MpLmpvaW4oXFwnIFxcJykgfVwiPiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb25cIj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWRlZmF1bHRXcmFwXCI+IDxpbWcgaWY9XCJ7IGltZyB9XCIgcmlvdC1zcmM9XCJ7IHBhcmVudC51cmwgKyB0eXBlICsgXFwnL1xcJyArIGltZyB9XCIgYWx0PVwieyB0aXRsZSB9XCI+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tYWN0aXZlV3JhcFwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1hbGlnbkNlbnRlclwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1ib2R5XCI+IDxkaXYgaWY9XCJ7IHRpdGxlIH1cIiBjbGFzcz1cInsgXFwnY2JwLWwtY2FwdGlvbi10aXRsZVxcJzogdHJ1ZSB9XCIgPnsgdGl0bGUgfTwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9hPiA8L2Rpdj4gPC9kaXY+ICA8L2Rpdj4gPGRpdiBjbGFzcz1cImRpdmlkZTUwXCI+PC9kaXY+IDxkaXYgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiPiA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgb25jbGljaz1cInsgc2hvd0FsbCB9XCIgY2xhc3M9XCJidG4gYnRuLXRoZW1lLWRhcmsgYnRuLWxnXCI+RXhwbG9yZSBBbGw8L2E+IDwvZGl2PicsICdpZD1cImV4cGxvcmVcIicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLmZpbHRlcnMgPSBbXTtcbnRoaXMuaGVhZGVyID0gW107XG50aGlzLmNvbnRlbnQgPSBbXTtcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpO1xuXG50aGlzLnNob3dBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgJChfdGhpcy5tYXNvbnJ5X2NvbnRhaW5lcikuY3ViZXBvcnRmb2xpbygnZmlsdGVyJywgJyonKTtcbn07XG5cbnRoaXMub25DbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKHRoaXMubGluaykgcmV0dXJuIHRydWU7XG4gICAgRnJvbnRFbmQuUm91dGVyLnRvKF8ua2ViYWJDYXNlKGUuaXRlbS5pZCksIGUsIHRoaXMpO1xufTtcblxuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9leHBsb3JlJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRyeSB7XG4gICAgICAgIF90aGlzLmZpbHRlcnMgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLmZpbHRlcnMsICdvcmRlcicpLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgcmV0dXJuIGkuYXJjaGl2ZSAhPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgICAgX3RoaXMuaGVhZGVyID0gZGF0YS5oZWFkZXI7XG4gICAgICAgIF90aGlzLml0ZW1zID0gXy5zb3J0QnkoXy5tYXAoZGF0YS5pdGVtcywgZnVuY3Rpb24gKHZhbCwga2V5KSB7XG4gICAgICAgICAgICBpZiAodmFsICYmICEodmFsLmFyY2hpdmUgPT09IHRydWUpKSB7XG4gICAgICAgICAgICAgICAgdmFsLmlkID0ga2V5O1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLCAnb3JkZXInKTtcbiAgICAgICAgX3RoaXMuY29udGVudCA9IF90aGlzLml0ZW1zO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICAgICB2YXIgZGVmYXVsdEZpbHRlciA9IF8uZmlyc3QoX3RoaXMuZmlsdGVycywgZnVuY3Rpb24gKGZpbHRlcikge1xuICAgICAgICAgICAgcmV0dXJuIGZpbHRlclsnZGVmYXVsdCddID09PSB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKF90aGlzLm1hc29ucnlfY29udGFpbmVyKS5jdWJlcG9ydGZvbGlvKHtcbiAgICAgICAgICAgIGZpbHRlcnM6ICcjZmlsdGVyc19jb250YWluZXInLFxuICAgICAgICAgICAgbGF5b3V0TW9kZTogJ2dyaWQnLFxuICAgICAgICAgICAgZGVmYXVsdEZpbHRlcjogJy4nICsgZGVmYXVsdEZpbHRlci50YWcsXG4gICAgICAgICAgICBhbmltYXRpb25UeXBlOiAnZmxpcE91dERlbGF5JyxcbiAgICAgICAgICAgIGdhcEhvcml6b250YWw6IDI1LFxuICAgICAgICAgICAgZ2FwVmVydGljYWw6IDI1LFxuICAgICAgICAgICAgZ3JpZEFkanVzdG1lbnQ6ICdyZXNwb25zaXZlJyxcbiAgICAgICAgICAgIG1lZGlhUXVlcmllczogW3tcbiAgICAgICAgICAgICAgICB3aWR0aDogMTEwMCxcbiAgICAgICAgICAgICAgICBjb2xzOiA0XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDgwMCxcbiAgICAgICAgICAgICAgICBjb2xzOiAzXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDUwMCxcbiAgICAgICAgICAgICAgICBjb2xzOiAyXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDMyMCxcbiAgICAgICAgICAgICAgICBjb2xzOiAxXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIGRpc3BsYXlUeXBlOiAnbGF6eUxvYWRpbmcnLFxuICAgICAgICAgICAgZGlzcGxheVR5cGVTcGVlZDogMTAwXG4gICAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgd2luZG93LkZyb250RW5kLmVycm9yKGUpO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWZvb3RlcicsICc8Zm9vdGVyIGlkPVwiZm9vdGVyXCI+IDxkaXYgaWQ9XCJjb250YWN0XCIgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTQgY29sLXNtLTYgbWFyZ2luMzBcIj4gPGRpdiBjbGFzcz1cImZvb3Rlci1jb2xcIj4gPGgzPnsgZGF0YS5hYm91dC50aXRsZSB9PC9oMz4gPHAgc3R5bGU9XCJjb2xvcjogI2ZmZjtcIj57IGRhdGEuYWJvdXQudGV4dCB9PC9wPiA8dWwgY2xhc3M9XCJsaXN0LXVuc3R5bGVkIGNvbnRhY3RcIj4gPGxpIGVhY2g9XCJ7IF8uc29ydEJ5KGRhdGEuY29udGFjdCxcXCdvcmRlclxcJykgfVwiPiA8cCBzdHlsZT1cImNvbG9yOiAjZmZmO1wiPiA8c3Ryb25nPiA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPnsgdGl0bGUgfHwgXFwnXFwnIH0gPC9zdHJvbmc+IDxhIGlmPVwieyBsaW5rIH1cIiBocmVmPVwieyBsaW5rIH1cIiBzdHlsZT1cImNvbG9yOiAjZmZmXCIgPnsgdGV4dCB8fCBsaW5rIH08L2E+IDxzcGFuIGlmPVwieyAhbGluayB9XCI+eyB0ZXh0IH08L3NwYW4+IDwvcD4gPC9saT4gPC91bD4gPHVsIGlkPVwic29jaWFsX2ZvbGxvd1wiIGNsYXNzPVwibGlzdC1pbmxpbmUgc29jaWFsLTFcIj4gPGxpIGVhY2g9XCJ7IF8uc29ydEJ5KGRhdGEuYWJvdXQuc29jaWFsLCBcXCdvcmRlclxcJykgfVwiPiA8YSBocmVmPVwieyBsaW5rIH1cIiBhbHQ9XCJ7IHRpdGxlIH1cIj4gPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4gPC9hPiA8L2xpPiA8L3VsPiA8L2Rpdj4gPC9kaXY+ICA8ZGl2IGNsYXNzPVwiY29sLW1kLTQgY29sLXNtLTYgbWFyZ2luMzAgaGlkZGVuLXhzIGhpZGRlbi1zbVwiPiA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbFwiPiA8aDM+Rm9sbG93IFVzPC9oMz4gPGEgaWY9XCJ7IHNvY2lhbC50d2l0dGVyIH1cIiBjbGFzcz1cInR3aXR0ZXItdGltZWxpbmVcIiBocmVmPVwiaHR0cHM6Ly90d2l0dGVyLmNvbS97IHNvY2lhbC50d2l0dGVyLnRpdGxlIH1cIiBkYXRhLXdpZGdldC1pZD1cInsgc29jaWFsLnR3aXR0ZXIuYXBpIH1cIj5Ud2VldHMgYnkgQHsgc29jaWFsLnR3aXR0ZXIudGl0bGUgfTwvYT4gPC9kaXY+IDwvZGl2PiAgPGRpdiBjbGFzcz1cImNvbC1tZC00IGNvbC1zbS02IG1hcmdpbjMwIGhpZGRlbi14cyBoaWRkZW4tc21cIiBzdHlsZT1cInBhZGRpbmctcmlnaHQ6IDFweDtcIj4gPGRpdiBjbGFzcz1cImZvb3Rlci1jb2xcIj4gPGgzPkxpa2UgVXM8L2gzPiA8ZGl2IGlmPVwieyBzb2NpYWwuZmFjZWJvb2sgfVwiIGNsYXNzPVwiZmItcGFnZVwiIGRhdGEtaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS97IHNvY2lhbC5mYWNlYm9vay50aXRsZSB9XCIgZGF0YS1zbWFsbC1oZWFkZXI9XCJ0cnVlXCIgZGF0YS1hZGFwdC1jb250YWluZXItd2lkdGg9XCJ0cnVlXCIgZGF0YS1oaWRlLWNvdmVyPVwiZmFsc2VcIiBkYXRhLXNob3ctZmFjZXBpbGU9XCJ0cnVlXCIgZGF0YS1oZWlnaHQ9XCIzMDBcIiBkYXRhLXNob3ctcG9zdHM9XCJ0cnVlXCI+IDxkaXYgY2xhc3M9XCJmYi14ZmJtbC1wYXJzZS1pZ25vcmVcIj4gPGJsb2NrcXVvdGUgY2l0ZT1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS97IHNvY2lhbC5mYWNlYm9vay50aXRsZSB9XCI+IDxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20veyBzb2NpYWwuZmFjZWJvb2sudGl0bGUgfVwiPnsgdGl0bGUgfTwvYT4gPC9ibG9ja3F1b3RlPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgaWY9XCJ7IGRhdGEuY29weXJpZ2h0IH1cIiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyIHRleHQtY2VudGVyXCI+IDxkaXYgY2xhc3M9XCJmb290ZXItYnRtXCI+IDxzcGFuPiA8cmF3IGNvbnRlbnQ9XCJ7IGRhdGEuY29weXJpZ2h0LnRleHQgfVwiPjwvcmF3PiA8L3NwYW4+IDxpbWcgc3R5bGU9XCJkaXNwbGF5OiBibG9jazsgbWFyZ2luLWxlZnQ6IGF1dG87IG1hcmdpbi1yaWdodDogYXV0bzsgaGVpZ2h0OiA1JTsgd2lkdGg6IDUlO1wiIHJpb3Qtc3JjPVwieyB1cmwrZGF0YS5jb3B5cmlnaHQuaW1nK1xcJz9jb3B5MVxcJyB9XCI+PC9pbWc+IDxzcGFuIHN0eWxlPVwiZm9udC1zaXplOiA4cHg7XCI+eyBkYXRhLmNvcHlyaWdodC5saWNlbnNlIH08L3NwYW4+IDxpbWcgc3R5bGU9XCJkaXNwbGF5OiBibG9jazsgbWFyZ2luLWxlZnQ6IGF1dG87IG1hcmdpbi1yaWdodDogYXV0bzsgaGVpZ2h0OiAzJTsgd2lkdGg6IDMlO1wiIHJpb3Qtc3JjPVwieyB1cmwrZGF0YS5jb3B5cmlnaHQuaW1nMitcXCc/Y29weTJcXCcgfVwiPjwvaW1nPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9mb290ZXI+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoJ3NpdGUnKTtcblxudGhpcy5zb2NpYWwgPSBudWxsO1xudGhpcy5kYXRhID0gbnVsbDtcbnRoaXMudGl0bGUgPSBGcm9udEVuZC5jb25maWcuc2l0ZS50aXRsZTtcblxuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9mb290ZXInKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgIEZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvc29jaWFsJykudGhlbihmdW5jdGlvbiAoc29jaWFsKSB7XG4gICAgICAgICAgICBfdGhpcy5zb2NpYWwgPSBzb2NpYWw7XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgIEZyb250RW5kLmluaXRTb2NpYWwoKTtcbiAgICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB3aW5kb3cuRnJvbnRFbmQuZXJyb3IoZSk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtaW1wYWN0JywgJzxzZWN0aW9uPiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyIGlmPVwieyBoZWFkZXIgfVwiPnsgaGVhZGVyLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cCBpZj1cInsgaGVhZGVyIH1cIiBjbGFzcz1cImxlYWRcIj4geyBoZWFkZXIudGV4dCB9IDwvcD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBpZD1cImltcGFjdF9zbGlkZXJcIiBjbGFzcz1cIm93bC1jYXJvdXNlbFwiPiA8ZGl2IGNsYXNzPVwiaXRlbVwiIGVhY2g9XCJ7IGl0ZW1zIH1cIj4gPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiPiA8aW1nIGlmPVwieyBpbWcgfVwiIHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIxMjVweFwiIHJpb3Qtc3JjPVwieyBwYXJlbnQudXJsIH1pbXBhY3QveyBpbWcgfVwiIGFsdD1cInsgdGl0bGUgfVwiPiA8L2E+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvc2VjdGlvbj4nLCAnaWQ9XCJpbXBhY3RcIicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCk7XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvaW1wYWN0JykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRyeSB7XG4gICAgICAgIF90aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgICAgICBfdGhpcy5pdGVtcyA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEuaXRlbXMsICdvcmRlcicpLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgcmV0dXJuIGkuYXJjaGl2ZSAhPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgJChfdGhpcy5pbXBhY3Rfc2xpZGVyKS5vd2xDYXJvdXNlbCh7XG4gICAgICAgICAgICBhdXRvUGxheTogNTAwMCxcbiAgICAgICAgICAgIHBhZ2luYXRpb246IGZhbHNlLFxuICAgICAgICAgICAgaXRlbXM6IDQsXG4gICAgICAgICAgICBsb29wOiB0cnVlLFxuICAgICAgICAgICAgaXRlbXNEZXNrdG9wOiBbMTE5OSwgNF0sXG4gICAgICAgICAgICBpdGVtc0Rlc2t0b3BTbWFsbDogWzk5MSwgMl1cbiAgICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB3aW5kb3cuRnJvbnRFbmQuZXJyb3IoZSk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbWFpbicsICc8cGFnZS1iYW5uZXI+PC9wYWdlLWJhbm5lcj4gPGRpdiBjbGFzcz1cImRpdmlkZTYwXCI+PC9kaXY+IDxwYWdlLW1lc3NhZ2U+PC9wYWdlLW1lc3NhZ2U+IDxkaXYgY2xhc3M9XCJkaXZpZGU4MFwiPjwvZGl2PiA8cGFnZS1tZXRob2RvbG9neT48L3BhZ2UtbWV0aG9kb2xvZ3k+IDxkaXYgY2xhc3M9XCJkaXZpZGU1MFwiPjwvZGl2PiA8cGFnZS10ZXN0aW1vbmlhbHM+PC9wYWdlLXRlc3RpbW9uaWFscz4gPGRpdiBjbGFzcz1cImRpdmlkZTUwXCI+PC9kaXY+IDxwYWdlLWltcGFjdD48L3BhZ2UtaW1wYWN0PiA8ZGl2IGNsYXNzPVwiZGl2aWRlNTBcIj48L2Rpdj4gPHBhZ2UtY291bnRtZWluPjwvcGFnZS1jb3VudG1laW4+IDxkaXYgY2xhc3M9XCJkaXZpZGU3MFwiPjwvZGl2PiA8cGFnZS1uZXdzPjwvcGFnZS1uZXdzPiA8ZGl2IGNsYXNzPVwiZGl2aWRlNTBcIj48L2Rpdj4gPGRpdiBpZD1cImV4cGxvcmVfY29udGFpbmVyXCI+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiZGl2aWRlNDBcIj48L2Rpdj4nLCAnaWQ9XCJtYWluXCInLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudmFyIGlzU2FmYXJpID0gL1NhZmFyaS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAvQXBwbGUgQ29tcHV0ZXIvLnRlc3QobmF2aWdhdG9yLnZlbmRvcik7XG5pZiAoIWlzU2FmYXJpKSB7XG4gICAgdGhpcy5vbignbW91bnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJpb3QubW91bnQoX3RoaXMuZXhwbG9yZV9jb250YWluZXIsICdwYWdlLWV4cGxvcmUnLCB7IGl0ZW1zOiBbXSB9KTtcbiAgICAgICAgfSwgMjUwKTtcbiAgICB9KTtcbn1cbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1tZXNzYWdlJywgJzxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIFwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPnsgaGVhZGVyLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cD48cmF3IGNvbnRlbnQ9XCJ7IGhlYWRlci50ZXh0IH1cIj48L3Jhdz4gPC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPVwicm93IHNwZWNpYWwtZmVhdHVyZVwiPiA8ZGl2IGVhY2g9XCJ7IGl0ZW1zIH1cIiBjbGFzcz1cImNvbC1tZC00IGNvbC1zbS00IG1hcmdpbjEwXCI+IDxkaXYgY2xhc3M9XCJzLWZlYXR1cmUtYm94IHRleHQtY2VudGVyIHdvdyBhbmltYXRlZCBmYWRlSW5cIiBkYXRhLXdvdy1kdXJhdGlvbj1cIjcwMG1zXCIgZGF0YS13b3ctZGVsYXk9XCIyMDBtc1wiPiA8ZGl2IGNsYXNzPVwibWFzay10b3BcIj4gIDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+ICA8aDQ+eyB0aXRsZSB9PC9oND4gPC9kaXY+IDxkaXYgY2xhc3M9XCJtYXNrLWJvdHRvbVwiPiAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4gIDxoND57IHRpdGxlIH08L2g0PiAgPHA+eyB0ZXh0IH08L3A+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCAnaWQ9XCJtZXNzYWdlXCInLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5oZWFkZXIgPSB7fTtcbnRoaXMuaXRlbXMgPSBbXTtcblxuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9tZXNzYWdlJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgdHJ5IHtcbiAgICAgICAgX3RoaXMuaGVhZGVyID0gZGF0YS5oZWFkZXI7XG4gICAgICAgIF90aGlzLml0ZW1zID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YS5pdGVtcywgJ29yZGVyJyksIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICByZXR1cm4gaS5hcmNoaXZlICE9IHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHdpbmRvdy5Gcm9udEVuZC5lcnJvcihlKTtcbiAgICB9XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1tZXRob2RvbG9neScsICc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPnsgaGVhZGVyLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cCBjbGFzcz1cImxlYWRcIj57IGhlYWRlci50ZXh0IH08L3A+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJkaXZpZGUzMFwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtNlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGg0PnsgZnJhbWV3b3Jrcy5oZWFkZXIudGl0bGUgfTwvaDQ+IDxwIGNsYXNzPVwibGVhZFwiPnsgZnJhbWV3b3Jrcy5oZWFkZXIudGV4dCB9PC9wPiA8L2Rpdj4gPGRpdiBjbGFzcz1cInBhbmVsLWdyb3VwXCIgaWQ9XCJmcmFtZXdvcmtzXCI+IDxkaXYgZWFjaD1cInsgdmFsLCBpIGluIF8uc29ydEJ5KGZyYW1ld29ya3MuaXRlbXMsIFxcJ29yZGVyXFwnKSB9XCIgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+IDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCI+IDxoNCBjbGFzcz1cInBhbmVsLXRpdGxlXCI+IDxhIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXBhcmVudD1cIiNmcmFtZXdvcmtzXCIgaHJlZj1cIiNjb2xsYXBzZUZyYW1ld29ya3NfeyBpIH1cIj4geyB2YWwudGl0bGUgfSA8L2E+IDwvaDQ+IDwvZGl2PiA8ZGl2IGlkPVwiY29sbGFwc2VGcmFtZXdvcmtzX3sgaSB9XCIgY2xhc3M9XCJwYW5lbC1jb2xsYXBzZSBjb2xsYXBzZSB7IGluOiBpID09IDAgfVwiPiA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPiB7IHZhbC50ZXh0IH0gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiAgPGRpdiBjbGFzcz1cImNvbC1tZC02XCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDQ+eyBwYXJ0bmVycy5oZWFkZXIudGl0bGUgfTwvaDQ+IDxwIGNsYXNzPVwibGVhZFwiPnsgcGFydG5lcnMuaGVhZGVyLnRleHQgfTwvcD4gPC9kaXY+IDxkaXYgY2xhc3M9XCJwYW5lbC1ncm91cFwiIGlkPVwiYWNjb3JkaW9uXCI+IDxkaXYgZWFjaD1cInsgdmFsLCBpIGluIF8uc29ydEJ5KHBhcnRuZXJzLml0ZW1zLCBcXCdvcmRlclxcJykgfVwiIGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPiA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiPiA8aDQgY2xhc3M9XCJwYW5lbC10aXRsZVwiPiA8YSBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS1wYXJlbnQ9XCIjYWNjb3JkaW9uXCIgaHJlZj1cIiNjb2xsYXBzZU9uZV97IGkgfVwiPiB7IHZhbC50aXRsZSB9IDwvYT4gPC9oND4gPC9kaXY+IDxkaXYgaWQ9XCJjb2xsYXBzZU9uZV97IGkgfVwiIGNsYXNzPVwicGFuZWwtY29sbGFwc2UgY29sbGFwc2UgeyBpbjogaSA9PSAwIH1cIj4gPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj4geyB2YWwudGV4dCB9IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PicsICdpZD1cIm1ldGhvZG9sb2d5XCInLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL21ldGhvZG9sb2d5JykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRyeSB7XG4gICAgICAgIF90aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgICAgICBfdGhpcy5mcmFtZXdvcmtzID0gZGF0YS5mcmFtZXdvcmtzO1xuICAgICAgICBfdGhpcy5wYXJ0bmVycyA9IGRhdGEucGFydG5lcnM7XG5cbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB3aW5kb3cuRnJvbnRFbmQuZXJyb3IoZSk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbWVudS1uYXZiYXInLCAnPGRpdiBjbGFzcz1cIm5hdmJhci1jb2xsYXBzZSBjb2xsYXBzZVwiPiA8dWwgY2xhc3M9XCJuYXYgbmF2YmFyLW5hdiBuYXZiYXItcmlnaHRcIj4gPGxpIGNsYXNzPVwieyBkcm9wZG93bjogdHJ1ZSwgYWN0aXZlOiBpID09IDAgfVwiIGVhY2g9XCJ7IHZhbCwgaSBpbiBkYXRhIH1cIj4gPGEgaWY9XCJ7IHZhbC50aXRsZSB9XCIgaHJlZj1cInsgdmFsLmxpbmsgfHwgXFwnI1xcJyB9XCIgdGFyZ2V0PVwieyBfYmxhbms6IHZhbC5saW5rLnN0YXJ0c1dpdGgoXFwnaHR0cFxcJykgfVwiID4gPGkgaWY9XCJ7IHZhbC5pY29uIH1cIiBjbGFzcz1cInsgdmFsLmljb24gfVwiID48L2k+IHsgdmFsLnRpdGxlIH0gPGkgaWY9XCJ7IHZhbC5tZW51ICYmIHZhbC5tZW51Lmxlbmd0aCB9XCIgY2xhc3M9XCJmYSBmYS1hbmdsZS1kb3duXCIgPjwvaT4gPC9hPiA8L2xpPiA8L3VsPiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5kYXRhID0gW107XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvbmF2YmFyJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgdHJ5IHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgcmV0dXJuIGkuYXJjaGl2ZSAhPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB3aW5kb3cuRnJvbnRFbmQuZXJyb3IoZSk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbmF2YmFyJywgJzxkaXYgY2xhc3M9XCJuYXZiYXIgbmF2YmFyLWRlZmF1bHQgbmF2YmFyLXN0YXRpYy10b3AgeWFtbSBzdGlja3lcIiByb2xlPVwibmF2aWdhdGlvblwiPiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJuYXZiYXItaGVhZGVyXCI+IDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwibmF2YmFyLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIi5uYXZiYXItY29sbGFwc2VcIj4gPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+VG9nZ2xlIG5hdmlnYXRpb248L3NwYW4+IDxzcGFuIGNsYXNzPVwiaWNvbi1iYXJcIj48L3NwYW4+IDxzcGFuIGNsYXNzPVwiaWNvbi1iYXJcIj48L3NwYW4+IDxzcGFuIGNsYXNzPVwiaWNvbi1iYXJcIj48L3NwYW4+IDwvYnV0dG9uPiA8ZGl2PiA8YSBocmVmPVwiI2hvbWVcIj48aW1nIGlmPVwieyBkYXRhIH1cIiBzdHlsZT1cIm1hcmdpbi10b3A6IDdweDsgbWFyZ2luLXJpZ2h0OiAxNXB4O1wiIHJpb3Qtc3JjPVwieyB1cmwgfXNpdGUveyBkYXRhLmltZyB9XCIgYWx0PVwieyBkYXRhLmFsdCB9XCI+IDwvYT4gPC9kaXY+IDwvZGl2PiA8cGFnZS1tZW51LW5hdmJhcj48L3BhZ2UtbWVudS1uYXZiYXI+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL2xvZ28nKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICB0cnkge1xuICAgICAgICBfdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgICQoXCIuc3RpY2t5XCIpLnN0aWNreSh7IHRvcFNwYWNpbmc6IDAgfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB3aW5kb3cuRnJvbnRFbmQuZXJyb3IoZSk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbmV3cycsICc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8aDMgY2xhc3M9XCJoZWFkaW5nXCI+TGF0ZXN0IE5ld3M8L2gzPiA8ZGl2IGlkPVwibmV3c19jYXJvdXNlbFwiIGNsYXNzPVwib3dsLWNhcm91c2VsIG93bC1zcGFjZWRcIj4gPGRpdiBlYWNoPVwieyBkYXRhIH1cIj4gPGRpdiBjbGFzcz1cIm5ld3MtZGVzY1wiPiA8cD4gPGEgaHJlZj1cInsgbGluayB9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+eyBIdW1hbml6ZS50cnVuY2F0ZSh0aXRsZSwgMTI1KSB9PC9hPiA8L3A+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgJ2lkPVwibmV3c1wiJywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuZGF0YSA9IFtdO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL25ld3MnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgcmV0dXJuIGkuYXJjaGl2ZSAhPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgICQoX3RoaXMubmV3c19jYXJvdXNlbCkub3dsQ2Fyb3VzZWwoe1xuICAgICAgICAgICAgLy8gTW9zdCBpbXBvcnRhbnQgb3dsIGZlYXR1cmVzXG4gICAgICAgICAgICBpdGVtczogNCxcbiAgICAgICAgICAgIGl0ZW1zQ3VzdG9tOiBmYWxzZSxcbiAgICAgICAgICAgIGl0ZW1zRGVza3RvcDogWzExOTksIDRdLFxuICAgICAgICAgICAgaXRlbXNEZXNrdG9wU21hbGw6IFs5ODAsIDJdLFxuICAgICAgICAgICAgaXRlbXNUYWJsZXQ6IFs3NjgsIDJdLFxuICAgICAgICAgICAgaXRlbXNUYWJsZXRTbWFsbDogZmFsc2UsXG4gICAgICAgICAgICBpdGVtc01vYmlsZTogWzQ3OSwgMV0sXG4gICAgICAgICAgICBzaW5nbGVJdGVtOiBmYWxzZSxcbiAgICAgICAgICAgIHN0YXJ0RHJhZ2dpbmc6IHRydWUsXG4gICAgICAgICAgICBhdXRvUGxheTogNTAwMCxcbiAgICAgICAgICAgIGxvb3A6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB3aW5kb3cuRnJvbnRFbmQuZXJyb3IoZSk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtdGVzdGltb25pYWxzJywgJzxkaXYgaWQ9XCJ0ZXN0aW1vbmlhbHMtY2Fyb3VzZWxcIiBjbGFzcz1cInRlc3RpbW9uaWFscyB0ZXN0aW1vbmlhbHMtdi0yIHdvdyBhbmltYXRlZCBmYWRlSW5VcFwiIGRhdGEtd293LWR1cmF0aW9uPVwiNzAwbXNcIiBkYXRhLXdvdy1kZWxheT1cIjEwMG1zXCI+IDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLXNtLTggY29sLXNtLW9mZnNldC0yXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+eyBoZWFkZXIudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwPnsgaGVhZGVyLnRleHQgfTwvcD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gIDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS04IGNvbC1zbS1vZmZzZXQtMlwiPiA8ZGl2IGlkPVwidGVzdGltb25pYWxfc2xpZGVcIiBjbGFzcz1cInRlc3RpLXNsaWRlXCI+IDx1bCBjbGFzcz1cInNsaWRlc1wiPiA8bGkgZWFjaD1cInsgaXRlbXMgfVwiPiA8aW1nIHJpb3Qtc3JjPVwieyBwYXJlbnQudXJsICsgaW1nIH1cIiBhbHQ9XCJ7IHVzZXIgfVwiPiA8aDQ+IDxpIGNsYXNzPVwiZmEgZmEtcXVvdGUtbGVmdCBpb24tcXVvdGVcIj48L2k+IHsgdGV4dH0gPC9oND4gPHAgY2xhc3M9XCJ0ZXN0LWF1dGhvclwiPiB7IHVzZXIgfSAtIDxlbT57IHN1YnRleHQgfTwvZW0+IDwvcD4gPC9saT4gPC91bD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBjbGFzcz1cImRpdmlkZTMwXCI+PC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygndGVzdGltb25pYWxzJyk7XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvdGVzdGltb25pYWxzJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRyeSB7XG4gICAgICAgIF90aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgICAgICBfdGhpcy5pdGVtcyA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEuaXRlbXMsICdvcmRlcicpLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgcmV0dXJuIGkuYXJjaGl2ZSAhPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgJChfdGhpcy50ZXN0aW1vbmlhbF9zbGlkZSkuZmxleHNsaWRlcih7XG4gICAgICAgICAgICBzbGlkZXNob3dTcGVlZDogNTAwMCxcbiAgICAgICAgICAgIGRpcmVjdGlvbk5hdjogZmFsc2UsXG4gICAgICAgICAgICBhbmltYXRpb246IFwiZmFkZVwiXG4gICAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgd2luZG93LkZyb250RW5kLmVycm9yKGUpO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdibG9nLXBhZ2UnLCAnPGRpdiBpZj1cIm9wdHNcIiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIFwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPnsgZGF0YS50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHA+IDxyYXcgY29udGVudD1cInsgZGF0YS50ZXh0IH1cIj48L3Jhdz4gPC9wPiA8L2Rpdj4gPGlmcmFtZSBpZj1cInsgZGF0YS55b3V0dWJlaWQgfVwiIGlkPVwieXRwbGF5ZXJcIiB0eXBlPVwidGV4dC9odG1sXCIgd2lkdGg9XCI3MjBcIiBoZWlnaHQ9XCI0MDVcIiByaW90LXNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL3sgZGF0YS55b3V0dWJlaWQgfT9hdXRvcGxheT0xXCIgZnJhbWVib3JkZXI9XCIwXCIgYWxsb3dmdWxsc2NyZWVuPVwiXCIgY2xhc3M9XCJmaXR2aWRzXCIgc3R5bGU9XCJoZWlnaHQ6IDQwNXB4OyB3aWR0aDogNzIwcHg7IGRpc3BsYXk6IGJsb2NrOyBtYXJnaW4tbGVmdDogYXV0bzsgbWFyZ2luLXJpZ2h0OiBhdXRvO1wiPjwvaWZyYW1lPiA8aWZyYW1lIGlmPVwieyBkYXRhLnZpbWVvaWQgfVwiIHJpb3Qtc3JjPVwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvL3sgZGF0YS52aW1lb2lkIH1cIiB3aWR0aD1cIjcyMFwiIGhlaWdodD1cIjQwNVwiIGZyYW1lYm9yZGVyPVwiMFwiIHdlYmtpdGFsbG93ZnVsbHNjcmVlbj1cIlwiIG1vemFsbG93ZnVsbHNjcmVlbj1cIlwiIGFsbG93ZnVsbHNjcmVlbj1cIlwiIGNsYXNzPVwiZml0dmlkc1wiIHN0eWxlPVwiaGVpZ2h0OiA0MDVweDsgd2lkdGg6IDcyMHB4OyBkaXNwbGF5OiBibG9jazsgbWFyZ2luLWxlZnQ6IGF1dG87IG1hcmdpbi1yaWdodDogYXV0bztcIj48L2lmcmFtZT4gPGRpdiBpZj1cInsgYmxvZyB9XCIgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBcIj4gPGRpdiA+IDxyYXcgY29udGVudD1cInsgYmxvZyB9XCI+PC9yYXc+IDwvZGl2PiA8YnV0dG9ucyBidXR0b25zPVwieyBkYXRhLmJ1dHRvbnMgfVwiPjwvYnV0dG9ucz4gPC9kaXY+IDwvZGl2PiA8YnV0dG9ucyBpZj1cInsgIWJsb2cgfVwiIGJ1dHRvbnM9XCJ7IGRhdGEuYnV0dG9ucyB9XCI+PC9idXR0b25zPiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChvcHRzICYmIG9wdHMuZXZlbnQuaWQpIHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IG9wdHMuZXZlbnQuaXRlbTtcblxuICAgICAgICBfdGhpcy51cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblxuICAgICAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICAgICB2YXIgcmVmID0gRnJvbnRFbmQuTWV0YUZpcmUuZ2V0Q2hpbGQoRnJvbnRFbmQuc2l0ZSArICcvY29udGVudC8nICsgb3B0cy5ldmVudC5pZCk7XG4gICAgICAgIHZhciBmaXJlcGFkID0gbmV3IEZpcmVwYWQuSGVhZGxlc3MocmVmKTtcbiAgICAgICAgZmlyZXBhZC5nZXRIdG1sKGZ1bmN0aW9uIChodG1sKSB7XG4gICAgICAgICAgICBfdGhpcy5ibG9nID0gaHRtbDtcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnbWFuaWZlc3RvLXBhZ2UnLCAnPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIFwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPnsgZGF0YS50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHA+IDxyYXcgY29udGVudD1cInsgZGF0YS50ZXh0IH1cIj48L3Jhdz4gPC9wPiA8aW1nIHNyYz1cImh0dHBzOi8vYzY4Zjc5ODFhOGJiZTkyNmExZTAxNTRjYmZiZDVhZjFiNGRmMGYyMS5nb29nbGVkcml2ZS5jb20vaG9zdC8wQjZHQU40Z1gxYm5TZmxSbmRUUkplRlo1TkVzelNFRmxTelZLWkRaSlN6RnhlRGRpY0Zwb0xYVndTRE5GUldOMFJGaGZTMmMvY3JsYWIvc2l0ZS9tYW5pZmVzdG9fcG9zdGVyX25vX2RpYWdyYW0ucG5nXCIgYWx0PVwiU3lzdGVtcyBUaGlua2luZyBNYW5pZmVzdG9cIiBjbGFzcz1cImltZy1yZXNwb25zaXZlXCI+PC9pbWc+IDwvZGl2PiA8ZGl2IGlmPVwieyBibG9nIH1cIiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIFwiPiA8ZGl2ID4gPHJhdyBjb250ZW50PVwieyBibG9nIH1cIj48L3Jhdz4gPC9kaXY+IDxidXR0b25zIGJ1dHRvbnM9XCJ7IGRhdGEuYnV0dG9ucyB9XCI+PC9idXR0b25zPiA8L2Rpdj4gPC9kaXY+IDxidXR0b25zIGlmPVwieyAhYmxvZyB9XCIgYnV0dG9ucz1cInsgZGF0YS5idXR0b25zIH1cIj48L2J1dHRvbnM+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5vbignbW91bnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKG9wdHMgJiYgb3B0cy5ldmVudC5pZCkge1xuICAgICAgICBfdGhpcy5kYXRhID0gb3B0cy5ldmVudC5pdGVtO1xuXG4gICAgICAgIF90aGlzLnVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgIHZhciByZWYgPSBGcm9udEVuZC5NZXRhRmlyZS5nZXRDaGlsZChGcm9udEVuZC5zaXRlICsgJy9jb250ZW50L3N5c3RlbXMtdGhpbmtpbmctbWFuaWZlc3RvJyk7XG4gICAgICAgIHZhciBmaXJlcGFkID0gbmV3IEZpcmVwYWQuSGVhZGxlc3MocmVmKTtcbiAgICAgICAgZmlyZXBhZC5nZXRIdG1sKGZ1bmN0aW9uIChodG1sKSB7XG4gICAgICAgICAgICBfdGhpcy5ibG9nID0gaHRtbDtcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnbm90LWZvdW5kLXBhZ2UnLCAnPGRpdiBjbGFzcz1cImRpdmlkZTgwXCI+PC9kaXY+IDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyIHRleHQtY2VudGVyIGVycm9yLXRleHRcIj4gPGRpdiBjbGFzcz1cImRpdmlkZTMwXCI+PC9kaXY+IDxoMSBjbGFzcz1cImVycm9yLWRpZ2l0IHdvdyBhbmltYXRlZCBmYWRlSW5VcCBtYXJnaW4yMCBhbmltYXRlZFwiIHN0eWxlPVwidmlzaWJpbGl0eTogdmlzaWJsZTsgYW5pbWF0aW9uLW5hbWU6IGZhZGVJblVwOyAtd2Via2l0LWFuaW1hdGlvbi1uYW1lOiBmYWRlSW5VcDtcIj48aSBjbGFzcz1cImZhIGZhLXRodW1icy1kb3duXCI+PC9pPjwvaDE+IDxoMj57IGRhdGEubWVzc2FnZSB9PC9oMj4gPHA+PGEgaHJlZj1cIiNleHBsb3JlXCIgY2xhc3M9XCJidG4gYnRuLWxnIGJ0bi10aGVtZS1kYXJrXCI+R28gQmFjazwvYT48L3A+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuZGF0YSA9IHtcbiAgICBtZXNzYWdlOiAnT29wcywgdGhhdCBwYWdlIGNvdWxkIG5vdCBiZSBmb3VuZCEnXG59O1xuXG50aGlzLm9uKCdtb3VudCcsIGZ1bmN0aW9uICgpIHtcbiAgICBfdGhpcy51cGRhdGUoKTtcbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdzdG1zLXBhZ2UnLCAnPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIFwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPnsgZGF0YS5oZWFkZXIudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwPiA8cmF3IGNvbnRlbnQ9XCJ7IGRhdGEuaGVhZGVyLnRleHQgfVwiPjwvcmF3PiA8L3A+IDwvZGl2PiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgZWFjaD1cInsgXy5zb3J0QnkoZGF0YS5pdGVtcyxcXCdvcmRlclxcJykgfVwiIGNsYXNzPVwiY29sLXNtLTZcIj4gPGRpdiA+IDxpZnJhbWUgaWY9XCJ7IHlvdXR1YmVpZCB9XCIgaWQ9XCJ5dHBsYXllcl97IHlvdXR1YmVpZCB9XCIgdHlwZT1cInRleHQvaHRtbFwiIGhlaWdodD1cIjQwMFwiIHJpb3Qtc3JjPVwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQveyB5b3V0dWJlaWQgfT9hdXRvcGxheT0wXCIgZnJhbWVib3JkZXI9XCIwXCIgYWxsb3dmdWxsc2NyZWVuPVwiXCI+PC9pZnJhbWU+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5kYXRhID0gbnVsbDtcbnRoaXMub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgIEZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvc3RtcycpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgIH0pO1xufSk7XG59KTsiXX0=
