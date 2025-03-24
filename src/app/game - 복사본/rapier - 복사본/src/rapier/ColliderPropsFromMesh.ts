
import * as THREE from "three";

export class ColliderPropsFromMesh {
  constructor() {
  }

  /**
   * 
   * @param args = {object3d, collider}
   */
  public create(params: any) {
    // const childColliderProps: ColliderProps[] = [];

    const object:THREE.Object3D = params.object3d;
    const objectProps = {
      position: new THREE.Vector3(), 
      rotation: new THREE.Quaternion(), 
      scale: new THREE.Vector3(),
      shape: params.collider.shape || 'cuboid',
      args: [0, 0, 0],
      offset: null
    };

    object.updateWorldMatrix(true, false);

    new THREE.Matrix4()
      .copy(object.matrixWorld)
      // .premultiply(invertedParentMatrixWorld)
      .decompose(objectProps.position, objectProps.rotation, objectProps.scale);

    // const rotationEuler = new Euler().setFromQuaternion(_rotation, "XYZ");

    const { geometry } = object as THREE.Mesh;
    const { args, offset } = this.getColliderArgsFromGeometry(
      geometry,
      objectProps.shape
    );

    objectProps.args = args;
    objectProps.offset = offset;

    return this.mergeProps(objectProps, params);
    // return objectProps;

  };

  private mergeProps(objectProps: any, params: any) {
    const merged = {...params.collider, ...objectProps};
    return merged;
  }

  private getColliderArgsFromGeometry(
    geometry: any,
    shape: string
    ){
    switch (shape) {
      case "cuboid":
        geometry.computeBoundingBox();
        const { boundingBox } = geometry;
        const size = boundingBox!.getSize(new THREE.Vector3());
        return {
          args: [size.x / 2, size.y / 2, size.z / 2],
          offset: boundingBox!.getCenter(new THREE.Vector3())
        };
      case "ball":
        geometry.computeBoundingSphere();
        const { boundingSphere } = geometry;
        const radius = boundingSphere!.radius;
        return {
          args: [radius],
          offset: boundingSphere!.center
        };
      case "trimesh":
        const clonedGeometry = geometry.index
          ? geometry.clone()
          : this.mergeVertices(geometry);
        return {
          args: [
            (clonedGeometry.attributes as any).position.array as Float32Array,
            clonedGeometry.index?.array as Uint32Array
          ],
          offset: new THREE.Vector3()
        };
      case "hull":
        const g = geometry.clone();
        return {
          args: [(g.attributes as any).position.array as Float32Array],
          offset: new THREE.Vector3()
        };
    }
  
    return { args: [], offset: new THREE.Vector3() };
  };

  /**
   * @param {BufferGeometry} geometry
   * @param {number} tolerance
   * @return {BufferGeometry>}
   */
  private mergeVertices(geometry: THREE.BufferGeometry, tolerance = 1e-4): THREE.BufferGeometry {
    tolerance = Math.max(tolerance, Number.EPSILON)
  
    const hashToIndex: {
      [key: string]: number
    } = {}
    const indices = geometry.getIndex()
    const positions = geometry.getAttribute('position')
    const vertexCount = indices ? indices.count : positions.count
  
    // next value for triangle indices
    let nextIndex = 0
  
    // attributes and new attribute arrays
    const attributeNames = Object.keys(geometry.attributes)
    const attrArrays: {
      [key: string]: []
    } = {}
    const morphAttrsArrays: {
      [key: string]: Array<Array<THREE.BufferAttribute | THREE.InterleavedBufferAttribute>>
    } = {}
    const newIndices = []
    const getters = ['getX', 'getY', 'getZ', 'getW']
  
    // initialize the arrays
    for (let i = 0, l = attributeNames.length; i < l; i++) {
      const name = attributeNames[i]
  
      attrArrays[name] = []
  
      const morphAttr = geometry.morphAttributes[name]
      if (morphAttr) {
        morphAttrsArrays[name] = new Array(morphAttr.length).fill(0).map(() => [])
      }
    }
  
    // convert the error tolerance to an amount of decimal places to truncate to
    const decimalShift = Math.log10(1 / tolerance)
    const shiftMultiplier = Math.pow(10, decimalShift)
    for (let i = 0; i < vertexCount; i++) {
      const index = indices ? indices.getX(i) : i
  
      // Generate a hash for the vertex attributes at the current index 'i'
      let hash = ''
      for (let j = 0, l = attributeNames.length; j < l; j++) {
        const name = attributeNames[j]
        const attribute = geometry.getAttribute(name)
        const itemSize = attribute.itemSize
  
        for (let k = 0; k < itemSize; k++) {
          // double tilde truncates the decimal value
          // @ts-ignore no
          hash += `${~~(attribute[getters[k]](index) * shiftMultiplier)},`
        }
      }
  
      // Add another reference to the vertex if it's already
      // used by another index
      if (hash in hashToIndex) {
        newIndices.push(hashToIndex[hash])
      } else {
        // copy data to the new index in the attribute arrays
        for (let j = 0, l = attributeNames.length; j < l; j++) {
          const name = attributeNames[j]
          const attribute = geometry.getAttribute(name)
          const morphAttr = geometry.morphAttributes[name]
          const itemSize = attribute.itemSize
          const newarray = attrArrays[name]
          const newMorphArrays = morphAttrsArrays[name]
  
          for (let k = 0; k < itemSize; k++) {
            const getterFunc = getters[k]
            // @ts-ignore
            newarray.push(attribute[getterFunc](index))
  
            if (morphAttr) {
              for (let m = 0, ml = morphAttr.length; m < ml; m++) {
                // @ts-ignore
                newMorphArrays[m].push(morphAttr[m][getterFunc](index))
              }
            }
          }
        }
  
        hashToIndex[hash] = nextIndex
        newIndices.push(nextIndex)
        nextIndex++
      }
    }
  
    // Generate typed arrays from new attribute arrays and update
    // the attributeBuffers
    const result = geometry.clone()
    for (let i = 0, l = attributeNames.length; i < l; i++) {
      const name = attributeNames[i]
      const oldAttribute = geometry.getAttribute(name)
      //@ts-expect-error  something to do with functions and constructors and new
      const buffer = new (oldAttribute.array as TypedArray).constructor(attrArrays[name])
      const attribute = new THREE.BufferAttribute(buffer, oldAttribute.itemSize, oldAttribute.normalized)
  
      result.setAttribute(name, attribute)
  
      // Update the attribute arrays
      if (name in morphAttrsArrays) {
        for (let j = 0; j < morphAttrsArrays[name].length; j++) {
          const oldMorphAttribute = geometry.morphAttributes[name][j]
          //@ts-expect-error something to do with functions and constructors and new
          const buffer = new (oldMorphAttribute.array as TypedArray).constructor(morphAttrsArrays[name][j])
          const morphAttribute = new THREE.BufferAttribute(buffer, oldMorphAttribute.itemSize, oldMorphAttribute.normalized)
          result.morphAttributes[name][j] = morphAttribute
        }
      }
    }

    // indices\
    result.setIndex(newIndices)
    return result
  }
}


