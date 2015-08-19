const riot = require('riot');
const metaPoints = require('./menu/meta-points.js');
const metaHelp = require('./menu/meta-help.js');
const metaUser = require('./menu/meta-user.js');
const metaNot = require('./menu/meta-notifications.js');

const html = `
<div class="top-menu">
    <ul class="nav navbar-nav pull-right">
        <li class="separator hide"></li>
        <li class="dropdown dropdown-extended dropdown-notification dropdown" id="header_notification_bar"></li>

        <li class="separator hide"></li>
        <li class="dropdown dropdown-extended dropdown-notification dropdown" id="header_points_bar"></li>

        <li class="separator hide"></li>
        <li class="dropdown" id="header_dashboard_bar" onclick="{ onClick }">
            <a class="dropdown-toggle" href="#home">
                <i class="fa fa-home"></i>
            </a>
        </li>
            
        <li class="separator hide"></li>
        <li id="header_help_bar" class="dropdown dropdown-extended dropdown-notification dropdown"></li>
            
        <li class="separator hide"></li>
        <li id="header_user_menu" class="dropdown dropdown-user dropdown"></li>
    </ul>
</div>
`;

module.exports = riot.tag('page-topmenu', html, function(opts) {
    this.onClick = (event, params) => {
        console.log(event, params);
        return true;
    }

    this.on('mount', () => {
        riot.mount(this.header_points_bar, 'meta-points');
        riot.mount(this.header_notification_bar, 'meta-notifications');
        riot.mount(this.header_help_bar, 'meta-help');
        riot.mount(this.header_user_menu, 'meta-user');
    });

});