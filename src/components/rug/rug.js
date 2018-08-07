import React, {Component} from 'react';
// import 'three/examples/js/loaders/OBJLoader';
import * as THREE from 'three';
import * as OBJLoader from 'three-obj-loader';
import * as OrbitControls from 'three-orbit-controls'
OBJLoader(THREE);
var OrbitControl = OrbitControls(THREE);

console.log('THREE', THREE);

class Rug extends Component {
    componentDidMount() {
        this.THREE = THREE;
        var scene = new THREE.Scene();
        console.log(scene);

        var light = new THREE.AmbientLight( 0x00FFFF ); // soft white light
        scene.add( light );

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.3);
        dirLight.position.set(-0.5, 0.75, -1);
        dirLight.position.multiplyScalar(50);
        scene.add( dirLight );

        var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        camera.position.set(0, 0, 300);
        camera.updateProjectionMatrix()
        scene.add(camera)

        var renderer = new THREE.WebGLRenderer();
        renderer.setClearColor('#FFFFFF');
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.getElementById("root-for-three").appendChild( renderer.domElement );


        // console.log('OrbitControls', OrbitControl(THREE))
        console.log('this.THREE', this.THREE)

        var controls = new OrbitControl(camera);


        var axesHelper = new THREE.AxesHelper( 500 );
        scene.add( axesHelper );

        var loader = new this.THREE.OBJLoader();
        console.log('THREE', THREE);
        console.log('loader', loader);

        loader.load(
            // resource URL
            'http://localhost:3001/static/Single_Rug_OBJ.obj',
            // called when resource is loaded
            function ( object ) {

                // var material = new THREE.MeshStandardMaterial({ vertexColors: THREE.FaceColors, color: 0x00FFFF });
                var phongMaterial = new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0x555555, specular: 0xffffff, shininess: 50, shading: THREE.SmoothShading } );

                for (var i = 0; i < object.children.length; i++) {
                    object.children[i].material = phongMaterial
                }

                console.log('object', object)

                scene.add(object);

            },
        );

        camera.position.set( 0, 20, 100 );
        controls.update();

        var animate = function () {
            requestAnimationFrame( animate );

            controls.update();
            renderer.render( scene, camera );
        };

        animate();
    }

    render() {
        return (
            <div id="root-for-three">
            </div>
        )
    }
}

export default Rug;