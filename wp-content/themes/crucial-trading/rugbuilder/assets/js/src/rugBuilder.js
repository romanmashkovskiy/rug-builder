class RugBuilder {

	constructor( context ) {

		// Context
		this.context = context;

		// Screen Dimensions
		this.screenWidth  = window.innerWidth;
		this.screenHeight = window.innerHeight;

		// App Progress
		this.currentStage = 0;
		this.stages       = [ 'center', 'borderType', 'innerBorder', 'outerBorder', 'size' ];
		this.stageVisited = [ true, false, false, false, false ];

		// WC Data
		this.WCmaterials       = [];
		this.WCcollections     = [];
		this.WCswatches        = {};
		this.WCborderMaterials = [];
		this.WCborderSwatches  = {};

		// Three.js
		this.scene    = undefined;
		this.renderer = undefined;

		this.camera        = undefined;
		this.cameraOptions = {
			aspectRatio : this.screenWidth / this.screenHeight,
			far         : 1000,
			near        : 0.1,
			viewAngle   : 90
		};

		this.helpers = {
			axis      : undefined,
			grid      : undefined,
			spotLight : undefined
		};

		this.lights = {};

		this.orbitControls = undefined;

		// JSON
		this.json = {
			single : {
				'border-east'  : undefined,
				'border-north' : undefined,
				'border-south' : undefined,
				'border-west'  : undefined,
				'center'       : undefined,
				'stitches'     : undefined
			},
			double : {
				'border-inner-east'  : undefined,
				'border-inner-north' : undefined,
				'border-inner-south' : undefined,
				'border-inner-west'  : undefined,
				'border-outer-east'  : undefined,
				'border-outer-north' : undefined,
				'border-outer-south' : undefined,
				'border-outer-west'  : undefined,
				'center'             : undefined,
				'stitches'           : undefined
			},
			piping : {
				'center'       : undefined,
				'border-east'  : undefined,
				'border-north' : undefined,
				'border-south' : undefined,
				'border-west'  : undefined,
				'stitches'     : undefined,
				'trim-east'    : undefined,
				'trim-north'   : undefined,
				'trim-south'   : undefined,
				'trim-west'    : undefined
			}
		};

		// User Choices
		this.loadedTextures  = {};

		this.borderType      = undefined;
		this.centerMaterial  = undefined;
		this.borderMaterials = {
			single : undefined,
			piping : undefined,
			double : {
				inner : undefined,
				outer : undefined
			}
		};

		// React Components
		this.reactComponents = {};
	};

	nextStage() {

		// Go to the next stage

		const NEXT_STAGE = this.currentStage + 1;

		if ( NEXT_STAGE > 4 ) {
			throw new Error( 'Cannot go higher than stage 4' );
			return;
		}

		if ( !this.stageVisited[ NEXT_STAGE ] ) {
			this.stageVisited[ NEXT_STAGE ] = true;
		}

		this.currentStage = NEXT_STAGE;

		PubSub.publish('stageChange', NEXT_STAGE);
	};

	prevStage() {

		// Go to the previous stage

		const PREV_STAGE = this.currentStage - 1;

		if ( PREV_STAGE < 0 ) {
			throw new Error( 'Cannot go lower than stage 0' );
			return;
		}

		this.currentStage = PREV_STAGE;

		PubSub.publish('stageChange', PREV_STAGE);
	};

	updateStage(stage) {

		// Go to a specific stage

		if ( stage < 0 || stage > 4 ) {
			throw new Error( 'Stage must not be less than 0 or greater than 4' );
			return;
		}

		let stageValid = false;

		if ( this.currentStage + 1 === stage ) {
			stageValid = true;
		}
		else if ( this.stageVisited[ stage ] ) {
			stageValid = true;
		}
		else if ( this.stageVisited[ stage - 1 ] ) {
			stageValid = true;
		}
		else if ( ( this.borderType === 'single' || this.borderType === 'piping' ) && this.currentStage === 2 && stage === 4 ) {
			stageValid = true;
		}

		if ( !stageValid ) {
			return;
		}

		this.currentStage = stage;

		PubSub.publish('stageChange', stage);
	};

	changeView(currentView) {

		// Change the view of the rug

		if ( currentView === 0 ) {

			// Change to above horizontal

			this.camera.position.x = -40;
			this.camera.position.y = 170;
			this.camera.position.z = 0;

			this.camera.rotation.x = -1.5708;
			this.camera.rotation.y = 0;
			this.camera.rotation.z = 1.5708;

			return 1;
		}
		else if ( currentView === 1 ) {

			// Change to angled view

			this.camera.position.x = 70;
			this.camera.position.y = 97.86732004062627;
			this.camera.position.z = 108.5265830159921;

			this.camera.rotation.x = -0.7337987907741792;
			this.camera.rotation.y = 0.47612198934967903;
			this.camera.rotation.z = 0.3919353811096299;

			return 2;
		}
		else if ( currentView === 2 ) {

			// Change to angled-horizontal

			this.camera.position.x = -65;
			this.camera.position.y = 146.97868270469004;
			this.camera.position.z = 0.00630814379798243;

			this.camera.rotation.x = -1.5707534317349763;
			this.camera.rotation.y = -0.5996570925812806;
			this.camera.rotation.z = -1.5707203029033585;

			return 3;
		}
		else if ( currentView === 3 ) {

			// Change to above vertical

			this.camera.position.x = 0;
			this.camera.position.y = 170;
			this.camera.position.z = -55;

			this.camera.rotation.x = -1.5708;
			this.camera.rotation.y = 0;
			this.camera.rotation.z = 0;

			return 0;
		}
	};

	zoomIn(currentView, currentZoom) {

		// Zoom in on the rug

		const ZOOM_LEVEL = currentZoom + 1;

		if ( ZOOM_LEVEL > 6 ){
			// If trying to zoom in to more than zoom level 6, return as that is the max zoom
			return false;
		}

		if ( currentView === 0 || currentView === 1 ) {

			// If either above view, simply subtract 30 from the camera's Y position

			const CURRENT_Y = this.camera.position.y;
			const ZOOM_Y    = CURRENT_Y - 30;

			this.camera.position.y = ZOOM_Y;
		}
		else if ( currentView === 2 ) {

			// If angled view, subtract 15 to X, Y, and Z

			const CURRENT_X = this.camera.position.x;
			const CURRENT_Y = this.camera.position.y;
			const CURRENT_Z = this.camera.position.z;

			const ZOOM_X = CURRENT_X - 15;
			const ZOOM_Y = CURRENT_Y - 15;
			const ZOOM_Z = CURRENT_Z - 15;

			this.camera.position.x = ZOOM_X;
			this.camera.position.y = ZOOM_Y;
			this.camera.position.z = ZOOM_Z;
		}
		else if ( currentView === 3 ) {

			// If angled horizontal view, add 15 to X, subtract 15 from Y

			const CURRENT_X = this.camera.position.x;
			const CURRENT_Y = this.camera.position.y;

			const ZOOM_X = CURRENT_X + 15;
			const ZOOM_Y = CURRENT_Y - 15;

			this.camera.position.x = ZOOM_X;
			this.camera.position.y = ZOOM_Y;
		}

		return ZOOM_LEVEL;
	};

	zoomOut(currentView, currentZoom) {

		// Zoom out from the rug

		const ZOOM_LEVEL = currentZoom - 1;

		if ( ZOOM_LEVEL < 0 ) {
			// If trying to zoom out to less than zoom level 0, return as that is the min zoom
			return false;
		}

		if ( currentView === 0 || currentView === 1 ) {

			// If either above view, simply add 30 to the camera's Y position

			const CURRENT_Y = this.camera.position.y;
			const ZOOM_Y    = CURRENT_Y + 30;

			this.camera.position.y = ZOOM_Y;
		}
		else if ( currentView === 2 ) {

			// If angled view, add 15 to X, Y, and Z

			const CURRENT_X = this.camera.position.x;
			const CURRENT_Y = this.camera.position.y;
			const CURRENT_Z = this.camera.position.z;

			const ZOOM_X = CURRENT_X + 15;
			const ZOOM_Y = CURRENT_Y + 15;
			const ZOOM_Z = CURRENT_Z + 15;

			this.camera.position.x = ZOOM_X;
			this.camera.position.y = ZOOM_Y;
			this.camera.position.z = ZOOM_Z;
		}
		else if ( currentView === 3 ) {

			// If angled horizontal view, subtract 15 from X, add 15 to Y

			const CURRENT_X = this.camera.position.x;
			const CURRENT_Y = this.camera.position.y;

			const ZOOM_X = CURRENT_X - 15;
			const ZOOM_Y = CURRENT_Y + 15;

			this.camera.position.x = ZOOM_X;
			this.camera.position.y = ZOOM_Y;
		}

		return ZOOM_LEVEL;
	};

	startAgain() {

		// Reset everything so user can start again

		this.currentStage = 0;
		this.stageVisited = [ true, false, false, false, false ];
		this.json         = {
			single : {
				borderEast  : undefined,
				borderNorth : undefined,
				borderSouth : undefined,
				borderWest  : undefined,
				center      : undefined,
				stitches    : undefined
			},
			double : {
				center           : undefined,
				innerBorderEast  : undefined,
				innerBorderNorth : undefined,
				innerBorderSouth : undefined,
				innerBorderWest  : undefined,
				outerBorderEast  : undefined,
				outerBorderNorth : undefined,
				outerBorderSouth : undefined,
				outerBorderWest  : undefined,
				stitches         : undefined
			},
			piping : {
				center           : undefined,
				innerBorderEast  : undefined,
				innerBorderNorth : undefined,
				innerBorderSouth : undefined,
				innerBorderWest  : undefined,
				outerBorderEast  : undefined,
				outerBorderNorth : undefined,
				outerBorderSouth : undefined,
				outerBorderWest  : undefined,
				stitches         : undefined
			}
		};
		this.centerMaterial = undefined;
		this.loadedTextures = {};
		this.materialChoice = {
			single : {
				border   : undefined,
				center   : undefined,
				stitches : undefined
			},
			double : {
				center      : undefined,
				innerBorder : undefined,
				outerBorder : undefined,
				stitches    : undefined
			},
			piping : {
				center      : undefined,
				innerBorder : undefined,
				outerBorder : undefined,
				stitches    : undefined
			}
		};

		PubSub.publish('stageChange', 0);
		return;
	};

	calculatePrice(LENGTH, WIDTH) {

		let totalPrice;

		if ( LENGTH === 0 || LENGTH === '' || WIDTH === 0 || WIDTH === '' ) {
			PubSub.publish('newPrice', 0);
			return;
		}

		const CURRENT_CENTER_MATERIAL = this.centerMaterial;
		const CENTER_PRICE_PER_m2     = this.getPriceData(CURRENT_CENTER_MATERIAL);
		const AREA                    = LENGTH * WIDTH;
		const CENTER_PRICE            = CENTER_PRICE_PER_m2 * AREA;

		const CURRENT_BORDER_TYPE     = this.borderType;

		if ( CURRENT_BORDER_TYPE === 'single' || CURRENT_BORDER_TYPE === 'piping' ) {

			const CURRENT_BORDER_MATERIAL = this.borderMaterials[CURRENT_BORDER_TYPE];
			const BORDER_PRICE_PER_m2     = this.getPriceData(CURRENT_BORDER_MATERIAL);

			const BORDER_PRICE = 0;

			totalPrice = CENTER_PRICE + BORDER_PRICE;
		}
		else if ( CURRENT_BORDER_TYPE === 'double' ) {

			const CURRENT_INNER_MATERIAL = this.borderMaterials.double.inner;
			const CURRENT_OUTER_MATERIAL = this.borderMaterials.double.outer;

			const INNER_PRICE_PER_m2 = this.getPriceData(CURRENT_INNER_MATERIAL);
			const OUTER_PRICE_PER_m2 = this.getPriceData(CURRENT_OUTER_MATERIAL);

			const INNER_PRICE = 0;
			const OUTER_PRICE = 0;

			totalPrice = CENTER_PRICE + INNER_PRICE + OUTER_PRICE;
		}

		PubSub.publish('newPrice', totalPrice);
		return;
	}
}







