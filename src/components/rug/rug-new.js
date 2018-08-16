import React, {Component} from 'react';
import * as THREE from 'three';
import * as OBJLoader from 'three-obj-loader';
import * as OrbitControls from 'three-orbit-controls';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {} from "../../actions";
import './rug.css';

OBJLoader(THREE);
const OrbitControl = OrbitControls(THREE);


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
        const materialDef = new THREE.MeshPhongMaterial({
            ambient: 0x555555,
            color: 0x555555,
            specular: 0xffffff,
            shininess: 5,
            shading: THREE.SmoothShading
        });

        const textureCentre = new THREE.TextureLoader().load(`${this.props.centre.src}`);
        const textureOuterBorder = new THREE.TextureLoader().load(`${this.props.outerBorder.src}`);
        const texturePiping = new THREE.TextureLoader().load(`${this.props.piping.src}`);

        const objectLoader = new this.THREE.OBJLoader();
        objectLoader.load("rug.obj",
            (object) => {
                object.traverse((child) => {
                    if (child instanceof THREE.Mesh && child.name.indexOf('Centre') !== -1 && textureCentre.image) {
                        child.material.map = textureCentre;
                    } else if (child instanceof THREE.Mesh && child.name.indexOf('Trim') !== -1 && texturePiping.image) {
                        child.material.map = texturePiping;
                    } else if (child instanceof THREE.Mesh && child.name.indexOf('Border') !== -1 && textureOuterBorder.image) {
                        child.material.map = textureOuterBorder;
                    } else {
                        child.material = materialDef;
                    }
                    child.material.needsUpdate = true;
                });
                this.scene.add(object);
            });
    }

    componentDidMount() {
        this.THREE = THREE;

        const container = document.getElementById("root-for-rug");
        console.log('container ', container);

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
        this.objectLoader();
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