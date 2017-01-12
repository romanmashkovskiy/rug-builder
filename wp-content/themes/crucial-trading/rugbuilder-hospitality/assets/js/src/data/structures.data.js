RugBuilder.prototype.getStructuresData = function() {

	return new Promise((res, rej) => {

		const R = rugBuilder;

		for ( let i = 0; i < R.structureCodes.length; i++ ) {

			const STRUCTURE_CODE = R.structureCodes[i];
			const URL            = 'https://d105txpzekqrfa.cloudfront.net/hospitality/structures/' + STRUCTURE_CODE + '/base-colour.jpg';

			R.structureImages[STRUCTURE_CODE] = URL;
		}

		let counter = 0;

		setInterval(function() {

			if ( counter === 100 ) {
				// If 10 secs has passed, reject the promise
		//		rej();
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