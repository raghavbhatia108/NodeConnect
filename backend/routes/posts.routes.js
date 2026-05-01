import multer from "multer";
import { activeCheck, commentPost, deleteCommentOfUser, deletePost, getCommentsByPosts, incrementLikes } from "../controllers/posts.controllers.js";
import {Router} from 'express';
import { createPost } from "../controllers/posts.controllers.js";   
import { getAllPosts } from "../controllers/posts.controllers.js";

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'uploads/');
    },
    filename : function (req, file, cb){
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storage});

router.route('/').get(activeCheck);
router.route('/post').post(upload.single('media'), createPost);
router.route('/posts').get(getAllPosts);
router.route('/delete_post').delete(deletePost);
router.route('/comment').post(commentPost);
router.route('/get_comments').get(getCommentsByPosts);
router.route('/delete_comment').post(deleteCommentOfUser);
router.route('/increment_post_like').post(incrementLikes);

export default router;