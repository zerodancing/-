// Пример словаря языка
const languageStrings = {
    ru: {
      headerTitle: "Фруктовый Ад",
      searchPlaceholder: "Поиск",
      // Добавьте остальные строки по мере необходимости
    },
    en: {
      headerTitle: "Fruit Hell",
      searchPlaceholder: "Search",
      // Добавьте остальные строки
    }
  };
  
  /**
   * Функция обновления текстов на странице в зависимости от выбранного языка.
   */
  function updateLanguage(lang) {
    // Пример: обновляем заголовок сайта
    const headerTitleElem = document.querySelector('header .site-title');
    if (headerTitleElem && languageStrings[lang]) {
      headerTitleElem.textContent = languageStrings[lang].headerTitle;
    }
    // Пример: обновляем placeholder у поля поиска
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput && languageStrings[lang]) {
      searchInput.placeholder = languageStrings[lang].searchPlaceholder;
    }
    // Расширяйте функцию для остальных текстовых элементов
  }
  
