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
					// console.log('collections data loaded 12345');

					if ( this.status !== 200 ) {
						// console.log('rejected');
						rej(101);
					}

					if ( !collection ) {
						// console.log('not collection');
						R.WCcollections = JSON.parse( this.response );
					}
					else {
						// console.log('else');
						R.WCBorderCollections[collection] = JSON.parse(this.response);
					}

					// console.log('looking at collections.data response --->');
					// console.log(this.response);
					res(JSON.parse(this.response));
				}

				function request() {
					// console.log('collections.data request()');

					let req = new XMLHttpRequest();

					let urlBase = window.location.href;

					if ( urlBase[urlBase.length-1] === '#' ) {
						urlBase = urlBase.substr(0, urlBase.length-1);
					}

					let url = urlBase + '?request=collections';

					if ( collection ) {
						url += '&collection=' + collection;
					}

					// console.log('making request to seperate API -->');
					url = 'http://localhost:3000/collections-data';
					console.log('collections url -->');
					console.log(url);
					// console.log('url ==>');
					// console.log(url);

					req.addEventListener( 'load', loaded );
					req.open( 'GET', url );
					req.send();
				}

				// console.log('sending request');
				request();

				break;
		}
	});
}
