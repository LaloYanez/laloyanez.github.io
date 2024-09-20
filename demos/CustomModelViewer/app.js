import * as THREE from 'three';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.157.0/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.157.0/examples/jsm/loaders/GLTFLoader.js';
import {RGBELoader} from 'https://cdn.jsdelivr.net/npm/three@0.157.0/examples/jsm/loaders/RGBELoader.js';

const scene = new THREE.Scene();

//const canvas = document.querySelector('#c');
const canvas = document.getElementById("c");
const canvasWidth = document.getElementById("c").clientWidth;
const canvasHeight = document.getElementById("c").clientHeight;

// Init the renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( canvasWidth, canvasHeight );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.7;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor( '0x000000', 1 );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.xr.enabled = true;
//document.body.appendChild(renderer.domElement);

// Add a camerra
let camera
camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 37);
//const target = new THREE.Vector3(0, -0.4, 0);
//camera.position.set( 0.3, 1, 0.3);
//camera.lookAt(target);
scene.add(camera);

// Controllers
var controls = new OrbitControls(camera, renderer.domElement);

    //controls.minPolarAngle = Math.PI * 0.29;
    //controls.maxPolarAngle =  Math.PI * 0.69;
    controls.enablePan = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.02;
    //controls.autoRotate = true;
    controls.autoRotateSpeed = 0.7;
    controls.rotateSpeed = 0.75;
    controls.zoomSpeed = 0.85;

controls.maxPolarAngle = Math.PI * 0.6; // Increase maximum angle
    
    controls.update();  

let loadingContainer = document.getElementById('container');

let mixer;


var model = "assets/test1.glb";
var loader = new GLTFLoader();
var obj;

let mv = document.querySelector("model-viewer");
mv.setAttribute("src", model);

let arbtn = document.getElementById("arbtn");

function activateAR() {
  mv.activateAR();
}
arbtn.addEventListener("click", activateAR);

loader.load(model, function (gltf) {
    obj = gltf.scene;

    // Gölge ayarları
    obj.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });

    // Calculate bounding box and align model to the ground
    const boundingBox = new THREE.Box3().setFromObject(obj);
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    
    obj.position.y -= boundingBox.min.y; // Align model to the ground
    scene.add(obj);

    loadingContainer.style.display = 'none';

    adjustAndFitCamera(camera, obj, controls);

}, 

// Loading progress callback
function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
},

// Loading error callback  
function (err) {
    console.error('An error happened');
});

// Set camera when model is loaded
function adjustAndFitCamera() {
    if (!obj) return;

    const boundingBox = new THREE.Box3().setFromObject(obj);
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);
    
    const size = new THREE.Vector3();
    boundingBox.getSize(size);
  
    // Find the largest dimension on the XY plane
    const maxDimXY = Math.max(size.x, size.y, size.z);
    const aspect = window.innerWidth / window.innerHeight;
    const fov = camera.fov * (Math.PI / 180);
    
    // Calculate camera's z position
    let cameraZ;
    if (aspect > 1) {
        // Horizontal screen
        cameraZ = Math.abs(maxDimXY / 2 / Math.tan(fov / 2));
    } else {
        // Vertical screen
        cameraZ = Math.abs(maxDimXY / (2 * aspect) / Math.tan(fov / 2));
    }

    // Set camera position
    const offset = new THREE.Vector3(0, 0, cameraZ * 1.1);
    camera.position.copy(center).add(offset);
  
    // Set camera's look at
    camera.lookAt(center);
  
    // Update controls
    controls.target.copy(center);
    controls.maxDistance = cameraZ * 2;
    controls.minDistance = cameraZ * 0.5;
    controls.update();
  
    // Update camera settings
    camera.updateProjectionMatrix();
}


// HDR Loader
new RGBELoader().setPath( '/assets/' ).load( 'studio02.hdr',  function ( texture ) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    //texture.color.set('red');

    scene.background = new THREE.Color( 'white' );
    scene.environment = texture;
    //scene.background = texture;

});

// Light Setup
const softLight1 = new THREE.AmbientLight( 'white', 2);
scene.add( softLight1 );

const light1 = new THREE.DirectionalLight( 'white', 2 );
light1.position.set(0,10,10 );
light1.target.position.set(0, 0, 0);
scene.add(light1);

const light2 = new THREE.DirectionalLight( 'white', 2 );
light2.position.set(10,10,0 );
light2.target.position.set(0, 0, 0);
scene.add(light2);


// Shadow Plane Settings
const shadowGeo = new THREE.PlaneGeometry(3, 3);
const shadowMaterial = new THREE.ShadowMaterial();
shadowMaterial.opacity = 0.3;
const shadowPlane = new THREE.Mesh(shadowGeo, shadowMaterial);
shadowPlane.rotation.x = -Math.PI / 2;
shadowPlane.receiveShadow = true;
scene.add(shadowPlane);

const shadowLight = new THREE.DirectionalLight(0xffffff, 1);
shadowLight.position.set(0, 10, 0);
shadowLight.target.position.set(0, 0, 0)
shadowLight.castShadow = true;
shadowLight.shadow.mapSize.width = 2048;
shadowLight.shadow.mapSize.height = 2048;
shadowLight.shadow.camera.left = -5;
shadowLight.shadow.camera.right = 5;
shadowLight.shadow.camera.top = 5;
shadowLight.shadow.camera.bottom = -5;
shadowLight.shadow.camera.near = 0.5;
shadowLight.shadow.camera.far = 20;
shadowLight.shadow.radius= 1;
scene.add(shadowLight);



const button = document.getElementById("btn-rot");

button.addEventListener("click", (event) => {
    if (controls.autoRotate == false) {
        controls.autoRotate = true
    } else {
        controls.autoRotate = false
    }
})



function animate() {
    renderer.setAnimationLoop(render);
    requestAnimationFrame(animate);
    if (mixer) {
        mixer.update(0.01);
      }

    controls.update();
    //camera.lookAt(target);
    renderer.render(scene, camera);
    
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
}
function render() {
    controls.update();
    renderer.render(scene, camera);
  }


  animate();

// Function - New resizing method
function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    var width = canvasWidth;
    var height = canvasHeight;
    var canvasPixelWidth = canvas.width / window.devicePixelRatio;
    var canvasPixelHeight = canvas.height / window.devicePixelRatio;

    const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {

        renderer.setSize(width, height, false);
    }
    return needResize;
}


window.addEventListener( 'resize', onWindowResize );
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );



}
