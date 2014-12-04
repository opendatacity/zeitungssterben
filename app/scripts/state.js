$(function () {
	var base = '/';
	var initialTitle = document.title;

	$(Z).on('Z:publicationchange', function (ev, publication) {
		document.title = [publication.title, initialTitle].join(': ');
		if (typeof history.replaceState === 'function') {
			history.replaceState(publication, publication.title, Z.slugify(publication));
		}
	});

	// Check if document was loaded with a path
	$(Z).on('Z:ready', function (ev, publications) {
		var initialSlug = window.location.pathname.replace(base, '');
		if (initialSlug.length !== '') {
			for (var i=0, l=publications.length; i<l; i++) {
				if (initialSlug === Z.slugify(publications[i])) {
					$(Z).trigger('Z:publicationchange', publications[i]);
					break;
				}
			}
		}
	});
});
