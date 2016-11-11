RugBuilder.prototype.getMaterialsData = function(type) {

	// Get all of the materials, returning a promise

	return new Promise((res, rej) => {

		const R       = rugBuilder;
		const CONTEXT = R.context;

		switch ( CONTEXT ) {

			case 'website' :

				// On the website, send an XMLHttpRequest to get the data
				// then save it in R.materials

				function loaded() {
					
					if ( this.status !== 200 ) {
						rej(0);
					}

					if ( type === 'border' ) {
//						R.WCborderMaterials = JSON.parse(this.response);
						R.WCborderMaterials = [
							{
								name: 'Cotton',
								thumb: 'http://d105txpzekqrfa.cloudfront.net/uploads/2016/11/11174335/cotton-icon.svg'
							},
							{
								name: 'Leather',
								thumb: 'http://d105txpzekqrfa.cloudfront.net/uploads/2016/11/11174333/leather-icon.svg'
							},
							{
								name: 'Linen',
								thumb: 'http://d105txpzekqrfa.cloudfront.net/uploads/2016/11/11174343/linen-icon.svg'
							},
							{
								name: 'Suede',
								thumb: 'http://d105txpzekqrfa.cloudfront.net/uploads/2016/11/11174422/suede-icon.svg'
							},
						];
					}
					else {
						R.WCmaterials = JSON.parse(this.response);
					}

					res(true);
				}

				function request() {

					let req = new XMLHttpRequest();

					let urlBase = window.location.href;

					if ( urlBase[urlBase.length-1] === '#' ) {
						urlBase = urlBase.substr(0, urlBase.length-1);
					}

					let request = 'materials';

					if ( type === 'border' ) {
						request = 'border'
					}

					req.addEventListener( 'load', loaded );
					req.open( 'GET', urlBase + '?request=' + request );
					req.send();
				}

				request();

				break;
		}
	});
}