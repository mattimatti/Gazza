(function() {

	// component Easy do nothing it's just for completeness of the api

	var Component = function(options) {

		if (!options) {
			options = {};
		}

		this.defaults = {
			audioPath: "sounds/"
		};

		this.options = $.extend(this.defaults, options);


	};

	$.extend(Component.prototype, {


		registerSoundById: function(soundid, customAudioPath) {

			createjs.Sound.alternateExtensions = ["mp3"];

			var path = this.options.audioPath;

			if (customAudioPath) {
				path = customAudioPath;
			}
			var fullPath = path + soundid + '.ogg';
			createjs.Sound.registerSound(fullPath, soundid);
		},

		// play an arbitrary sound
		playSound: function(soundId) {

			console.debug('playSound', soundId);

			if (!createjs.Sound.initializeDefaultPlugins()) {
				return;
			}

			createjs.Sound.play(soundId);
		},

		stopSound: function() {
			createjs.Sound.stop();
		},


		removeAllSounds: function() {
			createjs.Sound.removeAllSounds();
		}

	});

	window.ComponentSound = Component;

}());