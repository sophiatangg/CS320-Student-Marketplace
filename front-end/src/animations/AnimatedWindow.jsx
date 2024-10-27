import { motion } from "framer-motion";

const animations = {
	initial: { opacity: 1 },
	animate: { opacity: 1, transition: { opacity: { type: "spring", duration: 2, bounce: 0.4 } } },
	exit: { opacity: 0, transition: { opacity: { type: "spring", duration: 2, bounce: 0.3 } } },
};

const AnimatedWindow = ({ children }) => {
	return (
		<motion.div variants={animations} initial="initial" animate="animate" exit="exit">
			{children}
		</motion.div>
	);
};

export default AnimatedWindow;
