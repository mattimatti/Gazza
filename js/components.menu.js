define(['jquery','mixins.preloader','mixins.sound'], function($,MixinPreloader,MixinSound){

	var console = window.muteConsole;

	var Component = function(element, options) {
		console.debug('constructor', arguments);
		this.options = options;
		this.$el = element;
	};

	// MIXIN

	$.extend(Component.prototype, MixinPreloader);
	$.extend(Component.prototype, MixinPreloader);

	//extend prototype	

	$.extend(Component.prototype, {



		initialize: function() {
			console.debug('initialize', arguments);
		},


		dispose: function() {
			console.debug('dispose');
		}



	});


	return Component;

});