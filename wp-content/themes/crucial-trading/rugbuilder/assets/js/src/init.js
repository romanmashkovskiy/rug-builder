RugBuilder.prototype.initThree = function() {

	const R = rugBuilder;

	const CAMERA_OPTIONS = R.cameraOptions;

	const SCENE    = new THREE.Scene();
	const RENDERER = new THREE.WebGLRenderer({
	    preserveDrawingBuffer: true 
	});
	const CAMERA   = new THREE.PerspectiveCamera(
		CAMERA_OPTIONS.viewAngle,
		CAMERA_OPTIONS.aspectRatio,
		CAMERA_OPTIONS.near,
		CAMERA_OPTIONS.far
	);

	RENDERER.gammaInput  = true;
	RENDERER.gammaOutput = true;

	RENDERER.setSize( window.innerWidth, window.innerHeight );
	RENDERER.setClearColor(0xf3f3f3)

	R.scene    = SCENE;
	R.renderer = RENDERER;
	R.camera   = CAMERA;
}