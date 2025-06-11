import express from "express";
import {prisma} from "../../config/prisma.js";

const chartRouter = new express.Router()


chartRouter.get('/api/task-status', async (req, res) => {
    try {
        const result = await prisma.task.groupBy({
            by: ['status'],
            _count: {
                status: true
            }
        });

        const stats = {
            todo: result.find(s => s.status === 'todo')?._count.status || 0,
            in_progress: result.find(s => s.status === 'in_progress')?._count.status || 0,
            done: result.find(s => s.status === 'done')?._count.status || 0
        };

        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


chartRouter.get('/api/task-priority', async (req, res) => {
    try {
        const result = await prisma.task.groupBy({
            by: ['priority'],
            _count: {
                priority: true
            }
        });

        const stats = {
            low: result.find(s => s.priority === 'low')?._count.priority || 0,
            medium: result.find(s => s.priority === 'medium')?._count.priority || 0,
            high: result.find(s => s.priority === 'high')?._count.priority || 0
        };

        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

chartRouter.get('/api/tasks-deadline', async (req, res) => {
    try {
        const today = new Date();
        const threeDaysLater = new Date();
        threeDaysLater.setDate(today.getDate() + 3);

        const tasks = await prisma.task.findMany({
            where: {
                dueDate: {
                    gte: today,
                    lte: threeDaysLater
                },
                status: {
                    not: 'done'
                }
            },
            select: {
                dueDate: true,
                priority: true
            },
            orderBy: {
                dueDate: 'asc'
            }
        });

        // Group by day and priority
        const result = tasks.reduce((acc, task) => {
            const dateStr = task.dueDate.toISOString().split('T')[0];
            if (!acc[dateStr]) {
                acc[dateStr] = { low: 0, medium: 0, high: 0 };
            }
            acc[dateStr][task.priority]++;
            return acc;
        }, {});

        // Format for Chart.js
        const formatted = Object.entries(result).map(([date, priorities]) => ({
            date,
            ...priorities
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export {
    chartRouter
}