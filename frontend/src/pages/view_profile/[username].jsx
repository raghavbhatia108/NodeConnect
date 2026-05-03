import { BASE_URL, clientServer } from "@/config";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import {
  getConnectionsRequests,
  sendConnectionRequest,
} from "@/config/redux/action/authAction";
import { useRouter } from "next/router";

const ViewProfilePage = ({ userProfile }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const postState = useSelector((state) => state.postReducer);
  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);
  const [isConnectionNull, setIsConnectionNull] = useState(true);

  // Fetch posts and connection requests on mount
  useEffect(() => {
    dispatch(getAllPosts());
    dispatch(getConnectionsRequests({ token: localStorage.getItem("token") }));
  }, [dispatch]);

  // helper to normalize media paths and provide fallback
  const getMediaUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const cleanPath = path.replace(/\\/g, "/");
    if (cleanPath.startsWith("uploads/")) return `${BASE_URL}/${cleanPath}`;
    return `${BASE_URL}/uploads/${cleanPath}`;
  };

  useEffect(() => {
    if (!postState || !Array.isArray(postState.posts)) return;
    const posts = postState.posts.filter(
      (post) => post.userId?.username === router.query.username,
    );
    setUserPosts(posts);
  }, [postState.posts, router.query.username]);

  useEffect(() => {
    const requests = authState.connectionRequests || [];
    console.log("Connection requests:", requests);
    console.log("Viewing user ID:", userProfile.userId._id);

    const matched = requests.find(
      (req) => req.otherUser?._id === userProfile.userId._id,
    );

    console.log("Matched request:", matched);

    if (matched) {
      setIsCurrentUserInConnection(true);
      setIsConnectionNull(matched.status_accepted === null);
    } else {
      setIsCurrentUserInConnection(false);
      setIsConnectionNull(true);
    }
  }, [authState.connectionRequests, userProfile.userId._id]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backdropContainer}>
            <img
              src={getMediaUrl(userProfile.userId.profilePicture)}
              alt=""
              className={styles.backdrop}
            />
          </div>
          <div className={styles.profileContainer_details}>
            <div className={styles.profileMainWrapper}>
              <div className={styles.profileLeftSection}>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                    paddingTop: "5rem",
                    gap: "2rem",
                  }}
                >
                  <h1>{userProfile.userId.name}</h1>
                  <p style={{ color: "gray" }}>
                    @{userProfile.userId.username}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {authState.user &&
                  authState.user._id === userProfile.userId._id ? (
                    <button className={styles.connectedButton} disabled>
                      Your Profile
                    </button>
                  ) : isCurrentUserInConnection ? (
                    <button className={styles.connectedButton}>
                      {isConnectionNull ? "Pending" : "Connected"}
                    </button>
                  ) : (
                    <button
                      className={styles.connectButton}
                      onClick={async () => {
                        console.log(
                          "Connect button clicked for user:",
                          userProfile.userId._id,
                        );
                        console.log("Token:", localStorage.getItem("token"));
                        try {
                          const result = await dispatch(
                            sendConnectionRequest({
                              token: localStorage.getItem("token"),
                              user_id: userProfile.userId._id,
                            }),
                          );
                          console.log("Send connection result:", result);
                          // Refresh connection requests after successful send
                          dispatch(
                            getConnectionsRequests({
                              token: localStorage.getItem("token"),
                            }),
                          );
                        } catch (error) {
                          console.error(
                            "Failed to send connection request:",
                            error,
                          );
                          // Could show an error message to user here
                        }
                      }}
                    >
                      Connect
                    </button>
                  )}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                    width={40}
                    style={{ paddingLeft: "1rem" }}
                    onClick={async () => {
                      const response = await clientServer.get(
                        `/users/download_resume?id=${userProfile.userId._id}`,
                      );
                      window.open(
                        `${BASE_URL}/${response.data.message}`,
                        "_blank",
                      );
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                </div>

                <div>
                  <p>{userProfile.bio}</p>
                </div>
                <div className={styles.workHistory}>
                  <h4>Work History</h4>
                  <div className={styles.workHistoryContainer}>
                    {userProfile.pastWork.map((work, index) => {
                      return (
                        <div key={index} className={styles.workCard}>
                          <h3>{work.position}</h3>
                          <p>{work.company}</p>
                          <span>
                            {work.startDate} - {work.endDate || "Present"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className={styles.workHistory}>
                  <h4>Education</h4>
                  <div className={styles.workHistoryContainer}>
                    {userProfile?.education &&
                    userProfile.education.length > 0 ? (
                      userProfile.education.map((edu, index) => (
                        <div key={index} className={styles.workCard}>
                          <h3>{edu.school}</h3>
                          <p>{edu.degree}</p>
                          <span>{edu.fieldOfStudy}</span>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: "gray" }}>No education listed</p>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.profileRightSection}>
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
      </DashboardLayout>
    </UserLayout>
  );
};

export default ViewProfilePage;

export async function getServerSideProps(context) {
  console.log("USERNAME PARAM:", context.query.username);

  const request = await clientServer.get(
    "/users/get_profile_based_on_username",
    {
      params: {
        username: context.query.username, // Use the username from the URL context
      },
    },
  );
  const response = await request.data;
  console.log("PROFILE DATA FETCHED:", response);
  // Pass data to the page via props
  return { props: { userProfile: request.data } };
}
