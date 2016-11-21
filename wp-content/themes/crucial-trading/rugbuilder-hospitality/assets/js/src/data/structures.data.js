RugBuilder.prototype.getStructuresData = function() {

	return new Promise((res, rej) => {

		const R = rugBuilder;

		for ( let i = 0; i < R.structureCodes.length; i++ ) {

			const STRUCTURE_CODE = R.structureCodes[i];
			
			let url = templateDirectoryUri + '/rugbuilder-hospitality/assets/img/rugs/' + STRUCTURE_CODE + '/base.png';

			R.ajax('GET', url, structuresLoaded, 'arraybuffer');

			function structuresLoaded() {

				// Create a URL for the img

				const ARRAY_BUFFER_VIEW = new Uint8Array(this.response);
				const BLOB              = new Blob([ ARRAY_BUFFER_VIEW ], { type: "image/png" });
				const URL_CREATOR       = window.URL || window.webkitURL;
				const IMG_URL           = URL_CREATOR.createObjectURL(BLOB);

				R.structureImages[STRUCTURE_CODE] = IMG_URL;
			}
		}

		let counter = 0;

		setInterval(function() {

			if ( counter === 100 ) {
				// If 10 secs has passed, reject the promise
				rej();
			}

			const NUM_OF_STRUCTURES = R.structureCodes.length;

			let numStructuresLoaded = 0, key;

			for ( key in R.structureImages ) {
				if ( R.structureImages.hasOwnProperty(key) ) {
					numStructuresLoaded++;
				}
			}

			if ( NUM_OF_STRUCTURES === numStructuresLoaded ) {
				// If the number of structures loaded is equal to the number of structures, resolve
				res();
				return;
			}

			counter++;
		}, 100)
	});
}