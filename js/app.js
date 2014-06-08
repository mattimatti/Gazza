define([
	'jquery',
	'skrollr',
	'components.fade',
	'components.360',
	'components.video',
	'components.easy',
	'components.pan',
	'components.carousel',
	'components.menu'

], function($, skrollr, ComponentFade, ComponentReel, ComponentVideo, ComponentEasy, ComponentPan, ComponentCarousel, ComponentMenu) {


	var console = window.muteConsole;


	var instancesPool = [];


	var Modules = {

		
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
					delete instancesPool[a.id];
				}

			}

		},

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


		objMenu: null,


		initMenu: function(){
			this.objMenu = new ComponentMenu($("#menu"), {});
		},


		hasHash: function() {
			return window.location.hash !== '';
		},

		setHash: function(hash) {
			window.location.hash = '/' + hash;
		},


		initElement: function(element) {

			var elm = Modules[element.getAttribute('obj-type')];
			var cfg = (element.getAttribute('obj-config'));
			cfg = $.parseJSON(cfg);

			if (elm) {
				elm.init(element, cfg);
			}

		},

		removeElement: function(element) {
			var elm = Modules[element.getAttribute('obj-type')];
			var cfg = (element.getAttribute('obj-config'));
			cfg = $.parseJSON(cfg);

			if (elm) {
				elm.remove(element, cfg);
			}

		},

		onKeyFrame: function(element, name, direction) {

			var item = $(element);
			var itemId = item.attr("id");

			//console.error(itemId, name, direction);

			if (direction === 'down') {
				switch (name) {
					case 'dataTopBottom':
						//console.info(itemId + " DESTROY");
						this.removeElement(element);
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
						break;
				}
			}
		},



		disposeEmitters: function() {
			console.debug("disposeEmitters");
			$(".box").attr("data-emit-events", null);
		},


		setupEmitters: function() {
			console.debug("setBoxYearEvents");
			$(".box").attr("data-top-bottom", "").attr("data-bottom-top", "");
			$(".box").attr("data-emit-events", "data-emit-events");
		},


		browserHasHashOnLoad: function() {
			console.debug("browserHasHashOnLoad");

			var hashValue = window.location.hash.replace(/\//, '').substring(1);

			var element = document.getElementById(hashValue);

			var offset = this.objScroller.relativeToAbsolute(element, 'top', 'top');

			console.error('move to offset', offset);

			this.objScroller.animateTo(offset, {
				done: $.proxy(this.enableEmitters, this)
			});

		},

		enableEmitters: function() {
			console.debug("enableEmitters");
			this.objScroller.on('keyframe', $.proxy(this.onKeyFrame, this));
		},

		disableEmitters: function() {
			console.debug("disableEmitters");
			this.objScroller.off('keyframe');
		},

		main: function() {
			this.initializeScroller();
			this.initMenu();
		},

		initializeScroller: function() {

			this.setupEmitters();

			// initilaize the scroller
			this.objScroller = skrollr.init({
				forceHeight: true,
				keyframe: $.proxy(this.onKeyFrame, this)
			});

			// if has hash
			if (this.hasHash()) {
				this.disableEmitters();
				this.browserHasHashOnLoad();
			}

		}
	};



	return App;

});