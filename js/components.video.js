define(['jquery','mixins.preloader','mixins.sound','videojs'], function($,MixinPreloader,MixinSound){


	var Component = function(element, options) {

		this.$el = $(element);

		// Default options for the plugin
		this.defaults = {
			autoplay: true,
			interactive: false,
			controls: false,
			preload: 'none',
			sound: null,
			/*techOrder: ["html5", "flash"]*/
			techOrder: ["flash"]
		};

		// merge default options with
		this.options = $.extend(this.defaults, options);
	};

	// MIXIN

	$.extend(Component.prototype, MixinPreloader);
	$.extend(Component.prototype, MixinSound);

	//extend prototype

	$.extend(Component.prototype, {



		initialize: function() {


			this.video = this.options.id; //this.$el.find('.video-js').get(0);

			// if the video has no id return 
			if (!this.options.id) {
				return;
			}

			console.info(this.options.id + ' ComponentVideo initialize');


			// if interactive set autoplay at false

			if (this.options.interactive) {
				this.options.autoplay = false;
			}


			// add custom location of the 
			videojs.options.flash.swf = "./images/video-js.swf";
			//videojs.options.flash.swf = "http://vjs.zencdn.net/4.2/video-js.swf "



			var self = this;
			//instance the videojs object
			// when ready add interactivity
			this.plugin = videojs(this.options.id, this.options).ready(function(){

				self.plugin = this;

				self.checkInteract();

			});


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
				return;
			}

			this.initSound();
			this.sound.playSound('click');

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

		dispose: function() {


			console.info(this.options.id + ' ComponentVideo dispose');

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