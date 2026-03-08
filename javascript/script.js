// --- State Management ---
let totalPrice = localStorage.getItem('totalPrice') ? parseFloat(localStorage.getItem('totalPrice')) : 0;
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// --- Toast Notifications ---
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) {
    const newContainer = document.createElement('div');
    newContainer.id = 'toast-container';
    document.body.appendChild(newContainer);
    return showToast(message, type);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// --- Cart Logic ---
function a(price, button) {
  totalPrice += price;
  localStorage.setItem('totalPrice', totalPrice);

  // Visual feedback
  const originalText = button.innerText;
  button.innerText = "Added!";
  button.style.backgroundColor = '#1B5E20';

  showToast(`Item added to cart! Total: $${totalPrice}`);

  setTimeout(() => {
    button.innerText = originalText;
    button.style.backgroundColor = '';
  }, 1000);
}

function totalalert() {
  // Deprecated: replaced by cart page logic, but kept for legacy button support
  window.location.href = "cart.html";
}

function cart() {
  window.location.href = "cart.html";
}

function buy() {
  showToast("Thank you for your purchase!", "success");
  localStorage.removeItem('totalPrice');
  setTimeout(() => {
    location.reload();
  }, 2000);
}

function feedback() {
  showToast("Thanks for your feedback!", "success");
}

// --- Wishlist Logic ---
function toggleWishlist(productName, button) {
  const index = wishlist.indexOf(productName);
  if (index === -1) {
    wishlist.push(productName);
    button.classList.add('active');
    button.innerHTML = '<i class="fas fa-heart"></i>';
    showToast(`${productName} added to wishlist!`);
  } else {
    wishlist.splice(index, 1);
    button.classList.remove('active');
    button.innerHTML = '<i class="far fa-heart"></i>';
    showToast(`${productName} removed from wishlist.`, "info");
  }
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// --- Search Logic ---
function filterProducts(query) {
  const cards = document.querySelectorAll('.product-card');
  query = query.toLowerCase();

  cards.forEach(card => {
    const title = card.querySelector('h3').innerText.toLowerCase();
    if (title.includes(query)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// --- Dark Mode Logic ---
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);

  const icon = document.querySelector('.theme-toggle i');
  if (icon) {
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', function () {
  // 1. Hamburger Menu
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.navbar-nav');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => nav.classList.toggle('active'));
  }

  // 2. Dark Mode Init
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    const icon = document.querySelector('.theme-toggle i');
    if (icon) icon.className = 'fas fa-sun';
  }

  // 3. Search Listener
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => filterProducts(e.target.value));
  }

  // 4. Back to Top
  const backToTopButton = document.createElement('button');
  backToTopButton.id = 'back-to-top';
  backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTopButton.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(backToTopButton);

  window.onscroll = () => {
    backToTopButton.style.display = (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) ? "flex" : "none";
  };

  // 5. Cookie Banner
  if (!localStorage.getItem('cookiesAccepted')) {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
      <p>We use cookies to improve your experience. By using our site, you agree to our use of cookies.</p>
      <button class="btn" id="accept-cookies">Accept</button>
    `;
    document.body.appendChild(banner);

    // Animate in
    setTimeout(() => banner.classList.add('show'), 1000);

    document.getElementById('accept-cookies').onclick = () => {
      localStorage.setItem('cookiesAccepted', 'true');
      banner.classList.remove('show');
      setTimeout(() => banner.remove(), 500);
    };
  }

  // 6. Initialize Wishlist Buttons (if on product page)
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    // Add Wishlist Button
    if (!card.querySelector('.wishlist-btn')) {
      const productName = card.querySelector('h3').innerText;
      const btn = document.createElement('button');
      btn.className = 'wishlist-btn';
      btn.innerHTML = wishlist.includes(productName) ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
      if (wishlist.includes(productName)) btn.classList.add('active');

      btn.onclick = (e) => {
        e.stopPropagation(); // Prevent triggering card click
        toggleWishlist(productName, btn);
      };
      card.appendChild(btn);
    }
  });
});

// --- Deal of the Day Countdown ---
function startCountdown(durationInSeconds) {
  let timer = durationInSeconds, hours, minutes, seconds;
  const hoursElement = document.getElementById('hours');
  const minutesElement = document.getElementById('minutes');
  const secondsElement = document.getElementById('seconds');

  if (!hoursElement) return;

  setInterval(function () {
    hours = parseInt(timer / 3600, 10);
    minutes = parseInt((timer % 3600) / 60, 10);
    seconds = parseInt(timer % 60, 10);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    hoursElement.textContent = hours;
    minutesElement.textContent = minutes;
    secondsElement.textContent = seconds;

    if (--timer < 0) {
      timer = durationInSeconds;
    }
  }, 1000);
}

startCountdown(24 * 60 * 60);