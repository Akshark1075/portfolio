import * as THREE from "three";
import { GLTFLoader } from "./libs/GLTFLoader.js";
import { DRACOLoader } from "./libs/DRACOLoader.js";

/*********Function for loading GLTF models and playing animation*********/
async function loadModel(loadingManager) {
  // Instantiate a loader
  const loader = new GLTFLoader(loadingManager);
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("./libs/draco/");
  loader.setDRACOLoader(dracoLoader);
  try {
    // Load a glTF resource
    const gltf = await loader.loadAsync(
      // resource URL
      "../assets/models/scare_room.gltf",
      function (xhr) {
        var item = document.querySelector(".progress");
        var iStr = ((xhr.loaded / xhr.total) * 100).toString();
        item.style.width = iStr + "%";
      }
    );
    // called when the resource is loaded

    document.querySelector(".loader-container").remove();

    gltf.scene.children[0].children.forEach((model) => {
      model.castShadow = true;
    });
    return [gltf.scene, gltf.animations];
  } catch (error) {
    console.log(error);
  }
}

export { loadModel };
