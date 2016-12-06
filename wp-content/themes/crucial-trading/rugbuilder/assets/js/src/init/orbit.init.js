RugBuilder.prototype.initOrbit = function() {

	const R = rugBuilder;

	R.orbitControls = new THREE.OrbitControls( R.camera, R.renderer.domElement );

	R.orbitControls.minDistance = 20;
	R.orbitControls.maxDistance = 200;

	R.orbitControls.maxPolarAngle = Math.PI/2 - 0.1;
}