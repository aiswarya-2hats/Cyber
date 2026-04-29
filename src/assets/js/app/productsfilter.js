const productCategorySection = document.querySelector(".product-category-section");
const WISHLIST_STORAGE_KEY = "wishlistProducts";
let wishlistToastTimer = null;

if (productCategorySection) {
  const tabs = Array.from(productCategorySection.querySelectorAll(".product-category-tab"));
  const cards = Array.from(productCategorySection.querySelectorAll(".product-category-card"));
  const wishlistToast = createWishlistToast();

  let wishlistItems = getWishlistItems();

  const activateTab = (selectedTab) => {
    tabs.forEach((tab) => {
      const isActive = tab === selectedTab;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });
  };

  const filterCards = (category) => {
    if (category === "new-arrival") {
      cards.forEach((card) => {
        card.hidden = false;
      });
      return;
    }

    cards.forEach((card) => {
      const cardCategory = card.dataset.category;
      const shouldShow = category === "all" || cardCategory === category;
      card.hidden = !shouldShow;
    });
  };

  const updateWishlistButton = (button, isWishlisted) => {
    const icon = button.querySelector(".icon");

    button.classList.toggle("active", isWishlisted);
    button.setAttribute("aria-label", isWishlisted ? "Product is Removed from Wishlist" : "Product is Add to Wishlist");

    if (icon) {
      icon.classList.toggle("icon-Like3", isWishlisted);
      icon.classList.toggle("icon-Vector15", !isWishlisted);
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const selectedCategory = tab.dataset.filter || "all";
      activateTab(tab);
      filterCards(selectedCategory);
    });
  });

  const initialTab = tabs.find((tab) => tab.classList.contains("active")) || tabs[0];
  if (initialTab) {
    const initialCategory = initialTab.dataset.filter || "all";
    activateTab(initialTab);
    filterCards(initialCategory);
  }

  cards.forEach((card) => {
    const wishlistButton = card.querySelector(".product-category-fav-btn");
    if (!wishlistButton) return;

    const product = getProductData(card);
    const isWishlisted = wishlistItems.some((item) => item.id === product.id);
    updateWishlistButton(wishlistButton, isWishlisted);

    wishlistButton.addEventListener("click", () => {
      const alreadyWishlisted = wishlistItems.some((item) => item.id === product.id);

      if (alreadyWishlisted) {
        wishlistItems = wishlistItems.filter((item) => item.id !== product.id);
        updateWishlistButton(wishlistButton, false);
        showWishlistToast(wishlistToast, "Product is Removed from Wishlist");
      } else {
        wishlistItems = [...wishlistItems, product];
        updateWishlistButton(wishlistButton, true);
        showWishlistToast(wishlistToast, "Product is Added to Wishlist");
      }

      saveWishlistItems(wishlistItems);
    });
  });
}

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function getProductData(card) {
  const title = normalizeText(card.querySelector(".product-category-title")?.textContent || "Product");
  const price = normalizeText(card.querySelector(".product-category-price")?.textContent || "");
  const image = card.querySelector(".product-category-image")?.getAttribute("src") || "";
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return { id, title, price, image };
}

function getWishlistItems() {
  try {
    const stored = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
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
