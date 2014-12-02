(function () {
	var publications;

	var module = {
	};

	function _makeSource (array, key, matchHook) {
		return function (query, cb) {
			var matches = array.filter(function (el) {
				return (el[key].toLowerCase().indexOf(query.toLowerCase()) !== -1);
			}).sort(function (a, b) {
				return (b.maxCopies - a.maxCopies)
			});
			if (matchHook) matchHook(matches);
			cb(matches);
		}
	}

	function drawIfOnlyOneMatch (matches) {
		if (matches.length === 1) $(Z).trigger('Z:publicationchange', matches[0]);
	}

	function init (p) {
		publications = p;

		$tf = $('#tf-publication');

		$tf.typeahead({
			minLength: 1,
			highlight: false
		},
		{
			name: 'publications',
			source: _makeSource(publications, 'title', drawIfOnlyOneMatch),
			displayKey: 'title'
		});
		if ($tf.is('[autofocus]')) $tf.focus();
		$tf.on('typeahead:cursorchanged typeahead:selected typeahead:autocompleted',
			function (event, publication) {
				$(Z).trigger('Z:publicationchange', publication);
			}
		);
		$tf.on('blur', function () {
			var publication = $(this).data('publication');
			if (publication) $(this).val(publication.title);
		});
		$tf.on('focus', function () { $(this).select(); });
		$tf.on('typeahead:opened', function () {
			$('.tt-dropdown-menu').css('margin-top', function () { $('form').outerHeight(); });
		});
		$(Z).on('Z:publicationchange', function (ev, publication) {
			if (!$tf.is(':focus') || $tf.val() === '') $tf.val(publication.title);
			$tf.data('publication', publication);
		});
	}

	module.init = init;

	Z.autocomplete = module;
})();
