import {prisma} from "../config/prisma.js";
import bcrypt from "bcrypt";

const handleRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const errors = [];


        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ username }, { email }] }
        });

        if (existingUser) {
            if (existingUser.username === username) {
                errors.push({ field: 'username', message: 'Username sudah digunakan' });

            }
            if (existingUser.email === email) {
                errors.push({ field: 'email', message: 'Email sudah terdaftar' });
            }
        }

        if (errors.length > 0) {
            req.flash('errors', errors);
            req.flash('formData', req.body);
            return res.redirect('/register');
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                createdAt: new Date()
            }
        });


        req.flash('success', 'Registrasi berhasil! Silakan login');
        res.redirect('/login');

    } catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Terjadi kesalahan server');
        res.redirect('/register');
    }
};

const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const errors = [];

        if (!email || !password) {
            errors.push({ field: 'general', message: 'Email dan password wajib diisi' });
            req.flash('errors', errors);
            return res.redirect('/login');
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            errors.push({ field: 'email', message: 'Email atau password salah' });
            req.flash('errors', errors);
            req.flash('formData', { email });
            return res.redirect('/login');
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            errors.push({ field: 'password', message: 'email atau password salah' });
            req.flash('errors', errors);
            req.flash('formData', { email });
            return res.redirect('/login');
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        req.flash('success', 'Login successful!');
        return res.redirect('/dashboard');

    } catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'Terjadi kesalahan server');
        return res.redirect('auth/login');
    }
};


const handleLogout = (req,res)=>{
        req.session.destroy(err => {
            if (err) {
                console.error('Error saat logout:', err);
            }
            res.redirect('auth/login');
        });
}

export { handleRegister,handleLogin,handleLogout};