const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateChangePassword } = require("../models/User");

// Change Password Controller
module.exports.changePasswordCtrl = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Validate that both current and new password are provided
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required." });
    }

    // Find the user by ID
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(400).json({ message: "User not found." });
    }

    // Check if the current password matches the stored password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save the updated user with the new password
    await user.save();
    
    res.status(200).json({ message: "Password updated successfully." });
});
