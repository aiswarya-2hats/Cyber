const categorySection = document.querySelector(".category-section");

if (categorySection) {
  const sliderViewport = categorySection.querySelector(".category-slider-viewport");
  const sliderTrack = categorySection.querySelector(".category-track");
  const pages = Array.from(categorySection.querySelectorAll(".category-grid"));
  const prevBtn = categorySection.querySelector(".category-prev");
  const nextBtn = categorySection.querySelector(".category-next");

  if (sliderViewport && sliderTrack && pages.length) {
    let activeStep = 0;
    const SLIDE_TRANSITION = "transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)";

    let touchStartX = 0;
    let touchDeltaX = 0;
    let isDragging = false;

    const getColumnsPerPage = () => {
      if (window.innerWidth <= 576) return 2;
      if (window.innerWidth <= 992) return 3;
      return 6;
    };

    const getCardGap = () => {
      const firstPage = pages[0];
      if (!firstPage) return 16;
      const computed = window.getComputedStyle(firstPage);
      return parseFloat(computed.columnGap || computed.gap || "16") || 16;
    };

    const getMaxStep = () => {
      const columnsPerPage = getColumnsPerPage();
      const totalColumns = pages.length * columnsPerPage;
      return Math.max(0, totalColumns - columnsPerPage);
    };

    const updateSlider = () => {
      const viewportWidth = sliderViewport.clientWidth;
      const columnsPerPage = getColumnsPerPage();
      const gap = getCardGap();
      const cardWidth = (viewportWidth - gap * (columnsPerPage - 1)) / columnsPerPage;
      const translateX = activeStep * (cardWidth + gap);
      sliderTrack.style.transform = `translateX(-${translateX}px)`;

      const maxStep = getMaxStep();
      if (activeStep > maxStep) {
        activeStep = maxStep;
      }

      if (prevBtn) prevBtn.disabled = activeStep === 0;
      if (nextBtn) nextBtn.disabled = activeStep >= maxStep;
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
      const columnsPerPage = getColumnsPerPage();
      const gap = getCardGap();
      const cardWidth = (viewportWidth - gap * (columnsPerPage - 1)) / columnsPerPage;
      const baseTranslate = activeStep * (cardWidth + gap);
      sliderTrack.style.transform = `translateX(${-(baseTranslate - touchDeltaX)}px)`;
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      sliderTrack.style.transition = SLIDE_TRANSITION;

      const threshold = (sliderViewport.clientWidth || 1) * 0.15;
      if (Math.abs(touchDeltaX) > threshold) {
        if (touchDeltaX < 0) {
          activeStep = Math.min(getMaxStep(), activeStep + 1);
        } else {
          activeStep = Math.max(0, activeStep - 1);
        }
      }

      updateSlider();
    };

    prevBtn?.addEventListener("click", () => {
      activeStep = Math.max(0, activeStep - 1);
      updateSlider();
    });

    nextBtn?.addEventListener("click", () => {
      activeStep = Math.min(getMaxStep(), activeStep + 1);
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

    sliderTrack.style.transition = SLIDE_TRANSITION;

    window.addEventListener("resize", updateSlider);
    updateSlider();
  }
}
