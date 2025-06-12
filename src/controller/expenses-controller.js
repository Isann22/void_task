import {prisma} from "../config/prisma.js";
import moment from 'moment';

const getAllExpenses = async (req, res) => {
    try {
        const expenses = await prisma.expense.findMany({
            where: { userId: req.user.id },
            orderBy: { date: 'desc' }
        });

        const total = expenses.reduce((sum, item) => sum + item.amount, 0);

        res.render('pages/expenses/index', {
            expenses,
            total,
            title: 'Catatan Pengeluaran',
            layout: './layouts/app-layout',
            moment,
            categories: [
                { emoji: '🍔', name: 'Makan' },
                { emoji: '🚗', name: 'Transport' },
                { emoji: '🛒', name: 'Belanja' },
                { emoji: '💡', name: 'Listrik' },
                { emoji: '📱', name: 'Pulsa' }
            ]
        });
    } catch (error) {
        req.flash('error', 'Gagal memuat catatan pengeluaran');
        res.redirect('/dashboard');
    }
};


const createExpense = async (req, res) => {
    try {
        await prisma.expense.create({
            data: {
                itemName: req.body.itemName,
                amount: parseInt(req.body.amount),
                category: req.body.category,
                date: new Date(req.body.date),
                userId: req.user.id
            }
        });

        req.flash('success', 'Pengeluaran berhasil dicatat!');
        res.redirect('/expenses');
    } catch (error) {
        req.flash('error', 'Gagal mencatat pengeluaran');
        res.redirect('/expenses/add');
    }
};


const updateExpense = async (req, res) => {
    try {
        await prisma.expense.update({
            where: { id: req.params.id },
            data: {
                itemName: req.body.itemName,
                amount: parseInt(req.body.amount),
                category: req.body.category,
                date: new Date(req.body.date)
            }
        });

        req.flash('success', 'Pengeluaran berhasil diupdate!');
        res.redirect('/expenses');
    } catch (error) {
        req.flash('error', 'Gagal mengupdate pengeluaran');
        res.redirect(`/expenses/${req.params.id}/edit`);
    }
};

const deleteExpense = async (req, res) => {
    try {
        await prisma.expense.delete({
            where: { id: req.params.id }
        });

        req.flash('success', 'Pengeluaran berhasil dihapus');
        res.redirect('/expenses');
    } catch (error) {
        req.flash('error', 'Gagal menghapus pengeluaran');
        res.redirect('/expenses');
    }
};

export {
    getAllExpenses,
    createExpense,
    updateExpense,
    deleteExpense
};