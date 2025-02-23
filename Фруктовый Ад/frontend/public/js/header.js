document.addEventListener('DOMContentLoaded', function() {
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-container').innerHTML = data;
      initHeader();
      // Сообщаем другим модулям, что шапка загружена (если нужно)
      document.dispatchEvent(new CustomEvent('headerLoaded'));
    })
    .catch(error => console.error('Ошибка при загрузке шапки:', error));
});

function initHeader() {
  // Обработчик для кнопки меню (гамбургер)
  const menuBtn = document.getElementById("menu-btn");
  const sidebar = document.getElementById("sidebar");
  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      sidebar.classList.toggle("active");
    });
  }
  // Обработчик для кнопки закрытия бокового меню
  const closeMenuBtn = document.querySelector("#sidebar .close-menu");
  if (closeMenuBtn && sidebar) {
    closeMenuBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      sidebar.classList.remove("active");
    });
  }
  // Закрытие бокового меню при клике вне его области
  document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('menu-btn');
    if (sidebar && !sidebar.contains(event.target) && menuBtn && !menuBtn.contains(event.target)) {
      sidebar.classList.remove('active');
    }
  });
}
