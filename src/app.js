import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from 'express-session';
import flash from 'connect-flash';

import {errorMiddleware} from "./middleware/error-middleware.js";
import dotenv from "dotenv";
import {fileURLToPath} from 'url';
import path, {dirname} from 'path';
import {pages} from "./routes/pages/public.js";
import {userRouter} from "./routes/api/user-api.js";
import {auth} from "./routes/pages/pages.js";
import {chartRouter} from "./routes/api/chart-api.js";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(session({
    secret: 'rahasia',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 3600000
    }
}));


app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.errors = req.flash('errors');
    res.locals.formData = req.flash('formData')[0] || {};
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorMiddleware)

app.use(expressLayouts)
app.use(express.static(path.join(__dirname, '../public')));
app.use('/themes', express.static(path.join(__dirname, '../public/js')));
app.use('/themes', express.static(path.join(__dirname, '../public/themes')));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("Server started on port 3000");
});

app.use(pages)
app.use(userRouter)
app.use(auth)
app.use(chartRouter)