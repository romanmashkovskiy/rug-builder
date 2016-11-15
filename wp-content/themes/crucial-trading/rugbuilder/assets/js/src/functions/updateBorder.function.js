RugBuilder.prototype.updateBorder = function(border) {

	const R = rugBuilder;

	let files = [];

	return new Promise((res, rej) => {

		switch (border) {

			case 'Single Border' :

				files = ['border-east', 'border-north', 'border-south', 'border-west', 'center', 'stitches'];

				R.borderType = 'single';

				_loadFiles(files, R, 'single', 'single')
					.then(()  => { return _updateScene(R, 'single') })
					.then(()  => { res() })
					.catch(() => { alert('error loading border') });

				break;

			case 'Single & Piping' :

				files = ['border-east', 'border-north', 'border-south', 'border-west', 'center', 'stitches', 'trim-east', 'trim-north', 'trim-south', 'trim-west'];

				R.borderType = 'piping';

				_loadFiles(files, R, 'single', 'piping')
					.then(()  => { return _updateScene(R, 'piping') })
					.then(()  => { res() })
					.catch(() => { alert('error loading border') });

				break;

			case 'Double Border' :

				files = ['border-inner-east', 'border-inner-north', 'border-inner-south', 'border-inner-west', 'border-outer-east', 'border-outer-north', 'border-outer-south', 'border-outer-west', 'center', 'stitches'];

				R.borderType = 'double';

				_loadFiles(files, R, 'double', 'double')
					.then(()  => { return _updateScene(R, 'double') })
					.then(()  => { res() })
					.catch(() => { alert('error loading border') });

				break;
		}
	});
}

function _loadFiles(files, R, folder, type) {

	return new Promise((res, rej) => {

		let objects = [];

		function loadCompleted(name) {

			return function( texture ) {

				let material = new THREE.MeshLambertMaterial( { color: 0xdddddd } );
				let object   = new THREE.Mesh(texture, material);

				const WINDOW_HEIGHT = window.innerHeight;

				if ( WINDOW_HEIGHT < 1000 && WINDOW_HEIGHT > 850 ) {
					object.scale.x = 0.8;
					object.scale.y = 0.8;
					object.scale.z = 0.8;
				}
				else if ( WINDOW_HEIGHT < 850 && WINDOW_HEIGHT > 700 ) {
					object.scale.x = 0.65;
					object.scale.y = 0.65;
					object.scale.z = 0.65;
				}
				else if ( WINDOW_HEIGHT < 700 ) {
					object.scale.x = 0.5;
					object.scale.y = 0.5;
					object.scale.z = 0.5;
				}

				object.name = name;

				objects.push(object);
				R.json[type][name] = object;
			}
		}

		for ( let i = 0; i < files.length; i++ ) {

			if ( R.json[type][files[i]] === undefined ) {

				let url  = templateDirectoryUri + '/rugbuilder/json/' + folder + '/' + files[i] + '.json';
				let name = files[i];

				new THREE.BufferGeometryLoader().load(url, loadCompleted(name));
			}
			else {
				objects.push(R.json[type][files[i]]);
			}
				
		}

		let interval = setInterval(function() {

			if ( files.length === objects.length ) {
				res();
				clearInterval(interval)
			}
		}, 100)
	});
}

function _updateScene(R, type) {

	return new Promise((res, rej) => {

		const CHILDREN_LENGTH = R.scene.children.length;

		let firstMesh;

		for ( let i = 0; i < CHILDREN_LENGTH; i++ ) {
			
			if ( R.scene.children[i].type === 'Mesh' ) {
				firstMesh = i;
				break;
			}
		}

		for ( let i2 = 0; i2 < CHILDREN_LENGTH; i2++ ) {
			R.scene.remove(R.scene.children[firstMesh]);
		}

		Object.keys(R.json[type]).forEach((key) => {

			R.scene.add(R.json[type][key]);

			if ( R.centerMaterial !== undefined && key === 'center' ) {
				R.scene.children[R.scene.children.length-1].material = R.loadedTextures[R.centerMaterial];
			}
		})

		PubSub.publish('borderUpdate', type);

		R.loadingScreens('full', 'close');
		
		res();
	})
}