RugBuilder.prototype.displayTexture = function(texture) {

	const R = rugBuilder;

	let _texture = texture === 'AudreyRug1' ? 'cotton-herringbone' : 'biscayne-bs105';

	let img_url  = templateDirectoryUri + '/rugbuilder/img/' + _texture + '.jpg';
	let bmap_url = templateDirectoryUri + '/rugbuilder/img/' + _texture + '-bmap.jpg';

	new THREE.TextureLoader().load(
		bmap_url,
		function( bmap ) {

			bmap.wrapS = bmap.wrapT = THREE.RepeatWrapping;
			bmap.anisotropy = R._renderer.getMaxAnisotropy();
			bmap.repeat.set(5,5);

			new THREE.TextureLoader().load(
				img_url,
				function( texture ) {

					texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
					texture.anisotropy = R._renderer.getMaxAnisotropy();
					texture.repeat.set(5,5);

					var material = new THREE.MeshPhongMaterial( {
						map       : texture,
						bumpMap   : bmap,
						color     : 0xffffff,
						bumpScale : 0.0005,
						shininess : 5
					});

					for ( let i = 0; i < R._singleObjects.length; i++ ) {

						if ( R._singleObjects[i].name === 'center' ) {
							R._singleObjects[i].material = material;
						}
					}
				}
			);
		}
	);
}