const menuIcon = document.getElementById("menu-icon");
const mobileMenu = document.getElementById("mobile-menu");
menuIcon.addEventListener("click", function handleClickEvent(event) {
  event.stopPropagation();
  mobileMenu.classList.toggle("open");
});

function navigateTo(url) {
  location.href = url;
}
function closePopup() {
  navigateTo(location.href.replace("#login", "#").replace("#signup", "#"));
}

const loginButton = document.getElementById("mobile-menu__login");
loginButton.addEventListener("click", () => navigateTo("#login"));
const mobileSignUp = document.getElementById("mobile-menu__signup");
const headerSignup = document.getElementById("header__signup");
headerSignup.addEventListener("click", () => navigateTo("#signup"));
mobileSignUp.addEventListener("click", () => navigateTo("#signup"));

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

window.addEventListener("resize", () => resizeHandler(carouselTimer));

const loginModal = document.getElementById("login-modal");
const signupModal = document.getElementById("signup-modal");
const closeLogin = document.getElementById("close-login");
const closeSignup = document.getElementById("close-signup");

closeLogin.addEventListener("click", closePopup);
closeSignup.addEventListener("click", closePopup);

function router() {
  const currentSection = window.location.href.split("#")[1];
  mobileMenu.classList.toggle(
    "open",
    ["login", "signup"].includes(currentSection)
  );
  const inputGroups = document.querySelectorAll(".input-group");
  inputGroups.forEach((group) => {
    group.classList.remove("invalid-field");
  });
  const inputfields = document.querySelectorAll(".input-field");
  inputfields.forEach((field) => {
    field.value = "";
  });

  loginModal.classList.toggle("d-none", !(currentSection === "login"));
  signupModal.classList.toggle("d-none", !(currentSection === "signup"));
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);

// Form Validation

const loginEmailField = document.getElementById("login-email");
const signupEmailField = document.getElementById("signup-email");
const loginPasswordField = document.getElementById("login-password");
const signupPasswordField = document.getElementById("signup-password");
const confirmPasswordField = document.getElementById("cnf-password");

const emailRegex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
const passwordRegex = new RegExp(
  "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$"
);

function updateErrorContent(parent, id, content) {
  const errorContainer = parent.querySelector(`#${id}-err`);
  if (!errorContainer) return;
  errorContainer.textContent = content;
}

function validateEmail(inputEvent) {
  const inputData = inputEvent.target.value;
  const isInvalid = !emailRegex.test(inputData);
  const parentField = inputEvent.target.closest(".input-group");
  parentField.classList.toggle("invalid-field", isInvalid);
  const action = inputEvent.target.id === "login-email" ? "login" : "signup";
  if (isInvalid) {
    const errorContent =
      inputData.trim().length > 0
        ? "Invalid email! Please enter valid email address."
        : `Your email is required to ${action}!`;
    updateErrorContent(parentField, inputEvent.target.id, errorContent);
  } else {
    updateErrorContent(parentField, inputEvent.target.id, "");
  }
}

function validatePassword(inputEvent) {
  const inputData = inputEvent.target.value;
  const isInvalid = !passwordRegex.test(inputData);
  const parentField = inputEvent.target.closest(".input-group");
  parentField.classList.toggle("invalid-field", isInvalid);
  const action = inputEvent.target.id === "login-email" ? "login" : "signup";
  if (isInvalid) {
    updateErrorContent(
      parentField,
      inputEvent.target.id,
      inputData.trim().length > 0
        ? "Insecure Password!"
        : `Password is required to ${action}!`
    );
  } else {
    updateErrorContent(parentField, inputEvent.target.id, "");
  }
}

function comparePassword() {
  const isNotMatching =
    signupPasswordField.value !== confirmPasswordField.value;
  const parentField = confirmPasswordField.closest(".input-group");
  parentField.classList.toggle("invalid-field", isNotMatching);
  if (isNotMatching) {
    updateErrorContent(
      parentField,
      confirmPasswordField.id,
      `"Confirm password should be same as password."`
    );
  }
}

loginEmailField.addEventListener("blur", validateEmail);
signupEmailField.addEventListener("blur", validateEmail);
loginPasswordField.addEventListener("blur", validatePassword);
signupPasswordField.addEventListener("blur", validatePassword);
confirmPasswordField.addEventListener("blur", comparePassword);
