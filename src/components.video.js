define(['jquery', 'mixins.preloader', 'mixins.sound', 'mediaelement'], function($, MixinPreloader, MixinSound) {

	var console = window.console;



	$.fn.showVisible = function() {
		this.css('visibility', 'visible');
	};

	$.fn.hideVisible = function() {
		this.css('visibility', 'hidden');
	};


	$.fn.isOnScreen = function() {

		var win = $(window);

		var viewport = {
			top: win.scrollTop(),
			left: win.scrollLeft()
		};
		viewport.right = viewport.left + win.width();
		viewport.bottom = viewport.top + win.height();

		var bounds = this.offset();
		bounds.right = bounds.left + this.outerWidth();
		bounds.bottom = bounds.top + this.outerHeight();

		return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

	};

	var ComponentVideo = function(element, options) {

		this.$el = $(element);

		this.elementId = this.$el.attr('id');

		// Default options for the plugin
		this.defaults = {
			autoplay: true,
			interactive: false,
			controls: false,
			videoOver: false,
			preload: 'none',
			sound: null,
			techOrder: ["html5", "flash"]
		};

		// merge default options with
		this.options = $.extend(this.defaults, options);
	};

	// MIXIN

	$.extend(ComponentVideo.prototype, MixinPreloader);
	$.extend(ComponentVideo.prototype, MixinSound);

	//extend prototype

	$.extend(ComponentVideo.prototype, {



		garbageCollectMe: function() {
			console.debug("check garbage");

			if (this.$el) {
				this.disposeIfOffScreen();
			}

		},


		disposeIfOffScreen: function() {
			if (this.$el) {
				if (!this.$el.isOnScreen()) {
					console.error("GARBAGE COLLECT");
					this.dispose();
					this.readyForGrabageCollection = true;
				}
			}
		},


		isMobileBrowser: function(){
			return ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) ;
		},


		// check if the browser can play a video
		hasVideoFeatures: function() {
			return !!document.createElement('video').canPlayType;
		},


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

			console.debug(this.options.id + ' ComponentVideo initialize');


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


			if (!this.hasVideoFeatures()) {
				return;
			}


			var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);


			this.plugin = document.getElementById(this.options.id);

			// 
			if(this.options.videoOver){
				$(this.plugin).addClass('videomodal');
			}

			this.objWrapper = $(".videoWrapper");

			this.showPoster();

			// You have to set preload true once intilized otherwise in safari or firefox will not load the video
			this.plugin.preload = true;

			this.initLoadCheck();

		},


		initLoadCheck: function() {
			console.debug(this.elementId + " initLoadCheck");
			this.videoloadInterval = setInterval($.proxy(this.checkVideoIsReadyToPlay, this), 200);
		},


		checkVideoIsReadyToPlay: function() {
			
			
			this.disposeIfOffScreen();
			console.debug(this.elementId + ' checkVideoIsReadyToPlay');

			if (this.isPlayable()) {
				this.disposeLoadCheck();
				this.checkInteract();
			}

		},

		disposeLoadCheck: function() {
			console.debug(this.elementId + " disposeLoadCheck");
			clearInterval(this.videoloadInterval);
		},


		showPoster: function() {
			console.debug(this.elementId + " showPoster");
			this.objWrapper.find('img').showVisible();
		},

		hidePoster: function() {
			console.debug(this.elementId + " hidePoster");
			this.objWrapper.find('img').hideVisible();
		},

		// video click interactivity
		checkInteract: function() {

			this.$el.off();
			if (this.options.interactive) {
				this.$el.on("click", $.proxy(this.toggleVideoPlayback, this));
				this.$el.addClass('interactive');
			} else {
				this.play();

			}

		},

		// toggle the video playstate
		toggleVideoPlayback: function() {



			console.info(this.elementId + " toggle clip");

			if (!this.plugin || !this.isPlayable()) {
				console.error(this.elementId + " ComponentVideo clicking a video not inited", this.isPlayable());
				return;
			}

			//this.objWrapper.css("width", this.$el.width());
			//this.$el.css("height", this.objWrapper.height());

			console.debug(this.elementId + " ComponentVideo toggleVideoPlayback");

			if (!this.isPaused()) {
				this.stop();
				this.showPoster();
			} else {
				this.play();
				this.hidePoster();
			}

		},



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


		// HAVE_NOTHING (numeric value 0)
		// No information regarding the media resource is available. No data for the current playback position is available. Media elements whose networkState attribute are set to NETWORK_EMPTY are always in the HAVE_NOTHING state.

		// HAVE_METADATA (numeric value 1)
		// Enough of the resource has been obtained that the duration of the resource is available. In the case of a video element, the dimensions of the video are also available. The API will no longer throw an exception when seeking. No media data is available for the immediate current playback position.

		// HAVE_CURRENT_DATA (numeric value 2)
		// Data for the immediate current playback position is available, but either not enough data is available that the user agent could successfully advance the current playback position in the direction of playback at all without immediately reverting to the HAVE_METADATA state, or there is no more data to obtain in the direction of playback. For example, in video this corresponds to the user agent having data from the current frame, but not the next frame, when the current playback position is at the end of the current frame; and to when playback has ended.

		// HAVE_FUTURE_DATA (numeric value 3)
		// Data for the immediate current playback position is available, as well as enough data for the user agent to advance the current playback position in the direction of playback at least a little without immediately reverting to the HAVE_METADATA state, and the text tracks are ready. For example, in video this corresponds to the user agent having data for at least the current frame and the next frame when the current playback position is at the instant in time between the two frames, or to the user agent having the video data for the current frame and audio data to keep playing at least a little when the current playback position is in the middle of a frame. The user agent cannot be in this state if playback has ended, as the current playback position can never advance in this case.

		// HAVE_ENOUGH_DATA (numeric value 4)

		isPlayable: function() {
			var isPlayable = false;

			// mobile browsers have always readystate at zero.
			if(this.isMobileBrowser()){
				return true;
			}

			var self = this;
			if (this.plugin) {
				console.debug('READYSTATE:', this.plugin.readyState);
				isPlayable = (this.plugin.readyState >= 2);
				if (!isPlayable) {
					this.plugin.addEventListener("canplaythrough", function() {
						return true;
					});
				}
			}
			return isPlayable;
		},



		play: function() {

			if (!this.plugin) {

			}

			if (this.plugin) {
				console.debug(this.elementId + ' play Video');
				this.plugin.play();

				// setup garbage collector
				this.garbageInterval = setInterval($.proxy(this.garbageCollectMe, this), 1000);
			}
		},


		stop: function() {

			
			try {

				if(this.isPlayable()){

					console.debug(this.elementId + ' stop Video');

					this.plugin.pause();
					this.resetPlayback();
				}

				clearInterval(this.garbageInterval);

			} catch (e) {
				console.error('ComponentVideo errors resetting Video Instance');
				console.error(e);
			}
		},



		resetPlayback: function() {
			var isResetted = false;


			if (this.plugin) {

				try{
					this.plugin.currentTime = 1;
					console.error('this.plugin.currentTime', this.plugin.currentTime);
					isResetted = (this.plugin.currentTime === 1);
					console.error('this.plugin.currentTime', this.plugin.currentTime);

				}catch(ex){

				}
				
				this.showPoster();

			}

		},



		dispose: function() {

			console.info(this.options.id + ' ComponentVideo dispose');

			if (!this.initialized) {
				console.warn(this.elementId + ' ComponentVideo not initialized no dispose');
				return;
			}



			console.info(this.options.id + ' ComponentVideo dispose');

			if (this.plugin) {
				this.disposeSound();
				this.stop();
			}

			clearInterval(this.garbageInterval);

			this.$el.off();

			this.initialized = false;

			// rimuoviamo
			delete this.$el;
			delete this.objWrapper;
			delete this.$plugin;
			delete this.plugin;

		}



	});


	return ComponentVideo;

});