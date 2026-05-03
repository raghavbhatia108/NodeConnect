import {Router} from 'express';
import { downloadProfile, getAllUserProfile, getUserProfileAndUserBasedOnUsername, register, updateProfileData, whatAreMyConnections } from '../controllers/users.controllers.js';
import { login } from '../controllers/users.controllers.js';
import { uploadProfilePic } from '../controllers/users.controllers.js';
import { updateUserProfile } from '../controllers/users.controllers.js';
import { getUserAndProfile } from '../controllers/users.controllers.js';
import { sendConnectionRequest } from '../controllers/users.controllers.js';
import { getMyConnectionsRequests } from '../controllers/users.controllers.js';
import { acceptConnectionRequest } from '../controllers/users.controllers.js';  
import multer from 'multer';
import { profilePicStorage } from '../config/cloudinary.js';

const router = Router();

const upload = multer({ storage: profilePicStorage });

router.route("/update_profile_pic").post(upload.single('profile_pic'), uploadProfilePic);

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/user_updated').post(updateUserProfile);
router.route('/get_user_and_profile').get(getUserAndProfile);
router.route("/update_profile_data").post(updateProfileData);
router.route("/users/get_all_users").get(getAllUserProfile);
router.route("/users/download_resume").get(downloadProfile);
router.route("/users/send_connection_request").post(sendConnectionRequest);
router.route("/users/getConnectionRequests").post(getMyConnectionsRequests);
router.route("/users/user_connection_request").get(whatAreMyConnections);
router.route("/users/accept_connection_request").post(acceptConnectionRequest);
router.route("/users/get_profile_based_on_username").get(getUserProfileAndUserBasedOnUsername);

export default router;