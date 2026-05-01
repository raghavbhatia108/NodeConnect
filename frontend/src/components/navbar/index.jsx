import React from 'react'
import styles from './styles.module.css'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setTokenIsNotThere, reset } from '@/config/redux/reducer/authReducer'

const NavbarComponent = () => {
    const authState = useSelector((state)=> state.auth)
    const router = useRouter();
    const dispatch = useDispatch();
  return (
    <div className={styles.container}>

        <nav className={styles.navbar}>
            <img onClick={()=> router.push("/")} src='/images/logo.png' ></img>

            <div className={styles.navBarOptionContainer}>
                {
                    authState.profileFetched && <div style={{display: "flex", gap:"1.2rem"}}>
                        <p>Hey, {authState.user.userId.name}</p>
                        <p style={{fontWeight:"bold", cursor:"pointer"}} onClick={()=>router.push("/profile")}>Profile</p>
                        <p style={{fontWeight:"bold", cursor:"pointer"}} onClick={()=>{localStorage.removeItem("token"), dispatch(setTokenIsNotThere());
        dispatch(reset());router.push('/login')}}>Log Out</p>

                        </div>
                }
                {!authState.profileFetched && <div onClick={()=>router.push("/login")} className={styles.buttonJoin}>
                    <p>Be a part!</p>
                </div>}
                
            </div>
        </nav>
    </div>
  )
}

export default NavbarComponent
