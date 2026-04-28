const categorySection = document.querySelector(".category-section");

if (categorySection) {
  const sliderElement = categorySection.querySelector(".category-slider-viewport");
  const prevBtn = categorySection.querySelector(".category-prev");
  const nextBtn = categorySection.querySelector(".category-next");
  const desktopMediaQuery = window.matchMedia("(min-width: 769px)");

  if (sliderElement && typeof Swiper !== "undefined") {
    let categorySwiper = null;
    let isDesktopView = desktopMediaQuery.matches;

    const createCategorySwiper = () =>
      new Swiper(sliderElement, {
        speed: 450,
        loop: false,
        slidesPerGroup: 1,
        watchOverflow: true,
        observer: true,
        observeParents: true,
        spaceBetween: 32,
        slidesPerView: 6,
        navigation: {
          prevEl: prevBtn,
          nextEl: nextBtn,
        },
        breakpoints: {
          0: {
            slidesPerView: 2,
            spaceBetween: 16,
            grid: {
              rows: 3,
              fill: "row",
            },
          },
          769: {
            slidesPerView: 6,
            spaceBetween: 32,
            grid: {
              rows: 1,
              fill: "row",
            },
          },
        },
      });

    const refreshCategorySwiper = () => {
      const nextIsDesktopView = desktopMediaQuery.matches;

      if (!categorySwiper) {
        categorySwiper = createCategorySwiper();
        isDesktopView = nextIsDesktopView;
        return;
      }

      if (isDesktopView !== nextIsDesktopView) {
        categorySwiper.destroy(true, true);
        categorySwiper = createCategorySwiper();
        isDesktopView = nextIsDesktopView;
        return;
      }

      categorySwiper.updateSize();
      categorySwiper.updateSlides();
      categorySwiper.updateProgress();
      categorySwiper.updateSlidesClasses();
      categorySwiper.update();
    };

    refreshCategorySwiper();

    if (typeof desktopMediaQuery.addEventListener === "function") {
      desktopMediaQuery.addEventListener("change", refreshCategorySwiper);
    } else if (typeof desktopMediaQuery.addListener === "function") {
      desktopMediaQuery.addListener(refreshCategorySwiper);
    }

    window.addEventListener("resize", refreshCategorySwiper);
  }
}
