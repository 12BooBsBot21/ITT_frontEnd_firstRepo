let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
const lettersStr = "abcdefghijklmnopqrstuvwxyz";
for (let i = 0; i < lettersStr.length; i++) {

}

detectList();

// ===== ELEMENTS =====
let buttonAdd = document.getElementById("buttonAdd");
let buttonDel = document.getElementById("buttonDel");
let buttonClear = document.getElementById("buttonClear");

// ===== EVENTS =====
buttonAdd.addEventListener("click", () => {
    let name = document.getElementById("name").value;
    let job = document.getElementById("job").value;
    let number = document.getElementById("number").value;

    addContact(name, job, number);
    groupOfArr(contacts);
    detectList();
    
});

buttonDel.addEventListener("click", () => {
    let delId = Number(document.getElementById("DelId").value);
    deletContact(delId);
    detectList();
    saveCash();
});

buttonClear.addEventListener("click", () => {
    contacts = [];
    localStorage.removeItem("contacts");
    detectList();
});


function addContact(name, job, number) {
    if (!detectName(name) || !detectJob(job)) return;

    let contact = {
        id: Date.now(),
        name,
        job,
        number
    };

    contacts.push(contact);
    saveCash();
}

function deletContact(id) {
    contacts = contacts.filter(c => c.id !== id);
}


function detectName(name) {
    if (/\d/g.test(name)) {
        console.log("в имени не может быть чисел");
        document.getElementById("name").value = "";
        return false;
    }

    if (name.replace(/[^a-zа-яё]/gi, "").length < 3) {
        console.log("менее 3 символов в имени");
        document.getElementById("name").value = "";
        return false;
    }

    return true;
}

function detectJob(job) {
    if (/\d/g.test(job)) {
        console.log("в профессии не может быть чисел");
        document.getElementById("job").value = "";
        return false;
    }

    if (job.replace(/[^a-zа-яё]/gi, "").length < 3) {
        console.log("менее 3 символов в профессии");
        document.getElementById("job").value = "";
        return false;
    }

    return true;
}


function detectList(list = contacts) {
    const container = document.getElementById("contacts");
    container.innerHTML = "";

    list.forEach(c => {
        const div = document.createElement("div");
        div.textContent = `${c.name} — ${c.job} — ${c.number}`;
        container.appendChild(div);
    });
};


function saveCash() {
    localStorage.setItem("contacts", JSON.stringify(contacts));
};
function groupOfArr(contacts) {
    const letters = {};
    makeObjLett (letters, lettersStr)
    contacts.forEach(contact => {
        let firstLetter = contact.name[0].toLowerCase();
        if (letters[firstLetter]) {
            letters[firstLetter].push(contact)
        }
    })
    console.log(letters)
    return letters
};
function makeObjLett (letters, lettersStr) {
    for (const letter of lettersStr) {
        letters[letter] = [];
    }
};