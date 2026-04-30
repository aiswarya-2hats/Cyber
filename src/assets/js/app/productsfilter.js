// const productCategorySection = document.querySelector(".product-category-section");
// const WISHLIST_STORAGE_KEY = "wishlistProducts";
// let wishlistToastTimer = null;

// if (productCategorySection) {
//   const tabs = Array.from(productCategorySection.querySelectorAll(".product-category-tab"));
//   const cards = Array.from(productCategorySection.querySelectorAll(".product-category-card"));
//   const wishlistToast = createWishlistToast();

//   let wishlistItems = getWishlistItems();

//   const activateTab = (selectedTab) => {
//     tabs.forEach((tab) => {
//       const isActive = tab === selectedTab;
//       tab.classList.toggle("active", isActive);
//       tab.setAttribute("aria-selected", String(isActive));
//     });
//   };

//   const filterCards = (category) => {
//     if (category === "new-arrival") {
//       cards.forEach((card) => {
//         card.hidden = false;
//       });
//       return;
//     }

//     cards.forEach((card) => {
//       const cardCategory = card.dataset.category;
//       const shouldShow = category === "all" || cardCategory === category;
//       card.hidden = !shouldShow;
//     });
//   };

//   const updateWishlistButton = (button, isWishlisted) => {
//     const icon = button.querySelector(".icon");

//     button.classList.toggle("active", isWishlisted);
//     button.setAttribute("aria-label", isWishlisted ? "Product is Removed from Wishlist" : "Product is Add to Wishlist");

//     if (icon) {
//       icon.classList.toggle("icon-Like3", isWishlisted);
//       icon.classList.toggle("icon-Vector15", !isWishlisted);
//     }
//   };

//   tabs.forEach((tab) => {
//     tab.addEventListener("click", () => {
//       const selectedCategory = tab.dataset.filter || "all";
//       activateTab(tab);
//       filterCards(selectedCategory);
//     });
//   });

//   const initialTab = tabs.find((tab) => tab.classList.contains("active")) || tabs[0];
//   if (initialTab) {
//     const initialCategory = initialTab.dataset.filter || "all";
//     activateTab(initialTab);
//     filterCards(initialCategory);
//   }

//   cards.forEach((card) => {
//     const wishlistButton = card.querySelector(".product-category-fav-btn");
//     if (!wishlistButton) return;

//     const product = getProductData(card);
//     const isWishlisted = wishlistItems.some((item) => item.id === product.id);
//     updateWishlistButton(wishlistButton, isWishlisted);

//     wishlistButton.addEventListener("click", () => {
//       const alreadyWishlisted = wishlistItems.some((item) => item.id === product.id);

//       if (alreadyWishlisted) {
//         wishlistItems = wishlistItems.filter((item) => item.id !== product.id);
//         updateWishlistButton(wishlistButton, false);
//         showWishlistToast(wishlistToast, "Product is Removed from Wishlist");
//       } else {
//         wishlistItems = [...wishlistItems, product];
//         updateWishlistButton(wishlistButton, true);
//         showWishlistToast(wishlistToast, "Product is Added to Wishlist");
//       }

//       saveWishlistItems(wishlistItems);
//     });
//   });
// }

// function normalizeText(value) {
//   return value.replace(/\s+/g, " ").trim();
// }

// function getProductData(card) {
//   const title = normalizeText(card.querySelector(".product-category-title")?.textContent || "Product");
//   const price = normalizeText(card.querySelector(".product-category-price")?.textContent || "");
//   const image = card.querySelector(".product-category-image")?.getAttribute("src") || "";
//   const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

//   return { id, title, price, image };
// }

// function getWishlistItems() {
//   try {
//     const stored = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY) || "[]");
//     return Array.isArray(stored) ? stored : [];
//   } catch (error) {
//     return [];
//   }
// }

// function saveWishlistItems(items) {
//   localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
// }

// function createWishlistToast() {
//   const existingToast = document.querySelector(".wishlist-toast");
//   if (existingToast) return existingToast;

//   const toast = document.createElement("div");
//   toast.className = "wishlist-toast";
//   toast.setAttribute("role", "status");
//   toast.setAttribute("aria-live", "polite");
//   document.body.appendChild(toast);
//   return toast;
// }

// function showWishlistToast(toastElement, message) {
//   if (!toastElement) return;

//   toastElement.textContent = message;
//   toastElement.classList.add("show");

//   if (wishlistToastTimer) {
//     clearTimeout(wishlistToastTimer);
//   }

//   wishlistToastTimer = setTimeout(() => {
//     toastElement.classList.remove("show");
//   }, 2200);
// }



document.addEventListener("DOMContentLoaded", () => {
  const productCategorySection = document.querySelector(".product-category-section");
  const WISHLIST_STORAGE_KEY = "wishlistProducts";
  const PRODUCTS_EXPANDED_STATE_KEY = "productsExpandedState";
  let wishlistToastTimer = null;

  if (!productCategorySection) return;

  const tabs = Array.from(
    productCategorySection.querySelectorAll(".product-category-tab")
  );
  const cards = Array.from(
    productCategorySection.querySelectorAll(".product-category-card")
  );
  const viewMoreButton = productCategorySection.querySelector(
    ".product-category-view-more-btn .primary-btn"
  );
  const wishlistToast = createWishlistToast();
  const BASE_VISIBLE_COUNT = 4;
  const NEW_ARRIVAL_BASE_VISIBLE_COUNT = 8;
  const EXPANDED_VISIBLE_COUNT = 8;
  const NEW_ARRIVAL_EXPANDED_VISIBLE_COUNT = 12;
  const categories = ["new-arrival", "bestseller", "featured-products"];

  let wishlistItems = getWishlistItems();
  let activeCategory = "new-arrival";
  const expandedByCategory = {
    "new-arrival": false,
    bestseller: false,
    "featured-products": false,
  };

  const savedExpandedState = getExpandedState();
  categories.forEach((category) => {
    if (typeof savedExpandedState[category] === "boolean") {
      expandedByCategory[category] = savedExpandedState[category];
    }
  });

  // ✅ TAB ACTIVE STATE
  const activateTab = (selectedTab) => {
    tabs.forEach((tab) => {
      const isActive = tab === selectedTab;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });
  };

  const getExpandedVisibleCountForCategory = (category) =>
    category === "new-arrival"
      ? NEW_ARRIVAL_EXPANDED_VISIBLE_COUNT
      : EXPANDED_VISIBLE_COUNT;

  const ensureMinimumCardsPerCategory = () => {
    categories.forEach((category) => {
      const categoryCards = cards.filter(
        (card) => card.getAttribute("data-category") === category
      );

      if (!categoryCards.length) return;

      const targetCount = getExpandedVisibleCountForCategory(category);
      const clonesNeeded = targetCount - categoryCards.length;
      for (let index = 0; index < clonesNeeded; index += 1) {
        const sourceCard = categoryCards[index % categoryCards.length];
        const clonedCard = sourceCard.cloneNode(true);
        clonedCard.setAttribute("data-cloned-card", "true");
        productCategorySection
          .querySelector(".product-category-grid")
          .appendChild(clonedCard);
        cards.push(clonedCard);
      }
    });
  };

  const getCardsByCategory = (category) =>
    cards.filter((card) => card.getAttribute("data-category") === category);

  const isMobileView = () => window.matchMedia("(max-width: 768px)").matches;

  const getVisibleCountForCategory = (category) =>
    expandedByCategory[category]
      ? getExpandedVisibleCountForCategory(category)
      : isMobileView()
      ? BASE_VISIBLE_COUNT
      : category === "new-arrival"
      ? NEW_ARRIVAL_BASE_VISIBLE_COUNT
      : BASE_VISIBLE_COUNT;

  // ✅ FILTER LOGIC
  const filterCards = (category) => {
    const cardsForCategory = getCardsByCategory(category);
    const visibleCount = getVisibleCountForCategory(category);

    cards.forEach((card) => {
      card.style.display = "none";
    });

    cardsForCategory.forEach((card, index) => {
      card.style.display = index < visibleCount ? "block" : "none";
    });
  };

  const updateViewMoreButtonLabel = () => {
    if (!viewMoreButton) return;
    viewMoreButton.textContent = expandedByCategory[activeCategory]
      ? "View Less"
      : "View More";
  };

  ensureMinimumCardsPerCategory();

  // ✅ TAB CLICK
  tabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      const selectedCategory = tab.getAttribute("data-filter");
      if (!selectedCategory) return;
      activeCategory = selectedCategory;
      activateTab(tab);
      filterCards(selectedCategory);
      updateViewMoreButtonLabel();
    });
  });

  // ✅ INITIAL LOAD
  const initialTab =
    tabs.find((tab) => tab.classList.contains("active")) || tabs[0];

  if (initialTab) {
    const initialCategory = initialTab.getAttribute("data-filter");
    activeCategory = initialCategory || "new-arrival";
    activateTab(initialTab);
    filterCards(activeCategory);
    updateViewMoreButtonLabel();
  }

  if (viewMoreButton) {
    viewMoreButton.addEventListener("click", (event) => {
      event.preventDefault();

      if (viewMoreButton.dataset.loading === "true") return;
      viewMoreButton.dataset.loading = "true";

      viewMoreButton.textContent = "Loading...";

      window.setTimeout(() => {
        expandedByCategory[activeCategory] = !expandedByCategory[activeCategory];
        saveExpandedState(expandedByCategory);
        filterCards(activeCategory);
        updateViewMoreButtonLabel();
        viewMoreButton.dataset.loading = "false";
      }, 450);
    });
  }

  window.addEventListener("resize", () => {
    filterCards(activeCategory);
    updateViewMoreButtonLabel();
  });

  // ✅ WISHLIST BUTTON UI UPDATE
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
    const existingTitle = card.querySelector(".product-category-title");
    if (existingTitle) return;

    const placeholderTitle = document.createElement("p");
    placeholderTitle.className = "product-category-title";

    const priceElement = card.querySelector(".product-category-price");
    if (priceElement) {
      card.insertBefore(placeholderTitle, priceElement);
      return;
    }

    card.appendChild(placeholderTitle);
  };

  cards.forEach((card) => {
    ensureCardTitlePlaceholder(card);
  });

  // ✅ WISHLIST LOGIC
  cards.forEach((card) => {
    const wishlistButton = card.querySelector(".product-category-fav-btn");
    const buyNowLink = card.querySelector(".secondary-btn");

    // Make full card clickable while preserving existing controls.
    if (buyNowLink) {
      card.style.cursor = "pointer";

      card.addEventListener("click", (event) => {
        const clickedInteractiveElement = event.target.closest("a, button, input, select, textarea");
        if (clickedInteractiveElement) return;

        buyNowLink.click();
      });
    }

    if (!wishlistButton) return;

    const product = getProductData(card);
    const isWishlisted = wishlistItems.some(
      (item) => item.id === product.id
    );

    updateWishlistButton(wishlistButton, isWishlisted);

    wishlistButton.addEventListener("click", (event) => {
      event.preventDefault();
      const alreadyWishlisted = wishlistItems.some(
        (item) => item.id === product.id
      );

      if (alreadyWishlisted) {
        wishlistItems = wishlistItems.filter(
          (item) => item.id !== product.id
        );
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

  // 🔹 HELPERS

  function normalizeText(value) {
    return value.replace(/\s+/g, " ").trim();
  }

  function getProductData(card) {
    const title = normalizeText(
      card.querySelector(".product-category-title")?.textContent || "Product"
    );
    const price = normalizeText(
      card.querySelector(".product-category-price")?.textContent || ""
    );
    const image =
      card.querySelector(".product-category-image")?.getAttribute("src") || "";

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

  function getExpandedState() {
    try {
      const stored = JSON.parse(
        sessionStorage.getItem(PRODUCTS_EXPANDED_STATE_KEY) || "{}"
      );
      return stored && typeof stored === "object" ? stored : {};
    } catch {
      return {};
    }
  }

  function saveExpandedState(state) {
    sessionStorage.setItem(PRODUCTS_EXPANDED_STATE_KEY, JSON.stringify(state));
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