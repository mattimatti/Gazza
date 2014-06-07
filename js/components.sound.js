define(['jquery'], function($){


	var DEFAULT_SOUND_ID = 'click';


	// component Easy do nothing it's just for completeness of the api

	var Component = function(options) {

		if (!options) {
			options = {};
		}

		this.defaults = {
			audioPath: "sounds/"
		};

		this.options = $.extend(this.defaults, options);

		this.initialize();

	};

	$.extend(Component.prototype, {


		initialize: function(){
			createjs.Sound.alternateExtensions = ["mp3"];
		},


		// register a sound full path
		registerSoundFullPath: function(fullPath, soundid) {

			// if no id default to 
			if(!soundid){
				soundid = DEFAULT_SOUND_ID;
			}

			console.debug('registerSoundFullPath', fullPath, soundid);

			createjs.Sound.registerSound(fullPath, soundid);
		},


		// register a sound just by id. the defalt folder 
		registerSoundById: function(soundid, customAudioPath) {

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

			if(!soundId){
				soundId = DEFAULT_SOUND_ID;
			}

			if (!createjs.Sound.initializeDefaultPlugins()) {
				return;
			}

			createjs.Sound.play(soundId);
		},

		stopSound: function() {
			createjs.Sound.stop();
		},


		removeAllSounds: function() {
			if(createjs.Sound){
				try{
					createjs.Sound.removeAllSounds();
				}catch(e){
				}
				
			}
			
		}

	});

	return Component;

});