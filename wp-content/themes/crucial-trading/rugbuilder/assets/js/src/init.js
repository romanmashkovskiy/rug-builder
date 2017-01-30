RugBuilder.prototype.initThree = function() {

	const R = rugBuilder;

	// Get the saved camera options
	const CAMERA_OPTIONS = R.cameraOptions;

	// Create the Three.js Scene, Renderer, and Camera
	const SCENE    = new THREE.Scene();
	const RENDERER = new THREE.WebGLRenderer({
	    preserveDrawingBuffer: true,
	    antialias: true
	});
	const CAMERA   = new THREE.PerspectiveCamera(
		CAMERA_OPTIONS.viewAngle,
		CAMERA_OPTIONS.aspectRatio,
		CAMERA_OPTIONS.near,
		CAMERA_OPTIONS.far
	);

	// Setup the Renderer - gamma input and output, size, and color
	RENDERER.gammaInput  = true;
	RENDERER.gammaOutput = true;

	RENDERER.setSize( window.innerWidth, window.innerHeight );
	RENDERER.setClearColor(0xf3f3f3)

	// Save the Scene, Renderer, and Camera
	R.scene    = SCENE;
	R.renderer = RENDERER;
	R.camera   = CAMERA;
}