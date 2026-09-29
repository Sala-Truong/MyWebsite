
const notesContainer = document.getElementById("notesContainer");
const prevButton = document.getElementById("prevNotes");
const nextButton = document.getElementById("nextNotes");

// Retrieve saved notes, newest first
const notes = JSON.parse(
    localStorage.getItem("myNotes") || "[]"
).reverse();

const notesPerPage = 3;
let currentPage = 0;

// Create a text element with a CSS class
function createText(tag, className, value) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = value;
    return element;
}

// Shorten long content for the card preview
function getPreview(text, maxLength = 110) {
    const value = String(text || "").trim();

    if (value.length <= maxLength) {
        return value;
    }

    return value.slice(0, maxLength).trimEnd() + "...";
}

// Format yyyy-mm-dd as dd.mm.yyyy
function formatDate(date) {
    if (!date) return "";

    const parts = date.split("-");

    if (parts.length !== 3) return date;

    return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

// Create a card for one note
function createNoteCard(note, index) {
    const card = document.createElement("div");
    card.className = "notesBox";

    // Note number and date
    const info = document.createElement("div");
    info.className = "noteInfo";

    const number = createText(
        "span",
        "number",
        "#" + String(notes.length - index).padStart(2, "0")
    );

    const date = createText(
        "span",
        "date",
        formatDate(note.date)
    );

    info.append(number, date);
    card.appendChild(info);

    // Title
    card.appendChild(
        createText("span", "cardTitle", note.title || "Untitled")
    );

    // Content preview
    card.appendChild(
        createText("span", "cardSubTitle", "Content")
    );

    card.appendChild(
        createText("p", "description", getPreview(note.content))
    );

    // Reflection preview
    card.appendChild(
        createText("span", "cardSubTitle", "Reflection")
    );

    card.appendChild(
        createText("p", "description", getPreview(note.reflection))
    );

    // Tags
    const tagsContainer = document.createElement("div");
    tagsContainer.className = "cardTags";

    const tags = (note.tags || "")
        .split(/[,\s]+/)
        .filter(Boolean);

    tags.forEach(function(tag) {
        tagsContainer.appendChild(
            createText("span", "tag", tag)
        );
    });

    card.appendChild(tagsContainer);
    const moreLink = document.createElement("a");

moreLink.className = "more";
moreLink.href =
    "fullNoteCard.html?id=" + encodeURIComponent(note.id);

moreLink.textContent = "more >>";

card.appendChild(moreLink);
    return card;
}

// Display three notes for the current page
function displayNotes() {
    notesContainer.replaceChildren();

    const start = currentPage * notesPerPage;
    const end = start + notesPerPage;

    const visibleNotes = notes.slice(start, end);

    visibleNotes.forEach(function(note, index) {
        const card = createNoteCard(note, start + index);
        notesContainer.appendChild(card);
    });

    if (notes.length === 0) {
        notesContainer.appendChild(
            createText("p", "emptyNotes", "No notes yet. Create your first note!")
        );
    }

    // Enable or disable navigation arrows
    prevButton.disabled = currentPage === 0;
    nextButton.disabled = end >= notes.length;
}

// Navigate to newer notes
prevButton.addEventListener("click", function() {
    if (currentPage > 0) {
        currentPage--;
        displayNotes();
    }
});

// Navigate to older notes
nextButton.addEventListener("click", function() {
    if ((currentPage + 1) * notesPerPage < notes.length) {
        currentPage++;
        displayNotes();
    }
});

// Display notes when the page opens
displayNotes();