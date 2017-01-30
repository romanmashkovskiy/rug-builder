RugBuilder.prototype.initScene = function() {

	const R = rugBuilder;

	// Add Camera and Lights to Three.js Scene
	R.scene.add(R.camera);
	R.scene.add(R.lights.spotLight);
//	R.scene.add(R.lights.spotLight2);

	// Append the Three.js Renderer's DOM Element to the body
	document.body.appendChild(R.renderer.domElement);
}