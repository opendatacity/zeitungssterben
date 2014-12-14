$(function () {
	var activeClass = 'modal-active';
	var $overlays = $('.modal-foreground, .modal-background');
	$('.modal').each(function () {
		var $this = $(this);	
		var $target = $('a[href=#' + $this.attr('id') + ']');
		$target.click(function (ev) {
			ev.preventDefault();
			$overlays.addClass(activeClass);
			$this.addClass(activeClass);
		});
	});
	$('.modal-foreground, .modal-close').click(function (ev) {
		if (ev.target !== this) return;
		$('.' + activeClass).removeClass(activeClass);
	});
});
