import React, { Component } from 'react';
import * as THREE from 'three';
import * as OBJLoader from 'three-obj-loader';
import * as OrbitControls from 'three-orbit-controls';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loadWithPromise } from '../../utils/load-with-promise';

import './rug.css';

OBJLoader(THREE);
const OrbitControl = OrbitControls(THREE);
const textureLoader = new THREE.TextureLoader();

const materialDef = new THREE.MeshPhongMaterial({
	color: 0x555555,
});


class Rug extends Component {

	constructor(props) {
		super(props);
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);

		this.camera.position.x = 0.000001;
		this.camera.position.y = 170;
		this.camera.position.z = 0;

		this.camera.rotation.x = -1.5708;
		this.camera.rotation.y = 0;
		this.camera.rotation.z = 1.5708;


		this.scene.add(this.camera);

		const light = new THREE.AmbientLight();
		this.scene.add(light);

		const dirLight = new THREE.DirectionalLight(0xffffff, 0.3);
		this.scene.add(dirLight);
	}

	async objectLoader() {
		const objectLoader = new this.THREE.OBJLoader();

		let rugFile;
		if (this.props.border === 'DOUBLE-BORDER') {
			rugFile = 'double.obj';
		} else if (this.props.border === 'BORDER-PIPING') {
			rugFile = 'piping.obj';
		} else {
			rugFile = 'single.obj';
		}

		try {
			const object = await loadWithPromise(rugFile, objectLoader);
			for (let i = 0; i < object.children.length; i++) {
				object.children[i].material = materialDef;
			}
			this.object = object;
			this.scene.add(object);
		} catch (e) {
			console.log(e);
		}
	}

	async updateMap(urlTexture, urlBumpMap, urlNormalMap, rugPart) {
		if (urlTexture === '') {
			for (let i = 0; i < this.object.children.length; i += 1) {
				if (this.object.children[i] instanceof THREE.Mesh && this.object.children[i].name.indexOf(rugPart) !== -1) {
					this.object.children[i].material = materialDef;
				}
			}
			return;
		}

		const textures = {
			color: 0x555555
		};

		try {
			textures.bumpMap = await loadWithPromise(urlBumpMap, textureLoader);
		} catch (e) {
			textures.bumpMap = null;
			console.log(e);
		}

		try {
			textures.normalMap = await loadWithPromise(urlNormalMap, textureLoader);
		} catch (e) {
			textures.normalMap = null;
			console.log(e);
		}

		try {
			textures.map = await loadWithPromise(urlTexture, textureLoader);
			textures.map.wrapS = textures.map.wrapT = THREE.RepeatWrapping;
			textures.map.repeat.set(6, 6);
			const materialWithTexture = new THREE.MeshPhongMaterial(textures);

			for (let i = 0; i < this.object.children.length; i += 1) {
				if (this.object.children[i] instanceof THREE.Mesh && this.object.children[i].name.indexOf(rugPart) !== -1) {
					this.object.children[i].material = materialWithTexture;
				}
			}
		} catch (e) {
			console.log(e);
		}
	}

	calculateUrlsForTextures(rugPart) {
		console.log('rugPart', rugPart)
		if (rugPart.thumb) {
			const keyTexture = Object.keys(rugPart.thumb)[0];
			const keyBumpMap = Object.keys(rugPart.bmap)[0];
			const keyNormalMap = Object.keys(rugPart.nmap)[0];
			const urlTexture = rugPart.thumb[keyTexture].full_url;
			const urlBumpMap = rugPart.bmap instanceof Array ? '' : rugPart.bmap[keyBumpMap].full_url;
			const urlNormalMap = rugPart.nmap instanceof Array ? '' : rugPart.nmap[keyNormalMap].full_url;

			return [urlTexture, urlBumpMap, urlNormalMap]
		} else {
			return ['', '', ''];
		}
	}

	changeView(currentView) {
		this.camera.updateProjectionMatrix();
		this.controls.reset();

		if (currentView === 'above-horizontal') {
			this.camera.position.x = 0.000001;
			this.camera.position.y = 170;
			this.camera.position.z = 0;

			this.camera.rotation.x = -1.5708;
			this.camera.rotation.y = 0;
			this.camera.rotation.z = 1.5708;
		}

		if (currentView === 'angled') {
			this.camera.position.x = 150;
			this.camera.position.y = 97.86732004062627;
			this.camera.position.z = 108.5265830159921;

			this.camera.rotation.x = -0.7337987907741792;
			this.camera.rotation.y = 0.47612198934967903;
			this.camera.rotation.z = 0.3919353811096299;
		}

		if (currentView === 'angled-horizontal') {
			this.camera.position.x = -65;
			this.camera.position.y = 146.97868270469004;
			this.camera.position.z = 0.00630814379798243;

			this.camera.rotation.x = -1.5707534317349763;
			this.camera.rotation.y = -0.5996570925812806;
			this.camera.rotation.z = -1.5707203029033585;
		}

		if (currentView === 'above-vertical') {
			this.camera.position.x = 0;
			this.camera.position.y = 170;
			this.camera.position.z = 0;

			this.camera.rotation.x = -1.5708;
			this.camera.rotation.y = 0;
			this.camera.rotation.z = 0;
		}
	}

	cameraZoom(zoom) {
		this.camera.zoom = zoom;
		this.camera.updateProjectionMatrix();
	}

	async getFloar() {
		var geometry = new THREE.PlaneGeometry(700, 700);

		const textures = {
			color: 0x555555
		};

		try {
			textures.map = await loadWithPromise('floor-texture.jpg', textureLoader);
			textures.map.wrapS = textures.map.wrapT = THREE.RepeatWrapping;
			textures.map.repeat.set(6, 6);
		} catch (e) {
			textures.map = null;
			console.log(e);
		}

		try {
			textures.bumpMap = await loadWithPromise('floor-bmap.jpg', textureLoader);
		} catch (e) {
			textures.bumpMap = null;
			console.log(e);
		}

		textures.transparent = true
		textures.opacity = true

		var material = new THREE.MeshPhongMaterial(textures);
		var floor = new THREE.Mesh(geometry, material);
		floor.rotateOnAxis(new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(-90));
		this.scene.add(floor);
	}

	async componentDidMount() {
		const resize = () => {
			this.renderer.setSize(container.offsetWidth, container.offsetHeight);
			this.camera.aspect = container.offsetWidth / container.offsetHeight;
			this.camera.updateProjectionMatrix();
		};

		this.THREE = THREE;

		const container = document.getElementById("root-for-rug");

		this.controls = new OrbitControl(this.camera, container);
		this.controls.enableZoom = false;
		this.controls.minPolarAngle = 0;
		this.controls.maxPolarAngle = Math.PI / 2 - 0.15;

		this.camera.zoom = 2;

		this.getFloar()

		this.objectLoader();

		// const axesHelper = new THREE.AxesHelper(500);
		// this.scene.add(axesHelper);

		this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

		this.renderer.setSize(container.offsetWidth, container.offsetHeight);

		this.camera.aspect = container.offsetWidth / container.offsetHeight;
		this.camera.updateProjectionMatrix();

		window.onresize = resize;

		const animate = () => {
			requestAnimationFrame(animate);
			this.controls.update();
			this.renderer.render(this.scene, this.camera);
		};
		animate();

		container.appendChild(this.renderer.domElement);
	}


	async componentDidUpdate(prevProps) {
		if (prevProps.border !== this.props.border) {
			this.scene.remove(this.object);
			await this.objectLoader();
		}

		this.updateMap(...this.calculateUrlsForTextures(this.props.centre), 'Centre');
		this.updateMap(...this.calculateUrlsForTextures(this.props.piping), 'Trim');
		this.updateMap(...this.calculateUrlsForTextures(this.props.outerBorder), 'Outer');
		this.updateMap(...this.calculateUrlsForTextures(this.props.innerBorder), 'Inner');

		this.changeView(this.props.currentRugView);
		this.cameraZoom(this.props.currentZoom);
	}

	render() {
		return (
			<div id="root-for-rug">
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		border: state.border,
		centre: state.centre,
		outerBorder: state.outerBorder,
		innerBorder: state.innerBorder,
		piping: state.piping,
		currentRugView: state.currentRugView,
		currentZoom: state.currentZoom
	};
};

const matchDispatchToProps = (dispatch) => {
	return bindActionCreators({},
		dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(Rug);