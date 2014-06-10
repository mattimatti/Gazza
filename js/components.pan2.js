define(['jquery', 'mixins.preloader', 'mixins.sound', 'hammer', 'elevatezoom'], function($, MixinPreloader, MixinSound) {

	var console = window.console;

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
				this.hqImage = this.originalimage + '?rnd=' + Math.random();
			}

			//the plugin requires this kind of metadata
			this.plugin.data('zoom-image', this.hqImage);

			this.enableInteraction();

			/*
			var opts = {
				zoomType: "inner",
				zoomWindowFadeIn: 500,
				zoomWindowFadeOut: 750,
				constrainType: "height",
				zoomLevel: 10
			};
			*/

			var opts = {
				zoomType: "inner",
				cursor: "crosshair"
			};

			console.debug(this.elementId + ' ComponentPan Instance plugin  elevateZoom with options', opts);


			this.plugin.elevateZoom(opts);

		},


		enableInteraction: function() {
			console.debug(this.elementId + ' ComponentPan enableInteraction');
		},


		clickComponent: function(e) {
			console.debug(this.elementId + ' ComponentPan clickComponent', e);
			this.playSound();
			this.toggleZoom();
		},


		swapSource: function(newSource) {
			this.plugin.attr("src", newSource);
		},

		// Toggle the zoom in the pan viewer
		toggleZoom: function() {
			console.debug(this.elementId + ' ComponentPan toggleZoom this.zoomIn', this.zoomIn);
			if (!this.zoomIn) {
				this.zoomIn = true;
			} else {
				this.zoomIn = false;
			}

		},

		dispose: function() {

			if (!this.initialized) {
				console.warn(this.elementId + ' Component not initialized no dispose');
				return;
			}

			this.disposeSound();

			console.info(this.elementId + ' ComponentPan dispose');

			if (this.plugin) {

				this.zoomIn = false;

				// remove click
				this.$el.off();

				this.plugin = null;
				delete this.plugin;
			}

			delete this.$el;
		}



	});

	return ComponentPan;

});