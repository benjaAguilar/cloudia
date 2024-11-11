import { body } from 'express-validator';
import prisma from '../db/prismaClient.js';

const validateCreateUser = [
    body('email').trim()
    .notEmpty().withMessage('Email is Required')
    .isEmail().withMessage('Email must be a valid email adress')
    .custom(async (value) => {
        const user = await prisma.user.findFirst({
            where: {
                email: value
            }
        });

        if (user) {
          return Promise.reject('User already exists');
        }
      }),
      body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
      body('r-password')
        .trim()
        .notEmpty().withMessage('Repeat password is required')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })

]

const validations = {
  validateCreateUser
}

export default validations;