define(['jquery'], function($) {

	var console = window.console;

	var DEFAULT_SOUND_ID = 'click';


	// component Easy do nothing it's just for completeness of the api

	var ComponentSound = function(options) {

		if (!options) {
			options = {};
		}

		this.defaults = {
			audioPath: "sounds/"
		};

		this.options = $.extend(this.defaults, options);

		this.initialize();

	};

	$.extend(ComponentSound.prototype, {


		initialize: function() {
			createjs.Sound.alternateExtensions = ["mp3"];
		},


		// register a sound full path
		registerSoundFullPath: function(fullPath, soundid) {

			// if no id default to 
			if (!soundid) {
				soundid = DEFAULT_SOUND_ID;
			}

			console.info('ComponentSound:registerSoundFullPath', fullPath, soundid);

			createjs.Sound.registerSound(fullPath, soundid);
			createjs.Sound.addEventListener("fileload", $.proxy(this.handleFileLoad, this));
		},


		handleFileLoad: function(event){
			console.info("ComponentSound:Preloaded:", event.id, event.src);

		},


		// register a sound just by id. the defalt folder 
		registerSoundById: function(soundid, customAudioPath) {

			console.debug('ComponentSound:registerSoundById', arguments);

			var path = this.options.audioPath;
			var fullPath;

			if (customAudioPath) {
				path = customAudioPath;
			}

			fullPath = path + soundid + '.ogg';

			createjs.Sound.registerSound(fullPath, soundid);
		},



		// play an arbitrary sound
		playSound: function(soundId) {

			if (!soundId) {
				soundId = DEFAULT_SOUND_ID;
			}

			if (!createjs.Sound.initializeDefaultPlugins()) {
				console.error('ComponentSound:playSound error');
				return;
			}

			createjs.Sound.play(soundId);
		},

		stopSound: function() {
			createjs.Sound.stop();
		},


		removeAllSounds: function() {
			if (createjs.Sound) {
				try {
					createjs.Sound.removeAllSounds();
				} catch (e) {}

			}

		}

	});

	return ComponentSound;

});