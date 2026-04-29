const featuredProductsSection = document.querySelector(".featured-products");

if (featuredProductsSection) {
  const slidesTrack = featuredProductsSection.querySelector(".featured-products__track");
  const slidesViewport = featuredProductsSection.querySelector(".featured-products__grid");
  const slides = Array.from(
    featuredProductsSection.querySelectorAll(".featured-products__item")
  );
  const dots = Array.from(
    featuredProductsSection.querySelectorAll(".featured-products__dot")
  );
  const mobileMediaQuery = window.matchMedia("(max-width: 1046px)");

  if (slidesTrack && slidesViewport && slides.length && dots.length) {
    let activeIndex = 0;
    let startX = 0;
    let currentDeltaX = 0;
    let isDragging = false;

    const clampSlideIndex = (index) =>
      Math.max(0, Math.min(index, slides.length - 1));

    const isMobileSlider = () => mobileMediaQuery.matches;

    const updateStableHeight = () => {
      if (!isMobileSlider()) {
        slidesViewport.style.height = "";
        return;
      }

      const maxHeight = slides.reduce(
        (height, slide) => Math.max(height, slide.offsetHeight),
        0
      );
      slidesViewport.style.height = `${maxHeight}px`;
    };

    const setActiveSlide = (index) => {
      activeIndex = clampSlideIndex(index);

      if (isMobileSlider()) {
        slidesTrack.style.transform = `translateX(-${activeIndex * 100}%)`;
      } else {
        slidesTrack.style.transform = "";
      }

      slides.forEach((slide, slideIndex) => {
        slide.setAttribute("aria-hidden", String(slideIndex !== activeIndex));
      });

      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeIndex;
        dot.classList.toggle("featured-products__dot--active", isActive);
        dot.setAttribute("aria-selected", String(isActive));
      });
    };

    const handleDragStart = (event) => {
      if (!isMobileSlider()) return;
      isDragging = true;
      startX = event.touches[0].clientX;
      currentDeltaX = 0;
      slidesTrack.style.transition = "none";
    };

    const handleDragMove = (event) => {
      if (!isDragging || !isMobileSlider()) return;
      const touchX = event.touches[0].clientX;
      currentDeltaX = touchX - startX;
      const containerWidth = slidesViewport.offsetWidth || 1;
      const currentTranslate = -activeIndex * containerWidth + currentDeltaX;
      slidesTrack.style.transform = `translateX(${currentTranslate}px)`;
    };

    const handleDragEnd = () => {
      if (!isDragging || !isMobileSlider()) return;
      isDragging = false;
      slidesTrack.style.transition = "transform 0.45s ease";

      const threshold = (slidesViewport.offsetWidth || 1) * 0.15;
      if (Math.abs(currentDeltaX) > threshold) {
        const direction = currentDeltaX > 0 ? -1 : 1;
        setActiveSlide(activeIndex + direction);
      } else {
        setActiveSlide(activeIndex);
      }
    };

    const syncOnViewportChange = () => {
      slidesTrack.style.transition = "transform 0.45s ease";
      updateStableHeight();
      setActiveSlide(activeIndex);
    };

    dots.forEach((dot, dotIndex) => {
      dot.addEventListener("click", () => {
        setActiveSlide(dotIndex);
      });
    });

    slidesViewport.addEventListener("touchstart", handleDragStart, {
      passive: true,
    });
    slidesViewport.addEventListener("touchmove", handleDragMove, {
      passive: true,
    });
    slidesViewport.addEventListener("touchend", handleDragEnd);
    slidesViewport.addEventListener("touchcancel", handleDragEnd);

    window.addEventListener("resize", syncOnViewportChange);
    if (typeof mobileMediaQuery.addEventListener === "function") {
      mobileMediaQuery.addEventListener("change", syncOnViewportChange);
    }

    slides.forEach((slide) => {
      const image = slide.querySelector("img");
      if (image) {
        image.addEventListener("load", updateStableHeight);
      }
    });

    syncOnViewportChange();
  }
}
