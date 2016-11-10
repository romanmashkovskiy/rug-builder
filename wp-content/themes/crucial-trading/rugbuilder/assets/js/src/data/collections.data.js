RugBuilder.prototype.getCollectionsData = function() {

	return new Promise((res, rej) => {

		const R       = rugBuilder;
		const CONTEXT = R.context;

		switch ( CONTEXT ) {

			case 'website' :

				function loaded() {
					
					if ( this.status !== 200 ) {
						rej(1);
					}

					R.collections = JSON.parse( this.response );
					res(true);
				}

				function request() {

					let req = new XMLHttpRequest();

					req.addEventListener( 'load', loaded );
					req.open( 'GET', 'http://localhost:8888/crucial-trading/rugbuilder/?request=collections' );
					req.send();
				}

				request();

				break;
		}
	});
}