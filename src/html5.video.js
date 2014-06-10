define(['jquery','html5.media'], function($,HTML5Media) {

	var console = window.muteConsole;


	var HTML5VideoPlayer = function(element, options) {

		this.$el = $(element);

		this.plugin = element;

		this.elementId = this.$el.attr('id');

		this.initialize();

	};


	// extend from media
	$.extend(HTML5VideoPlayer.prototype, HTML5Media);


	//extend prototype

	$.extend(HTML5VideoPlayer.prototype, {

		// check if the browser can play a video
		hasFeature: function() {
			return !!document.createElement('video').canPlayType;
		}


	});


	return HTML5VideoPlayer;

});