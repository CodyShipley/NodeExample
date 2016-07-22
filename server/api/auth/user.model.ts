import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';


export interface IUserModel extends IUser, mongoose.Document {
    hashPassword(password: string, done: (err: any, key: string) => any);
    comparePassword(password: string, done: (err: any, isMatch: boolean) => any);
    createJWT(): string; //Returns the jsonwebtoken string
}

let userSchema = new mongoose.Schema({
    username: { type: String, sparse: true, lowercase: true, trim: true },
    salt: String,
    password: String,
    //This is saying the roles can only specifically be these two.
    role: { type: String, enum: ['Basic', "Admin"] },

    movies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
})

//Dont use fat arrows for outer functions, because it fucks with the keyword 'this'
userSchema.methods.hashPassword = function(password: string, done: Function) {
    this.salt = crypto.randomBytes(16).toString('hex');
    crypto.pbkdf2(password, this.salt, 1000, 32, (err, key) => {
        if (err) return done(err);
        done(null, key.toString('hex'));
    });
}

userSchema.methods.comparePassword = function(password: string, done: Function) {
    crypto.pbkdf2(password, this.salt, 1000, 32, (err, key) => {
        if (err) return done(err)
        done(null, key.toString('hex') === this.password);
    })
}

userSchema.methods.createJWT = function() {
    return jwt.sign({
        _id: this._id,
        username: this.username,
        role: this.role
    }, process.env.JWT_SECRET);
}

export let User = mongoose.model<IUserModel>('User', userSchema)
