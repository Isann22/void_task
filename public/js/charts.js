document.addEventListener('DOMContentLoaded', async function() {
    try {
        const [statusResponse, priorityResponse, deadlineResponse] = await Promise.all([
            fetch('/api/task-status'),
            fetch('/api/task-priority'),
            fetch('/api/tasks-deadline')
        ]);

        const statusData = await statusResponse.json();
        const priorityData = await priorityResponse.json();
        const deadlineData = await deadlineResponse.json();

        renderStatusChart(statusData);
        renderPriorityChart(priorityData);
        renderDeadlineChart(deadlineData);

    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
});

function renderStatusChart(data) {
    const ctx = document.getElementById('statusChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Belum Dimulai', 'Dalam Proses', 'Selesai'],
            datasets: [{
                data: [data.todo, data.in_progress, data.done],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(75, 192, 192, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function renderPriorityChart(data) {
    const ctx = document.getElementById('priorityChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Rendah', 'Sedang', 'Tinggi'],
            datasets: [{
                data: [data.low, data.medium, data.high],
                backgroundColor: [
                    'rgba(40, 167, 69, 0.7)',
                    'rgba(255, 193, 7, 0.7)',
                    'rgba(220, 53, 69, 0.7)'
                ],
                borderColor: [
                    'rgba(40, 167, 69, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(220, 53, 69, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function renderDeadlineChart(data) {
    const ctx = document.getElementById('deadlineChart').getContext('2d');

    // Format dates for display
    const labels = data.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Prioritas Tinggi',
                    data: data.map(item => item.high),
                    backgroundColor: 'rgba(220, 53, 69, 0.7)',
                    borderColor: 'rgba(220, 53, 69, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Prioritas Sedang',
                    data: data.map(item => item.medium),
                    backgroundColor: 'rgba(255, 193, 7, 0.7)',
                    borderColor: 'rgba(255, 193, 7, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Prioritas Rendah',
                    data: data.map(item => item.low),
                    backgroundColor: 'rgba(40, 167, 69, 0.7)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            return `Total: ${total}`;
                        }
                    }
                }
            }
        }
    });
}