$(document).ready( function() {
	$('.username').click(function() {
		$('.user-menu').toggleClass('show');
		$('#navigation').css({ 'display' : 'none' })
	});
	$('#menutoggle').click(function() {
		if ( $(this).hasClass('active') ) {
			$(this).removeClass('active')
			$('#navigation').css({ 'display' : 'none' })
		} else {
			$(this).addClass('active')
			$('#navigation').css({ 'display' : 'block' })
		}
	})
});