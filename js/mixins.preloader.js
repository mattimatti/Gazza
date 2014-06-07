(function() {


	var MixinPreloader = {

		preloaded: false,

		preloadAjaxPool: [],

		preload: function() {

			if (!this.$el) {
				console.error('This component has no el');
				return;
			}

			if (this.preloaded) {
				this.initialize();
				return;
			}

			// for each element
			this.$el.find('img').each($.proxy(this.eachImage, this));

			// only the first image
			//this.preloadElement(this.$el.find('img').first());

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
			console.debug('preloadElement', item);


			var self = this;

			//console.debug('load Ajax', item.attr("data-src"));

			var theXHR;

			if (item.attr("data-src")) {

				$.ajax({
					url: item.attr("data-src"),
					beforeSend: function(xhr) {
						theXHR = xhr;
						self.preloadAddXhr(xhr);
					},
					error: function(xhr, textStatus, errorThrown) {
						self.preloadRemoveXhr(xhr);
					},
					success: function(data, textStatus) {
						self.preloadRemoveXhr(theXHR);
						self.loadedElement(item);
					}
				});
			}



		},

		// once one element is loaded
		loadedElement: function(item) {
			console.error("loadedElement", item.attr("data-src"));
			item.attr("src", item.attr("data-src"));
			item.attr("data-src", null);
		},


		preloadAbort: function() {
			//console.error("preloadAbort BEFORE", this.preloadAjaxPool.length);
			var self = this;
			$.each(this.preloadAjaxPool, function(i, xhr) {
				xhr.abort();
				self.preloadRemoveXhr(xhr);
			});
			//console.error("preloadAbort AFTER", this.preloadAjaxPool.length);
		},


		preloadAddXhr: function(xhr, item) {
			//console.debug('preloadAddXhr', xhr);
			this.preloadAjaxPool = $.grep(this.preloadAjaxPool, function(value) {
				return value != xhr;
			});
		},

		preloadRemoveXhr: function(xhr) {
			//console.debug('preloadRemoveXhr', xhr);
			this.preloadAjaxPool = $.grep(this.preloadAjaxPool, function(value) {
				return value != xhr;
			});
		}

	};


	window.MixinPreloader = MixinPreloader;

}());