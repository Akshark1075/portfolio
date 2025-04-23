import {
  DEMONSTRATOR_JOB_DESCRIPTION,
  ACCENTURE_JOB_DESCRIPTION,
  INFOSYS_JOB_DESCRIPTION,
} from "./constants.js";
const description = document.getElementById("description");
const descContent = [
  INFOSYS_JOB_DESCRIPTION,
  ACCENTURE_JOB_DESCRIPTION,

  DEMONSTRATOR_JOB_DESCRIPTION,
];
description.innerText = descContent[2];
var swiper = new Swiper(".swiper", {
  effect: "cards",
  grabCursor: true,
  initialSlide: 2,
  speed: 500,
  loop: true,
  rotate: true,
  perSlideOffset: 5,
  slideShadows: true,
  mousewheel: {
    invert: false,
  },
});
swiper.on("slideChange", (s) => {
  console.log(s.realIndex);
  description.innerText = descContent[s.realIndex];
});
