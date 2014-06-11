define(['jquery'], function($) {

	var console = window.console;

	if(window.REMOVECONSOLE){
		console = window.muteConsole;
	}	

	var MixinPreloader = {

		// the ajaxPool
		preloadAjaxPool: [],

		// is the element preloading content?
		preloading: false,


		// Elements can be disposed internally 
		// this is the case of video that cannot stop normally on scroll

		readyForGrabageCollection: false,

		// how many elements to be preloaded
		preloadCount: 0,



		// Fire the preload
		preload: function() {

			if (!this.$el) {
				console.error('This component has no $el');
				return;
			}

			if (this.preloading) {
				console.warn('is already preloading no follow');
				return;
			}

			// store the number of items to preload
			this.preloadCount = this.$el.find("img[data-src]").length;

			console.debug('this.preloadCount', this.preloadCount);

			// if no images to preload
			if (this.preloadCount === 0) {
				this.initialize();
				return;
			}

			// iterate all elements and start each preload
			this.$el.find('img[data-src]').each($.proxy(this.invalidateForPreload, this));

		},


		// invalidate an element if meets requirements
		// the requirement is to have an attribute data-src


		invalidateForPreload: function(index, element) {

			var item = $(element);
			if (item.attr("data-src") && item.attr("data-src") !== '') {
				this.preloadElement(item);
			}
		},


		// start the preload of a single element

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

			if (item.attr("data-src")) {
				item.attr("src", item.attr("data-src"));
				item.attr("data-src", null);
			}

			this.preloadCount--;



			// ONCE THE FIRST ELEMENT IS LOADED cal linitialize
			if (this.preloadCount <= 0) {
				console.warn('all preloaded call initialize');
				this.preloading = false;

				this.$el.trigger("allpreloaded");

				if ($.isFunction(this.initialize)) {

					this.initialize();
				}
			}
		},

		// abort the preload of this component
		// every element in preloadAjaxPool
		preloadAbort: function() {
			console.warn("preloadAbort BEFORE", this.preloadAjaxPool.length);
			var self = this;
			$.each(this.preloadAjaxPool, function(i, xhr) {
				xhr.abort();
				self.preloadRemoveXhr(xhr);
			});
			console.error("preloadAbort AFTER", this.preloadAjaxPool.length);
		},

		// add the xhr to the preloadAjaxPool
		preloadAddXhr: function(xhr, item) {
			//console.debug('preloadAddXhr', xhr);
			this.preloadAjaxPool = $.grep(this.preloadAjaxPool, function(value) {
				return value !== xhr;
			});
		},

		// remove the 
		preloadRemoveXhr: function(xhr) {
			//console.debug('preloadRemoveXhr', xhr);
			this.preloadAjaxPool = $.grep(this.preloadAjaxPool, function(value) {
				return value !== xhr;
			});
		},

		// return the offset top pf the element
		getMyPos: function(xhr) {
			return this.$el.offset().top;
		},

		// return the height of the element
		getHeight: function(xhr) {
			return this.$el.height();
		},

		// safely dispose events
		disposeEventsSafe: function(){
			this.$el.off("click");
			this.$el.off("dblclick");
			this.$el.off("touch");
			this.$el.off("swipe");
			this.$el.off("swipeleft");
			this.$el.off("doubletap");
			this.$el.off("mouseover");
			this.$el.off("mouseout");

		}

	};


	return MixinPreloader;

});