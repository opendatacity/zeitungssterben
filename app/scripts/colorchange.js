$(Z).on('Z:ready', function () {
	var $target = $('body, .publications-list');

	var redYellowGreen = ['#910005', '#f3db09', '#0e6f01'];
	var grayscale = ['black', 'white'];

	var scale = chroma.scale(grayscale)
	.domain(Z.publications.map(function (p) {
		return p.regression.halfLife;
	}), Z.publications.length/10|0, 'quantiles')
	.correctLightness(false);

	Z.colorchange = function (publication) {
		var fg, bg;
		if (publication.bg) { bg = publication.bg; }
		else {
			bg = scale(publication.regression.halfLife);
			publication.bg = bg;
		}
		fg = (bg.luminance() > 0.5)? 'black' : 'white';
		$target.css({
			backgroundColor: bg,
			color: fg
		});
		$('svg').css({ stroke: fg, fill: fg });
		$('.tt-dropdown-menu').css('backgroundColor', bg.alpha(.9).css());
	};
});
