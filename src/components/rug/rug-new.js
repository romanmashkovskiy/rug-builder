import React, {Component} from 'react';
import * as THREE from 'three';
import * as OBJLoader from 'three-obj-loader';
import * as OrbitControls from 'three-orbit-controls';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import './rug.css';

OBJLoader(THREE);
const OrbitControl = OrbitControls(THREE);
const textureLoader = new THREE.TextureLoader();

const materialDef = new THREE.MeshPhongMaterial({
    color: 0x555555,
    specular: 0xffffff,
    shininess: 5
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

    objectLoader() {
        const objectLoader = new this.THREE.OBJLoader();
        objectLoader.load("rug.obj",
            (object) => {
                for (let i = 0; i < object.children.length; i++) {
                    object.children[i].material = materialDef;
                }
                this.object = object;
                this.scene.add(object);
            });
    }

    updateMapCentre(url) {
        const object = this.object;
        textureLoader.load(url,
            (texture) => {
                // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                // texture.repeat.set(2, 2);
                const materialWithTexture = new THREE.MeshPhongMaterial({
                    color: 0x555555,
                    specular: 0xffffff,
                    shininess: 5,
                    map: texture
                });
                for (let i = 0; i < object.children.length; i += 1) {
                    if (object.children[i] instanceof THREE.Mesh && object.children[i].name.indexOf('Centre') !== -1 && texture.image) {
                        object.children[i].material = materialWithTexture;
                    }
                }
            },
            undefined,
            function (err) {
                for (let i = 0; i < object.children.length; i += 1) {
                    if (object.children[i] instanceof THREE.Mesh && object.children[i].name.indexOf('Centre') !== -1) {
                        object.children[i].material = materialDef;
                    }
                }
            });
    }

    updateMapPiping(url) {
        const object = this.object;
        textureLoader.load(url,
            (texture) => {
                const materialWithTexture = new THREE.MeshPhongMaterial({
                    color: 0x555555,
                    specular: 0xffffff,
                    shininess: 5,
                    map: texture
                });
                for (let i = 0; i < object.children.length; i += 1) {
                    if (object.children[i] instanceof THREE.Mesh && object.children[i].name.indexOf('Trim') !== -1 && texture.image) {
                        object.children[i].material = materialWithTexture;
                    }
                }
            },
            undefined,
            function (err) {
                for (let i = 0; i < object.children.length; i += 1) {
                    if (object.children[i] instanceof THREE.Mesh && object.children[i].name.indexOf('Trim') !== -1) {
                        object.children[i].material = materialDef;
                    }
                }
            });
    }

    updateMapOuterBorder(url) {
        const object = this.object;
        textureLoader.load(url,
            (texture) => {
                const materialWithTexture = new THREE.MeshPhongMaterial({
                    color: 0x555555,
                    specular: 0xffffff,
                    shininess: 5,
                    map: texture
                });
                for (let i = 0; i < object.children.length; i += 1) {
                    if (object.children[i] instanceof THREE.Mesh && object.children[i].name.indexOf('Outer') !== -1 && texture.image) {
                        object.children[i].material = materialWithTexture;
                    }
                }
            },
            undefined,
            function (err) {
                for (let i = 0; i < object.children.length; i += 1) {
                    if (object.children[i] instanceof THREE.Mesh && object.children[i].name.indexOf('Outer') !== -1) {
                        object.children[i].material = materialDef;
                    }
                }
            });
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



    componentDidMount() {
        const resize = () => {
            renderer.setSize(container.offsetWidth, container.offsetHeight);
            this.camera.aspect = container.offsetWidth / container.offsetHeight;
            this.camera.updateProjectionMatrix();
        };

        this.THREE = THREE;

        const container = document.getElementById("root-for-rug");

        this.controls = new OrbitControl(this.camera, container);
        this.controls.enableZoom  = false;
        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = Math.PI/2 - 0.15;

        this.camera.zoom = 2;

        this.objectLoader();

        // const axesHelper = new THREE.AxesHelper(500);
        // this.scene.add(axesHelper);

        const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});

        renderer.setSize(container.offsetWidth, container.offsetHeight);

        this.camera.aspect = container.offsetWidth / container.offsetHeight;
        this.camera.updateProjectionMatrix();

        window.onresize =  resize;

        const animate = () => {
            requestAnimationFrame(animate);
            this.controls.update();
            renderer.render(this.scene, this.camera);
        };
        animate();

        container.appendChild(renderer.domElement);
        console.log('zoom', this.camera.zoom);
    }


    componentDidUpdate() {
        //this.updateMapCentre('http://cdn.crucial-trading.com/uploads/20170202190119/Affluence_AF422_933.jpg');
        this.updateMapCentre(this.props.centre.picture);
        this.updateMapPiping(this.props.piping.src);
        this.updateMapOuterBorder(this.props.outerBorder.src);

        this.changeView(this.props.currentRugView);

        this.cameraZoom(this.props.currentZoom);
    }


    render() {
        return (
            <div className="rug-container" id="root-for-rug">
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        border: state.border,
        centre: state.centre,
        outerBorder: state.outerBorder,
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