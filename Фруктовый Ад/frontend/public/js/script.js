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
        <button class="reviews" data-id="${product.id}">Отзывы</button>
      </div>
    `;

    productGrid.appendChild(productCard);
  });
  
  attachProductEventListeners(); // После отрисовки карточек добавляем обработчики событий
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

// Функция для обновления выделения активной страницы в пагинации
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
      // Здесь можно реализовать добавление товара в корзину
    });
  });
  
  document.querySelectorAll('.reviews').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.dataset.id;
      alert("Показать отзывы для товара с id: " + productId);
      // Здесь можно реализовать открытие модального окна с отзывами
    });
  });
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

// Реализация функциональности поиска по названию товара
document.querySelector('.search-bar input').addEventListener('input', function(e) {
  const query = e.target.value.toLowerCase();
  filteredProducts = allProducts.filter(product => product.name.toLowerCase().includes(query));
  currentPage = 1; // Сброс текущей страницы при поиске
  renderProducts(filteredProducts, currentPage);
  renderPagination(filteredProducts);
});

// Реализация функциональности бокового меню
document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.getElementById("menu-btn");
  const sidebar = document.getElementById("sidebar");

  menuBtn.addEventListener("click", function () {
    sidebar.classList.toggle("active"); // Переключаем класс "active" для бокового меню
  });

  // Закрытие меню при клике вне его области
  document.addEventListener("click", function (event) {
    if (!sidebar.contains(event.target) && !menuBtn.contains(event.target)) {
      sidebar.classList.remove("active");
    }
  });
});
