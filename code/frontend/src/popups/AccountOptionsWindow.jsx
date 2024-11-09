import { useContextDispatch, useContextSelector } from "@stores/StoreProvider";
import styles from "@styles/AccountOptionsWindow.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const animationVariants = {
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			type: "spring",
		},
	},
	hidden: {
		opacity: 0,
		y: 20,
		transition: {
			duration: 0.5,
			type: "spring",
		},
	},
};

const AccountOptionsWindow = () => {
	const windowRef = useRef(null);
	const [isExiting, setIsExiting] = useState(false);

	const { accountInfoDisplayed } = useContextSelector("displayStore");
	const dispatch = useContextDispatch();

	const handleWindowRemoval = (e) => {
		if (windowRef.current && !windowRef.current.contains(e.target)) {
			dispatch({
				type: "SET_ACCOUNT_OPTIONS_DISPLAYED",
				payload: false,
			});

			setIsExiting(true);
		}
	};

	useEffect(() => {
		document.addEventListener("click", handleWindowRemoval);

		return () => {
			document.removeEventListener("click", handleWindowRemoval);
		};
	}, [accountInfoDisplayed, dispatch]);

	return (
		<AnimatePresence key={"window"}>
			{accountInfoDisplayed && (
				<motion.div
					ref={windowRef}
					className={styles["accountOptions"]}
					style={{ backgroundColor: "var(--popOutBgColor)" }}
					initial="hidden"
					animate="visible"
					exit="hidden"
					variants={animationVariants}
					onAnimationComplete={(definition) => {
						if (definition === "hidden" && isExiting) {
							dispatch({
								type: "SET_ACCOUNT_OPTIONS_DISPLAYED",
								payload: false,
							});

							setIsExiting(false);
						}
					}}
				>
					<a>Account Option 1</a>
					<a>Account Option 2</a>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default AccountOptionsWindow;
