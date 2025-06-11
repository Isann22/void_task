function isOverdue(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}