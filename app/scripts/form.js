$(function () {
	$('body').on('focus', 'input', function () {
		$(this).parents('form').addClass('focus');
	});
	$('body').on('blur', 'input', function () {
		$(this).parents('form').removeClass('focus');
	});
	$('[autofocus]').parents('form').addClass('has-autofocus').mouseup(function (ev) {
		if (ev.target === this) $(this).find('[autofocus]').focus();
	});
});
