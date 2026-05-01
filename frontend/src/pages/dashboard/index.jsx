import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllComments, getAllPosts, incrementLikes, postComment } from "@/config/redux/action/postAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react"; // Removed unused imports
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";
import { createPost } from "@/config/redux/action/postAction";
import { deletePost } from "@/config/redux/action/postAction";
import { reset } from "@/config/redux/reducer/authReducer";
import { resetPostId } from "@/config/redux/reducer/postReducer";

const Dashboard = () => {
  const postState = useSelector((state) => state.postReducer);
  const dispatch = useDispatch();
  const router = useRouter();

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState();
  const [commentText, setCommentText] = useState("");

  const handleUpload = async () => {
    await dispatch(createPost([fileContent, postContent]));
    setPostContent("");
    setFileContent(null);
    dispatch(getAllPosts());
  };

  // safe navigation: default to empty object if auth is undefined
  const authState = useSelector((state) => state.auth || {});

  const getMediaUrl = (path) => {
  if (!path) return `${BASE_URL}/uploads/default.jpg`; // Fallback image

  // 1. Clean up Windows backslashes
  let cleanPath = path.replace(/\\/g, "/");

  // 2. Check if path already starts with "uploads/" to avoid double "/uploads/uploads/"
  if (cleanPath.startsWith("uploads/")) {
      return `${BASE_URL}/${cleanPath}`;
  }

  // 3. If it's just a filename, add the uploads prefix
  return `${BASE_URL}/uploads/${cleanPath}`;
};


  // 2. Fetch data ONLY when token is confirmed and ONLY ONCE
  useEffect(() => {
    if (authState.isTokenThere) {
      const token = localStorage.getItem("token");
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token }));
    }
  }, [dispatch, authState.isTokenThere]); // ✅ Added dependency array

  console.log("USER STATE:", authState.user);

  if (authState.profileFetched) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className={styles.wrapper}>
            <div className={styles.scrollComponent}>
              <div className={styles.createPostContainer}>
                <img
                  src={`${BASE_URL}/uploads/${authState.user.userId.profilePicture}`}
                  alt="Profile"
                  width={100}
                  className={styles.userProfile}
                />
                <textarea
                  value={postContent}
                  name=""
                  id=""
                  className={styles.textAreaOfContent}
                  placeholder="What's in your mind?"
                  onChange={(e) => setPostContent(e.target.value)}
                ></textarea>
                <label htmlFor="fileUpload">
                  <div className={styles.fab}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </div>
                </label>
                <input
                  hidden
                  type="file"
                  id="fileUpload"
                  onChange={(e) => setFileContent(e.target.files[0])}
                />
                {postContent.length > 0 && (
                  <div className={styles.uploadButton} onClick={handleUpload}>
                    Post
                  </div>
                )}
              </div>
              <div className={styles.postsContainer}>
                {postState.posts.map((post) => {
  const mediaUrl = post.media?.replace(/\\/g, "/");
console.log("MEDIA URL:", mediaUrl);
console.log(post)
                  return (
                    <div key={post._id} className={styles.singleCard}>
                      <div className={styles.singleCard_ProfileContainer}>
                        <img
                          src={getMediaUrl(post.userId?.profilePicture || authState.user?.profilePicture)}
                          alt="Profile"
                          className={styles.userProfile}
                        />
                        <div style={{width:"100%"}}>
                          <div style={{width:"100%", display:"flex", alignItems:"center", gap:"0.6rem", justifyContent:"space-between"}}>
                            <div>
                              <p style={{ fontWeight: "bold", margin: 0 }}>{post.userId.name}</p>
                              <p style={{color:"gray", fontSize:"0.88rem", margin: 0}}>@{post.userId.username}</p>
                            </div>
                            {post.userId._id === authState.user.userId._id && (
                              <div style={{cursor:"pointer", flexShrink: 0}} onClick={async () => {
                                await dispatch(deletePost({post_id: post._id}));
                                await dispatch(getAllPosts());
                              }}>
                                <svg style={{width:"1.2em", color:"#ef4444"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {post.body && (
                        <div className={styles.singleCard_body}>
                          <p>{post.body}</p>
                        </div>
                      )}
                      {mediaUrl && (
                        <div className={styles.singleCard_image}>
                          <img src={`${BASE_URL}/${mediaUrl}`} alt="" />
                        </div>
                      )}
                      <div className={styles.optionContainer}>
                        <div className={styles.singleOption_optionContainer}
                          onClick={async () => {
                            await dispatch(incrementLikes({ post_id: post._id }));
                            await dispatch(getAllPosts());
                          }}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width:"20px",height:"20px"}}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                          </svg>
                          <p>{post.likes} Likes</p>
                        </div>
                        <div className={styles.singleOption_optionContainer} onClick={() => { dispatch(getAllComments({ post_id: post._id })) }}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width:"20px",height:"20px"}}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                          </svg>
                          <p>Comment</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </DashboardLayout>
        {
          postState.postId !== "" &&
          <div className={styles.commentsContainer} onClick={()=>{dispatch(resetPostId())}}>
            <div className={styles.allCommentsContainer} onClick={(e)=>{
              e.stopPropagation()
            }}>
{postState.comments.length === 0 ? (
  <h2>No comments yet</h2>
) : (
  <div style={{display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem'}}>
    {postState.comments.map((c) => (
      <div key={c._id} style={{display:'flex', gap: '0.6rem', alignItems: 'flex-start'}}>
        <img src={getMediaUrl(c.userId?.profilePicture || '')} alt="Profile" style={{width:40, height:40, borderRadius: '50%'}} />
        <div style={{width: '100%'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <p style={{fontWeight:'bold', margin:0}}>{c.userId?.name || 'Unknown'}</p>
              <p style={{color:'gray', margin:0}}>{c.userId?.username}</p>
            </div>
          </div>
          <p style={{marginTop: '0.4rem'}}>{c.body}</p>
        </div>
      </div>
    ))}
  </div>
)}

<div className={styles.postCommentContainer}>
  <input type="text" value={commentText} onChange={(e)=>{setCommentText(e.target.value)}} placeholder="Comment"/>
  <div onClick={async() => {
    if(!commentText || commentText.trim() === '') return;
    const res = await dispatch(postComment({post_id: postState.postId, body: commentText}));
    if(res.meta && res.meta.requestStatus === 'fulfilled'){
      setCommentText('');
    }
    await dispatch(getAllComments({post_id: postState.postId}));
  }} className={styles.commentBtn}>
    <p>Comment</p>
  </div>
</div>
            </div>
            
            </div>
            
        }
      </UserLayout>
    );
  } else {
    return (
      <UserLayout>
        <DashboardLayout>
          <div>Loading...</div>
        </DashboardLayout>
      </UserLayout>
    );
  }
};

export default Dashboard;
