RugBuilder.prototype.initScene = function() {

	const R = rugBuilder;

	R.scene.add(R.camera);
	R.scene.add(R.lights.spotLight);
	R.scene.add(R.lights.spotLight);
//	R.scene.add(R.lights.ambientLight);
	R.scene.add(R.lights.directionalLight);

	document.body.appendChild(R.renderer.domElement);

	let abc = window.getComputedStyle( document.querySelector('#hello') ).getPropertyValue('display');

	if ( abc === 'none' ) {
		document.querySelector('canvas').style.display = 'block';
	}
}