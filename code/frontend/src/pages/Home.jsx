import Pyke from "@media/image/pyke.mp4";
import { useContextSelector } from "@stores/StoreProvider";
import styles from "@styles/Home.module.scss";
import cns from "@utils/classNames";
import { PROJECT_NAME } from "@utils/main";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import { GiDiceFire } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

const Home = (props) => {
	const { overlap, setOverlap } = props;

	const [browsing, setBrowsing] = useState(false);
	const [landingPage, setLandingPage] = useState(true);

	const { allItems } = useContextSelector("itemsStore");

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

	const variants = {
		hidden: { opacity: 1, x: -150 },
		visible: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: 150 },
	};

	const buttonVariants = {
		hidden: { opacity: 0, y: 900 },
		visible: { opacity: 1, y: 0, transition: { y: { type: "tween", duration: 1.5, bounce: 0.3 } } },
	};

	return (
		<>
			<div className={styles["main"]}>
				{overlap ? (
					<motion.div className={styles["overlap"]} variants={buttonVariants} initial="hidden" animate="visible"></motion.div>
				) : null}

				<div className={styles["home"]}>
					<video autoPlay muted loop className={styles["video"]}>
						<source src={`${Pyke}`} type="video/mp4" />
					</video>
					<div className={styles["container"]}>
						<div className={styles["left"]}>
							<div className={cns(styles["splash"], styles["blur"])}>
								<p className={styles["intro"]}>Your personalized UMass Student Marketplace.</p>
							</div>

							<div className={cns(styles["buttons"], styles["blur"])}>
								<button className={`${styles["cta"]} ${styles["browseBtn"]}`} onClick={handleBrowse} aria-label="Browse">
									<FaShoppingBasket className={styles["ctaSVG"]} style={{ width: 25, height: 25 }} />
									<span>Browse</span>
								</button>
								<button className={styles["cta"]} onClick={handlePlayDice} aria-label="Open random item page">
									<GiDiceFire className={styles["ctaSVG"]} style={{ width: 25, height: 25 }} />
									<span>Random</span>
								</button>
							</div>
						</div>

						<div className={styles["right"]}></div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;
