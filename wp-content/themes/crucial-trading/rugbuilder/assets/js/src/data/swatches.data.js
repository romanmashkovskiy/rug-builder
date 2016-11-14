RugBuilder.prototype.getSwatchData = function(collection) {

	// Get the swatches for the chosen collection, returns a promise

	return new Promise((res, rej) => {

		const R       = rugBuilder;
		const CONTEXT = R.context;

		switch ( CONTEXT ) {

			case 'website' :

				// On the website, send an XMLHttpRequest to get the data
				// and resolve the promise with the data

				function loaded() {
					
					if ( this.status !== 200 ) {
						rej(0);
					}

					R.WCswatches = JSON.parse( this.response );
					res(JSON.parse( this.response ));
				}

				function request() {

					let req = new XMLHttpRequest();

					let urlBase = window.location.href;

					if ( urlBase[urlBase.length-1] === '#' ) {
						urlBase = urlBase.substr(0, urlBase.length-1);
					}

					let search = collection.toLowerCase();

					req.addEventListener( 'load', loaded );
					req.open( 'GET', urlBase + '&request=swatches&collection=' + search );
					req.send();
				}

				request();

				break;
		}
	});
}