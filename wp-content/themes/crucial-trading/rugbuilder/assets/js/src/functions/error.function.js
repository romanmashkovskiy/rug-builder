RugBuilder.prototype.error = function(code, display) {

	const R = rugBuilder;

	document.querySelector('#close-error').addEventListener('click', close);

	function close() {
		R.error(0, false);
	}

	const ERROR_BOX = document.querySelector('#error-box');
	const ERROR_MSG = document.querySelector('#error-msg');
	const ERROR_COD = document.querySelector('#error-code');

	ERROR_MSG.innerHTML = '';
	ERROR_COD.innerHTML = '';

	let errorMsg, detailError;

	switch (code) {

		case 0 :
			errorMsg = '';
			break;

		case 100 :
		case 101 :
			// Loading the material/collection data from WooCommerce
			errorMsg = 'Sorry, an error has occured loading the RugBuilder. Please refresh the page.';
			break;

		case 102 :
			// Loading swatch data from WooCommerce
			errorMsg = 'Sorry, an error has occured loading the swatches. Please refresh the page.';
			break;

		case 103 : 
			// Loading border material data from WooCommerce
			errorMsg = 'Sorry, an error has occured loading the borders. Please refresh the page.';
			break;

		

		default :
			errorMsg = 'Sorry, an error has occured. Please try again.';
	}

	ERROR_MSG.innerHTML = errorMsg;
	ERROR_COD.innerHTML = 'Error Code: ' + code;

	if ( display ) {
		ERROR_BOX.style.display = 'block';
	} else {
		ERROR_BOX.style.display = 'none';
	}
}