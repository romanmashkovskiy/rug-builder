class RugBuilder {

	constructor( context ) {

		// Context
		this.context = context;

		// Site
		this.imageContainer = document.querySelector('#img-container');

		// Data
		this.structureCodes = [
//			'H1150',
//			'H1200',
//			'H2050',
//			'H2060',
//			'H2070',
//			'H2100',
//			'H2150',
//			'H2250',
//			'H2360',
//			'H2510',
			'H3150',
//			'H3750',
			'H4350'
		];
		this.structureColorCodes = {
			'H1150' : ['A1000', 'A4000', 'C4001', 'F7000'],
			'H1200' : ['A1000', 'A4000', 'C4001', 'F7000'],
			'H2050' : ['A1000', 'A4000', 'C4001', 'F7000'],
			'H2060' : ['A1000', 'A4000', 'C4001', 'F7000'],
			'H2070' : ['A1000', 'A4000', 'C4001', 'F7000'],
			'H2100' : ['A1000', 'A4000', 'C4001', 'F7000'],
			'H2150' : ['A1000', 'A4000', 'C4001', 'F7000'],
			'H2250' : ['A1000', 'A4000', 'C4001', 'F7000'],
			'H2360' : ['A1000', 'A4000', 'C4001', 'F7000'],
			'H2510' : ['A1000', 'A4000', 'C4001', 'F7000'],
			'H3150' : ['H70000', 'H70001', 'H70002', 'H70003', 'J4000', 'J7000'],
			'H3750' : ['A1000', 'A4000', 'C4001', 'F7000'],
			'H4350' : ['A1000', 'A4000', 'C4001', 'F7000']
		};
		this.numStructureColors = {
			'H1150' : 1,
			'H1200' : 1,
			'H2050' : 1,
			'H2060' : 1,
			'H2070' : 1,
			'H2100' : 1,
			'H2150' : 1,
			'H2250' : 1,
			'H2360' : 1,
			'H2510' : 1,
			'H3750' : 1,

			'H3150' : 2,

			'H4350' : 6
		};
		this.structureImages = {};

		// App Progress
		this.colorStage = 0;
		this.stageVisited = [ true, false, false, false, false, false, false, false, false, false ];
	};

	startAgain() {

		// Reset everything so user can start again

		this.colorStage = 0;
		this.stageVisited = [ true, false, false, false, false, false, false, false, false, false ];

		PubSub.publish('stageChange', 0);
		return;
	};
}