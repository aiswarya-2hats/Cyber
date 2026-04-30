document.addEventListener("DOMContentLoaded", () => {
  const discountSection = document.querySelector(".discount-products-section");
  const WISHLIST_STORAGE_KEY = "wishlistDiscountProducts";
  let wishlistToastTimer = null;

  if (!discountSection) return;

  const cards = Array.from(
    discountSection.querySelectorAll(".discount-products__card")
  );
  const sliderViewport = discountSection.querySelector(
    ".discount-products-slider-viewport"
  );
  const sliderTrack = discountSection.querySelector(".discount-products__grid");
  const prevBtn = discountSection.querySelector(".discount-products-prev");
  const nextBtn = discountSection.querySelector(".discount-products-next");
  const wishlistToast = createWishlistToast();
  let wishlistItems = getWishlistItems();
  let currentSlideIndex = 0;
  let touchStartX = 0;
  let touchDeltaX = 0;
  let isDragging = false;

  const getCardsPerView = () => {
    if (window.innerWidth < 992) return 2;
    return 4;
  };

  const getMaxSlideIndex = () => Math.max(0, cards.length - getCardsPerView());

  const updateSliderLayout = () => {
    if (!sliderViewport || !sliderTrack || !cards.length) return;

    const cardsPerView = getCardsPerView();
    const gap = 16;
    const viewportWidth = sliderViewport.clientWidth;
    const cardWidth = (viewportWidth - gap * (cardsPerView - 1)) / cardsPerView;

    cards.forEach((card) => {
      card.style.width = `${cardWidth}px`;
    });

    const maxIndex = getMaxSlideIndex();
    if (currentSlideIndex > maxIndex) {
      currentSlideIndex = maxIndex;
    }

    const translateX = currentSlideIndex * (cardWidth + gap);
    sliderTrack.style.transform = `translateX(-${translateX}px)`;

    if (prevBtn) {
      prevBtn.setAttribute("aria-disabled", String(currentSlideIndex === 0));
    }
    if (nextBtn) {
      nextBtn.setAttribute(
        "aria-disabled",
        String(currentSlideIndex >= maxIndex)
      );
    }
  };

  const handleTouchStart = (event) => {
    if (!sliderViewport || !sliderTrack) return;
    isDragging = true;
    touchStartX = event.touches[0].clientX;
    touchDeltaX = 0;
    sliderTrack.style.transition = "none";
  };

  const handleTouchMove = (event) => {
    if (!isDragging || !sliderViewport || !sliderTrack || !cards.length) return;
    const currentX = event.touches[0].clientX;
    touchDeltaX = currentX - touchStartX;
    const cardsPerView = getCardsPerView();
    const gap = 16;
    const viewportWidth = sliderViewport.clientWidth;
    const cardWidth = (viewportWidth - gap * (cardsPerView - 1)) / cardsPerView;
    const baseTranslate = currentSlideIndex * (cardWidth + gap);
    sliderTrack.style.transform = `translateX(${-(baseTranslate - touchDeltaX)}px)`;
  };

  const handleTouchEnd = () => {
    if (!isDragging || !sliderViewport || !sliderTrack) return;
    isDragging = false;
    sliderTrack.style.transition = "transform 0.45s ease";

    const threshold = (sliderViewport.clientWidth || 1) * 0.15;
    if (Math.abs(touchDeltaX) > threshold) {
      if (touchDeltaX < 0) {
        currentSlideIndex = Math.min(getMaxSlideIndex(), currentSlideIndex + 1);
      } else {
        currentSlideIndex = Math.max(0, currentSlideIndex - 1);
      }
    }

    updateSliderLayout();
  };

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", (event) => {
      event.preventDefault();
      if (currentSlideIndex === 0) return;
      currentSlideIndex = Math.max(0, currentSlideIndex - 1);
      updateSliderLayout();
    });

    nextBtn.addEventListener("click", (event) => {
      event.preventDefault();
      if (currentSlideIndex >= getMaxSlideIndex()) return;
      currentSlideIndex = Math.min(getMaxSlideIndex(), currentSlideIndex + 1);
      updateSliderLayout();
    });
  }

  window.addEventListener("resize", updateSliderLayout);

  if (sliderViewport) {
    sliderViewport.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    sliderViewport.addEventListener("touchmove", handleTouchMove, {
      passive: true,
    });
    sliderViewport.addEventListener("touchend", handleTouchEnd);
    sliderViewport.addEventListener("touchcancel", handleTouchEnd);
  }

  const updateWishlistButton = (button, isWishlisted) => {
    const icon = button.querySelector(".icon");

    button.classList.toggle("active", isWishlisted);
    button.setAttribute(
      "aria-label",
      isWishlisted ? "Remove from wishlist" : "Add to wishlist"
    );

    if (icon) {
      icon.classList.toggle("icon-Like3", isWishlisted);
      icon.classList.toggle("icon-Vector15", !isWishlisted);
    }
  };

  const ensureCardTitlePlaceholder = (card) => {
    const existingTitle = card.querySelector(".discount-products__title");
    if (existingTitle) return;

    const placeholderTitle = document.createElement("p");
    placeholderTitle.className = "discount-products__title";

    const priceElement = card.querySelector(".discount-products__price");
    if (priceElement) {
      card.insertBefore(placeholderTitle, priceElement);
      return;
    }

    card.appendChild(placeholderTitle);
  };

  const ensureHiddenTitleKeepsSpace = (card) => {
    const title = card.querySelector(".discount-products__title");
    if (!title) return;

    const computedTitleStyle = window.getComputedStyle(title);
    if (computedTitleStyle.display === "none") {
      title.style.display = "flex";
      title.style.visibility = "hidden";
      title.setAttribute("aria-hidden", "true");
    }
  };

  cards.forEach((card) => {
    ensureCardTitlePlaceholder(card);
    ensureHiddenTitleKeepsSpace(card);
  });

  cards.forEach((card) => {
    const wishlistButton = card.querySelector(".discount-products__fav-btn");
    if (!wishlistButton) return;

    const product = getProductData(card);
    const isWishlisted = wishlistItems.some((item) => item.id === product.id);
    updateWishlistButton(wishlistButton, isWishlisted);

    wishlistButton.addEventListener("click", (event) => {
      event.preventDefault();
      const alreadyWishlisted = wishlistItems.some(
        (item) => item.id === product.id
      );

      if (alreadyWishlisted) {
        wishlistItems = wishlistItems.filter((item) => item.id !== product.id);
        updateWishlistButton(wishlistButton, false);
        showWishlistToast(wishlistToast, "Product removed from wishlist");
      } else {
        wishlistItems = [...wishlistItems, product];
        updateWishlistButton(wishlistButton, true);
        showWishlistToast(wishlistToast, "Product added to wishlist");
      }

      saveWishlistItems(wishlistItems);
    });
  });

  updateSliderLayout();

  function normalizeText(value) {
    return value.replace(/\s+/g, " ").trim();
  }

  function getProductData(card) {
    const title = normalizeText(
      card.querySelector(".discount-products__title")?.textContent || "Product"
    );
    const price = normalizeText(
      card.querySelector(".discount-products__price")?.textContent || ""
    );
    const image =
      card.querySelector(".discount-products__image")?.getAttribute("src") || "";

    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    return { id, title, price, image };
  }

  function getWishlistItems() {
    try {
      const stored = JSON.parse(
        localStorage.getItem(WISHLIST_STORAGE_KEY) || "[]"
      );
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  }

  function saveWishlistItems(items) {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  }

  function createWishlistToast() {
    const existingToast = document.querySelector(".wishlist-toast");
    if (existingToast) return existingToast;

    const toast = document.createElement("div");
    toast.className = "wishlist-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
    return toast;
  }

  function showWishlistToast(toastElement, message) {
    if (!toastElement) return;

    toastElement.textContent = message;
    toastElement.classList.add("show");

    if (wishlistToastTimer) {
      clearTimeout(wishlistToastTimer);
    }

    wishlistToastTimer = setTimeout(() => {
      toastElement.classList.remove("show");
    }, 2200);
  }
});
