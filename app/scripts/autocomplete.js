(function () {
	var publications;

	var module = {
	};

	function _makeSource (array, key) {
		return function (query, cb) {
			cb(array.filter(function (el) {
				return (el[key].toLowerCase().indexOf(query.toLowerCase()) !== -1);
			}).sort(function (a, b) {
				return (b.maxCopies - a.maxCopies)
			}));
		}
	}

	function init (p) {
		publications = p;

		$('#tf-publication').typeahead({
			minLength: 1,
			highlight: false
		},
		{
			name: 'publications',
			source: _makeSource(publications, 'title'),
			displayKey: 'title'
		});
		$('#tf-publication').on(
			'typeahead:cursorchanged typeahead:selected typeahead:autocompleted',
		function (event, publication) {
			chart.draw(publication);
		});
	}

	module.init = init;

	if (!window.modules) window.modules = {};
	window.modules.autocomplete = module;
})();
