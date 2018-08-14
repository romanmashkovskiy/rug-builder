import React, {Component} from 'react';
import * as THREE from 'three';
import * as OBJLoader from 'three-obj-loader';
import * as OrbitControls from 'three-orbit-controls';

OBJLoader(THREE);
var OrbitControl = OrbitControls(THREE);

class Rug extends Component {

    componentDidMount() {
        this.THREE = THREE;

        var container = document.getElementById("root-for-rug");
        const containerSize = {
            width: container.offsetWidth,
            height: container.offsetHeight
        };

        console.log(containerSize);

        var scene = new THREE.Scene();

        var camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        camera.position.z = 100;
        scene.add(camera);

        var controls = new OrbitControl(camera);

        var light = new THREE.AmbientLight();
        scene.add(light);

        var renderer = new THREE.WebGLRenderer({alpha: true});
        renderer.setSize(window.innerWidth, window.innerHeight);

        container.appendChild(renderer.domElement);
        var texture = new THREE.TextureLoader().load("texture.jpg");
        console.log(texture);

        var material = new THREE.MeshLambertMaterial({color: 0xfd59d7});

        // var textureLoader = new THREE.TextureLoader();
        //
        // textureLoader.load(
        //     "texture.jpg",
        //     function (texture) {
        //         console.log(texture);
        //         // loadModel(texture);
        //     });
        //
        //
        //
        //
        // const loadModel = (texture) => {
        //     var objectLoader = new this.THREE.OBJLoader();
        //     objectLoader.load(
        //         "rug.obj",
        //         function (object) {
        //             for (var i = 0; i < object.children.length; i++) {
        //                             object.children[i].material = texture;
        //                         }
        //             console.log(object);
        //             scene.add(object);
        //         });
        // };




        var objectLoader = new this.THREE.OBJLoader();

        objectLoader.load(
            "rug.obj",
            function (object) {
                var phongMaterial = new THREE.MeshPhongMaterial({
                    ambient: 0x555555,
                    color: 0x555555,
                    specular: 0xffffff,
                    shininess: 50,
                    shading: THREE.SmoothShading
                });
                for (var i = 0; i < object.children.length; i++) {
                    object.children[i].material = phongMaterial;
                }
                console.log(object);
                scene.add(object);
            });

        var animate = function () {
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

export default Rug;