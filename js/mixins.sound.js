define(['jquery', 'components.sound'], function($, ComponentSound) {

	var console = window.muteConsole;

	var MixinSound = {


		// video has no sound
		initSound: function() {
			console.debug('MixinSound:initSound');
			this.sound = new ComponentSound();

			if (this.options.sound) {

				if (!this.elementId) {
					alert("errore!");
				}

				this.sound.registerSoundFullPath(this.options.sound,this.elementId);
			}
		},


		// Play the component sound
		playSound: function() {
			console.debug('MixinSound:playSound');
			if (this.sound && this.elementId) {
				this.sound.playSound(this.elementId);
			}
		},



		// remove sound
		disposeSound: function() {
			console.debug('MixinSound:disposeSound');
			if (this.sound) {
				//this.sound.removeAllSounds();
				//delete this.sound;
			}
		}

	};


	return MixinSound;

});