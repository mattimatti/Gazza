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

			var $video = this.$el.find('video');

			this.video = this.$el.find('video').get(0);

			if (!this.video) {
				return;
			}



			console.clear();
			console.debug('video initialize');

			// if interactive set autoplay at false
			if (this.options.interactive) {
				this.options.autoplay = false;
			}


			//instance the videojs object
			this.plugin = videojs(this.video, this.options);


			// make the video interactive on click
			if (this.options.interactive) {
				this.$el.on("click", $.proxy(this.toggleVideoPlayback, this));
				this.$el.addClass('interactive');
				this.initSound();
			} else {
				this.plugin.play();
			}



		},


		toggleVideoPlayback: function() {
			if (!this.plugin) {
				console.error("clicking a video not inited");
			}

			this.initSound();
			this.sound.playSound('click');

			// put it in try catch.. if the video is not playing fires an error..
			// HTML5 full of Bullshit .

			var isPaused = true;
			try {
				isPaused = this.plugin.paused();
			} catch (e) {}

			console.debug("toggleVideoPlayback", this.plugin, this.plugin.paused());
			if (!isPaused) {
				this.plugin.pause();
			} else {
				this.plugin.play();
			}

		},

		initSound: function() {
			console.debug('initSound');
			this.sound = new window.ComponentSound();
			this.sound.registerSoundById('click');
		},


		disposeSound: function() {
			if (this.sound) {
				this.sound.removeAllSounds();
				delete this.sound;
			}

		},

		dispose: function() {

			if (this.plugin) {
				this.disposeSound();
				this.plugin.pause();
				this.plugin.currentTime(0);
				this.plugin.controlBar.hide();
				this.plugin.controls(false);
			}
			this.$el.off();
			delete this.$el;
			delete this.plugin;

		}



	});


	window.ComponentVideo = Component;

}());