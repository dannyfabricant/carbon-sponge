$(document).ready( function() {

	setInterval(update, 10000);

	$('#create-location').click( function(event) {
		event.preventDefault()
		var location = {
			name: $('input[name="name"]').val(),
			address: $('input[name="address"]').val()
		}
		console.log(location)
		$.post("/dashboard/add-location", location, function(data, status){
	        if(status == 'success') {
	        	console.log('location created')
	        }
	    });
	});
	
	$('.add-plot').click( function(event) {
		console.log('sending data')
		var id = $(this).attr('location')
		$.post("/"+id+"/add-plot", function(data, status){
	        if(status == 'success') {
	        	console.log('plot created')
	        	if (data.redirect) {
	        		window.location.replace(data.redirect);
	        	}
	        }
	    });
	})

	$('.add-data').click( function(event) {
		var location = $(this).attr('location')
		var plot = $(this).attr('plot')

		$.post("/"+location+"/"+plot+"/add-data", function(data, status){
	        if(status == 'success') {
	        	console.log('data added')
	        }
	    });
	})

	$('.edit').click( function(event) {
		var location = $(this).attr('location')
		var plot = $(this).attr('plot')
		
		$.get("/edit/"+location+"/"+plot, function(data, status){
	        if(status == 'success') {
	        	$('body').append("<div id='overlay' plot="+plot+" location="+location+">"+data+"</div>")
	        }
	    });
	})

});

function update() {
	// console.log('updating')
	$.get('/update', function(data, status) {
		for (var i = data.update.length - 1; i >= 0; i--) {
			var plot = data.update[i],
				id = '#' + plot.id,
				current = plot.current

			$(id).children('.status').children('.time').text(current.timestamp.string)
			$(id).children('.info').children('.temp').text(current.temp)
			$(id).children('.info').children('.moisture').text(current.moisture)
		}
	})
}

