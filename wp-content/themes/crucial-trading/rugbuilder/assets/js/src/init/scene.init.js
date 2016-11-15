RugBuilder.prototype.initScene = function() {

	const R = rugBuilder;

	R.scene.add(R.camera);
	R.scene.add(R.lights.spotLight);
	R.scene.add(R.lights.spotLight);
//	R.scene.add(R.camera.ambientLight);
	R.scene.add(R.camera.directionalLight);

	document.body.appendChild(R.renderer.domElement);
}