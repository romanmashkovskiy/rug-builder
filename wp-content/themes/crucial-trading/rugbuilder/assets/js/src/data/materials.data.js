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
						rej(100);
					}

					if ( type === 'border' ) {
						R.WCborderMaterials = JSON.parse(this.response);
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

					let request = 'materials-data';

					if ( type === 'border' ) {
						R.loadingScreens('full', 'open');
						request = 'borders-data';
					}

					var url = R.apiUrl + request;

					req.addEventListener( 'load', loaded );
					req.open( 'GET', url);
					req.send();
				}

				request();

				break;
		}
	});
}
