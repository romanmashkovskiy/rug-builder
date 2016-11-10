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
		const SideMenuComponent          = R.sideMenuComponent();
		R.drawerComponent(BtnExpandCollapseComponent, BtnMaterialComponent, BtnCollectionComponent, BtnSwatchComponent, SideMenuComponent);


		/******** START INITIAL THREE JS ********/

		// Set up basic THREE stuff

		var scene    = new THREE.Scene();
		var camera   = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 10000 );
		var renderer = new THREE.WebGLRenderer();

		camera.position.x = -58.25551669838936;
		camera.position.y = 103.7487525991614;
		camera.position.z = 132.44381733713013;

		camera.rotation.x = -0.6645005541912388;
		camera.rotation.y = -0.33334042300972533;
		camera.rotation.z = -0.25090904322969587;

		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.setClearColor(0xf3f3f3)

		renderer.gammaInput = true;
		renderer.gammaOutput = true;

		var spotLight        = new THREE.SpotLight( 0xffffff, 1, 0, 0.3141592653589793, 0, 1 );
		var spotLight2       = new THREE.SpotLight( 0xffffff, 0.7, 0, 0.3141592653589793, 0, 1 );
		var ambientLight     = new THREE.AmbientLight( 0xffffff );
		var directionalLight = new THREE.DirectionalLight( 0xffffff );

		spotLight.position.set( 216.55, 238.95, -217.97 );
		spotLight2.position.set( 307.15, 157.37, -80.38 );

		directionalLight.position.set( 0, 0, 1 );

		scene.add( camera );
		scene.add( spotLight );
		scene.add( spotLight2 );
		//	scene.add( ambientLight );
		//	scene.add( directionalLight );

		// Load single JSON files (default view)

		var singleFiles   = ['border-east', 'border-north', 'border-south', 'border-west', 'center', 'stitches', 'trim-east', 'trim-north', 'trim-south', 'trim-west'];
		var singleObjects = [];

		function loadCompleted( name ) {
			return function( texture ) {

				var material = new THREE.MeshLambertMaterial( { color: 0xdddddd } );
				var object   = new THREE.Mesh(texture, material);

				object.name = name;

				singleObjects.push(object)
			}
		}

		for ( var i = 0; i < singleFiles.length; i++ ) {

			var url  = templateDirectoryUri + '/rugbuilder/json/single/' + singleFiles[i] + '.json';
			var name = singleFiles[i];

			new THREE.BufferGeometryLoader().load(url, loadCompleted(name));
		}

		var interval = setInterval(function() {

			// When all single files loaded do loaded() function

			if ( singleFiles.length === singleObjects.length ) {
				loaded();
			}
		}, 1000)

		function loaded() {

			clearInterval( interval );

			// Add single JSON to scene

			for ( var i2 = 0; i2 < singleObjects.length; i2++ ) {
				scene.add( singleObjects[i2] );
			}

			// Add orbitControls

			var orbitControls = new THREE.OrbitControls( camera );

			// Render

			function render() {
				requestAnimationFrame( render );
				renderer.render( scene, camera );
			}

			render();
		}

		document.body.appendChild(renderer.domElement);

		/******** END INITIAL THREE JS ********/
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