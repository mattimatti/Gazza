define(['jquery', 'mixins.preloader', 'mixins.sound', 'cloudzoom'], function($, MixinPreloader, MixinSound) {

	var console = window.console;

	if(window.REMOVECONSOLE){
		console = window.muteConsole;
	}	

	var ComponentPan = function(element, options) {

		this.$el = $(element);

		this.elementId = this.$el.attr('id');

		// Default options for the plugin
		this.defaults = {
			minScale: 0,
			hqSrc: null,
			maxZoom: 2
		};

		// merge default options with
		this.options = $.extend(this.defaults, options);
		console.debug(this.elementId + ' ComponentPan at constructor options', this.options);

	};

	// MIXIN

	$.extend(ComponentPan.prototype, MixinPreloader);
	$.extend(ComponentPan.prototype, MixinSound);

	//extend prototype	

	$.extend(ComponentPan.prototype, {

		// initial state
		zoomIn: false,

		originalImage: null,

		hqImage: null,

		initialize: function() {


			if (this.initialized) {
				console.warn(this.elementId + ' ComponentPan already initialized exit');
				return;
			}
			this.initialized = true;

			this.plugin = this.$el.find('.component');

			if (!this.plugin) {
				console.warn(this.elementId + ' ComponentPan non esiste .component');
				return;
			}


			console.info(this.elementId + ' ComponentPan initialize');


			this.originalimage = this.plugin.attr("src");
			console.debug(this.elementId + ' ComponentPan originalimage', this.originalimage);


			if (this.options.hqSrc) {
				console.debug(this.elementId + ' ComponentPan has a different HQ source', this.options.hqSrc);
				this.hqImage = this.options.hqSrc;
			} else {
				this.hqImage = this.originalimage;
			}

			this.enableInteraction();

			/*
				2.1 rev 1301161410

				animationTime: 500
				captionPosition: "top"
				captionSource: "title"
				captionType: "attr"
				easeTime: 500
				errorCallback: function (e){}
				galleryEvent: "click"
				image: ""
				imageEvent: "click"
				innerZoom: false
				lensAutoCircle: false
				lensClass: "cloudzoom-lens"
				lensProportions: "CSS"
				sizePriority: "lens"
				tintColor: "#fff"
				tintOpacity: 0.5
				uriEscapeMethod: false
				zoomClass: "cloudzoom-zoom"
				zoomFlyOut: true
				zoomFullSize: false
				zoomImage: ""
				zoomInsideClass: "cloudzoom-zoom-inside"
				zoomMatchSize: false
				zoomOffsetX: 15
				zoomOffsetY: 0
				zoomPosition: 3
				zoomSizeMode: "lens"

				zoomSizeMode:

				"lens" - CSS of lens (.cloudzoom-lens) has priority, zoom window will be adjusted
				"zoom" - CSS of zoom window (.cloudzoom-zoom) has priority, lens will be adjusted
				"full" - Zoom window will maximise to full size of zoom image
				"image" - Zoom window will match small image

			*/


		},


		enableInteraction: function() {
			console.debug(this.elementId + ' ComponentPan enableInteraction');
			this.$el.off();
			this.$el.on('click', $.proxy(this.toggleZoom, this));
		},


		clickComponent: function(e) {
			console.debug(this.elementId + ' ComponentPan clickComponent', e);
			this.playSound();
			this.toggleZoom();
		},


		// Toggle the zoom in the pan viewer
		toggleZoom: function() {
			console.debug(this.elementId + ' ComponentPan toggleZoom this.zoomIn', this.zoomIn);
			if (!this.zoomIn) {
				this.zoomIn = true;

				var opts = {
					zoomPosition: 'inside',
					zoomSizeMode: 'image'
				};

				console.debug(this.elementId + ' ComponentPan Instance plugin plugin with options', opts);

				this.panObject = new window.CloudZoom(this.plugin, opts);
				console.debug(window.CloudZoom.prototype);
				this.panObject.loadImage(encodeURI(this.originalimage), encodeURI(this.hqImage));


			} else {
				this.zoomIn = false;

				this.panObject.destroy();
			}
		},

		dispose: function() {

			if (!this.initialized) {
				console.warn(this.elementId + ' Component not initialized no dispose');
				return;
			}

			this.disposeSound();

			console.info(this.elementId + ' ComponentPan dispose');

			if (this.panObject) {

				this.zoomIn = false;

				this.panObject.destroy();

				// remove click
				this.$el.off();

				this.plugin = null;
				this.panObject = null;
				delete this.plugin;
				delete this.panObject;
			}

			delete this.$el;
		}



	});

	return ComponentPan;

});