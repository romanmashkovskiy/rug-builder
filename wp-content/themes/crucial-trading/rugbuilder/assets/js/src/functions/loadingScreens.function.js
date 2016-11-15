RugBuilder.prototype.loadingScreens = function(screen, action) {

	let id;

	switch (screen) {
		case 'full'   : id = '#full-loading'; break;
		case 'drawer' : id = '#drawer-loading'; break;
		case 'canvas' : id = '#canvas-loading'; break;
	}

	let z = action === 'open' ? 99999 : -99999;

	document.querySelector(id).style.zIndex = z;
}