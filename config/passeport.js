import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import db from "../models/index.js";

export const configPassport = (passport) => {
  // Configuration JWT
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([
      (req) => {
        return req.cookies?.token || null;
      },
      ExtractJwt.fromAuthHeaderAsBearerToken(),
    ]),
    secretOrKey: process.env.JWT_SECRET,
    ignoreExpiration: false,
    algorithms: ["HS256"],
  };

  passport.use(
    new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
      try {
        const user = await db.User.findByPk(jwtPayload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    })
  );
};
