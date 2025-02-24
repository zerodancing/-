document.addEventListener('DOMContentLoaded', function() {
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-container').innerHTML = data;
      initHeader();
      // Оповещаем другие модули, что шапка загружена
      document.dispatchEvent(new CustomEvent('headerLoaded'));
    })
    .catch(error => console.error('Ошибка при загрузке шапки:', error));
});

function initHeader() {
  // Кнопка меню
  const menuBtn = document.getElementById("menu-btn");
  const sidebar = document.getElementById("sidebar");
  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      sidebar.classList.toggle("active");
    });
  }
  // Кнопка закрытия бокового меню
  const closeMenuBtn = document.querySelector("#sidebar .close-menu");
  if (closeMenuBtn && sidebar) {
    closeMenuBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      sidebar.classList.remove("active");
    });
  }
  // Закрытие бокового меню при клике вне его области
  document.addEventListener('click', function(event) {
    if (sidebar && !sidebar.contains(event.target) && !menuBtn.contains(event.target)) {
      sidebar.classList.remove('active');
    }
  });
  // Кнопка аккаунта: переход на страницу аккаунта
  const authElement = document.querySelector('.auth');
  if (authElement) {
    authElement.addEventListener('click', function() {
      window.location.href = 'account.html';
    });
  }
}
