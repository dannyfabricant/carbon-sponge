$(document).ready( function() { 
	$('#register-user').on('click', registerUser);
});

function registerUser() {
	console.log('registering')
	// event.preventDefault();

	// Super basic validation - increase errorCount variable if any fields are blank
	var errorCount = 0;
	$('#register fieldset .form-group input').each(function(index, val) {
	    if($(this).val() === '') { errorCount++; }
	});

	// Check and make sure errorCount's still at zero
	if(errorCount === 0) {

	    // If it is, compile all user info into one object
	    var userInfo = {
	    	'username': $('#register .form-group input[name=userName]').val(),
	        'firstname': $('#register .form-group input[name=firstName]').val(),
	        'lastname': $('#register .form-group input[name=lastName]').val(),
	        'email': $('#register .form-group input[name=email]').val(),
	        'password': $('#register .form-group input[name=password]').val()
	    }
	    // Use AJAX to post the object to our adduser service
	    $.ajax({
	        type: 'POST',
	        data: userInfo,
	        url: '/register',
	        dataType: 'JSON'
	    }).done(function( response ) {
	    	// console.log(response)

	        // Check for successful (blank) response
	        if (response.redirect) {
	        	window.location.replace(response.redirect);
	        } else {
	            // If something goes wrong, alert the error message that our service returned
	            alert('Error: ' + response.msg);

	        }
	    });
	}
	else {
	    // If errorCount is more than 0, error out
	    console.log('Please fill in all fields');
	    return false;
	}
}


