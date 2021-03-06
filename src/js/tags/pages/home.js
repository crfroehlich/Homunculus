const riot = require('riot');
const CONSTANTS = require('../../constants/constants');
const _ = require('lodash')

const html = `
<div class="portlet light">
				<div class="portlet-body">
					<div class="row margin-bottom-30">
						<div if="{ header }" class="col-md-6">
                            <h1>{ header.title }</h1>
                            <p>{ header.text }</p>
							<ul class="list-unstyled margin-top-10 margin-bottom-10">
								<li each="{ areas }">
									<i class="{ icon }"></i> <b>{ title }</b> { text }
								</li>
							</ul>
							<!-- Blockquotes -->
							<blockquote class="hero">
								<p>{ quote.text }</p>
								<small>{ quote.by }</small>
							</blockquote>
                            <div class="addthis_horizontal_follow_toolbox"></div>
						</div>
						<div class ="col-md-6">
                          <iframe if="{ header.youtubeid }"
                                id="ytplayer"
                                type="text/html"
                                src="https://www.youtube.com/embed/{ header.youtubeid }"
                                frameborder="0" allowfullscreen
                                class ="fitvids"
                                style="height: 327px; width: 100%; display: block; margin-left: auto; margin-right: auto; broder: 0;"
                            />
							</iframe>
						</div>
					</div>
                    <div class="headline">
						<h3>{ userName }{ vision.title }</h3>
					</div>
                    <div>
                        <p>{ vision.text }</p>
                    </div>
				</div>
			</div>
`;

module.exports = riot.tag('home', html, function(opts) {

    const Homunculus = require('../../../Homunculus');

    this.areas = []
    this.header = {}

    Homunculus.MetaFire.on(CONSTANTS.ROUTES.HOME, (data) => {
        this.areas = _.filter(_.sortBy(data.areas, 'order'), (d) => {
            var include = d.archive != true;
            return include;
        });
        this.quote = data.quote;
        this.header = data.header;
        this.vision = data.vision;

        this.userName = Homunculus.User.fullName;

        this.update();

        window.NProgress.done();
    });
});