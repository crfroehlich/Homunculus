const ActionBase = require('./ActionBase.js');
const ACTIONS = require('../constants/actions');

class Action extends ActionBase {
    constructor(...params) {
        super(...params);
        this._actions = {};
    }

    _getAction(action) {
        let ret = this._actions[action];
        if (!ret) {
            let Method = null;
            switch(action) {
                case ACTIONS.MAP:
                    Method = require('./OpenMap.js');
                    break;
                case ACTIONS.NEW_MAP:
                    Method = require('./NewMap.js');
                    break;
                case ACTIONS.COPY_MAP:
                    Method = require('./CopyMap.js');
                    break;
                case ACTIONS.DELETE_MAP:
                    Method = require('./DeleteMap.js');
                    break;
                case ACTIONS.MY_MAPS:
                    Method = require('./MyMaps.js');
                    break;
                case ACTIONS.LOGOUT:
                    Method = require('./Logout.js');
                    break;
                case ACTIONS.TERMS_AND_CONDITIONS:
                    Method = require('./Terms.js');
                    break;
                    break;
                case ACTIONS.FEEDBACK:
                    Method = require('./Feedback');
                    break;
                default:
                    Method = require('./Home.js');
                    break;
            }
            if (Method) {
                ret = new Method(this.metaFire, this.eventer, this.pageFactory);
                this._actions[action] = ret;
            }
        }
        return ret;
    }

    act(action, ...params) {
        super.act();
        let method = this._getAction(action);
        if (method) {
            return method.act(...params);
        }
    }

}

module.exports = Action;