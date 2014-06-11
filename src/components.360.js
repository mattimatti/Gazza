define(['jquery', 'mixins.preloader', 'mixins.sound', 'mixins.genericcomponent', 'reel'], function($, MixinPreloader, MixinSound, MixinGenericComponent) {

	var console = window.console;

	if (window.REMOVECONSOLE) {
		console = window.muteConsole;
	}

	var Component360 = function(element, options) {

		this.$el = $(element);

		this.elementId = this.$el.attr('id');

		// Default options for the reel plugin
		this.defaults = {
			images: null,
			cursor: 'default', // define the cursor
			draggable: false,
			interactive: false
		};

		// merge default options with
		this.options = $.extend(this.defaults, options);

	};

	// MIXIN

	$.extend(Component360.prototype, MixinPreloader);
	$.extend(Component360.prototype, MixinSound);
	$.extend(Component360.prototype, MixinGenericComponent);

	//extend prototype

	$.extend(Component360.prototype, {

		initialize: function() {


			if (this.initialized) {
				console.warn(this.elementId + ' Component360 already initialized exit');
				return;
			}

			this.initialized = true;


			console.info(this.elementId + ': Component360 initialize');


			this.plugin = this.$el.find('.component');

			// override the size. plugin needs them explicitly
			this.plugin.attr("width", this.plugin.width());
			this.plugin.attr("height", this.plugin.height());


			//  HACK
			// Nel caso di mobile i 360 sono automatici
			//
			if (this.isMobileBrowser()) {
				this.options.interactive = false;
				this.options.speed = 0.5;
				this.options.draggable = false;
				this.options.cursor = 'default';
				this.hideBlinker();
				console.warn(this.elementId + ' NO INTERACTIVITY IN MOBILE');
			}


			// if interactive setup custom properties
			if (this.options.interactive) {
				this.options.cursor = 'pointer';
				this.options.draggable = true;
			}

			// remove custom option interactivity
			delete this.options.interactive;


			// setup the plugin

			console.debug(this.elementId + ': Component360 instance reel with options', this.options);
			
			this.plugin.reel(this.options);


			// if we have a sound add interactivity
			if (this.options.sound) {
				this.enableInteractivity();
			}


			// if we have sound controls
			if (this.options.soundControls) {
				this.initSound();
			}


		},


		enableInteractivity: function() {

			console.debug(this.elementId + ': Component360 enableInteractivity');

			this.disposeEventsSafe();

			this.plugin.hammer();

			// assign click event
			this.plugin.hammer().on('tap', $.proxy(this.clickComponent, this));
			this.plugin.addClass('interactive');

		},

		// the user click
		clickComponent: function(event) {
			console.debug('clickComponent');

			if (this.options.soundControls) {
				// prevent overlapping commands
				try {
					if ($(event.target).hasClass("playSound")) {
						return;
					}
				} catch (soundex) {}
			}

			this.initSound();
			this.playSound();
		},



		dispose: function() {
			if (!this.initialized) {
				console.warn(this.elementId + ': Component360 not initialized no dispose');
				return;
			}
			console.info(this.elementId + ': Component360 dispose');


			this.disposeSound();
			this.disposeEventsSafe();


			if (this.plugin) {
				this.plugin.unreel();
				this.plugin.off();

				delete this.plugin;
			}



		}



	});

	return Component360;

});