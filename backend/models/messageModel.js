const mongoose =require('mongoose')

const messagSchema = new mongoose.Schema({
    chatId :String,
    senderId : String,
    text: String,
    //time: Timestamp.now(),
},
{
    timestamps: true,
})

const messageModel = mongoose.model("messages", messagSchema)
module.exports=messageModel;