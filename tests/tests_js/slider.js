$(function() {
	var items 		= $('.item'),
	    controls 	= $('.control'),
	    _visibleTime  = 2000,
	    count 		= items.length,
	    _transitionDuration = 500,
	    Slider;


	module('Slider');


	// Init Slider
	// HTML in ../tests/slider.html
	Slider = Eim.Slider({
		targets: items,
		indexTriggers: {
			controls: controls,
			activeClass: 'active'
		},
		auto: true,
		visibleTime: _visibleTime,
		transitionDuration: _transitionDuration,

		onTransitionOver: function(current) {
			//
		}
	});

	test('Hides all targets except first', function() {
		equal(items.eq(0).is(':visible'), true);
		equal(items.siblings(':visible').length, 1);
	});

});
