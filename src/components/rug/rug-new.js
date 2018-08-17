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

        this.camera.position.z = 200;
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
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set( 2, 2 );
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

    updateMapOuterBorder (url) {
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

    componentDidMount() {
        this.THREE = THREE;

        const container = document.getElementById("root-for-rug");

        this.objectLoader();

        const controls = new OrbitControl(this.camera);

        const renderer = new THREE.WebGLRenderer({alpha: true});

        renderer.setSize(container.offsetWidth, container.offsetHeight);

        this.camera.aspect = container.offsetWidth / container.offsetHeight;

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(this.scene, this.camera);
        };
        animate();

        container.appendChild(renderer.domElement);
    }


    componentDidUpdate() {
        this.updateMapCentre(this.props.centre.src);
        this.updateMapPiping(this.props.piping.src);
        this.updateMapOuterBorder(this.props.outerBorder.src);
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
        piping: state.piping
    };
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({},
        dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(Rug);