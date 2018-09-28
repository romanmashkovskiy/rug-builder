import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import * as THREE from 'three';
import * as OBJLoader from 'three-obj-loader';
import * as OrbitControls from 'three-orbit-controls';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {loadWithPromise} from '../../utils/load-with-promise';
import {saveRug, guestCheckout} from '../../actions'
import './rug.css';
import {BASE_URL} from '../../utils/base-url';


OBJLoader(THREE);
const OrbitControl = OrbitControls(THREE);
const textureLoader = new THREE.TextureLoader();

const materialDef = new THREE.MeshPhongMaterial({
    color: 0xcccccc,
});

const ls = require('local-storage');

class Rug extends Component {

    constructor(props) {
        super(props);
        this.state = {initialContainerWidth: ''};

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        var axesHelper = new THREE.AxesHelper(200);
        this.scene.add(axesHelper);

        this.camera.position.x = -120;
        this.camera.position.y = 146.97868270469004;
        this.camera.position.z = 0.00630814379798243;

        this.scene.add(this.camera);
    }

    addLight() {
        var hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 0.5);
        this.scene.add(hemiLight);

        var keyLight2 = new THREE.PointLight(0xffffff, 1, 150);
        keyLight2.position.set(0, 50, 60);
        keyLight2.castShadow = true;
        keyLight2.rotation.x = 45;
        this.scene.add(keyLight2);

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
            rugFile = `${BASE_URL}/double.obj`;
        } else if (this.props.border === 'BORDER-PIPING') {
            rugFile = `${BASE_URL}/piping.obj`;
        } else {
            rugFile = `${BASE_URL}/single.obj`;
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
            console.log(String(e));
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
            textures.map = await loadWithPromise(`${BASE_URL}/floor-texture.jpg`, textureLoader);
            textures.map.wrapS = textures.map.wrapT = THREE.RepeatWrapping;
            textures.map.repeat.set(floorRepeatX, floorRepeatY);
            textures.map.anisotropy = 16
        } catch (e) {
            textures.map = null;
            console.log(e);
        }

        try {
            textures.bumpMap = await loadWithPromise(`${BASE_URL}/floor-bmap.jpg`, textureLoader);
            textures.bumpMap.wrapS = textures.bumpMap.wrapT = THREE.RepeatWrapping;
            textures.bumpMap.repeat.set(floorRepeatX, floorRepeatY);
            textures.map.anisotropy = 16
        } catch (e) {
            textures.bumpMap = null;
            console.log(e);
        }
        var material = new THREE.MeshPhongMaterial(textures);
        var floor = new THREE.Mesh(geometry, material);
        // floor.receiveShadow = true;
        // floor.position.set(0, -1, 0);
        // floor.rotation.x = (Math.PI / 2) * -1;
        // this.scene.add(floor);
        this.floor = new THREE.Mesh(geometry, material);
        this.floor.receiveShadow = true;
        this.floor.position.set(0, -1, 0);
        this.floor.rotation.x = (Math.PI / 2) * -1;
        this.scene.add(this.floor);
    }

    async getWall() {
        try {
            var paintT = await loadWithPromise(`${BASE_URL}/wall-texture.jpg`, textureLoader);
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

        var wallX = 200;
        var wallY = 430;

        var geometry = new THREE.BoxGeometry(wallX * 2, wallY, 1);
        this.wall = new THREE.Mesh(geometry, paintM);
        this.wall.position.set(0, 25, wallX);
        this.scene.add(this.wall);

        this.wall2 = new THREE.Mesh(geometry, paintM);
        this.wall2.position.set(0, 25, -wallX);
        this.scene.add(this.wall2);

        var geometry = new THREE.BoxGeometry(1, wallY, wallX * 2);
        this.wall3 = new THREE.Mesh(geometry, paintM);
        this.wall3.position.set(wallX, 25, 0);
        this.scene.add(this.wall3);

        var geometry = new THREE.BoxGeometry(1, wallY, wallX * 2);
        this.wall4 = new THREE.Mesh(geometry, paintM);
        this.wall4.position.set(-wallX, 25, 0);
        this.scene.add(this.wall4);
    }

    async updateMap(urlTexture, urlBumpMap, urlNormalMap, rugPart) {
        var rugRepeatX = 8;
        var rugRepeatY = 8;
        var bumpScale = 1.5;
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
        };

        try {
            textures.bumpMap = await loadWithPromise(urlBumpMap, textureLoader);
            textures.bumpMap.wrapS = textures.bumpMap.wrapT = THREE.RepeatWrapping;
            textures.bumpMap.anisotropy = 16;
            textures.bumpMap.repeat.set(rugRepeatX, rugRepeatY);
        } catch (e) {
            textures.bumpMap = null;
            console.log(e);
        }

        try {
            textures.normalMap = await loadWithPromise(urlNormalMap, textureLoader);
            textures.normalMap.wrapS = textures.normalMap.wrapT = THREE.RepeatWrapping;
            textures.normalMap.anisotropy = 16;
            textures.normalMap.repeat.set(rugRepeatX, rugRepeatY);
        } catch (e) {
            textures.normalMap = null;
            console.log(e);
        }

        console.log(textures);

        try {
            textures.map = await loadWithPromise(urlTexture, textureLoader);
            textures.map.wrapS = textures.map.wrapT = THREE.RepeatWrapping;
            textures.map.anisotropy = 16;
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


    b64toBlob(b64Data) {
        let contentType = 'jpeg';
        let sliceSize = 512;

        var block = b64Data.split(";");
        var realData = block[1].split(",")[1];


        var byteCharacters = window.atob(realData);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }


    saveRug() {
        let base64 = this.renderer.domElement.toDataURL("image/jpeg");
        let blob = this.b64toBlob(base64);

        this.props.saveRug(
            this.props.border,

            this.props.centre.code,
            this.props.centre.name,
            this.props.centre.id,

            this.props.outerBorder.code,
            this.props.outerBorder.name,
            this.props.outerBorder.id,

            this.props.innerBorder.code,
            this.props.innerBorder.name,
            this.props.innerBorder.id,

            this.props.piping.code,
            this.props.piping.post_title,
            this.props.piping.ID,

            this.props.width,
            this.props.length,

            blob
        );
    }

    guestCheckout() {
        let base64 = this.renderer.domElement.toDataURL("image/jpeg");
        let blob = this.b64toBlob(base64);

        console.log(this.props.guestUser);

        this.props.guestCheckout(
            this.props.guestUser.firstName,
            this.props.guestUser.lastName,
            this.props.guestUser.email,
            this.props.border,

            this.props.centre.code,
            this.props.centre.name,
            this.props.centre.id,

            this.props.outerBorder.code,
            this.props.outerBorder.name,
            this.props.outerBorder.id,

            this.props.innerBorder.code,
            this.props.innerBorder.name,
            this.props.innerBorder.id,

            this.props.piping.code,
            this.props.piping.post_title,
            this.props.piping.ID,

            this.props.width,
            this.props.length,

            blob
        );
    }

    getRoom() {
        const removeFloorWalls = (className) => {
            this.scene.remove(this.floor);
            this.scene.remove(this.wall);
            this.scene.remove(this.wall2);
            this.scene.remove(this.wall3);
            this.scene.remove(this.wall4);
            this.container.className = className;
            this.controls.enabled = false;
        };

        const addFloorWalls = () => {
            this.scene.add(this.floor);
            this.scene.add(this.wall);
            this.scene.add(this.wall2);
            this.scene.add(this.wall3);
            this.scene.add(this.wall4);
            this.container.className = '';
            this.controls.enabled = true;
        };

        this.changeView('angled-horizontal');

        this.camera.updateProjectionMatrix();

        switch (this.props.currentRoomPreset) {
            case 1:
                this.object.rotation.y = 0;
                this.object.position.x = 0;
                this.object.position.y = 0;
                this.object.position.z = 0;
                removeFloorWalls('room-preset-1');
                this.object.position.z = -10;
                this.object.position.y = -30;

                break;
            case 2:
                this.object.rotation.y = 0;
                this.object.position.x = 0;
                this.object.position.y = 0;
                this.object.position.z = 0;
                removeFloorWalls('room-preset-2');
                this.object.rotation.y = (Math.PI / 2) * -1;
                this.object.position.x = -35;

                break;
            case 3:
                this.object.rotation.y = 0;
                this.object.position.x = 0;
                this.object.position.y = 0;
                this.object.position.z = 0;
                removeFloorWalls('room-preset-3');
                this.object.position.x = -20;
                this.object.position.z = -39;

                break;
            case 4:
                this.object.rotation.y = 0;
                this.object.position.x = 0;
                this.object.position.y = 0;
                this.object.position.z = 0;
                removeFloorWalls('room-preset-4');
                this.object.rotation.y = (Math.PI / 2) * -1;
                this.object.position.z = 40;

                break;
            case 5:
                this.object.rotation.y = 0;
                this.object.position.x = 0;
                this.object.position.y = 0;
                this.object.position.z = 0;
                removeFloorWalls('room-preset-5');
                this.object.position.x = -20;

                break;
            default:
                addFloorWalls();
                this.object.rotation.y = 0;
                this.object.position.x = 0;
                this.object.position.y = 0;
                this.object.position.z = 0;
        }
    }

    resizeRug() {
        const koef = 0.5 * this.container.offsetWidth / 1458;
        for (let i = 0; i < this.object.children.length; i++) {
            this.object.children[i].scale.set(koef, koef, koef);
        }
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.rugPosition) {
            await this.saveRug();
            this.props.history.push(ls('curUser') ? '/summary' : '/builder');
        }
        if (nextProps.rugPositionGuest) {
            await this.guestCheckout();
            this.props.history.push('/summary');
        }
    }

    async componentDidMount() {
        const resize = () => {
            this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
            this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
            this.camera.updateProjectionMatrix();

            this.resizeRug();
        };

        this.THREE = THREE;

        this.addLight();

        this.container = document.getElementById("root-for-rug");

        this.controls = new OrbitControl(this.camera, this.container);

        this.controls.enablePan = false;

        this.controls.minDistance = 50;
        this.controls.maxDistance = 120;
        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.15;

        this.camera.zoom = 2;

        this.objectLoader();

        this.getFloor();

        this.getWall();

        this.renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true, alpha: true});

        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);

        this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;

        this.camera.updateProjectionMatrix();

        window.onresize = resize;

        const animate = () => {
            requestAnimationFrame(animate);
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
            console.log(this.camera.position.x, this.camera.position.y = 50, this.camera.position.z);
        };
        animate();

        this.container.appendChild(this.renderer.domElement);
        // this.renderer.setClearColor(0xffffff);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;


    }

    async componentDidUpdate(prevProps) {
        if (prevProps.border !== this.props.border) {
            this.scene.remove(this.object);
            await this.objectLoader();
        }

        if (prevProps.currentRoomPreset !== this.props.currentRoomPreset) {
            this.getRoom();
        }

        this.updateMap(...this.calculateUrlsForTextures(this.props.centre), 'Centre');
        this.updateMap(...this.calculateUrlsForTextures(this.props.piping), 'Trim');
        this.updateMap(...this.calculateUrlsForTextures(this.props.outerBorder), 'Outer');
        this.updateMap(...this.calculateUrlsForTextures(this.props.innerBorder), 'Inner');


        if (prevProps.currentRugView !== this.props.currentRugView) {
            this.changeView(this.props.currentRugView);
        }
        

        // if (this.props.currentRoomPreset === '') {
            this.cameraZoom(this.props.currentZoom);
        // }
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
        currentZoom: state.currentZoom,
        rugPosition: state.rugPosition,
        rugPositionGuest: state.rugPositionGuest,
        width: state.width,
        length: state.length,
        guestUser: state.guestUser,
        showRoomPresetsMode: state.showRoomPresetsMode,
        currentRoomPreset: state.currentRoomPreset,
    };
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
            saveRug: saveRug,
            guestCheckout: guestCheckout
        },
        dispatch)
};

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Rug));