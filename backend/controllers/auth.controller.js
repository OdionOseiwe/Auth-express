import {User} from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { Random } from "random-js";
const random = new Random(); // uses the nativeMath engine
import {generateTokenAndSetCookie} from "../utils/generateTokenAndSetCookie.js"
import {sendVerificationEmail, sendWelcomeEmail, sendForgotPasswordEmail,sendSetPasswordSucessfullyEamil} from "../mailtrap/mails.js"

export const signup = async (req,res)=>{
    const {email, password, name} = req.body;
    try {
        if(!email || !password || !name){
            res.status(400).json({sucess:false, msg:"All fields are required"})
        }

        const userAlreadyExits = await User.findOne({email});
        if(userAlreadyExits){
            res.status(400).json({sucess:false, msg:"user already exits"})
        }

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()

        const hashedPassword = await bcryptjs.hash(password,10);

        const user = new User({
            email,
            password:hashedPassword,
            name,
            verificationToken,
            verificationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000 //24 hours
        });

        await user.save();
        
        //jwt
        generateTokenAndSetCookie(res, user._id);
 
        await sendVerificationEmail(user.email,verificationToken);

        res.status(201).json({sucess: true, msg:"token created",user:{
            ...user._doc,
            password: undefined
        }})

        
    } catch (error) {
        console.log(error);
    }
}

export const verifyEmail = async(req,res)=>{
    const {code} = req.body

    try {
        const user = await User.findOne({
            verificationToken:code,
            verificationTokenExpireAt:{$gt:Date.now()}
        })           
    
        if(!user){
            res.status(400).json({sucess:false, msg:"Invalid or expired Token"})
        }
    
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpireAt = undefined;
    
        await user.save()
        await sendWelcomeEmail(user.email, user.name);
    
        res.status(200).json({sucess:true, msg:"Welcome mail sent sucessfully",user:{
            ...user._doc,
            password: undefined
        }})

    } catch (error) {
        console.log(error);   
    }
    
}

export const login = async (req,res)=>{
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user){
            res.status(404).json({sucess:false,msg:"invalid email or password"})
        }
    
        const comparePassword = await bcryptjs.compare(password, user.password);
    
        if(!comparePassword){
            res.status(404).json({sucess:false,msg:"invalid credentails"})
        }
        generateTokenAndSetCookie(res, user._id);
    
        user.lastLogin = Date.now()
        await user.save();
    
        res.status(200).json({
            sucess:true,
            msg:"log in sucessfully"
        })
    } catch (error) {
        console.log("error while loging in", error);
        
    }
}

export const logout = async (req,res)=>{
    res.clearCookie("token");
    res.status(200).json({
        sucess:true,
        msg:"logged out sucessfully"
    })
}

export const forgotPassword = async(req,res)=>{
    const {email} = req.body;
    try {
        const user = await User.findOne({email});

    if (!user) {
        res.status(400).json({sucess:false, msg:"invalid credentails"})
    }

    const resetPasswordToken = random.hex(16)
    const resetTokenExpireAt = Date.now() + 1 * 60 * 60 * 1000 // 1 hour;

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpireAt = resetTokenExpireAt;
    await user.save();

    await sendForgotPasswordEmail(email, `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`);
    res.status(200).json({sucess:true, msg:"password reset succesfully"})
    } catch (error) {
        console.log("error while reseting password", error);
        
    }
    
}

export const resetPassword = async(req,res) =>{

    try {
        const {password} = req.body;
        const {token} = req.params;
        if(!password){
            res.status({sucess:false, msg:"provide password"})
        }
        const user = await User.findOne({resetPasswordToken:token,resetPasswordExpireAt:{$gt:Date.now()}}
        );

        if(!user){
            res.status(400).json({sucess:false, msg:"expired or invalid token"})
        }
        const hashedPassword = await bcryptjs.hash(password,10);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpireAt = undefined;
        user.password = hashedPassword;
        await user.save();

        await sendSetPasswordSucessfullyEamil(user.email)

        res.status(200).json({sucess:true, msg:"password set sucessfully"})
    } catch (error) {
        console.log("error while reseting password", error);
        
    }
}

export const checkAuth = async(req,res)=>{
    try {
        const user = await User.findById(req.userId).select("-password");
        if(!user){
            res.status(400).json({sucess:false,msg:"user not found"})
        }

        res.status(200).json({sucess:true, user:{
            ...user._doc
        }})
    } catch (error) {
        console.log("error finding user", error);    
    }
}