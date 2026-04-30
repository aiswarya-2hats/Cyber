const siteHeader = document.querySelector(".site-header");

if (siteHeader) {
  let lastScrollY = window.scrollY;
  const topThreshold = 10;
  let isTicking = false;
  const mobileSidebar = document.querySelector(".mobile-sidebar");

  const syncStickyOffset = () => {
    if (siteHeader.classList.contains("is-sticky")) {
      document.body.style.setProperty("--header-offset", `${siteHeader.offsetHeight}px`);
      document.body.classList.add("has-sticky-header");
    } else {
      document.body.classList.remove("has-sticky-header");
      document.body.style.removeProperty("--header-offset");
    }
  };

  const updateHeaderState = () => {
    const currentScrollY = window.scrollY;
    const isMobileSidebarOpen =
      mobileSidebar &&
      window.matchMedia("(max-width: 950px)").matches &&
      mobileSidebar.classList.contains("is-open");

    if (isMobileSidebarOpen) {
      siteHeader.classList.add("is-sticky");
      siteHeader.classList.remove("is-hidden");
      syncStickyOffset();
      lastScrollY = currentScrollY;
      isTicking = false;
      return;
    }

    if (currentScrollY <= topThreshold) {
      siteHeader.classList.remove("is-sticky");
      siteHeader.classList.remove("is-hidden");
    } else {
      if (currentScrollY < lastScrollY) {
        siteHeader.classList.add("is-sticky");
        siteHeader.classList.remove("is-hidden");
      } else if (currentScrollY > lastScrollY) {
        siteHeader.classList.add("is-hidden");
      }
    }

    syncStickyOffset();
    lastScrollY = currentScrollY;
    isTicking = false;
  };

  updateHeaderState();
  window.addEventListener(
    "scroll",
    () => {
      if (!isTicking) {
        window.requestAnimationFrame(updateHeaderState);
        isTicking = true;
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", syncStickyOffset);
}