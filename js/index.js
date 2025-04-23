import * as THREE from "three";
import { OrbitControls } from "./libs/OrbitControls.js";
import { VRButton } from "./libs/VRButton.js";
import { loadModel } from "./model.js";
import { RectAreaLightUniformsLib } from "./libs/RectAreaLightUniformsLib.js";
import projectData from "./projectData.js";
const backgroundTitleLayer = document.querySelector(".background-title-layer");
const titleSection = document.querySelector(
  ".foreground-title-layer .title-section"
);
const avatar = document.querySelector(
  ".foreground-title-layer .avatar-preview "
);
const videos = document.querySelectorAll("video");
const videoOverlay = document.querySelector(".videoOverlay");
const slidingCardContainer = document.querySelector(".slidingCard");
const slidingCards = document.querySelectorAll(".slidingCard-slide");
const projectSection = document.querySelector(".project-description");
const maxScroll = 50;
// 3D
let scene, camera, cameras, renderer, controls, clock, mixer, animations;
let currentDoorIndex = 0;
let currentProject = 0;
let firstDoorPos = 2;
let secondDoorPos = 1;
let thirdDoorPos = 0;

const fullscreenIcon = document.getElementById("fullscreenIcon");
const eyeIcon = document.getElementById("eyeIcon");
const imageOverlay = document.getElementById("img-overlay");
const container = document.getElementById("project_container");
const viewButton = document.querySelector("#viewButton");
//Loading manager for gltf and texture loader
const loadingManager = new THREE.LoadingManager();

let isPlaying = false;
let isFirstDoorLastActionReverse = false;
let isSecondDoorLastActionReverse = false;
let isThirdDoorLastActionReverse = false;
if (screen.width < 650) {
  alert("Please try the application on a bigger screen");
}

window.addEventListener("scroll", () => {
  // if (screen.width > 800) {
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  videos.forEach((video) => {
    if (
      scrollTop >
      video.getBoundingClientRect().bottom +
        video.getBoundingClientRect().height / 2
    ) {
      let w =
        ((scrollTop -
          (video.getBoundingClientRect().bottom +
            video.getBoundingClientRect().height)) /
          scrollTop) *
        10;
      video.style.width = `${Math.max(80, 100 - (w < 0 ? 0 : w))}%`;
    }
  });
  // videoOverlay.style.top = `${Math.max(
  //   -100,
  //   250 - (scrollTop / maxScroll) * 5
  // )}vh`;
  videoOverlay.style.top = `${Math.max(
    -250,
    videos[0].getBoundingClientRect().bottom -
      videos[0].getBoundingClientRect().height / 2 -
      videoOverlay.clientHeight / 2
  )}px`;
  if (screen.width > 800) {
    titleSection.style.top = `${Math.min(
      60,
      18 + (scrollTop / maxScroll) * 10
    )}%`;
    titleSection.style.left = `${Math.min(
      50 - (titleSection.clientWidth / 2 / window.innerWidth) * 100,
      10 + (scrollTop / maxScroll) * 7
    )}%`;

    avatar.style.top = `${Math.min(42, 15 + (scrollTop / maxScroll) * 5)}%`;
    avatar.style.right = `${Math.min(
      50 - (avatar.clientWidth / 2 / window.innerWidth) * 100,
      10 + (scrollTop / maxScroll) * 3
    )}%`;

    avatar.style.width = `${Math.max(
      192,
      300 - (scrollTop / maxScroll) * 25
    )}px`;

    avatar.style.height = `${Math.max(
      192,
      300 - (scrollTop / maxScroll) * 25
    )}px`;
    // backgroundTitleLayer.style.transform = `translateY(${
    //   (scrollTop / maxScroll) * 40
    // }px)`;

    backgroundTitleLayer.style.transform = `translateY(${Math.min(
      500,
      (scrollTop / maxScroll) * 50
    )}px)`;

    if (titleSection.style.top === "60%") {
      titleSection.style.textAlign = "center";
    } else {
      titleSection.style.textAlign = "left";
    }
  }
  if (
    slidingCardContainer.getBoundingClientRect().top < 1000 &&
    slidingCardContainer.getBoundingClientRect().top > -500
  ) {
    slidingCards.forEach((slidingCard) => {
      slidingCard.style.left = `${Math.max(
        0,
        slidingCardContainer.getBoundingClientRect().top / 2
      )}px`;
    });
  }

  if (
    projectSection.getBoundingClientRect().top < window.innerHeight &&
    !isPlaying &&
    !!renderer
  ) {
    isPlaying = true;
    animate();
    beginIntroAnimation();
  }
  // }
});

// 3D

/************Function for creating a clock************/
function createClock() {
  clock = new THREE.Clock();
}
/*********Function for updating the mixer clock*********/
function updateDelta(clock) {
  if (!!mixer) mixer.update(clock.getDelta());
}
/************Function for creating geometry and assigning textures************/
async function createGeometry() {
  //Load Gltf Models
  [scene, animations] = await loadModel(loadingManager);
}
/************Function for creating renderer************/
function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 1.0);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.physicallyCorrectLights = true;
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);
}
function createLight() {
  RectAreaLightUniformsLib.init();

  // Create the light
  const areaLight1 = new THREE.RectAreaLight(0xffffff, 1000, 2.5, 2.5); // color, intensity, width, height

  areaLight1.position.set(
    14.569586753845215,
    28.555458068847656,
    -0.06361532211303711
  );
  areaLight1.rotation.set(
    -1.6805162520746064, // Rotation around X-axis
    0.49881333025792246, // Rotation around Y-axis
    0.039163861930787656 // Rotation around Z-axis
  );

  const areaLight2 = new THREE.RectAreaLight(0xffffff, 50, 2.5, 2.5); // color, intensity, width, height

  areaLight2.position.set(
    23.426809310913086,

    26.671483993530273,
    12.775914192199707
  );
  areaLight2.rotation.set(
    -1.570796461153735, // Rotation around X-axis
    0, // Rotation around Y-axis
    0 // Rotation around Z-axis
  );

  const areaLight3 = new THREE.RectAreaLight(0xffffff, 50, 2.5, 2.5); // color, intensity, width, height

  areaLight3.position.set(
    7.231897354125977,
    26.671483993530273,
    12.775914192199707
  );
  areaLight3.rotation.set(
    -1.570796461153735, // Rotation around X-axis
    0, // Rotation around Y-axis
    0 // Rotation around Z-axis
  );

  const areaLight4 = new THREE.RectAreaLight(0xffffff, 50, 2.5, 2.5); // color, intensity, width, height

  areaLight4.position.set(
    -7.04428768157959,
    25.87640953063965,
    13.295265197753906
  );
  areaLight4.rotation.set(
    -1.570796461153735, // Rotation around X-axis
    0, // Rotation around Y-axis
    0 // Rotation around Z-axis
  );

  const areaLight5 = new THREE.RectAreaLight(0xffffff, 50, 2.5, 2.5); // color, intensity, width, height

  areaLight5.position.set(
    -17.46302032470703,

    22.579334259033203,

    13.506619453430176
  );
  areaLight5.rotation.set(
    -1.570796461153735, // Rotation around X-axis
    0, // Rotation around Y-axis
    0 // Rotation around Z-axis
  );

  const spotLight = scene.children.find((l) => l.name.includes("Spot"));
  if (spotLight) {
    spotLight.intensity = 500;
  }

  // Add to scene
  scene.add(areaLight1);
  scene.add(areaLight2);
  scene.add(areaLight3);
  scene.add(areaLight4);
  scene.add(areaLight5);
}
function setupOrbitControls() {
  controls = new OrbitControls(camera, renderer.domElement);
}

/************Function for animating the scene************/
function animate() {
  renderer.setAnimationLoop(function () {
    renderer.render(scene, camera);
    updateDelta(clock);
    if (controls) {
      controls.update();
    }
  });
}

function beginIntroAnimation() {
  const audio = document.querySelector("audio");
  audio.volume = 0.2;
  audio.play();
  new Promise((resolve, reject) => {
    camera = cameras.find((c) => c.name.includes("Camera_03"));
    mixer
      .clipAction(animations.find((x) => x.name === "Camera 03 Action 01"))
      .play();

    setTimeout(() => {
      resolve();
    }, 2500);
  })
    .then(() => {
      fadeTo("Camera 03 Action 01", "Camera 02 Action 01");
      camera = cameras.find((c) => c.name.includes("Camera_02"));

      return new Promise((resolve, reject) =>
        setTimeout(() => {
          resolve();
        }, 3333)
      );
    })
    .then(() => {
      fadeTo("Camera 02 Action 01", "Camera 01 Action 01");
      camera = cameras.find((c) => c.name.includes("Camera_01"));

      playFirstDoorAction();
      playSecondDoorAction();
      playThirdDoorAction();

      scene.getObjectByName("Camera_02").position.set(12.3284, 11.02, 0.416893);

      scene
        .getObjectByName("Camera_02")
        .rotation.set(
          THREE.MathUtils.degToRad(109),
          0,
          THREE.MathUtils.degToRad(135.86)
        );

      return new Promise((resolve, reject) =>
        setTimeout(
          () => {
            resolve();
          },
          //  2083
          1250
        )
      );
    })
    .then(() => {
      fadeTo("Camera 01 Action 01", "Camera 02 Action 02");

      camera = cameras.find((c) => c.name.includes("Camera_02"));

      firstDoorPos++;
      secondDoorPos++;
      thirdDoorPos++;
      playFirstDoorAction();
      playSecondDoorAction();
      playThirdDoorAction();

      return new Promise((resolve, reject) =>
        setTimeout(() => {
          resolve();
        }, 1250)
      );
    })
    .then(() => {
      fadeTo("Camera 02 Action 02", "Camera 04 Action 01");
      camera = cameras.find((c) => c.name.includes("Camera_04"));

      firstDoorPos++;
      secondDoorPos++;
      thirdDoorPos++;
      playFirstDoorAction();
      playSecondDoorAction();
      playThirdDoorAction();
      mixer
        .clipAction(animations.find((x) => x.name === "Rod 01 Action 01"))
        .play();
      mixer
        .clipAction(animations.find((x) => x.name === "Rod 02 Action 01"))
        .play();
      mixer
        .clipAction(animations.find((x) => x.name === "Rod 03 Action 01"))
        .play();
      mixer
        .clipAction(
          animations.find((x) => x.name === "Door Holder 01 Action 01")
        )
        .play();
      mixer
        .clipAction(
          animations.find((x) => x.name === "Door Holder 02 Action 01")
        )
        .play();
      fadeTo("Camera 01 Action 01", "Camera 01 Action 02");
      return new Promise((resolve, reject) =>
        setTimeout(() => {
          resolve();
        }, 2000)
      );
    })
    .then(() => {
      camera = cameras.find((c) => c.name.includes("Camera_01"));

      return new Promise((resolve, reject) =>
        setTimeout(() => {
          resolve();
        }, 1000)
      );
    })
    .then(() => {
      mixer
        .clipAction(animations.find((x) => x.name === "Camera 01 Action 02"))
        .setEffectiveWeight(0);
      mixer.clipAction(
        animations.find((x) => x.name === "Camera 01 Action 02")
      ).paused = true;
      camera = cameras.find((c) => c.name.includes("Camera_04"));

      document.getElementById("nextBtn").style.visibility = "visible";

      document.getElementById("prevBtn").style.visibility = "visible";
    });
}
function playPrevDoorAnimation() {
  new Promise((resolve, reject) => {
    camera = cameras.find((c) => c.name.includes("Camera_04"));
    fadeTo("Camera 04 Action 01", "Camera 04 Action 03");
    fadeTo("Camera 01 Action 01", "Camera 01 Action 02");

    playFirstDoorAction(true);

    playSecondDoorAction(true);

    playThirdDoorAction(true);
    playDoorHolderAction(1, 2);

    setTimeout(() => {
      resolve();
    }, 1667);
  })
    .then(() => {
      camera = cameras.find((c) => c.name.includes("Camera_01"));

      return new Promise((resolve, reject) =>
        setTimeout(() => {
          resolve();
        }, 500)
      );
    })
    .then(() => {
      camera = cameras.find((c) => c.name.includes("Camera_04"));

      return new Promise((resolve, reject) =>
        setTimeout(() => {
          resolve();
        }, 333)
      );
    })

    .then(() => {
      return new Promise((resolve, reject) => {
        console.log(currentDoorIndex);
        if (currentDoorIndex === 0) {
          scene.getObjectByName("ThirdDoor").visible = false;
          scene.getObjectByName("ThirdHanger").visible = false;
        } else if (currentDoorIndex === 1) {
          scene.getObjectByName("FirstDoor").visible = false;
          scene.getObjectByName("FirstHanger").visible = false;
        } else {
          scene.getObjectByName("SecondDoor").visible = false;
          scene.getObjectByName("SecondHanger").visible = false;
        }
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    })

    .then(() => {
      return new Promise((resolve, reject) => {
        if (currentDoorIndex === 0) {
          scene.getObjectByName("ThirdDoor").visible = true;
          scene.getObjectByName("ThirdHanger").visible = true;
        } else if (currentDoorIndex === 1) {
          scene.getObjectByName("FirstDoor").visible = true;
          scene.getObjectByName("FirstHanger").visible = true;
        } else {
          scene.getObjectByName("SecondDoor").visible = true;
          scene.getObjectByName("SecondHanger").visible = true;
        }
        setTimeout(() => {
          resolve();
        }, 1500);
      });
    })

    .then(() => {
      playDoorHolderAction(2, 1);

      return new Promise((resolve, reject) =>
        setTimeout(() => {
          resolve();
        }, 2000)
      );
    })
    .then(() => {
      camera = cameras.find((c) => c.name.includes("Camera_01"));

      return new Promise((resolve, reject) =>
        setTimeout(() => {
          resolve();
        }, 500)
      );
    })
    .then(() => {
      camera = cameras.find((c) => c.name.includes("Camera_04"));

      currentDoorIndex =
        currentDoorIndex - 1 < 0
          ? 3 - currentDoorIndex - 1
          : currentDoorIndex - 1;
      if (currentProject === 0) {
        currentProject = projectData.length - 1;
      } else {
        currentProject--;
        if (currentProject == 0) {
          viewButton.style.visibility = "hidden";
        } else {
          viewButton.style.visibility = "visible";
        }
      }
    });
}

function playNextDoorAnimation() {
  new Promise((resolve, reject) => {
    camera = cameras.find((c) => c.name.includes("Camera_04"));
    // mixer
    //   .clipAction(animations.find((x) => x.name === "Camera 04 Action 01"))
    //   .stop();
    // mixer
    //   .clipAction(animations.find((x) => x.name === "Camera 04 Action 02"))
    //   .play();

    const action = mixer.clipAction(
      animations.find((x) => x.name === "Camera 04 Action 02")
    );

    if (action.isRunning()) {
      fadeTo("Camera 04 Action 02", "Camera 04 Action 02");
    }
    fadeTo("Camera 04 Action 01", "Camera 04 Action 02");

    if (currentDoorIndex === 0) {
      firstDoorPos++;

      playFirstDoorAction();
    } else if (currentDoorIndex === 1) {
      secondDoorPos++;

      playSecondDoorAction();
    } else {
      thirdDoorPos++;
      playThirdDoorAction();
    }
    playDoorHolderAction(1, 2);

    setTimeout(() => {
      resolve();
    }, 4166);
  })
    .then(() => {
      return new Promise((resolve, reject) => {
        if (currentDoorIndex === 0) {
          scene.getObjectByName("FirstDoor").visible = false;
        } else if (currentDoorIndex === 1) {
          scene.getObjectByName("SecondDoor").visible = false;
        } else {
          scene.getObjectByName("ThirdDoor").visible = false;
        }
        setTimeout(() => {
          resolve();
        }, 834);
      });
    })
    .then(() => {
      if (currentDoorIndex === 0) {
        scene.getObjectByName("FirstDoor").visible = true;
      } else if (currentDoorIndex === 1) {
        scene.getObjectByName("SecondDoor").visible = true;
      } else {
        scene.getObjectByName("ThirdDoor").visible = true;
      }

      firstDoorPos++;
      playFirstDoorAction();
      secondDoorPos++;
      playSecondDoorAction();
      thirdDoorPos++;
      playThirdDoorAction();
      playDoorHolderAction(2, 1);
      return new Promise((resolve, reject) =>
        setTimeout(() => {
          resolve();
        }, 1250)
      );
    })

    .then(() => {
      if (firstDoorPos == 0) {
        firstDoorPos++;
        playFirstDoorAction();
      } else if (secondDoorPos == 0) {
        secondDoorPos++;
        playSecondDoorAction();
      } else if (thirdDoorPos == 0) {
        thirdDoorPos++;
        playThirdDoorAction();
      }

      return new Promise((resolve, reject) =>
        setTimeout(() => {
          resolve();
        }, 750)
      );
    })
    .then(() => {
      fadeTo("Camera 01 Action 01", "Camera 01 Action 02");
      camera = cameras.find((c) => c.name.includes("Camera_01"));
      return new Promise((resolve, reject) =>
        setTimeout(() => {
          resolve();
        }, 500)
      );
    })

    .then(() => {
      if (firstDoorPos == 1) {
        firstDoorPos++;
        playFirstDoorAction();
      } else if (secondDoorPos == 1) {
        secondDoorPos++;
        playSecondDoorAction();
      } else if (thirdDoorPos == 1) {
        thirdDoorPos++;
        playThirdDoorAction();
      }

      return new Promise((resolve, reject) =>
        setTimeout(() => {
          resolve();
        }, 500)
      );
    })
    .then(() => {
      const action = mixer.clipAction(
        animations.find((x) => x.name === "Camera 01 Action 02")
      );
      action.setEffectiveWeight(0);
      action.paused = false;
      camera = cameras.find((c) => c.name.includes("Camera_04"));
      return new Promise((resolve, reject) =>
        setTimeout(() => {
          resolve();
        }, 1000)
      );
    })

    .then(() => {
      if (currentDoorIndex === 2) {
        currentDoorIndex = 0;
      } else {
        currentDoorIndex++;
      }
      if (currentProject === projectData.length - 1) {
        currentProject = 0;
        viewButton.style.visibility = "hidden";
      } else {
        viewButton.style.visibility = "visible";
        currentProject++;
        document.getElementById("page-number").textContent = `${
          currentProject + 1
        } / ${projectData.length}`;
      }

      document.getElementById("project-description").textContent =
        projectData[currentProject].projectDescription;
      document
        .getElementById("img-overlay")
        .setAttribute("src", projectData[currentProject].projectThumbnail);
      document.querySelector(".project-title ").textContent =
        projectData[currentProject].projectName;
    });
}

function fadeTo(prevName, nextName) {
  const prev = mixer.clipAction(animations.find((x) => x.name === prevName));
  const next = mixer.clipAction(animations.find((x) => x.name === nextName));

  if (prev && next) {
    prev.setEffectiveWeight(0);
    prev.paused = true;

    next.reset();
    next.setLoop(THREE.LoopOnce, 1);
    next.clampWhenFinished = true;
    next.enabled = true;
    next.setEffectiveWeight(1);
    next.paused = false;
    next.play();
  }
}

function playDoorHolderAction(toStop, toPlay) {
  fadeTo(`Rod 01 Action 0${toStop}`, `Rod 01 Action 0${toPlay}`);
  fadeTo(`Rod 02 Action 0${toStop}`, `Rod 02 Action 0${toPlay}`);
  fadeTo(`Rod 03 Action 0${toStop}`, `Rod 03 Action 0${toPlay}`);
  fadeTo(
    `Door Holder 01 Action 0${toStop}`,
    `Door Holder 01 Action 0${toPlay}`
  );
  fadeTo(
    `Door Holder 02 Action 0${toStop}`,
    `Door Holder 02 Action 0${toPlay}`
  );
}

function playFirstDoorAction(reverse) {
  let toStop, toPlay;
  if (firstDoorPos > 5) {
    firstDoorPos = 0;
  }
  if (!!reverse) {
    if (currentDoorIndex === 0) {
      toStop = isFirstDoorLastActionReverse ? 8 : 4;
      toPlay = 6;
      firstDoorPos = 3;
    } else if (currentDoorIndex === 1) {
      toStop = isFirstDoorLastActionReverse ? 7 : 2;
      toPlay = 8;
      firstDoorPos = 4;
    } else {
      toStop = isFirstDoorLastActionReverse ? 6 : 3;
      toPlay = 7;
      firstDoorPos = 2;
    }
    isFirstDoorLastActionReverse = true;
  } else {
    toStop = firstDoorPos - 1 < 0 ? 6 - firstDoorPos - 1 : firstDoorPos - 1;

    toPlay = firstDoorPos;

    if (isFirstDoorLastActionReverse) {
      if (currentDoorIndex === 0) {
        toStop = 8;
      } else if (currentDoorIndex == 1) {
        toStop = 7;
      } else {
        toStop = 6;
      }
    }
    isFirstDoorLastActionReverse = false;
  }

  fadeTo(`First Door Action 0${toStop}`, `First Door Action 0${toPlay}`);
  fadeTo(`First Hanger Action 0${toStop}`, `First Hanger Action 0${toPlay}`);
}

function playSecondDoorAction(reverse) {
  let toStop, toPlay;

  if (secondDoorPos > 5) {
    secondDoorPos = 0;
  }
  if (!!reverse) {
    if (currentDoorIndex === 0) {
      toStop = isSecondDoorLastActionReverse ? 6 : 3;
      toPlay = 7;
      secondDoorPos = 2;
    } else if (currentDoorIndex === 1) {
      toStop = isSecondDoorLastActionReverse ? 8 : 4;
      toPlay = 6;
      secondDoorPos = 3;
    } else {
      toStop = isSecondDoorLastActionReverse ? 7 : 2;
      toPlay = 8;
      secondDoorPos = 4;
    }
    isSecondDoorLastActionReverse = true;
  } else {
    toStop = secondDoorPos - 1 < 0 ? 6 - secondDoorPos - 1 : secondDoorPos - 1;

    toPlay = secondDoorPos;

    if (isSecondDoorLastActionReverse) {
      if (currentDoorIndex === 0) {
        toStop = 6;
      } else if (currentDoorIndex == 1) {
        toStop = 8;
      } else {
        toStop = 7;
      }
    }
    isSecondDoorLastActionReverse = false;
  }
  fadeTo(`Second Door Action 0${toStop}`, `Second Door Action 0${toPlay}`);
  fadeTo(`Second Hanger Action 0${toStop}`, `Second Hanger Action 0${toPlay}`);
}

function playThirdDoorAction(reverse) {
  let toStop, toPlay;
  if (thirdDoorPos > 5) {
    thirdDoorPos = 0;
  }
  if (!!reverse) {
    if (currentDoorIndex === 0) {
      toStop = isThirdDoorLastActionReverse ? 7 : 2;
      toPlay = 8;
      thirdDoorPos = 4;
    } else if (currentDoorIndex === 1) {
      toStop = isThirdDoorLastActionReverse ? 6 : 3;
      toPlay = 7;
      thirdDoorPos = 2;
    } else {
      toStop = isThirdDoorLastActionReverse ? 8 : 4;
      toPlay = 6;
      thirdDoorPos = 3;
    }
    isThirdDoorLastActionReverse = true;
  } else {
    toStop = thirdDoorPos - 1 < 0 ? 6 - thirdDoorPos - 1 : thirdDoorPos - 1;

    toPlay = thirdDoorPos;
    if (isThirdDoorLastActionReverse) {
      if (currentDoorIndex === 0) {
        toStop = 7;
      } else if (currentDoorIndex == 1) {
        toStop = 6;
      } else {
        toStop = 8;
      }
    }
    isThirdDoorLastActionReverse = false;
  }

  fadeTo(`Third Door Action 0${toStop}`, `Third Door Action 0${toPlay}`);
  fadeTo(`Third Hanger Action 0${toStop}`, `Third Hanger Action 0${toPlay}`);
}

/************Function for initialising the scene************/
async function init() {
  createClock();
  await createGeometry();
  createLight();

  container.style.width = "80%";

  container.style.height = `${container.clientWidth / 2}px`;
  container.style.margin = "0 auto";
  container.style.position = "relative";
  container.style.top = "-150px";

  imageOverlay.style.width = `${container.clientWidth}px`;

  imageOverlay.style.height = `${container.clientWidth / 2}px`;
  imageOverlay.style.margin = "0 auto";

  document.getElementById("project-description").textContent =
    projectData[currentProject].projectDescription;
  document
    .getElementById("img-overlay")
    .setAttribute("src", projectData[currentProject].projectThumbnail);
  document.querySelector(".project-title ").textContent =
    projectData[currentProject].projectName;

  document
    .getElementById("githubURL")
    .setAttribute("href", projectData[currentProject].githubUrl);
  document.getElementById("githubURL").textContent =
    projectData[currentProject].githubUrl;

  document.getElementById(
    "responsive"
  ).textContent = `Responsive: ${projectData[currentProject].responsive}`;
  document.getElementById(
    "compatiblity"
  ).textContent = `Compatible Devices: ${projectData[currentProject].compatibleDevices}`;
  document
    .getElementById("nextBtn")
    .addEventListener("click", playNextDoorAnimation);
  document.getElementById("nextBtn").style.visibility = "hidden";
  document
    .getElementById("prevBtn")
    .addEventListener("click", playPrevDoorAnimation);

  document.getElementById("prevBtn").style.visibility = "hidden";
  document.addEventListener("keydown", (event) => {
    const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
    if (isPlaying) {
      if (key === "ArrowRight") {
        playNextDoorAnimation();
      } else if (key === "ArrowLeft") {
        playPrevDoorAnimation();
      }
    }
  });

  mixer = new THREE.AnimationMixer(scene);
  cameras = scene.children.filter((c) => c.name.includes("Camera"));
  camera = cameras.find((c) => c.name.includes("Camera_02"));
  createRenderer();

  animations.forEach((clip) => {
    const action = mixer.clipAction(clip);
    action.setLoop(THREE.LoopOnce);
    action.clampWhenFinished = true;
  });
  mixer.stopAllAction();

  const vrButton = VRButton.createButton(renderer);
  vrButton.style.position = "absolute";
  vrButton.style.top = "100px";
  vrButton.style.right = `${
    window.innerWidth -
    (container.offsetLeft +
      container.clientWidth +
      container.offsetParent.offsetLeft -
      70)
  }px`;
  fullscreenIcon.style.top = "110px";
  fullscreenIcon.style.right = `${
    window.innerWidth -
    (container.offsetLeft +
      container.clientWidth +
      container.offsetParent.offsetLeft -
      20)
  }px`;
  eyeIcon.style.top = "115px";
  eyeIcon.style.right = `${
    window.innerWidth -
    (container.offsetLeft +
      container.clientWidth +
      container.offsetParent.offsetLeft -
      120)
  }px`;

  projectSection.appendChild(vrButton);

  renderer.xr.addEventListener("sessionstart", () => {
    renderer.domElement.style.height = "100vh";
    renderer.domElement.style.width = "100%";
    vrButton.style.position = "fixed";
    vrButton.innerHTML =
      '<img src="../assets/images/vr-glasses.png" alt="Enter VR" style="width:24px;height:24px;">';
    vrButton.style.backgroundColor = "transparent";
    vrButton.style.border = "none";
    vrButton.style.top = "20px";
    vrButton.style.right = "20px";
    fullscreenIcon.style.visibility = "hidden";
    eyeIcon.style.visibility = "hidden";
    console.log(renderer.xr.getCamera());
    renderer.xr
      .getCamera()
      .position.set(camera.position.x, camera.position.y, camera.position.z);
    setupOrbitControls();
  });

  renderer.xr.addEventListener("sessionend", () => {
    vrButton.style.position = "absolute";
    renderer.domElement.style.height = "80vh";
    renderer.domElement.style.width = "80%";
    vrButton.innerHTML =
      '<img src="../assets/images/vr-glasses.png" alt="Enter VR" style="width:24px;height:24px;">';
    vrButton.style.backgroundColor = "transparent";
    vrButton.style.border = "none";
    vrButton.style.top = "100px";
    vrButton.style.right = `${
      window.innerWidth -
      (container.offsetLeft +
        container.clientWidth +
        container.offsetParent.offsetLeft -
        70)
    }px`;
    fullscreenIcon.style.top = "100px";
    fullscreenIcon.style.right = `${
      window.innerWidth -
      (container.offsetLeft +
        container.clientWidth +
        container.offsetParent.offsetLeft -
        20)
    }px`;
    eyeIcon.style.top = "115px";
    eyeIcon.style.right = `${
      window.innerWidth -
      (container.offsetLeft +
        container.clientWidth +
        container.offsetParent.offsetLeft -
        120)
    }px`;
    eyeIcon.style.visibility = "visible";
    fullscreenIcon.style.visibility = "visible";
    controls = undefined;
  });

  fullscreenIcon.addEventListener("pointerup", () => {
    if (renderer.domElement.requestFullscreen) {
      fullscreenIcon.style.visibility = "none";
      vrButton.style.visibility = "none";

      renderer.domElement.requestFullscreen();
    } else if (renderer.domElement.webkitRequestFullscreen) {
      fullscreenIcon.style.visibility = "none";
      vrButton.style.visibility = "none";

      /* Safari */
      renderer.domElement.webkitRequestFullscreen();
    } else if (renderer.domElement.msRequestFullscreen) {
      fullscreenIcon.style.visibility = "none";
      vrButton.style.visibility = "none";

      /* IE11 */
      renderer.domElement.msRequestFullscreen();
    }
  });
  document.addEventListener("fullscreenchange", function (event) {
    if (
      !document.fullscreenElement &&
      // For Safari (WebKit)
      !document.webkitFullscreenElement &&
      // For IE11 (ms)
      !document.msFullscreenElement
    ) {
      fullscreenIcon.style.visibility = "visible";
      vrButton.style.visibility = "visible";
    }
  });

  eyeIcon.addEventListener("mouseenter", () => {
    imageOverlay.style.zIndex = container.style.zIndex + 1;
    viewButton.style.zIndex = container.style.zIndex + 2;
  });
  eyeIcon.addEventListener("mouseleave", () => {
    imageOverlay.style.zIndex = -1;
    viewButton.style.zIndex = 1;
  });
  viewButton.onclick = function () {
    location.href = projectData[currentProject].url;
  };
  viewButton.style.visibility = "hidden";
  document.getElementById("page-number").textContent = `${
    currentProject + 1
  } / ${projectData.length}`;
  let mouseX, mouseY;
  let traX, traY;
  projectSection.addEventListener("mousemove", function (e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
    traX = (12 * mouseX) / 570 + 40;
    traY = (12 * mouseY) / 570 + 50;

    document.querySelector(
      ".project-title"
    ).style.backgroundPosition = `${traX}% ${traY}%`;
    document.querySelector(".project-title").style.backgroundClip = "text";
  });

  setTimeout(() => {
    vrButton.innerHTML =
      '<img src="../assets/images/vr-glasses.png" alt="Enter VR" style="width:24px;height:24px;">';
    vrButton.style.backgroundColor = "transparent";
    vrButton.style.border = "none";
  });
}
init();
