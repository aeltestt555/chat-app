// In your chat controller file

const chatModel = require('../models/chatModel');
const messageModel = require('../models/messageModel'); // <-- THIS LINE WAS MISSING

const createChat = async(req, res) => {
    const { firstId, secondId } = req.body;
    try {
        const chat = await chatModel.findOne({
            members: {$all: [firstId, secondId]},
        });
        if (chat) return res.status(409).json(chat);

        const newChat = new chatModel({
            members: [firstId, secondId]
        });
        const response = await newChat.save();
        res.status(200).json(response);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
};

const findUserChats = async (req, res) => {
    const userId = req.params.userId;

    try {
        console.log(`\n--- Finding chats for user: ${userId} ---`);

        // Step 1: Get all chats for the user
        const chats = await chatModel.find({
            members: { $in: [userId] }
        });

        console.log(`Found ${chats.length} chats.`);

        // Step 2: For each chat, find its latest message
        const chatsWithLatestMsg = await Promise.all(
            chats.map(async (chat) => {
                try {
                    console.log(`-> Looking for latest message for chatId: ${chat._id}`);
                    
                    const latestMessage = await messageModel
                        .findOne({ chatId: chat._id.toString() }) // Convert ObjectId to string
                        .sort({ createdAt: -1 })
                        .lean(); // .lean() makes the query faster

                    console.log(`   Found latest message: ${latestMessage ? latestMessage.text : 'No messages yet'}`);

                    return {
                        ...chat.toObject(),
                        latestMsg: latestMessage
                    };
                } catch (innerError) {
                    console.error(`!!! ERROR finding message for chat ${chat._id}:`, innerError);
                    // If there's an error for one chat, return it without a latest message
                    return {
                        ...chat.toObject(),
                        latestMsg: null
                    };
                }
            })
        );

        // Step 3: Sort the final list
        chatsWithLatestMsg.sort((a, b) => {
            const timeA = a.latestMsg ? new Date(a.latestMsg.createdAt) : new Date(0);
            const timeB = b.latestMsg ? new Date(b.latestMsg.createdAt) : new Date(0);
            return timeB - timeA;
        });

        console.log("--- Successfully processed all chats. Sending response. ---");
        res.status(200).json(chatsWithLatestMsg);
    } catch (err) {
        console.error("!!! CRITICAL ERROR in findUserChats !!!", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const findChat = async(req, res) => {
    const {firstId, secondId} = req.params;
    try {
        const chat = await chatModel.findOne({
            members: {$all: [firstId, secondId]},
        });
        res.status(200).json(chat);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
};

module.exports = {createChat, findUserChats, findChat};