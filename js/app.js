define([
	'jquery',
	'components.fade',
	'components.360',
	'components.video',
	'components.easy',
	'components.pan',
	'components.carousel',
	'components.menu',
	'inview'
], function($, ComponentFade, ComponentReel, ComponentVideo, ComponentEasy, ComponentPan, ComponentCarousel, ComponentMenu) {


	var console = window.console;


	var instancesPool = [];


	var Modules = {

		/*
		RIMOSSO DEFINITIVAMENTE
		'image-fade': {

			init: function(a, b) {
				if (!instancesPool[a.id]) {
					var obj = new ComponentFade(a, b);
					obj.preload();
					instancesPool[a.id] = obj;
				}
			},

			remove: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].dispose();
					instancesPool[a.id].preloadAbort();
					instancesPool[a.id] = null;
					delete instancesPool[a.id];
				}

			}

		},*/

		'image-360': {

			init: function(a, b) {
				if (!instancesPool[a.id]) {
					var obj = new ComponentReel(a, b);
					obj.preload();
					instancesPool[a.id] = obj;
				}
			},
			remove: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].dispose();
					instancesPool[a.id].preloadAbort();
					instancesPool[a.id] = null;
					delete instancesPool[a.id];
				}

			}
		},

		'video-clip': {

			init: function(a, b) {
				if (!instancesPool[a.id]) {
					var obj = new ComponentVideo(a, b);
					obj.preload();
					instancesPool[a.id] = obj;
				}
			},
			remove: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].dispose();
					instancesPool[a.id].preloadAbort();
					instancesPool[a.id] = null;
					delete instancesPool[a.id];
				}

			}
		},
		'image-easy': {

			init: function(a, b) {
				if (!instancesPool[a.id]) {
					var obj = new ComponentEasy(a, b);
					obj.preload();
					instancesPool[a.id] = obj;
				}

			},
			remove: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].dispose();
					instancesPool[a.id].preloadAbort();
					instancesPool[a.id] = null;
					delete instancesPool[a.id];
				}

			}

		},

		'image-pan': {

			init: function(a, b) {
				if (!instancesPool[a.id]) {
					var obj = new ComponentPan(a, b);
					obj.preload();
					instancesPool[a.id] = obj;
				}

			},
			remove: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].dispose();
					instancesPool[a.id].preloadAbort();
					instancesPool[a.id] = null;
					delete instancesPool[a.id];
				}

			}

		},


		'carousel': {

			init: function(a, b) {
				if (!instancesPool[a.id]) {
					var obj = new ComponentCarousel(a, b);
					obj.preload();
					instancesPool[a.id] = obj;
				}

			},
			remove: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].dispose();
					instancesPool[a.id].preloadAbort();
					instancesPool[a.id] = null;
					delete instancesPool[a.id];
				}

			}

		}

	};



	var App = {

		// Menu instance
		objMenu: null,


		hasHash: function() {
			return window.location.hash !== '';
		},

		setHash: function(hash) {
			window.location.hash = '/' + hash;
		},


		initElement: function(element) {

			var elm = Modules[element.getAttribute('obj-type')];
			var id = element.getAttribute('id');
			var cfg = (element.getAttribute('obj-config'));
			var json = {};
			try {
				json = $.parseJSON(cfg);
			} catch (e) {
				console.error("Error parsing json", cfg);
			}
			//console.debug("initElement", id, cfg, json);
			if (elm) {
				elm.init(element, json);
			}

		},

		removeElement: function(element) {
			var elm = Modules[element.getAttribute('obj-type')];
			var id = element.getAttribute('id');
			var cfg = (element.getAttribute('obj-config'));
			var json = {};
			try {
				json = $.parseJSON(cfg);
			} catch (e) {
				console.error("Error parsing json", cfg);
			}

			//console.debug("removeElement", id, json);
			if (elm) {
				elm.remove(element, json);
			}

		},

		onKeyFrame: function(element, name, direction) {

			var item = $(element);
			var itemId = item.attr("id");

			//if(item.hasClass("anno")){
			//	this.refreshScroller(item);
			//	return;
			//}

			//console.error(itemId, name, direction);

			if (direction === 'down') {
				switch (name) {
					case 'dataTopBottom':
						//console.info(itemId + " DESTROY");
						this.removeElement(element);
						//this.refreshScroller();
						break;
					case 'dataBottomTop':
						//console.info(itemId + " INIT");
						this.initElement(element);
						this.setHash(itemId);
						break;
				}
			} else {
				switch (name) {
					case 'dataTopBottom':
						//console.info(itemId + " INIT");
						this.initElement(element);

						this.setHash(itemId);
						break;
					case 'dataBottomTop':
						//console.info(itemId + " DESTROY");
						this.removeElement(element);
						//this.refreshScroller();
						break;
				}
			}
		},


		refreshScroller: function(item) {
			//	if(this.objScroller){
			//		if($.isFunction(this.objScroller.refresh)){
			//			console.error('refresh scroller',item);
			//			this.objScroller.refresh(item.get());
			//		}
			//	}
		},

		disposeEmitters: function() {
			console.debug("disposeEmitters");
			$(".box").attr("data-emit-events", null);
		},


		setupEmitters: function() {
			console.debug("setBoxYearEvents");
			$(".box").attr("data-top-bottom", "data-top-bottom").attr("data-bottom-top", "data-bottom-top");
			$(".box").attr("data-emit-events", "data-emit-events");


			$(".anno").attr("data-top-bottom", "").attr("data-bottom-top", "");
			$(".anno").attr("data-emit-events", "data-emit-events");
		},


		browserHasHashOnLoad: function() {
			console.debug("browserHasHashOnLoad");

			var hashValue = window.location.hash.replace(/\//, '').substring(1);

			var element = document.getElementById(hashValue);

			var offset = this.objScroller.relativeToAbsolute(element, 'top', 'top');

			console.debug('move to offset', offset);

			this.objScroller.animateTo(offset, {
				done: $.proxy(this.enableEmitters, this)
			});

		},

		enableEmitters: function() {
			console.debug("enableEmitters");
			this.objScroller.on('keyframe', $.proxy(this.onKeyFrame, this));
		},

		// prevent the boxes to emit
		disableEmitters: function() {
			console.debug("disableEmitters");
			this.objScroller.off('keyframe');
		},

		// main entry function
		main: function() {
			this.initializeScroller();
			this.initMenu();
		},

		// initilaize  the sticky menu
		initMenu: function() {
			this.objMenu = new ComponentMenu($("#menu_"), {});
		},



		initializeScroller: function() {
			$('.box').bind('inview', $.proxy(this.onInviewTimer, this));
		},

		lastScrollPosition: 0,

		onInviewTimer: function(e, isInView, visiblePartX, visiblePartY) {


			var direction = 'topTObottom';
			var currentScrollPosition = $(window).scrollTop();
			if (currentScrollPosition > this.lastScrollPosition) {
				direction = 'topTObottom';
			}
			if (currentScrollPosition < this.lastScrollPosition) {
				direction = "bottomTOtop";
			} else {

			}

			this.lastScrollPosition = currentScrollPosition;



			var element = e.target;

			var item = $(element);
			var itemId = item.attr("id");


			//console.error('onInviewTimer', itemId, isInView, visiblePartY);

			if (item.data('inviewtimer')) {
				clearTimeout(item.data('inviewtimer'));
				item.removeData('inviewtimer');
			}

			var self = this;


			item.data('inviewtimer', setTimeout(function() {



				if (visiblePartY && element) {

					//console.debug("gestione",  item.attr("id"), visiblePartY);

					if (direction === 'topTObottom') {

						switch (visiblePartY) {

							case 'bottom':
								console.info(itemId + " DESTROY", visiblePartY, direction);
								self.removeElement(element);
								break;
							case 'top':
							case 'both':
								console.info(itemId + " INIT", visiblePartY, direction);
								self.initElement(element);
								self.setHash(itemId);
								break;
							default:

								break;
						}

					} else {


						switch (visiblePartY) {

							case 'top':
								console.info(itemId + " DESTROY", visiblePartY,direction);
								self.removeElement(element);
								break;

							case 'bottom':
							case 'both':
								console.info(itemId + " INIT", visiblePartY,direction);
								self.initElement(element);
								self.setHash(itemId);
								break;
							default:

								break;
						}

					}

				}


			}, 700));
		},


	};



	return App;

});