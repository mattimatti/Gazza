// The require config file
require.config({
	paths: {
		jquery: 'vendor/jquery-1.9.1',
		skrollr: 'vendor/skrollr.min',
		tweenmax: 'vendor/TweenMax',
		reel: 'vendor/jquery.reel',
		panzoom: 'vendor/jquery.panzoom',
		videojs: 'vendor/video-js-4.1.0/video'
	}

});




require([
	'app',
	'tweenmax'
], function(App) {
	App.initialize();
});