import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'
import React from 'react'
import styles from './index.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { getAboutUser, sendConnectionRequest } from '@/config/redux/action/authAction'
import { BASE_URL, clientServer } from '@/config'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getAllPosts } from '@/config/redux/action/postAction'



const ProfilePage = () => {
const dispatch = useDispatch();
const authState = useSelector((state)=> state.auth);
const postState = useSelector((state)=> state.postReducer);
const [userPosts, setUserPosts] = useState([]);
const router = useRouter();
const [isModalOpen, setIsModalOpen] = useState(false);
const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);


const [userProfile, setUserProfile] = useState({})

const [inputData, setInputData] = useState({company:'', position:'', years:""})

const handleWorkInputChange = (e) => {
    const {name, value} = e.target
    setInputData({...inputData, [name]:value})
}

const [inputDataEducation, setInputDataEducation] = useState({school:'', degree:'', fieldOfStudy:""})

const handleEducationInputChange = (e) => {
    const {name, value} = e.target
    setInputDataEducation({...inputDataEducation, [name]:value})
}


  const getMediaUrl = (path) => {
    if (!path) return `${BASE_URL}/uploads/default.jpg`;
    const cleanPath = path.replace(/\\/g, "/");
    if (cleanPath.startsWith("uploads/")) return `${BASE_URL}/${cleanPath}`;
    return `${BASE_URL}/uploads/${cleanPath}`;
  };


useEffect(()=>{
    dispatch(getAboutUser({token: localStorage.getItem("token")}))
    dispatch(getAllPosts());
}, [])

useEffect(()=>{
    setUserProfile(authState.user);
}, [authState.user])

  useEffect(() => {
    if (!postState || !Array.isArray(postState.posts)) return;
    const posts = postState.posts.filter(
      (post) => post.userId?.username === authState.user?.userId?.username,
    );
    setUserPosts(posts);
  }, [postState.posts, authState.user?.userId?.username]);

const updateProfilePicture = async (file) =>{
    const formData = new FormData();
    formData.append("profile_pic", file);
    formData.append("token", localStorage.getItem("token"));
    const response = await clientServer.post("/update_profile_pic", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    dispatch(getAboutUser({token: localStorage.getItem("token")}))
}

const updateProfileData = async () => {
    const request = await clientServer.post("/user_updated", {
        token: localStorage.getItem("token"),
        name: userProfile.userId.name,
    });
    const response = await clientServer.post("/update_profile_data", {
        token: localStorage.getItem("token"),
        bio: userProfile.bio,
        currentPost: userProfile.currentPost,
        education: userProfile.education,
        pastWork: userProfile.pastWork
    });
    dispatch(getAboutUser({token: localStorage.getItem("token")}))
}

  return (
    <div>
      <UserLayout>
        <DashboardLayout>
            {authState.user && authState.user.userId &&
              <div className={styles.container}>
          <div className={styles.backdropContainer}>
            <img
              src={`${BASE_URL}/uploads/${userProfile?.userId?.profilePicture}`}
              alt=""
              className={styles.backdrop}
            />
            <label htmlFor="profilePictureUpload">
            <div className={styles.backdropOverlay}>Edit</div>
                <input type="file" id="profilePictureUpload" hidden onChange={(e)=>updateProfilePicture(e.target.files[0])}/>
            </label>
          </div>
          <div className={styles.profileContainer_details}>
            <div className={styles.profileMainWrapper}>
              <div
                className={styles.profileLeftSection}
              >
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                    paddingTop: "5rem",
                    gap: "2rem",
                  }}
                >

                  <input type="text" className={styles.nameEdit} value={userProfile?.userId?.name}
                  onChange={(e)=>{
                    setUserProfile({...userProfile, userId: {...userProfile.userId, name:e.target.value}})
                  }}/>

                  <p style={{ color: "gray" }}>
                    @{userProfile?.userId?.username}
                  </p>
                </div>
                

                <div>
                 <textarea name="" id="" value={userProfile?.bio}
                 rows={Math.max(3, Math.ceil(userProfile?.bio?.length / 80))} style={{width:"100%"}} onChange={(e)=>{
                    setUserProfile({...userProfile, bio:e.target.value})
                 }}></textarea>
                </div>
              <div className={styles.workHistory} style={{display:"flex", flexDirection:"column"}}>
  <h4>Work History</h4>

  <div style={{display:"flex", flexDirection:"row", gap:"2rem"}}>
    <div className={styles.workHistoryContainer}>
      
      <button
        className={styles.addWorkButton}
        onClick={() => setIsModalOpen(true)}
      >
        Add Work
      </button>

      {userProfile?.pastWork?.map((work, index) => (
        <div key={index} className={styles.workCard}>
          <h3>{work.position}</h3>
          <p>{work.company}</p>
          <span>{work.years}</span>
        </div>
      ))}

    </div>
  </div>

  {/* ---------- EDUCATION SECTION ---------- */}

  <h4>Education</h4>

  <div style={{display:"flex", flexDirection:"row", gap:"2rem"}}>
    <div className={styles.workHistoryContainer}>

      <button
        className={styles.addWorkButton}
        onClick={() => setIsEducationModalOpen(true)}
      >
        Add Education
      </button>

      {userProfile?.education?.map((edu, index) => (
        <div key={index} className={styles.workCard}>
          <h3>{edu.degree}</h3>
          <p>{edu.school}</p>
          <span>{edu.fieldOfStudy}</span>
        </div>
      ))}
    </div>
  </div>
</div>
              </div>
              
              <div className={styles.profileRightSection}>
                 {userProfile != authState.user && <div style={{display:"flex", alignContent:"flex-end"}}>
            <button style={{width:"100%"}} className={styles.connectButton} onClick={()=>{
             updateProfileData();
            }}>Update Profile</button>
            </div>}
                <h3 className={styles.recentTitle}>Recent Activity</h3>
                {userPosts.length === 0 ? (
                  <p className={styles.noRecent}>No recent activity</p>
                ) : (
                  <div className={styles.recentList}>
                    {userPosts.map((post) => (
                      <article key={post._id} className={styles.postCard}>
                        {post.media && (
                          <img
                            src={getMediaUrl(post.media)}
                            alt="Post Image"
                            className={styles.postImage}
                          />
                        )}
                        <div className={styles.postContent}>
                          <p className={styles.postBody}>{post.body}</p>
                          <div className={styles.meta}>
                            <span className={styles.date}>
                              {post.created_at
                                ? new Date(post.created_at).toLocaleDateString()
                                : ""}
                            </span>
                            <span className={styles.likes}>
                              {post.likes || 0} likes
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
            </div>
         
        </div>
        
      
      
}

 {
          isModalOpen &&
          <div className={styles.commentsContainer} onClick={()=>setIsModalOpen(false)}>
            <div className={styles.allCommentsContainer} onClick={(e)=>{
              e.stopPropagation()
            }}>

  <div style={{display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem', width:"100%", justifyContent:"space-around"}}>
    <h2 style={{textAlign: 'center'}}>Add Work Experience</h2>
     <input
                  className={styles.inputField}
                  type="text"
                  placeholder="Enter Company"
                  name='company'
                  value={inputData.company}
                  onChange={handleWorkInputChange}
                   />
                <input
                  className={styles.inputField}
                  type="text"
                  placeholder="Enter Position"
                  name='position'
                  value={inputData.position}
                  onChange={handleWorkInputChange}
                   />
                <input
                  className={styles.inputField}
                  type="number"
                  placeholder="Enter Duration in Years"
                  name='years'
                  value={inputData.years}
                  onChange={handleWorkInputChange}
                   />
                <div>
                  <button style={{width:"100%", height:"50px"}} className={styles.connectButton} onClick={()=>{
              if (!inputData.company && !inputData.position && !inputData.years) return;
             setUserProfile(prev => ({...prev, pastWork:[...(prev.pastWork || []), inputData]}));
             setIsModalOpen(false);
             setInputData({company:'', position:'', years:''});
            }}>Update Profile</button>
            </div>
  </div>

            </div> 
          </div> 
        }

         {
          isEducationModalOpen &&
          <div className={styles.commentsContainer} onClick={()=>setIsEducationModalOpen(false)}>
            <div className={styles.allCommentsContainer} onClick={(e)=>{
              e.stopPropagation()
            }}>

  <div style={{display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem', width:"100%", justifyContent:"space-around"}}>
    <h2 style={{textAlign: 'center'}}>Add Education</h2>
     <input
                  className={styles.inputField}
                  type="text"
                  placeholder="Enter School / Institute"
                  name='school'
                  value={inputDataEducation.school}
                  onChange={handleEducationInputChange}
                   />
                <input
                  className={styles.inputField}
                  type="text"
                  placeholder="Enter Degree"
                  name='degree'
                  value={inputDataEducation.degree}
                  onChange={handleEducationInputChange}
                   />
                <input
                  className={styles.inputField}
                  type="text"
                  placeholder="Enter Field of Study"
                  name='fieldOfStudy'
                  value={inputDataEducation.fieldOfStudy}
                  onChange={handleEducationInputChange}
                   />
                <div>
                  <button style={{width:"100%", height:"50px"}} className={styles.connectButton} onClick={()=>{
              if (!inputDataEducation.school && !inputDataEducation.degree && !inputDataEducation.fieldOfStudy) return;
          setUserProfile(prev => ({
  ...prev,
  education: [
    ...(prev.education || []),
    inputDataEducation
  ]
}));

             setIsEducationModalOpen(false);
             setInputDataEducation({school:'', degree:'', fieldOfStudy:''});
            }}>Update Profile</button>
            </div>
  </div>

            </div> 
          </div> 
        }

        </DashboardLayout>
      </UserLayout>
    </div>
  )
}

export default ProfilePage
