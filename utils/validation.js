import { body, query, check } from 'express-validator';

export const login = [
    body('username').notEmpty().withMessage('Email cannot be empty.'),
    body('password').notEmpty().withMessage('Password cannot be empty.')
]