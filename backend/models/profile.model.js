import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema({
    school : {
        type: String,
        default : ''
    },
    degree : {
        type: String,
        default : ''
    },
    fieldOfStudy : {
        type: String,
        default : ''
    }
});

const workSchema = new mongoose.Schema({
    company: {
        type:String,
        default : ''
    },
    position : {
        type: String,
        default : ''
    },
    years : {
        type: String,
        default : ''
    }
});

 const profileSchema = mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },
    bio : {
        type : String,
        default : ''
    },
    currentPost : {
        type : String,
        default : ''
    },
    pastWork : {
        type : [workSchema],
        default : []
    },
    education : {
        type : [EducationSchema],
        default : []    
    }
});

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;