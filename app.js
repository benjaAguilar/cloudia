import express from 'express';
import path from 'node:path';
import dotenv from 'dotenv';

import session from 'express-session';
import passport from 'passport';

import prisma from './db/prismaClient.js';
import indexRouter from './routes/indexRoute.js';

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

app.set("views", `${process.cwd()}/views`);
app.set('view engine', 'ejs');

app.use('/', indexRouter);

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
