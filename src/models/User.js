const mongoose = require("mongoose");
const Joi = require("joi");  //joi will validate for the express 
const jwt = require("jsonwebtoken");

// User Schema
const UserSchema = new mongoose.Schema({
    // first name and last name 
    first_name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
    },
    profilePhoto: {
        type: Object,
        default: {
            url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973461_640.png",
            publicId: null,
        }
    },
    bio: {
        type: String,
    },
    isAdmin: {
        type:Boolean,
        default: false,
    },
    isAccountVerified: {
        type:Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['student', 'mentor', 'admin'], // Roles allowed
        default: 'student',  // Default role is student
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',  // Reference to a Group collection
        required: function() { return this.role !== 'admin'; },
    },

}, {
    timestamps: true,
   
});

// Generate Auth Token 
UserSchema.methods.generateAuthToken = function() {
    return jwt.sign(
        { 
            id: this._id, 
            role: this.role, 
            groupId: this.groupId || null,   // Admin will have null groupId  
            isAdmin: this.isAdmin 
        }, 
        process.env.JWT_SECRET, 
    );
    // { expiresIn: '1d' }
};

// User Model 
const User = mongoose.model("User", UserSchema);

// Validate Register User 
function validateRegisterUser(obj) {
    const schema = Joi.object({
        first_name: Joi.string().trim().min(2).max(100).required(),
        last_name: Joi.string().trim().min(2).max(100).required(),
        email: Joi.string().trim().min(5).max(100).required().email(),
        password: Joi.string().trim().min(8).required(),
        role: Joi.string().valid('student', 'mentor', 'admin').optional(),  // role can be passed
        groupName: Joi.string().when('role', {
            is: Joi.not('admin'),  // Only require groupName if the role is not 'admin'
            then: Joi.required(),
            otherwise: Joi.optional()
        }),
    });
    return schema.validate(obj);
}

// Validate Login User 
function validateLoginUser(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).required().email(),
        password: Joi.string().trim().min(8).required(),
    });
    return schema.validate(obj);
}

// Validate Update User 
function validateUpdateUser(obj) {
    const schema = Joi.object({
        first_name: Joi.string().trim().min(2).max(100),
        last_name: Joi.string().trim().min(2).max(100),
        bio: Joi.string().optional(), // its optional for the users if they want to update their bio or no 
         
    });
    return schema.validate(obj);
}

// Validate Change Password 
function validateChangePassword(obj) {
    const schema = Joi.object({
        newPassword: Joi.string().trim().min(8).required(),  // Password must meet a minimum length
    });
    return schema.validate(obj);
}



module.exports = {
    User,
    validateRegisterUser,
    validateLoginUser,
    validateUpdateUser,
    validateChangePassword
}
