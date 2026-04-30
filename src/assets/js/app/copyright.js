document.addEventListener("DOMContentLoaded", () => {
  const copyrightYear = document.getElementById("copyright-year");
  if (!copyrightYear) return;

  copyrightYear.textContent = String(new Date().getFullYear());
});
