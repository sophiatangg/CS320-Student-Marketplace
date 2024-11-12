import { useContextSelector } from "@stores/StoreProvider";
import styles from "@styles/Home.module.scss";
import cns from "@utils/classNames";
import { PROJECT_NAME } from "@utils/main";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import { GiDiceFire } from "react-icons/gi";
import { useLocation, useNavigate } from "react-router-dom";

const variants = {
	hidden: { opacity: 1, x: -150 },
	visible: { opacity: 1, x: 0 },
	exit: { opacity: 0, x: 150 },
};

const buttonVariants = {
	hidden: { opacity: 0, y: 900 },
	visible: { opacity: 1, y: 0, transition: { y: { type: "tween", duration: 1.5, bounce: 0.3 } } },
};

const Home = (props) => {
	const [overlap, setOverlap] = useState(false);
	const [browsing, setBrowsing] = useState(false);

	const { allItems } = useContextSelector("itemsStore");

	const { pathname } = useLocation();
	const navigate = useNavigate();

	const handleBrowse = () => {
		setOverlap(true);
		setTimeout(() => {
			setBrowsing(true);
			navigate("/browse");
		}, 1500);
	};

	const handlePlayDice = () => {
		const randomIndex = Math.floor(Math.random() * allItems.length);
		const randomSurname = allItems[randomIndex]?.surname || allItems[randomIndex]?.surName;

		setOverlap(true);
		setTimeout(() => {
			setBrowsing(true);
			navigate(`/store/${randomSurname}`);
		}, 1500);
	};

	useEffect(() => {
		document.title = `${PROJECT_NAME} — Home`;
	}, []);

	useEffect(() => {
		setOverlap(false);
	}, [pathname]);

	return (
		<>
			<div className={styles["main"]}>
				{overlap ? (
					<motion.div className={styles["overlap"]} variants={buttonVariants} initial="hidden" animate="visible"></motion.div>
				) : null}

				<div className={styles["home"]}>
					<div className={styles["container"]}>
						<div className={styles["left"]}>
							<div className={cns(styles["intro"])}>
								<p>
									<span>Your personalized</span>
									<span className={styles["umass"]}> UMass</span>
									<span className={styles["colorize"]}>Student Marketplace</span>.
								</p>
							</div>
						</div>
						<div className={styles["right"]}>
							<div className={cns(styles["buttons"])}>
								<button className={`${styles["button"]} ${styles["browseBtn"]}`} onClick={handleBrowse} aria-label="Browse">
									<p>
										<FaShoppingBasket className={styles["buttonIcon"]} />
										<span>Browse</span>
									</p>
								</button>
								<button className={styles["button"]} onClick={handlePlayDice} aria-label="Open random item page">
									<p>
										<GiDiceFire className={styles["buttonIcon"]} />
										<span>Random</span>
									</p>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;
