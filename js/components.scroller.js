	var instancesPool = [];


	var Modules = {

		'image-fade': {

			preload: function(a, b) {
				var obj = new window.ComponentFade(a, b);
				obj.preload();
				instancesPool[a.id] = obj;
			},
			init: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].initialize();
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

			preload: function(a, b) {
				var obj = new window.ComponentReel(a, b);
				obj.preload();
				instancesPool[a.id] = obj;
			},
			init: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].initialize();
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

			preload: function(a, b) {
				var obj = new window.ComponentVideo(a, b);
				obj.preload();
				instancesPool[a.id] = obj;
			},
			init: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].initialize();
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

			preload: function(a, b) {
				var obj = new window.ComponentEasy(a, b);
				obj.preload();
				instancesPool[a.id] = obj;

			},
			init: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].initialize();
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

			preload: function(a, b) {
				var obj = new window.ComponentPan(a, b);
				obj.preload();
				instancesPool[a.id] = obj;

			},

			init: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].initialize();
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

			preload: function(a, b) {
				if (!instancesPool[a.id]) {
					var obj = new window.ComponentCarousel(a, b);
					obj.preload();
					instancesPool[a.id] = obj;
				}

			},

			init: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].initialize();
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
	//$(".box").attr("data-top-bottom", "").attr("data-100-bottom", "").attr("data-bottom-top", "").attr("data-bottom", "");
	$(".box").attr("data-top-bottom", "").attr("data-bottom-top", "");
	
	skrollr.init({
		forceHeight: true,
		keyframe: function(element, name, direction) {
console.log( name, direction );

			var elm = Modules[element.getAttribute('obj-type')];
			var cfg = (element.getAttribute('obj-config'));

			// parse to json object
			cfg = $.parseJSON(cfg);

			//element.className='box skrollable '+direction;

			if (direction === 'down') {
				switch (name) {
					
					case 'dataTopBottom':
					console.log('REMOVE',element.id);
						elm.remove(element, cfg);
						break;
						
						
					case 'dataBottomTop':
					
					console.log('INIT',element.id);
					
						elm.preload(element, cfg);
						elm.init(element, cfg);
						break;	
					
					/*
					case 'dataTopBottom':
						elm.remove(element, cfg);
						break;
					case 'dataBottomTop':
					case 'dataBottom':
						elm.preload(element, cfg);
						break;
					default:
						elm.init(element, cfg);
						break;*/
				}
			} else {
				
				switch (name) {
					
					case 'dataTopBottom':
					console.log('INIT',element.id);
					
						elm.preload(element, cfg);
						elm.init(element, cfg);
						
						break;
						
						
					case 'dataBottomTop':
					
					console.log('REMOVE',element.id);
					
					elm.remove(element, cfg);
						break;	
					
					/*case 'data100Bottom':
						elm.remove(element, cfg);
						break;
					case 'dataBottomTop':
					case 'dataBottom':
						elm.preload(element, cfg);
						break;
					default:
						elm.init(element, cfg);
						break;*/
				}

			}

		}
	});