// js/settings.js
document.addEventListener('DOMContentLoaded', function() {
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

  function updateLogo() {
    const logoImg = document.getElementById('site-logo');
    if (!logoImg) return;
    const lang = LanguageManager.getCurrentLanguage();
    const theme = document.body.classList.contains('demonic') ? 'demonic' : 'standard';
    logoImg.src = logoMapping[lang][theme];
  }

  function openSettingsModal() {
    // Здесь ищем элемент с классом .settings (из шапки)
    const settingsBtn = document.querySelector('.settings');
    const modal = document.getElementById('settings-modal');
    if (!settingsBtn || !modal) return;

    const rect = settingsBtn.getBoundingClientRect();
    const modalWidth = 250;
    let leftPos = rect.left;
    if (leftPos + modalWidth > window.innerWidth) {
      leftPos = window.innerWidth - modalWidth - 10;
    }
    modal.style.top = (rect.bottom + window.scrollY + 5) + 'px';
    modal.style.left = leftPos + 'px';
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (!modal) return;
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  function initHeaderSettings() {
    const settingsElem = document.querySelector('.settings');
    if (settingsElem) {
      settingsElem.removeEventListener('click', headerSettingsHandler);
      settingsElem.addEventListener('click', headerSettingsHandler);
    }
  }

  function headerSettingsHandler(e) {
    e.stopPropagation();
    openSettingsModal();
  }

  if (document.querySelector('.settings')) {
    initHeaderSettings();
  } else {
    document.addEventListener('headerLoaded', initHeaderSettings);
  }

  const settingsModal = document.getElementById('settings-modal');
  if (settingsModal) {
    const closeSettingsElem = settingsModal.querySelector('.close-settings');
    if (closeSettingsElem) {
      closeSettingsElem.addEventListener('click', closeSettingsModal);
    }
  }
  document.addEventListener('click', function(e) {
    const modal = document.getElementById('settings-modal');
    const settingsBtn = document.querySelector('.settings');
    if (modal && modal.classList.contains('show') &&
        !modal.contains(e.target) &&
        !(settingsBtn && settingsBtn.contains(e.target))) {
      closeSettingsModal();
    }
  });

  const languageSelect = document.getElementById('language-select');
  if (languageSelect) {
    languageSelect.addEventListener('change', function() {
      LanguageManager.setLanguage(this.value);
      updateLogo();
      if (typeof loadProductsForLanguage === 'function') {
        loadProductsForLanguage(this.value);
      }
    });
  }

  const themeSelect = document.getElementById('theme-select');
  if (themeSelect) {
    themeSelect.addEventListener('change', function() {
      const theme = this.value;
      if (theme === 'demonic') {
        document.body.classList.add('demonic');
      } else {
        document.body.classList.remove('demonic');
      }
      updateLogo();
    });
  }

  document.addEventListener('languageChanged', function(e) {
    updateSettingsModal(e.detail);
  });

  updateLogo();
});

function updateSettingsModal(lang) {
  const modal = document.getElementById('settings-modal');
  if (!modal) return;

  const title = LanguageManager.getTranslation('settings', 'title');
  const languageLabel = LanguageManager.getTranslation('settings', 'languageLabel');
  const themeLabel = LanguageManager.getTranslation('settings', 'themeLabel');

  const header = modal.querySelector('h2');
  if (header) header.textContent = title;

  const langLabel = modal.querySelector('label[for="language-select"]');
  if (langLabel) langLabel.textContent = languageLabel;

  const themeLabelEl = modal.querySelector('label[for="theme-select"]');
  if (themeLabelEl) themeLabelEl.textContent = themeLabel;

  const languageSelect = modal.querySelector('#language-select');
  if (languageSelect && languageSelect.options.length >= 2) {
    languageSelect.options[0].textContent = LanguageManager.getTranslation('settings', 'languageOptions')[0];
    languageSelect.options[1].textContent = LanguageManager.getTranslation('settings', 'languageOptions')[1];
  }
  const themeSelect = modal.querySelector('#theme-select');
  if (themeSelect && themeSelect.options.length >= 2) {
    themeSelect.options[0].textContent = LanguageManager.getTranslation('settings', 'themeOptions')[0];
    themeSelect.options[1].textContent = LanguageManager.getTranslation('settings', 'themeOptions')[1];
  }
}
