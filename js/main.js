

// Polyfill the console object

window.console = window.console || {};

var method;
var noop = function() {};
var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
var length = methods.length;

while (length--) {
	method = methods[length];

	// Only stub undefined methods.
	if (!window.console[method]) {
		window.console[method] = noop;
	}
}




// The require config file
require.config({
	

	urlArgs: "bust=" + Math.random(),

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