const riot = require('riot');
const $ = require('jquery')
const _ = require('lodash')
require('bootstrap-hover-dropdown')

const html = `<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                    <i class="fa fa-trophy"></i>
                    <span class="badge badge-success">
                        { points.length }
                    </span>
                </a>
                <ul class="dropdown-menu">
                    <li class="external">
                        <h3>
                            <span class ="bold">{ points.length } new </span> achievement{ s: points.length == 0 || points.length > 1 }
                        </h3>
                        <a href="javascript:;">view all</a>
                    </li>
                    <li>
                        <ul class="dropdown-menu-list scroller" style="height: 250px;" data-handle-color="#637283">
                            <li if="{ points }"
                                each="{ points }"
                                onclick="{ parent.onClick }">
                                <a href="javascript:;">
                                    <span class="time">{ time }</span>
                                    <span class="details">
                                        <span class="label label-sm label-icon label-success">
                                            <i class="fa fa-plus"></i>
                                        </span>
                                        { event }
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
`;

riot.tag('meta-points', html, function (opts) {

    const Homunculus = require('../../../Homunculus.js');
    this.points = [];

    this.onClick = (event, params) => {
        console.log(event, params);
        return true;
    }

    this.on('mount', () => {
        Homunculus.MetaFire.on(`users/${Homunculus.User.userId}/points`, (data) => {
            this.points = _.filter(_.sortBy(data, 'order'), (d) => {
                var include = d.archive != true;
                return include;
            });
            this.update();
        });
    });
});