// js/search.js

let currentSuggestionIndex = -1;

function updateSearchSuggestions(query) {
  const suggestionsContainer = document.getElementById('search-suggestions');
  suggestionsContainer.innerHTML = '';
  currentSuggestionIndex = -1;
  if (!query) return;

  // Фильтрация и сортировка товаров
  let suggestions = allProducts.filter(product =>
    product.name.toLowerCase().includes(query)
  );
  suggestions.sort((a, b) => {
    const aStarts = a.name.toLowerCase().startsWith(query) ? 0 : 1;
    const bStarts = b.name.toLowerCase().startsWith(query) ? 0 : 1;
    if (aStarts !== bStarts) return aStarts - bStarts;
    return a.name.localeCompare(b.name);
  });
  suggestions = suggestions.slice(0, 5);
  if (suggestions.length === 0) return;

  const ul = document.createElement('ul');
  suggestions.forEach((product, index) => {
    const li = document.createElement('li');
    li.textContent = product.name;
    li.dataset.index = index;
    li.addEventListener('click', () => {
      selectSuggestion(index, product.name);
    });
    ul.appendChild(li);
  });
  suggestionsContainer.appendChild(ul);
}

function highlightSuggestion(index) {
  const suggestionsContainer = document.getElementById('search-suggestions');
  const items = suggestionsContainer.querySelectorAll('li');
  items.forEach((item, i) => {
    item.classList.toggle('highlighted', i === index);
  });
}

function selectSuggestion(index, text) {
  const input = document.querySelector('.search-bar input');
  input.value = text;
  document.getElementById('search-suggestions').innerHTML = '';
  performSearch(text.toLowerCase());
}

function performSearch(query) {
  filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(query)
  );
  currentPage = 1;
  renderProducts(filteredProducts, currentPage);
  renderPagination(filteredProducts);
}

// Функция инициализации обработчиков для элементов поиска в шапке
function initSearch() {
  const searchInput = document.querySelector('.search-bar input');
  const searchBtn = document.querySelector('.search-btn');
  if (!searchInput) return;

  searchInput.addEventListener('input', function (e) {
    const query = e.target.value.toLowerCase();
    updateSearchSuggestions(query);
  });

  searchInput.addEventListener('keydown', function (e) {
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
        performSearch(e.target.value.toLowerCase());
      }
    }
  });

  if (searchBtn) {
    searchBtn.addEventListener('click', function () {
      const query = searchInput.value.toLowerCase();
      performSearch(query);
    });
  }
}

// Если элемент уже существует, инициализируем, иначе ждём событие "headerLoaded"
if (document.readyState !== 'loading') {
  if (document.querySelector('.search-bar input')) {
    initSearch();
  } else {
    document.addEventListener('headerLoaded', initSearch);
  }
} else {
  document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.search-bar input')) {
      initSearch();
    } else {
      document.addEventListener('headerLoaded', initSearch);
    }
  });
}

// При загрузке устанавливаем placeholder с переводом
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.querySelector('.search-bar input');
  if (searchInput) {
    searchInput.placeholder = LanguageManager.getTranslation('search', 'placeholder');
  }
});

// Обновляем placeholder при смене языка
document.addEventListener('languageChanged', function(e) {
  const searchInput = document.querySelector('.search-bar input');
  if (searchInput) {
    searchInput.placeholder = LanguageManager.getTranslation('search', 'placeholder');
  }
});
