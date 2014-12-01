$(Z).on('Z:ready', function () {
	var $target = $('body');
	var scale = chroma.scale(
		['#910005', '#f3db09', '#0e6f01']
	)
	.domain(Z.publications.map(function (p) {
		return p.regression.halfLife;
	}), 10, 'quantiles')
	.correctLightness(false)
	.out('hex');

	Z.colorchange = function (publication) {
		$target.css(
			'background-color',
			scale(publication.regression.halfLife)
		);
	};
});
