// Beachy Beachy Ball
// Copyright (c) 2023 Michael Kolesidis <michael.kolesidis@gmail.com>
// Licensed under the GNU Affero General Public License v3.0.
// https://www.gnu.org/licenses/gpl-3.0.html

// import { useMemo } from "react";
// import { CuboidCollider, RigidBody } from "@react-three/rapier";
// import type RAPIER from "@dimforge/rapier3d";
// type RAPIER_API = typeof import("@dimforge/rapier3d");

import * as THREE from "three";
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
} from './components/Blocks';

import levels from "./components/Levels";

export class Levels {
  private blocks!:Blocks;
  private game: any;
  constructor(game: any) {
    this.game = game;
    this.blocks = new Blocks(game);
  }

  public Bounds(length = 1) {
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
  
  public RandomLevel(
    count = 5,
    // types = [
    //   this.blocks.BlockSpinner,
    //   this.blocks.BlockDoubleSpinner,
    //   this.blocks.BlockSlidingWall,
    //   this.blocks.BlockDoubleSlidingWall,
    //   this.blocks.BlockLimbo,
    //   this.blocks.BlockDoubleLimbo,
    //   // this.blocks.BlockPlatformLimbo,
    //   // this.blocks.BlockRamp
    // ],
    types = [
      'BlockSpinner',
      'BlockDoubleSpinner',
      'BlockSlidingWall',
      'BlockDoubleSlidingWall',
      'BlockLimbo',
      'BlockDoubleLimbo',
      // this.blocks.BlockPlatformLimbo,
      // this.blocks.BlockRamp
    ],
    seed = 0,
    difficulty = 1,
  ) {
  
    const blocks = [];
  
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      blocks.push(type);
    }
  
    //   return blocks;
    // }, [count, types, seed]);
  
    console.log('blocks:', blocks);
    
  
    const rtn = [];
    rtn.push(this.blocks.BlockEmpty([0, 0, 0]));
    blocks.map((Block, index) => {
      console.log('Block:', Block);
      rtn.push((this.blocks as any)[Block]([0, 0, -(index + 1) * 4], difficulty));
      // key={index}
      // position={[0, 0, -(index + 1) * 4]}
      // difficulty={difficulty}
    })
  
    rtn.push(this.blocks.BlockEmpty([0, 0, -(count + 1) * 4]));
    rtn.push(this.blocks.BlockEnd([0, 0, -(count + 2) * 4]));
    rtn.push(this.Bounds(count + 3));
    return rtn;
  
  
  
  
  
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

