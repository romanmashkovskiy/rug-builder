<?php
/**
 * Template Name: RugBuilder
 *
 * The rugbuilder page template
 *
 * @package Hogarths
 * @since Hogarths 1.0
 */
?>

<!doctype html>
<html>
<head>
	<title>RugBuilder</title>
	<style>
	html, body {
		margin: 0;
	}
	canvas {
		height: 100%;
		width: 100%;
	}
	</style>
</head>
<body>
	<a href="#" onclick="loadSingle()">Load Single</a>&nbsp;&nbsp;
	<a href="#" onclick="loadSingleLow()">Load Single Low</a>&nbsp;&nbsp;
	<a href="#" onclick="loadDouble()">Load Double</a>&nbsp;&nbsp;
	<a href="#" onclick="loadDoubleLow()">Load Double Low</a>&nbsp;&nbsp;
	<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r79/three.min.js"></script>
	<script>
	THREE.OrbitControls=function(e,t){function n(){return 2*Math.PI/60/60*x.autoRotateSpeed}function o(){return Math.pow(.95,x.zoomSpeed)}function a(e){Y.theta-=e}function i(e){Y.phi-=e}function r(e){x.object instanceof THREE.PerspectiveCamera?F/=e:x.object instanceof THREE.OrthographicCamera?(x.object.zoom=Math.max(x.minZoom,Math.min(x.maxZoom,x.object.zoom*e)),x.object.updateProjectionMatrix(),X=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),x.enableZoom=!1)}function s(e){x.object instanceof THREE.PerspectiveCamera?F*=e:x.object instanceof THREE.OrthographicCamera?(x.object.zoom=Math.max(x.minZoom,Math.min(x.maxZoom,x.object.zoom/e)),x.object.updateProjectionMatrix(),X=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),x.enableZoom=!1)}function c(e){K.set(e.clientX,e.clientY)}function u(e){Q.set(e.clientX,e.clientY)}function m(e){G.set(e.clientX,e.clientY)}function l(e){_.set(e.clientX,e.clientY),B.subVectors(_,K);var t=x.domElement===document?x.domElement.body:x.domElement;a(2*Math.PI*B.x/t.clientWidth*x.rotateSpeed),i(2*Math.PI*B.y/t.clientHeight*x.rotateSpeed),K.copy(_),x.update()}function d(e){J.set(e.clientX,e.clientY),$.subVectors(J,Q),$.y>0?r(o()):$.y<0&&s(o()),Q.copy(J),x.update()}function E(e){W.set(e.clientX,e.clientY),q.subVectors(W,G),ne(q.x,q.y),G.copy(W),x.update()}function h(e){}function p(e){var t=0;void 0!==e.wheelDelta?t=e.wheelDelta:void 0!==e.detail&&(t=-e.detail),t>0?s(o()):0>t&&r(o()),x.update()}function b(e){switch(e.keyCode){case x.keys.UP:ne(0,x.keyPanSpeed),x.update();break;case x.keys.BOTTOM:ne(0,-x.keyPanSpeed),x.update();break;case x.keys.LEFT:ne(x.keyPanSpeed,0),x.update();break;case x.keys.RIGHT:ne(-x.keyPanSpeed,0),x.update()}}function f(e){K.set(e.touches[0].pageX,e.touches[0].pageY)}function T(e){var t=e.touches[0].pageX-e.touches[1].pageX,n=e.touches[0].pageY-e.touches[1].pageY,o=Math.sqrt(t*t+n*n);Q.set(0,o)}function v(e){G.set(e.touches[0].pageX,e.touches[0].pageY)}function g(e){_.set(e.touches[0].pageX,e.touches[0].pageY),B.subVectors(_,K);var t=x.domElement===document?x.domElement.body:x.domElement;a(2*Math.PI*B.x/t.clientWidth*x.rotateSpeed),i(2*Math.PI*B.y/t.clientHeight*x.rotateSpeed),K.copy(_),x.update()}function R(e){var t=e.touches[0].pageX-e.touches[1].pageX,n=e.touches[0].pageY-e.touches[1].pageY,a=Math.sqrt(t*t+n*n);J.set(0,a),$.subVectors(J,Q),$.y>0?s(o()):$.y<0&&r(o()),Q.copy(J),x.update()}function O(e){W.set(e.touches[0].pageX,e.touches[0].pageY),q.subVectors(W,G),ne(q.x,q.y),G.copy(W),x.update()}function H(e){}function y(e){if(x.enabled!==!1){if(e.preventDefault(),e.button===x.mouseButtons.ORBIT){if(x.enableRotate===!1)return;c(e),V=S.ROTATE}else if(e.button===x.mouseButtons.ZOOM){if(x.enableZoom===!1)return;u(e),V=S.DOLLY}else if(e.button===x.mouseButtons.PAN){if(x.enablePan===!1)return;m(e),V=S.PAN}V!==S.NONE&&(document.addEventListener("mousemove",w,!1),document.addEventListener("mouseup",P,!1),document.addEventListener("mouseout",P,!1),x.dispatchEvent(k))}}function w(e){if(x.enabled!==!1)if(e.preventDefault(),V===S.ROTATE){if(x.enableRotate===!1)return;l(e)}else if(V===S.DOLLY){if(x.enableZoom===!1)return;d(e)}else if(V===S.PAN){if(x.enablePan===!1)return;E(e)}}function P(e){x.enabled!==!1&&(h(e),document.removeEventListener("mousemove",w,!1),document.removeEventListener("mouseup",P,!1),document.removeEventListener("mouseout",P,!1),x.dispatchEvent(U),V=S.NONE)}function j(e){x.enabled===!1||x.enableZoom===!1||V!==S.NONE&&V!==S.ROTATE||(e.preventDefault(),e.stopPropagation(),p(e),x.dispatchEvent(k),x.dispatchEvent(U))}function L(e){x.enabled!==!1&&x.enableKeys!==!1&&x.enablePan!==!1&&b(e)}function M(e){if(x.enabled!==!1){switch(e.touches.length){case 1:if(x.enableRotate===!1)return;f(e),V=S.TOUCH_ROTATE;break;case 2:if(x.enableZoom===!1)return;T(e),V=S.TOUCH_DOLLY;break;case 3:if(x.enablePan===!1)return;v(e),V=S.TOUCH_PAN;break;default:V=S.NONE}V!==S.NONE&&x.dispatchEvent(k)}}function C(e){if(x.enabled!==!1)switch(e.preventDefault(),e.stopPropagation(),e.touches.length){case 1:if(x.enableRotate===!1)return;if(V!==S.TOUCH_ROTATE)return;g(e);break;case 2:if(x.enableZoom===!1)return;if(V!==S.TOUCH_DOLLY)return;R(e);break;case 3:if(x.enablePan===!1)return;if(V!==S.TOUCH_PAN)return;O(e);break;default:V=S.NONE}}function N(e){x.enabled!==!1&&(H(e),x.dispatchEvent(U),V=S.NONE)}function A(e){e.preventDefault()}this.object=e,this.domElement=void 0!==t?t:document,this.enabled=!0,this.target=new THREE.Vector3,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-(1/0),this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.25,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.keyPanSpeed=7,this.autoRotate=!1,this.autoRotateSpeed=2,this.enableKeys=!0,this.keys={LEFT:37,UP:38,RIGHT:39,BOTTOM:40},this.mouseButtons={ORBIT:THREE.MOUSE.LEFT,ZOOM:THREE.MOUSE.MIDDLE,PAN:THREE.MOUSE.RIGHT},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this.getPolarAngle=function(){return z.phi},this.getAzimuthalAngle=function(){return z.theta},this.reset=function(){x.target.copy(x.target0),x.object.position.copy(x.position0),x.object.zoom=x.zoom0,x.object.updateProjectionMatrix(),x.dispatchEvent(D),x.update(),V=S.NONE},this.update=function(){var t=new THREE.Vector3,o=(new THREE.Quaternion).setFromUnitVectors(e.up,new THREE.Vector3(0,1,0)),i=o.clone().inverse(),r=new THREE.Vector3,s=new THREE.Quaternion;return function(){var e=x.object.position;return t.copy(e).sub(x.target),t.applyQuaternion(o),z.setFromVector3(t),x.autoRotate&&V===S.NONE&&a(n()),z.theta+=Y.theta,z.phi+=Y.phi,z.theta=Math.max(x.minAzimuthAngle,Math.min(x.maxAzimuthAngle,z.theta)),z.phi=Math.max(x.minPolarAngle,Math.min(x.maxPolarAngle,z.phi)),z.makeSafe(),z.radius*=F,z.radius=Math.max(x.minDistance,Math.min(x.maxDistance,z.radius)),x.target.add(I),t.setFromSpherical(z),t.applyQuaternion(i),e.copy(x.target).add(t),x.object.lookAt(x.target),x.enableDamping===!0?(Y.theta*=1-x.dampingFactor,Y.phi*=1-x.dampingFactor):Y.set(0,0,0),F=1,I.set(0,0,0),X||r.distanceToSquared(x.object.position)>Z||8*(1-s.dot(x.object.quaternion))>Z?(x.dispatchEvent(D),r.copy(x.object.position),s.copy(x.object.quaternion),X=!1,!0):!1}}(),this.dispose=function(){x.domElement.removeEventListener("contextmenu",A,!1),x.domElement.removeEventListener("mousedown",y,!1),x.domElement.removeEventListener("mousewheel",j,!1),x.domElement.removeEventListener("MozMousePixelScroll",j,!1),x.domElement.removeEventListener("touchstart",M,!1),x.domElement.removeEventListener("touchend",N,!1),x.domElement.removeEventListener("touchmove",C,!1),document.removeEventListener("mousemove",w,!1),document.removeEventListener("mouseup",P,!1),document.removeEventListener("mouseout",P,!1),window.removeEventListener("keydown",L,!1)};var x=this,D={type:"change"},k={type:"start"},U={type:"end"},S={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_DOLLY:4,TOUCH_PAN:5},V=S.NONE,Z=1e-6,z=new THREE.Spherical,Y=new THREE.Spherical,F=1,I=new THREE.Vector3,X=!1,K=new THREE.Vector2,_=new THREE.Vector2,B=new THREE.Vector2,G=new THREE.Vector2,W=new THREE.Vector2,q=new THREE.Vector2,Q=new THREE.Vector2,J=new THREE.Vector2,$=new THREE.Vector2,ee=function(){var e=new THREE.Vector3;return function(t,n){e.setFromMatrixColumn(n,0),e.multiplyScalar(-t),I.add(e)}}(),te=function(){var e=new THREE.Vector3;return function(t,n){e.setFromMatrixColumn(n,1),e.multiplyScalar(t),I.add(e)}}(),ne=function(){var e=new THREE.Vector3;return function(t,n){var o=x.domElement===document?x.domElement.body:x.domElement;if(x.object instanceof THREE.PerspectiveCamera){var a=x.object.position;e.copy(a).sub(x.target);var i=e.length();i*=Math.tan(x.object.fov/2*Math.PI/180),ee(2*t*i/o.clientHeight,x.object.matrix),te(2*n*i/o.clientHeight,x.object.matrix)}else x.object instanceof THREE.OrthographicCamera?(ee(t*(x.object.right-x.object.left)/x.object.zoom/o.clientWidth,x.object.matrix),te(n*(x.object.top-x.object.bottom)/x.object.zoom/o.clientHeight,x.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),x.enablePan=!1)}}();x.domElement.addEventListener("contextmenu",A,!1),x.domElement.addEventListener("mousedown",y,!1),x.domElement.addEventListener("mousewheel",j,!1),x.domElement.addEventListener("MozMousePixelScroll",j,!1),x.domElement.addEventListener("touchstart",M,!1),x.domElement.addEventListener("touchend",N,!1),x.domElement.addEventListener("touchmove",C,!1),window.addEventListener("keydown",L,!1),this.update()},THREE.OrbitControls.prototype=Object.create(THREE.EventDispatcher.prototype),THREE.OrbitControls.prototype.constructor=THREE.OrbitControls,Object.defineProperties(THREE.OrbitControls.prototype,{center:{get:function(){return console.warn("THREE.OrbitControls: .center has been renamed to .target"),this.target}},noZoom:{get:function(){return console.warn("THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead."),!this.enableZoom},set:function(e){console.warn("THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead."),this.enableZoom=!e}},noRotate:{get:function(){return console.warn("THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead."),!this.enableRotate},set:function(e){console.warn("THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead."),this.enableRotate=!e}},noPan:{get:function(){return console.warn("THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead."),!this.enablePan},set:function(e){console.warn("THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead."),this.enablePan=!e}},noKeys:{get:function(){return console.warn("THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead."),!this.enableKeys},set:function(e){console.warn("THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead."),this.enableKeys=!e}},staticMoving:{get:function(){return console.warn("THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead."),!this.enableDamping},set:function(e){console.warn("THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead."),this.enableDamping=!e}},dynamicDampingFactor:{get:function(){return console.warn("THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead."),this.dampingFactor},set:function(e){console.warn("THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead."),this.dampingFactor=e}}});
	</script>
	<script>

	var loadSingle    = function() { alert('Not loaded yet!'); }
	var loadSingleLow = function() { alert('Not loaded yet!'); }
	var loadDouble    = function() { alert('Not loaded yet!'); }
	var loadDoubleLow = function() { alert('Not loaded yet!'); }

	var biscayne, cotton, bmap, bmap2;

	new THREE.TextureLoader().load(
		'<?php echo get_template_directory_uri(); ?>/rugbuilder/img/biscayne-bs105-bmap.jpg',
		function( texture ) {

			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			texture.anisotropy = renderer.getMaxAnisotropy();
			texture.repeat.set(5,5);

			bmap = texture;
		}
	);

	new THREE.TextureLoader().load(
		'<?php echo get_template_directory_uri(); ?>/rugbuilder/img/cotton-herringbone-bmap.jpg',
		function( texture ) {

			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			texture.anisotropy = renderer.getMaxAnisotropy();
			texture.repeat.set(5,5);

			bmap2 = texture;
		}
	);

	var scene    = new THREE.Scene();
	var camera   = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 10000 );
	var renderer = new THREE.WebGLRenderer();

	camera.position.x = -58.25551669838936;
	camera.position.y = 103.7487525991614;
	camera.position.z = 132.44381733713013;

	camera.rotation.x = -0.6645005541912388;
	camera.rotation.y = -0.33334042300972533;
	camera.rotation.z = -0.25090904322969587;

	renderer.setSize( window.innerWidth, window.innerHeight );

	/*
	spotlight

	{
                "uuid": "168E9E98-9DF4-4C85-9AC9-78A88FB6ED02",
                "type": "SpotLight",
                "name": "SpotLight 1",
                "matrix": [1,0,0,0,0,1,0,0,0,0,1,0,177.8850860595703,295.90283203125,-383.4111022949219,1],
                "color": 16777215,
                "intensity": 1,
                "distance": 0,
                "angle": 0.3141592653589793,
                "decay": 1,
                "penumbra": 0,
                "shadow": {
                    "camera": {
                        "uuid": "85704523-A9B4-4C92-81ED-3FEBC628891B",
                        "type": "PerspectiveCamera",
                        "fov": 50,
                        "zoom": 1,
                        "near": 0.5,
                        "far": 500,
                        "focus": 10,
                        "aspect": 1,
                        "filmGauge": 35,
                        "filmOffset": 0
                    }
                }
            },
            {
                "uuid": "B9B2AF87-BC59-44B4-B451-44893197C5B1",
                "type": "SpotLight",
                "name": "SpotLight 2",
                "matrix": [1,0,0,0,0,1,0,0,0,0,1,0,385.489501953125,224.93087768554688,-143.64881896972656,1],
                "color": 16777215,
                "intensity": 0.28,
                "distance": 0,
                "angle": 0.3141592653589793,
                "decay": 1,
                "penumbra": 0,
                "shadow": {
                    "camera": {
                        "uuid": "E684C3B5-C7A0-4442-A5AC-BC3BCEDC9168",
                        "type": "PerspectiveCamera",
                        "fov": 50,
                        "zoom": 1,
                        "near": 0.5,
                        "far": 500,
                        "focus": 10,
                        "aspect": 1,
                        "filmGauge": 35,
                        "filmOffset": 0
                    }
	*/

	var ambientLight     = new THREE.AmbientLight( 0xffffff );
	var directionalLight = new THREE.DirectionalLight( 0xffffff );

	directionalLight.position.set( 0, 0, 1 );

	scene.add( camera )
	scene.add( ambientLight );
	scene.add( directionalLight );

	var singleFiles   = ['border-east', 'border-north', 'border-south', 'border-west', 'center', 'stitches', 'trim-east', 'trim-north', 'trim-south', 'trim-west'];
	var singleObjects = [];

	var manager = new THREE.LoadingManager();
	manager.onLoad = function(a,b,c) {
		console.log('onload')
		console.log(a)
		console.log(b)
		console.log(c)
	}
	manager.onProgress = function ( item, loaded, total ) {
		console.log( item, loaded, total );
	};

	function loadCompleted( name ) {
		return function( texture ) {

			var material = new THREE.MeshLambertMaterial( { color: 0xdddddd } );
			var object   = new THREE.Mesh(texture, material);

			object.name = name;

			singleObjects.push(object)
		}
	}


	for ( var i = 0; i < singleFiles.length; i++ ) {

		var url  = '<?php echo get_template_directory_uri(); ?>/rugbuilder/json/single/' + singleFiles[i] + '.json';
		var name = singleFiles[i];

		new THREE.BufferGeometryLoader().load(url, loadCompleted(name));
	}

	var interval = setInterval(function() {

		if ( singleFiles.length === singleObjects.length ) {
			loaded();
		}
	}, 1000)

	function loaded() {

		clearInterval( interval );

		for ( var i2 = 0; i2 < singleObjects.length; i2++ ) {
			scene.add( singleObjects[i2] );
		}

		new THREE.TextureLoader().load(

			'<?php echo get_template_directory_uri(); ?>/rugbuilder/img/biscayne-bs105.jpg',
			function( texture ) {

				for ( var t = 3; t < scene.children.length; t++ ) {

					if ( scene.children[t].name === 'center' ) {

						texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
						texture.anisotropy = renderer.getMaxAnisotropy();
						texture.repeat.set(5,5);

						var mesh = new THREE.MeshPhongMaterial({
							map       : texture,
							bumpMap   : bmap,
							bumpScale : 2,
							shininess : 15
						});

						scene.children[t].material = mesh;

						biscayne = mesh;
					}
				}
			}
		);

		new THREE.TextureLoader().load(

			'<?php echo get_template_directory_uri(); ?>/rugbuilder/img/cotton-herringbone.jpg',
			function( texture ) {

				for ( var t = 3; t < scene.children.length; t++ ) {

					if ( scene.children[t].name !== 'center' ) {

						texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
						texture.anisotropy = renderer.getMaxAnisotropy();
						texture.repeat.set(5,5);

						var mesh = new THREE.MeshPhongMaterial({
							map       : texture,
							bumpMap   : bmap2,
							bumpScale : 2,
							shininess : 15
						});

						scene.children[t].material = mesh;

						cotton = mesh;
					}						
				}
			}
		);

		loadSingle = function() {

			var length = scene.children.length;
			
			for ( var r = 3; r < length; r++ ) {
				scene.remove( scene.children[3] );
			}

			for ( l = 0; l < singleObjects.length; l++ ) {
				scene.add( singleObjects[l] );
			}
		}

		var orbitControls = new THREE.OrbitControls( camera );

		function render() {
			requestAnimationFrame( render );
			renderer.render( scene, camera );
		}

		render();

		function loadOtherJSON() {

			function loadCompleted2( name, obj ) {
				return function( texture ) {

					var material = new THREE.MeshLambertMaterial( { color: 0xdddddd } );
					var object   = new THREE.Mesh(texture, material);

					object.name = name;

					obj.push(object)
				}				
			}

			var singleLowFiles   = ['border-east', 'border-north', 'border-south', 'border-west', 'center', 'stitches', 'trim-east', 'trim-north', 'trim-south', 'trim-west'];
			var singleLowObjects = [];

			var doubleFiles   = ['border-inner-east', 'border-inner-north', 'border-inner-south', 'border-inner-west', 'border-outer-east', 'border-outer-north', 'border-outer-south', 'border-outer-west', 'center', 'stitches'];
			var doubleObjects = [];

			var doubleLowFiles   = ['border-inner-east', 'border-inner-north', 'border-inner-south', 'border-inner-west', 'border-outer-east', 'border-outer-north', 'border-outer-south', 'border-outer-west', 'center', 'stitches'];
			var doubleLowObjects = [];

			for ( var i3 = 0; i3 < singleLowFiles.length; i3++ ) {

				var url  = '<?php echo get_template_directory_uri(); ?>/rugbuilder/json/single-low/' + singleLowFiles[i3] + '.json';
				var name = singleLowFiles[i3];

				new THREE.BufferGeometryLoader().load(url, loadCompleted2(name, singleLowObjects));
			}

			for ( var i4 = 0; i4 < doubleFiles.length; i4++ ) {

				var url  = '<?php echo get_template_directory_uri(); ?>/rugbuilder/json/double/' + doubleFiles[i4] + '.json';
				var name = doubleFiles[i4];

				new THREE.BufferGeometryLoader().load(url, loadCompleted2(name, doubleObjects));
			}

			for ( var i5 = 0; i5 < doubleLowFiles.length; i5++ ) {

				var url  = '<?php echo get_template_directory_uri(); ?>/rugbuilder/json/double-low/' + doubleLowFiles[i5] + '.json';
				var name = doubleLowFiles[i5];

				new THREE.BufferGeometryLoader().load(url, loadCompleted2(name, doubleLowObjects));
			}

			function addMaterial() {
				for ( var t = 3; t < scene.children.length; t++ ) {
					if ( scene.children[t].name === 'center' ) {
						scene.children[t].material = biscayne;
					} else {
						scene.children[t].material = cotton;
					}
				}
			}

			var interval2 = setInterval(function() {

				if ( singleLowFiles.length === singleLowObjects.length ) {

					loadSingleLow = function() {

						var length = scene.children.length;
						
						for ( var r = 3; r < length; r++ ) {
							scene.remove( scene.children[3] );
						}

						for ( l = 0; l < singleLowObjects.length; l++ ) {
							scene.add( singleLowObjects[l] );
						}

						addMaterial();
					}

					clearInterval( interval2 );
				}
			}, 1000)

			var interval3 = setInterval(function() {

				if ( doubleFiles.length === doubleObjects.length ) {

					loadDouble = function() {

						var length = scene.children.length;
						
						for ( var r = 3; r < length; r++ ) {
							scene.remove( scene.children[3] );
						}

						for ( l = 0; l < doubleObjects.length; l++ ) {
							scene.add( doubleObjects[l] );
						}

						addMaterial();
					}

					clearInterval( interval3 );
				}
			}, 1000)

			var interval4 = setInterval(function() {

				if ( doubleLowFiles.length === doubleLowObjects.length ) {

					loadDoubleLow = function() {

						var length = scene.children.length;
						
						for ( var r = 3; r < length; r++ ) {
							scene.remove( scene.children[3] );
						}

						for ( l = 0; l < doubleLowObjects.length; l++ ) {
							scene.add( doubleLowObjects[l] );
						}

						addMaterial();
					}

					clearInterval( interval4 );
				}
			}, 1000)
		}

		loadOtherJSON();
	}

	document.body.appendChild(renderer.domElement);

	</script>
</body>
</html>