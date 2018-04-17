var row = '<div location="5a830958f6a328228cafe85f" plot="5a83097df6a328228cafe861" class="row"><div class="timestamp section"><input type="datetime-local" name="timestamp"></div><div class="reading section"><input type="number" name="reading" min="0" max="100"><span>/100</span></div><div class="section save">save</div><div class="section delete">delete</div></div>'

$(document).ready( function() {
	$('.add-row').on('click', addrow)
	$('#new-data .data .row .save').on('click', function() {
		let row = $(this).parent();
		save(row);
	})
	$('#new-data .data .row .delete').click(function() {
		$(this).parent().remove();
	})

	$('#bio .rows .row .save').on('click', function() {
		let row = $(this).parent();
		updateRow(row);
	})
	$('#bio .rows .row .delete').click(function() {
		removeRow($(this).parent())
	})
})

function removeRow(row) {
	let id = row.attr('id');
	console.log(id)
	let plot = $(this).parent().attr('plot');
	$.get('/double-check', function(data, status) {
		if(status == 'success') {
			$('#content').append(data)
			$('.yes').click( function() {
				$.post('/m/' + id + '/delete', function(response) {
					console.log(response)
					$(row).remove();
					$('#cover').remove()
				})
			});
			$('.no').click( function() {
				$('#cover').remove()
			})
		}
	})
}

function addrow() {
	$('.data').append(row)
}

function appendNewRow(newrow) {
	let timestamp = new Date(newrow.data.timestamp)
	let html = '<div plot="'+newrow.data.plot+'" id="'+newrow.data._id+'" class="plot row"><div class="timestamp section"><input type="text" pattern="d*" maxlength="4" value="'+newrow.data.date.month+'" class="month"><span>-</span><input type="text" pattern="d*" maxlength="4" value="'+newrow.data.date.day+'" class="day"><span>-</span><input type="text" pattern="d*" maxlength="4" value="'+newrow.data.date.year+'" class="year"><input type="text" pattern="d*" maxlength="4" value="'+newrow.data.date.hour+'" class="hour"><span>:</span><input type="text" pattern="d*" maxlength="4" value="'+newrow.data.date.minute+'" class="minute"><select selected="'+newrow.data.date.period+'" class="period db"><option value="am">am</option><option value="pm">pm</option></select></div><div class="reading section"><input type="number" name="reading" min="0" max="100" value="'+newrow.data.reading+'"><span>/100</span></div><div class="section save">save</div><div class="section delete">delete</div></div>'
	$('#bio .rows').prepend(html)
}

function save(row) {
	let reading = $(row).children('.reading').children('input').val()
	let year = $(row).find('.year').val()
	let month = $(row).find('.month').val()
	let day = $(row).find('.day').val()
	let hour = $(row).find('.hour').val()
	let minute = $(row).find('.minute').val()
	let period = $(row).find('.period').val()

	let timestamp =  new Date( year, month, day, hour, minute)

	let plot = row.attr('plot')
	let location = row.attr('location')
	let url = '/m/' + location + '/' + plot + '/add'

	if(timestamp !== '' && reading !== '') {
			let data = {
				plot: plot,
				timestamp: timestamp,
				time: hour+':'+minute+' '+period,
				date: month+'/'+day+'/'+year,
				year: year,
				month: month,
				day: day,
				hour: hour,
				minute: minute,
				period: period,
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

function updateRow(row) {
	let reading = $(row).children('.reading').children('input').val()
	let year = $(row).find('.year').val()
	let month = $(row).find('.month').val()
	let day = $(row).find('.day').val()
	let hour = $(row).find('.hour').val()
	let minute = $(row).find('.minute').val()
	let period = $(row).find('.period').val()

	let timestamp =  new Date( year, month, day, hour, minute)

	let id = row.attr('id')
	let url = '/m/' + id + '/save'

	if(timestamp !== '' && reading !== '') {
			let data = {
				plot: row.attr('plot'),
				timestamp: timestamp,
				time: hour+':'+minute+' '+period,
				date: month+'/'+day+'/'+year,
				year: year,
				month: month,
				day: day,
				hour: hour,
				minute: minute,
				period: period,
				reading: reading
			}
			
			$.post(url, data, function(newrow, status){
				if(status == 'success') {
		        	console.log(status)
		        } else {
		        	alert('error saving, check your values')
		        }
			})
	} else {
		alert('fill in all the values!')
	}
}


