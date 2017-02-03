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
		this.WCpiping            = {};

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
			single  : undefined,
			piping : {
				inner  : undefined,
				piping : undefined
			},
			double  : {
				inner : undefined,
				outer : undefined
			}
		};

		this.centerID       = 0;
		this.singleBorderID = 0;
		this.pipingID       = 0;
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
		// Jump straight to border from center as can assume Single border is picked
		else if ( this.currentStage === 0 && stage === 2 ) {
			stageValid = true;
		}
		// If going from border (2) to rug size (4) as there is no stage 3 (piping/outer) with single border
		else if ( this.borderType === 'single' && this.currentStage === 2 && stage === 4 ) {
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
		this.camera.updateProjectionMatrix();

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

//		if ( NEW_ZOOM > 3.33 ) {
//			return;
//		}

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
		this.loadedTextures = {};
		this.borderType      = undefined;
		this.centerMaterial  = undefined;
		this.borderMaterials = {
			single  : undefined,
			piping : {
				inner  : undefined,
				piping : undefined
			},
			double  : {
				inner : undefined,
				outer : undefined
			}
		};

		this.centerID       = 0;
		this.singleBorderID = 0;
		this.pipingID       = 0;
		this.innerBorderID  = 0;
		this.outerBorderID  = 0;

		this.length = 0;
		this.width  = 0;

		this.price = 0;

		this.camera.position.x = 0;
		this.camera.position.y = 170;
		this.camera.position.z = -55;

		this.camera.rotation.x = -1.5708;
		this.camera.rotation.y = 0;
		this.camera.rotation.z = 0;

		this.camera.zoom = 1;

		this.camera.updateProjectionMatrix();

		PubSub.publish('stageChange', 0);
		PubSub.publish('newPrice', [0, 0, 0]);
		return;
	};

	// Calculate price of rug

	calculatePrice(LENGTH, WIDTH) {

		const R = rugBuilder;

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
				let BORDER_PRICE;

				const BORDER_TYPE = R.borderType;

				let INNER_BORDER = false;
				let PIPING       = false;
				let OUTER_BORDER = false;

				switch ( BORDER_TYPE ) {

					case 'single' :
						let single_choice = R.borderMaterials.single.split(' ').join('');
						INNER_BORDER      = R.WCswatches[single_choice];
						break;
//
					case 'piping' :
						let border_choice = R.borderMaterials.piping.inner.split(' ').join('');
						let piping_choice = R.borderMaterials.piping.piping;
						INNER_BORDER      = R.WCswatches[border_choice];

						for ( let i = 0; i < R.WCpiping.length; i++ ) {
							if ( piping_choice === R.WCpiping[i].post_title ) {
								PIPING = R.WCpiping[i];
								break;
							}
						}

						break;

					case 'double' :
						let inner_choice = R.borderMaterials.double.inner.split(' ').join('');
						let outer_choice = R.borderMaterials.double.outer.split(' ').join('');
						INNER_BORDER     = R.WCswatches[inner_choice];
						OUTER_BORDER     = R.WCswatches[outer_choice];
						break
				}

				if ( BORDER_TYPE === 'single' ) {

					let s_singleBorderMaterial, s_singleBorderPrice = 0;

					for ( let i = 0; i < INNER_BORDER.cats.length; i++ ) {

						if ( INNER_BORDER.cats[i].parent === 487 ) {
							s_singleBorderMaterial = INNER_BORDER.cats[i].slug;
							break;
						}

					}

					if ( s_singleBorderMaterial === 'cotton' || s_singleBorderMaterial === 'linen' ) {
						s_singleBorderPrice = 17;
					} else if ( s_singleBorderMaterial === 'leather' || s_singleBorderMaterial === 'suede' ) {
						s_singleBorderPrice = 38;
					}

					BORDER_PRICE = s_singleBorderPrice * ((LENGTH * 2) + (WIDTH * 2));

				} else if ( BORDER_TYPE === 'piping' ) {

					let p_singleBorderMaterial, p_singleBorderPrice = 0;

					for ( let i = 0; i < INNER_BORDER.cats.length; i++ ) {

						if ( INNER_BORDER.cats[i].parent === 487 ) {
							p_singleBorderMaterial = INNER_BORDER.cats[i].slug;
							break;
						}

					}

					if ( p_singleBorderMaterial === 'cotton' || p_singleBorderMaterial === 'linen' ) {
						p_singleBorderPrice = 25;
					} else if ( p_singleBorderMaterial === 'leather' || p_singleBorderMaterial === 'suede' ) {
						p_singleBorderPrice = 50;
					}

					let outerBorderPrice = p_singleBorderPrice * ((LENGTH * 2) + (WIDTH * 2));

					// have PIPING the obj that contains the piping but no idea if needed or not
					// For now assume £0 per m2 and times by perimeter and add to actual border price

					let pipingPrice      = 0 * ((LENGTH * 2) + (WIDTH * 2));

					BORDER_PRICE = outerBorderPrice + pipingPrice;

				} else if ( BORDER_TYPE === 'double' ) {

					let innerBorderMaterial, outerBorderMaterial;

					for ( let i = 0; i < INNER_BORDER.cats.length; i++ ) {

						if ( INNER_BORDER.cats[i].parent === 487 ) {
							innerBorderMaterial = INNER_BORDER.cats[i].slug;
							break;
						}

					}

					for ( let i = 0; i < OUTER_BORDER.cats.length; i++ ) {

						if ( OUTER_BORDER.cats[i].parent === 487 ) {
							outerBorderMaterial = OUTER_BORDER.cats[i].slug;
							break;
						}

					}

					let basePrice;

					switch ( innerBorderMaterial ) {

						case 'cotton' :

							if ( outerBorderMaterial === 'cotton' ) {
								basePrice = 25;
							} else if ( outerBorderMaterial === 'linen' ) {
								basePrice = 25;
							} else if ( outerBorderMaterial === 'suede' ) {
								basePrice = 50;
							} else if ( outerBorderMaterial === 'leather' ) {
								basePrice = 50;
							}

							break;

						case 'linen' :

							if ( outerBorderMaterial === 'cotton' ) {
								basePrice = 25;
							} else if ( outerBorderMaterial === 'linen' ) {
								basePrice = 25;
							} else if ( outerBorderMaterial === 'suede' ) {
								basePrice = 50;
							} else if ( outerBorderMaterial === 'leather' ) {
								basePrice = 50;
							}

							break;

						case 'leather' :

							if ( outerBorderMaterial === 'cotton' ) {
								basePrice = 50;
							} else if ( outerBorderMaterial === 'linen' ) {
								basePrice = 50;
							} else if ( outerBorderMaterial === 'suede' ) {
								basePrice = 60;
							} else if ( outerBorderMaterial === 'leather' ) {
								basePrice = 60;
							}

							break;

						case 'suede' :

							if ( outerBorderMaterial === 'cotton' ) {
								basePrice = 50;
							} else if ( outerBorderMaterial === 'linen' ) {
								basePrice = 50;
							} else if ( outerBorderMaterial === 'suede' ) {
								basePrice = 60;
							} else if ( outerBorderMaterial === 'leather' ) {
								basePrice = 60;
							}

							break;

					}

					BORDER_PRICE = basePrice * ((LENGTH * 2) + (WIDTH * 2));

				}

				const TOTAL_PRICE = CENTER_PRICE + BORDER_PRICE;

				// Publish the newPrice event so the price can be updated
				PubSub.publish('newPrice', [TOTAL_PRICE, LENGTH, WIDTH]);

				// Save the user selected length and width, and the price
				this.length = LENGTH;
				this.width  = WIDTH;
				this.price  = TOTAL_PRICE;
			})
			.catch(() => {
				R.error(1000, true)
			});
	}
}