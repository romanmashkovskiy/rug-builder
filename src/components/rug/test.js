import React, {Component} from 'react';
import * as THREE from 'three';
import * as OBJLoader from 'three-obj-loader';
import * as OrbitControls from 'three-orbit-controls';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

OBJLoader(THREE);
const OrbitControl = OrbitControls(THREE);

class Rug extends Component {
    constructor(props) {
        super(props);

        this.loadModelTexture = this.loadModelTexture.bind(this);

        this.materialCentre = new THREE.MeshPhongMaterial({
            ambient: 0x555555,
            color: 0x555555,
            specular: 0xffffff,
            shininess: 50,
            shading: THREE.SmoothShading
        });
        this.materialOuterBorder = new THREE.MeshPhongMaterial({
            ambient: 0x555555,
            color: 0x555555,
            specular: 0xffffff,
            shininess: 50,
            shading: THREE.SmoothShading
        });
        this.materialPiping = new THREE.MeshPhongMaterial({
            ambient: 0x555555,
            color: 0x555555,
            specular: 0xffffff,
            shininess: 50,
            shading: THREE.SmoothShading
        });

        this.THREE = THREE;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.camera.position.z = 200;
        this.scene.add(this.camera);
        var axesHelper = new THREE.AxesHelper( 500 );
        this.scene.add( axesHelper );

        this.controls = new OrbitControl(this.camera);
        this.renderer = new THREE.WebGLRenderer({alpha: true});

    }



    loadModelTexture () {
        console.log('asdfasdf', this)
        const objectLoader = new this.THREE.OBJLoader();
        objectLoader.load("rug.obj",
            (object) => {
                console.log('qwerqwer', object)
                object.traverse((child) => {
                    console.log('12341234', this)
                    if (child instanceof THREE.Mesh && child.name.indexOf('Centre') !== -1) {
                        console.log(4);
                        child.material = this.materialCentre;
                        child.material.needsUpdate = true;
                    } else if (child instanceof THREE.Mesh && child.name.indexOf('Trim') !== -1) {
                        child.material = this.materialOuterBorder;
                        child.material.needsUpdate = true;
                    } else if (child instanceof THREE.Mesh && child.name.indexOf('Border') !== -1) {
                        child.material = this.materialPiping;
                        child.material.needsUpdate = true;
                    }
                    console.log(child);
                });
                this.scene.add(object);
            });
    };


    componentDidMount() {

        const container = document.getElementById("root-for-rug");
        // const containerSize = {
        //     width: container.offsetWidth,
        //     height: container.offsetHeight
        // };



        // const camera = new THREE.PerspectiveCamera(
        //     75,
        //     window.innerWidth / window.innerHeight,
        //     0.1,
        //     1000
        // );

        // camera.position.z = 200;
        // this.scene.add(camera);
        //
        // const controls = new OrbitControl(camera);
        const light = new THREE.AmbientLight();
        this.scene.add(light);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.3);
        this.scene.add(dirLight);

        this.loadModelTexture();

        // const renderer = new THREE.WebGLRenderer({alpha: true});
        // this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setSize(400, 400);
        container.appendChild(this.renderer.domElement);

    }


    componentDidUpdate() {
        // this.THREE = THREE;
        //
        // const container = document.getElementById("root-for-rug");
        // const containerSize = {
        //     width: container.offsetWidth,
        //     height: container.offsetHeight
        // };
        //
        //
        // const scene = new THREE.Scene();
        // const camera = new THREE.PerspectiveCamera(
        //     75,
        //     window.innerWidth / window.innerHeight,
        //     0.1,
        //     1000
        // );
        //
        // camera.position.z = 200;
        // scene.add(camera);
        //
        // const controls = new OrbitControl(camera);
        //
        // const light = new THREE.AmbientLight();
        // scene.add(light);
        //
        // const dirLight = new THREE.DirectionalLight(0xffffff, 0.3);
        // scene.add(dirLight);
        //
        // const renderer = new THREE.WebGLRenderer({alpha: true});
        // renderer.setSize(window.innerWidth, window.innerHeight);
        //
        // container.appendChild(renderer.domElement);


        // const textureCentre = new THREE.TextureLoader().load("http://cdn.crucial-trading.com/uploads/20161114134225/GPC20238437-150x150.jpg");
        // const textureOuterBorder = new THREE.TextureLoader().load("http://cdn.crucial-trading.com/uploads/20161114172558/GPC20238445-150x150.jpg");
        // const texturePiping = new THREE.TextureLoader().load("http://cdn.crucial-trading.com/uploads/20161114172602/GPC20238453-150x150.jpg");
        // const textureCentre = new THREE.TextureLoader().load(`${this.props.centre.src}`);
        // const textureOuterBorder = new THREE.TextureLoader().load(`${this.props.outerBorder.src}`);
        // const texturePiping = new THREE.TextureLoader().load(`${this.props.piping.src}`);
        //
        //
        // let materialCentre;
        // let materialOuterBorder;
        // let materialPiping;
        //
        // if (this.props.centre.name === 'CENTRE') {
        //     materialCentre = new THREE.MeshPhongMaterial({
        //         ambient: 0x555555,
        //         color: 0x555555,
        //         specular: 0xffffff,
        //         shininess: 50,
        //         shading: THREE.SmoothShading
        //     });
        // } else {
        //     console.log(2);
        //     materialCentre = new THREE.MeshLambertMaterial({map: textureCentre});
        // }
        //
        // if (this.props.outerBorder.name === 'OUTER BORDER') {
        //     materialOuterBorder = new THREE.MeshPhongMaterial({
        //         ambient: 0x555555,
        //         color: 0x555555,
        //         specular: 0xffffff,
        //         shininess: 50,
        //         shading: THREE.SmoothShading
        //     });
        // } else {
        //     materialOuterBorder = new THREE.MeshLambertMaterial({map: textureOuterBorder});
        // }
        //
        // if (this.props.piping.name === 'PIPING') {
        //     materialPiping = new THREE.MeshPhongMaterial({
        //         ambient: 0x555555,
        //         color: 0x555555,
        //         specular: 0xffffff,
        //         shininess: 50,
        //         shading: THREE.SmoothShading
        //     });
        // } else {
        //     materialPiping = new THREE.MeshLambertMaterial({map: texturePiping});
        // }


        // const loadModelTexture = () => {
        //     const objectLoader = new this.THREE.OBJLoader();
        //     objectLoader.load("rug.obj",
        //         function (object) {
        //             object.traverse(function (child) {
        //                 if (child instanceof THREE.Mesh && child.name.indexOf('Centre') !== -1) {
        //                     child.material = materialCentre;
        //                 } else if (child instanceof THREE.Mesh && child.name.indexOf('Trim') !== -1) {
        //                     child.material = materialOuterBorder;
        //                 } else if (child instanceof THREE.Mesh && child.name.indexOf('Border') !== -1) {
        //                     child.material = materialPiping;
        //                 }
        //             });
        //             scene.add(object);
        //         });
        // };

        // const loadModelTexture = () => {
        //     const objectLoader = new this.THREE.OBJLoader();
        //     objectLoader.load("rug.obj",
        //         function (object) {
        //             object.traverse(function (child) {
        //                 if (child instanceof THREE.Mesh && child.name.indexOf('Centre') !== -1) {
        //                     console.log(4);
        //                     child.material.map = textureCentre;
        //                     child.material.needsUpdate = true;
        //                 } else if (child instanceof THREE.Mesh && child.name.indexOf('Trim') !== -1) {
        //                     child.material = materialOuterBorder;
        //                     child.material.needsUpdate = true;
        //                 } else if (child instanceof THREE.Mesh && child.name.indexOf('Border') !== -1) {
        //                     child.material = materialPiping;
        //                     child.material.needsUpdate = true;
        //                 }
        //                 console.log(child);
        //             });
        //             scene.add(object);
        //         });
        // };


        //loadModelTexture();

        const animate = function () {
            requestAnimationFrame(animate);
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };

        animate();
    }


    render() {
        console.log(3);
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