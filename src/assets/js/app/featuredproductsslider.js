const featuredProductsMobile = document.querySelector(".featured-products__mobile");

if (featuredProductsMobile) {
  const slidesContainer = featuredProductsMobile.querySelector(
    ".featured-products__slides"
  );
  const slidesTrack = featuredProductsMobile.querySelector(
    ".featured-products__track"
  );
  const slides = Array.from(
    featuredProductsMobile.querySelectorAll(".featured-products__slide")
  );
  const dots = Array.from(
    featuredProductsMobile.querySelectorAll(".featured-products__dot")
  );

  if (slides.length && dots.length) {
    let activeIndex = 0;
    let startX = 0;
    let currentDeltaX = 0;
    let isDragging = false;

    const updateStableHeight = () => {
      if (!slidesContainer) return;
      const maxHeight = slides.reduce(
        (height, slide) => Math.max(height, slide.offsetHeight),
        0
      );
      slidesContainer.style.height = `${maxHeight}px`;
    };

    const setActiveSlide = (index) => {
      activeIndex = index;
      if (slidesTrack) {
        slidesTrack.style.transform = `translateX(-${index * 100}%)`;
      }

      slides.forEach((slide, slideIndex) => {
        slide.setAttribute("aria-hidden", String(slideIndex !== index));
      });

      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === index;
        dot.classList.toggle("featured-products__dot--active", isActive);
        dot.setAttribute("aria-selected", String(isActive));
      });
    };

    const clampSlideIndex = (index) =>
      Math.max(0, Math.min(index, slides.length - 1));

    const handleDragStart = (event) => {
      if (!slidesTrack || !slidesContainer) return;
      isDragging = true;
      startX = event.touches[0].clientX;
      currentDeltaX = 0;
      slidesTrack.style.transition = "none";
    };

    const handleDragMove = (event) => {
      if (!isDragging || !slidesTrack || !slidesContainer) return;
      const touchX = event.touches[0].clientX;
      currentDeltaX = touchX - startX;
      const containerWidth = slidesContainer.offsetWidth || 1;
      const currentTranslate = -activeIndex * containerWidth + currentDeltaX;
      slidesTrack.style.transform = `translateX(${currentTranslate}px)`;
    };

    const handleDragEnd = () => {
      if (!isDragging || !slidesTrack || !slidesContainer) return;
      isDragging = false;
      slidesTrack.style.transition = "transform 0.45s ease";

      const threshold = (slidesContainer.offsetWidth || 1) * 0.15;
      if (Math.abs(currentDeltaX) > threshold) {
        const direction = currentDeltaX > 0 ? -1 : 1;
        setActiveSlide(clampSlideIndex(activeIndex + direction));
      } else {
        setActiveSlide(activeIndex);
      }
    };

    dots.forEach((dot, dotIndex) => {
      dot.addEventListener("click", () => {
        setActiveSlide(dotIndex);
      });
    });

    slidesContainer?.addEventListener("touchstart", handleDragStart, {
      passive: true,
    });
    slidesContainer?.addEventListener("touchmove", handleDragMove, {
      passive: true,
    });
    slidesContainer?.addEventListener("touchend", handleDragEnd);
    slidesContainer?.addEventListener("touchcancel", handleDragEnd);

    window.addEventListener("resize", updateStableHeight);
    slides.forEach((slide) => {
      const image = slide.querySelector("img");
      if (image) {
        image.addEventListener("load", updateStableHeight);
      }
    });

    updateStableHeight();
    setActiveSlide(activeIndex);
  }
}
