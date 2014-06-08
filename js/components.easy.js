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
			this.initSound();

			if(this.options.sound){
				this.$el.on("click", $.proxy(this.playSound,this));
				this.$el.addClass("interactive");
			}
		},


		playSound: function(){
			console.debug(this.elementId + ' ComponentEasy playSound');
			this.sound.playSound('click');
		},


		dispose: function() {
			this.disposeSound();
			this.$el.off();
			console.info(this.elementId + ' ComponentEasy dispose');
			delete this.$el;
			delete this.options;
		}



	});

	return Component;

});