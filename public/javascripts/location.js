$(document).ready(function() {
	actions();
})

function actions() {
	$('.view-data').click(function() {
		var plot = $(this).attr('plot')
		var location = $(this).attr('location')
		location = location.replace(" ", "")
		getplot(plot,location)
	})

	$('.add-plot').click( function(event) {
		console.log('sending data')
		var id = $(this).attr('location')
		$.post("/"+id+"/add-plot", function(data, status){
	        if(status == 'success') {
	        	$('#plots .rows').append('<div class="plot row"><div class="plot-number">plot #'+data.plot.info.plotnumber+'</div><div class="time"></div><div class="temp"></div><div class="moisture"></div><div plot="'+data.plot._id+'" location="'+data.location.location.name+'" class="view-data"><span>view data</span></div><div plot="'+data.plot._id+'" location="'+data.location._id+'" class="edit-plot"><span>edit</span></div></div>')
	        	console.log(data)
	        	actions();
	        }
	    });
	})

	$('.delete-plot').click(function() {
		var plot = $(this).attr('plot');
		var url = "delete/plot/"+plot
		$.get('/double-check', function(data, status) {
			if(status == 'success') {
				$('#content').append(data)
				$('.yes').click( function() {
					$.post(url, function(data, status){
				        if(status == 'success') {
				        	window.location = data.redirect
				        }
				    });
				});
				$('.no').click( function() {
					$('.check').remove()
				})
			}
		})
	})

	$('.list-item.location').click(function() {
		var location = $(this).attr('location')
		getlocation(location)
	})

	$('.edit-plot').click( function(event) {
		var location = $(this).attr('location')
		var plot = $(this).attr('plot')
		
		$.get("/edit/"+location+"/"+plot, function(data, status) {
	        if( status == 'success' ) {
	        	$('#center').empty().append(data)
	        	actions()
	        }
	    });
	})
}

function getplot(plot,location) {
	var url = "/dashboard/" + location + "/" + plot
	// console.log(url)
	$.get(url, function(data, status){
        if(status == 'success') {
        	// console.log(data)
        	$('#center').empty().append(data)
        	actions()	
        }
    });
}

function getlocation(location) {
	var url = "/dashboard/" + location
	// console.log(url)
	$.get(url, function(data, status){
        if(status == 'success') {
        	// console.log(data)
        	$('#center').empty().append(data)
        	actions()	
        }
    });
}