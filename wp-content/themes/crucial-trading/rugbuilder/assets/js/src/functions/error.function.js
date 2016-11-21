RugBuilder.prototype.error = function(display, code) {

	const ERROR_BOX = document.querySelector('#error-box');
	const ERROR_MSG = document.querySelector('#error-msg');

	ERROR_MSG.innerText = '';

	let errorMsg;

	switch (code) {

		case 1 :
			errorMsg = '';
			break;

		case 1 :
			errorMsg = '';
			break;

		case 1 :
			errorMsg = '';
			break;

		case 1 :
			errorMsg = '';
			break;

		default :
			errorMsg = 'Sorry, an error has occured. Please try again.';
	}

	ERROR_MSG.innerHTML = errorMsg;

	if ( display ) {
		ERROR_BOX.style.display = 'block';
	} else {
		ERROR_BOX.style.display = 'none';
	}
}