// public/js/main.js

const productsPerPage = 24;
let currentPage = 1;
let allProducts = [];
let filteredProducts = [];

// Конверсионный курс: 1 руб. = 0.013 долларов.
const conversionRate = 0.013;

/**
 * Отрисовка товаров с учётом текущего языка.
 */
function renderProducts(products, page = 1) {
  const productGrid = document.querySelector('.product-grid');
  productGrid.innerHTML = '';

  const startIndex = (page - 1) * productsPerPage;
  const productsToShow = products.slice(startIndex, page * productsPerPage);

  const lang = LanguageManager.getCurrentLanguage();

  productsToShow.forEach(product => {
    const productCard = document.createElement('article');
    productCard.classList.add('product-card');
    
    let priceDisplay;
    if (lang === 'en') {
      const rub = parseFloat(product.price);
      const dollars = (rub * conversionRate).toFixed(2);
      priceDisplay = `${LanguageManager.getTranslation('main', 'priceLabel')} $${dollars}`;
    } else {
      priceDisplay = `${LanguageManager.getTranslation('main', 'priceLabel')} ${product.price}`;
    }
    
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <p class="price">${priceDisplay}</p>
      <div class="actions">
        <button class="add-to-cart" data-id="${product.id}">${LanguageManager.getTranslation('main', 'addToCart')}</button>
        <button class="reviews" data-id="${product.id}" data-name="${product.name}">
          ${LanguageManager.getTranslation('main', 'reviews')}
        </button>
      </div>
    `;
    productGrid.appendChild(productCard);
  });
  
  attachProductEventListeners();
}

/**
 * Отрисовка элементов пагинации.
 */
function renderPagination(products) {
  const paginationContainer = document.querySelector('.pagination');
  paginationContainer.innerHTML = '';

  const totalPages = Math.ceil(products.length / productsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('span');
    pageBtn.classList.add('page');
    if (i === currentPage) {
      pageBtn.classList.add('active');
    }
    pageBtn.textContent = i;
    pageBtn.addEventListener('click', () => {
      currentPage = i;
      renderProducts(filteredProducts, currentPage);
      updateActivePagination();
    });
    paginationContainer.appendChild(pageBtn);
  }
}

function updateActivePagination() {
  document.querySelectorAll('.pagination .page').forEach(btn => btn.classList.remove('active'));
  const pages = document.querySelectorAll('.pagination .page');
  if (pages[currentPage - 1]) {
    pages[currentPage - 1].classList.add('active');
  }
}

function attachProductEventListeners() {
  // Обработчик для кнопок "В корзину"
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.dataset.id;
      const product = allProducts.find(p => p.id == productId);
      if (product) {
        addToCart(product);
      }
    });
  });
  
  // Обработчик для кнопок "Отзывы"
  document.querySelectorAll('.reviews').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.dataset.id;
      const productName = this.dataset.name;
      // Функция openReviewsModal определена в reviews.js и доступна как window.openReviewsModal
      if (typeof openReviewsModal === 'function') {
        openReviewsModal(productId, productName);
      } else {
        console.error('openReviewsModal не определена!');
      }
    });
  });
}

/**
 * Добавление товара в корзину (localStorage)
 */
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Проверяем, есть ли товар в корзине
  const existingProduct = cart.find(item => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  showNotification("Товар добавлен в корзину!");
}

function showNotification(message) {
  const notificationContainer = document.getElementById("notifications");
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;

  notificationContainer.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 500);
  }, 2000);
}

/**
 * Загрузка товаров с учётом выбранного языка.
 */
function loadProductsForLanguage(lang) {
  const file = lang === 'en' ? 'data/products_en.json' : 'data/products.json';
  fetch(file)
    .then(response => response.json())
    .then(products => {
      allProducts = products;
      filteredProducts = products;
      currentPage = 1;
      renderProducts(filteredProducts, currentPage);
      renderPagination(filteredProducts);
    })
    .catch(error => {
      console.error('Ошибка при загрузке товаров:', error);
    });
}

// Загрузка товаров при инициализации
fetch('data/products.json')
  .then(response => response.json())
  .then(products => {
    allProducts = products;
    filteredProducts = products;
    renderProducts(filteredProducts, currentPage);
    renderPagination(filteredProducts);
  })
  .catch(error => {
    console.error('Ошибка при загрузке товаров:', error);
  });

// Обработчики для модального окна отзывов
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById('reviews-modal');
  if (modal) {
    // Закрытие модального окна при клике на крестик
    const closeBtn = modal.querySelector('.close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
      });
    }
    // Закрытие модального окна при клике вне его области
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
});
