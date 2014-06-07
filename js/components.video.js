define(['jquery','mixins.preloader','components.sound','videojs'], function($,MixinPreloader,ComponentSound){


	var Component = function(element, options) {

		this.$el = $(element);

		// Default options for the plugin
		this.defaults = {
			autoplay: true,
			interactive: false,
			controls: false,
			preload: 'none',
			sound: null,
			techOrder: ["html5", "flash"]
		};

		// merge default options with
		this.options = $.extend(this.defaults, options);
	};

	// MIXIN

	$.extend(Component.prototype, MixinPreloader);

	//extend prototype

	$.extend(Component.prototype, {



		initialize: function() {


			this.video = this.options.id; //this.$el.find('.video-js').get(0);

			// if the video has no id return 
			if (!this.options.id) {
				return;
			}

			console.debug('video initialize', this.options.id);


			// if interactive set autoplay at false

			if (this.options.interactive) {
				this.options.autoplay = false;
			}


			// add custom location of the 
			videojs.options.flash.swf = "./images/video-js.swf";


			//instance the videojs object
			// when ready add interactivity
			this.plugin = videojs(this.options.id, this.options).ready($.proxy(this.checkInteract, this));


		},

		// video click interactivity
		checkInteract: function() {

			if (this.options.interactive) {
				this.$el.on("click", $.proxy(this.toggleVideoPlayback, this));
				this.$el.addClass('interactive');
			} else {
				this.plugin.play();
			}

		},

		// toggle the video playstate
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

		// video has no sound
		initSound: function() {

			this.sound = new ComponentSound();

			if (this.options.sound) {
				this.sound.registerSoundFullPath(this.options.sound);
			}
		},

		// remove sound
		disposeSound: function() {
			if (this.sound) {
				this.sound.removeAllSounds();
				delete this.sound;
			}
		},

		dispose: function() {

			if (this.plugin) {

				this.disposeSound();

				try {
					
					if (!this.plugin.paused()){
					this.plugin.pause();
					this.plugin.currentTime(0);
					this.plugin.controlBar.hide();
					this.plugin.controls(false);
					this.$el.off();
					
					}

				} catch (e) {
					console.error('errors disposing video component');
					console.error(e);
				}

			}

			// rimuoviamo
			delete this.$el;
			delete this.plugin;

		}



	});


	return Component;

});