import * as THREE from "three";

export class Material {
  constructor() {

  }

  public async createMaterial(args: any) {
    const map = await this.loadmap(args);
    // const map = await new THREE.TextureLoader().load( args.url );//this.loadmap(args);
    // const map = null;
    const params: any = {};
    params.flatShading = args.flatShading || false;
    params.color = args.color || null;
    params.map = map || null;

    switch(args.type) {
      case 'standard':
        return new THREE.MeshStandardMaterial(params);   
    }
    return null;
      
  }

  private async loadmap(args: any) {
    if(args.textureUrl) {
      return this.TextureLoader(args.textureUrl);
    }
    return null;
  }

  private async TextureLoader(url: string) {
    return await new THREE.TextureLoader().load( url );
  }
}