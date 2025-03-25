# Angular + ThreeJs + Rapier 

## Install
```
npm i ng-rapier-threejs
```

## How to Use
```
import {Rapier, World} from 'ng-rapier-threejs'

..........
private async create() {
  await this.rapier.initRapier(0.0, -9.81, 0.0);
  this.world.create();
}
```
import {Mesh} from 'ng-rapier-threejs'
```
public async BlockSpinner(){

  // ThreeJs mesh 생성
  const mesh = new Mesh();
  const obstacle = await mesh.create({
    geometry: {type: 'box', width: 1, height: 1, depth: 1}, // geometry 속성
    material: {type: 'standard', color: 'tomato'}, // material 속성
    mesh: { //  mesh 속성
      position:new THREE.Vector3(0, -0.2, 0),
      castShadow: true,
      receiveShadow: true
    }
  });

  obstacle.scale.set(4.5, 0.3, 0.3);

  // Rapier 생성
  const body: Body = new Body(this.rapier);
  await body.create(
    {
      collider: {
        type:'kinematicPosition',
        restitution:0.2, friction: 0,
        userData: {name: 'obstacle'}
      },
      object3d: obstacle // 위에서 생성한 ThreeJs의 mesh를 넣어주면 mesh의 속성(shape, postion, scale등등을 자동으로 처리합니다 )
    }
  );

  // userFrame의 속성을 이용하여 애니메이션을 처리할 수 있습니다.
  body.useFrame = (clock: UseFrame) => {
    const time = clock.time;
    const rotation = new THREE.Quaternion();

    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    body.rigidBody.setNextKinematicRotation(rotation);
  };

}
```