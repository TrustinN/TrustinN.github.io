const toggleMenu = () => {
  const menu = document.getElementById("menu");
  menu.classList.toggle("active");
  const menuIconMid = document.querySelector(".menu-icon");
  menuIconMid.classList.toggle("active");
};
