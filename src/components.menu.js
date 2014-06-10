define(['jquery', 'mixins.preloader', 'mixins.sound'], function($, MixinPreloader, MixinSound) {

	var console = window.muteConsole;

	var Component = function(element, options) {
		console.error('constructor', arguments);
		this.options = options;
		// the jquery element
		this.$el = element;

		this.initialize();
	};

	// MIXIN

	$.extend(Component.prototype, MixinPreloader);
	$.extend(Component.prototype, MixinSound);

	//extend prototype	

	$.extend(Component.prototype, {

		initialize: function() {
			console.error('Menu initialize', arguments);

			this.cleanup();

			this.populate();

			this.initStickyNess();

		},


		cleanup: function() {
			this.$el.empty();
			this.$root = $("<ul/>");
			this.$el.append(this.$root);
		},


		populate: function() {
			console.debug('Menu populate');
			$(".anno").each($.proxy(this.createItem, this));
		},

		createItem: function(index, object) {
			console.debug('createItem', arguments);

			var itemId = $(object).attr("id");
			
			var label = $(object).attr("data-label");

			var item = $("<li>").attr("id", "menuitem-" + itemId);

			var linkitem = $("<a>").text(label).attr("href", "#" + itemId);
			item.append(linkitem);

			this.$root.append(item);

			this.$root.css("right", 0);
			this.$root.css("position", "absolute");
			this.$root.css("zIndex", 1200);
			this.$root.css("height", $(window).height());

		},


		initStickyNess: function() {

			this.menuOffsetTop = 0;

			$(window).scroll($.proxy(this.onWindowScroll, this));
			$(window).on('hashchange', $.proxy(this.onHashChange, this));

		},


		onWindowScroll: function() {

			var $windowTag = $(window);
			var scrollTop = $windowTag.scrollTop();

			if (this.menuOffsetTop < scrollTop) {
				this.$root.css('top', scrollTop);
			} else {
				this.$root.css('top', 0);
			}
		},



		onHashChange: function() {
			this.updateSelectedItemByHashTag();
		},



		updateSelectedItemByHashTag: function() {
			console.debug('updateSelectedItemByHashTag');
			var hashValue;
			if (window.location.hash !== '') {
				hashValue = window.location.hash.replace(/\//, '').substring(1);
				console.debug("updateSelectedItemByHashTag: we have n hash", hashValue);
			}

			this.selectById(hashValue);

		},



		selectById: function(id) {
			console.debug('selectById', id);
			this.unselectAll();

			var yearId = $("#" + id).parents(".anno").attr("id");
			console.error(yearId);


			this.$root.find("#menuitem-" + yearId).addClass("active");
		},


		unselectAll: function() {
			console.debug('unselectAll');
			this.$root.find("li").removeClass("active");
		},


		dispose: function() {
			console.debug('Menu dispose');
		}



	});


	return Component;

});