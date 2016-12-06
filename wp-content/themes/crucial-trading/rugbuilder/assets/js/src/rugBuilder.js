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

		// React Drawer Scrolling
		this.numOfPages = 1;

		// WC Data
		this.WCmaterials         = [];
		this.WCcollections       = [];
		this.WCswatches          = {};
		this.WCborderMaterials   = [];
		this.WCBorderCollections = {};
		this.WCborderSwatches    = {};

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

	zoomIn(currentView) {

		// Zoom in on the rug

		const CURRENT_ZOOM_X = this.camera.position.x;
		const CURRENT_ZOOM_Y = this.camera.position.y;
		const CURRENT_ZOOM_Z = this.camera.position.z;

		let maxZoomX, maxZoomY, maxZoomZ, newZoomX, newZoomY, newZoomZ, valid = true;

		if ( currentView === 0 || currentView === 1 ) {
			maxZoomX = 0;
			maxZoomY = 20;
			maxZoomZ = 0;

			newZoomX = 0;
			newZoomY = CURRENT_ZOOM_Y - 30;
			newZoomZ = 0;

			if ( newZoomY < maxZoomY ) {
				valid = false;
			}
		}
		else if ( currentView === 2 ) {
			maxZoomX = -5;
			maxZoomY = 22.8673200406;
			maxZoomZ = 33.526583016;

			newZoomX = CURRENT_ZOOM_X - 15;
			newZoomY = CURRENT_ZOOM_Y - 15;
			newZoomZ = CURRENT_ZOOM_Z - 15;

			if ( ( newZoomX < maxZoomX ) || ( newZoomY < maxZoomY ) || ( newZoomZ < maxZoomZ ) ) {
				valid = false;
			}
		}
		else if ( currentView === 3 ) {
			maxZoomX = 10;
			maxZoomY = 71.9786827047;
			maxZoomZ = 0;

			newZoomX = CURRENT_ZOOM_X + 15;
			newZoomY = CURRENT_ZOOM_Y - 15;
			newZoomZ = 0;

			if ( ( newZoomX > maxZoomX ) || ( newZoomY < maxZoomY ) ) {
				valid = false;
			}
		}

		if ( !valid ) {
			return false;
		}

		this.camera.position.x = newZoomX;
		this.camera.position.y = newZoomY;
		this.camera.position.z = newZoomZ;

		return true;
	};

	zoomOut(currentView) {

		// Zoom out from the rug - this method should work but needs testing first,plus the actual numbers inputting

		const CURRENT_ZOOM_X = this.camera.position.x;
		const CURRENT_ZOOM_Y = this.camera.position.y;
		const CURRENT_ZOOM_Z = this.camera.position.z;
		
		let maxZoomX, maxZoomY, maxZoomZ, newZoomX, newZoomY, newZoomZ, valid = true;

		if ( currentView === 0 || currentView === 1 ) {
			maxZoomX = 0;
			maxZoomY = 200;
			maxZoomZ = 0;

			newZoomX = 0;
			newZoomY = CURRENT_ZOOM_Y + 30;
			newZoomZ = 0;

			if ( newZoomY > maxZoomY ) {
				valid = false;
			}
		}
		else if ( currentView === 2 ) {
			maxZoomX = 85;
			maxZoomY = 112.8673200406;
			maxZoomZ = 123.526583016;

			newZoomX = CURRENT_ZOOM_X + 15;
			newZoomY = CURRENT_ZOOM_Y + 15;
			newZoomZ = CURRENT_ZOOM_Z + 15;

			if ( ( newZoomX > maxZoomX ) || ( newZoomY > maxZoomY ) || ( newZoomZ > maxZoomZ ) ) {
				valid = false;
			}
		}
		else if ( currentView === 3 ) {
			maxZoomX = -80;
			maxZoomY = 161.9786827047;
			maxZoomZ = 0;

			newZoomX = CURRENT_ZOOM_X - 15;
			newZoomY = CURRENT_ZOOM_Y + 15;
			newZoomZ = 0;

			if ( ( newZoomX < maxZoomX ) || ( newZoomY > maxZoomY ) ) {
				valid = false;
			}
		}

		if ( !valid ) {
			return false;
		}

		this.camera.position.x = newZoomX;
		this.camera.position.y = newZoomY;
		this.camera.position.z = newZoomZ;

		return true;
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

		const CURRENT_CENTER_MATERIAL = this.centerMaterial;+

		this.getPriceData(CURRENT_CENTER_MATERIAL)
			.then((price) => {

				const AREA         = LENGTH * WIDTH;
				const CENTER_PRICE = price * AREA;

				const CURRENT_BORDER_TYPE = this.borderType;

				if ( CURRENT_BORDER_TYPE === 'single' || CURRENT_BORDER_TYPE === 'piping' ) {

					const CURRENT_BORDER_MATERIAL = this.borderMaterials[CURRENT_BORDER_TYPE];

					this.getPriceData(CURRENT_BORDER_MATERIAL)
						.then((price2) => {
							totalPrice = CENTER_PRICE + price2; 
							PubSub.publish('newPrice', totalPrice);

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
							totalPrice = CENTER_PRICE + price2 + price3;
							PubSub.publish('newPrice', totalPrice);

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







