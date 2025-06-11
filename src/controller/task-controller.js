import {prisma} from "../config/prisma.js";

const getAllTasks = async (req, res) => {
    try {
        const { priority, status } = req.query;

        const whereClause = {
            userId: req.user.id
        };

        if (priority) {
            whereClause.priority = priority;
        }

        if (status) {
            whereClause.status = status;
        }

        const tasks = await prisma.task.findMany({
            where: whereClause,
            orderBy: [
                { dueDate: 'asc' },
                { priority: 'desc' }
            ]
        });

        const priorities = await prisma.task.groupBy({
            by: ['priority'],
            where: {
                userId: req.user.id
            },
            _count: {
                priority: true
            }
        });

        res.render('pages/tasks/index', {
            tasks,
            priorities,
            currentPriority: priority,
            currentStatus: status,
            title: 'Task Management',
            layout: './layouts/app-layout',
            getStatusClass: (status) => {
                switch(status) {
                    case 'todo': return 'badge-secondary';
                    case 'in_progress': return 'badge-info';
                    case 'done': return 'badge-success';
                    default: return 'badge-secondary';
                }
            },
            getStatusText: (status) => {
                switch(status) {
                    case 'todo': return 'Belum Dimulai';
                    case 'in_progress': return 'Dalam Proses';
                    case 'done': return 'Selesai';
                    default: return status;
                }
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.redirect('/dashboard');
    }
};

const createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, status } = req.body;

        await prisma.task.create({
            data: {
                title,
                description,
                dueDate: dueDate ? new Date(dueDate) : null,
                priority,
                status,
                userId: req.user.id
            }
        });

        req.flash('success', 'Berhasil membuat tugas');
        res.redirect('/tasks');
    } catch (error) {
        req.flash('error', 'Failed to create task');
        res.redirect('/tasks');
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, dueDate, priority, status } = req.body;

        await prisma.task.update({
            where: { id },
            data: {
                title,
                description,
                dueDate: dueDate ? new Date(dueDate) : null,
                priority,
                status
            }
        });

        req.flash('success', 'Berhasil update task');
        res.redirect('/tasks');
    } catch (error) {
        req.flash('error', 'Failed to update task');
        res.redirect('/tasks');
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.task.delete({
            where: { id }
        });

        req.flash('success', 'Berhasil hapus task');
        res.redirect('/tasks');
    } catch (error) {
        req.flash('error', 'Failed to delete task');
        res.redirect('/tasks');
    }
};

const getTaskPriorities = async (req, res) => {
    try {
        const priorities = await prisma.task.groupBy({
            by: ['priority'],
            where: {
                userId: req.user.id
            },
            _count: {
                priority: true
            }
        });

        res.render('partials/task-priority-filter', {
            priorities,
            currentPriority: req.query.priority,
            layout: false
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateTaskStatus = async (req, res) => {
    const {id} = req.params;
    const {status} = req.body;

    try {
        const task = await prisma.task.update({
            where: {id},
            data: {status}
        });

        res.json({
            ...task,
            statusText: getStatusText(task.status),
            statusClass: getStatusClass(task.status)
        });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

function getStatusText(status) {
    switch(status) {
        case 'todo': return 'Belum Dimulai';
        case 'in_progress': return 'Dalam Proses';
        case 'done': return 'Selesai';
        default: return status;
    }
}

function getStatusClass(status) {
    switch(status) {
        case 'todo': return 'badge-secondary';
        case 'in_progress': return 'badge-info';
        case 'done': return 'badge-success';
        default: return 'badge-secondary';
    }
}
export {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskPriorities,
    updateTaskStatus
};