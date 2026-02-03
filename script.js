let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
const lettersStr = "abcdefghijklmnopqrstuvwxyz";

let buttonAdd = document.getElementById("buttonAdd");
let buttonClear = document.getElementById("buttonClear");
let lettersHtml = document.getElementById("lettersHTML");

buttonAdd.addEventListener("click", () => {
    let name = document.getElementById("name").value;
    let job = document.getElementById("job").value;
    let number = document.getElementById("number").value;

    addContact(name, job, number);
    letterHTML();
});

buttonClear.addEventListener("click", () => {
    contacts = [];
    localStorage.removeItem("contacts");
    letterHTML();
});

function addContact(name, job, number) {
    if (!detectName(name) || !detectJob(job) || !detectNumber(number)) return;

    contacts.push({ id: Date.now(), name, job, number });
    saveCash();
}

function deletContact(id) {
    contacts = contacts.filter(c => c.id !== id);
    saveCash();
}

function detectName(name) {
    if (/\d/g.test(name) || name.replace(/[^a-zа-яё]/gi, "").length < 3) {
        alert("Неверное имя");
        return false;
    }
    return true;
}

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

function saveCash() {
    localStorage.setItem("contacts", JSON.stringify(contacts));
}
function groupOfArr() {
    const letters = {};
    for (const l of lettersStr) letters[l] = [];

    contacts.forEach(c => {
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


letterHTML();