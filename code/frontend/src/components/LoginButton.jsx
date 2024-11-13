import { signInWithGoogle } from "@database/users";
import styles from "@styles/LoginButton.module.scss";
import { FcGoogle } from "react-icons/fc";

const LoginButton = (props) => {
	const { text } = props;

	return (
		<>
			<div className={styles["signInButtonContainer"]}>
				<button className={styles["signInButton"]} onClick={signInWithGoogle}>
					<span className={styles["googleIcon"]}>
						<FcGoogle />
					</span>
					<span className={styles["name"]}>{text ?? "Sign in"}</span>
				</button>
			</div>
		</>
	);
};

export default LoginButton;
