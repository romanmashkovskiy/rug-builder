RugBuilder.prototype.initLights = function(RugBuilder) {

	const R = rugBuilder;

	// Create the lights
	const SPOTLIGHT  = new THREE.SpotLight(
		16777215,
		0.8,
		0,
		0.3141592653589793,
		0,
		1
	);

	const SPOTLIGHT2 = new THREE.SpotLight(
		16777215,
		0.28,
		0,
		0.3141592653589793,
		0,
		1
	);

	// Setup the lights' position
	SPOTLIGHT.position.set(
		-230.44,
		317.88,
		-80.68
	);
	
	SPOTLIGHT2.position.set(
		307.15,
		157.37,
		-80.38
	);

	// Save the lights
	R.lights.spotLight  = SPOTLIGHT;
	R.lights.spotLight2 = SPOTLIGHT2;
}