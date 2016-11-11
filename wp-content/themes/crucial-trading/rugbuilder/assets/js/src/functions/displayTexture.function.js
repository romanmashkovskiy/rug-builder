RugBuilder.prototype.displayTexture = function(swatch, thumb, stageCode) {

	/* TO-DO: LOAD BUMP MAP ONCE IT HAS BEEN ADDED AS A WP META BOX */

	const R = rugBuilder;

	let stageObj;
	let sceneChildren;

	switch (stageCode) {

		case 0 : stageObj = 'centerMaterial'; sceneChildren = ['center']; break;
	}

	return new Promise((res, rej) => {

		if ( R.loadedTextures[swatch] === undefined ) {

			new THREE.TextureLoader().load( thumb, (texture) => {

				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
				texture.anisotropy = R.renderer.getMaxAnisotropy();
				texture.repeat.set(5,5);

				let material = new THREE.MeshPhongMaterial( {
					map       : texture,
					color     : 0xffffff,
					shininess : 5
				});

				R.loadedTextures[swatch] = material;

				R[stageObj] = swatch;

				for ( let i = 0; i < R.scene.children.length; i++ ) {
					
					if ( sceneChildren.indexOf(R.scene.children[i].name) > -1 ) {
						R.scene.children[i].material = R.loadedTextures[swatch];
					}
				}
			});
		}
		else {

			R[stageObj] = swatch;

			for ( let i = 0; i < R.scene.children.length; i++ ) {
				
				if ( sceneChildren.indexOf(R.scene.children[i].name) > -1 ) {
					R.scene.children[i].material = R.loadedTextures[swatch];
				}
			}
		}
	});
}