$(Z).on('Z:ready', function () {
	var redYellowGreen = ['#910005', '#f3db09', '#0e6f01'];
	var grayscale = ['#aaa', 'white'];

	var callback = function (bg, fg) {
		$('body, .publications-list').css({
			backgroundColor: bg,
			color: fg
		});

		$('svg').css({ stroke: fg, fill: fg });

		// $('form').css({
			// backgroundColor: fg.alpha(.1).css(),
			// borderBottomColor: fg.alpha(.15).css()
		// });

		$('#modals-pane a').css({
			color: fg
		});

		// $('.tt-dropdown-menu').css('backgroundColor', bg.alpha(.9).css());
	}

	var domain = Z.publications.map(function (p) {
		return p.regression.halfLife;
	});
	domain = [0, 150];

	var scale = chroma.scale(grayscale)
	.domain(domain)
	.correctLightness(false);

	var whenOpportune = (function () {
		var delayedCallback = null;
		var reasonToDelay = false;

		$(document.body).on('typeahead:opened', function () {
			reasonToDelay = true;
		});
		$(document.body).on('typeahead:closed', function () {
			reasonToDelay = false;
			if (delayedCallback) {
				delayedCallback();
				delayedCallback = null;
			}
		});

		return function (cb) {
			if (reasonToDelay) delayedCallback = cb;
			else cb();
		}
	})();

	Z.colorchange = function (publication) {
		var fg, bg;
		if (publication.bg) { bg = publication.bg; }
		else {
			bg = scale(publication.regression.halfLife);
			publication.bg = bg;
		}
		fg = chroma((bg.luminance() > 0.4)? 'black' : 'white');
		whenOpportune(function () { callback(bg, fg); });
	};
});
