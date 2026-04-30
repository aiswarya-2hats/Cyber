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
  let wishlistToastTimer = null;

  if (!productCategorySection) return;

  const tabs = Array.from(
    productCategorySection.querySelectorAll(".product-category-tab")
  );
  const cards = Array.from(
    productCategorySection.querySelectorAll(".product-category-card")
  );
  const wishlistToast = createWishlistToast();

  let wishlistItems = getWishlistItems();

  // ✅ TAB ACTIVE STATE
  const activateTab = (selectedTab) => {
    tabs.forEach((tab) => {
      const isActive = tab === selectedTab;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });
  };

  const isMobileView = () => window.matchMedia("(max-width: 768px)").matches;

  // ✅ FILTER LOGIC
  const filterCards = (category) => {
    const mobileView = isMobileView();

    cards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category");

      if (category === "new-arrival") {
        card.style.display = "block";
        return;
      }

      if (cardCategory === category) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });

    // Show only first 4 cards for New Arrival on mobile.
    if (category === "new-arrival" && mobileView) {
      cards.forEach((card, index) => {
        card.style.display = index < 4 ? "block" : "none";
      });
    }
  };

  // ✅ TAB CLICK
  tabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      const selectedCategory = tab.getAttribute("data-filter");
      activateTab(tab);
      filterCards(selectedCategory);
    });
  });

  // ✅ INITIAL LOAD
  const initialTab =
    tabs.find((tab) => tab.classList.contains("active")) || tabs[0];

  if (initialTab) {
    const initialCategory = initialTab.getAttribute("data-filter");
    activateTab(initialTab);
    filterCards(initialCategory);
  }

  window.addEventListener("resize", () => {
    const activeTab = tabs.find((tab) => tab.classList.contains("active"));
    if (!activeTab) return;
    filterCards(activeTab.getAttribute("data-filter"));
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