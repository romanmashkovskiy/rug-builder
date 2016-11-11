RugBuilder.prototype.updateBorder = function(border) {

	const R = rugBuilder;

	let files = [];

	return new Promise((res, rej) => {

		switch (border) {

			case 'Single Border' :

				files = ['border-east', 'border-north', 'border-south', 'border-west', 'center', 'stitches'];

				_loadFiles(files, 'single')
					.then((objects) => { return _updateScene(objects, R) })
					.then(()        => { res() })
					.catch(()       => { alert('error loading border') });

				break;

			case 'Single & Piping' :

				files = ['border-east', 'border-north', 'border-south', 'border-west', 'center', 'stitches', 'trim-east', 'trim-north', 'trim-south', 'trim-west'];

				_loadFiles(files, 'single')
					.then((objects) => { return _updateScene(objects, R) })
					.then(()        => { res() })
					.catch(()       => { alert('error loading border') });

				break;

			case 'Double Border' :

				files = ['border-inner-east', 'border-inner-north', 'border-inner-south', 'border-inner-west', 'border-outer-east', 'border-outer-north', 'border-outer-south', 'border-outer-west', 'center', 'stitches'];

				_loadFiles(files, 'double')
					.then((objects) => { return _updateScene(objects, R) })
					.then(()        => { res() })
					.catch(()       => { alert('error loading border') });

				break;
		}
	});
}

function _loadFiles(files, type) {

	return new Promise((res, rej) => {

		var objects = [];

		function loadCompleted(name) {

			return function( texture ) {

				var material = new THREE.MeshLambertMaterial( { color: 0xdddddd } );
				var object   = new THREE.Mesh(texture, material);

				object.name = name;

				objects.push(object);
			}
		}

		for ( var i = 0; i < files.length; i++ ) {

			var url  = templateDirectoryUri + '/rugbuilder/json/' + type + '/' + files[i] + '.json';
			var name = files[i];

			new THREE.BufferGeometryLoader().load(url, loadCompleted(name));
		}

		var interval = setInterval(function() {

			if ( files.length === objects.length ) {
				res(objects);
				clearInterval(interval)
			}
		}, 1000)
	});
}

function _updateScene(objects, R) {

	return new Promise((res, rej) => {

		R._objects = objects;

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

		for ( let i3 = 0; i3 < R._objects.length; i3++ ) {
			R.scene.add(R._objects[i3]);
		}

		res();
	})
}