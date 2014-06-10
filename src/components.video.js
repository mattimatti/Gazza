define(['jquery', 'mixins.preloader', 'mixins.sound', 'mediaelement'], function($, MixinPreloader, MixinSound) {

	var console = window.console;

	var Component = function(element, options) {

		this.$el = $(element);

		this.elementId = this.$el.attr('id');

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
	$.extend(Component.prototype, MixinSound);

	//extend prototype

	$.extend(Component.prototype, {



		initialize: function() {


			if (this.initialized) {
				console.warn(this.elementId + ' Component already initialized exit');
				return;
			}
			this.initialized = true;


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


			// toggle visibility
			var playerStyle = 'hide';

			var videoOptions = {
				alwaysShowControls: true,
				iPadUseNativeControls: false,
				iPhoneUseNativeControls: false,
				AndroidUseNativeControls: false,
				isVideo: true
			};

			this.removePoster();

			//this.plugin = window.MediaElementPlayer("#" + this.options.id, videoOptions);
			//this.plugin.stop();

			var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);


			this.plugin = document.getElementById(this.options.id);
			this.plugin.load();

			this.$plugin = $(".videoWrapper");

			this.createPoster();


			if (isSafari) {
				//this.plugin.removeAttribute('autoplay');
				this.plugin.preload = true;

			}

			this.checkInteract();


		},


		createPoster: function() {

			/*
			this.posterObj = $('<div class="posterImg"><img  src="' + this.plugin.poster + '"/></div>');
			this.posterObj.appendTo(this.$el);
			this.$plugin.hide();
			*/

		},

		removePoster: function() {
			/*
			if (this.posterObj) {
				this.posterObj.hide();
				this.posterObj.fadeTo(.1, 0);
				this.posterObj.empty().remove();
				delete this.posterObj;
			}
			if (this.$plugin) {
				this.$plugin.show();
			}*/

		},

		// video click interactivity
		checkInteract: function() {

			this.$el.off();
			if (this.options.interactive) {
				this.$el.on("click", $.proxy(this.toggleVideoPlayback, this));
				this.$el.addClass('interactive');
			} else {
				this.plugin.play();
			}

		},

		// toggle the video playstate
		toggleVideoPlayback: function() {



			console.info(this.elementId + " toggle clip");

			if (!this.plugin || !this.isPlayable()) {
				console.error(this.elementId + " ComponentVideo clicking a video not inited", this.isPlayable());
				return;
			}

			this.removePoster();

			console.debug(this.elementId + " ComponentVideo toggleVideoPlayback");

			if (!this.isPaused()) {
				this.stop();
			} else {
				this.play();
			}

		},



		// HAVE_NOTHING (numeric value 0)
		// No information regarding the media resource is available. No data for the current playback position is available. Media elements whose networkState attribute are set to NETWORK_EMPTY are always in the HAVE_NOTHING state.

		// HAVE_METADATA (numeric value 1)
		// Enough of the resource has been obtained that the duration of the resource is available. In the case of a video element, the dimensions of the video are also available. The API will no longer throw an exception when seeking. No media data is available for the immediate current playback position.

		// HAVE_CURRENT_DATA (numeric value 2)
		// Data for the immediate current playback position is available, but either not enough data is available that the user agent could successfully advance the current playback position in the direction of playback at all without immediately reverting to the HAVE_METADATA state, or there is no more data to obtain in the direction of playback. For example, in video this corresponds to the user agent having data from the current frame, but not the next frame, when the current playback position is at the end of the current frame; and to when playback has ended.

		// HAVE_FUTURE_DATA (numeric value 3)
		// Data for the immediate current playback position is available, as well as enough data for the user agent to advance the current playback position in the direction of playback at least a little without immediately reverting to the HAVE_METADATA state, and the text tracks are ready. For example, in video this corresponds to the user agent having data for at least the current frame and the next frame when the current playback position is at the instant in time between the two frames, or to the user agent having the video data for the current frame and audio data to keep playing at least a little when the current playback position is in the middle of a frame. The user agent cannot be in this state if playback has ended, as the current playback position can never advance in this case.

		// HAVE_ENOUGH_DATA (numeric value 4)



		// NETWORK_EMPTY (numeric value 0)
		// The element has not yet been initialized. All attributes are in their initial states.
		// NETWORK_IDLE (numeric value 1)
		// The element's resource selection algorithm is active and has selected a resource, but it is not actually using the network at this time.
		// NETWORK_LOADING (numeric value 2)
		// The user agent is actively trying to download data.
		// NETWORK_NO_SOURCE (numeric value 3)


		getPlayState: function() {
			var netState = -1;
			if (this.plugin) {
				console.debug(this.plugin);
				netState = this.plugin.networkState;
			}
			console.error('getPlayState', netState);
			return netState;
		},


		isPaused: function() {

			var isPaused = true;

			if (this.plugin) {

				try {

					isPaused = this.plugin.paused;

				} catch (e) {
					console.error('ComponentVideo cannot detect if paused');
					console.error(e);
				}
			}

			console.error('isPaused', isPaused);
			return isPaused;

		},



		isPlayable: function() {
			var isPlayable = false;

			if (this.plugin) {
				console.debug('this.plugin.readyState', this.plugin.readyState);
				isPlayable = (this.plugin.readyState === 4);
			}
			console.error('isPlayable', isPlayable);
			return isPlayable;
		},



		play: function() {

			if (!this.plugin) {

			}

			if (this.plugin) {
				console.error('play');
				this.plugin.play();
			}
		},


		stop: function() {


			try {

				console.error('stop');

				this.plugin.pause();
				this.resetPlayback();

			} catch (e) {
				console.error('ComponentVideo errors resetting Video Instance');
				console.error(e);
			}
		},



		resetPlayback: function() {
			var isResetted = false;


			if (this.plugin) {

				this.plugin.currentTime = 0;
				console.error('this.plugin.currentTime', this.plugin.currentTime);
				isResetted = (this.plugin.currentTime === 0);

				console.error('this.plugin.currentTime', this.plugin.currentTime);

			}

			/*
			// this part is not working

			if (!isResetted) {
				console.error('reinstance videojs');
				var self = this;
				//instance the videojs object
				// when ready add interactivity

				if (this.plugin) {
					this.plugin.dispose();
					this.plugin = null;
				}


				this.$el.find('#' + this.options.id).empty().remove();
				delete this.$el.find('#' + this.options.id);

				var $newVideo = $(this.originalVideo);

				$($newVideo).appendTo(this.$el.find('.videoWrapper'));
				console.debug(this.$el.html());



			}*/

		},



		dispose: function() {

			if (!this.initialized) {
				console.warn(this.elementId + ' ComponentVideo not initialized no dispose');
				return;
			}



			console.info(this.options.id + ' ComponentVideo dispose');

			if (this.plugin) {

				this.disposeSound();

				this.stop();

				this.plugin.controlBar.hide();

			}

			this.$el.off();


			this.posterObj.remove();
			delete this.posterObj;

			// rimuoviamo
			delete this.$el;
			delete this.$plugin;
			delete this.plugin;

		}



	});


	return Component;

});