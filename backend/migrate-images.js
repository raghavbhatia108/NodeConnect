import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import cloudinaryPkg from 'cloudinary';

import User from './models/users.model.js';
import Post from './models/posts.model.js';

dotenv.config();

const cloudinary = cloudinaryPkg.v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const migrate = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB\n');

  // --- Migrate profile pictures ---
  const users = await User.find({ profilePicture: { $exists: true, $ne: '' } });
  let uOk = 0, uSkip = 0, uFail = 0;

  for (const user of users) {
    const pic = user.profilePicture;
    if (!pic || pic.startsWith('http') || pic.startsWith('data:')) {
      uSkip++; continue;
    }
    const filePath = path.join(process.cwd(), 'uploads', pic);
    if (!fs.existsSync(filePath)) {
      console.log(`[SKIP] File missing for user "${user.username}": ${pic}`);
      uFail++; continue;
    }
    try {
      const result = await cloudinary.uploader.upload(filePath, { folder: 'nodeconnect/profiles' });
      user.profilePicture = result.secure_url;
      await user.save();
      console.log(`[OK] Profile pic migrated: ${user.username}`);
      uOk++;
    } catch (err) {
      console.log(`[FAIL] User "${user.username}": ${err.message}`);
      uFail++;
    }
  }

  // --- Migrate post media ---
  const posts = await Post.find({ media: { $exists: true, $ne: '' } });
  let pOk = 0, pSkip = 0, pFail = 0;

  for (const post of posts) {
    const media = post.media;
    if (!media || media.startsWith('http') || media.startsWith('data:')) {
      pSkip++; continue;
    }
    const filename = media.replace(/\\/g, '/').replace(/^uploads\//, '');
    const filePath = path.join(process.cwd(), 'uploads', filename);
    if (!fs.existsSync(filePath)) {
      console.log(`[SKIP] File missing for post ${post._id}: ${filename}`);
      pFail++; continue;
    }
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'nodeconnect/posts',
        resource_type: 'auto',
      });
      post.media = result.secure_url;
      await post.save();
      console.log(`[OK] Post media migrated: ${post._id}`);
      pOk++;
    } catch (err) {
      console.log(`[FAIL] Post ${post._id}: ${err.message}`);
      pFail++;
    }
  }

  console.log('\n========== Migration Complete ==========');
  console.log(`Profile pics : ${uOk} migrated, ${uSkip} skipped, ${uFail} failed`);
  console.log(`Post media   : ${pOk} migrated, ${pSkip} skipped, ${pFail} failed`);

  await mongoose.disconnect();
};

migrate().catch(console.error);
