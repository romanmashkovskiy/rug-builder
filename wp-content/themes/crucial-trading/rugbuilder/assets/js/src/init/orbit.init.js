RugBuilder.prototype.initOrbit = function() {

	const R = rugBuilder;

	R.orbitControls = new THREE.OrbitControls( R.camera, R.renderer.domElement );

	R.orbitControls.minDistance = 50;
	R.orbitControls.maxDistance = 300;

	R.orbitControls.maxPolarAngle = Math.PI/2 - 0.1;
}