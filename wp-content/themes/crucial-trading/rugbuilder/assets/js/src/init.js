RugBuilder.prototype.initThree = function() {

	const R = rugBuilder;

	const CAMERA_OPTIONS = R.cameraOptions;

	const SCENE    = new THREE.Scene();
	const RENDERER = new THREE.WebGLRenderer();
	const CAMERA   = new THREE.PerspectiveCamera(
		CAMERA_OPTIONS.viewAngle,
		CAMERA_OPTIONS.aspectRatio,
		CAMERA_OPTIONS.near,
		CAMERA_OPTIONS.far
	);

	CAMERA.position.x = -58.25551669838936;
	CAMERA.position.y = 103.7487525991614;
	CAMERA.position.z = 132.44381733713013;

	CAMERA.rotation.x = -0.6645005541912388;
	CAMERA.rotation.y = -0.33334042300972533;
	CAMERA.rotation.z = -0.25090904322969587;

	RENDERER.gammaInput  = true;
	RENDERER.gammaOutput = true;

	RENDERER.setSize( window.innerWidth, window.innerHeight );
	RENDERER.setClearColor(0xf3f3f3)

	R.scene    = SCENE;
	R.renderer = RENDERER;
	R.camera   = CAMERA;
}