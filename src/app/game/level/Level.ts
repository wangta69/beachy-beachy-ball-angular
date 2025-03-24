// Beachy Beachy Ball
// Copyright (c) 2023 Michael Kolesidis <michael.kolesidis@gmail.com>
// Licensed under the GNU Affero General Public License v3.0.
// https://www.gnu.org/licenses/gpl-3.0.html

// import { useMemo } from "react";
// import { CuboidCollider, RigidBody } from "@react-three/rapier";
// import type RAPIER from "@dimforge/rapier3d";
// type RAPIER_API = typeof import("@dimforge/rapier3d");

import * as THREE from "three";
// import {World} from '../../threejs/World';
// import {Rapier} from '../../rapier/Rapier';
import {Rapier, World} from '../../projects/ng-rapier-threejs/src/public-api'
import {Event} from '../services/event.service';
// import useGame from "../stores/useGame";
// import {
//   blockDimensions,
//   BlockEmpty,
//   BlockSpinner,
//   BlockDoubleSpinner,
//   BlockLimbo,
//   BlockDoubleLimbo,
//   // BlockPlatformLimbo,
//   // BlockRamp,
//   BlockSlidingWall,
//   BlockDoubleSlidingWall,
//   BlockEnd,
// } from "./components/Blocks.jsx";
// import { 
//   blockDimensions,
//   BlockEmpty,
//   BlockSpinner,
//   BlockDoubleSpinner,
//   BlockLimbo,
//   BlockDoubleLimbo,
//   // BlockPlatformLimbo,
//   // BlockRamp,
//   BlockSlidingWall,
//   BlockDoubleSlidingWall,
//   BlockEnd
// } from './components/Blocks';

import { 
  Blocks
} from '../objects/Blocks';

import levels from "./components/Levels";

export class Levels {
  private blocks!:Blocks;

  constructor(world:World, rapier:Rapier, event:Event) {

    this.blocks = new Blocks(world, rapier, event);
  }

  public async Bounds(length = 1) {
    await this.blocks.Bound(length);
    /*
    return (
      <RigidBody type="fixed" restitution={0.2} friction={0}>
        <CuboidCollider
          args={[blockDimensions.width / 2, 0.1, 2 * length]}
          position={[0, -0.1, -(length * 2) + 2]}
          restitution={0.2}
          friction={1}
        />
      </RigidBody>
    );
    */
  }
  
  public async RandomLevel(
    count = 5,
    types = [
      'BlockSpinner',
      'BlockDoubleSpinner',
      'BlockSlidingWall',
      'BlockDoubleSlidingWall',
      'BlockLimbo',
      'BlockDoubleLimbo',
      'BlockPlatformLimbo',
      'BlockRamp',
    ],

    // seed = 0,
    difficulty = 1,
  ) {
  
    const blocks = [];
  
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      blocks.push(type);
    }
  
    const rtn = [];
    rtn.push(await this.blocks.BlockEmpty([0, 0, 0]));

    blocks.map(async (Block, index) => {
      rtn.push(await (this.blocks as any)[Block]([0, 0, -(index + 1) * 4], difficulty));
    })
    rtn.push(await this.blocks.BlockEmpty([0, 0, -(count + 1) * 4]));
    rtn.push(await this.blocks.BlockEnd([0, 0, -(count + 2) * 4]));
    this.Bounds(count + 3);
    return this.mergeArrays(rtn);
  
  
  
  
  
    /*
    const blocks = useMemo(() => {
      const blocks = [];
  
      for (let i = 0; i < count; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        blocks.push(type);
      }
  
      return blocks;
    }, [count, types, seed]);
  
    return (
      <>
        <BlockEmpty position={[0, 0, 0]} />
  
        {blocks.map((Block, index) => (
          <Block
            key={index}
            position={[0, 0, -(index + 1) * 4]}
            difficulty={difficulty}
          />
        ))}
        <BlockEmpty position={[0, 0, -(count + 1) * 4]} />
        <BlockEnd position={[0, 0, -(count + 2) * 4]} />
        <Bounds length={count + 3} />
      </>
    );
    */
  }

  private mergeArrays(arr: any[]) {
    return arr.reduce((r, e) => r.concat(Array.isArray(e) ? this.mergeArrays(e) : e), [])
  }
  
  public TourLevel(difficulty = 1) {
    /*
    const { level } = useGame();
    let currentLevel;
    switch (level) {
      case "copacabana":
        currentLevel = 0;
        break;
      case "santamonica":
        currentLevel = 1;
        break;
      default:
        currentLevel = 0;
        break;
    }
  
    let name, count, blocks;
    name = levels[currentLevel].name;
    count = levels[currentLevel].count;
    blocks = levels[currentLevel].blocks;
    */
  /*
    return (
      <>
        <BlockEmpty position={[0, 0, 0]} />
  
        {blocks.map((Block, index) => (
          <Block
            key={index}
            position={[0, 0, -(index + 1) * 4]}
            difficulty={difficulty}
          />
        ))}
        <BlockEmpty position={[0, 0, -(count + 1) * 4]} />
        <BlockEnd position={[0, 0, -(count + 2) * 4]} />
        <Bounds length={count + 3} />
      </>
    );
    */
  }
  
}
THREE.ColorManagement.enabled = true;

