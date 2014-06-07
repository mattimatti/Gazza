define(['jquery','mixins.preloader','mixins.sound'], function($,MixinPreloader,MixinSound){
	

	var Component = function(element, options) {
		this.options = options;
		this.$el = $(element);
		this.elementId = this.$el.attr('id');
	};

	// MIXIN
	
	$.extend(Component.prototype, MixinPreloader);
	$.extend(Component.prototype, MixinSound);

	//extend prototype

	$.extend(Component.prototype, {



		initialize: function() {
			
			console.info(this.elementId + ' ComponentEasy initialize');
		},


		dispose: function() {
			console.info(this.elementId + ' ComponentEasy dispose');
			delete this.$el;
			delete this.options;
		}



	});

	return Component;

});