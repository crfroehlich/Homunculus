let MetaFire = require('./Firebase.js');
let usersnap = require('../integrations/usersnap');
let ga = require('../integrations/google.js');
let twitter = require('../integrations/twitter.js');
let facebook = require('../integrations/facebook.js');
let addThis = require('../integrations/addthis.js');
const _ = require('lodash')

const config = () => {
    const SITES = {
        CRL: {
            db: 'meta-map-production'
        },
        CRL_STAGING: {
            db: 'meta-map-staging'
        },
        THINK_WATER: {
            db: 'thinkwater-production'
        }
    }

    const ret = {
        host: window.location.host,
        site: {}
    }
    let segments = ret.host.split('.');
    let first = segments[0];
    if (first === 'www') {
        first = segments[1];
    }
    switch (first.toLowerCase()) {
        case 'localhost':
        case 'meta-map-staging':
            ret.site = SITES.CRL_STAGING;
            break;

        case 'crlab':
        case 'frontend':
            ret.site = SITES.CRL;
            break;

        case 'thinkwater-production':
        case 'thinkwater-staging':
        case 'thinkwater':
            ret.site = SITES.THINK_WATER;
            break;
    }

    return ret;
};

class Config {

    constructor(tags) {
        this.tags = tags;
        this.config = config();

        this.MetaFire = new MetaFire(this.config);
        this.socialFeatures = [];
    }

    initSocial() {
        _.each(this.socialFeatures, (feature) => {
            if(feature) feature();
        });
    }

    get site() {
        return 'frontend';
    }

    onReady() {
        if (!this._onReady) {
            this._onReady = new Promise((fulfill, reject) => {
                this.MetaFire.on('config', (data) => {
                    this.MetaFire.on('metamap/canvas', (canvas) => {
                        try {
                            _.extend(this.config.site, data);
                            this.config.canvas = canvas;
                            document.title = this.config.site.title;
                            let favico = document.getElementById('favico');
                            favico.setAttribute('href', `${this.config.site.imageUrl}favicon.ico`);
                            this.init();
                            fulfill(this.config.site);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            });
        }

        return this._onReady;
    }

    init() {
        return this.onReady().then((config) => {
            ga(this.config.site.google);
            //this.socialFeatures.push(twitter());
            //this.socialFeatures.push(facebook());
            this.socialFeatures.push(addThis(this.config.site.addthis.pubid));
            usersnap();
        });
    }
}

module.exports = Config;