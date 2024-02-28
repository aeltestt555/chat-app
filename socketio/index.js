
const { Server } = require('socket.io');
const io = new Server({ 
    cors: process.env.FRONTEND_URL ,
})

let onlineUsers = []


io.on("connection", (socket) => {
    console.log("Connected to socket server id ", socket.id);
    //listen to a connaection
    socket.on("addNewUser", ( userId ) => {
        !onlineUsers.some(user => user.userId === userId) &&
        onlineUsers.push({
            userId,
            socketId: socket.id,
            time : (new Date().getHours()<10 ?'0'+new Date().getHours():new Date().getHours())
             +':'+(new Date().getMinutes()<10?'0'+new Date().getMinutes():new Date().getMinutes()),
        });
        console.log('onlineUsers', onlineUsers)

        io.emit('getOnlineUsers', onlineUsers)
})
    // add message 
    socket.on("sendMessage", (message) => {
        const user = onlineUsers.find(user => user.userId === message.recipientId)
        if(user){
            io.to(user.socketId).emit("getMessage", message);
            io.to(user.socketId).emit("getNotification", {
                senderId: message.senderId,
                isRead:false,
                date: new Date(),
            });
        }
    });
socket.on('disconnect', () =>{
    onlineUsers= onlineUsers.filter((user) => user.socketId !== socket.id)
    io.emit('getOnlineUsers', onlineUsers)

})
})


io.listen(5000) 