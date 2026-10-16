import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { findUserByEmail, findUserById } from "../db/user.js";
import { verifyPassword } from "../lib/passwordUtils.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await findUserByEmail(email);

        const errMsg = "Invalid email or password.";

        if (!user) {
          return done(null, false, { message: errMsg });
        }

        const isMatch = await verifyPassword(password, user.password);

        if (!isMatch) {
          return done(null, false, { message: errMsg });
        }

        return done(null, {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
      algorithms: ["HS256"],
    },
    async (payload, done) => {
      try {
        const user = await findUserById(payload.sub);

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
