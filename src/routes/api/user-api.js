import express from 'express';
import {handleLogin, handleLogout, handleRegister} from "../../controller/user-controller.js";

const userRouter = new express.Router()

userRouter.post('/api/users/register',handleRegister)
userRouter.post('/api/users/login',handleLogin)
userRouter.post('/api/users/logout',handleLogout)

export {
    userRouter
}