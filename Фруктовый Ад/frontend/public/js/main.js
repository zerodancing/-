const productsPerPage = 24;
let currentPage = 1;
let allProducts = [];
let filteredProducts = [];

// Функция для отрисовки товаров на странице
function renderProducts(products, page = 1) {
  const productGrid = document.querySelector('.product-grid');
  productGrid.innerHTML = ''; // Очистка содержимого

  const startIndex = (page - 1) * productsPerPage;
  const endIndex = page * productsPerPage;
  const productsToShow = products.slice(startIndex, endIndex);

  productsToShow.forEach(product => {
    const productCard = document.createElement('article');
    productCard.classList.add('product-card');

    productCard.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h2>${product.name}</h2>
    <p>${product.description}</p>
    <p class="price">Цена: ${product.price}</p>
    <div class="actions">
      <button class="add-to-cart" data-id="${product.id}">В корзину</button>
      <!-- Добавляем data-name, чтобы потом передать название в модуль отзывов -->
      <button class="reviews" data-id="${product.id}" data-name="${product.name}">Отзывы</button>
    </div>
  `;
  

    productGrid.appendChild(productCard);
  });
  
  attachProductEventListeners(); // Добавляем обработчики событий к кнопкам
}

// Функция для создания и отрисовки элементов пагинации
function renderPagination(products) {
  const paginationContainer = document.querySelector('.pagination');
  paginationContainer.innerHTML = ''; // Очистка пагинации

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

// Функция для обновления активной кнопки пагинации
function updateActivePagination() {
  document.querySelectorAll('.pagination .page').forEach(btn => btn.classList.remove('active'));
  const pages = document.querySelectorAll('.pagination .page');
  if (pages[currentPage - 1]) {
    pages[currentPage - 1].classList.add('active');
  }
}

// Функция для добавления обработчиков событий к кнопкам в карточках товаров
function attachProductEventListeners() {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.dataset.id;
      console.log("Добавлен в корзину товар с id: " + productId);
      // Здесь можно реализовать логику добавления товара в корзину
    });
  });
  
  document.querySelectorAll('.reviews').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.dataset.id;
      const productName = this.dataset.name;
      // Функция openReviewsModal определена в reviews.js
      openReviewsModal(productId, productName);
    });
  });
  
}

// Функция для открытия модального окна с отзывами
function openReviewsModal(productId) {
  // Здесь можно динамически менять содержимое модального окна в зависимости от товара.
  // Пока используем статичные отзывы.
  const modal = document.getElementById('reviews-modal');
  modal.style.display = 'block';
}

// Загрузка товаров из JSON файла и инициализация страницы
fetch('data/products.json')
  .then(response => response.json())
  .then(products => {
    allProducts = products;
    filteredProducts = products; // Изначально выводим все товары
    renderProducts(filteredProducts, currentPage);
    renderPagination(filteredProducts);
  })
  .catch(error => {
    console.error('Ошибка при загрузке товаров:', error);
  });

// Обработчики для бокового меню и модального окна
document.addEventListener("DOMContentLoaded", function () {
  // Боковое меню
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

  // Закрытие модального окна при клике на кнопку "close"
  const modal = document.getElementById('reviews-modal');
  const closeBtn = modal.querySelector('.close');
  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
  });

  // Закрытие модального окна при клике вне модального контента
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});

// --- Отзывы: функционал вынесен в отдельный файл reviews.js ---

// js/main.js
let currentLanguage = 'ru'; // Эта переменная будет обновляться в settings.js
const conversionRate = 0.013; // Пример: 1 руб. = 0.013 долларов

// В функции renderProducts измените вывод цены:
function renderProducts(products, page = 1) {
  const productGrid = document.querySelector('.product-grid');
  productGrid.innerHTML = '';

  const startIndex = (page - 1) * productsPerPage;
  const productsToShow = products.slice(startIndex, page * productsPerPage);

  productsToShow.forEach(product => {
    const productCard = document.createElement('article');
    productCard.classList.add('product-card');
    
    // Обработка цены в зависимости от языка
    let priceDisplay;
    if (currentLanguage === 'en') {
      // Предполагаем, что product.price содержит число в рублях, возможно, как строку с " руб."
      const rub = parseFloat(product.price);
      const dollars = (rub * conversionRate).toFixed(2);
      priceDisplay = `Price: $${dollars}`;
    } else {
      priceDisplay = `Цена: ${product.price}`;
    }
    
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <p class="price">${priceDisplay}</p>
      <div class="actions">
        <button class="add-to-cart" data-id="${product.id}">В корзину</button>
        <button class="reviews" data-id="${product.id}" data-name="${product.name}">Отзывы</button>
      </div>
    `;
    productGrid.appendChild(productCard);
  });
  
  attachProductEventListeners();
}
