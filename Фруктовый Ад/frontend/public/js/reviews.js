// js/reviews.js
(function() {
  let reviewsData = {};
  try {
    reviewsData = JSON.parse(localStorage.getItem('reviewsData')) || {};
  } catch(e) {
    reviewsData = {};
  }
  
  let currentProductId = null;

  window.openReviewsModal = function(productId, productName) {
    currentProductId = productId;
    const modal = document.getElementById('reviews-modal');
    modal.style.display = 'block';
    updateReviewsModal(LanguageManager.getCurrentLanguage(), productName);
    loadReviews(productId);
  };

  function saveReviews() {
    localStorage.setItem('reviewsData', JSON.stringify(reviewsData));
  }

  function loadReviews(productId) {
    const reviewsList = document.getElementById('reviews-list');
    const averageRatingEl = document.getElementById('average-rating');
    reviewsList.innerHTML = '';
  
    const reviews = reviewsData[productId] || [];
    let sum = 0;
    reviews.forEach(review => { sum += review.rating; });
    const average = reviews.length ? (sum / reviews.length) : 0;
  
    averageRatingEl.innerHTML = 
      `${LanguageManager.getTranslation('reviews', 'averageRating')} ${renderStars(average)} ${LanguageManager.getTranslation('reviews', 'ratingSummary', { rating: average.toFixed(1), count: reviews.length })}`;
  
    reviews.forEach((review, index) => {
      const reviewEl = document.createElement('div');
      reviewEl.classList.add('review');
      reviewEl.innerHTML = `
        <p><strong>${review.username}</strong>:</p>
        <p>${review.text}</p>
        <p>${LanguageManager.getTranslation('reviews', 'ratingLabel')} ${renderStars(review.rating)} ${LanguageManager.getTranslation('reviews', 'ratingValue', { rating: review.rating })}</p>
        <p class="review-likes">
          <button class="like-btn" data-index="${index}">👍</button>
          <span class="like-count">${review.likes || 0}</span>
          <button class="dislike-btn" data-index="${index}">👎</button>
          <span class="dislike-count">${review.dislikes || 0}</span>
        </p>
      `;
      reviewsList.appendChild(reviewEl);
    });
  
    const likeButtons = reviewsList.querySelectorAll('.like-btn');
    likeButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = this.getAttribute('data-index');
        reviewsData[productId][idx].likes = (reviewsData[productId][idx].likes || 0) + 1;
        saveReviews();
        loadReviews(productId);
      });
    });
  
    const dislikeButtons = reviewsList.querySelectorAll('.dislike-btn');
    dislikeButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = this.getAttribute('data-index');
        reviewsData[productId][idx].dislikes = (reviewsData[productId][idx].dislikes || 0) + 1;
        saveReviews();
        loadReviews(productId);
      });
    });
  }

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

  function setupReviewForm() {
    const form = document.getElementById('review-form');
    const usernameInput = document.getElementById('review-username');
    const textInput = document.getElementById('review-text');
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
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
      reviewsData[currentProductId].push({
        username: username,
        text: reviewText,
        rating: rating,
        likes: 0,
        dislikes: 0
      });
      
      saveReviews();
      textInput.value = '';
      usernameInput.value = '';
      form.setAttribute('data-rating', 0);
      updateStarRatingInput(0);
      loadReviews(currentProductId);
    });
    
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
  
  function highlightStars(rating) {
    const stars = document.querySelectorAll('#star-rating-input .star');
    stars.forEach(star => {
      const starValue = parseInt(star.getAttribute('data-value'));
      star.classList.toggle('hover', starValue <= rating);
    });
  }
  
  function updateStarRatingInput(rating) {
    const stars = document.querySelectorAll('#star-rating-input .star');
    stars.forEach(star => {
      const starValue = parseInt(star.getAttribute('data-value'));
      star.classList.toggle('selected', starValue <= rating);
    });
  }
  
  function getRandomUsername() {
    const names = ['Пользователь123', 'Гость456', 'Anon789', 'ФруктовыйЛюбитель'];
    return names[Math.floor(Math.random() * names.length)];
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    setupReviewForm();
  });

  // Обновляем переводы в модальном окне отзывов при смене языка
  document.addEventListener('DOMContentLoaded', function() {
    // Если окно открыто, обновляем заголовок и подписи
    const modal = document.getElementById('reviews-modal');
    if (modal.style.display === 'block') {
      const header = modal.querySelector('h2');
      if (header && header.dataset.productName) {
        header.textContent = LanguageManager.getTranslation('reviews', 'titleFor', { name: header.dataset.productName });
      } else {
        header.textContent = LanguageManager.getTranslation('reviews', 'defaultTitle');
      }
      const formHeader = modal.querySelector('#review-form h3');
      if (formHeader) formHeader.textContent = LanguageManager.getTranslation('reviews', 'addReview');
      const averageRatingEl = modal.querySelector('.average-rating');
      if (averageRatingEl) {
        // Пересчитывается при загрузке отзывов, но можно обновить data-label, если нужно
        averageRatingEl.dataset.label = LanguageManager.getTranslation('reviews', 'averageRating');
      }
      // Обновляем placeholder для полей ввода и текст кнопки
      const usernameInput = document.getElementById('review-username');
      if (usernameInput) {
        usernameInput.placeholder = LanguageManager.getTranslation('reviews', 'usernamePlaceholder');
      }
      const reviewTextarea = document.getElementById('review-text');
      if (reviewTextarea) {
        reviewTextarea.placeholder = LanguageManager.getTranslation('reviews', 'reviewPlaceholder');
      }
      const submitButton = document.querySelector('#review-form button[type="submit"]');
      if (submitButton) {
        submitButton.textContent = LanguageManager.getTranslation('reviews', 'submitButton');
      }
    }
  });
})();

function updateReviewsModal(lang, productName = "") {
  const modal = document.getElementById('reviews-modal');
  if (!modal) return;
  
  // Обновление заголовка модального окна
  const header = modal.querySelector('h2');
  if (header) {
    if (productName) {
      header.textContent = LanguageManager.getTranslation('reviews', 'titleFor', { name: productName });
      header.dataset.productName = productName;
    } else {
      header.textContent = LanguageManager.getTranslation('reviews', 'defaultTitle');
    }
  }
  
  // Обновление заголовка формы
  const formHeader = modal.querySelector('#review-form h3');
  if (formHeader) {
    formHeader.textContent = LanguageManager.getTranslation('reviews', 'addReview');
  }
  
  // Обновление средней оценки (если нужно)
  const averageRatingEl = modal.querySelector('.average-rating');
  if (averageRatingEl) {
    averageRatingEl.dataset.label = LanguageManager.getTranslation('reviews', 'averageRating');
  }
  
  // **Обновление placeholder'ов и текста кнопки**
  const usernameInput = document.getElementById('review-username');
  if (usernameInput) {
    usernameInput.placeholder = LanguageManager.getTranslation('reviews', 'usernamePlaceholder');
  }
  
  const reviewTextarea = document.getElementById('review-text');
  if (reviewTextarea) {
    reviewTextarea.placeholder = LanguageManager.getTranslation('reviews', 'reviewPlaceholder');
  }
  
  const submitButton = document.querySelector('#review-form button[type="submit"]');
  if (submitButton) {
    submitButton.textContent = LanguageManager.getTranslation('reviews', 'submitButton');
  }
}
