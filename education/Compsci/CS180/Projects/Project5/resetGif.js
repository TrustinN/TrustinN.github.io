function resetGif(gif) {
  let originalSrc = gif.src.split("?")[0];
  gif.src = originalSrc + "?timestamp=" + new Date().getTime();
}

function resetSiblingGif(element) {
  const sibling = element.nextElementSibling;
  if (sibling && sibling.classList.contains("emerge")) {
    resetGif(sibling);
  }
}
