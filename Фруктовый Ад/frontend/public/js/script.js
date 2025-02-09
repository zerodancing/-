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
      openReviewsModal(productId);
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

// Реализация функциональности поиска по названию товара
document.querySelector('.search-bar input').addEventListener('input', function(e) {
  const query = e.target.value.toLowerCase();
  filteredProducts = allProducts.filter(product => product.name.toLowerCase().includes(query));
  currentPage = 1; // Сброс текущей страницы при поиске
  renderProducts(filteredProducts, currentPage);
  renderPagination(filteredProducts);
});

// Обработчики для бокового меню и модального окна
document.addEventListener("DOMContentLoaded", function () {
  // Боковое меню
  const menuBtn = document.getElementById("menu-btn");
  const sidebar = document.getElementById("sidebar");

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
// --- Блок для работы с отзывами ---

// Объект для хранения отзывов по каждому товару (ключ – id товара)
let reviewsData = {}; 
let currentProductId = null;

// Функция для открытия модального окна с отзывами для конкретного товара
function openReviewsModal(productId) {
  currentProductId = productId;
  const modal = document.getElementById('reviews-modal');
  modal.style.display = 'block';
  loadReviews(productId);
}

// Функция для загрузки и отображения отзывов и расчёта средней оценки
function loadReviews(productId) {
  const reviewsList = document.getElementById('reviews-list');
  const averageRatingEl = document.getElementById('average-rating');
  reviewsList.innerHTML = '';
  
  // Получаем отзывы для данного товара (если нет – пустой массив)
  const reviews = reviewsData[productId] || [];
  
  // Вычисляем среднюю оценку
  let sum = 0;
  reviews.forEach(review => { sum += review.rating; });
  const average = reviews.length ? (sum / reviews.length) : 0;
  
  // Отображаем среднюю оценку в виде звёзд и числового значения
  averageRatingEl.innerHTML = `Средняя оценка: ${renderStars(average)} (${average.toFixed(1)} из 5, ${reviews.length} отзывов)`;
  
  // Отрисовываем каждый отзыв
  reviews.forEach(review => {
    const reviewEl = document.createElement('div');
    reviewEl.classList.add('review');
    reviewEl.innerHTML = `<p>${review.text}</p>
                          <p>Оценка: ${renderStars(review.rating)} (${review.rating} из 5)</p>`;
    reviewsList.appendChild(reviewEl);
  });
}

// Функция для генерации строкового представления звёзд (★ – заполненная, ☆ – пустая)
function renderStars(rating) {
  const fullStar = '★';
  const emptyStar = '☆';
  let stars = '';
  // Округляем до ближайшего целого для простоты
  const rounded = Math.round(rating);
  for (let i = 1; i <= 5; i++) {
    stars += i <= rounded ? fullStar : emptyStar;
  }
  return stars;
}

// Обработчик отправки формы нового отзыва
document.getElementById('review-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const reviewText = document.getElementById('review-text').value.trim();
  const rating = parseInt(this.getAttribute('data-rating')) || 0;
  
  if (!reviewText || rating === 0) {
    alert("Пожалуйста, заполните отзыв и выберите оценку.");
    return;
  }
  
  // Сохраняем отзыв для текущего товара
  if (!reviewsData[currentProductId]) {
    reviewsData[currentProductId] = [];
  }
  reviewsData[currentProductId].push({ text: reviewText, rating: rating });
  
  // Очищаем форму
  document.getElementById('review-text').value = '';
  this.setAttribute('data-rating', 0);
  updateStarRatingInput(0);
  
  // Обновляем список отзывов
  loadReviews(currentProductId);
});

// Настройка обработчиков для звезд рейтинга в форме
const starRatingInput = document.getElementById('star-rating-input');
if (starRatingInput) {
  const stars = starRatingInput.querySelectorAll('.star');
  stars.forEach(star => {
    // При клике ставим оценку
    star.addEventListener('click', function() {
      const ratingValue = parseInt(this.getAttribute('data-value'));
      document.getElementById('review-form').setAttribute('data-rating', ratingValue);
      updateStarRatingInput(ratingValue);
    });
    // При наведении подсвечиваем звёзды
    star.addEventListener('mouseover', function() {
      const ratingValue = parseInt(this.getAttribute('data-value'));
      highlightStars(ratingValue);
    });
    // При уходе с курсора возвращаем выбранное состояние
    star.addEventListener('mouseout', function() {
      const currentRating = parseInt(document.getElementById('review-form').getAttribute('data-rating')) || 0;
      updateStarRatingInput(currentRating);
    });
  });
}

// Функция для временного подсвечивания звезд при наведении
function highlightStars(rating) {
  const stars = document.querySelectorAll('#star-rating-input .star');
  stars.forEach(star => {
    const starValue = parseInt(star.getAttribute('data-value'));
    if (starValue <= rating) {
      star.classList.add('hover');
    } else {
      star.classList.remove('hover');
    }
  });
}

// Функция для отображения выбранного рейтинга (подсвеченные звёзды)
function updateStarRatingInput(rating) {
  const stars = document.querySelectorAll('#star-rating-input .star');
  stars.forEach(star => {
    const starValue = parseInt(star.getAttribute('data-value'));
    if (starValue <= rating) {
      star.classList.add('selected');
    } else {
      star.classList.remove('selected');
    }
  });
}

// --- Конец блока отзывов ---

// Пример: Обработчик для кнопки "Отзывы" в карточке товара
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
      openReviewsModal(productId);
    });
  });
}

// Обработчики для бокового меню и закрытия модального окна (оставляем без изменений)
document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.getElementById("menu-btn");
  const sidebar = document.getElementById("sidebar");

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
