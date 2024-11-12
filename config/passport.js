import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import prisma from '../db/prismaClient.js';
import Errors from '../utils/customError.js';

passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    email: email
                }
            })
    
          if (!user) {
            return done(new Errors.loginError('The email is not registered', 400));
          }
          
          const match = await bcrypt.compare(password, user.password);
    
          if(!match) return done(new Errors.loginError('Incorrect password', 400));
    
          return done(null, user);
          
        } catch(err) {
          return done(err);
        }
      })
);

passport.serializeUser((user, done) => {
  console.log('serialize')
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      console.log('deserialize')
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

  export default passport;