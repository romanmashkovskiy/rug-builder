import React, {Component} from 'react';
import * as THREE from 'three';
import * as OBJLoader from 'three-obj-loader';
import * as OrbitControls from 'three-orbit-controls';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {} from "../../actions";

OBJLoader(THREE);
const OrbitControl = OrbitControls(THREE);

class Rug extends Component {

    componentDidMount() {
        this.THREE = THREE;

        const container = document.getElementById("root-for-rug");
        const containerSize = {
            width: container.offsetWidth,
            height: container.offsetHeight
        };


        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        camera.position.z = 200;
        scene.add(camera);

        const controls = new OrbitControl(camera);

        const light = new THREE.AmbientLight();
        scene.add(light);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.3);
        scene.add(dirLight);

        const renderer = new THREE.WebGLRenderer({alpha: true});
        renderer.setSize(window.innerWidth, window.innerHeight);

        container.appendChild(renderer.domElement);


        const textureCentre = new THREE.TextureLoader().load("http://cdn.crucial-trading.com/uploads/20161114134225/GPC20238437-150x150.jpg");
        const textureOuterBorder = new THREE.TextureLoader().load("http://cdn.crucial-trading.com/uploads/20161114172558/GPC20238445-150x150.jpg");
        const texturePiping = new THREE.TextureLoader().load("http://cdn.crucial-trading.com/uploads/20161114172602/GPC20238453-150x150.jpg");


        const loadModelTexture = () => {
            const objectLoader = new this.THREE.OBJLoader();
            objectLoader.load("rug.obj",
                function (object) {
                    object.traverse(function (child) {
                        if (child instanceof THREE.Mesh && child.name.indexOf('Centre') !== -1) {
                            child.material.map = textureCentre;
                        } else if (child instanceof THREE.Mesh && child.name.indexOf('Trim') !== -1) {
                            child.material.map = texturePiping;
                        } else if (child instanceof THREE.Mesh && child.name.indexOf('Border') !== -1) {
                            child.material.map = textureOuterBorder;
                        }
                    });
                    scene.add(object);
                });
        };

        const loadModelDefault = () => {
            const objectLoader = new this.THREE.OBJLoader();
            objectLoader.load("rug.obj",
                function (object) {
                    var phongMaterial = new THREE.MeshPhongMaterial({
                        ambient: 0x555555,
                        color: 0x555555,
                        specular: 0xffffff,
                        shininess: 50,
                        shading: THREE.SmoothShading
                    });
                    object.traverse(function (child) {
                        if (child instanceof THREE.Mesh ) {
                            child.material = phongMaterial;
                        }
                    });
                    scene.add(object);
                });
        };

        loadModelTexture();

        const animate = function () {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        animate();
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