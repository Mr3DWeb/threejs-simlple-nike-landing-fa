import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';


const scene = new THREE.Scene();
//scene.background = new THREE.Color(0xF2F4F6)
const canvas = document.querySelector('#webgl');

const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,100);
camera.position.set(0,0,1);

const renderer = new THREE.WebGLRenderer({
  canvas:canvas,
  antialias:true,
  alpha:true
});
renderer.setSize(window.innerWidth,innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2;
renderer.outputColorSpace = THREE.SRGBColorSpace;


window.addEventListener('resize',() => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
})

const ambLight = new THREE.AmbientLight('#ffffff',1)
scene.add(ambLight)

const dirLight = new THREE.DirectionalLight('#ffffff',1.3)
dirLight.position.set(3,3,3);
scene.add(dirLight)

const dirLightHelper = new THREE.DirectionalLightHelper(dirLight);
//scene.add(dirLightHelper)

//-------------------------- JS ------------------------------
function onHover(selector,onEnter,onLeave){
  const elements = document.querySelectorAll(selector);
  elements.forEach(el =>{
    el.addEventListener("mouseenter",() => onEnter(el) );
    if(onLeave){
      el.addEventListener("mouseleave",() => onLeave(el) );
    }
  })
}


//----------------------------Three js-------------------------
//----Gltf Loader
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader); 
let shoes;
gltfLoader.load('shoes/shoes.glb', (gltf) => {
  shoes = gltf.scene;
  const shoesScale = 2.5;
  shoes.scale.set(shoesScale,shoesScale,shoesScale);
  shoes.rotation.x = 0.5;
  shoes.rotation.y = -0.8;
  shoes.position.x = 0
  scene.add(shoes);
  initScrollAnimation();
})



//----------------------------Gsap-----------------------------
//Smoth-Scroll
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
const smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 2,
  effects: true,
});
//--enter animation
//effect Header
gsap.from(".header > *",{
  y:-100,
  opacity:0,
  duration:1.5,
  ease:"power4.out",
  stagger:0.2,
  delay:2
});
//section
gsap.from('.hero > * , #webgl',{
  opacity:0.1,
  filter:"blur(5px)",
  scale:0.9,
  duration:1.2,
  delay:0.2,
  ease:"power4.in",
  stagger:0.1,
  
})
//--main
//interaction btnShop with model
onHover(".cartBtn",()=>{
    gsap.to(shoes.rotation, { 
        z: "+=" + (Math.PI * 2), 
        duration: 1.5,
        ease:"power2.inOut",
        delay:0.1
    });
});
//Paralex
const heroSection = document.querySelector("section.hero");
const blobs = document.querySelectorAll(".blob");
const heading = document.querySelector("section.hero h1")

const textX = gsap.quickTo(heading,"x",{duration:1,ease:"power3"});
const textY = gsap.quickTo(heading,"y",{duration:1,ease:"power3"});

let blobAnimation = [];
blobs.forEach(blob => {
  blobAnimation.push({
    x:gsap.quickTo(blob,"x",{duration:0.8,ease:"power2"}),
    y:gsap.quickTo(blob,"y",{duration:0.8,ease:"power3"})
  });
});
let mousePos = {x:0,y:0};
window.addEventListener("mousemove",(e)=>{
  mousePos.x = (e.clientX - window.innerWidth / 2 - 1);
  mousePos.y = - (e.clientY - window.innerHeight / 2 + 1);

  textX(mousePos.x/30);
  textY(mousePos.y/30);
  
  blobAnimation.forEach((anim,index)=>{
    const speed = 10 + (index * 5);
    anim.x(-mousePos.x/speed);
    anim.y(-mousePos.y/speed);
  });
});
//Sec2 + scrollTrigger
function initScrollAnimation(){
  const tlInfoSec = gsap.timeline({
  scrollTrigger:{
    trigger:".product-info",
    start:"top bottom",
    end:"center center",
    scrub:1
  }
});
  tlInfoSec.to(shoes.rotation,{
    x:-1.33,
    y:2.39,
    z:1.65
  }).to(shoes.position,{
  x:-0.6
  }).to(".info-box",{
    opacity:1,
  });
  const tlBuySec = gsap.timeline({
    scrollTrigger:{
      trigger:".buy",
      start:"top bottom",
      end:"center center",
      scrub:1.5
    }
  });
  tlBuySec.to(shoes.position,{
    x:0,
    y:-0.1,
    z:0
  }).to(shoes.rotation,{
    x:0,
    y:-1,
    z:0
  }).to(".buy h1",{
    opacity:1,
    scale:1,
    yPercent:-100
  })
}

//-------------------------------------------------------------
const clock = new THREE.Clock();
function animate(){
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();

  renderer.render(scene,camera);
}
animate()
