
var googleAnalytics = function (apiKey) {
    
    // Google Plus API
    (function () {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/platform.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();

    // Google Analytics API
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;
      m.parentNode.insertBefore(a, m);
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    window.ga('create', apiKey, 'auto');
    window.ga('send', 'pageview');
    return window.ga;
};

module.exports = googleAnalytics;


