import { validationResult } from "express-validator";
import validations from "../config/validator.js";
import bcrypt from 'bcryptjs';
import db from "../db/queries.js";

const postCreateUser = [
    validations.validateCreateUser,
    async (req, res, next) => {
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()){
            res.status(400).render('signup', {
                errors: validationErrors.array()
            });
            return;
        }

        const { email, password } = req.body;

        bcrypt.hash(password, 10, async (err, hashedPassword) => {
            if(err) {
                return next(new Error());
            }

            await db.createUser(email, hashedPassword);
            req.session.feedback = 'User created successfully!';
            
            res.redirect('/login');
        });
    }
]

async function postLogUser(req, res, next){
    
}

const userController = {
    postCreateUser,
    postLogUser
}

export default userController;