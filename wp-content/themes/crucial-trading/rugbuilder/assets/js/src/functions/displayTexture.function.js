RugBuilder.prototype.displayTexture = function(swatch, thumb, stageCode, maps) {

	if ( thumb === undefined || thumb === null ) {
		return;
	}

	if ( stageCode === 1 || stageCode === 4 ) {
		return;
	}

	const R = rugBuilder;

	const BORDER_TYPE = R.borderType;

	let stageObj;
	let stageObj2;
	let stageObj3;
	let sceneChildren;

	if ( thumb.indexOf('-150x150') > -1 ) {
		thumb = thumb.replace('-150x150', '');
	}

	switch (stageCode) {

		case 0 :

			stageObj = 'centerMaterial';
			sceneChildren = ['center'];
			break;

		case 2 :

			switch (BORDER_TYPE) {

				case 'single' :

					stageObj      = 'borderMaterials';
					stageObj2     = 'single';
					sceneChildren = ['border-east', 'border-north', 'border-south', 'border-west'];
					break;

				case 'piping' :

					stageObj      = 'borderMaterials';
					stageObj2     = 'piping';
					sceneChildren = ['border-east', 'border-north', 'border-south', 'border-west', 'trim-east', 'trim-north', 'trim-south', 'trim-west'];
					break;

				default :

					stageObj      = 'borderMaterials';
					stageObj2     = 'double';
					stageObj3     = 'inner';
					sceneChildren = ['border-inner-east', 'border-inner-north', 'border-inner-south', 'border-inner-west'];
					break;

			}

			break;

		case 3 :

			stageObj      = 'borderMaterials';
			stageObj2     = 'double';
			stageObj3     = 'outer';
			sceneChildren = ['border-outer-east', 'border-outer-north', 'border-outer-south', 'border-outer-west'];
			break;
	}

	if ( R.loadedTextures[swatch] === undefined ) {

		new THREE.TextureLoader().load( thumb, (texture) => {

			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			texture.anisotropy = R.renderer.getMaxAnisotropy();

			if ( stageCode === 0 ) {
				// Center
				texture.repeat.set(7,7);
			}
			else if ( stageCode === 2 || stageCode === 3 ) {
				// Border
				texture.repeat.set(10,10);
	//			texture.flipY = true;
	//			texture.repeat.x = - 1;
			}

			let material = new THREE.MeshPhongMaterial( {
				map       : texture,
				color     : 0xffffff,
				shininess : 5
			});

			R.loadedTextures[swatch] = material;

			if ( stageObj3 !== undefined ) {
				R[stageObj][stageObj2][stageObj3] = swatch;
			}
			else if ( stageObj2 !== undefined ) {
				R[stageObj][stageObj2] = swatch;
			}
			else {
				R[stageObj] = swatch;
			}

			for ( let i = 0; i < R.scene.children.length; i++ ) {
				
				if ( sceneChildren.indexOf(R.scene.children[i].name) > -1 ) {
					R.scene.children[i].material = R.loadedTextures[swatch];
					_loadMaps(R.scene.children[i].material, maps);
				}
			}

			R.loadingScreens('full', 'close');
		});
	}
	else {

		if ( stageObj3 !== undefined ) {
			R[stageObj][stageObj2][stageObj3] = swatch;
		}
		else if ( stageObj2 !== undefined ) {
			R[stageObj][stageObj2] = swatch;
		}
		else {
			R[stageObj] = swatch;
		}

		for ( let i = 0; i < R.scene.children.length; i++ ) {
			
			if ( sceneChildren.indexOf(R.scene.children[i].name) > -1 ) {
				R.scene.children[i].material = R.loadedTextures[swatch];
				_loadMaps(R.scene.children[i].material, maps);
			}
		}
		
		R.loadingScreens('full', 'close');
	}
}

function _loadMaps(material, maps) {

	if ( maps !== undefined ) {

		if ( typeof maps.nmap === 'object' ) {

			Object.keys(maps.nmap).forEach((key) => {
				let url = maps.nmap[key].full_url;

				new THREE.TextureLoader().load( url, (texture) => {
					material.normalMap = texture;
					material.needsUpdate = true;
					return;
				});
			});
		}

		if ( typeof maps.bmap === 'object' ) {

			Object.keys(maps.bmap).forEach((key) => {
				let url = maps.bmap[key].full_url;

				new THREE.TextureLoader().load( url, (texture) => {
					material.bumpMap = texture;
					material.needsUpdate = true;
					return;
				});
			});
		}

		if ( typeof maps.dmap === 'object' ) {

			Object.keys(maps.dmap).forEach((key) => {
				let url = maps.dmap[key].full_url;

				new THREE.TextureLoader().load( url, (texture) => {
					material.displacementMap = texture;
					material.needsUpdate = true;
					return;
				});
			});
		}
	}

	return;
}