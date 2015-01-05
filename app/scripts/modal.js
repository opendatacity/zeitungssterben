$(function () {
	// General-purpose code for showing and hiding modals
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
	function closeModals (ev) {
		if (ev && ev.target !== this) return;
		$('.' + activeClass).removeClass(activeClass);
	}
	$('.modal-foreground, .modal-close').click(closeModals);
	$(window).keyup(function (ev) {
		if (ev.keyCode === 27) closeModals(); // Esc
	});

	// Special-purpose code for individual modal behaviour
 	$embedCode = $('#embed-code');
	function updateEmbedCode () {
		$embedCode.val($embedCode.val().replace(/src=".*?"/, 'src="' + window.location + '"'));
	}
	$(Z).on('Z:statechange ready', updateEmbedCode);
	updateEmbedCode();
	$embedCode.focus(function () { $embedCode.select(); });
});
