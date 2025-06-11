import {prisma} from "../config/prisma.js";

const getAllNotes = async (req, res) => {
    try {
        const notes = await prisma.note.findMany({
            where: { userId: req.user.id },
            orderBy: [
                { isPinned: 'desc' },
                { updatedAt: 'desc' }
            ]
        });

        res.render('pages/notes/index', {
            notes,
            title: 'My Notes',
            layout: './layouts/app-layout'
        });
    } catch (error) {
        req.flash('error', 'Failed to fetch notes');
        res.redirect('/dashboard');
    }
};


const createNote = async (req, res) => {
    const { title, content, pinned } = req.body;
    const userId = req.user.id ; // Assuming user is stored in session

    try {


        await prisma.note.create({
            data: {
                title,
                content,
                isPinned: pinned === 'on',
                user: {
                    connect: { id:userId }
                }
            }
        });

        req.flash('success', 'Berhasil membuat note!');
        res.redirect('/notes');
    } catch (error) {
        console.error('Error:', error);
    }
};

const updateNote = async (req, res) => {
    try {
        const { id, title, content, pinned } = req.body;

        const updatedNote = await prisma.note.update({
            where: { id },
            data: {
                title,
                content,
                isPinned: pinned === 'on',
                updatedAt: new Date()
            }
        });

        req.flash('success', 'Berhasil update note!');
        res.redirect('/notes');
    } catch (error) {
        console.error('Error updating note:', error);
        req.flash('error', 'gagal');
        res.redirect('/notes');
    }
};

const deleteNote = async (req, res) => {
    try {
        await prisma.note.delete({
            where: { id: req.params.id }
        });

        req.flash('success', 'Berhasil hapus note!');
        res.redirect('/notes');
    } catch (error) {
        console.error('Error deleting note:', error);
        req.flash('error', 'gagal');
        res.redirect('/notes');
    }
};

export {
    getAllNotes
    ,createNote,
    deleteNote,
    updateNote
}