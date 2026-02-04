// Здесь происходит инициализация state из localStorage прямо в глобальной области.
// Лучше вынести работу с хранилищем в отдельные функции (`loadContacts`, `saveContacts`), чтобы не смешивать state и инфраструктуру.
let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

// Здесь получается магическая строка, название переменной не говорит само за себя.
// Лучше оформить как константу с более говорящим именем (`ALPHABET`) или генерировать динамически при необходимости.
const lettersStr = "abcdefghijklmnopqrstuvwxyz";

// Рекомендуется использовать `const`, так как ссылка на DOM-элемент не переопределяется. То же самое касается переменных от сюда до 13 строки.
let buttonSearch = document.getElementById("buttonSearch");
let buttonAdd = document.getElementById("buttonAdd");
let buttonClear = document.getElementById("buttonClear");
let lettersHtml = document.getElementById("lettersHTML");

// Обработчик клика содержит и бизнес-логику, и UI-логику.
// Лучше вынести создание контакта и обновление интерфейса в отдельные функции.
buttonSearch.addEventListener("click", pageSearching);

buttonAdd.addEventListener("click", () => {
  let name = document.getElementById("name").value;
  let job = document.getElementById("job").value;
  let number = document.getElementById("number").value;

  // UI обновляется вручную после изменения данных.
  // Лучше придерживаться одного правила - state изменился -> один render(), а не дергать рендер из разных мест.
  addContact(name, job, number);
  letterHTML();
});

buttonClear.addEventListener("click", () => {
  contacts = [];
  localStorage.removeItem("contacts");
  letterHTML();
});

// Хорошо, что есть отдельная функция для добавления контакта.
// Можно улучшить, возвращая результат (true/false) вместо побочных эффектов.
function addContact(name, job, number) {
  // Хороший пример early return, это делает код читаемым и понятным.
  if (!detectName(name) || !detectJob(job) || !detectNumber(number)) return;

  contacts.push({ id: Date.now(), name, job, number });
  saveCash();
}

// Опечатка в названии функции (`deletContact`).
// Имена функций это часть API, такие ошибки усложняют поддержку кода.
function deletContact(id) {
  contacts = contacts.filter((c) => c.id !== id);
  saveCash();
}

// Валидация реализована, это плюс.
// Но функции валидации не должны показывать `alert`, лучше возвращать ошибку и обрабатывать ее.
function detectName(name) {
  if (/\d/g.test(name) || name.replace(/[^a-zа-яё]/gi, "").length < 3) {
    // Лучше все же не alert, а красное сообщение под input'ом, например.
    alert("Неверное имя");
    return false;
  }
  return true;
}

// Эти валидации в интерфейсе никак не отображаются - это плохо, UX будет не супер.
function detectJob(job) {
  if (/\d/g.test(job) || job.replace(/[^a-zа-яё]/gi, "").length < 3) {
    console.log("Неверная профессия");
    return false;
  }
  return true;
}

function detectNumber(number) {
  if (!Number(number) || number.length < 5) {
    console.log("Неверный номер");
    return false;
  }
  return true;
}

// Название функции вводит в заблуждение.
// Вероятно, имелось в виду `saveCache` или `saveContacts`. Но хорошо, что ты вынес эту логику в отдельную функцию.
function saveCash() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

// Тут та же история с названием, лучше было бы, например, `groupContactsByLetter`.
function groupOfArr() {
  const letters = {};
  for (const l of lettersStr) letters[l] = [];

  // Предполагается, что у каждого контакта есть `name` и минимум один символ.
  // Стоит добавить защиту от некорректных данных.
  contacts.forEach((c) => {
    let firstLetter = c.name[0].toLowerCase();
    if (letters[firstLetter]) letters[firstLetter].push(c);
  });
  return letters;
}
function letterHTML() {
  lettersHtml.innerHTML = "";
  const grouped = groupOfArr();

  Object.entries(grouped).forEach(([letter, arr]) => {
    const letterBlock = document.createElement("div");
    letterBlock.className = "letter-block";
    letterBlock.textContent = letter.toUpperCase() + " (" + arr.length + ")";

    const contactsContainer = document.createElement("div");
    contactsContainer.className = "contacts-container";

    // Внутри обработчика клика происходит рендер элементов.
    // Это усложняет контроль UI.
    // Лучше отделить логику переключения и рендер друг от друга, вынести в отдельные функции.
    letterBlock.addEventListener("click", () => {
      contactsContainer.style.display =
        contactsContainer.style.display === "block" ? "none" : "block";
      // Как раз тут тебе приходится очищать вручную, это говорит о том, что не хватает централизованного render-подхода.
      contactsContainer.innerHTML = "";

      arr.forEach((c) => {
        const contactDiv = document.createElement("div");
        contactDiv.className = "contact-item";
        contactDiv.textContent = `${c.name} — ${c.job} — ${c.number}`;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Del";
        // Вложенные обработчики + мутация state + повторный рендер.
        // Это работает, но плохо масштабируется и сложно отлаживается.
        deleteBtn.addEventListener("click", () => {
          deletContact(c.id);
          letterHTML();
        });

        contactDiv.appendChild(deleteBtn);
        contactsContainer.appendChild(contactDiv);
      });
    });

    lettersHtml.appendChild(letterBlock);
    lettersHtml.appendChild(contactsContainer);
  });
}

// Хорошо, что поиск вынесен в отдельную функцию.
// Можно дополнительно обработать пустую строку и ранний выход из функции.
function searchContact(word) {
  // Конечно так переменные лучше не называть никогда, по все тем же причинам.
  const a = word.toLowerCase().trim();
  return contacts.filter((contact) => {
    return contact.name.toLowerCase().includes(a);
  });
}
function pageSearching() {
  // Тут опечатка в названии (`overplay`). Важно перепроверять такие моменты.
  const overplay = document.createElement("div");
  overplay.className = "search-overplay";

  const modal = document.createElement("div");
  modal.className = "search-modal";

  const closeBtn = document.createElement("span");
  closeBtn.textContent = "✖";
  closeBtn.className = "close-btn";
  closeBtn.onclick = () => overplay.remove();

  const input = document.createElement("input");
  input.placeholder = "введите имя";

  const btn = document.createElement("button");
  btn.placeholder = "найти";

  const resultDiv = document.createElement("div");

  btn.onclick = () => {
    const result = searchContact(input.value);
    renderResult(result, resultDiv);
  };

  modal.append(closeBtn, input, btn, resultDiv);
  overplay.appendChild(modal);
  document.body.appendChild(overplay);
}

// Хорошая идея вынести рендер в отдельную функцию.
// Следующий шаг - это сделать единый render-пайплайн для всего приложения.
function renderResult(value, box) {
  box.innerHTML = "";

  value.forEach((contact) => {
    const div = document.createElement("div");
    div.className = "contact-item";
    div.textContent = `${contact.name} — ${contact.job} — ${contact.number}`;

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";

    delBtn.onclick = () => {
      deletContact(contact.id);
      letterHTML();
      div.remove();
    };

    div.appendChild(delBtn);
    box.appendChild(div);
  });
}

// Явный стартовый рендер — хорошо.
// В идеале приложение должно иметь одну точку входа (`init()`).
letterHTML();

// Код рабочий и решает задачу, но архитектурно тяжело масштабируется.
// Основные точки роста:
// - разделение состояния, логики и UI.
// - единый render, так как сейчас он почти везде есть.
// - чистые функции без побочных эффектов.
// Для первого проекта - хороший прогресс, но дальше важно учиться писать поддерживаемый код, не просто рабочий.
