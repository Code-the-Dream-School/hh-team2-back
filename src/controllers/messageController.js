const Message = require('../models/Messages');
const {User} = require('../models/User');

const allowedEmojis = ["😀", "❤️", "👍", "🎉", "😢", "🔥"];

//send a message

const sendMessage = async (req, res) =>{
    const{sender, receiver, content} = req.body;

    try{
        const message = await Message.create({sender, receiver, content});
        res.status(201).json(message);
    } catch(error){
        res.status(500).json({error:"An error occured with sending the message"});
    }
};


//serch for user by name or email
const searchUsers = async (req, res) =>{
    const {searchUser} =req.body;

    try{
        const users = await User.find({
            $or:[
                {first_name: {$regex: searchUser, $options: "i"}},
                {last_name: {$regex: searchUser, $options: "i"}},
                {email: {$regex: searchUser, $options: "i"}},
            ]
        }).select("_id first_name last_name email");
        res.status(200).json(users);
    }catch(error){
        res.status(500).json({error:"An error occured with search users"});
    }
}

//get messages from a single sender

const getMessages = async (req, res)=>{
    const {userId} = req.params;
    const currentUser = req.user.id;
    try{
        const messages = await Message.find({
            $or: [
                {sender: currentUser, receiver: userId},
                {sender: userId, receiver: currentUser},
            ],
        })
        .sort({createdAt:1})
        .populate("sender receiver", "first_name email");

        res.status(200).json(messages);
    } catch(error){
        res.status(500).json({error:"An error occurred with fetching messages"});
    }
};

//add emoji to a message

const reactToMessage = async (req, res) =>{
    const {messageId} = req.params;
    const {emoji} = req.body;
    const userId = req.user._id;

    if(!allowedEmojis.includes(emoji)){
        return res.status(400).json({error: "Use an allowed emojis"})
    }

    try{
        const message = await Message.findByIdAndUpdate(
            messageId,
            {$push: {emojis:{emoji, userId}}},
            {new: true}
        );
        res.status(200).json(message);
    }catch(error){
        res.status(500).json({error: "An error occure in addition a reaction"});
    }
};

//mark message as read

const markAsRead = async (req,res) =>{
    const {messageId} = req.params;

    try{
        const message = await Message.findByIdAndUpdate(
            messageId,
            {status: "read"},
            {new: true}
        );
        res.status(200).json(message);
    }catch(error){
        res.status(500).json({error: "Failed to mark message as read"});
    }
};

//delite single message

const deleteMessage = async (req, res) =>{
    const {messageId} = req.params;

    try{
        await Message.findOneAndDelete(messageId);
        res.status(200).json({message:"The message was successfully deleted"});
    } catch(error){
        res.status(500).json({error: "Failed to delete the message"});
    }
};

//delete all messages from specific sender

const deleteAllMessagesFromSender = async (req, res) =>{
    const {otherUserId} = req.params;
    const currentUserId = req.user.id;

    try{
        await Message.deleteMany({
            $or: [
                {sender: otherUserId, receiver:currentUserId},
                {sender: currentUserId, receiver:otherUserId},
            ]
        });
        
        res.status(200).json({message: "All messages from sender were deleted"});
    }catch(error){
        res.status(500).json({error: "Failed to delete messages from sender"});
    }
};


module.exports = {
    sendMessage,
    searchUsers,
    getMessages,
    reactToMessage,
    markAsRead,
    deleteMessage,
    deleteAllMessagesFromSender
}