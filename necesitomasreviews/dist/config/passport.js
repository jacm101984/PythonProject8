"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = __importDefault(require("../models/userModel"));
// Configure local strategy for username/password authentication
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        // Find the user by email
        const user = await userModel_1.default.findOne({ email });
        // If user doesn't exist or password doesn't match
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            return done(null, false, { message: 'Credenciales incorrectas' });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));
// JWT strategy for token verification
const jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'your-secret-key'
};
passport_1.default.use(new passport_jwt_1.Strategy(jwtOptions, async (payload, done) => {
    try {
        // Find the user by ID from JWT payload
        const user = await userModel_1.default.findById(payload.id);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    }
    catch (error) {
        return done(error, false);
    }
}));
// Serialize user for session
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
// Deserialize user from session
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await userModel_1.default.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
});
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map