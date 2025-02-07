document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.querySelector('.product-grid');
  
    // Загружаем данные о товарах из файла products.json
    fetch('data/products.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка при загрузке данных: ' + response.statusText);
        }
        return response.json();
      })
      .then(products => {
        // Для каждого товара создаём карточку и добавляем в контейнер
        products.forEach(product => {
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
      })
      .catch(error => {
        console.error('Ошибка при загрузке товаров:', error);
      });
  });
  