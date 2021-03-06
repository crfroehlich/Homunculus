const riot = require('riot')
const ActionBase = require('./ActionBase.js');
const CONSTANTS = require('../constants/constants');
const home = require('../tags/pages/courses');

class Courses extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act(id, ...params) {
        super.act(id, ...params);
        $(`#${CONSTANTS.ELEMENTS.APP_CONTAINER}`).empty();
        let tag = riot.mount(document.getElementById(CONSTANTS.ELEMENTS.APP_CONTAINER), CONSTANTS.TAGS.COURSE_LIST)[0];
        tag.update()
        this.eventer.do(CONSTANTS.PAGES.COURSE_LIST, { id: id }, ...params);
        this.eventer.do(CONSTANTS.EVENTS.PAGE_NAME, { name: 'Courses' }, ...params);

        return true;
    }
}

module.exports = Courses;