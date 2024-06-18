const menuIcon = document.getElementById("menu-icon");
menuIcon.addEventListener("click", function handleClickEvent(event) {
  event.stopPropagation();
  const mobileMenu = document.getElementById("mobile-menu");
  mobileMenu.classList.toggle("open");
});

function debounce(func, timeout = 50) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

const carousel = document.getElementById("carousel");
const carouselItems = Array.from(document.querySelectorAll(".carousel-item"));
let carouselTimer = null;
const intersectionObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      startTimer();
    } else {
      stopTimer();
    }
  },
  { threshold: 0.2 }
);

function getActiveIndex() {
  return Math.floor(carousel.scrollLeft / carouselItems[0].clientWidth);
}

function updateCarousel() {
  const activeIndex = getActiveIndex();
  let scrollDistance = carousel.clientWidth * 1;
  carouselItems.forEach((item) => item.classList.remove("active"));
  if (activeIndex + 1 >= carouselItems.length) {
    scrollDistance = carousel.clientWidth * -carouselItems.length;
    carouselItems[carouselItems.length - 1].classList.remove("active");
    carouselItems[0].classList.add("active");
  } else {
    carouselItems[activeIndex].classList.remove("active");
    carouselItems[activeIndex + 1].classList.add("active");
  }
  carousel.scrollBy({ left: scrollDistance, behavior: "smooth" });
}

const updateActiveIndex = debounce(() => {
  const activeIndex = getActiveIndex();
  const activeItem = carouselItems[activeIndex];
  if (activeItem.classList.contains("active")) return;
  carouselItems.forEach((item) => item.classList.remove("active"));
  activeItem.classList.add("active");
});

function startTimer() {
  carouselTimer = setInterval(updateCarousel, 3000);
}

function stopTimer() {
  clearInterval(carouselTimer);
}

function initCarousel() {
  intersectionObserver.observe(carousel);
  carousel.addEventListener("touchstart", stopTimer);
  carousel.addEventListener("touchend", startTimer);
  carousel.addEventListener("scroll", updateActiveIndex);
}

function destroyCarousel() {
  stopTimer();
  intersectionObserver.unobserve(carousel);
  carousel.removeEventListener("touchstart", stopTimer);
  carousel.removeEventListener("touchend", startTimer);
  carousel.removeEventListener("scroll", updateActiveIndex);
  carouselItems.forEach((item) => item.classList.remove("active"));
}

function resizeHandler(carouselTimer) {
  if (window.innerWidth <= 540) {
    if (!carouselTimer) {
      initCarousel();
    }
  } else {
    if (carouselTimer) {
      destroyCarousel();
    }
  }
}

window.addEventListener("resize", resizeHandler(carouselTimer));
