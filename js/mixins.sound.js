define(['jquery','components.sound'], function($,ComponentSound){

	var console = window.muteConsole;

	var MixinSound = {


		// video has no sound
		initSound: function() {

			this.sound = new ComponentSound();

			if (this.options.sound) {
				this.sound.registerSoundFullPath(this.options.sound);
			}
		},

		// remove sound
		disposeSound: function() {
			if (this.sound) {
				this.sound.removeAllSounds();
				delete this.sound;
			}
		},

	};


	return MixinSound;

});