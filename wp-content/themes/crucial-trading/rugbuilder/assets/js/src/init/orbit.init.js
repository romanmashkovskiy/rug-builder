RugBuilder.prototype.initOrbit = function() {

	const R = rugBuilder;

	// Create new Three.js Orbit Controls
	R.orbitControls = new THREE.OrbitControls( R.camera, R.renderer.domElement );

	// Setup Orbit Controls - min and max zoom distance, and max rotation
	R.orbitControls.minDistance   = 20;
	R.orbitControls.maxDistance   = 200;
	R.orbitControls.maxPolarAngle = Math.PI/2 - 0.1;
}