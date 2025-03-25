import { Euler, Matrix4, Object3D, Quaternion, Vector3 } from "three";

export const _quaternion = new Quaternion();
export const _euler = new Euler();
export const _vector3 = new Vector3();
export const _object3d = new Object3D();
export const _matrix4 = new Matrix4();
export const _position = new Vector3();
export const _rotation = new Quaternion();
export const _scale = new Vector3();


export {ColliderProps} from './rapier/ColliderProps';
export {RapierColliderDesc} from './rapier/RapierColliderDesc';
export {RapierRigidBody} from './rapier/RapierRigidBody';





// 아래부터 실제 프로그램에서 사용할 예정
export {Rapier} from './rapier/Rapier';
export {World} from './threejs/World';

export {Body} from './rapier/Body';

export {Mesh} from './threejs/Mesh';
export {World as RapierWorld} from './threejs/World';
