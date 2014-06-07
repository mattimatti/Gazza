(function() {


	var MixinPreloader = {

		preloaded: false,

		preload: function() {
			//

			if (!this.$el) {
				console.error('This component has no el');
				return;
			}

			if (this.preloaded) {
				this.initialize();
				return;
			}

			// for each element
			this.$el.find('*').each($.proxy(this.eachImage, this));

			this.preloaded = true;


		},


		// iterate all elements
		eachImage: function(index, element) {
			var item = $(element);
			if (item.attr("data-src") && item.attr("data-src") !== '') {
				this.preloadElement(item);
			}
		},


		preloadElement: function(item) {
			console.error('preloadElement', item);

			item.attr("src", item.attr("data-src"));

			var enableCallbacks = true;
			var timeout = null;
			var self = this;

			console.error('load Ajax', item.attr("data-src"));

			// $.ajax({
			// 	url:item.attr("data-src"),
			// 	beforeSend: function(xhr) {
			// 		timeout = setTimeout(function() {
			// 			xhr.abort();
			// 			enableCallbacks = false;
			// 			// Handle the timeout

			// 		}, 5000);
			// 	},
			// 	error: function(xhr, textStatus, errorThrown) {
			// 		clearTimeout(timeout);
			// 		if (!enableCallbacks) {
			// 			return;
			// 		}
			// 	},
			// 	success: function(data, textStatus) {
			// 		clearTimeout(timeout);
			// 		if (!enableCallbacks) {
			// 			return;
			// 		}

			// 	}
			// });

		},

		// once one element is loaded
		loadedElement: function(){
			console.error('loadedElement', arguments);
		},


		stopPreload: function() {
			console.error('stopPreload', arguments);

		}


	};


	window.MixinPreloader = MixinPreloader;

}());