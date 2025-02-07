const productsPerPage = 24;
let currentPage = 1;
let allProducts = [];

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
      renderProducts(allProducts, currentPage);
      // Обновляем класс active для кнопок пагинации
      document.querySelectorAll('.pagination .page').forEach(btn => btn.classList.remove('active'));
      pageBtn.classList.add('active');
    });
    paginationContainer.appendChild(pageBtn);
  }
}

// Загрузка товаров из JSON файла и инициализация страницы
fetch('data/products.json')
  .then(response => response.json())
  .then(products => {
    allProducts = products;
    renderProducts(allProducts, currentPage);
    renderPagination(allProducts);
  })
  .catch(error => {
    console.error('Ошибка при загрузке товаров:', error);
  });
