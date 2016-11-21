RugBuilder.prototype.getPriceData = function(material) {

	return new Promise((res, rej) => {

		const R       = rugBuilder;
		const CONTEXT = R.context;

		switch ( CONTEXT ) {

			case 'website' :

				function loaded() {
					console.log(this)
				}

				let req = new XMLHttpRequest();

				let urlBase = window.location.href;

				if ( urlBase[urlBase.length-1] === '#' ) {
					urlBase = urlBase.substr(0, urlBase.length-1);
				}

				let url = urlBase + '?request=price&material=' + encodeURIComponent(material);

				req.addEventListener( 'load', loaded );
				req.open( 'GET', url );
				req.send();

				break;
		}
	});

	return 20;
}