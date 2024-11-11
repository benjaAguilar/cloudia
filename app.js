import express from 'express';
import path from 'node:path';
import dotenv from 'dotenv';

import session from 'express-session';
import pgSession from 'connect-pg-simple';
import passport from 'passport';

import prisma from './db/prismaClient.js';
import pkg from 'pg';
const { Pool } = pkg;
import indexRouter from './routes/indexRoute.js';
import './config/passport.js'

dotenv.config();

const app = express();

const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: new (pgSession(session))({
        pool: pgPool,
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    },
}));

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.isAuth = req.isAuthenticated();
    next();
  });

  app.use((req, res, next) => {
    console.log(res.locals.currentUser);
    console.log(res.locals.isAuth);
    next();
  });

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
