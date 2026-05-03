import User from "../models/users.model.js";
import Profile from "../models/profile.model.js";
import ConnectionRequest from "../models/connections.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const convertUserDataToPDF = async (userData) => {
  const doc = new PDFDocument();
  const filename = `${crypto.randomBytes(32).toString("hex")}.pdf`;
  const absolutePath = path.join(process.cwd(), "uploads", filename);
  const stream = fs.createWriteStream(absolutePath);
  doc.pipe(stream);
  if (userData.userId.profilePicture) {
    try {
      const res = await fetch(userData.userId.profilePicture);
      const buf = Buffer.from(await res.arrayBuffer());
      doc.image(buf, { align: 'center', width: 100 });
    } catch (_) {}
  }
  doc.fontSize(14).text(`Name: ${userData.userId.name}`);
  doc.fontSize(14).text(`Email: ${userData.userId.email}`);
  doc.fontSize(14).text(`Username: ${userData.userId.username}`);
  doc.fontSize(14).text(`Bio: ${userData.bio || "N/A"}`);
  doc.fontSize(14).text(`CurrentPost: ${userData.currentPost || "N/A"}`);

  doc.fontSize(14).text("Past Work: ");
  userData.pastWork.forEach((work, index) => {
    doc.fontSize(12).text(`Company Name: ${work.company}`);
    doc.fontSize(12).text(`Role: ${work.position}`);
    doc.fontSize(12).text(`Duration: ${work.years}`);
  });
  doc.end();

  // wait until the file stream finishes writing
  await new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  // return a relative path that the frontend can use with BASE_URL (express serves /uploads statically)
  return `uploads/${filename}`;
};

export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({
      email,
    });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await newUser.save();

    const profile = new Profile({
      userId: newUser._id,
    });

    await profile.save();

    return res.json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "user does not exist" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({ _id: user._id }, { token: token });
    res.status(200).json({ token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const uploadProfilePic = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({
      token: token,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.profilePicture = req.file.path;
    await user.save();
    res.status(200).json({ message: "Profile picture updated successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;
    const user = await User.findOne({ token: token });
    const existingUser = await User.findOne({   $or: [
    { username: newUserData.username },
    { email: newUserData.email }
  ] });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return res.status(400).json({ message: "Username already taken" });
    }

    Object.assign(user, newUserData);
    await user.save();
    return res
      .status(200)
      .json({ message: "User profile updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.query;
    console.log("token", token);
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture",
    );

    return res.status(200).json(userProfile);
  } catch (error) {
    console.log(error.message);
    console.log(error.stack);

    return res.status(500).json({ message: "Server Error" });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;
    const userProfile = await User.findOne({ token: token });
    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }
    const profile_to_update = await Profile.findOne({
      userId: userProfile._id,
    });
    Object.assign(profile_to_update, newProfileData);
    await profile_to_update.save();
    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name email username profilePicture",
    );
    return res.status(200).json(profiles);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const downloadProfile = async (req, res) => {
  try {
    const user_id = req.query.id;
    const userProfile = await Profile.findOne({ userId: user_id }).populate(
      "userId",
      "name email username profilePicture",
    );
    let outputPath = await convertUserDataToPDF(userProfile);
    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    return res.status(200).json({ message: outputPath });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const connectionUser = await User.findOne({ _id: connectionId });
    if (!connectionUser) {
      return res.status(404).json({ message: "Connection user not found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      userId : user._id,
      connectionId : connectionUser._id
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Connection request already sent" });
    }

    const request = new ConnectionRequest({
      userId : user._id,
      connectionId : connectionUser._id
    });

    await request.save();
    return res.status(200).json({ message: "Connection request sent", request });

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMyConnectionsRequests = async (req, res) => {
  const { token}  = req.body;
  try {
    const user = await User.findOne({token});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sentConnections = await ConnectionRequest.find({ userId: user._id })
      .populate('connectionId', 'name email username profilePicture');

    const receivedConnections = await ConnectionRequest.find({ connectionId: user._id })
      .populate('userId', 'name email username profilePicture');

    const normalizedSent = sentConnections.map((request) => ({
      ...request.toObject(),
      otherUser: request.connectionId,
      direction: 'sent',
    }));

    const normalizedReceived = receivedConnections.map((request) => ({
      ...request.toObject(),
      otherUser: request.userId,
      direction: 'received',
    }));

    const allConnections = [...normalizedSent, ...normalizedReceived];

    return res.status(200).json(allConnections);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}

export const whatAreMyConnections = async (req, res) => {
  const { token}  = req.query;
  try {
    const user = await User.findOne({token});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const connections = await ConnectionRequest.find({connectionId : user._id}).populate('userId', 'name email username profilePicture');

    return res.json(connections);
  }catch(error){
    return res.status(500).json({message: "Server error"});
  }
}

export const acceptConnectionRequest = async (req, res) => {
  const {token, requestId, action_type} = req.body;
 try {
  const user = await User.findOne({token});
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const connection = await ConnectionRequest.findOne({ _id: requestId });
  if (!connection) {
    return res.status(404).json({ message: "Connection request not found" });
  }
  if (action_type === "accept") {
   connection.status_accepted = true;
  } else{
    connection.status_accepted = false;
  }
  await connection.save();
  return res.status(200).json({message: "Connection request updated successfully"});
 } catch (error) {
  return res.status(500).json({message: "Server error"});
 }
}

export const getUserProfileAndUserBasedOnUsername = async (req, res) => {
  const {username} = req.query;
  try{
    const user = await User.findOne({
      username: username
    })
  if(!user){
    return res.status(404).json({message: "User not found"});
  }
  const userProfile = await Profile.findOne({userId : user._id}).populate(
    "userId",
    "name email username profilePicture",
  );
  return res.status(200).json(userProfile);
  }
  catch(error){
    return res.status(500).json({message: error.message});
  }
}