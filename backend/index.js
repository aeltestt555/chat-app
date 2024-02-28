const express = require('express')  
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const userRouter = require('./routers/userRouter')
const userModel= require('./models/userModel')

const chatRouter = require('./routers/chatRouter')
const chatModel = require('./models/chatModel')

const messageRouter = require('./routers/messageRouter')
const messageModel = require('./models/messageModel')

require('dotenv').config()

app.use(cors()) 
app.use(express.json());

app.use('/api/users', userRouter)
app.use('/api/chats', chatRouter)
app.use('/api/messages', messageRouter)

const port = process.env.PORT || '3001'
const uri = process.env.ATLAS_URI 


app.get('/', (req, res)=>{
    res.send('real chat app')
})

app.get('/msg', (req, res)=>{
    res.json({msg:'helllo'})
})

app.listen(port, (req, res)=>{
    console.log("Server is running on port 3001")
})


mongoose.connect(uri,
).then(()=>{
    console.log("Connect successfully to mongodb");
}).catch((err)=>{
    console.log('error :' + err.message);
});  

