	var instancesPool = [];


	var Modules = {

		'image-fade': {

			init: function(a, b) {
				var obj = new window.ComponentFade(a, b);
				obj.preload();
				instancesPool[a.id] = obj;
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
				var obj = new window.ComponentReel(a, b);
				obj.preload();
				instancesPool[a.id] = obj;
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
				var obj = new window.ComponentVideo(a, b);
				obj.preload();
				instancesPool[a.id] = obj;
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
				var obj = new window.ComponentEasy(a, b);
				obj.preload();
				instancesPool[a.id] = obj;

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
				var obj = new window.ComponentPan(a, b);
				obj.preload();
				instancesPool[a.id] = obj;

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
					var obj = new window.ComponentCarousel(a, b);
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

	// append behaviours
	$(".box").attr("data-emit-events", "data-emit-events");
	$(".box").attr("data-top-bottom", "").attr("data-bottom-top", "");

	skrollr.init({
		forceHeight: true,
		keyframe: function(element, name, direction) {
			console.log(name, direction);

			var elm = Modules[element.getAttribute('obj-type')];
			var cfg = (element.getAttribute('obj-config'));

			// parse to json object
			cfg = $.parseJSON(cfg);

			//element.className='box skrollable '+direction;

			if (direction === 'down') {
				switch (name) {

					case 'dataTopBottom':

						elm.remove(element, cfg);
						break;


					case 'dataBottomTop':

						elm.init(element, cfg);
						break;
				}
			} else {

				switch (name) {

					case 'dataTopBottom':

						elm.init(element, cfg);

						break;


					case 'dataBottomTop':

						elm.remove(element, cfg);
						break;

				}

			}

		}
	});