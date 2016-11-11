RugBuilder.prototype.displayTexture = function(swatch, thumb, stageCode) {

	/* TO-DO: LOAD BUMP MAP ONCE IT HAS BEEN ADDED AS A WP META BOX */

	const R = rugBuilder;

	const BORDER_TYPE = R.borderType;

	let stageObj;
	let stageObj2;
	let sceneChildren;

	switch (stageCode) {

		case 0 : stageObj = 'centerMaterial'; sceneChildren = ['center']; break;
		case 2 : 

			if ( BORDER_TYPE === 'single' ) {

				stageObj      = 'borderMaterials';
				stageObj2     = 'single';
				sceneChildren = ['border-east', 'border-north', 'border-south', 'border-west'];
			}
			else if ( BORDER_TYPE === 'piping' ) {

				stageObj      = 'borderMaterials';
				stageObj2     = 'piping';
				sceneChildren = ['border-east', 'border-north', 'border-south', 'border-west', 'trim-east', 'trim-north', 'trim-south', 'trim-west'];
			}
//			else {

//			}
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

				if ( stageObj2 === undefined ) {
					R[stageObj] = swatch;
				} else {
					R[stageObj][stageObj2] = swatch;
				}

				for ( let i = 0; i < R.scene.children.length; i++ ) {
					
					if ( sceneChildren.indexOf(R.scene.children[i].name) > -1 ) {
						R.scene.children[i].material = R.loadedTextures[swatch];
					}
				}
			});
		}
		else {

			if ( stageObj2 === undefined ) {
				R[stageObj] = swatch;
			} else {
				R[stageObj][stageObj2] = swatch;
			}

			for ( let i = 0; i < R.scene.children.length; i++ ) {
				
				if ( sceneChildren.indexOf(R.scene.children[i].name) > -1 ) {
					R.scene.children[i].material = R.loadedTextures[swatch];
				}
			}
		}
	});
}