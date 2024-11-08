const { body } = require('express-validator');
import prisma from '../db/prismaClient.js';

const validateCreateUser = [
    body('email').trim()
    .notEmpty()
    .isEmail()
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
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
]
