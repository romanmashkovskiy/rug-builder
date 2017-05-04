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

					let json = JSON.parse( this.response );

					for ( let prop in json ) {
						R.WCswatches[prop] = json[prop];
					}

					res(JSON.parse( this.response ));
				}

				function request() {
					let req = new XMLHttpRequest();

					let urlBase = window.location.href;

					if ( urlBase[urlBase.length-1] === '#' ) {
						urlBase = urlBase.substr(0, urlBase.length-1);
					}

					let search = collection.toLowerCase();
					// var url = urlBase + '?request=swatches&collection=' + search;
					let url = 'http://localhost:8888/crucial-trading/wp-json/api/v1/swatches-data?collection=' + search;

					console.log('swatches request -->');
					console.log(url);

					req.addEventListener( 'load', loaded );
					req.open( 'GET', url );
					req.send();
				}

				request();

				break;
		}
	});
}
