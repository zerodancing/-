// js/reviews.js
(function() {
    // Загружаем существующие отзывы из localStorage или создаём пустой объект
    let reviewsData = {};
    if (localStorage.getItem('reviewsData')) {
      try {
        reviewsData = JSON.parse(localStorage.getItem('reviewsData'));
      } catch(e) {
        reviewsData = {};
      }
    }
    
    let currentProductId = null;
    let currentProductName = '';
  
    // Функция, которую будем вызывать из основного кода (main.js)
    window.openReviewsModal = function(productId, productName) {
      currentProductId = productId;
      currentProductName = productName || '';
      const modal = document.getElementById('reviews-modal');
      modal.style.display = 'block';
      // Обновляем заголовок модального окна, чтобы было, например: "Отзывы для «Банан»"
      const header = modal.querySelector('h2');
      header.textContent = productName ? `Отзывы для «${productName}»` : 'Отзывы';
      loadReviews(productId);
    };
  
    // Функция сохраняет объект отзывов в localStorage
    function saveReviews() {
      localStorage.setItem('reviewsData', JSON.stringify(reviewsData));
    }
  
    // Функция загружает отзывы для продукта и обновляет разметку
    function loadReviews(productId) {
      const reviewsList = document.getElementById('reviews-list');
      const averageRatingEl = document.getElementById('average-rating');
      reviewsList.innerHTML = '';
    
      const reviews = reviewsData[productId] || [];
    
      let sum = 0;
      reviews.forEach(review => { sum += review.rating; });
      const average = reviews.length ? (sum / reviews.length) : 0;
    
      // Отображаем среднюю оценку с помощью звёзд
      averageRatingEl.innerHTML = `Средняя оценка: ${renderStars(average)} (${average.toFixed(1)} из 5, ${reviews.length} отзыв(ов))`;
    
      // Вывод каждого отзыва
      reviews.forEach(review => {
        const reviewEl = document.createElement('div');
        reviewEl.classList.add('review');
        reviewEl.innerHTML = `
          <p><strong>${review.username}</strong>:</p>
          <p>${review.text}</p>
          <p>Оценка: ${renderStars(review.rating)} (${review.rating} из 5)</p>
        `;
        reviewsList.appendChild(reviewEl);
      });
    }
  
    // Функция, возвращающая HTML-строку со звёздами (заполненные звёзды – жёлтого цвета)
    function renderStars(rating) {
      const fullStar = '<span class="rating-star">★</span>';
      const emptyStar = '<span class="rating-star empty">☆</span>';
      let stars = '';
      const rounded = Math.round(rating);
      for (let i = 1; i <= 5; i++) {
        stars += i <= rounded ? fullStar : emptyStar;
      }
      return stars;
    }
  
    // Инициализируем обработку формы отзыва
    function setupReviewForm() {
      const form = document.getElementById('review-form');
      const usernameInput = document.getElementById('review-username');
      const textInput = document.getElementById('review-text');
      
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Если пользователь не ввёл имя, генерируем случайное
        const username = usernameInput.value.trim() || getRandomUsername();
        const reviewText = textInput.value.trim();
        const rating = parseInt(form.getAttribute('data-rating')) || 0;
        
        if (!reviewText || rating === 0) {
          alert("Пожалуйста, заполните отзыв, выберите оценку и введите имя.");
          return;
        }
        
        if (!reviewsData[currentProductId]) {
          reviewsData[currentProductId] = [];
        }
        reviewsData[currentProductId].push({ username: username, text: reviewText, rating: rating });
        
        saveReviews();
        
        // Очищаем поля формы и сбрасываем рейтинг
        textInput.value = '';
        usernameInput.value = '';
        form.setAttribute('data-rating', 0);
        updateStarRatingInput(0);
        
        loadReviews(currentProductId);
      });
      
      // Настраиваем события для звезд рейтинга
      const starRatingInput = document.getElementById('star-rating-input');
      const stars = starRatingInput.querySelectorAll('.star');
      stars.forEach(star => {
        star.addEventListener('click', function() {
          const ratingValue = parseInt(this.getAttribute('data-value'));
          form.setAttribute('data-rating', ratingValue);
          updateStarRatingInput(ratingValue);
        });
        star.addEventListener('mouseover', function() {
          const ratingValue = parseInt(this.getAttribute('data-value'));
          highlightStars(ratingValue);
        });
        star.addEventListener('mouseout', function() {
          const currentRating = parseInt(form.getAttribute('data-rating')) || 0;
          updateStarRatingInput(currentRating);
        });
      });
    }
    
    // Подсветка звёзд при наведении
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
    
    // Обновление выбранного рейтинга (подсвеченные звёзды)
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
    
    // Функция генерации случайного имени, если пользователь не ввёл своё
    function getRandomUsername() {
      const names = ['Пользователь123', 'Гость456', 'Anon789', 'ФруктовыйЛюбитель'];
      return names[Math.floor(Math.random() * names.length)];
    }
    
    // При загрузке DOM запускаем настройку формы
    document.addEventListener("DOMContentLoaded", function() {
      setupReviewForm();
    });
  })();
  
