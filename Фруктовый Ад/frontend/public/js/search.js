// js/search.js

// Глобальная переменная для текущего выделенного индекса в подсказках поиска
let currentSuggestionIndex = -1;

/**
 * Обновляет подсказки поиска.
 * Принимает введённую строку (query) и выводит до 5 подсказок, отсортированных так, чтобы товары,
 * название которых начинается с query, шли первыми.
 */
function updateSearchSuggestions(query) {
  const suggestionsContainer = document.getElementById('search-suggestions');
  suggestionsContainer.innerHTML = '';
  currentSuggestionIndex = -1; // Сброс выделения при новом запросе
  if (!query) return;
  
  // Фильтруем товары, название которых содержит query
  let suggestions = allProducts.filter(product =>
    product.name.toLowerCase().includes(query)
  );
  
  // Сортируем: товары, начинающиеся с query, должны идти первыми
  suggestions.sort((a, b) => {
    const aStarts = a.name.toLowerCase().startsWith(query) ? 0 : 1;
    const bStarts = b.name.toLowerCase().startsWith(query) ? 0 : 1;
    if (aStarts !== bStarts) return aStarts - bStarts;
    return a.name.localeCompare(b.name);
  });
  
  suggestions = suggestions.slice(0, 5); // Ограничиваем до 5 подсказок
  if (suggestions.length === 0) return;
  
  const ul = document.createElement('ul');
  suggestions.forEach((product, index) => {
    const li = document.createElement('li');
    li.textContent = product.name;
    li.dataset.index = index; // сохраняем индекс для навигации
    li.addEventListener('click', () => {
      selectSuggestion(index, product.name);
    });
    ul.appendChild(li);
  });
  suggestionsContainer.appendChild(ul);
}

/**
 * Выделяет подсказку с заданным индексом.
 */
function highlightSuggestion(index) {
  const suggestionsContainer = document.getElementById('search-suggestions');
  const items = suggestionsContainer.querySelectorAll('li');
  items.forEach((item, i) => {
    if (i === index) {
      item.classList.add('highlighted');
    } else {
      item.classList.remove('highlighted');
    }
  });
}

/**
 * Обрабатывает выбор подсказки:
 * подставляет выбранное значение в поле поиска и запускает поиск.
 */
function selectSuggestion(index, text) {
  const input = document.querySelector('.search-bar input');
  input.value = text;
  document.getElementById('search-suggestions').innerHTML = '';
  performSearch(text.toLowerCase());
}

/**
 * Обработчик ввода в поле поиска – обновляет только подсказки.
 */
document.querySelector('.search-bar input').addEventListener('input', function (e) {
  const query = e.target.value.toLowerCase();
  updateSearchSuggestions(query);
});

/**
 * Обработчик клавиатуры в поле поиска:
 * - Стрелки "вверх"/"вниз" перемещают выделение.
 * - Enter выбирает подсказку, если она выделена, или запускает поиск по введённому запросу.
 */
document.querySelector('.search-bar input').addEventListener('keydown', function (e) {
  const suggestionsContainer = document.getElementById('search-suggestions');
  const items = suggestionsContainer.querySelectorAll('li');
  
  if (e.key === "ArrowDown") {
    if (items.length > 0) {
      currentSuggestionIndex = (currentSuggestionIndex + 1) % items.length;
      highlightSuggestion(currentSuggestionIndex);
    }
    e.preventDefault();
  } else if (e.key === "ArrowUp") {
    if (items.length > 0) {
      currentSuggestionIndex = (currentSuggestionIndex - 1 + items.length) % items.length;
      highlightSuggestion(currentSuggestionIndex);
    }
    e.preventDefault();
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (currentSuggestionIndex >= 0 && items.length > 0) {
      const selectedText = items[currentSuggestionIndex].textContent;
      selectSuggestion(currentSuggestionIndex, selectedText);
    } else {
      const query = e.target.value.toLowerCase();
      performSearch(query);
    }
  }
});

/**
 * Обработчик клика по кнопке поиска.
 */
document.querySelector('.search-btn').addEventListener('click', function () {
  const query = document.querySelector('.search-bar input').value.toLowerCase();
  performSearch(query);
});

/**
 * Функция для выполнения поиска: фильтрует товары и обновляет результаты.
 */
function performSearch(query) {
  filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(query)
  );
  currentPage = 1;
  renderProducts(filteredProducts, currentPage);
  renderPagination(filteredProducts);
}
