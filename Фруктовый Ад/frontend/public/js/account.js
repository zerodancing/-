// js/account.js
document.addEventListener("DOMContentLoaded", function(){
  renderAccountPage();
  document.addEventListener('languageChanged', function() {
    renderAccountPage();
  });
});

function renderAccountPage(){
  const accountSection = document.getElementById("account-section");
  let user = JSON.parse(localStorage.getItem("accountUser")) || null;
  if(user){
    renderAccountInfo(user);
  } else {
    renderLoginForm();
  }
}

function renderLoginForm(){
  const accountSection = document.getElementById("account-section");
  accountSection.innerHTML = `
    <h1>${LanguageManager.getTranslation('account', 'loginTitle')}</h1>
    <form class="account-form" id="login-form">
      <input type="text" id="username" placeholder="${LanguageManager.getTranslation('account', 'usernamePlaceholder')}" required />
      <input type="password" id="password" placeholder="${LanguageManager.getTranslation('account', 'passwordPlaceholder')}" required />
      <button type="submit">${LanguageManager.getTranslation('account', 'loginButton')}</button>
    </form>
  `;
  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", function(e){
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    if(username && password){
      const user = { username: username };
      localStorage.setItem("accountUser", JSON.stringify(user));
      renderAccountInfo(user);
    }
  });
}

function renderAccountInfo(user){
  const accountSection = document.getElementById("account-section");
  accountSection.innerHTML = `
    <h1>${LanguageManager.getTranslation('account', 'welcome', { username: user.username })}</h1>
    <div class="account-info">
      <p>Здесь вы можете просмотреть данные вашего аккаунта.</p>
      <button id="logout-btn">${LanguageManager.getTranslation('account', 'logoutButton')}</button>
    </div>
  `;
  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn.addEventListener("click", function(){
    localStorage.removeItem("accountUser");
    renderLoginForm();
  });
}
