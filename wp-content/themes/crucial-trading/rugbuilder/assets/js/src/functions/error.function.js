RugBuilder.prototype.error = function(code, message, display) {

	const R = rugBuilder;

	let req = new XMLHttpRequest();

	let urlBase = window.location.href;

	if ( urlBase[urlBase.length-1] === '#' ) {
		urlBase = urlBase.substr(0, urlBase.length-1);
	}

	let urlMessage;

	if ( typeof message === 'string' ) {
		urlMessage = encodeURIComponent(message);
	} else {
		urlMessage = encodeURIComponent(JSON.stringify(message));
	}

	let url = urlBase + '?err=' + code + '&message=' + urlMessage;

	req.open( 'GET', url );
	req.send();

	document.querySelector('#close-error').addEventListener('click', close);

	function close() {
		R.error(0, '', false);
	}

	const ERROR_BOX = document.querySelector('#error-box');
	const ERROR_MSG = document.querySelector('#error-msg');
	const ERROR_COD = document.querySelector('#error-code');

	if ( typeof message !== 'string' ) {
		message = 'Sorry, an error occured';
	}

	ERROR_MSG.innerHTML = message;
	ERROR_COD.innerHTML = 'Error Code: ' + code;

	if ( display ) {
		ERROR_BOX.style.display = 'block';
	} else {
		ERROR_BOX.style.display = 'none';
	}
}