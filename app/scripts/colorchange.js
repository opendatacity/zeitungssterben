$(Z).on('Z:ready', function () {
	var $target = $('body');
	var scale = chroma.scale(
		['#910005', '#f3db09', '#0e6f01']
	)
	.domain(Z.publications.map(function (p) {
		return p.regression.halfLife;
	}), Z.publications.length/10|0, 'quantiles')
	.correctLightness(false)
	.out('hex');

	Z.colorchange = function (publication) {
		var color;
		if (publication.color) { color = publication.color; }
		else {
			color = scale(publication.regression.halfLife);
			publication.color = color;
		}
		$target.css('background-color', color);
	};
});
