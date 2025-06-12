import express from 'express';
import {authMidleware} from "../../middleware/auth-midleware.js";
import {createNote, deleteNote, getAllNotes, updateNote} from "../../controller/notes-controller.js";
import {createTask, deleteTask, getAllTasks, updateTask, updateTaskStatus} from "../../controller/task-controller.js";
import {createExpense, deleteExpense, getAllExpenses, updateExpense} from "../../controller/expenses-controller.js";

const auth = express.Router()

auth.use(authMidleware)

auth.get('/dashboard',(req, res) => {
    res.render('pages/dashboard', { title: 'login', user: req.session.user , layout: './layouts/app-layout'})
})

//notes
auth.post('/notes/create',createNote)
auth.get('/notes',getAllNotes)
auth.post('/notes/deletes/:id',deleteNote)
auth.post('/notes/update/:id',updateNote)

//task
auth.get('/tasks',getAllTasks)
auth.post('/tasks/create',createTask)
auth.post('/tasks/update/:id',updateTask)
auth.post('/tasks/delete/:id',deleteTask)
auth.patch('/tasks/:id/status',updateTaskStatus);

//expenses
auth.get('/expenses',getAllExpenses)
auth.post('/expenses/create',createExpense)
auth.post('/expenses/delete/:id',deleteExpense)
auth.post('/expenses/update/:id',updateExpense)


export {auth}