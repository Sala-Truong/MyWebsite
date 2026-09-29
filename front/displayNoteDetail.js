
const params = new URLSearchParams(window.location.search);
const noteId = params.get("id");

const notes = JSON.parse(
    localStorage.getItem("myNotes") || "[]"
);

// Find the note whose ID matches the URL
const note = notes.find(item => item.id === noteId);

function formatDate(date) {
    if (!date) return "";

    const parts = date.split("-");

    if (parts.length !== 3) return date;

    return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

function displayNoteDetail() {
    if (!note) {
        document.querySelector(".noteDetailPage").textContent =
            "Note not found. Please return to your Notes page.";
        return;
    }

    const noteIndex = notes.findIndex(
        item => item.id === noteId
    );

    document.getElementById("detailNumber").textContent =
        "#" + String(noteIndex + 1).padStart(2, "0");

    document.getElementById("detailTitle").textContent =
        note.title || "Untitled";

    document.getElementById("detailDate").textContent =
        formatDate(note.date);

    document.getElementById("detailSource").textContent =
        note.source || "No reference provided.";

    document.getElementById("detailContent").textContent =
        note.content || "";

    document.getElementById("detailReflection").textContent =
        note.reflection || "";

    // Display tags
    const tagsContainer = document.getElementById("detailTags");

    const tags = (note.tags || "")
        .split(/[,\s]+/)
        .filter(Boolean);

    tags.forEach(function (tag) {
        const tagElement = document.createElement("span");
        tagElement.className = "detailTag";
        tagElement.textContent =
            tag.startsWith("#") ? tag : "#" + tag;

        tagsContainer.appendChild(tagElement);
    });
}
document.getElementById("deleteNoteBtn")
    .addEventListener("click", function () {

        if (!note) return;

        const confirmed = confirm(
            "Are you sure you want to delete this note?"
        );

        if (!confirmed) return;

        // Keep every note except the selected note
        const updatedNotes = notes.filter(
            item => item.id !== noteId
        );

        // Update localStorage
        localStorage.setItem(
            "myNotes",
            JSON.stringify(updatedNotes)
        );

        // Return to the Notes page
        window.location.href = "notes.html";
    });

document.getElementById("editNoteBtn")
    .addEventListener("click", function () {

        if (!note) return;

        window.location.href =
            "newNotes.html?id=" + encodeURIComponent(note.id);
    });
displayNoteDetail();