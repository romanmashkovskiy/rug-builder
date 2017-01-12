RugBuilder.prototype.loadingScreens = function(screen, action) {
	return true;
//	let id;

//	switch (screen) {
//		case 'full'   : id = '#hosp_builder_full-loading'; break;
//		case 'drawer' : id = '#hosp_builder_drawer-loading'; break;
//		case 'canvas' : id = '#hosp_builder_canvas-loading'; break;
//	}

//	let z = action === 'open' ? 99999 : -99999;

//	document.querySelector(id).style.zIndex = z;
}

RugBuilder.prototype.showLittleLoader = function() {
	return true;
//	document.querySelector('#hosp_builder_little-loader').style.display = 'block';
//	setTimeout(function() { document.querySelector('#hosp_builder_little-loader p').style.display = 'block'; }, 10000);
}

RugBuilder.prototype.hideLittleLoader = function() {
	return true;
//	document.querySelector('#hosp_builder_little-loader').style.display = 'none';
//	document.querySelector('#hosp_builder_little-loader p').style.display = 'none';
}