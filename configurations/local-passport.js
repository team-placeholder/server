const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

module.exports = function({ User }) {
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },(email, password, done) => {
        User.findOne({ email }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: "Incorrect user." });
            }
            if (!user.authenticate(password)) {
                return done(null, false, { message: "Incorrect password." });
            }

            return done(null, user);
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
};