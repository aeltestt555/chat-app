// socket/index.js

const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

// NOTE: You will need to pass your 'app' (from express) to http.createServer
// For example: const server = http.createServer(app);
const server = http.createServer(); // Replace this with your actual server creation
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Your React app's URL
        methods: ["GET", "POST"]
    }
});

// This array will store the users who are currently online
// We store an object with { userId, socketId } for each user
let onlineUsers = [];

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // --- 1. Authenticate User ---
    // The client should emit this event right after connecting, passing the user's ID and token.
    // In a real app, you would verify the JWT token here.
    // For now, we'll just trust the userId.
    socket.on("authenticate", async (data) => {
        const { userId, token } = data;
        
        // In a real app, you would verify the JWT token here!
        // For now, we'll just trust the userId.
        if (userId) {
            // Add user to the online users list if they are not already there
            const isUserAlreadyOnline = onlineUsers.some(u => u.userId === userId);
            if (!isUserAlreadyOnline) {
                onlineUsers.push({ userId, socketId: socket.id });
                console.log(`User ${userId} authenticated with socket ${socket.id}`);
                
                // Send the updated list of online users to everyone
                io.emit("getOnlineUsers", onlineUsers);
            } else {
                console.log(`User ${userId} is already online.`);
            }
        }
    });

    // --- 2. Send Message ---
    // This event is triggered when a user sends a message from the ChatBox component
    socket.on("sendMessage", (data) => {
        const { recipientId, text, senderId } = data;
        
        // Find the recipient's socket ID from our list of online users
        const recipientUser = onlineUsers.find(u => u.userId === recipientId);

        if (recipientUser) {
            // Create a message object to send
            const messageData = {
                chatId: data.chatId, // The ID of the chat
                senderId: senderId,
                text: text,
                createdAt: new Date()
            };

            // Send the message to the specific recipient's socket
            io.to(recipientUser.socketId).emit("getMessage", messageData);

            // Send a notification to the recipient (for the chat list)
            io.to(recipientUser.socketId).emit("getNotification", {
                senderId: senderId,
                isRead: false,
                date: new Date()
            });

            console.log(`Message from ${senderId} to ${recipientId}`);
        } else {
            // If the user is not online, you can handle it here (e.g., save as an unread notification in the DB)
            console.log(`User ${recipientId} is not online. Message not delivered.`);
        }
    });

    // --- 3. Handle User Disconnect ---
    // This is the key part for the "last seen" feature
    socket.on("disconnect", async () => {
        console.log(`User disconnected: ${socket.id}`);
        
        // Find the user in our onlineUsers list by their socketId
        const disconnectedUser = onlineUsers.find(u => u.socketId === socket.id);

        if (disconnectedUser) {
            // Remove the user from the online list
            onlineUsers = onlineUsers.filter(u => u.socketId !== socket.id);
            
            // --- IMPORTANT: Update lastSeen in your database ---
            // You need to import your User model and do this:
            // const userModel = require('../models/userModel');
            // await userModel.findByIdAndUpdate(disconnectedUser.userId, { lastSeen: new Date() });
            // console.log(`User ${disconnectedUser.userId} went offline. Last seen updated.`);
            
            // Send the updated list of online users to everyone
            io.emit("getOnlineUsers", onlineUsers);
        }
    });

    // --- 4. Handle User Last Seen Update (from another tab/window) ---
    // This event is emitted by the backend when a user's lastSeen is updated
    socket.on("userLastSeenUpdated", (data) => {
        // This event is not strictly necessary for the "last seen" feature to work,
        // but it's good practice to listen for it and update the UI in real-time.
        console.log(`Received userLastSeenUpdated event for user ${data.userId}:`, data);
        
        // The ChatContext would listen for this and update the state of the relevant ChatBox component
        // For example, if you have multiple chat windows open for the same user,
        // this event allows all of them to update the "last seen" status simultaneously.
    });

    // ... (any other socket.io listeners you might have)
});

const PORT = 5001; // Or any other port you prefer
server.listen(PORT, () => {
    console.log(`Socket.IO server is running on port ${PORT}`);
});