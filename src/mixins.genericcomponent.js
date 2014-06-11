define(['jquery'], function($) {

	var console = window.muteConsole;

	var MixinGenericComponent = {

		
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