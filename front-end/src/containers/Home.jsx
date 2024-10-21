import cns from "@/utils/classNames";
import Cart from "@components/Cart";
import NavBar from "@components/NavBar";
import Pyke from "@media/image/pyke.mp4";
import styles from "@styles/Home.module.scss";
import games from "@utils/games";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import { GiDiceFire } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

const Home = (props) => {
	const {
		shownGames,
		cartAmount,
		cart,
		cartDisplayed,
		handleOpenCart,
		handleCloseCart,
		clearCart,
		handleRemoveFromCart,
		overlap,
		setOverlap,
		openGamePage,
	} = props;

	const [browsing, setBrowsing] = useState(false);
	const [landingPage, setLandingPage] = useState(true);

	const navigate = useNavigate();

	const handleHover = (e) => {};

	const handleBrowse = () => {
		setOverlap(true);
		setTimeout(() => {
			setBrowsing(true);
			navigate("/react-ecommerce-store/browse");
		}, 1500);
	};

	const handleHome = () => {
		setBrowsing(false);
		navigate("/");
	};

	const handleNavGamePage = () => {
		navigate("/react-ecommerce-store/games/riseofthetombraider");
	};

	const handleNavNotFoundPage = () => {
		navigate("/react-ecommerce-store/this-page");
	};

	const handleNavNotFoundQuery = () => {
		navigate("/react-ecommerce-store/games/404");
	};

	const handlePlayDice = () => {
		let randomIndex = Math.floor(Math.random() * 32);
		let randomSurname = games[randomIndex].surname;
		setOverlap(true);
		setTimeout(() => {
			setBrowsing(true);
			navigate(`/react-ecommerce-store/games/${randomSurname}`);
		}, 1500);
	};

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
			<NavBar
				handleHover={handleHover}
				browsing={browsing}
				handleBrowse={handleBrowse}
				handleHome={handleHome}
				landingPage={landingPage}
				cartAmount={cartAmount}
				handleOpenCart={handleOpenCart}
				handleCloseCart={handleCloseCart}
				component={"home"}
			/>
			<div className={styles["main"]}>
				{overlap ? (
					<motion.div className={styles["overlap"]} variants={buttonVariants} initial="hidden" animate="visible"></motion.div>
				) : null}

				{cartDisplayed ? (
					<Cart
						cartDisplayed={cartDisplayed}
						handleOpenCart={handleOpenCart}
						handleCloseCart={handleCloseCart}
						cart={cart}
						cartAmount={cartAmount}
						handleHover={handleHover}
						clearCart={clearCart}
						handleRemoveFromCart={handleRemoveFromCart}
						openGamePage={openGamePage}
					/>
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
								<button className={styles["cta"]} onClick={handlePlayDice} aria-label="Open random game page">
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
