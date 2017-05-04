RugBuilder.prototype.getPriceData = function(material) {

	return new Promise((res, rej) => {

		const R       = rugBuilder;
		const CONTEXT = R.context;

		switch ( CONTEXT ) {

			case 'website' :

				function loaded() {

					if ( this.status != 200 ) {
						rej();
						return;
					}

					res(JSON.parse(this.response));
				}

				let req = new XMLHttpRequest();

				let urlBase = window.location.href;

				if ( urlBase[urlBase.length-1] === '#' ) {
					urlBase = urlBase.substr(0, urlBase.length-1);
				}


				// let url = urlBase + '?request=price&material=' + encodeURIComponent(material);
				let url = 'http://localhost:8888/crucial-trading/wp-json/api/v1/price-data?material=' +
					encodeURIComponent(material);

				console.log('price data request');
				console.log('url -->');
				console.log(url);

				req.addEventListener( 'load', loaded );
				req.open( 'GET', url );
				req.send();

				break;
		}
	});

	return 20;
}
