class RugBuilder {

	constructor( context ) {

		// Context - Where the RugBuilder is being loaded. Determines how to load the data
		this.context = context;

		// Screen Dimensions
		this.screenWidth  = window.innerWidth;
		this.screenHeight = window.innerHeight;

		// App Progress - Keep track of what stage the user is at in the app
		this.currentStage = 0;
		this.stages       = [ 'center', 'borderType', 'innerBorder', 'outerBorder', 'size' ];
		this.stageVisited = [ true, false, false, false, false ];

		// React Drawer Scrolling - Keep track of the left/right drawer scrolling
		this.numOfPages = 1;

		// WC Data - Storage for all of the WooCommerce data
		this.WCmaterials         = [];
		this.WCcollections       = [];
		this.WCswatches          = {};
		this.WCborderMaterials   = [];
		this.WCBorderCollections = {};
		this.WCborderSwatches    = {};

		// Three.js - All the things for the Three.js rendering
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

		// JSON - Storage for the JSON rug models
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

		// User Choices - Store all of the user's choices
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

		this.centerID       = 0;
		this.singleBorderID = 0;
		this.innerBorderID  = 0;
		this.outerBorderID  = 0;

		this.length = 0;
		this.width  = 0;

		this.price = 0;

		// Errors
		this.errors = {
			100 : 'Material Loading Stage',
			101 : 'Collection Loading Stage',
			102 : 'Swatch Loading Stage',
			103 : 'Border Material Loading Stage',

			200 : 'Loading Single Border Into Three',
			201 : 'Loading Single & Piping Border Into Three',
			202 : 'Loading Double Border Into Three'
		}
	};

	// Go to the next stage

	nextStage() {
	
		// Work out the next stage number
		const NEXT_STAGE = this.currentStage + 1;

		// If trying to go to stage 5 or above return because there is no stage 5 or above
		if ( NEXT_STAGE > 4 ) {
			throw new Error( 'Cannot go higher than stage 4' );
			return;
		}

		// Check to see if the new stage has been visited before, if not mark the new stage as visited
		if ( !this.stageVisited[ NEXT_STAGE ] ) {
			this.stageVisited[ NEXT_STAGE ] = true;
		}

		// Save the new stage
		this.currentStage = NEXT_STAGE;

		// Publish the stageChange event so the drawer and progress menu can update
		PubSub.publish('stageChange', NEXT_STAGE);
	};

	// Go to the previous stage

	prevStage() {

		// Work out the previous stage number
		const PREV_STAGE = this.currentStage - 1;

		// If trying to go to stage -1 or below return because there is no stage 0 or below
		if ( PREV_STAGE < 0 ) {
			throw new Error( 'Cannot go lower than stage 0' );
			return;
		}

		// Save the new stage
		this.currentStage = PREV_STAGE;

		// Publish the stageChange event so the drawer and progress menu can update
		PubSub.publish('stageChange', PREV_STAGE);
	};

	// Go to a specific stage

	updateStage(stage) {

		// If trying to go to stage -1 and below or stage 5 and above return because there is no stage -1 and below or stage 5 and above
		if ( stage < 0 || stage > 4 ) {
			throw new Error( 'Stage must not be less than 0 or greater than 4' );
			return;
		}

		// Is the user allowed to visit the stage they are trying to go to? Assume no
		let stageValid = false;

		// If the new stage is simply the next stage, then yes
		if ( this.currentStage + 1 === stage ) {
			stageValid = true;
		}
		// If they have already visited the stage, then yes
		else if ( this.stageVisited[ stage ] ) {
			stageValid = true;
		}
		// If they have already the visited the stage before the new stage, then yes
		else if ( this.stageVisited[ stage - 1 ] ) {
			stageValid = true;
		}
		// If user has selected single or piping border type, is currently on stage 2 (inner border) and is trying to go stage 4 (rug size), then yes
		// as there is no need for stage 3, as there is no outer border with single/piping
		else if ( ( this.borderType === 'single' || this.borderType === 'piping' ) && this.currentStage === 2 && stage === 4 ) {
			stageValid = true;
		}

		// If the user is not allowed to visit the stage they have selected, return
		if ( !stageValid ) {
			return;
		}

		// Save the new stage
		this.currentStage = stage;

		// Publish the stageChange event so the drawer and progress menu can update
		PubSub.publish('stageChange', stage);
	};

	// Change the view of the rug

	changeView(currentView) {

		this.camera.zoom = 1;

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

	// Zoom in on the rug

	zoomIn(currentView) {

		const CURRENT_ZOOM = this.camera.zoom;
		const NEW_ZOOM     = CURRENT_ZOOM + 0.333333;

		if ( NEW_ZOOM > 3.33 ) {
			return;
		}

		this.camera.zoom = NEW_ZOOM;
		this.camera.updateProjectionMatrix();

		return true;
	};

	// Zoom out from the rug

	zoomOut(currentView) {

		const CURRENT_ZOOM = this.camera.zoom;
		const NEW_ZOOM     = CURRENT_ZOOM - 0.333333;

		if ( NEW_ZOOM < 0.66 ) {
			return;
		}

		this.camera.zoom = NEW_ZOOM;
		this.camera.updateProjectionMatrix();

		return true;
	};

	// Reset everything so user can start again

	startAgain() {

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

	// Calculate price of rug

	calculatePrice(LENGTH, WIDTH) {

		let totalPrice;

		// If the length/width is empty or 0, publish the newPrice event so the price can be updated to zero, and return
		if ( LENGTH === 0 || LENGTH === '' || WIDTH === 0 || WIDTH === '' ) {
			PubSub.publish('newPrice', 0);
			return;
		}

		// Get user's current center material choice
		const CURRENT_CENTER_MATERIAL = this.centerMaterial;

		// Get the price data for the user's current center material choice
		this.getPriceData(CURRENT_CENTER_MATERIAL)
			.then((price) => {

				// Work out the center area and how much that will cost
				const AREA         = LENGTH * WIDTH;
				const CENTER_PRICE = price * AREA;

				// Get the user's current border type choice
				const CURRENT_BORDER_TYPE = this.borderType;

				if ( CURRENT_BORDER_TYPE === 'single' || CURRENT_BORDER_TYPE === 'piping' ) {

					const CURRENT_BORDER_MATERIAL = this.borderMaterials[CURRENT_BORDER_TYPE];

					this.getPriceData(CURRENT_BORDER_MATERIAL)
						.then((price2) => {

							// Work out price of the border and add it to the price of the center
							totalPrice = CENTER_PRICE + price2; 

							// Publish the newPrice event so the price can be updated
							PubSub.publish('newPrice', totalPrice);

							// Save the user selected length and width, and the price
							this.length = LENGTH;
							this.width  = WIDTH;
							this.price  = totalPrice;

							return;
						})
						.catch(() => {
							R.error(1000, true)
						});

				}
				else if ( CURRENT_BORDER_TYPE === 'double' ) {

					const CURRENT_INNER_MATERIAL = this.borderMaterials.double.inner;
					const CURRENT_OUTER_MATERIAL = this.borderMaterials.double.outer;

					this.getPriceData(CURRENT_INNER_MATERIAL)
						.then((price2) => {
							return this.getPriceData(CURRENT_OUTER_MATERIAL);
						})
						.then((price3) => {

							// Work out price of the border and add it to the price of the center
							totalPrice = CENTER_PRICE + price2 + price3;

							// Publish the newPrice event so the price can be updated
							PubSub.publish('newPrice', totalPrice);

							// Save the user selected length and width, and the price
							this.length = LENGTH;
							this.width  = WIDTH;
							this.price  = totalPrice;

							return;
						})
						.catch(() => {
							R.error(1000, true)
						});
				}
			})
			.catch(() => {
				R.error(1000, true)
			});
	}
}