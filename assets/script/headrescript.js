document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const marquee = document.getElementById("marquee");

  if (menuBtn && mobileMenu && marquee) {
    menuBtn.addEventListener("click", () => {
      const isMenuVisible = mobileMenu.classList.toggle("show");
      marquee.style.visibility = isMenuVisible ? "hidden" : "visible";
    });
  }
});
