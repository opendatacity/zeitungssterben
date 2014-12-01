$(function () {
	var $ul = $('.publications-list');

	$ul.on('mouseenter', 'li', function () {
		$(Z).trigger('Z:publicationchange', $(this).data('publication'));
	});

	function add (publication) {
		$li = $('<li>');
		$li.append('<strong>'+publication.title+'</strong>');
		$li.append(' <span class="half-life">'+Math.round(publication.regression.halfLife)+'</span>');
		$li.data('publication', publication);
		$ul.append($li);
	}

	Z.list = {
		add: add
	};
});
