define(['jquery', 'mixins.preloader', 'mixins.sound', 'reel'], function($, MixinPreloader, MixinSound) {

	var console = window.muteConsole;

	var Component = function(element, options) {

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

	$.extend(Component.prototype, MixinPreloader);
	$.extend(Component.prototype, MixinSound);

	//extend prototype

	$.extend(Component.prototype, {

		initialize: function() {


			if(this.initialized){
				console.warn(this.elementId + ' Component360 already initialized exit');
				return;
			}
			this.initialized = true;


			console.info(this.elementId + ': Component360 initialize');


			if (this.options.interactive) {
				this.options.cursor = 'pointer';
				this.options.draggable = true;
			}

			// remove custom option
			delete this.options.interactive;

			this.plugin = this.$el.find('.component');

			// override the size. plugin needs them explicitly
			this.plugin.attr("width", this.plugin.width());
			this.plugin.attr("height", this.plugin.height());


			console.debug(this.elementId + ': Component360 instance reel with options', this.options);

			// setup the plugin
			this.plugin.reel(this.options);


			if(this.options.sound){
				
				// assign click event
				this.plugin.hammer().on('tap', $.proxy(this.clickComponent, this));
				this.plugin.addClass('interactive');
			}



		},


		// the user click
		clickComponent: function() {
			console.debug('clickComponent');
			this.initSound();
			this.playSound();
		},



		dispose: function() {
			if(!this.initialized){
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

	return Component;

});