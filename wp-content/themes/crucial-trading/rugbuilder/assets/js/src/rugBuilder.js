class RugBuilder {

	constructor( context ) {

		// Context
		this.context = context;

		// WC Data
		this.materials   = [];
		this.collections = {};

		// Screen Dimensions
		this.screenWidth  = window.innerWidth;
		this.screenHeight = window.innerHeight;

		// App Progress
		this.currentStage = 0;
		this.stages       = [ 'center', 'borderType', 'innerBorder', 'outerBorder', 'size' ];
		this.stageVisited = [ true, false, false, false, false ];

		// Three.js
		this.renderer = undefined;
		this.scene    = undefined;

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

		this.lights = {
			ambientLight     : undefined,
			directionalLight : undefined,
			spotLight        : undefined
		};

		// JSON
		this.center = undefined;
		this.json = {
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

		// User Material Choices
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

		// React Components
		this.reactComponents = {};
	}

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
	}

	prevStage() {

		// Go to the previous stage

		const PREV_STAGE = this.currentStage - 1;

		if ( PREV_STAGE < 0 ) {
			throw new Error( 'Cannot go lower than stage 0' );
			return;
		}

		this.currentStage = PREV_STAGE;
	}

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

		if ( !stageValid ) {
			return;
		}

		this.currentStage = stage;
	}

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
	}
}