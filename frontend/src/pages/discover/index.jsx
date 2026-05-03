import { getAllUsers } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";

const DiscoverPage = () => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, []);

  return (
    <UserLayout>
          <DashboardLayout>
       <h1 style={{paddingLeft:"2rem"}}>Discover</h1>
      <div className={styles.allUserProfile}>
        {authState.all_profiles_fetched && authState.all_users.map((user)=>{
          return (
            <div key={user._id} className={styles.userCard} onClick={()=> router.push(`/view_profile/${user.userId.username}`)}>
              <img src={user.userId.profilePicture?.startsWith('http') ? user.userId.profilePicture : `${BASE_URL}/uploads/${user.userId.profilePicture}`} alt="Profile" />
              <div>
 <h1>{user.userId.name}</h1>
              <p>{user.userId.username}</p>
              </div>
             
              </div>
          )
        })}
      </div>
    </DashboardLayout>
    </UserLayout>

  );
};

export default DiscoverPage;


