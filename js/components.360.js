define(['jquery', 'mixins.preloader', 'components.sound', 'reel'], function($, MixinPreloader, ComponentSound) {


	var Component = function(element, options) {

		this.$el = $(element);

		// Default options for the reel plugin
		this.defaults = {
			images: null,
			cursor: 'default', // define the cursor
			draggable: false
		};

		// merge default options with
		this.options = $.extend(this.defaults, options);

	};

	// MIXIN

	$.extend(Component.prototype, MixinPreloader);

	//extend prototype

	$.extend(Component.prototype, {

		initialize: function() {


			if (this.options.interactive) {
				this.options.cursor = 'pointer';
				this.options.draggable = true;
			}

			this.plugin = this.$el.find('.component');

			// override the size. plugin needs them explicitly
			this.plugin.attr("width", this.plugin.width());
			this.plugin.attr("height", this.plugin.height());


			console.debug('instance reel with options', this.options);
			
			// setup the plugin
			this.plugin.reel(this.options);
		},



		dispose: function() {

			if (this.plugin) {
				this.plugin.unreel();
			}

			delete this.plugin;
			delete this.$el;
			delete this.options;

		}



	});

	return Component;

});