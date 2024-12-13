const currentIndices = {
  1: 2,
  2: 2,
  3: 2,
  4: 2,
};

function updateCarousel(id) {
  const images = document.querySelectorAll(`#carousel${id} .carousel-image`);
  const currentIndex = currentIndices[id];
  images.forEach((img, index) => {
    img.classList.remove("central");
    img.style.opacity = "0";
    img.style.position = "absolute";

    // The central image itself
    if (index === currentIndex) {
      img.classList.add("central");
      img.style.opacity = "1";
      img.style.position = "relative";
      img.style.gridColumn = "3";
    }

    // Images next to the central one
    if (Math.abs(index - currentIndex) === 1) {
      img.style.opacity = ".6";
      img.style.position = "relative";
      if (index < currentIndex) {
        img.style.gridColumn = "2";
      } else {
        img.style.gridColumn = "4";
      }
    }

    // Image two away from central
    if (Math.abs(index - currentIndex) === 2) {
      img.style.opacity = ".3";
      img.style.position = "relative";
      if (index < currentIndex) {
        img.style.gridColumn = "1";
      } else {
        img.style.gridColumn = "5";
      }
    }
  });
}

function shiftLeft(id) {
  const images = document.querySelectorAll(`#carousel${id} .carousel-image`);
  currentIndices[id] = (currentIndices[id] - 1 + images.length) % images.length;
  updateCarousel(id);
}

function shiftRight(id) {
  const images = document.querySelectorAll(`#carousel${id} .carousel-image`);
  currentIndices[id] = (currentIndices[id] + 1) % images.length;
  updateCarousel(id);
}

for (const idx in currentIndices) {
  updateCarousel(idx);
}
