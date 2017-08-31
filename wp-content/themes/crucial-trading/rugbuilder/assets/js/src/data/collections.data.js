RugBuilder.prototype.getCollectionsData = function(collection) {

	// Get all of the collections, returning a promise

	return new Promise((res, rej) => {

		const R       = rugBuilder;
		const CONTEXT = R.context;

		switch ( CONTEXT ) {

			case 'website' :

				// On the website, send an XMLHttpRequest to get the data
				// then save it in R.collections

				function loaded() {
					if ( this.status !== 200 ) {
						rej(101);
					}

					if ( !collection ) {
						R.WCcollections = JSON.parse( this.response );
					}
					else {
						R.WCBorderCollections[collection] = JSON.parse(this.response);
					}
					
					res(JSON.parse(this.response));
				}

				function request() {

					let req = new XMLHttpRequest();

					let urlBase = window.location.href;

					if ( urlBase[urlBase.length-1] === '#' ) {
						urlBase = urlBase.substr(0, urlBase.length-1);
					}

					let url = urlBase + '?request=collections';

					if ( collection ) {
						url += '&collection=' + collection;
					}

					req.addEventListener( 'load', loaded );
					req.open( 'GET', url );
					req.send();
				}

				request();

				break;
		}
	});
}
