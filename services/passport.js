import * as dotenv from "dotenv";
dotenv.config()
import passport from "passport";
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import User from "../models/userModel.js";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, cb) {
    const user = await User.findOne({email:profile._json.email});
    if(!user){
      const newUser = new User({
        name: `${profile.name.givenName} ${profile.name.familyName}`,
        email: profile._json.email,
        profile: profile._json.picture,
        isVerified: profile._json.email_verified,
        googleID: profile.id
      })
      await newUser.save();
      return cb(null, newUser);
    } return cb(null, user);
  }
));

export function googleSessionMiddleware (req,res,next){
  if(req.session && !req.session.regenerate){
    req.session.regenerate = cb => {
      cb()
    }
  }
  if(req.session && !req.session.save){
    req.session.save = cb => {
      cb();
    }
  }
  next();
}

passport.serializeUser((user,done)=>{
  done(null.user)
})

passport.deserializeUser((user,done)=>{
  done(null,user)
})



