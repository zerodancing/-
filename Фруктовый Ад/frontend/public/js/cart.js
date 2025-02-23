function loadCart() {
    const cartContainer = document.querySelector('main');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    if (cart.length === 0) {
      cartContainer.innerHTML = "<h1>Корзина</h1><p>Ваша корзина пуста.</p>";
      return;
    }
  
    let totalPrice = 0;
    let cartHTML = "<h1>Корзина</h1><div class='cart-items'>";
    
    cart.forEach((product, index) => {
      totalPrice += product.price * product.quantity;
  
      cartHTML += `
        <div class="cart-item">
          <img src="${product.image}" alt="${product.name}" width="80">
          <div class="cart-details">
            <h2>${product.name}</h2>
            <p>Цена: ${product.price} руб.</p>
            <div class="cart-actions">
              <button class="decrease" data-index="${index}">−</button>
              <span class="quantity">${product.quantity}</span>
              <button class="increase" data-index="${index}">+</button>
              <button class="remove-from-cart" data-index="${index}">Удалить</button>
            </div>
          </div>
        </div>
      `;
    });
  
    cartHTML += `</div>
      <p id="total-price">Общая сумма: ${totalPrice} руб.</p>
      <button id='clear-cart'>Очистить корзину</button>`;
  
    cartContainer.innerHTML = cartHTML;
  
    // Кнопки увеличения/уменьшения количества
    document.querySelectorAll('.increase').forEach(button => {
      button.addEventListener('click', function () {
        changeQuantity(this.dataset.index, 1);
      });
    });
  
    document.querySelectorAll('.decrease').forEach(button => {
      button.addEventListener('click', function () {
        changeQuantity(this.dataset.index, -1);
      });
    });
  
    // Кнопки удаления
    document.querySelectorAll('.remove-from-cart').forEach(button => {
      button.addEventListener('click', function () {
        removeFromCart(this.dataset.index);
      });
    });
  
    // Очистка корзины
    document.getElementById('clear-cart').addEventListener('click', function () {
      localStorage.removeItem('cart');
      loadCart();
    });
  }
  
  // Функция для изменения количества товаров
  function changeQuantity(index, delta) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
  
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
  }
  
  // Функция удаления товара из корзины
  function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
  }
  
  // Загружаем корзину при открытии страницы
  document.addEventListener("DOMContentLoaded", loadCart);
  
