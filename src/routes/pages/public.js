import express from 'express';

const pages = express.Router()

pages.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('pages/auth/register', { title: 'Register', layout: './layouts/guest-layout' ,
        errors: res.locals.errors,
        error: res.locals.error,
        formData: req.flash('formData')[0] || {}})
})

pages.get('/', (req, res) => {

    if (req.session.user) {
        return res.redirect('/dashboard');
    }

    res.render('pages/auth/login', { title: 'login', layout: './layouts/guest-layout' ,
        errors: res.locals.errors,
        error: res.locals.error,
        formData: req.flash('formData')[0] || {}})
})



export {pages}