RugBuilder.prototype.initLights = function(RugBuilder) {

	const R = rugBuilder;

	const SPOTLIGHT         = new THREE.SpotLight( 0xffffff, 1, 0, 0.3141592653589793, 0, 1 );
	const SPOTLIGHT2        = new THREE.SpotLight( 0xffffff, 0.7, 0, 0.3141592653589793, 0, 1 );
	const AMBIENT_LIGHT     = new THREE.AmbientLight( 0xffffff );
	const DIRECTIONAL_LIGHT = new THREE.DirectionalLight( 0xffffff );

	SPOTLIGHT.position.set( 216.55, 238.95, -217.97 );
	SPOTLIGHT2.position.set( 307.15, 157.37, -80.38 );

	DIRECTIONAL_LIGHT.position.set( 0, 0, 1 );

	R.lights.spotLight        = SPOTLIGHT;
	R.lights.spotLight2       = SPOTLIGHT2;
	R.lights.ambientLight     = AMBIENT_LIGHT;
	R.lights.directionalLight = DIRECTIONAL_LIGHT;
}