const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        emojis:[
            {
                emoji: String,
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                },
            },
        ],
        status: {
            type: String,
            enum: ["read", "unread"],
            default: "unread",
        },
    },
    {timestamps: true}
);

module.exports= mongoose.model("Message", MessageSchema);