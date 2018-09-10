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
	color: 0xcccccc,
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

		this.camera.position.x = -1;
		this.camera.position.y = 170;
		this.camera.position.z = 0;

		this.scene.add(this.camera);
	}

	addLight() {
		var hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 0.5);
		this.scene.add(hemiLight);

		var keyLight2 = new THREE.PointLight(0xffffff, 1, 150);
		keyLight2.position.set(0, 50, 60);
		keyLight2.castShadow = true;
		keyLight2.rotation.x = 45;
		this.scene.add(keyLight2)

		var fillLight = new THREE.PointLight(0xffffff, 1, 75);
		fillLight.position.set(0, 50, -60);
		fillLight.castShadow = true;
		fillLight.rotation.x = 45;
		this.scene.add(fillLight)
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
				object.children[i].castShadow = true;
				object.children[i].receiveShadow = false;
				object.children[i].scale.set(0.5, 0.5, 0.5);
				object.children[i].material = materialDef;
			}
			this.object = object;
			this.scene.add(object);
		} catch (e) {
			console.log(e);
		}
	}

	async getFloor() {
		var floorRepeatX = 8;
		var floorRepeatY = 8;
		var floorBumpScale = 1.5;
		var floorShininess = 20;

		var geometry = new THREE.PlaneGeometry(500, 500, 50, 5);

		const textures = {
			shininess: floorShininess,
			bumpScale: floorBumpScale,
		};

		try {
			textures.map = await loadWithPromise('floor-texture.jpg', textureLoader);
			textures.map.wrapS = textures.map.wrapT = THREE.RepeatWrapping;
			textures.map.repeat.set(floorRepeatX, floorRepeatY);
			textures.map.anisotropy = 16
		} catch (e) {
			textures.map = null;
			console.log(e);
		}

		try {
			textures.bumpMap = await loadWithPromise('floor-bmap.jpg', textureLoader);
			textures.bumpMap.wrapS = textures.bumpMap.wrapT = THREE.RepeatWrapping;
			textures.bumpMap.repeat.set(floorRepeatX, floorRepeatY);
			textures.map.anisotropy = 16
		} catch (e) {
			textures.bumpMap = null;
			console.log(e);
		}
		var material = new THREE.MeshPhongMaterial(textures);
		var floor = new THREE.Mesh(geometry, material);
		floor.receiveShadow = true;
		floor.position.set(0, -1, 0);
		floor.rotation.x = (Math.PI / 2) * -1;
		this.scene.add(floor);
	}

	async getWall() {
		try {
			var paintT = await loadWithPromise('wall-texture.jpg', textureLoader);
			paintT.wrapS = paintT.wrapT = THREE.RepeatWrapping;
			paintT.repeat.set(10, 10);
			paintT.rotation = Math.PI / 2;
		} catch (e) {
			paintT = null;
			console.log(e);
		}

		var paintM = new THREE.MeshPhongMaterial({
			emissive: new THREE.Color("rgb(50,50,50)"),
			specular: new THREE.Color("rgb(200,200,200)"),
			shininess: 100,
			map: paintT,
			bumpScale: 0.3,
		});

		var wallX = 200
		var wallY = 430

		var geometry = new THREE.BoxGeometry(wallX * 2, wallY, 1);
		var wall = new THREE.Mesh(geometry, paintM);
		wall.position.set(0, 25, wallX);
		this.scene.add(wall);

		var wall2 = new THREE.Mesh(geometry, paintM);
		wall2.position.set(0, 25, -wallX);
		this.scene.add(wall2);

		var geometry = new THREE.BoxGeometry(1, wallY, wallX * 2);
		var wall3 = new THREE.Mesh(geometry, paintM);
		wall3.position.set(wallX, 25, 0);
		this.scene.add(wall3);

		var geometry = new THREE.BoxGeometry(1, wallY, wallX * 2);
		var wall4 = new THREE.Mesh(geometry, paintM);
		wall4.position.set(-wallX, 25, 0);
		this.scene.add(wall4);
	}

	async updateMap(urlTexture, urlBumpMap, urlNormalMap, rugPart) {
		var rugRepeatX = 8;
		var rugRepeatY = 8;
		var bumpScale = 20;
		var dispScale = 3;

		if (urlTexture === '') {
			for (let i = 0; i < this.object.children.length; i += 1) {
				if (this.object.children[i] instanceof THREE.Mesh && this.object.children[i].name.indexOf(rugPart) !== -1) {
					this.object.children[i].material = materialDef;
				}
			}
			return;
		}

		const textures = {
			emissive: new THREE.Color("rgb(7,3,5)"),
			specular: new THREE.Color("rgb(100,100,100)"),
			shininess: 0,
			displacementScale: dispScale,
			bumpScale: bumpScale,
			anisotropy: 16
		};

		try {
			textures.bumpMap = await loadWithPromise(urlBumpMap, textureLoader);
			textures.bumpMap.wrapS = textures.bumpMap.wrapT = THREE.RepeatWrapping;
			textures.bumpMap.anisotropy = 16
			textures.bumpMap.repeat.set(rugRepeatX, rugRepeatY);
		} catch (e) {
			textures.bumpMap = null;
			console.log(e);
		}

		try {
			textures.normalMap = await loadWithPromise(urlNormalMap, textureLoader);
			textures.normalMap.wrapS = textures.normalMap.wrapT = THREE.RepeatWrapping;
			textures.normalMap.repeat.set(rugRepeatX, rugRepeatY);
		} catch (e) {
			textures.normalMap = null;
			console.log(e);
		}

		try {
			textures.map = await loadWithPromise(urlTexture, textureLoader);
			textures.map.wrapS = textures.map.wrapT = THREE.RepeatWrapping;
			textures.map.repeat.set(rugRepeatX, rugRepeatY);
		} catch (e) {
			console.log(e);
		}

		const materialWithTexture = new THREE.MeshPhongMaterial(textures);

		for (let i = 0; i < this.object.children.length; i += 1) {
			if (this.object.children[i] instanceof THREE.Mesh && this.object.children[i].name.indexOf(rugPart) !== -1) {
				this.object.children[i].material = materialWithTexture;
				this.object.children[i].castShadow = true;
				this.object.children[i].receiveShadow = false;
			}
		}
	}

	calculateUrlsForTextures(rugPart) {
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
			this.camera.position.x = -1;
			this.camera.position.y = 170;
			this.camera.position.z = 0;
		}

		if (currentView === 'angled') {
			this.camera.position.x = 150;
			this.camera.position.y = 97.86732004062627;
			this.camera.position.z = 108.5265830159921;
		}

		if (currentView === 'angled-horizontal') {
			this.camera.position.x = -120;
			this.camera.position.y = 146.97868270469004;
			this.camera.position.z = 0.00630814379798243;
		}

		if (currentView === 'above-vertical') {
			this.camera.position.x = 0;
			this.camera.position.y = 170;
			this.camera.position.z = 0;
		}
	}

	cameraZoom(zoom) {
		this.camera.zoom = zoom;
		this.camera.updateProjectionMatrix();
	}

	async componentDidMount() {
		const resize = () => {
			this.renderer.setSize(container.offsetWidth, container.offsetHeight);
			this.camera.aspect = container.offsetWidth / container.offsetHeight;
			this.camera.updateProjectionMatrix();
		};

		this.THREE = THREE;

		this.addLight()

		const container = document.getElementById("root-for-rug");

		this.controls = new OrbitControl(this.camera, container);
		this.controls.enablePan = false
		// this.controls.enableZoom = false;
		this.controls.minDistance = 50;
		this.controls.maxDistance = 120;
		this.controls.minPolarAngle = 0;
		this.controls.maxPolarAngle = Math.PI / 2 - 0.15;

		this.camera.zoom = 2;

		this.objectLoader();
		
		this.getFloor()

		this.getWall()

		this.renderer = new THREE.WebGLRenderer({ antialias: true });

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
		this.renderer.setClearColor(0xffffff)
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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