import multer from "multer";
import { activeCheck, commentPost, deleteCommentOfUser, deletePost, getCommentsByPosts, incrementLikes } from "../controllers/posts.controllers.js";
import {Router} from 'express';
import { createPost } from "../controllers/posts.controllers.js";
import { getAllPosts } from "../controllers/posts.controllers.js";
import { postMediaStorage } from '../config/cloudinary.js';

const router = Router();

const upload = multer({ storage: postMediaStorage });

router.route('/').get(activeCheck);
router.route('/post').post(upload.single('media'), createPost);
router.route('/posts').get(getAllPosts);
router.route('/delete_post').delete(deletePost);
router.route('/comment').post(commentPost);
router.route('/get_comments').get(getCommentsByPosts);
router.route('/delete_comment').post(deleteCommentOfUser);
router.route('/increment_post_like').post(incrementLikes);

export default router;