// js/main.js
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
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.dataset.id;
      console.log("Добавлен в корзину товар с id: " + productId);
      // Реализуйте логику добавления в корзину
    });
  });
  
  document.querySelectorAll('.reviews').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.dataset.id;
      const productName = this.dataset.name;
      openReviewsModal(productId, productName);
    });
  });
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

// Обработчики бокового меню и модальных окон
document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.getElementById("menu-btn");
  const sidebar = document.getElementById("sidebar");
  const closeMenuBtn = document.querySelector("#sidebar .close-menu");

  closeMenuBtn.addEventListener("click", function () {
    sidebar.classList.remove("active");
  });

  menuBtn.addEventListener("click", function () {
    sidebar.classList.toggle("active");
  });

  document.addEventListener("click", function (event) {
    if (!sidebar.contains(event.target) && !menuBtn.contains(event.target)) {
      sidebar.classList.remove("active");
    }
  });

  const modal = document.getElementById('reviews-modal');
  const closeBtn = modal.querySelector('.close');
  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});
