const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
import prisma from '../db/prismaClient';

passport.use(
    new LocalStrategy(async (email, password, done) => {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    email: email
                }
            })
    
          if (!user) {
            return done(new Error());
          }
          
          const match = await bcrypt.compare(password, user.password);
    
          if(!match) return done(new Error);
    
          return done(null, user);
          
        } catch(err) {
          return done(err);
        }
      })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: id 
            }
        });
  
      done(null, user);
    } catch(err) {
      done(err);
    }
  });