import cloudinaryPkg from 'cloudinary';
import multerStoragePkg from 'multer-storage-cloudinary';

const cloudinary = cloudinaryPkg.v2;
const { CloudinaryStorage } = multerStoragePkg;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const profilePicStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'nodeconnect/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

export const postMediaStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'nodeconnect/posts',
    resource_type: file.mimetype.startsWith('video') ? 'video' : 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'mov'],
  }),
});
