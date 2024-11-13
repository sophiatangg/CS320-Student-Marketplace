import LoginButton from "@components/LoginButton";
import styles from "@styles/Login.module.scss";
import { useEffect } from "react";

const Login = () => {
	useEffect(() => {}, []);

	return (
		<>
			<div className={styles["login"]}>
				<div className={styles["container"]}>
					<h1 className={styles["title"]}>
						Use your <span className={styles["umass"]}>@umass.edu</span> account now!
					</h1>
					<LoginButton text={"Continue with Google"} />
				</div>
			</div>
		</>
	);
};

export default Login;
