let pressureBtn = document.getElementById("pressureBtn");
let pressureContent = document.getElementById("pressure-content");

let sugarBtn = document.getElementById("sugar");
let sugarContent = document.getElementById("sugar-content");

let healthyBtn = document.getElementById("healthy-drop");
let healthyContent = document.getElementById("healthy-content");

// Variables to open and close drop down//
let pressureMenu = false;
let sugarMenu = false;
let healthyMenu = false;

// Variables to keep drop down close//
pressureContent.style.display = "none";
sugarContent.style.display = "none";
healthyContent.style.display = "none";

// Eventlistener to click to open dropdown menu//
pressureBtn.addEventListener("click", () => {
  if (pressureMenu) {
    pressureContent.style.display = "none";
    pressureMenu = false;
  } else {
    pressureContent.style.display = "flex";
    pressureMenu = true;
  }
});

sugarBtn.addEventListener("click", () => {
  if (sugarMenu) {
    sugarContent.style.display = "none";
    sugarMenu = false;
  } else {
    sugarContent.style.display = "flex";
    sugarMenu = true;
  }
});

healthyBtn.addEventListener("click", () => {
  if (healthyMenu) {
    healthyContent.style.display = "none";
    healthyMenu = false;
  } else {
    healthyContent.style.display = "flex";
    healthyMenu = true;
  }
});
