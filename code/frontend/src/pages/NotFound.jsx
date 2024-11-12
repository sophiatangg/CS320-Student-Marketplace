import _404 from "@media/image/404.png";
import { useContextDispatch } from "@stores/StoreProvider";
import styles from "@styles/NotFound.module.scss";
import { PROJECT_NAME } from "@utils/main";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const animations = {
	initial: { opacity: 0, y: -225 },
	animate: { opacity: 1, y: 0, transition: { y: { type: "spring", duration: 1.5, bounce: 0.5 } } },
	exit: {
		opacity: 0,
		y: -175,
		transition: { y: { type: "tween", duration: 0.675, bounce: 0.5 }, opacity: { type: "tween", duration: 0.675 } },
	},
};

const progress = {
	initial: { width: 0 },
	animate: { width: 700, transition: { width: { type: "tween", duration: 7 } } },
};

const NotFound = (props) => {
	const navigate = useNavigate();
	const dispatch = useContextDispatch();

	const handleBrowse = async () => {
		navigate("/browse");

		dispatch({
			type: "SET_CART_DISPLAYED",
			payload: false,
		});

		dispatch({
			type: "SET_TRADE_DISPLAYED",
			payload: false,
		});
	};

	const { pathname } = useLocation();

	useEffect(() => {
		document.title = `${PROJECT_NAME} — 404 (Not Found)`;
	}, []);

	useEffect(() => {
		setTimeout(handleBrowse, 6800);
	}, []);

	return (
		<div className={styles["notFound"]}>
			<motion.div className={styles["container"]} variants={animations} initial="initial" animate="animate" exit="exit">
				<div className={styles["notFoundContent"]}>
					<img className={styles["notFoundImg"]} src={`${_404}`} alt="Not Found Warning" />
					<div className={styles["notFoundText"]}>
						<h2>
							<span>{pathname}</span> is not available!
						</h2>
						<p>
							The page you tried to access is not available. You will be redirected to our browse section shortly. If you think this is
							an error, <span className={styles["contact"]}>contact us!</span>
						</p>
					</div>
				</div>
				<motion.div className={styles["progressBar"]} variants={progress} initial="initial" animate="animate"></motion.div>
			</motion.div>
		</div>
	);
};

export default NotFound;
