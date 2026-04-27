const categorySection = document.querySelector(".category-section");

if (categorySection) {
  const sliderElement = categorySection.querySelector(".category-slider-viewport");
  const prevBtn = categorySection.querySelector(".category-prev");
  const nextBtn = categorySection.querySelector(".category-next");

  if (sliderElement && typeof Swiper !== "undefined") {
    // Swiper-driven category slider with mobile 2x3 grid.
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
  }
}
