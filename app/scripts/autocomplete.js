(function () {
	var publications;

	var module = {
	};

	function _makeSource (array, keys, matchHook) {
		var ignoreCharacters = /[^a-zäöüß\*]/ig;
		if (!keys.forEach) keys = [keys];
		var l = keys.length;
		return function (query, cb) {
			try {
				if (query.substr(0, 1) === '/') {
					// If the query starts with /, we'll enter advanced mode and treat
					// the rest as a literal regular expression
					query = new RegExp(query.substr(1), 'i');
				} else {
					// We'll enter semi-advanced mode where most characters are ignored
					// and * matches everything
					query = new RegExp(query.toLowerCase().replace(ignoreCharacters, '').replace('*', '.*'));
				}
				var matches = array.filter(function (el) {
					var i = 0, key = '';
					while (key = keys[i++]) {
						if (!el[key]) continue;
						if (el[key].toLowerCase().replace(ignoreCharacters, '').match(query)) return true;
					}
					return false;
				}).sort(function (a, b) {
					return (b.max.absolute - a.max.absolute);
				});
			} catch (e) {
				var matches = [];
			}
			if (matchHook) matchHook(matches);
			cb(matches.slice(0, 10));
		}
	}

	function drawIfOnlyOneMatch (matches) {
		if (matches.length === 1) $(Z).trigger('Z:publicationchange', matches[0]);
	}

	function init (p) {
		publications = p;
		Z.findPublication = _makeSource(publications, ['title', 'alias'], drawIfOnlyOneMatch);

		var $tf = $('#tf-publication');

		$tf.typeahead({
			minLength: 1,
			highlight: true
		},
		{
			name: 'publications',
			source: Z.findPublication,
			displayKey: 'title'
		});
		// We're not using the HTML5 `autofocus` attribute because that will
		// be focused even when displayed inside a frame
		if ($tf.hasClass('autofocus') && !Z.env.frame) $tf.focus();
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
		$tf.on('keyup', function (ev) {
			if (ev.keyCode !== 13) return; // key 13 is return
			$('form').triggerHandler('submit');
			$tf.blur();
		});
		$('form').on('submit', function (ev) {
			ev.preventDefault();
			Z.findPublication($tf.val(), function (matches) {
				if (!matches || matches.length === 0) return;
				$(Z).trigger('Z:publicationchange', matches[0]);
			});
		});
		$(Z).on('Z:publicationchange', function (ev, publication) {
			if (!$tf.is(':focus') || $tf.val() === '') $tf.val(publication.title);
			$tf.data('publication', publication);
		});
	}

	module.init = init;

	Z.autocomplete = module;
})();
