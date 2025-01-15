import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "All field are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "password must be of 6 characters" });
        }

        const user = await User.findOne({ email })

        if (user) return res.status(400).json({ message: "email already used" })

        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }
        else {
            res.status(400).json({ message: "invalid user data" });
        }


    } catch (error) {
        console.log("error in sign up controller", error.message)
        res.status(500).json({ message: "internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({email})
        console.log("HELLO")
        if (!user) {
            return res.status(400).json({ message: "invalid credentials" })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ mesaage: "invalid credentials" });
        }

        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })


    } catch (error) {
        console.log("error in login controller", error.message);
        res.status(500).json({ message: "internal; server error" })
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        // to logout we have just removed the cookie
        res.status(200).json({ message: "logged out successfully" });
    } catch (error) {
        console.log("error in logout controller", error.message)
        res.status(500).json({ message: "internal; server error" })
    }
};

export const updateProfile= async(req,res)=>{
    try {
        const {profilePic}= req.body;
        const userId= req.user._id
        if(!profilePic){
            return res.status(400).json({message:"Profile pic is required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser= await User.findByIdAndUpdate(
            userId,
            {profilePic:uploadResponse.secure_url},
            {new:true}
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in update profile",error);
        res.status(500).json({message:"internal server error"});
    }
}

export const checkAuth= async (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("error in checkAuth contriller",error.mesaage)
        res.status(500).json({message:"internal server error"});
    }
}