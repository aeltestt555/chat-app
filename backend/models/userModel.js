
const mongoose = require('mongoose')



const userSchema = new mongoose.Schema({
    'name' :{type:'string', required:true, minLength:3, maxLength: 20},
    'email' :{type:'string', required:true, minLength:3, maxLength: 20, unique: true},
    'password' :{type:'string', required:true, minLength: 8},

}, {
    timestamps: true,
})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel