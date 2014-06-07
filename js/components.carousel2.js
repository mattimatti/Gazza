(function() {


	var Component = function(element, options) {

		this.$el = $(element);

		// Default options for the reel plugin
		this.defaults = {
			mode: 'fade',
			pager: false,
			controls:false,
			responsive:true,
			auto:true
		};

		// merge default options with
		this.options = $.extend(this.defaults, options);

	};

	// MIXIN
	
	$.extend(Component.prototype, window.MixinPreloader);

	//extend prototype

	$.extend(Component.prototype, {

		initialize: function() {


			if(this.options.interactive){
				this.options.auto = false;
				delete this.options.interactive;
			}

			delete this.options.sound;
			delete this.options.duration;

			console.debug('instance bxSlider with options', this.options);

			//console.debug(this.$el.find('.component'));
			///console.debug($('.component'));

			//this.plugin = $(this.$el.find('.component')).bxSlider(this.options);

			var parentId = this.$el.attr('id');

			 //this.plugin = $('.bxslider',this.$el).bxSlider(this.options);
			 this.plugin = $('.bxslider').bxSlider(this.options);
			//console.debug(this.plugin);

			

		},
		


		dispose: function() {

			if(this.plugin){
				//this.plugin.destroySlider();
			}
			
		}



	});

	window.ComponentCarousel = Component;

}());