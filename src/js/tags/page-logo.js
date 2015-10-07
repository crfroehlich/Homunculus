const riot = require('riot');
const CONSTANTS = require('../constants/constants');

const html = `
<div class ="page-logo">
    <a id="meta_logo" href="#home">
        <img src="src/images/metamap_cloud.png" alt="logo" class ="logo-default" />
    </a>
    <div id="meta_menu_toggle" class="menu-toggler sidebar-toggler" onclick="{ onClick }" style="{ getDisplay('menu') }">
        <!--DOC: Remove the above "hide" to enable the sidebar toggler button on header-->
    </div>
</div>
<a href="javascript:;" class ="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">
</a>
`;

module.exports = riot.tag('page-logo', html, function(opts) {

    const MetaMap = require('../../MetaMap');

    this.onClick = () => {
        MetaMap.Eventer.do(CONSTANTS.EVENTS.SIDEBAR_TOGGLE);
    }

//     this.getDisplay = (el) => {
//
//         if(!this.display) {
//             return 'display: none;';
//         } else {
//             return '';
//         }
//     }
//
//     MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_CLOSE, () => {
//         this.display = false;
//         this.update();
//     });
//
//
//     MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_OPEN, () => {
//         this.display = true;
//         this.update();
//     });

});