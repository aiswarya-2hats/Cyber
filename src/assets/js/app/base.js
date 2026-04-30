const siteHeader = document.querySelector(".site-header");

if (siteHeader) {
  let lastScrollY = window.scrollY;
  const topThreshold = 10;
  let isTicking = false;

  const updateHeaderState = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= topThreshold) {
      siteHeader.classList.add("is-sticky");
      siteHeader.classList.remove("is-hidden");
    } else {
      if (currentScrollY < lastScrollY) {
        siteHeader.classList.add("is-sticky");
        siteHeader.classList.remove("is-hidden");
      } else if (currentScrollY > lastScrollY) {
        siteHeader.classList.add("is-hidden");
      }
    }

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
}