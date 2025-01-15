import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";


export const getUsersForSidebar= async (req,res) =>{
    try {
        const loggedInUserId= req.user._id
        const filteredUsers = await User.find({_id:{$ne: loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);

    } catch (error) {
        console.log("error in getUsersForsidebar",error.message);
        res.status(500).json({error:"internal server error"});
    }
};

export const getMessages= async(req,res)=>{
    try {
        const {id:userToChatId} = req.params
        const myId = req.user._id;
        const messages= await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.log("error in getmessages controller",error.message);
        res.status(500).json({error: "internal server error"});
    }
};

export const sendMessage= async (req,res)=>{
try {
    const {text,image}= req.body;
    const {id:receiverId}= req.params;
    const senderId= req.user._id;

    let imageUrl;
    if(image){
        const uploadResponse= await cloudinary.uploader.upload(image);
        imageUrl= uploadResponse.secure_url;
    }

    const newMessage= new Message({
        senderId,
        receiverId,
        text,
        image:imageUrl,
    });

    await newMessage.save();

    // todo real time functionality by using socket io

    res.status(201).json(newMessage)
} catch (error) {
    console.log("error in sendMessage controller",error.message);
    res.status(500).json({error:"internal server error"});
}
};