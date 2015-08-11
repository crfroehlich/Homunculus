/// <reference path="../../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../../typings/lodash/lodash.d.ts" />
/// <reference path="../../../../typings/riotjs/riotjs.d.ts" />

const $ = require('jquery');
const riot = require('riot');
const metaTable = require('./meta-table.js');

const html = `
<div class="modal fade" id="full" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-full">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                <h4 if="{title}" class="modal-title">{title}</h4>
            </div>
            <div id="modal_content" class="modal-body">

            </div>
            <div class="modal-footer">
                <button type="button" class="btn default" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
`;

module.exports = riot.tag('meta-dialog', html, function(opts) {

    const MetaMap = require('../../entry.js');
    
    this.title = ''
    this.visible = false;
    this.load = _.once(() => {
        riot.mount(this.modal_content, 'meta-table');
    });

    $(this.full).on('hide.bs.modal', () => {
        this.visible = false;
        if (MetaMap.Router.currentPage == 'mymaps') {
            MetaMap.Router.back();
        }
    });

    this.show = () => {
        if (!this.visible) {
            this.load();
            $(this.full).modal('show');
            this.visible = true;
        }
    }

    this.hide = () => {
        if (this.visible) {
            $(this.full).modal('hide');
            this.visible = false;
        }
    }

    this.toggle = () => {
        if (this.visible) {
            this.hide();
        } else {
            this.show();
        }
    }


    MetaMap.Eventer.every('nav mymaps', (event) => {
        if (event == 'nav') {
            this.hide();
        } else {
            this.show();
        }
    });

});