(function () {
	var replacements = [
		{ search: /ä/g, replace: 'ae' },
		{ search: /ö/g, replace: 'oe' },
		{ search: /ü/g, replace: 'ue' },
		{ search: /[^a-z]+/g, replace: '-' },
	];

	function slugify (publication) {
		if (publication.slug) return publication.slug;
		var t = publication.title.toLowerCase();
		replacements.forEach(function (r) {
			t = t.replace(r.search, r.replace);
		});
		publication.slug = t;
		return t;
	}

	if (typeof Z !== 'undefined') Z.slugify = slugify;
	if (typeof module !== 'undefined') module.exports = slugify;
})();
