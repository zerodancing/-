const LanguageManager = (function() {
  let currentLanguage = 'ru';

  const translations = {
    settings: {
      ru: {
        title: "Настройки",
        languageLabel: "Язык:",
        themeLabel: "Тема:",
        languageOptions: ["Русский", "English"],
        themeOptions: ["Стандартная", "Демоническая"]
      },
      en: {
        title: "Settings",
        languageLabel: "Language:",
        themeLabel: "Theme:",
        languageOptions: ["Russian", "English"],
        themeOptions: ["Standard", "Demonic"]
      }
    },
    reviews: {
      ru: {
        defaultTitle: "Отзывы",
        titleFor: "Отзывы для «{name}»",
        addReview: "Добавить отзыв",
        averageRating: "Средняя оценка:",
        ratingLabel: "Оценка:",
        yourRating: "Ваша оценка:",
        usernamePlaceholder: "Ваше имя",
        reviewPlaceholder: "Напишите ваш отзыв",
        submitButton: "Отправить отзыв",
        ratingValue: "({rating} из 5)",
        ratingSummary: "({rating} из 5, {count} отзыв(ов))"
      },
      en: {
        defaultTitle: "Reviews",
        titleFor: "Reviews for «{name}»",
        addReview: "Add Review",
        averageRating: "Average Rating:",
        ratingLabel: "Rating:",
        yourRating: "Your Rating:",
        usernamePlaceholder: "Your name",
        reviewPlaceholder: "Write your review",
        submitButton: "Submit Review",
        ratingValue: "({rating} out of 5)",
        ratingSummary: "({rating} out of 5, {count} review(s))"
      }
    },
    main: {
      ru: {
        priceLabel: "Цена:",
        addToCart: "В корзину",
        reviews: "Отзывы"
      },
      en: {
        priceLabel: "Price:",
        addToCart: "Add to Cart",
        reviews: "Reviews"
      }
    },
    search: {
      ru: {
        placeholder: "Поиск"
      },
      en: {
        placeholder: "Search"
      }
    },
    sidebar: {
      ru: {
        home: "Главная",
        cart: "Корзина",
        about: "О нас",
        help: "Помощь"
      },
      en: {
        home: "Home",
        cart: "Cart",
        about: "About us",
        help: "Help"
      }
    },
    account: {
      ru: {
        loginTitle: "Вход в аккаунт",
        usernamePlaceholder: "Имя пользователя",
        passwordPlaceholder: "Пароль",
        loginButton: "Войти",
        welcome: "Добро пожаловать, {username}!",
        logoutButton: "Выйти"
      },
      en: {
        loginTitle: "Account Login",
        usernamePlaceholder: "Username",
        passwordPlaceholder: "Password",
        loginButton: "Login",
        welcome: "Welcome, {username}!",
        logoutButton: "Logout"
      }
    },
    about: {
      ru: {
        title: "О нас",
        teamTitle: "Наша команда",
        description: "Над этим сайтом работает наша команда из 4 человек:",
        members: {
          alexander: {
            name: "Александр Трубин",
            role: "Разработка ТЗ и сайта",
            description: "Я отвечаю за техническое задание и разработку сайта."
          },
          kostya: {
            name: "Почикаев Костя",
            role: "Разработчик",
            description: "Разрабатывает отдельные разделы сайта."
          },
          danil: {
            name: "Шаталов Данил",
            role: "Дизайнер макета",
            description: "Создает макет сайта."
          },
          farah: {
            name: "Эшматова Фарахноз",
            role: "Презентатор",
            description: "Готовит презентацию сайта."
          }
        }
      },
      en: {
        title: "About Us",
        teamTitle: "Our Team",
        description: "Our website is developed by a team of 4 people:",
        members: {
          alexander: {
            name: "Alexander Trubin",
            role: "Technical Assignment & Web Development",
            description: "I handle the technical assignment and website development."
          },
          kostya: {
            name: "Kostya Pochikaev",
            role: "Developer",
            description: "Develops various sections of the website."
          },
          danil: {
            name: "Danil Shatalov",
            role: "Layout Designer",
            description: "Designs the website layout."
          },
          farah: {
            name: "Farah Eshmatova",
            role: "Presentation Specialist",
            description: "Creates the website presentation."
          }
        }
      }
    }
  };

  function setLanguage(lang) {
    currentLanguage = lang;
    document.body.setAttribute('data-lang', lang);
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
  }

  function getCurrentLanguage() {
    return currentLanguage;
  }

  function getTranslation(section, key, data = {}) {
    let text = translations[section] &&
               translations[section][currentLanguage] &&
               translations[section][currentLanguage][key];
    if (typeof text === 'string') {
      Object.keys(data).forEach(k => {
        text = text.replace(`{${k}}`, data[k]);
      });
    }
    return text;
  }

  function updateStaticTranslations() {
    document.querySelectorAll('[data-translation]').forEach(elem => {
      const keyPath = elem.getAttribute('data-translation');
      const [section, key] = keyPath.split('.');
      const translation = getTranslation(section, key);
      if (translation) {
        elem.textContent = translation;
      }
    });
  }

  document.addEventListener('languageChanged', function() {
    updateStaticTranslations();
  });

  return {
    setLanguage,
    getCurrentLanguage,
    getTranslation
  };
})();
