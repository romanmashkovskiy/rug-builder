RugBuilder.prototype.updateBorder = function(border) {

	const R = rugBuilder;

	let files = [];

	switch (border) {

		case 'Single Border' :

			files = ['border-east', 'border-north', 'border-south', 'border-west', 'center', 'stitches'];

			_loadFiles(files, 'single')
				.then((objects) => { _updateScene(objects, R) })
				.catch(()       => { alert('error loading border') });

			break;

		case 'Single & Piping' :

			files = ['border-east', 'border-north', 'border-south', 'border-west', 'center', 'stitches', 'trim-east', 'trim-north', 'trim-south', 'trim-west'];

			_loadFiles(files, 'single')
				.then((objects) => { _updateScene(objects, R) })
				.catch(()       => { alert('error loading border') });

			break;

		case 'Double Border' :

			files = ['border-inner-east', 'border-inner-north', 'border-inner-south', 'border-inner-west', 'border-outer-east', 'border-outer-north', 'border-outer-south', 'border-outer-west', 'center', 'stitches'];

			_loadFiles(files, 'double')
				.then((objects) => { _updateScene(objects, R) })
				.catch(()       => { alert('error loading border') });

			break;
	}
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
			}
		}, 1000)
	});
}

function _updateScene(objects, R) {

	R._objects = objects;

	const CHILDREN_LENGTH = R._scene.children.length;

	let firstMesh;

	for ( let i = 0; i < CHILDREN_LENGTH; i++ ) {
		
		if ( R._scene.children[i].type === 'Mesh' ) {
			firstMesh = i;
			break;
		}
	}

	for ( let i2 = 0; i2 < CHILDREN_LENGTH; i2++ ) {
		R._scene.remove(R._scene.children[firstMesh]);
	}

	for ( let i3 = 0; i3 < R._objects.length; i3++ ) {
		R._scene.add(R._objects[i3]);
	}
}