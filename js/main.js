// The require config file
require.config({
	paths: {
		jquery: 'vendor/jquery-1.9.1',
		skrollr: 'vendor/skrollr.min',
		tweenmax: 'vendor/TweenMax',
		reel: 'vendor/jquery.reel',
		panzoom: 'vendor/jquery.panzoom'
	}/*,
	shim: {
		tweenmax: {
			exports: 'TweenMax'
		}
	}*/

});




require([
	'components.scroller',
	'tweenmax'
], function(App) {

	App.initialize();
});