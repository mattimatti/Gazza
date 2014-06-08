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

	//extend prototype

	$.extend(Component.prototype, {

		initialize: function() {


			if(this.initialized){
				console.warn(this.elementId + ' Component already initialized exit');
				return;
			}
			this.initialized = true;


			console.info(this.elementId + ': 360 initialize');


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


			console.debug('instance reel with options', this.options);

			// setup the plugin
			this.plugin.reel(this.options);
		},



		dispose: function() {
			if(!this.initialized){
				console.warn(this.elementId + ' Component not initialized no dispose');
				return;
			}
			console.info(this.elementId + ': 360 dispose');

			if (this.plugin) {
				this.plugin.unreel();
			}

		}



	});

	return Component;

});