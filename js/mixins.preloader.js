define(['jquery'], function($){

	var MixinPreloader = {


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

			if(this.$el.find('img').length === 0){
				this.initialize();
				return;
			}

			// for each element
			this.$el.find('img').each($.proxy(this.eachImage, this));

			// var firstImageElement= this.$el.find('img').first();

			/*
			if(!this.preloadElement(firstImageElement)){
				this.initialize();
				return;
			}
			*/


		},


		// iterate all elements
		eachImage: function(index, element) {
			var item = $(element);
			if (item.attr("data-src") && item.attr("data-src") !== '') {
				this.preloadElement(item);
			}
		},


		preloadElement: function(item) {

			var self = this;

			var theXHR;

			if (item.attr("data-src")) {
				console.warn('preloadElement', item);
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
				return true;
			}

			return false;

		},

		// once one element is loaded
		loadedElement: function(item) {
			console.warn("loadedElement");

			if(item.attr("data-src")){
				item.attr("src", item.attr("data-src"));
				item.attr("data-src", null);
			}


			// ONCE THE FIRST ELEMENT IS LOADED cal linitialize
			this.initialize();
		},


		preloadAbort: function() {
			//console.warn("preloadAbort BEFORE", this.preloadAjaxPool.length);
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


	return MixinPreloader;

});