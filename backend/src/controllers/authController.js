//write here some function as : sign in, sing up, log out..
import User from '../Models/userModel.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import imagekit from '../utils/ImagekitIO.js'
import { sendMail, forgotPasswordMailGenContent } from '../utils/mail.js'
import { signinToken, createSendToken, defaultAvatarUrl, filterObj } from '../utils/token.js';

//signup function:

const signup = async (req, res) => {
    try {

        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            avatar: { url: req.body.avatar || defaultAvatarUrl(req.body.name) }
        })

        createSendToken(newUser, 201, res)
    }
    catch (error) {
        const duplicateKey = Object.keys(error.keyPattern || {});
        const duplicateField = duplicateKey.length > 0 ? duplicateKey[0] : null;
        const message = duplicateField ? `An account with that ${duplicateField} already exists` : error.message;
        res.status(400).json({ status: "fail", message })
    }

}



//login:
const login = async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error('Please provide email and password')
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            throw new Error('Incorrect email or password')
        }

        createSendToken(user, 200, res)


    }
    catch (error) {
        res.status(400).json({ status: "fail", message: error.message })
    }
}



//protect:
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        else if (
            req.cookies && req.cookies.jwt !== 'loggedout'
        ) {
            token = req.cookies.jwt;
        }

        //step2: no token stop here:
        if (!token) {
            throw new Error('You are not logged in! Please log in to get access.');
        }

        //step3: token is real?
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //step4: check if user still exists
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            throw new Error('The user belonging to this token no longer exists.');
        };


        //step5: check if user changed password after the token was issued:
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            throw new Error('User recently changed password! Please log in again.');
        }

        //step6: all check passed:
        req.user = currentUser;
        next();
    }

    catch (err) {
        res.status(401).json({ status: "fail", message: err.message });
        console.error(err);
    }
}

const check = (req, res) => {
    res.status(200).json({ status: "success", user: req.user });
};

const logout = (req, res) => {
    res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ status: "success" });
};

const updateMe = async (req, res) => {
    try {
        const updates = filterObj(req.body, "name", "phoneNumber", "avatar");
        const user = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({ status: "success", user });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { currentPassword, password, passwordConfirm } = req.body;
        const user = await User.findById(req.user._id).select("+password");

        if (!user || !(await user.correctPassword(currentPassword, user.password))) {
            return res.status(401).json({ status: "fail", message: "Current password is incorrect" });
        }

        user.password = password;
        user.passwordConfirm = passwordConfirm;
        await user.save();
        createSendToken(user, 200, res);
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ status: "fail", message: "No user found with that email address" });
        }

        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });
        const resetUrl = `${req.protocol}://${req.get("host")}/user/resetPassword/${resetToken}`;
        await sendMail({
            email: user.email,
            subject: "Your Homely Hub password reset token",
            mailGenContent: forgotPasswordMailGenContent(user.name, resetUrl),
        });
        res.status(200).json({ status: "success", message: "Reset link sent to your email" });
    } catch (error) {
        res.status(500).json({ status: "fail", message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        }).select("+passwordResetToken +passwordResetExpires");

        if (!user) {
            return res.status(400).json({ status: "fail", message: "Token is invalid or has expired" });
        }

        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        createSendToken(user, 200, res);
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

export {
    signup,
    login,
    protect,
    check,
    logout,
    updateMe,
    updatePassword,
    forgotPassword,
    resetPassword,
};
//ternary operator to check if the error is a duplicate key error and send a proper response