(function() {

	var Component = function(element, options) {
		console.debug('constructor', arguments);

		this.$el = $(element);

		// Default options for the plugin
		this.defaults = {
			autoplay: true,
			interactive: false,
			controls: false,
			preload: 'none'
		};

		// merge default options with
		this.options = $.extend(this.defaults, options);
	}

	$.extend(Component.prototype, {



		initialize: function() {
			console.debug('video initialize', arguments);

			var $video = this.$el.find('video');

			this.video = this.$el.find('video').get(0);

			console.debug('this.video', this.video);


			// if interactive set autoplay at false
			if (this.options.interactive) {
				this.options.autoplay = false;
			}


			//instance the videojs object
			this.plugin = videojs(this.video, this.options);


			// make the video interactive on click
			if (this.options.interactive) {
				this.$el.on("click", $.proxy(this.toggleVideoPlayback, this));
			} else {
				this.plugin.play();
			}



		},


		toggleVideoPlayback: function() {
			if (!this.plugin) {
				console.error("clicking a video not inited");
			}

			// put it in try catch.. if the video is not playing fires an error..
			// HTML5 full of Bullshit .
			
			var isPlaying = false;
			try {
				isPlaying = this.plugin.isPlaying();
			} catch (e) {}

			console.debug("toggleVideoPlayback", this.plugin);
			if (isPlaying) {
				this.plugin.pause();
			} else {
				this.plugin.play();
			}

		},


		dispose: function() {
			console.debug('video dispose');
			if (this.plugin) {
				this.plugin.pause();
				this.plugin.currentTime(0);
				this.plugin.controlBar.hide();
				this.plugin.controls(false);
			}

		}



	});


	window.ComponentVideo = Component;

}());