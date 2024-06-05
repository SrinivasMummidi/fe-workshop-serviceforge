const menuIcon = document.getElementById("menu-icon");
menuIcon.addEventListener("click", function handleClickEvent(event) {
  event.stopPropagation();
  const mobileMenu = document.getElementById("mobile-menu");
  mobileMenu.classList.toggle("open");
});
