(function () {
	var replacements = [
		{ search: /ä/ig, replace: 'ae' },
		{ search: /ö/ig, replace: 'oe' },
		{ search: /ü/ig, replace: 'ue' },
		{ search: /ß/g, replace: 'ss' },
		{ search: /[éèê]/ig, replace: 'e' },
		{ search: /[áàâ]/ig, replace: 'a' },
		{ search: /'/g, replace: '' },
		{ search: /[^a-z0-9]+$/ig, replace: '' },
		{ search: /[^a-z0-9]+/ig, replace: '-' },
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
