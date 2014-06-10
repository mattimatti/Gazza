define(['jquery','html5.media'], function($,HTML5Media) {

	var console = window.console;


	var HTML5AudioPlayer = function(element, options) {

		this.$el = $(element);

		this.plugin = element;

		this.elementId = this.$el.attr('id');

		this.initialize();

	};


	// extend from media
	$.extend(HTML5AudioPlayer.prototype, HTML5Media);


	//extend prototype

	$.extend(HTML5AudioPlayer.prototype, {

		// check if the browser can play a video
		hasFeature: function() {
			return !!document.createElement('audio').canPlayType;
		}


	});


	return HTML5AudioPlayer;

});