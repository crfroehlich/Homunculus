const localforage = require('localforage')
const _ = require('lodash')
const CONSTANTS = require('../constants/constants')

const toBool = (val) => {
    let ret = false;
    if (val === true || val === false) {
        ret = val;
    } else {
        if (_.contains(['true', 'yes', '1'], val + ''.toLowerCase().trim())) {
            ret = true;
        }
    }
    return ret;
}

class Sharing {

    constructor(user) {
        this.user = user
        this._Homunculus = require('../../Homunculus')
        this._fb = this._Homunculus.MetaFire;
    }

    addShare(map, userData, opts = { read: true, write: false }) {
        if (map && map.id && userData && userData.id) {
            this._fb.setData({
                read: toBool(opts.read),
                write: toBool(opts.write),
                name: opts.name,
                picture: opts.picture
            }, `${CONSTANTS.ROUTES.MAPS_LIST}/${map.id}/shared_with/${userData.id}`)
            this._fb.pushData({
                event: `${this.user.displayName} shared a map, ${map.name}, with you!`,
                mapId: map.id,
                type: CONSTANTS.NOTIFICATION.MAP,
                time: `${new Date()}`
            }, `${CONSTANTS.ROUTES.NOTIFICATIONS.format(userData.id)}`)
        }
    }

    removeShare(map, userData) {
        if (map && map.id && userData && userData.id) {
            this._fb.deleteData(`${CONSTANTS.ROUTES.MAPS_LIST}/${map.id}/shared_with/${userData.id}`)
            this._fb.pushData({
                event: `${this.user.displayName} removed a map, ${map.name}, that was previously shared.`,
                time: `${new Date()}`
            }, `${CONSTANTS.ROUTES.NOTIFICATIONS.format(userData.id)}`)
        }
    }

    editShare(mapId, userData, opts = { read: true, write: false }) {

    }

}

module.exports = Sharing