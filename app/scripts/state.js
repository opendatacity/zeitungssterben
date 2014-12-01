$(function () {
	var slugify = (function () {
		var replacements = [
			{ search: /ä/g, replace: 'ae' },
			{ search: /ö/g, replace: 'oe' },
			{ search: /ü/g, replace: 'ue' },
			{ search: /[^a-z]+/g, replace: '-' },
		];

		return function slugify (publication) {
			if (publication.slug) return publication.slug;
			var t = publication.title.toLowerCase();
			replacements.forEach(function (r) {
				t = t.replace(r.search, r.replace);
			});
			publication.slug = t;
			return t;
		}
	})();

	var base = '/';
	var initialTitle = document.title;

	$(Z).on('Z:publicationchange', function (ev, publication) {
		document.title = [publication.title, initialTitle].join(': ');
		if (typeof history.replaceState === 'function') {
			history.replaceState(publication, publication.title, slugify(publication));
		}
	});

	// Check if document was loaded with a path
	$(Z).on('Z:ready', function (ev, publications) {
		var initialSlug = window.location.pathname.replace(base, '');
		if (initialSlug.length !== '') {
			for (var i=0, l=publications.length; i<l; i++) {
				if (initialSlug === slugify(publications[i])) {
					$(Z).trigger('Z:publicationchange', publications[i]);
					break;
				}
			}
		}
	});
});
