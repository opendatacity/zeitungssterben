var list;
$(function () {
	var $ul = $('.publications-list');

	$ul.on('mouseenter', 'li', function () {
		chart.draw($(this).data('publication'));
	});

	function add (publication) {
		$li = $('<li>');
		$li.append('<strong>'+publication.title+'</strong>');
		$li.append(' <span class="half-life">'+Math.round(publication.regression.halfLife)+'</span>');
		$li.data('publication', publication);
		$ul.append($li);
	}

	list = {
		add: add
	};
});
