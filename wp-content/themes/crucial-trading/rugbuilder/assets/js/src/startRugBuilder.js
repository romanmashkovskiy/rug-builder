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
			R.camera.position.z = -55;

			R.camera.rotation.x = -1.5708;
			R.camera.rotation.z = 0;
			R.camera.rotation.z = 0;

			// Render

			function render() {
				requestAnimationFrame( render );
				R.renderer.render( R.scene, R.camera );
			}

			render();

			window.addEventListener( 'resize', onWindowResize, false );

			function onWindowResize(){

				R.screenWidth = window.innerWidth;
				R.screenHeight = window.innerHeight;

				R.cameraOptions.aspectRatio = R.screenWidth / R.screenHeight;

				R.camera.aspect = R.cameraOptions.aspectRatio;
				R.camera.updateProjectionMatrix();

				R.renderer.setSize( R.screenWidth, R.screenHeight );
			}
		}
	}

	function error( err ) {

		let stage;

		switch ( err ) {

			case 0 : stage = 'materials'; break;
			case 1 : stage = 'collections'; break;
		}

		let str = 'Error at '  + stage + ' stage.';

		alert(str);
	}
}