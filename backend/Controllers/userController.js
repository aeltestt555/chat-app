
const express =require('express')
const bcrypt = require('bcryptjs')
const jwt=require("jsonwebtoken")
const validator = require('validator')

const userModel = require('../models/userModel')
const { default: mongoose } = require('mongoose')
require('dotenv').config()
const tokenKey = process.env.JWT_SECRET_KEY


const createToken = ( _id) =>{
    return jwt.sign({ _id }, tokenKey, { expiresIn: "1h" })  //expire in one hour
}

const login = async (req, res)=>{

    try{
        const { email, password } = req.body;
        
        let user = await userModel.findOne({ 'email': email });

        if(!user) return res.status(400).json('invalid email or password ...');

        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword ) return res.status(400).json('Invalid Password...');
      
        const token = createToken(user._id);

        res.status(200).json({_id: user._id, name: user.name, email, token});

    } catch(err){
        console.log(err);
    }
}


const register = async (req, res)=>{

    try{
        const { name, email, password } =req.body;
    let user = await userModel.findOne({ email });

    if(user) return res.status(400).json('email already registered')
    
    if(!name || !email || !password) return res.status(401).json('all fiels are required ...')

    if(!validator.isEmail(email)) return res.status(402).json('enter a valid email ..')
    //if(!validator.isStrongPassword(password)) return res.status(402).json('enter a strong pasword ...')

    user = new userModel({name, email, password})
    
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    await user.save()

    const token = createToken(user._id)

    res.status(200).json({_id: user._id, 'name':name, 'email': email, 'token' : token })

    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
    
}   

const  findUser = async(req,res) => {
    const userId = req.params.userId;
    try{
        const user = await userModel.findById(userId)
        if (!user) return res.status(400).json("no user found");
        return res.status(200).json(user);
    }catch(err) {
        console.log(err)
        res.status(500).json(err)
    }
    
}

const getUsers = async(req,res) => {
    
    try{
        const users = await userModel.find()
        if (!users) return res.status(400).json("no users found");
        return res.status(200).json(users);
    }catch(err) {
        console.log(err)
        res.status(500).json(err)
    }
    
}

module.exports = { register, login , findUser, getUsers}