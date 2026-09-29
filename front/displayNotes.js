
const notesContainer = document.getElementById("notesContainer");
const prevButton = document.getElementById("prevNotes");
const nextButton = document.getElementById("nextNotes");

// Retrieve saved notes, newest first
const notes = JSON.parse(
    localStorage.getItem("myNotes") || "[]"
).reverse();
let filteredNotes = [...notes];
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("site-search");
const filterToggle = document.getElementById("toggleFilters");
const filtersBox = document.getElementById("notesFilters");

filterToggle.addEventListener("click", function() {
    const isOpening = filtersBox.hidden;

    // Show or hide the filter box
    filtersBox.hidden = !isOpening;

    // Update button accessibility
    filterToggle.setAttribute(
        "aria-expanded",
        String(isOpening)
    );
});
// Search through all saved notes
function searchNotes(query) {
    const searchTerm = query.trim().toLowerCase();

    return notes.filter(function(note) {

        const searchableText = [
            note.title,
            note.type,
            note.category,
            note.source,
            note.content,
            note.reflection,
            note.tags
        ].join(" ").toLowerCase();

        return searchableText.includes(searchTerm);
    });
}

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

    // Display notes from the filtered array
    const visibleNotes = filteredNotes.slice(start, end);

    visibleNotes.forEach(function(note, index) {
        const originalIndex = notes.findIndex(
            item => item.id === note.id
        );

        const card = createNoteCard(note, originalIndex);
        notesContainer.appendChild(card);
    });

    // No notes have been created yet
    if (notes.length === 0) {
        notesContainer.appendChild(
            createText(
                "p",
                "emptyNotes",
                "No notes yet. Create your first note!"
            )
        );
    }

    // Notes exist, but none match the search
    else if (filteredNotes.length === 0) {
        notesContainer.appendChild(
            createText(
                "p",
                "emptyNotes",
                "No matching notes found. Try another keyword."
            )
        );
    }

    // Update carousel arrows
    prevButton.disabled = currentPage === 0;
    nextButton.disabled = end >= filteredNotes.length;
}

// Navigate to newer notes
// Previous three notes
prevButton.addEventListener("click", function() {
    if (currentPage > 0) {
        currentPage--;
        displayNotes();
    }
});

// Next three matching notes
nextButton.addEventListener("click", function() {
    if ((currentPage + 1) * notesPerPage < filteredNotes.length) {
        currentPage++;
        displayNotes();
    }
});

searchForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const query = searchInput.value;

    // Update the filtered notes
    filteredNotes = searchNotes(query);

    // Return to the first page of search results
    currentPage = 0;

    // Display the matching note cards
    displayNotes();
});
// Display notes when the page opens
displayNotes();