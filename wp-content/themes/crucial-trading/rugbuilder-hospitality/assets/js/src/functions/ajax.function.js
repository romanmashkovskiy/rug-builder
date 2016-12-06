RugBuilder.prototype.ajax = function(method, url, callback, responseType) {

	let req = new XMLHttpRequest();

	if ( responseType !== undefined ) {
		req.responseType = responseType;
	}

	req.addEventListener('load', callback);
	req.open(method, url);
	req.send();
}