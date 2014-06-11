define(['jquery', 'mixins.preloader', 'mixins.sound','mixins.genericcomponent', 'html5.video'], function($, MixinPreloader, MixinSound, MixinGenericComponent, HTML5VideoPlayer) {

	var console = window.muteConsole;



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
	$.extend(ComponentVideo.prototype, MixinGenericComponent);

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
					console.warn("this video is out of viewport will be disposed and marked for garbage collector");
					this.dispose();
					this.readyForGrabageCollection = true;
				}
			}
		},


		isMobileBrowser: function() {
			return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
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



			this.video = this.options.id; //this.$el.find('.video-js').get(0);

			// if the video has no id return 
			if (!this.options.id) {
				console.error(this.elementId + ' ComponentVideo MISSING ID!!!!!');
			}


			//if (!this.hasVideoFeatures()) {
			//	console.warn(this.elementId + ' Browser do not support video');
			//	return;
			//}


			console.debug(this.elementId + ' ComponentVideo initialize');

			this.initialized = true;



			// if interactive set autoplay at false

			if (this.options.interactive) {
				this.options.autoplay = false;
			}


			// force videoOver at false in mobile browsers
			if (this.isMobileBrowser()) {
				this.options.videoOver = false;
			}




			var videoOptions = {
				preload: true,
				className: 'responsive',
				poster: this.options.poster
			};


			var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

			this.objWrapper = this.$el.find(".videoWrapper");

			// gestiam il caso dei 4/3
			if(this.objWrapper.length === 0){
				this.objWrapper = this.$el.find(".videoWrapper4-3");
			}

			// remove the video
			this.plugin = document.getElementById(this.options.id);

			if (this.plugin) {
				console.error(this.plugin);
				$(this.plugin).remove();
				delete this.plugin;
			}


			var source = this.options.video;

			this.videoPlayerObject = new HTML5VideoPlayer(this.options.id, this.objWrapper, videoOptions);
			this.videoPlayerObject.setSource(source);
			this.videoPlayerObject.applySource();

			if(this.isMobileBrowser()){
				this.hidePoster();
			}else{
				this.showPoster();
			}
			

			this.initLoadCheck();

		},


		initVideoOver: function() {

			if (this.options.videoOver) {
				this.videoOverObj = $(this.videoPlayerObject.getDom());
				this.videoOverObj.addClass('videomodal');
			}
		},


		disposeVideoOver: function() {
			if (this.videoOverObj) {
				this.videoOverObj.removeClass('videomodal');
				delete this.videoOverObj;
			}
		},


		initLoadCheck: function() {
			console.debug(this.elementId + " initLoadCheck");
			this.videoloadInterval = setInterval($.proxy(this.checkVideoIsReadyToPlay, this), 1000);
		},


		checkVideoIsReadyToPlay: function() {
			console.debug(this.elementId + " checkVideoIsReadyToPlay");
			if (this.videoPlayerObject && this.videoPlayerObject.isPlayable()) {
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
			if (this.options.videoOver) {
				return;
			}
			this.objWrapper.find('img').hideVisible();
		},

		// video click interactivity
		checkInteract: function() {
			console.info(this.elementId + " checkInteract assign events");
			if (this.options.interactive) {
				this.$el.on("click", $.proxy(this.toggleVideoPlayback, this));
				this.$el.addClass('interactive');
			} else {
				this.videoPlayerObject.play();

			}

		},

		// toggle the video playstate
		toggleVideoPlayback: function() {

			console.info(this.elementId + " toggle clip");

			if (!this.videoPlayerObject || this.videoPlayerObject && !this.videoPlayerObject.isPlayable()) {
				console.error(this.elementId + " ComponentVideo clicking a video not inited");
				return;
			}

			console.debug(this.elementId + " ComponentVideo toggleVideoPlayback","isPaused", this.videoPlayerObject.isPaused());

			if (!this.videoPlayerObject.isPaused()) {

				this.videoPlayerObject.stop();
				this.showPoster();
			} else {
				this.videoPlayerObject.play();
				this.hidePoster();
				this.initVideoOver();
			}

		},





		dispose: function() {


			if (!this.initialized) {
				console.warn(this.elementId + ' ComponentVideo not initialized no dispose');
				return;
			}

			console.error(this.elementId + ' ComponentVideo dispose', this.$el.height());


			if (this.videoPlayerObject) {
				this.videoPlayerObject.dispose();
				this.videoPlayerObject = null;
				delete this.videoPlayerObject;
			}

			this.disposeLoadCheck();

			this.disposeVideoOver();

			this.disposeEventsSafe();

			this.initialized = false;


			console.debug(this.elementId + ' actual size', this.$el.height());

			// rimuoviamo

			delete this.objWrapper;
			delete this.$plugin;
			delete this.plugin;

		}



	});


	return ComponentVideo;

});