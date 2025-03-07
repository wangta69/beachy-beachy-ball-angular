// Beachy Beachy Ball
// Copyright (c) 2023 Michael Kolesidis <michael.kolesidis@gmail.com>
// Licensed under the GNU Affero General Public License v3.0.
// https://www.gnu.org/licenses/gpl-3.0.html

// import React, { useRef } from "react";
// import { useGLTF } from "@react-three/drei";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function Star(props: any) {

  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();

    // const { nodes, materials } = useGLTF("./models/star.glb");

    loader.load('/models/star.glb',  ( glb ) => {
      // this.myModel = glb.scene.children[0];
      const star = glb.scene;
      // glb.scene.scale.set(0.1, 0.1, 0.1); 
      // this.myModel.scale(100, 100, 100);
      star.name = 'pCylinder3';
      star.castShadow = true;
      star.receiveShadow = true;

      resolve(star);
        
    }, ( xhr ) => {// called while loading is progressing
      // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    }, ( error ) => {// called when loading has errors
      // console.log( 'An error happened' );
    });
  })

  // return (
  //   <group {...props} dispose={null}>
  //     <mesh
  //       name="pCylinder3"
  //       castShadow
  //       receiveShadow
  //       geometry={nodes.pCylinder3.geometry}
  //       material={materials.blinn2SG}
  //     />
  //   </group>
  // );
}


