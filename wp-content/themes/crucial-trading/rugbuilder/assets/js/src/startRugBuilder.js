RugBuilder.prototype.start = function() {

	window.onerror = function(message, source, line, col, error) {

		let err_obj = {
			msg  : message,
			src  : source,
			line : line,
			col  : col,
			err  : error
		}

		console.log(err_obj)

		R.error(1000, err_obj, true);
	}

	const R = rugBuilder;

	// Load Progress Menu Component                                                         ./components/progress-menu/*.component.js
	const BtnExitComponent    = R.btnExitComponent();
	const BtnRestartComponent = R.btnRestartComponent();
	const BtnStageComponent   = R.btnStageComponent();
	R.menuComponent(BtnExitComponent, BtnRestartComponent, BtnStageComponent);

	// Check for WebGL	

	if ( !window.WebGLRenderingContext ) {
		R.showWebGLError(false);
		return;
	}

	let canvas = document.createElement('canvas');
	let webgl  = canvas.getContext('webgl');

	if ( !webgl ) {
		R.showWebGLError(true);
		return;
	}

	// Get WC Data, then either load rest of the app or error

	R.getMaterialsData()                                                                     // ./data/materials.data.js
		.then(()     => { return R.getCollectionsData() })                                   // ./data/collections.data.js
		.then(()     => { return R.getMaterialsData('border') })                             // ./data/materials.data.js
		.then(()     => { return R.getPipingData() })                                        // ./data/piping.data.js
		.then(()     => { continueLoading() })                                               // Line 16
		.catch((err) => { error( err ) });                                                   // Line 181

	function continueLoading() {

		// Load Drawer Component                                                                ./components/drawer/*.component.js
		const BtnExpandCollapseComponent = R.btnExpandCollapseComponent();
		const BtnMaterialComponent       = R.btnMaterialComponent();
		const BtnCollectionComponent     = R.btnCollectionComponent();
		const BtnSwatchComponent         = R.btnSwatchComponent();
		const BtnBorderComponent         = R.btnBorderComponent();
		const SideMenuComponent          = R.sideMenuComponent();
		R.drawerComponent(BtnExpandCollapseComponent, BtnMaterialComponent, BtnCollectionComponent, BtnSwatchComponent, SideMenuComponent, BtnBorderComponent);

		// Load Price Component                                                                 ./components/price.component.js
		R.priceComponent();

		// Load View Controls Component                                                         ./components/view-controls.component.js
		R.viewControls();

		// Init THREE.js
		R.initThree();                                                                       // ./init.js
		R.initLights();                                                                      // ./init/lights.init.js
		R.initScene();                                                                       // ./init/scene.init.js

		// Add default rug - Single
		R.updateBorder('Single Border')                                                    // ./functions/updateBorder.function.js
			.then(() => { loaded() })                                                        // Line 48
			.catch((err) => { error( err ) });                                               // Line 181

		function loaded() {

			// Basic components of app are loaded

			// Init the Three.js order controls
			R.initOrbit();                                                                   // ./init/orbit.init.js

			// Init the Three.js helpers
//			R.initHelpers();                                                                 // .init/helpers.init.js

			// Set the Three.js standard camera X and Y axis position
			R.camera.position.x = 0;
			R.camera.position.y = 170;

			// Get the height of the window and set the camera Z axis position based on the height
			const WINDOW_HEIGHT = window.innerHeight;

			if ( WINDOW_HEIGHT > 1000 ) {
				R.camera.position.z = -55;
			}
			else if ( WINDOW_HEIGHT < 1000 && WINDOW_HEIGHT > 850 ) {
				R.camera.position.z = -62;
			}
			else if ( WINDOW_HEIGHT < 850 && WINDOW_HEIGHT > 700 ) {
				R.camera.position.z = -70;
			}
			else if ( WINDOW_HEIGHT < 700 ) {
				R.camera.position.z = -90;
			}

			// Set the standard camera rotation
			R.camera.rotation.x = -1.5708;
			R.camera.rotation.z = 0;
			R.camera.rotation.z = 0;

			
			function render() {

				// Render the Three.js scene
				requestAnimationFrame( render );
				R.renderer.render( R.scene, R.camera );
			}

			// Call the render function and close the loading screen
			render();                                                                        // Line 84

			document.querySelector('#background-div').style.background = 'none';

			// Add the window resize event listener                                             Line 98
			window.addEventListener( 'resize', onWindowResize, false );

			function onWindowResize(){

				// Window resize event listener

				// Get the new screen width and height
				R.screenWidth  = window.innerWidth;
				R.screenHeight = window.innerHeight;

				// Work out the new Three.js camera aspect ratio
				R.cameraOptions.aspectRatio = R.screenWidth / R.screenHeight;

				// Update the camera aspect ration
				R.camera.aspect = R.cameraOptions.aspectRatio;
				R.camera.updateProjectionMatrix();

				// Update the Three.js reneder size
				R.renderer.setSize( R.screenWidth, R.screenHeight );

				// Based on the new screen height, adjust the camera Z axis position and scale the rug JSON so it fits in the screen
				if ( R.screenHeight > 1000 ) {
					R.camera.position.z = -55;

					Object.keys(R.json).forEach((borderType) => {

						Object.keys(R.json[borderType]).forEach((mesh) => {

							if ( R.json[borderType][mesh] !== undefined ) {
								R.json[borderType][mesh].scale.x = 1;
								R.json[borderType][mesh].scale.y = 1;
								R.json[borderType][mesh].scale.z = 1;
							}
						});
					});
				}
				else if ( R.screenHeight < 1000 && R.screenHeight > 850 ) {
					R.camera.position.z = -62;

					Object.keys(R.json).forEach((borderType) => {

						Object.keys(R.json[borderType]).forEach((mesh) => {

							if ( R.json[borderType][mesh] !== undefined ) {
								R.json[borderType][mesh].scale.x = 0.8;
								R.json[borderType][mesh].scale.y = 0.8;
								R.json[borderType][mesh].scale.z = 0.8;
							}
						});
					});
				}
				else if ( R.screenHeight < 850 && R.screenHeight > 700 ) {
					R.camera.position.z = -70;

					Object.keys(R.json).forEach((borderType) => {

						Object.keys(R.json[borderType]).forEach((mesh) => {

							if ( R.json[borderType][mesh] !== undefined ) {
								R.json[borderType][mesh].scale.x = 0.65;
								R.json[borderType][mesh].scale.y = 0.65;
								R.json[borderType][mesh].scale.z = 0.65;
							}
						});
					});
				}
				else if ( R.screenHeight < 700 ) {
					R.camera.position.z = -90;

					Object.keys(R.json).forEach((borderType) => {

						Object.keys(R.json[borderType]).forEach((mesh) => {

							if ( R.json[borderType][mesh] !== undefined ) {
								R.json[borderType][mesh].scale.x = 0.5;
								R.json[borderType][mesh].scale.y = 0.5;
								R.json[borderType][mesh].scale.z = 0.5;
							}
						});
					});
				}
			}
		}
	}

	function error( code ) {

		let message;

		switch ( code ) {

			case 100 :
				message = 'An error occured loading the materials.';
				break;

			case 101 :
				message = 'An error occured loading the collections';
				break;

			case 200 :
				message = 'An error occured loading the single border JSON'

			case 201 :
				message = 'An error occured loading the piping border JSON'

			case 202 :
				message = 'An error occured loading the double border JSON'

			default :
				code    = 1000;
				message = 'An error occured';

		}

		R.error(code, message, true);                                                        // ./functions/error.function.js
		return;
	}
}