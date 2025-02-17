document.addEventListener('DOMContentLoaded', function() {
  // Объект для сопоставления логотипов с языком и темой
  const logoMapping = {
    ru: {
      standard: 'images/logo_ru.png',
      demonic: 'images/logo_ru_demonic.png'
    },
    en: {
      standard: 'images/logo_en.png',
      demonic: 'images/logo_en_demonic.png'
    }
  };

  // Переменная для хранения текущего языка (по умолчанию "ru")
  let currentLanguage = 'ru';

  /**
   * Обновляет логотип в шапке в зависимости от текущего языка и темы.
   */
  function updateLogo() {
    const logoImg = document.getElementById('site-logo');
    if (!logoImg) return;
    // Определяем, включена ли демоническая тема
    const theme = document.body.classList.contains('demonic') ? 'demonic' : 'standard';
    logoImg.src = logoMapping[currentLanguage][theme];
  }

  /**
   * Функция открытия модального окна настроек.
   * Позиционирует окно так, чтобы оно появлялось ниже кнопки настроек и не расширяло страницу.
   */
  function openSettingsModal() {
    const settingsBtn = document.querySelector('.settings');
    const modal = document.getElementById('settings-modal');
    if (!settingsBtn || !modal) return;
    
    const rect = settingsBtn.getBoundingClientRect();
    const modalWidth = 250; // ширина модального окна
    let leftPos = rect.left;
    // Если окно выходит за правую границу экрана, сдвигаем его влево
    if (leftPos + modalWidth > window.innerWidth) {
      leftPos = window.innerWidth - modalWidth - 10; // 10px отступ справа
    }
    
    modal.style.top = (rect.bottom + window.scrollY + 5) + 'px';
    modal.style.left = leftPos + 'px';
    
    modal.classList.add('show');
  }

  /**
   * Закрывает модальное окно настроек.
   */
  function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (!modal) return;
    modal.classList.remove('show');
  }

  // Обработчик клика по иконке настроек
  const settingsElem = document.querySelector('.settings');
  if (settingsElem) {
    settingsElem.addEventListener('click', function(e) {
      e.stopPropagation();
      openSettingsModal();
    });
  }

  // Обработчик клика по кнопке закрытия настроек
  const settingsModal = document.getElementById('settings-modal');
  if (settingsModal) {
    const closeSettingsElem = settingsModal.querySelector('.close-settings');
    if (closeSettingsElem) {
      closeSettingsElem.addEventListener('click', closeSettingsModal);
    }
  }

  // Закрытие модального окна при клике вне его области
  document.addEventListener('click', function(e) {
    const modal = document.getElementById('settings-modal');
    const settingsBtn = document.querySelector('.settings');
    if (modal && modal.classList.contains('show') &&
        !modal.contains(e.target) &&
        !(settingsBtn && settingsBtn.contains(e.target))) {
      closeSettingsModal();
    }
  });

  // Обработчик смены языка
  const languageSelect = document.getElementById('language-select');
  if (languageSelect) {
    languageSelect.addEventListener('change', function() {
      const lang = this.value;
      currentLanguage = lang;
      document.body.setAttribute('data-lang', lang);
      console.log("Язык изменён на: " + lang);
      updateLanguage(lang);
      updateLogo();
      // Перезагружаем товары с переводом, если необходимо:
      loadProductsForLanguage(lang);
    });
  }

  // Обработчик смены темы
  const themeSelect = document.getElementById('theme-select');
  if (themeSelect) {
    themeSelect.addEventListener('change', function() {
      const theme = this.value;
      if (theme === 'demonic') {
        document.body.classList.add('demonic');
      } else {
        document.body.classList.remove('demonic');
      }
      console.log("Тема изменена на: " + theme);
      updateLogo();
    });
  }

  /**
   * Пример функции обновления текстов на странице в зависимости от языка.
   * Здесь можно использовать JSON-файл с переводами или объект-перевод.
   */
  function updateLanguage(lang) {
    // Пример: обновляем placeholder поля поиска
    const translations = {
      ru: { searchPlaceholder: "Поиск" },
      en: { searchPlaceholder: "Search" }
    };
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput && translations[lang]) {
      searchInput.placeholder = translations[lang].searchPlaceholder;
    }
    // Дополнительно можно обновлять и другие текстовые элементы
  }

  /**
   * Функция загрузки товаров для выбранного языка.
   * Если имеются отдельные файлы (например, data/products_en.json), выбираем нужный.
   */
  function loadProductsForLanguage(lang) {
    const file = lang === 'en' ? 'data/products_en.json' : 'data/products.json';
    fetch(file)
      .then(response => response.json())
      .then(products => {
        allProducts = products;
        filteredProducts = products;
        currentPage = 1;
        renderProducts(filteredProducts, currentPage);
        renderPagination(filteredProducts);
      })
      .catch(error => {
        console.error('Ошибка при загрузке товаров:', error);
      });
  }

  // При загрузке страницы обновляем логотип (изначально currentLanguage = "ru")
  updateLogo();
});
