import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "./style.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);

  const router = useRouter();

  const dispatch = useDispatch();

  const [userLoginMethod, setUserLoginMethod] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [ name, setName] = useState("");

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn, router]);

  useEffect(()=>{
    dispatch(emptyMessage());
  }, [userLoginMethod, dispatch])

const handleRegister = () => {
  console.log("REGISTER DATA:", { username, name, email, password });
  dispatch(registerUser({ username, name, email, password }));
};

const handleLogin = () => {
  dispatch(loginUser({email, password}))
  console.log("Logging")
}


  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardLeftHeading}>
              {userLoginMethod ? "Sign In" : "Sign Up"}
            </p>
            <p style={{color: authState.isError?"Red":"Green"}}>{authState.message.message}</p>

            <div className={styles.inputContainers}>
              {!userLoginMethod && <div className={styles.inputRow}>
                <input
                  className={styles.inputField}
                  type="text"
                  placeholder="Username"
                  onChange={(e)=>setUsername(e.target.value)}
                />
                <input type="text" className={styles.inputField} placeholder="Name" onChange={(e)=> setName(e.target.value)}/>
              </div>}
                <input type="text" className={styles.inputField} placeholder="Email" onChange={(e)=>setEmail(e.target.value)}/>

                <input type="password" className={styles.inputField} placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
                <div className={styles.buttonWithOutline} onClick={()=> {
                  if(userLoginMethod){
                    handleLogin()
                  }
                  else{
                    handleRegister()
                  }
                }}>
                    {userLoginMethod?"Sign In": "Sign Up"}
                </div>
            </div>
          </div>
          <div className={styles.cardContainer_right}>
              {userLoginMethod? <p> Dont have an Account?</p>:<p>Already have an Account?</p>}
             <div style={{color:"black"}} className={styles.buttonWithOutline}  onClick={()=> {
                  setUserLoginMethod(!userLoginMethod)
                }} >
                    {userLoginMethod?"Sign Up": "Sign In"}
                </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
