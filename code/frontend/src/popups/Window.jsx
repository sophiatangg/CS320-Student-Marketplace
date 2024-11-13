import { useContextDispatch } from "@stores/StoreProvider";
import styles from "@styles/Window.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const animations = {
	initial: {
		opacity: 0,
	},
	animate: {
		opacity: 1,
	},
	exit: {
		opacity: 0,
	},
};

const Window = (props) => {
	const { dispatchType, children } = props;

	const [isVisible, setIsVisible] = useState(true);

	const dispatch = useContextDispatch();

	const handleCloseWindow = () => {
		setIsVisible(!isVisible);
	};

	return (
		<div className={styles["window"]}>
			<div className={styles["windowBG"]} onClick={handleCloseWindow}></div>
			<AnimatePresence key={dispatchType}>
				{isVisible && (
					<motion.div
						variants={animations}
						initial="initial"
						animate="animate"
						exit="exit"
						onAnimationComplete={(definition) => {
							if (definition === "exit") {
								dispatch({
									type: dispatchType,
									payload: false,
								});
							}
						}}
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Window;
