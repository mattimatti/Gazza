	var instancesPool = [];

	var Modules = {

		'image-fade': {

			init: function(a, b) {
				var obj = new window.ComponentFade(a, b);
				obj.initialize();
				instancesPool[a.id] = obj;
			},

			remove: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].dispose();
				}
			}

		},

		'image-360': {

			init: function(a, b) {
				var obj = new window.ComponentReel(a, b);
				obj.initialize();
				instancesPool[a.id] = obj;
			},

			remove: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].dispose();
				}
			}
		},

		'video-clip': {

			init: function(a, b) {
				var obj = new window.ComponentVideo(a, b);
				obj.initialize();
				instancesPool[a.id] = obj;
			},

			remove: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].dispose();
				}
			}
		},

		'image-easy': {

			init: function(a, b) {
				var obj = new window.ComponentEasy(a, b);
				obj.initialize();
				instancesPool[a.id] = obj;

			},

			remove: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].dispose();
				}
			}

		},

		'image-pan': {

			init: function(a, b) {
				var obj = new window.ComponentPan(a, b);
				obj.initialize();
				instancesPool[a.id] = obj;

			},

			remove: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].dispose();
				}

			}

		},

		'carousel': {

			init: function(a, b) {
				if(!instancesPool[a.id]){
					var obj = new window.ComponentCarousel(a, b);
						obj.initialize();
						instancesPool[a.id] = obj;
				}
				
			},

			remove: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].dispose();
					delete instancesPool[a.id];
				}

			}

		}

	};

	// append behaviours
	$(".box").attr("data-emit-events","data-emit-events");
	$(".box").attr("data--100-top","").attr("data-100-bottom","");


	skrollr.init({
		forceHeight: true,
		keyframe: function(element, name, direction) {

			console.log(element.id, name, direction );

			var elm = Modules[element.getAttribute('obj-type')];
			var cfg = (element.getAttribute('obj-config'));

			// parse to json object
			cfg = $.parseJSON(cfg);



			//element.className='box skrollable '+direction;

			if (direction === 'down') {

				('data-100Top' === name) ? elm.remove(element, cfg) : elm.init(element, cfg);

			} else {

				('data100Bottom' === name) ? elm.remove(element, cfg) : elm.init(element, cfg);
			}

		}
	});