// js/about.js

document.addEventListener("DOMContentLoaded", function() {
    renderAboutSection();
    document.addEventListener('languageChanged', function() {
      renderAboutSection();
    });
  });
  
  function renderAboutSection() {
    const aboutSection = document.getElementById("about-section");
    const title = LanguageManager.getTranslation("about", "title") || "О нас";
    const description = LanguageManager.getTranslation("about", "description") || "Над этим сайтом работает наша команда из 4 человек:";
    const teamTitle = LanguageManager.getTranslation("about", "teamTitle") || "Наша команда";
  
    // Определяем членов команды (ключи соответствуют переводам, если заданы)
    const members = [
      {
        key: "alexander",
        defaultName: "Александр Трубин",
        defaultRole: "Разработка ТЗ и сайта",
        defaultDesc: "Я отвечаю за техническое задание и разработку сайта.",
        img: "images/a.png"
      },
      {
        key: "kostya",
        defaultName: "Почикаев Костя",
        defaultRole: "Разработчик",
        defaultDesc: "Разрабатывает отдельные разделы сайта.",
        img: "images/a.png"
      },
      {
        key: "danil",
        defaultName: "Шаталов Данил",
        defaultRole: "Дизайнер макета",
        defaultDesc: "Создает макет сайта.",
        img: "images/a.png"
      },
      {
        key: "farah",
        defaultName: "Эшматова Фарахноз",
        defaultRole: "Презентатор",
        defaultDesc: "Готовит презентацию сайта.",
        img: "images/a.png"
      }
    ];
  
    let membersHTML = '<div class="team-grid">';
    members.forEach(member => {
      const name = LanguageManager.getTranslation("about", "members." + member.key + ".name") || member.defaultName;
      const role = LanguageManager.getTranslation("about", "members." + member.key + ".role") || member.defaultRole;
      const desc = LanguageManager.getTranslation("about", "members." + member.key + ".description") || member.defaultDesc;
      membersHTML += `
        <div class="team-member">
          <img src="${member.img}" alt="${name}">
          <h2>${name}</h2>
          <h3>${role}</h3>
          <p>${desc}</p>
        </div>
      `;
    });
    membersHTML += '</div>';
  
    aboutSection.innerHTML = `
      <h1>${title}</h1>
      <p class="description">${description}</p>
      <h2>${teamTitle}</h2>
      ${membersHTML}
    `;
  }
  
