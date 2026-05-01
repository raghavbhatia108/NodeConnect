
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";

const inter = Inter({
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();

  return (
  
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer_left}>
            <p>Connect with Friends without Exaggeration</p>
            <p>A True Social Media Platform, with Stories no Blufs</p>
            <div
              onClick={() => {
                router.push("/login");
              }}
              className={styles.buttonJoin}
            >
              <p>Join Now</p>
            </div>
          </div>
          <div className={styles.mainContainer_right}>
            <img src="images/Connected_nodes.svg" alt="" width="500px"/>
          </div>
        </div>
      </div>
      </UserLayout>
  );
}
