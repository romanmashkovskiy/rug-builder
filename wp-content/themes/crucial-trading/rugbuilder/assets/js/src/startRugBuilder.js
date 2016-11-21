RugBuilder.prototype.start = function() {

	const R = rugBuilder;

	// Get WC Data, then either load rest of the app or error

	R.getMaterialsData()
		.then(()     => { return R.getCollectionsData() })
		.then(()     => { continueLoading() })
		.catch((err) => { error( err ) });

	function continueLoading() {

		// React Components

		// Progress Menu
		const BtnExitComponent    = R.btnExitComponent();
		const BtnRestartComponent = R.btnRestartComponent();
		const BtnStageComponent   = R.btnStageComponent();
		R.menuComponent(BtnExitComponent, BtnRestartComponent, BtnStageComponent);

		// Drawer
		const BtnExpandCollapseComponent = R.btnExpandCollapseComponent();
		const BtnMaterialComponent       = R.btnMaterialComponent();
		const BtnCollectionComponent     = R.btnCollectionComponent();
		const BtnSwatchComponent         = R.btnSwatchComponent();
		const BtnBorderComponent         = R.btnBorderComponent();
		const SideMenuComponent          = R.sideMenuComponent();
		R.drawerComponent(BtnExpandCollapseComponent, BtnMaterialComponent, BtnCollectionComponent, BtnSwatchComponent, SideMenuComponent, BtnBorderComponent);

		// Other
		R.priceComponent();

		// View Controls
		R.viewControls();

		// Init THREE.js
		R.initThree();
		R.initLights();
		R.initScene();

		// Add default rug - Single & Piping
		R.updateBorder('Single & Piping')
			.then(() => { loaded() });

		function loaded() {

			R.initOrbit();
//			R.initHelpers();

			R.camera.position.x = 0;
			R.camera.position.y = 170;

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

			R.camera.rotation.x = -1.5708;
			R.camera.rotation.z = 0;
			R.camera.rotation.z = 0;

			// Render

			function render() {
				requestAnimationFrame( render );
				R.renderer.render( R.scene, R.camera );
			}

			render();
			R.loadingScreens('full', 'close');

			window.addEventListener( 'resize', onWindowResize, false );

			function onWindowResize(){

				R.screenWidth  = window.innerWidth;
				R.screenHeight = window.innerHeight;

				R.cameraOptions.aspectRatio = R.screenWidth / R.screenHeight;

				R.camera.aspect = R.cameraOptions.aspectRatio;
				R.camera.updateProjectionMatrix();

				R.renderer.setSize( R.screenWidth, R.screenHeight );

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

	function error( err ) {
		let errorCode = 100 + err;
		R.error(errorCode, true);
		return;
	}
}