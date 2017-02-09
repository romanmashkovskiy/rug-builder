RugBuilder.prototype.showWebGLError = function(supported) {

	const CONTAINER = document.createElement('div');
	const MESSAGE   = document.createElement('h2');

	CONTAINER.style.position = 'absolute';
	CONTAINER.style.top = '80px';
	CONTAINER.style.left = '0';
	CONTAINER.style.right = '0';
	CONTAINER.style.bottom = '0';
	CONTAINER.style.zIndex = '999999';
	CONTAINER.style.background = 'white';
	CONTAINER.style.padding = '50px';
	CONTAINER.style.textAlign = 'center';

	if ( supported ) {
		MESSAGE.innerHTML = 'Sorry, WebGL is currently disabled in your browser. Please enable it and refresh the page.';
	} else {
		MESSAGE.innerHTML = 'Sorry, your browser does not support WebGL. Please upgrade to a browser that supports WebGL such as Google Chrome, Firefox, Safari, Internet Explorer 11, or Microsoft Edge.';
	}

	CONTAINER.appendChild(MESSAGE);
	document.body.appendChild(CONTAINER);

} 