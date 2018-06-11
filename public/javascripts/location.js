$(document).ready(function() {
	actions();

	let location = window.location.pathname
	location = location.split('/')
	console.log(location)
	// console.log(location)
	// if (location[1] == '' && location.length == 2) {
	// 	setInterval(update, 1000 * 60);
	// } else if (location[1] == 'd' && location.length == 3) {
	// 	setInterval(update, 1000 * 60);
	// }
})

function addLocation() {
	var location = {
		name: 'Understory',
		address: 'BK'
	}
	console.log(location)
	$.post("/add-location", location, function(data, status){
        if(status == 'success') {
        	console.log('location created')
        }
    });
}

function actions() {
	$('.view-data').on('click', function(){
		var plot = $(this).attr('plot')
		var location = $(this).attr('location')
		// location = location.replace(" ", "-")
		// getplot(plot,location)
	})

	$('.add-plot').on('click', function(){
		var id = $(this).attr('location')
		$('#plot-number').css({ 'display' : 'block'})

		$('.submit').click(function() {
			var input = $('#number').val()
			if(input) {
				console.log('sending data')
				$.post("/d/"+id+"/add-plot", {number : input}, function(data, status){
			        if(status == 'success') {
			        	$('#plots .rows').append('<div class="plot row"><div class="plot-number">plot #'+data.plot.info.plotnumber+'</div><div class="time"></div><div class="temp"></div><div class="moisture"></div><div plot="'+data.plot._id+'" location="'+data.location._id+'" class="edit-plot"><span>edit</span></div></div>')
			        	console.log(data)
			        	
			        }
			    });
			}
			$('#plot-number').css({ 'display' : 'none' })
		})
		$('.cancel').click(function() {
			$('#plot-number').css({ 'display' : 'none' })
		})
	})

	$('.list-item.location').on('click', function(){
		var location = $(this).attr('location')
		// getlocation(location)
	})

	$('.edit-plot').on('click', function(event){
		event.preventDefault()
		var location = $(this).attr('location')
		var plot = $(this).attr('plot')
		
		$.get("/edit/"+location+"/"+plot, function(data, status) {
	        if( status == 'success' ) {
	        	$('#center').empty().append(data)
	        	$('.delete-plot').on('click', function(){
	        		var plot = $(this).attr('plot');
	        		var url1 = "/delete/plot/"+plot

	        		$.get('/double-check', function(data, status) {
	        			if(status == 'success') {
	        				$('#content').append(data)
	        				$('.yes').click( function() {
	        					$.post(url1, function(data, status){
	        				        if(status == 'success') {
	        				        	history.go(0)
	        				        	$('#cover').remove()
	        				        }
	        				    });
	        				});
	        				$('.no').click( function() {
	        					$('#cover').remove()
	        				})
	        			}
	        		})

	        	})
	        }
	    });
	})
}

function getplot(plot,location) {
	var url = "/d/" + location + "/" + plot
	// console.log(url)
	$.get(url, function(data, status){
        if(status == 'success') {
        	// console.log(data)
        	$('#center').empty().append(data)
        }
    });
}

function getlocation(location) {
	var url = "/d/" + location
	// console.log(url)
	$.get(url, function(data, status){
        if(status == 'success') {
        	// console.log(data)
        	$('#center').empty().append(data)
        	actions()
        }
    });
}

function update() {
	// console.log('updating')
	$.get('/update', function(data, status) {
		// console.log(data)
		for (var i = data.update.length - 1; i >= 0; i--) {
			var plot = data.update[i],
				id = '#' + plot.id,
				current = plot.current

			$(id).children('.time').text(current.timestamp.string)
			$(id).children('.temp').text(current.temp)
			$(id).children('.moisture').text(current.moisture + '/100')
		}
	})
}