var row = '<div class="row"><div class="timestamp section"><input type="datetime-local" name="timestamp"></div><div class="moisture section"><input type="number" name="moisture"><span>/100</span></div><div class="temp section"><input type="number" name="temp"><span>°F</span></div><div class="section delete">delete</div><div class="section save">save</div></div>'

$(document).ready( function() {
	$('.add-row').on('click', addrow)
	$('.save').on('click', function() {
		let row = $(this).parent();
		save(row);
	})
})

function addrow() {
	$('.data').append(row)
}

function appendNewRow(newrow) {
	let timestamp = new Date(newrow.data.timestamp)

	let html = '<div plot="'+newrow.data.plot+'" id="'+newrow.data._id+'" class="plot row"><div class="timestamp">'+timestamp+'</div><div class="reading">'+newrow.data.reading+'</div></div>'
	$('#plot .rows').prepend(html)
}

function save(row) {
	let timestamp = $(row).children('.timestamp').children('input').val()
	let temp = $(row).children('.temp').children('input').val()
	let reading = $(row).children('.reading').children('input').val()

	let plot = row.attr('plot')
	let location = row.attr('location')
	let url = '/manual/' + location + '/' + plot + '/add'

	if(timestamp !== '' && reading !== '') {
			let data = {
				plot: plot,
				timestamp: timestamp,
				reading: reading
			}
			
			$.post(url, data, function(newrow, status){
				if(status == 'success') {
		        	console.log(newrow)
		        	row.remove();
		        	appendNewRow(newrow);
		        } else {
		        	alert('error saving, check your values')
		        }
			})
	} else {
		alert('fill in all the values!')
	}
}