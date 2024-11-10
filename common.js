// Header element

const toggleMenu = () => {
  const menu = document.getElementById("menu");
  menu.classList.toggle("active");
  const menuIconMid = document.querySelector(".menu-icon");
  menuIconMid.classList.toggle("active");
};

const createListItem = (name, link) => {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = link;
  a.textContent = name;
  li.append(a);
  return li;
};

subSections = {
  Home: "/index.html",
  Projects: "/projects/index.html",
  Education: "/education/index.html",
  Hobbies: "/hobbies/index.html",
  Github: "https://github.com/TrustinN",
};

const createHeaderNav = (label = "") => {
  const hNav = document.createElement("nav");
  const ul = document.createElement("ul");
  for (const key in subSections) {
    const li = createListItem(key, subSections[key]);
    if (key == "Github") {
      li.firstElementChild.classList.add("github");
    }
    ul.append(li);
  }

  hNav.append(ul);
  hNav.setAttribute("aria-label", label);
  hNav.id = "menu";
  return hNav;
};

const createHeaderTitle = () => {
  const div = document.createElement("div");
  const button = document.createElement("button");
  button.classList.add("menu-button");
  button.type = "button";
  button.onclick = toggleMenu;

  const icon = document.createElement("div");
  icon.classList.add("menu-icon");

  button.append(icon);
  div.append(button);
  div.classList.add("header-title");

  return div;
};

const hNav = createHeaderNav("About Me Details");
const hTitle = createHeaderTitle();
const header = document.querySelector("header");

header.append(hTitle);
header.append(hNav);

// Sidebar element

const createSidebarNav = (label = "") => {
  const sidebarNav = document.createElement("nav");
  sidebarNav.setAttribute("aria-label", label);
  const ul = document.createElement("ul");
  const articles = document.querySelectorAll("article");
  for (const article of articles) {
    id = article.id;
    const li = createListItem(id, `#${id}`);
    ul.append(li);
  }
  sidebarNav.append(ul);
  return sidebarNav;
};

const nav = createSidebarNav();
const sNav = document.querySelector(".sidebar-nav");
sNav.append(nav);

// Footer Element

const footer = document.getElementsByTagName("footer");
footer.innerHTML = `
  <div>&lt;&lt;&lt; &copy; Trustin Nguyen &gt;&gt;&gt;</div>
  <div><a href="#"> Back to Top </a></div>
`;

// MathJax options

MathJax = {
  tex: {
    inlineMath: [["$", "$"]],
  },
};
