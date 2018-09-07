import React, {Component} from 'react';
import * as THREE from 'three';
import * as OBJLoader from 'three-obj-loader';
import * as OrbitControls from 'three-orbit-controls';
import {connect} from "react-redux";
import {loadWithPromise} from '../../utils/load-with-promise';

OBJLoader(THREE);
const OrbitControl = OrbitControls(THREE);
const textureLoader = new THREE.TextureLoader();

const materialDef = new THREE.MeshPhongMaterial({
    color: 0x555555,
});


class RugSummary extends Component {

    constructor(props) {
        super(props);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.camera.position.x = -40;
        this.camera.position.y = 44;
        this.camera.position.z = 165;

        this.scene.add(this.camera);

        const light = new THREE.AmbientLight();
        this.scene.add(light);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.3);
        this.scene.add(dirLight);

        // this.scene.background = new THREE.Color( 'blue' );
    }

    async objectLoader() {
        const objectLoader = new this.THREE.OBJLoader();

        // const axesHelper = new THREE.AxesHelper(500);
        // this.scene.add(axesHelper);

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
        } catch(e) {
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
            textures.map.repeat.set( 6, 6 );
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
        if (rugPart.thumb) {
            const keyTexture = Object.keys(rugPart.thumb)[0];
            const keyBumpMap = Object.keys(rugPart.bmap)[0];
            const keyNormalMap = Object.keys(rugPart.nmap)[0];
            const urlTexture = rugPart.thumb[keyTexture].full_url;
            const urlBumpMap = rugPart.bmap instanceof Array ? '' : rugPart.bmap[keyBumpMap].full_url;
            const urlNormalMap = rugPart.nmap instanceof Array ? '' : rugPart.nmap[keyNormalMap].full_url;

            return [urlTexture,urlBumpMap,urlNormalMap]
        } else {
            return ['','',''];
        }
    }

    async componentDidMount() {

        const resize = () => {
            this.renderer.setSize(container.offsetWidth, container.offsetHeight);
            this.camera.aspect = container.offsetWidth / container.offsetHeight;
            this.camera.updateProjectionMatrix();
        };

        this.THREE = THREE;

        const container = document.getElementById("root-for-rug-summary");

        this.controls = new OrbitControl(this.camera, container);
        this.controls.enabled = false;

        this.camera.zoom = 2;

        await this.objectLoader();

        this.updateMap(...this.calculateUrlsForTextures(this.props.centre), 'Centre');
        this.updateMap(...this.calculateUrlsForTextures(this.props.piping), 'Trim');
        this.updateMap(...this.calculateUrlsForTextures(this.props.outerBorder), 'Outer');
        this.updateMap(...this.calculateUrlsForTextures(this.props.innerBorder), 'Inner');

        this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});

        this.renderer.setSize(container.offsetWidth, container.offsetHeight);

        this.camera.aspect = container.offsetWidth / container.offsetHeight;

        this.camera.updateProjectionMatrix();

        window.onresize = resize;

        const animate = () => {
            requestAnimationFrame(animate);
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
    }

    render() {
        return (
            <div id="root-for-rug-summary">
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
        piping: state.piping
    };
};

export default connect(mapStateToProps)(RugSummary);