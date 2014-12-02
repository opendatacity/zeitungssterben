$(Z).on('Z:ready', function () {
	var $target = $('body, .publications-list');

	var redYellowGreen = ['#910005', '#f3db09', '#0e6f01'];
	var grayscale = ['black', 'white'];

	var callback = function (bg, fg) {
		$('body, .publications-list').css({
			backgroundColor: bg,
			color: fg
		});

		$('svg').css({ stroke: fg, fill: fg });

		$('form').css({
			backgroundColor: fg.alpha(.1).css(),
			borderBottomColor: fg.alpha(.15).css()
		})

		$('.tt-dropdown-menu').css('backgroundColor', bg.alpha(.9).css());
	}

	var domain = Z.publications.map(function (p) {
		return p.regression.halfLife;
	});
	domain = [10, 150];

	var scale = chroma.scale(grayscale)
	.domain(domain)
	.correctLightness(false);

	Z.colorchange = function (publication) {
		var fg, bg;
		if (publication.bg) { bg = publication.bg; }
		else {
			bg = scale(publication.regression.halfLife);
			publication.bg = bg;
		}
		fg = chroma((bg.luminance() > 0.4)? 'black' : 'white');
		callback(bg, fg);
	};
});
