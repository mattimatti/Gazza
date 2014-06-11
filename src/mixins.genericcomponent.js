define(['jquery'], function($) {

	var console = window.console;

	if(window.REMOVECONSOLE){
		console = window.muteConsole;
	}	

	var MixinGenericComponent = {

		isPhoneBrowser: function() {
			return (/iPhone|iPod/i.test(navigator.userAgent));
		},

		isMobileBrowser: function() {
			return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
		},

		// remove the blinker
		hideBlinker: function(){
			if(this.$el){
				this.$el.find(".blinker").hide();
			}
		},

		
		// safely dispose events
		disposeEventsSafe: function(){
			if(this.$el){

				this.$el.off("click");
				this.$el.off("dblclick");
				this.$el.off("touch");
				this.$el.off("swipe");
				this.$el.off("swiperight");
				this.$el.off("swipeleft");
				this.$el.off("doubletap");
				this.$el.off("mouseover");
				this.$el.off("mouseout");
			}


		}

	};


	return MixinGenericComponent;

});