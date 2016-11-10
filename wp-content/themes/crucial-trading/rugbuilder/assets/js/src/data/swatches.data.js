RugBuilder.prototype.getSwatchData = function(collection) {

	return new Promise((res, rej) => {

		const R       = rugBuilder;
		const CONTEXT = R.context;

		switch ( CONTEXT ) {

			case 'website' :

				function loaded() {
					
					if ( this.status !== 200 ) {
						rej(0);
					}

					R.swatches = JSON.parse( this.response );
					res(JSON.parse( this.response ));
				}

				function request() {

					let req = new XMLHttpRequest();

					req.addEventListener( 'load', loaded );
					req.open( 'GET', 'http://localhost:8888/crucial-trading/rugbuilder/?request=swatches&collection=' + collection );
					req.send();
				}

				request();

				break;
		}
	});
}