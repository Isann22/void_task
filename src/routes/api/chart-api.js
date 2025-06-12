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

chartRouter.get('/api/expenses-data', async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const startDate = new Date(`${currentYear}-01-01`);
        const endDate = new Date(`${currentYear}-12-31`);

        // Get monthly expenses data
        const monthlyData = await prisma.$queryRaw`
            SELECT 
                EXTRACT(MONTH FROM date) as month,
                COALESCE(SUM(amount), 0) as total
            FROM 
                Expense
            WHERE 
                date >= ${startDate} AND date <= ${endDate}
            GROUP BY 
                EXTRACT(MONTH FROM date)
            ORDER BY 
                month ASC
        `;

        // Get category expenses data
        const categoryData = await prisma.expense.groupBy({
            by: ['category'],
            where: {
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            _sum: {
                amount: true
            },
            orderBy: {
                _sum: {
                    amount: 'desc'
                }
            }
        });

        // Format response data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
        const monthlyChartData = Array(12).fill(0);

        monthlyData.forEach(item => {
            const monthIndex = Number(item.month) - 1;
            monthlyChartData[monthIndex] = Number(item.total);
        });

        const categoryResponse = categoryData.map(item => ({
            category: item.category,
            amount: Number(item._sum?.amount || 0)
        }));

        res.json({
            success: true,
            data: {
                monthlyExpenses: {
                    labels: months,
                    data: monthlyChartData
                },
                categoryExpenses: {
                    labels: categoryResponse.map(item => item.category),
                    data: categoryResponse.map(item => item.amount),
                    colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
                }
            }
        });

    } catch (err) {
        console.error('Error fetching expenses data:', err);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
export {
    chartRouter
}