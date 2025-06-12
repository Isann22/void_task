function loadExpense(id, itemName, amount, category, date, pinned) {
    $('#editExpenseId').val(id);
    $('#editItemName').val(itemName);
    $('#editAmount').val(amount);
    $('#editCategory').val(category);
    $('#editDate').val(date);

    $('#editExpenseForm').attr('action', `/expenses/update/${id}`);

    $('#editExpenseModal').modal('show');
}

function setDeleteIdExpenses(id) {
    $('#deleteForm').attr('action', `/expenses/delete/${id}`);
    $('#deleteConfirmModal').modal('show');
}