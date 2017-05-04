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

				let url = R.apiUrl + 'price-data?material=' +
					encodeURIComponent(material);

				req.addEventListener( 'load', loaded );
				req.open( 'GET', url );
				req.send();

				break;
		}
	});

	return 20;
}
