define(['jquery'], function($){

	var console = window.muteConsole;

	var MixinPreloader = {


		preloadAjaxPool: [],


		preloading: false,


		preloadCount : 0,

		preload: function() {

			if (!this.$el) {
				console.error('This component has no el');
				return;
			}

			if (this.preloading ) {
				console.warn('is preloading no preload');
				return;
			}

			this.preloadCount = this.$el.find("img[data-src]").length;

			console.debug('this.preloadCount' , this.preloadCount);

			// if no images to preload
			if(this.preloadCount === 0){
				this.initialize();
				return;
			}

			// for each element
			this.$el.find('img[data-src]').each($.proxy(this.eachImage, this));

		},


		// iterate all elements
		eachImage: function(index, element) {

			var item = $(element);
			if (item.attr("data-src") && item.attr("data-src") !== '') {
				this.preloadElement(item);
			}
		},


		preloadElement: function(item) {

			this.preloading = true;

			var self = this;

			var theXHR;

			if (item.attr("data-src")) {
				
				console.warn('preloadElement', item.attr("data-src"));

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


			// if has data source apply as source and remove attribute from element

			if(item.attr("data-src")){
				item.attr("src", item.attr("data-src"));
				item.attr("data-src", null);
			}


			this.preloadCount --;

			// ONCE THE FIRST ELEMENT IS LOADED cal linitialize
			if(this.preloadCount <= 0){
				console.warn('all preloaded call initialize');
				this.preloading = false;

				if($.isFunction(this.initialize)){
					this.initialize();
				}
				
			}
			
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