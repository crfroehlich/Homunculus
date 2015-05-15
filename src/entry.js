﻿
require('./js/integrations/auth0');
require('./js/integrations/googleanalytics');
require('./js/integrations/newrelic');
require('./js/integrations/raygun');
require('./js/integrations/usersnap');

require('./tags/page-actions.tag');
require('./tags/page-container.tag');
require('./tags/page-content.tag');
require('./tags/page-footer.tag');
require('./tags/page-header.tag');
require('./tags/page-logo.tag');
require('./tags/page-search.tag');
require('./tags/page-sidebar.tag');
require('./tags/page-topmenu.tag');
require('./tags/page-body.tag');

require('./js/canvas/editor.js');
require('./js/canvas/user.js');
require('./js/canvas/join_nation.js');
require('./js/canvas/editor_options.js');
require('./js/canvas/tutorial.js');
require('./js/canvas/analytics.js');
require('./js/canvas/attachments.js');
require('./js/canvas/autosave.js');
require('./js/canvas/generator.js');
require('./js/canvas/history.js');
require('./js/canvas/layouts.js');
require('./js/canvas/gorges_grid.js');
require('./js/canvas/map.js');
require('./js/canvas/maps.js');
require('./js/canvas/feed.js');
require('./js/canvas/top_maps.js');
require('./js/canvas/perspectives.js');
require('./js/canvas/presenter.js');
require('./js/canvas/sharing.js');
require('./js/canvas/standards.js');
require('./js/canvas/tagging.js');
require('./js/canvas/tagging_admin.js');
require('./js/canvas/tagging_ccs.js');
require('./js/canvas/templates.js');
require('./js/canvas/tests.js');
require('./js/canvas/ui.js');

var mm = require('./MetaMap');

module.exports = new mm();