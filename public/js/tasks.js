$(document).ready(function() {

    initFilters();

    function initFilters() {
        $('.filter-select').change(function() {
            applyFilters();
        });

        $('#resetFilters').click(function() {
            $('#priorityFilter, #statusFilter').val('');
            applyFilters();
            window.history.pushState({}, '', '/tasks');
        });


        const urlParams = new URLSearchParams(window.location.search);
        const priority = urlParams.get('priority');
        const status = urlParams.get('status');

        if (priority) $('#priorityFilter').val(priority);
        if (status) $('#statusFilter').val(status);

        applyFilters();
    }

    function applyFilters() {
        const priority = $('#priorityFilter').val();
        const status = $('#statusFilter').val();

        const queryParams = new URLSearchParams();
        if (priority) queryParams.set('priority', priority);
        if (status) queryParams.set('status', status);
        if (priority || status) {  // Hanya update URL jika ada filter yang dipilih
            window.history.pushState({}, '', '/tasks?' + queryParams.toString());
        }
        $('.task-card').each(function() {
            const cardPriority = $(this).data('priority');
            const cardStatus = $(this).data('status');

            const priorityMatch = !priority || cardPriority === priority;
            const statusMatch = !status || cardStatus === status;

            $(this).toggle(priorityMatch && statusMatch);
        });


        const visibleTasks = $('.task-card:visible').length;
        if (visibleTasks === 0) {
            $('#noResults').removeClass('d-none');
        } else {
            $('#noResults').addClass('d-none');
        }
    }

    $(document).on('click', '.change-status', function() {
        const taskId = $(this).data('id');
        const newStatus = $(this).data('status');

        $.ajax({
            url: `/tasks/${taskId}/status`,
            type: 'PATCH',
            data: {status: newStatus},
            success: function (response) {
                const taskCard = $(`[data-id="${taskId}"]`).closest('.task-card');
                taskCard.attr('data-status', newStatus);

                const statusText = getStatusText(newStatus);
                const statusClass = getStatusClass(newStatus);
                taskCard.find('.status-badge').removeClass('badge-secondary badge-info badge-success')
                    .addClass(statusClass).text(statusText);

                $('.dropdown-menu').removeClass('show');
            },
            error: function (xhr) {
                alert('Gagal mengubah status: ' + xhr.responseJSON?.error);
            }
        })
    })
})


function loadTask(id, title, description, priority, dueDate) {
    $('#editTaskId').val(id);
    $('#editTitle').val(title);
    $('#editDescription').val(description);
    $('#editPriority').val(priority);
    $('#editDueDate').val(dueDate);

    // Set form action
    $('#editTaskForm').attr('action', `/tasks/update/${id}`);

    // Show modal
    $('#editTaskModal').modal('show');
}

// Function to set delete ID and show confirmation modal
function setDeleteId(id) {
    $('#deleteTaskId').val(id);
    $('#deleteTaskForm').attr('action', `/tasks/delete/${id}`);
    $('#deleteTaskModal').modal('show');
}
