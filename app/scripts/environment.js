(function () {
	Z.env = {
		frame: (window !== window.top)
	};

	$(function () {
		$('body').toggleClass('is-framed', Z.env.frame);
	});
})();
