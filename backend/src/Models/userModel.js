//User schema:

import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "node:crypto";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        minLength: [3, "Name must be at least 3 characters"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        trim: true, //it will remove the extra spaces
    },

    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: [true, "Email already exists"],
        validate: [validator.isEmail, "Please enter a valid email"], //it chekcs ths shape of the email.
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Password must be at least 6 characters"],
        maxLength: [100, "Password cannot exceed 100 characters"],
        trim: true,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: "Passwords do not match",
        },
    },

    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    avatar: {
        url: { type: String },
        public_id: { type: String }
    },

    passwordChangedAt: {
        type: Date
    },

    passwordResetToken: {
        type: String,
        select: false,
        index: true
    },


    passwordResetExpires: {
        type: Date,
        select: false
    },

}, { timestamps: true }

);


// settings to not pass in response from server
userSchema.set("toJSON",{
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.passwordConfirm;
        delete ret.passwordResetToken; //used for security and other things
        delete ret.passwordResetExpires;
        delete ret.__v; //it is a version
        return ret; //return the modified object
    }
})


//password logic:
//hashing: for scrupbled the password
//pre-save is used to run a function before saving the document to the database. In this case, it is used to hash the password before saving it.
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
})

//login chekc:
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

//
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 
        10
    );
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}

//Forgot password:
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken; // 10 minutes
}

const User = mongoose.model("User", userSchema);
//in mongodb: users


export {User as default};