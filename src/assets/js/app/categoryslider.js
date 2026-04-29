const categorySection = document.querySelector(".category-section");

if (categorySection) {
  const sliderViewport = categorySection.querySelector(".category-slider-viewport");
  const sliderTrack = categorySection.querySelector(".category-track");
  const pages = Array.from(categorySection.querySelectorAll(".category-grid"));
  const prevBtn = categorySection.querySelector(".category-prev");
  const nextBtn = categorySection.querySelector(".category-next");

  if (sliderViewport && sliderTrack && pages.length) {
    let activePage = 0;
    let touchStartX = 0;
    let touchDeltaX = 0;
    let isDragging = false;

    const getMaxPage = () => pages.length - 1;

    const updateSlider = () => {
      const viewportWidth = sliderViewport.clientWidth;
      const gap = 24;
      const translateX = activePage * (viewportWidth + gap);
      sliderTrack.style.transform = `translateX(-${translateX}px)`;

      if (prevBtn) prevBtn.disabled = activePage === 0;
      if (nextBtn) nextBtn.disabled = activePage >= getMaxPage();
    };

    const handleTouchStart = (event) => {
      isDragging = true;
      touchStartX = event.touches[0].clientX;
      touchDeltaX = 0;
      sliderTrack.style.transition = "none";
    };

    const handleTouchMove = (event) => {
      if (!isDragging) return;
      const currentX = event.touches[0].clientX;
      touchDeltaX = currentX - touchStartX;
      const viewportWidth = sliderViewport.clientWidth;
      const gap = 24;
      const baseTranslate = activePage * (viewportWidth + gap);
      sliderTrack.style.transform = `translateX(${-(baseTranslate - touchDeltaX)}px)`;
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      sliderTrack.style.transition = "transform 0.45s ease";

      const threshold = (sliderViewport.clientWidth || 1) * 0.15;
      if (Math.abs(touchDeltaX) > threshold) {
        if (touchDeltaX < 0) {
          activePage = Math.min(getMaxPage(), activePage + 1);
        } else {
          activePage = Math.max(0, activePage - 1);
        }
      }

      updateSlider();
    };

    prevBtn?.addEventListener("click", () => {
      activePage = Math.max(0, activePage - 1);
      updateSlider();
    });

    nextBtn?.addEventListener("click", () => {
      activePage = Math.min(getMaxPage(), activePage + 1);
      updateSlider();
    });

    sliderViewport.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    sliderViewport.addEventListener("touchmove", handleTouchMove, {
      passive: true,
    });
    sliderViewport.addEventListener("touchend", handleTouchEnd);
    sliderViewport.addEventListener("touchcancel", handleTouchEnd);

    window.addEventListener("resize", updateSlider);
    updateSlider();
  }
}
