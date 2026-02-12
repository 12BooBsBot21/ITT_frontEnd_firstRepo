const state = { 
    contacts : JSON.parse(localStorage.getItem("contacts")) || [],
}; // ввел state, перевел все функции на него вместо contacts
const lettersStr = "abcdefghijklmnopqrstuvwxyz";

const form = document.getElementById("form"); // добавил форм, и удалил buttonAdd
const buttonSearch = document.getElementById("buttonSearch");
const buttonClear = document.getElementById("buttonClear");
const contactsByLetter = document.getElementById("contactsByLetter"); // меняем и это как в HTML`=

buttonSearch.addEventListener("click", pageSearching);

form.addEventListener("submit", e => { //поменял прослушку с кнопки на form
    e.preventDefault();

    let name = document.getElementById("name").value;
    let job = document.getElementById("job").value;
    let number = document.getElementById("number").value;

    addContact(name, job, number);
});

buttonClear.addEventListener("click", () => {
    updateContacts([]);
});

function addContact(name, job, number) {
    if (!detectName(name) || !detectJob(job) || !detectNumber(number)) return;

    const newContacts = { id: Date.now(), name, job, number };
    updateContacts([...state.contacts, newContacts]);
};

function deliteContact(id) { ///
    updateContacts(state.contacts.filter(c => c.id !== id));
    
};

function detectName(name) {
    if (/\d/g.test(name) || name.replace(/[^a-zа-яё]/gi, "").length < 3) {
        setError("name", "неверное имя") ///
        return false;
    }
    return true;
};

function detectJob(job) {
    if (/\d/g.test(job) || job.replace(/[^a-zа-яё]/gi, "").length < 3) {
        setError("job", "неверное професия") ///
        return false;
    }
    return true;
};

function detectNumber(number) {
    if (!Number(number) || number.length < 5) {
        setError("number", "неверное номер ") ///
        return false;
    }
    return true;
};
function setError (input, message) {   // вывод ошибок не в консоль, не в алерт а красным текстом под инпут 
      const errorBlock = document.getElementById(`error-${input}`);
  errorBlock.textContent = message || "";
    if (message) {
    setTimeout(() => {
      errorBlock.textContent = "";
    }, 3000);
  }
}

function groupOfArr() {
    const letters = {};
    for (const l of lettersStr) letters[l] = [];

    state.contacts.forEach(c => {
        let firstLetter = c.name[0].toLowerCase();
        if (letters[firstLetter]) letters[firstLetter].push(c);
    });
    return letters;
};
function render() {  // перешел с letterHTML на нормальное название render
    contactsByLetter.innerHTML = ""; //
    const grouped = groupOfArr();

    Object.entries(grouped).forEach(([letter, arr]) => {
        const letterBlock = document.createElement("div");
        letterBlock.className = "letter-block";
        letterBlock.textContent = letter.toUpperCase() + " (" + arr.length + ")";

        const contactsContainer = document.createElement("div");
        contactsContainer.className = "contacts-container";

        letterBlock.addEventListener("click", () => {
            contactsContainer.style.display =
                contactsContainer.style.display === "block" ? "none" : "block";
            contactsContainer.innerHTML = "";

            arr.forEach(c => {
                const contactDiv = document.createElement("div");
                contactDiv.className = "contact-item";
                contactDiv.textContent = `${c.name} — ${c.job} — ${c.number}`;

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Del";
                deleteBtn.addEventListener("click", () => {
                    deletContact(c.id);
                    render();
                });

                contactDiv.appendChild(deleteBtn);
                contactsContainer.appendChild(contactDiv);
            });
        });

        contactsByLetter.appendChild(letterBlock); //
        contactsByLetter.appendChild(contactsContainer); // 
    });
};
function searchContact(word) {
    const a = word.toLowerCase().trim();
    return state.contacts.filter(contact => {
         return contact.name.toLowerCase().includes(a)
    });
};
function pageSearching() {
    const overplay = document.createElement("div")
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
    btn.textContent = "найти";

    const resultDiv = document.createElement("div");

    btn.onclick = () => {
        const result = searchContact(input.value);
        renderResult(result, resultDiv)
    };

    modal.append(closeBtn, input, btn, resultDiv);
    overplay.appendChild(modal);
    document.body.appendChild(overplay);
}; 
function renderResult(value, box) {
    box.innerHTML = ""; 

    value.forEach(contact => {
        const div = document.createElement("div");
        div.className = "contact-item";
        div.textContent = `${contact.name} — ${contact.job} — ${contact.number}`;

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";

        delBtn.onclick = () => {
            deletContact(contact.id);
            render(); 
            div.remove(); 
        };

        div.appendChild(delBtn);
        box.appendChild(div); 
    });
}
function updateContacts(newContacts) { // по поводу размазанных данных, во избежание этого решил сгруппировать все в одну фунцию
    state.contacts = newContacts;
    saveCash();
    render();
}
function saveCash() {
    localStorage.setItem("contacts", JSON.stringify(state.contacts));
};
render();