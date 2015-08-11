const ActionBase = require('./ActionBase.js');
const ROUTES = require('../constants/routes.js');

class CopyMap extends ActionBase {
    constructor(...params) {
        super(...params);
        this.metaMap = require('../../entry.js');
    }

    act(id, ...params) {
        super.act(id, ...params);
        if (!id) {
            return new Error('Must have a map in order to copy.');
        }
        this.metaFire.getData(`${ROUTES.MAPS_LIST}${id}`).then((oldMap) => {
            let newMap = {
                created_at: new Date(),
                owner: this.metaMap.User.userId,
                name: this.appendCopy(oldMap.name)
            }
            this.metaFire.getData(`${ROUTES.MAPS_DATA}${id}`).then((oldMapData) => {
                let pushState = this.metaFire.pushData(newMap, `${ROUTES.MAPS_LIST}`);
                let mapId = pushState.key();
                this.metaFire.setData(oldMapData, `${ROUTES.MAPS_DATA}${mapId}`);
                this.metaMap.Router.to(`map/${mapId}`);
            });
        });
        return true;
    }

    appendCopy(str) {
        let ret = str;
        if (!_.contains(str, '(Copy')) {
            ret = ret + ' (Copy 1)';
        } else {
            let mess = str.split(' ');
            let cnt = 2;
            if (mess[mess.length - 2] == '(Copy') {
                let grbg = mess[mess.length - 1];
                if (grbg) {
                    grbg = grbg.replace(')', '');
                    cnt = +grbg + 1;
                    ret = mess.slice(0, mess.length - 2).join(' ');
                }
            }
            ret += ` (Copy ${cnt})`;
        }
        return ret;
    }
}

module.exports = CopyMap;