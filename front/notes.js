
const noteForm = document.getElementById("noteForm");

// Check whether we're editing an existing note
const params = new URLSearchParams(window.location.search);
const editingId = params.get("id");

const savedNotes = JSON.parse(
    localStorage.getItem("myNotes") || "[]"
);

const editingNote = savedNotes.find(
    note => note.id === editingId
);

// Fill the form if we're editing
if (editingId && editingNote) {

    document.querySelector('[name="NoteTitle"]').value =
        editingNote.title || "";

    document.querySelector('[name="dateTakeNote"]').value =
        editingNote.date || "";

    document.querySelector('[name="noteCategory"]').value =
        editingNote.category || "";

    document.querySelector('[name="NoteSource"]').value =
        editingNote.source || "";

    document.querySelector('[name="NoteContent"]').value =
        editingNote.content || "";

    document.querySelector('[name="NoteReflection"]').value =
        editingNote.reflection || "";

    document.querySelector('[name="NoteTags"]').value =
        editingNote.tags || "";

    // Select the original note type
    const typeRadio = document.querySelector(
        `input[name="type"][value="${editingNote.type}"]`
    );

    if (typeRadio) {
        typeRadio.checked = true;
    }

    document.querySelector(".saveBtn").textContent =
        "SAVE CHANGES";
}

// Handle saving a note
noteForm.addEventListener("submit", function(event) {
    event.preventDefault();

    // Collect form data
    const title = document.querySelector('[name="NoteTitle"]').value;
    const date = document.querySelector('[name="dateTakeNote"]').value;
    const type = document.querySelector('input[name="type"]:checked').value;
    const category = document.querySelector('[name="noteCategory"]').value;
    const source = document.querySelector('[name="NoteSource"]').value;
    const content = document.querySelector('[name="NoteContent"]').value;
    const reflection = document.querySelector('[name="NoteReflection"]').value;
    const tags = document.querySelector('[name="NoteTags"]').value;

    // Retrieve the latest notes
    const notes = JSON.parse(
        localStorage.getItem("myNotes") || "[]"
    );

    if (editingId) {

        // Find the note being edited
        const index = notes.findIndex(
            note => note.id === editingId
        );

        if (index === -1) {
            alert("The note could not be found.");
            return;
        }

        // Update the existing note
        notes[index] = {
            ...notes[index],
            title: title,
            date: date,
            type: type,
            category: category,
            source: source,
            content: content,
            reflection: reflection,
            tags: tags,
            updatedAt: new Date().toISOString()
        };

    } else {

        // Create a new note
        const note = {
            id: crypto.randomUUID(),
            title: title,
            date: date,
            type: type,
            category: category,
            source: source,
            content: content,
            reflection: reflection,
            tags: tags,
            createdAt: new Date().toISOString()
        };

        notes.push(note);
    }

    // Save the updated notes
    localStorage.setItem(
        "myNotes",
        JSON.stringify(notes)
    );

    if (editingId) {
        alert("Your note has been updated!");

        window.location.href =
            "fullNoteCard.html?id=" +
            encodeURIComponent(editingId);
    } else {
        alert("Your note has been saved!");

        window.location.href = "notes.html";
    }
});