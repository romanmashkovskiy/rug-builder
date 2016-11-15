RugBuilder.prototype.getMaterialsData = function(type) {

	// Get all of the materials, returning a promise

	return new Promise((res, rej) => {

		const R       = rugBuilder;
		const CONTEXT = R.context;

		switch ( CONTEXT ) {

			case 'website' :

				// On the website, send an XMLHttpRequest to get the data
				// then save it in R.materials

				function loaded() {
					
					if ( this.status !== 200 ) {
						rej(0);
					}

					if ( type === 'border' ) {
						R.WCborderMaterials = JSON.parse(this.response);
						R.loadingScreens('full', 'close');
					}
					else {
						R.WCmaterials = JSON.parse(this.response);
					}

					res(true);
				}

				function request() {

					let req = new XMLHttpRequest();

					let urlBase = window.location.href;

					if ( urlBase[urlBase.length-1] === '#' ) {
						urlBase = urlBase.substr(0, urlBase.length-1);
					}

					let request = 'materials';

					if ( type === 'border' ) {
						R.loadingScreens('full', 'open');
						request = 'border'
					}

					req.addEventListener( 'load', loaded );
					req.open( 'GET', urlBase + '&request=' + request );
					req.send();
				}

				request();

				break;
		}
	});
}