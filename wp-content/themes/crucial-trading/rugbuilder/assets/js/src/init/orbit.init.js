RugBuilder.prototype.initOrbit = function() {

	const R = rugBuilder;

	// Create new Three.js Orbit Controls
	R.orbitControls = new THREE.OrbitControls( R.camera, R.renderer.domElement );

	// Disable mouse zoom as it messes up the zoom in/out buttons
	R.orbitControls.enableZoom = false;

	// Setup Orbit Controls max rotation
//	R.orbitControls.maxPolarAngle = Math.PI / 2 - 0.1;
} 