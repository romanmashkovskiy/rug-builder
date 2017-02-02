/*
 * Display Texture
 * 
 * Takes the user selected texture and displays it on the rug
 *
 * @param (String) swatch      The name of the swatch selected
 * @param (Object) thumbObj    The object that contains the thumbnail to display on the rug
 * @param (Number) stageCode   The current stage the user is on
 * @param (Object) maps        The object that contains the bump, normal, and displacement maps
 * @param (String) stitching   The hex code to use for the color of the stitches
 * @param (Object) repeat      The x and y repeat values to use for the texture
 */

RugBuilder.prototype.displayTexture = function(swatch, thumbObj, stageCode, maps, stitching, repeat) {

	// If the thumbObj is undefined or null return as there is nothing to display on the rug
	if ( thumbObj === undefined || thumbObj === null ) {
		return;
	}

	// If the user is at stage 1 (border type) or stage 4 (rug size) return because there is no texture to be displayed at those stages
	if ( stageCode === 1 || stageCode === 4 ) {
		return;
	}

	const R = rugBuilder;

	// Get the user's currently selected border type
	const BORDER_TYPE = R.borderType;

	let stageObj;
	let stageObj2;
	let stageObj3;
	let sceneChildren;
	let thumb;

	// Extract the url of the thumbnail to display on the rug from the thumbObj object
	Object.keys(thumbObj).map((key) => {
		thumb = thumbObj[key]['url'];
	});

	// If the thumbnail is the 150x150 version then get the full size version
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
			texture.generateMipmaps = true;

			const DEFAULT_VAL = stageCode === 0 ? 7 : 10;

			if ( typeof repeat === 'object' ) {

				if ( repeat.x !== '' && repeat.y !== '' ) {
					texture.repeat.set(repeat.x, repeat.y)
				} else {
					if ( repeat.x !== '' ) {
						texture.repeat.set(repeat.x, DEFAULT_VAL);
					} else if ( repeat.y !== '' ) {
						texture.repeat.set(DEFAULT_VAL, repeat.y);
					} else {
						texture.repeat.set(DEFAULT_VAL, DEFAULT_VAL);
					}
				}

			} else {
				texture.repeat.set(DEFAULT_VAL, DEFAULT_VAL);
			}

			if ( stageCode === 2 || stageCode === 3 ) {
				texture.flipY = true;
//				texture.repeat.x = - 1;
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
					_loadMaps(R.scene.children[i].material, maps, repeat);
				}
			}

			if ( stageCode === 2 ) {
				_setStitchingColor(stitching)
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
				_loadMaps(R.scene.children[i].material, maps, repeat);
			}
		}

		if ( stageCode === 2 ) {
			_setStitchingColor(stitching)
		}
		
		R.loadingScreens('full', 'close');
	}
}

/*
 * Load Maps
 * 
 * Load the bump, normal, and displacement maps and save them to the material displayed on the rug
 *
 * @param (Object) material   The Three.js material object displayed on the rug that the maps are added to
 * @param (Object) maps       The object that contains the bump, normal, and displacement maps
 *
 * @return (Boolean) false
 */

function _loadMaps(material, maps, repeat) {

	if ( maps !== undefined ) {

		if ( typeof maps.nmap === 'object' ) {

			Object.keys(maps.nmap).forEach((key) => {
				let url = maps.nmap[key].full_url;

				new THREE.TextureLoader().load( url, (texture) => {
					material.normalMap = texture;
					material.needsUpdate = true;

					const DEFAULT_VAL = stageCode === 0 ? 7 : 10;

					if ( typeof repeat === 'object' ) {

						if ( repeat.x !== '' && repeat.y !== '' ) {
							texture.repeat.set(repeat.x, repeat.y)
						} else {
							if ( repeat.x !== '' ) {
								texture.repeat.set(repeat.x, DEFAULT_VAL);
							} else if ( repeat.y !== '' ) {
								texture.repeat.set(DEFAULT_VAL, repeat.y);
							} else {
								texture.repeat.set(DEFAULT_VAL, DEFAULT_VAL);
							}
						}

					} else {
						texture.repeat.set(DEFAULT_VAL, DEFAULT_VAL);
					}
//					return false;
				});
			});
		}

		if ( typeof maps.bmap === 'object' ) {

			Object.keys(maps.bmap).forEach((key) => {
				let url = maps.bmap[key].full_url;

				new THREE.TextureLoader().load( url, (texture) => {
					material.bumpMap = texture;
					material.needsUpdate = true;

					const DEFAULT_VAL = stageCode === 0 ? 7 : 10;

					if ( typeof repeat === 'object' ) {

						if ( repeat.x !== '' && repeat.y !== '' ) {
							texture.repeat.set(repeat.x, repeat.y)
						} else {
							if ( repeat.x !== '' ) {
								texture.repeat.set(repeat.x, DEFAULT_VAL);
							} else if ( repeat.y !== '' ) {
								texture.repeat.set(DEFAULT_VAL, repeat.y);
							} else {
								texture.repeat.set(DEFAULT_VAL, DEFAULT_VAL);
							}
						}

					} else {
						texture.repeat.set(DEFAULT_VAL, DEFAULT_VAL);
					}
//					return false;
				});
			});
		}

		if ( typeof maps.dmap === 'object' ) {

			Object.keys(maps.dmap).forEach((key) => {
				let url = maps.dmap[key].full_url;

				new THREE.TextureLoader().load( url, (texture) => {
					material.displacementMap = texture;
					material.displacementScale = 2;
					material.needsUpdate = true;

					const DEFAULT_VAL = stageCode === 0 ? 7 : 10;

					if ( typeof repeat === 'object' ) {

						if ( repeat.x !== '' && repeat.y !== '' ) {
							texture.repeat.set(repeat.x, repeat.y)
						} else {
							if ( repeat.x !== '' ) {
								texture.repeat.set(repeat.x, DEFAULT_VAL);
							} else if ( repeat.y !== '' ) {
								texture.repeat.set(DEFAULT_VAL, repeat.y);
							} else {
								texture.repeat.set(DEFAULT_VAL, DEFAULT_VAL);
							}
						}

					} else {
						texture.repeat.set(DEFAULT_VAL, DEFAULT_VAL);
					}
//					return false;
				});
			});
		}
	}

	return false;
}

/*
 * Set Stitching Colors
 * 
 * Sets the color of the stitches on the rug
 *
 * @param (String) stitching   The hex code of the color to set the stitches to
 *
 * @return (Boolean) false
 */


function _setStitchingColor(stitching) {

	const R = rugBuilder;

	const HEX   = stitching.substr(1)
	const COLOR = '0x' + HEX;

	R.json[R.borderType].stitches.material.color.setHex(COLOR);

	return false;

}