var LocalStrategy = require("passport-local").Strategy;
import bcrypt from "bcrypt";
import User from "../models/User";
import logger from "../logging/logger";

export default {
  initializePassport(passport) {
    passport.serializeUser(function (user, done) {
      done(null, user._id);
    });

    passport.deserializeUser(function (id, none) {
      User.findById(id, function (err, user) {
        done(err, user);
      });
    });

    passport.use(
      "login",
      new LocalStrategy(
        {
          passReqToCallback: true,
        },
        function (req, username, password, done) {
          User.findOne({ username: username }, (err, user) => {
            if (err) {
              // in case of any error, return using the done method
              console.log('Error with login:' + err);
              return done(err);
            }

            // username already exist
            if (user) {
              console.log("User already exist with username", +username);
              logger.verbose("User already exist with username", +username);
              return done(null, false);
            }

            // user exist but wrong password, log the error
            if (!isValidPassword(user, password)) {
              console.log("Invalid Password");
              logger.verbose("Invalid Password");
              return done(null, false); // redirect back to login page
            }

            // if user has not confirmed their email address yet, make sure to not log them in
            // if (user.emailConfirmationToken) {
            //     console.log('Email confirmation pending')
            //     logger.verbose('Email confirmation pending')
            // }

            // user and password both match, return user from done method
            return done(null, user);
          });
        }
      )
    );

    var isValidPassword = (user, password) => {
      return bcrypt.compareSync(password, user.password);
    };
  },

  isAuthenticated(req, res, done) {
    // passport adds the isAuthenticated function in req body when successfully authenticated, removes when session expired or user logs out
    if (req.isAuthenticated()) {
      done();
    } else {
      return res.status(401).send("only for logged in users");
    }
  },
};
