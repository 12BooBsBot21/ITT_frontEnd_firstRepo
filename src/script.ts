interface Contact { // типизация контакта
    id : number
    name : string
    job : string
    number : string
};
interface State {
    contacts : Contact[]
    openLetter : string | null
    isSearchOpen : boolean
    searchQuery : string
}
const state : State = { 
    contacts : (JSON.parse(localStorage.getItem("contacts") || "[]") as Contact[]), // использовал as для того что бы убрать явное any
    openLetter : null, // state букв для разделения UI от остального 
    isSearchOpen : false, //state на поиск 
    searchQuery : "", // результат поиска для обнавления списка в поиске
}; 
const lettersStr = "abcdefghijklmnopqrstuvwxyz";

const form = document.getElementById("form"); // добавил форм, и удалил buttonAdd
const buttonSearch = document.getElementById("buttonSearch");
const buttonClear = document.getElementById("buttonClear");
const contactsByLetter = document.getElementById("contactsByLetter")!; // меняем и это как в HTML`=
if(buttonSearch){
    buttonSearch.addEventListener("click", toggleSearch);
};
if(form){
    form.addEventListener("submit", e => { // сохранил в переменных + добавил проверку
        e.preventDefault();
        const nameInput = document.getElementById("name")
        if(!(nameInput instanceof HTMLInputElement)) return 
        let name = nameInput.value;
        
        const jobInput = document.getElementById("job");
        if(!(jobInput instanceof HTMLInputElement)) return
        let job = jobInput.value;

        const numberInput = document.getElementById("number");
        if(!(numberInput instanceof HTMLInputElement)) return
        let number = numberInput.value;
        addContact(name, job, number);
    });
}
if(buttonClear){
    buttonClear.addEventListener("click", () => {
        updateContacts([]);
    });
};

function addContact(name : string, job : string, number : string) : void {
    if (!detectName(name) || !detectJob(job) || !detectNumber(number)) return;

    const newContacts = { id: Date.now(), name, job, number };
    updateContacts([...state.contacts, newContacts]);
};

function deleteContact(id : number) : void{ ///
    updateContacts(state.contacts.filter(c => c.id !== id));
};

function detectName(name : string) {
    if (/\d/g.test(name) || name.replace(/[^a-zа-яё]/gi, "").length < 3) {
        setError("name", "неверное имя") ///
        return false;
    }
    return true;
};

function detectJob(job : string) {
    if (/\d/g.test(job) || job.replace(/[^a-zа-яё]/gi, "").length < 3) {
        setError("job", "неверное професия") ///
        return false;
    }
    return true;
};

function detectNumber(number : string) {
    if (!Number(number) || number.length < 5) {
        setError("number", "неверное номер ") ///
        return false;
    }
    return true;
};
function setError (input : string, message : string) : void {   // вывод ошибок не в консоль, не в алерт а красным текстом под инпут 
      const errorBlock = document.getElementById(`error-${input}`);

    if(!errorBlock) return
        errorBlock.textContent = message || ""

            if (message) {
            setTimeout(() => {
            errorBlock.textContent = ""
            }, 3000);
        }
    
};

function groupContactsByLetter() : Record<string, Contact[]>  { // 
    const letters : Record<string, Contact[]>  = {}; // используем record
    for (const l of lettersStr) letters[l] = [];

    state.contacts.forEach(c => {
        if (!c.name || typeof c.name !== "string") return; 
        let firstLetter = c.name[0].toLowerCase();
        if (letters[firstLetter]) letters[firstLetter].push(c);
    });
    return letters;
};


function render() : void {
    renderAlphabet();
    manageSearchModal();
}


function renderAlphabet() : void { 

    contactsByLetter.innerHTML = "";

    const grouped = groupContactsByLetter();

    Object.entries(grouped).forEach(([letter, arr]) => {

        const letterBlock = document.createElement("div");
        letterBlock.className = "letter-block";
        letterBlock.textContent = letter.toUpperCase() + " (" + arr.length + ")";

        const contactsContainer = document.createElement("div");
        contactsContainer.className = "contacts-container";

        const isOpen = state.openLetter === letter;
        contactsContainer.style.display = isOpen ? "block" : "none";

        
        letterBlock.addEventListener("click", () => {
        state.openLetter =
            state.openLetter === letter ? null : letter;

        render();
        });

    
    if (isOpen) {
        renderContacstList(arr, contactsContainer)
    }

    contactsByLetter.appendChild(letterBlock);
    contactsByLetter.appendChild(contactsContainer);

  });
};


function renderContacstList (contactsArr : Contact[], container : HTMLElement) : void { //функция, наполняет див буквы контактами 
    container.innerHTML = "";

    contactsArr.forEach(contact => {
         const contactDiv = document.createElement("div");
        contactDiv.className = "contact-item";

        contactDiv.textContent =
          `имя:${contact.name} — професия:${contact.job} — телефон:${contact.number}`;

        
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", (e) => {
          e.stopPropagation(); 
          deleteContact(contact.id);
        });
        contactDiv.appendChild(deleteBtn);
        container.appendChild(contactDiv);
    })
};









// поиск логика 
function searchContact(word : string) {
    if(!word || word.trim() === "" ) return [];
    const a = word.toLowerCase().trim();
    return state.contacts.filter(contact => {
         return contact.name.toLowerCase().includes(a)
    });
};

function manageSearchModal() : void { // rjynhjkm ВЩЬ 
        const existingOverlay = document.querySelector(".search-overplay");

    if (state.isSearchOpen) {
        if (!existingOverlay) createSearchModal();

        const resultDiv = document.getElementById("searchResultBox");
        if(resultDiv) {
            const filtred = searchContact(state.searchQuery);
            renderContacstList(filtred, resultDiv);
        }
    } else {
        existingOverlay?.remove();  
    }
};


function toggleSearch() { // переключатель стейта 
    state.isSearchOpen = !state.isSearchOpen;

    if(!state.isSearchOpen) {
        state.searchQuery = ""
    };
    render()
};
function createSearchModal() {
    const overlay = document.createElement("div")
    overlay.className = "search-overplay";

    const modal = document.createElement("div");
    modal.className = "search-modal";

    const closeBtn = document.createElement("span");
    closeBtn.textContent = "✖";
    closeBtn.className = "close-btn";

    closeBtn.onclick = toggleSearch; ///

    const input = document.createElement("input");
    input.placeholder = "введите имя";
    input.value = state.searchQuery;
    
    const btn = document.createElement("button");
    btn.textContent = "найти";

    const resultDiv = document.createElement("div");
    resultDiv.id = "searchResultBox";

    btn.onclick = () => {
        state.searchQuery = input.value;
        render();
    };

    modal.append(closeBtn, input, btn, resultDiv);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}; 

function updateContacts(newContacts : Contact[]) : void { // по поводу размазанных данных, во избежание этого решил сгруппировать все в одну фунцию
    state.contacts = newContacts;
    saveCash();
    render();
};
function saveCash() : void {
    localStorage.setItem("contacts", JSON.stringify(state.contacts));
};
render();