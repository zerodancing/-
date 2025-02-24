// public/js/chat.js

document.addEventListener("DOMContentLoaded", function() {
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");
    const chatWindow = document.querySelector(".chat-window");
    
    const suggestionsContainer = document.createElement("div");
    suggestionsContainer.className = "chat-suggestions";
    chatWindow.parentElement.insertBefore(suggestionsContainer, chatForm);
  
    const suggestions = [
      "Как работает сайт?",
      "Расскажи о команде.",
      "Какие акции действуют?",
      "Как оформить заказ?",
      "Какие цены на товары?",
      "Где найти поддержку?",
      "Продай мне абрикос",
      "Слушать лекцию про абрикосы (10 часов)",
      "Привет!",
      "Пока!",
      "Спасибо!"
    ];
    renderSuggestions(suggestions);
  
    chatForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (message === "") return;
      appendMessage("user", message);
      chatInput.value = "";
      getBotResponse(message);
    });
  
    function appendMessage(sender, message) {
      const messageElem = document.createElement("div");
      messageElem.classList.add("chat-message", sender);
      messageElem.innerHTML = message;
      chatWindow.appendChild(messageElem);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  
    function appendImageMessage(imageSrc, altText, description) {
      const messageElem = document.createElement("div");
      messageElem.classList.add("chat-message", "bot");
  
      const image = document.createElement("img");
      image.src = imageSrc;
      image.alt = altText;
      image.style.maxWidth = "100%";
      image.style.borderRadius = "10px";
      image.style.marginBottom = "10px";
  
      const textElem = document.createElement("p");
      textElem.innerHTML = description;
  
      messageElem.appendChild(image);
      messageElem.appendChild(textElem);
      chatWindow.appendChild(messageElem);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  
    function appendAudioMessage(audioSrc, description) {
      const messageElem = document.createElement("div");
      messageElem.classList.add("chat-message", "bot");
  
      const textElem = document.createElement("p");
      textElem.innerHTML = description;
  
      const audioElem = document.createElement("audio");
      audioElem.controls = true;
      audioElem.style.width = "100%";
  
      const sourceElem = document.createElement("source");
      sourceElem.src = audioSrc;
      sourceElem.type = "audio/mpeg";
  
      audioElem.appendChild(sourceElem);
      messageElem.appendChild(textElem);
      messageElem.appendChild(audioElem);
      chatWindow.appendChild(messageElem);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  
    function getBotResponse(userMessage) {
      const lowerMsg = userMessage.toLowerCase();
      const responseMap = [
        {
          keywords: ["как работает", "принцип работы", "функционирует"],
          response: "Наш сайт использует современные технологии для динамической загрузки данных и быстрой реакции на ваши запросы."
        },
        {
          keywords: ["новости", "новое"],
          response: "Мы постоянно обновляем ассортимент и проводим акции. Следите за новостями на главной странице!"
        },
        {
          keywords: ["команда", "о нас", "работает"],
          response: "Наша команда из 4 человек: Александр Трубин – разработка ТЗ и сайта, Почикаев Костя – разработчик, Шаталов Данил – дизайнер макета, и Эшматова Фарахноз – презентация сайта."
        },
        {
          keywords: ["цена", "товары", "стоимость"],
          response: "Цены на наши товары всегда конкурентоспособны – вы можете ознакомиться с ними в описании каждого продукта."
        },
        {
          keywords: ["оформить заказ", "заказ"],
          response: "Как оформить заказ? Подойдите к Александру и дайте ему деньги за заказ."
        },
        {
          keywords: ["поддержка", "помощь"],
          response: "Где найти поддержку? Звоните по телефону доверия – наш отдел поддержки всегда готов помочь."
        },
        {
          keywords: ["привет", "здравствуйте"],
          response: "Привет! Чем могу помочь сегодня?"
        },
        {
          keywords: ["спасибо", "благодарю"],
          response: "Пожалуйста! Обращайтесь, если возникнут ещё вопросы."
        },
        {
          keywords: ["пока", "до свидания"],
          response: "До свидания! Будем рады видеть вас снова."
        },
        {
          keywords: ["продай мне абрикос"],
          response: () => {
            appendImageMessage(
              "images/a.png",
              "Сочный абрикос",
              `<p>Внимание! Представляем вашему вниманию самый сочный, яркий и восхитительный абрикос, который вы когда-либо видели! Этот <strong>абрикос</strong> – не просто фрукт, а настоящее <strong>чудо природы</strong>! Он настолько сочный, что один его укус наполняет рот <strong>взрывом вкуса</strong>, заставляя вас забыть о проблемах и заботах!</p>
               <p>Этот абрикос настолько <strong>вкусный</strong>, что учёные до сих пор спорят: <strong>фрукт это или райский дар?</strong> 😍</p>
               <p>Берите абрикос прямо сейчас, пока его не разобрали! <strong>Всего 9999 рублей и он ваш!</strong> 🤭</p>`
            );
          }
        },
        {
          keywords: ["слушать лекцию про абрикосы", "абрикосы 10 часов", "лекция про абрикосы"],
          response: () => {
            appendAudioMessage(
              "images/lecture.mp3",
              `<p>🎙 <strong>Готовьтесь к погружению в мир абрикосов!</strong> 10 часов увлекательного рассказа о самом солнечном фрукте на свете.</p>
               <p><strong>История, биология, мифы и легенды, полезные свойства и кулинарные хитрости!</strong> Всё это – в нашем эксклюзивном подкасте.</p>
               <p><strong>Прислушайтесь к голосу природы!</strong> 🍑🎧</p>`
            );
          }
        }
      ];
  
      for (let mapping of responseMap) {
        for (let keyword of mapping.keywords) {
          if (lowerMsg.includes(keyword)) {
            if (typeof mapping.response === "function") {
              setTimeout(() => {
                mapping.response();
              }, 1000);
            } else {
              setTimeout(() => {
                appendMessage("bot", mapping.response);
              }, 1000);
            }
            return;
          }
        }
      }
  
      const defaultResponses = [
        "Интересно, попробуйте переформулировать вопрос.",
        "Я пока не знаю ответа, но учусь отвечать!",
        "Хм, чего-то я не понимаю... Попробуйте спросить по-другому.",
        "Извините, у меня нет информации по этому запросу.",
        "Давайте попробуем ещё раз."
      ];
      const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      setTimeout(() => {
        appendMessage("bot", randomResponse);
      }, 1000);
    }
  
    function renderSuggestions(suggestions) {
      suggestionsContainer.innerHTML = "";
      suggestions.forEach(text => {
        const btn = document.createElement("button");
        btn.className = "suggestion-btn";
        btn.textContent = text;
        btn.addEventListener("click", () => {
          chatInput.value = text;
          chatForm.dispatchEvent(new Event("submit", { cancelable: true }));
        });
        suggestionsContainer.appendChild(btn);
      });
    }
  });
  
