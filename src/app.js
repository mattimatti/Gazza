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


	var console = window.muteConsole;


	var instancesPool = [];


	var Modules = {

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
			this.trackView(hash);
		},


		trackView: function(hash) {

			try {
				var trackId = window.location.href + window.location.hash;
				console.info('tracking', trackId);
				s.trackAjaxFotoGallery(trackId);
			} catch (trackingExc) {

			}
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

			if (elm) {
				elm.remove(element);
			}

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


		garbageCollector: function() {

			var self = this;

			console.info(instancesPool);

			var count = 0;
			for (var pepe in instancesPool) {
				count++;
			}

			if (count < 3) {
				return;
			}



			var actualScrollTop = $(window).scrollTop();
			var screenHeight = $(window).height();

			console.error("passa garbageCollector", count, 'elementi', 'actualScrollTop', actualScrollTop, 'screenHeight', screenHeight);

			for (var name in instancesPool) {
				var objInPool = instancesPool[name];
				console.error(name, "item", objInPool.getMyPos());

				var myPos = objInPool.getMyPos();
				var myHeight = objInPool.getHeight();

				/*
				if(  myPos + myHeight - actualScrollTop >  screenHeight){
					console.error(name, 'sono fuori schermo piuuuuu');
				}
				*/

				if (myPos + myHeight - actualScrollTop < 0) {
					console.error(name, 'devo essere pulito');
					var obj = {
						id: name
					};
					self.removeElement(obj);
				}

			}


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


			//console.error('onInviewTimer', itemId, isInView);



			if (item.data('inviewtimer')) {
				clearTimeout(item.data('inviewtimer'));
				item.removeData('inviewtimer');
			}

			var self = this;



			if (!isInView) {
				self.removeElement(element);
			}



			item.data('inviewtimer', setTimeout(function() {


				/*
				if(!isInView){
					console.info(itemId + " DESTROY", visiblePartY,direction);
					self.removeElement(element);
				}else{
					console.info(itemId + " INIT", visiblePartY, direction);
					self.initElement(element);
				}

				if(isInView === true){
					console.info(itemId + " INIT", visiblePartY, direction);
					self.initElement(element);
				}else{
					console.info(itemId + " DESTROY", visiblePartY,direction);
					self.removeElement(element);
				}


				console.info("instancesPool", instancesPool);
				*/



				if (visiblePartY && element) {



					if (direction === 'topTObottom') {

						switch (visiblePartY) {

							case 'bottom':
								console.info(itemId + " DESTROY", visiblePartY, direction);
								self.removeElement(element);
								break;
							case 'top':
							case 'both':
								console.info(itemId + " INIT", visiblePartY, direction);
								//element.setAttribute('isInit',true);
								self.initElement(element);
								self.setHash(itemId);
								//self.garbageCollector();
								break;
							default:

								break;
						}

					} else {


						switch (visiblePartY) {

							case 'top':
								console.info(itemId + " DESTROY", visiblePartY, direction);
								self.removeElement(element);
								break;

							case 'bottom':
							case 'both':
								console.info(itemId + " INIT", visiblePartY, direction);
								self.initElement(element);
								self.setHash(itemId);
								//self.garbageCollector();
								break;
							default:

								break;
						}

					}

				}



			}, 1000));
		},


	};



	return App;

});