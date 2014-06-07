(function() {


	var MixinPreloader = {

		preloaded: false,

		preload: function() {
			//

			if (!this.$el) {
				console.error('This component has no el');
				return;
			}

			if(this.preloaded){
				this.initialize();
				return;
			}

			this.$el.find('*').each(function(index, element) {
				var item = $(element);
				if(item.attr("data-src") && item.attr("data-src") !== ''){
					item.attr("src" , item.attr("data-src"));
				}
			});

			this.preloaded = true;


		}

	}


	window.MixinPreloader = MixinPreloader;

}());