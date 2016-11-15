RugBuilder.prototype.getCollectionsData = function() {

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
						rej(1);
					}

					R.WCcollections = JSON.parse( this.response );
					res(true);
				}

				function request() {

					let req = new XMLHttpRequest();

					let urlBase = window.location.href;

					if ( urlBase[urlBase.length-1] === '#' ) {
						urlBase = urlBase.substr(0, urlBase.length-1);
					}

					req.addEventListener( 'load', loaded );
					req.open( 'GET', urlBase + '&request=collections' );
					req.send();
				}

				request();

				break;
		}
	});
}