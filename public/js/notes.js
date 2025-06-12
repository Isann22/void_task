function loadNote(id, title, content, pinned) {
    $('#editNoteId').val(id);
    $('#editTitle').val(title);
    $('#editContent').val(content);
    $('#editPinned').prop('checked', pinned);


    $('#editNoteForm').attr('action', `/notes/update/${id}`);


    $('#editNoteModal').modal('show');
}


function setDeleteIdNotes(id) {
    $('#deleteForm').attr('action', `/notes/deletes/${id}`);
    $('#deleteModal').modal('show');
}