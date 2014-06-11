define(['jquery'], function($) {

	var console = window.console;

	if(window.REMOVECONSOLE){
		console = window.muteConsole;
	}	


	var HTML5Media = {


		isAudio: false,

		controlsVisible: false,

		// are we running in debug?
		____debugMode : false,


		_______playCount: 0,


		increasePlayCount : function(){
			this._______playCount ++;
		},

		encodeUrl: function(url) {
			return window.encodeURIComponent(url);
		},
		escapeHTML: function(s) {
			return s.toString().split('&').join('&amp;').split('<').join('&lt;').split('"').join('&quot;');
		},

		getDom: function(){
			return this.plugin;
		},


		absolutizePath: function(path){
			var el = document.createElement('div');
			el.innerHTML = '<a href="' + this.escapeHTML(path) + '">x</a>';
			return el.firstChild.href;
		},


		applySource: function(){
			console.error('applySource');
			this.createMarkup();
		},

		setSource : function(source){
			console.error('setSource', source);
			this._sourceWithoutExtension = source;
		},

		getInstanceId: function (){
			return "html5_media_" + this.elementId + "_" + this._______playCount;
		},

		isMobileBrowser: function() {
			return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
		},


		// check if the browser can play a video
		hasHTML5MediaFeature: function() {
			return false;
		},


		initialize: function() {


			if (!this.hasFeature()) {
				console.error("not supported");
				return;
			}

			// You have to set preload true once intilized otherwise in safari or firefox will not load the video
			this.plugin.preload = true;

			this.initLoadCheck();

		},


		initLoadCheck: function() {
			console.debug(this.elementId + " initLoadCheck");
			this.videoloadInterval = setInterval($.proxy(this._checkVideoIsReadyToPlay, this), 1000);
		},


		_checkVideoIsReadyToPlay: function() {

			if (this.isPlayable()) {
				this.disposeLoadCheck();
				this.play();
			}

		},

		disposeLoadCheck: function() {
			clearInterval(this.videoloadInterval);
		},


		// toggle the video playstate
		togglePlayback: function() {

			console.info(this.elementId + " togglePlayback");

			if (!this.plugin || !this.isPlayable()) {
				console.error(this.elementId + " ComponentVideo clicking a video not inited", this.isPlayable());
				return;
			}

			if (!this.isPaused()) {
				this.stop();
			} else {
				this.play();
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
			if (this.isMobileBrowser()) {
				return true;
			}

			var self = this;
			if (this.plugin) {
				console.debug('READYSTATE:', this.plugin.readyState);
				//if(this.isAudio){
					isPlayable = (this.plugin.readyState === 0 ||this.plugin.readyState >= 2);
				//}else{
				//	isPlayable = (this.plugin.readyState >= 2);
				//}
				
				if(this.hasHTML5MediaFeature()){
					if (!isPlayable) {
						this.plugin.addEventListener("canplaythrough", function() {
							return true;
						});
					}
				}

			}
			return isPlayable;
		},



		play: function() {
			this.applySource();
			if (this.plugin) {

				if(this.isPlayable()){
					console.debug('play');
					this.plugin.play();
				}else{
					console.debug('not playable');
				}
				
				
			}
		},


		stop: function() {

			try {

				//if (this.isPlayable()) {
					this.plugin.pause();
					this.resetPlayback();
				//}

			} catch (e) {
				console.error('Error stopping');
				console.error(e);
			}
		},



		resetPlayback: function() {
			var isResetted = false;

			if (this.plugin) {

				try {
					this.plugin.currentTime = 1;
					console.error('this.plugin.currentTime', this.plugin.currentTime);
					isResetted = (this.plugin.currentTime === 1);
					console.error('this.plugin.currentTime', this.plugin.currentTime);

				} catch (ex) {}

			}

		},


		_log: function() {
			console.error(arguments);
		},


		dispose: function() {
			console.debug('dispose');
			if (this.plugin) {
				this.stop();
			}
			this.removeMarkup();

			if(this.$el){
				if($.isFunction(this.$el.off)){
					this.$el.off();
				}
				delete this.$el;
			}


		}



	};



	return HTML5Media;

});