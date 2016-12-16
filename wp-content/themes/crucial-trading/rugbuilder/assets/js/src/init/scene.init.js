RugBuilder.prototype.initScene = function() {

	const R = rugBuilder;

	R.scene.add(R.camera);
	R.scene.add(R.lights.spotLight);
	R.scene.add(R.lights.spotLight);
//	R.scene.add(R.lights.ambientLight);
	R.scene.add(R.lights.directionalLight);

	document.body.appendChild(R.renderer.domElement);
}