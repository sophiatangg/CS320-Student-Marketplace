import LoginButton from "@components/LoginButton";
import { useAuth } from "@providers/AuthProvider";
import { useContextDispatch } from "@providers/StoreProvider";
import styles from "@styles/Login.module.scss";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const navigate = useNavigate();

	const dispatch = useContextDispatch();

	const { currentUser } = useAuth();

	useEffect(() => {
		if (currentUser) return;
		navigate("/");
	}, [currentUser]);

	useEffect(() => {
		dispatch({
			type: "SET_LOADING",
			payload: false,
		});
	}, [dispatch]);

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
