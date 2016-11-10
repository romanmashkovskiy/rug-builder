// Set up some vars

var loadSingle    = function() { alert('Not loaded yet!'); }
var loadSingleLow = function() { alert('Not loaded yet!'); }
var loadDouble    = function() { alert('Not loaded yet!'); }
var loadDoubleLow = function() { alert('Not loaded yet!'); }

var biscayne, cotton, bmap, bmap2;

// Load bump maps

new THREE.TextureLoader().load(
	'<?php echo get_template_directory_uri(); ?>/rugbuilder/img/biscayne-bs105-bmap.jpg',
	function( texture ) {

		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.anisotropy = renderer.getMaxAnisotropy();
		texture.repeat.set(5,5);

		bmap = texture;
	}
);

new THREE.TextureLoader().load(
	'<?php echo get_template_directory_uri(); ?>/rugbuilder/img/cotton-herringbone-bmap.jpg',
	function( texture ) {

		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.anisotropy = renderer.getMaxAnisotropy();
		texture.repeat.set(5,5);

		bmap2 = texture;
	}
);

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

	var url  = '<?php echo get_template_directory_uri(); ?>/rugbuilder/json/single/' + singleFiles[i] + '.json';
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

	// Load biscayne and cotton materials

	new THREE.TextureLoader().load(

		'<?php echo get_template_directory_uri(); ?>/rugbuilder/img/biscayne-bs105.jpg',
		function( texture ) {

			for ( var t = 3; t < scene.children.length; t++ ) {

				if ( scene.children[t].name === 'center' ) {

					texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
					texture.anisotropy = renderer.getMaxAnisotropy();
					texture.repeat.set(5,5);
					texture.flipX = false;
/*
					var mesh = new THREE.MeshPhongMaterial({
						map       : texture,
						bumpMap   : bmap,
						bumpScale : 2,
						shininess : 15
					});
*/
					var mesh = new THREE.MeshStandardMaterial( {
						map       : texture,
						bumpMap   : bmap,
						roughness: 0.8,
						color: 0xffffff,
						metalness: 0.2,
						bumpScale: 0.0005,
						shininess: 5
					});

					scene.children[t].material = mesh;

					biscayne = mesh;
				}
			}
		}
	);

	new THREE.TextureLoader().load(

		'<?php echo get_template_directory_uri(); ?>/rugbuilder/img/cotton-herringbone.jpg',
		function( texture ) {

			for ( var t = 3; t < scene.children.length; t++ ) {

				if ( scene.children[t].name !== 'center' ) {

					texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
					texture.anisotropy = renderer.getMaxAnisotropy();
					texture.repeat.set(5,5);

					var mesh = new THREE.MeshPhongMaterial({
						map       : texture,
						bumpMap   : bmap2,
						bumpScale : 2,
						shininess : 5
					});

					scene.children[t].material = mesh;

					cotton = mesh;
				}						
			}
		}
	);

	// Set loadSingle function (click handler)

	loadSingle = function() {

		var length = scene.children.length;
		
		for ( var r = 3; r < length; r++ ) {
			scene.remove( scene.children[3] );
		}

		for ( l = 0; l < singleObjects.length; l++ ) {
			scene.add( singleObjects[l] );
		}
	}

	// Add orbitControls

	var orbitControls = new THREE.OrbitControls( camera );

	// Render

	function render() {
		requestAnimationFrame( render );
		renderer.render( scene, camera );
	}

	render();

	function loadOtherJSON() {

		// Load the rest of the JSON - Single Low, Double, Double Low

		function loadCompleted2( name, obj ) {
			return function( texture ) {

				var material = new THREE.MeshLambertMaterial( { color: 0xdddddd } );
				var object   = new THREE.Mesh(texture, material);

				object.name = name;

				obj.push(object)
			}				
		}

		var singleLowFiles   = ['border-east', 'border-north', 'border-south', 'border-west', 'center', 'stitches', 'trim-east', 'trim-north', 'trim-south', 'trim-west'];
		var singleLowObjects = [];

		var doubleFiles   = ['border-inner-east', 'border-inner-north', 'border-inner-south', 'border-inner-west', 'border-outer-east', 'border-outer-north', 'border-outer-south', 'border-outer-west', 'center', 'stitches'];
		var doubleObjects = [];

		var doubleLowFiles   = ['border-inner-east', 'border-inner-north', 'border-inner-south', 'border-inner-west', 'border-outer-east', 'border-outer-north', 'border-outer-south', 'border-outer-west', 'center', 'stitches'];
		var doubleLowObjects = [];

		for ( var i3 = 0; i3 < singleLowFiles.length; i3++ ) {

			var url  = '<?php echo get_template_directory_uri(); ?>/rugbuilder/json/single-low/' + singleLowFiles[i3] + '.json';
			var name = singleLowFiles[i3];

			new THREE.BufferGeometryLoader().load(url, loadCompleted2(name, singleLowObjects));
		}

		for ( var i4 = 0; i4 < doubleFiles.length; i4++ ) {

			var url  = '<?php echo get_template_directory_uri(); ?>/rugbuilder/json/double/' + doubleFiles[i4] + '.json';
			var name = doubleFiles[i4];

			new THREE.BufferGeometryLoader().load(url, loadCompleted2(name, doubleObjects));
		}

		for ( var i5 = 0; i5 < doubleLowFiles.length; i5++ ) {

			var url  = '<?php echo get_template_directory_uri(); ?>/rugbuilder/json/double-low/' + doubleLowFiles[i5] + '.json';
			var name = doubleLowFiles[i5];

			new THREE.BufferGeometryLoader().load(url, loadCompleted2(name, doubleLowObjects));
		}

		function addMaterial() {
			for ( var t = 3; t < scene.children.length; t++ ) {
				if ( scene.children[t].name === 'center' ) {
					scene.children[t].material = biscayne;
				} else {
					scene.children[t].material = cotton;
				}
			}
		}

		// Set other click handlers for changing between JSON

		var interval2 = setInterval(function() {

			if ( singleLowFiles.length === singleLowObjects.length ) {

				loadSingleLow = function() {

					var length = scene.children.length;
					
					for ( var r = 3; r < length; r++ ) {
						scene.remove( scene.children[3] );
					}

					for ( l = 0; l < singleLowObjects.length; l++ ) {
						scene.add( singleLowObjects[l] );
					}

					addMaterial();
				}

				clearInterval( interval2 );
			}
		}, 1000)

		var interval3 = setInterval(function() {

			if ( doubleFiles.length === doubleObjects.length ) {

				loadDouble = function() {

					var length = scene.children.length;
					
					for ( var r = 3; r < length; r++ ) {
						scene.remove( scene.children[3] );
					}

					for ( l = 0; l < doubleObjects.length; l++ ) {
						scene.add( doubleObjects[l] );
					}

					addMaterial();
				}

				clearInterval( interval3 );
			}
		}, 1000)

		var interval4 = setInterval(function() {

			if ( doubleLowFiles.length === doubleLowObjects.length ) {

				loadDoubleLow = function() {

					var length = scene.children.length;
					
					for ( var r = 3; r < length; r++ ) {
						scene.remove( scene.children[3] );
					}

					for ( l = 0; l < doubleLowObjects.length; l++ ) {
						scene.add( doubleLowObjects[l] );
					}

					addMaterial();
				}

				clearInterval( interval4 );
			}
		}, 1000)
	}

	loadOtherJSON();
}

document.body.appendChild(renderer.domElement);