const productCategorySection = document.querySelector(".product-category-section");

if (productCategorySection) {
  const tabs = Array.from(productCategorySection.querySelectorAll(".product-category-tab"));
  const cards = Array.from(productCategorySection.querySelectorAll(".product-category-card"));

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
}
