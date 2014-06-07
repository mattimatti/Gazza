

// Polyfill the console object

window.console = window.console || {};

var method;
var noop = function() {};
var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
var mlength = methods.length;

while (mlength--) {
	method = methods[mlength];

	// Only stub undefined methods.
	if (!window.console[method]) {
		window.console[method] = noop;
	}
}


//urlArgs: "bust=" + Math.random(),


// The require config file
require.config({
	

	paths: {
		jquery: 'vendor/jquery-1.9.1',
		skrollr: 'vendor/skrollr.min',
		tweenmax: 'vendor/TweenMax',
		reel: 'vendor/jquery.reel',
		panzoom: 'vendor/jquery.panzoom',
		videojs: 'vendor/video-js-4.1.0/video.dev'
	}

});




require([
	'app',
	'tweenmax'
], function(App) {
	App.initialize();
});