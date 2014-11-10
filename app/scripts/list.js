var list;
$(function () {
	var $ul = $('.papers-list');

	$ul.on('click', 'li', function () {
		chart.draw($(this).data('paper'));
	});

	function add (paper) {
		$li = $('<li>');
		$li.append('<strong>'+paper.title+'</strong>');
		$li.append(' <span class="half-life">'+Math.round(paper.halfLife)+'</span>');
		$li.data('paper', paper);
		$ul.append($li);
	}

	list = {
		add: add
	};
});
