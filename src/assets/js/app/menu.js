// const menu = document.querySelector('.menu');
// const menuSection = menu.querySelector('.menu-section');
// const menuArrow = menu.querySelector('.menu-mobile-arrow');
// const menuClosed = menu.querySelector('.menu-mobile-close');
// const menuTrigger = document.querySelector('.menu-mobile-trigger');
// const menuOverlay = document.querySelector('.overlay');
// let subMenu;

// menuSection.addEventListener('click', (e) => {
//    if (!menu.classList.contains('active')) {
//       return;
//    }

//    if (e.target.closest('.menu-item-has-children')) {
//       const hasChildren = e.target.closest('.menu-item-has-children');
//       showSubMenu(hasChildren);
//    }
// });

// menuArrow.addEventListener('click', () => {
//    hideSubMenu();
// });

// menuTrigger.addEventListener('click', () => {
//    toggleMenu();
// });

// menuClosed.addEventListener('click', () => {
//    toggleMenu();
// });

// menuOverlay.addEventListener('click', () => {
//    toggleMenu();
// });

// function toggleMenu() {
//    menu.classList.toggle('active');
//    menuOverlay.classList.toggle('active');
// }

// function showSubMenu(hasChildren) {
//    subMenu = hasChildren.querySelector('.menu-subs');
//    subMenu.classList.add('active');
//    subMenu.style.animation = 'slideLeft 0.5s ease forwards';
//    const menuTitle = hasChildren.querySelector('i').parentNode.childNodes[0].textContent;
//    menu.querySelector('.menu-mobile-title').innerHTML = menuTitle;
//    menu.querySelector('.menu-mobile-header').classList.add('active');
// }

// function hideSubMenu() {
//    subMenu.style.animation = 'slideRight 0.5s ease forwards';
//    setTimeout(() => {
//       subMenu.classList.remove('active');
//    }, 300);

//    menu.querySelector('.menu-mobile-title').innerHTML = '';
//    menu.querySelector('.menu-mobile-header').classList.remove('active');
// }

// window.onresize = function () {
//    if (this.innerWidth > 991) {
//       if (menu.classList.contains('active')) {
//          toggleMenu();
//       }
//    }
// };


const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".mobile-sidebar");
const closeButton = document.querySelector(".sidebar-close");
const overlay = document.querySelector(".sidebar-overlay");
const navLinks = Array.from(
  document.querySelectorAll(".nav a[data-nav-item], .mobile-nav a[data-nav-item]")
);
let lastFocusedElement = null;
let lockedScrollY = 0;

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const setSidebarFocusableState = (isEnabled) => {
  if (!sidebar) return;

  const elements = Array.from(sidebar.querySelectorAll(FOCUSABLE_SELECTOR));
  elements.forEach((element) => {
    if (isEnabled) {
      const previousTabindex = element.getAttribute("data-prev-tabindex");
      if (previousTabindex !== null) {
        if (previousTabindex === "") {
          element.removeAttribute("tabindex");
        } else {
          element.setAttribute("tabindex", previousTabindex);
        }
        element.removeAttribute("data-prev-tabindex");
      } else if (element.getAttribute("tabindex") === "-1") {
        element.removeAttribute("tabindex");
      }
      return;
    }

    if (!element.hasAttribute("data-prev-tabindex")) {
      const currentTabindex = element.getAttribute("tabindex");
      element.setAttribute("data-prev-tabindex", currentTabindex ?? "");
    }
    element.setAttribute("tabindex", "-1");
  });
};

const getFocusableElements = () => {
  if (!sidebar) return [];
  return Array.from(sidebar.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.hasAttribute("disabled") && element.offsetParent !== null
  );
};

const lockPageScroll = () => {
  lockedScrollY = window.scrollY || window.pageYOffset || 0;
  document.body.style.position = "fixed";
  document.body.style.top = `-${lockedScrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";
};

const unlockPageScroll = () => {
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  document.body.style.overflow = "";
  window.scrollTo(0, lockedScrollY);
};

const openSidebar = () => {
  lastFocusedElement = document.activeElement;
  lockPageScroll();
  sidebar.classList.add("is-open");
  overlay.classList.add("is-visible");
  overlay.hidden = false;
  sidebar.setAttribute("aria-hidden", "false");
  menuToggle.setAttribute("aria-expanded", "true");
  setSidebarFocusableState(true);

  // Focus first menu item, keep close button as last tab stop.
  const focusableElements = getFocusableElements();
  const menuItems = focusableElements.filter((element) => element !== closeButton);
  const firstTarget = menuItems[0] || closeButton;
  if (firstTarget) {
    firstTarget.focus();
  }
};

const closeSidebar = () => {
  sidebar.classList.remove("is-open");
  overlay.classList.remove("is-visible");
  unlockPageScroll();
  sidebar.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-expanded", "false");
  setSidebarFocusableState(false);

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
};

const trapSidebarFocus = (event) => {
  if (!sidebar.classList.contains("is-open")) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeSidebar();
    return;
  }

  if (event.key !== "Tab") return;

  const focusableElements = getFocusableElements();
  if (!focusableElements.length) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  const activeElement = document.activeElement;

  if (event.shiftKey && activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
    return;
  }

  if (!event.shiftKey && activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
};

const setActiveNavItem = (itemKey) => {
  navLinks.forEach((link) => {
    if (link.dataset.navItem === itemKey) {
      link.setAttribute("aria-current", "page");
      return;
    }
    link.removeAttribute("aria-current");
  });
};

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const itemKey = link.dataset.navItem;
    if (!itemKey) return;
    setActiveNavItem(itemKey);
  });
});

if (menuToggle && sidebar && closeButton && overlay) {
  setSidebarFocusableState(false);
  menuToggle.addEventListener("click", openSidebar);
  closeButton.addEventListener("click", closeSidebar);
  overlay.addEventListener("click", closeSidebar);
  document.addEventListener("keydown", trapSidebarFocus);

  sidebar.addEventListener("transitionend", () => {
    if (!sidebar.classList.contains("is-open")) {
      overlay.hidden = true;
    }
  });
}