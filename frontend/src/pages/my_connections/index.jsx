import { BASE_URL } from "@/config";
import {
  acceptConnectionRequest,
  getConnectionsRequests,
} from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { use, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { useRouter } from "next/router";

const MyConnectionsPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getConnectionsRequests({ token: localStorage.getItem("token") }));
  }, [dispatch]);

  useEffect(() => {
    console.log(
      "authState in MyConnectionsPage:",
      authState.connectionRequests,
    );
  }, [authState.connectionRequests]);

  const incomingRequests = authState.connectionRequests.filter(
    (request) =>
      request.direction === "received" && request.status_accepted === null,
  );

  const acceptedConnections = authState.connectionRequests.filter(
    (request) => request.status_accepted === true,
  );

  return (
    <UserLayout>
      <DashboardLayout>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.7rem" }}
        >
          {incomingRequests.length === 0 && (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              No pending connection requests
            </p>
          )}

          <div className={styles.myConnections}>
            {incomingRequests.map((request, index) => {
              return (
                <div
                  className={styles.userCard}
                  key={request._id || index}
                  onClick={() => {
                    router.push(`/view_profile/${request.otherUser.username}`);
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                    }}
                  >
                    <div className={styles.profilePicture}>
                      <img
                        src={request.otherUser.profilePicture?.startsWith('data:') ? request.otherUser.profilePicture : `${BASE_URL}/uploads/${request.otherUser.profilePicture}`}
                        alt=""
                      />
                    </div>

                    <div className={styles.userInfo}>
                      <h3>{request.otherUser.name}</h3>
                      <p>{request.otherUser.username}</p>
                    </div>
                    <button
                      className={styles.connectButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(
                          acceptConnectionRequest({
                            token: localStorage.getItem("token"),
                            requestId: request._id,
                            action_type: "accept",
                          }),
                        );
                      }}
                    >
                      Accept
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.myConnections}>
            <h1>My Network</h1>

            {acceptedConnections.length === 0 ? (
              <p style={{ textAlign: "center", marginTop: "20px" }}>
                No connections yet
              </p>
            ) : (
              acceptedConnections.map((request, index) => {
                return (
                  <div
                    className={styles.userCard}
                    key={request._id || index}
                    onClick={() => {
                      router.push(`/view_profile/${request.otherUser.username}`);
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2rem",
                      }}
                    >
                      <div className={styles.profilePicture}>
                        <img
                          src={request.otherUser.profilePicture?.startsWith('data:') ? request.otherUser.profilePicture : `${BASE_URL}/uploads/${request.otherUser.profilePicture}`}
                          alt=""
                        />
                      </div>

                      <div className={styles.userInfo}>
                        <h3>{request.otherUser.name}</h3>
                        <p>{request.otherUser.username}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
};

export default MyConnectionsPage;
