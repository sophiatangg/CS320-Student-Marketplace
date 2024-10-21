import Cart from "@components/Cart";
import NavBar from "@components/NavBar";
import _404 from "@media/image/404.png";
import styles from "@styles/NotFound.module.scss";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NotFound = (props) => {
	const {
		cartDisplayed,
		handleCloseCart,
		handleOpenCart,
		cartAmount,
		clearCart,
		handleHome,
		handleHover,
		handleBrowse,
		cart,
		browsing,
		landingPage,
		search,
		searching,
		handleSearch,
		handleSearchSubmit,
		handleRemoveFromCart,
		openGamePage,
	} = props;
	const location = useLocation();

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

	useEffect(() => {
		setTimeout(handleBrowse, 6800);
	}, []);

	return (
		<div className={styles["notFound"]}>
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

			<NavBar
				handleHover={handleHover}
				handleHome={handleHome}
				browsing={browsing}
				landingPage={landingPage}
				cartAmount={cartAmount}
				search={search}
				searching={searching}
				handleSearch={handleSearch}
				handleSearchSubmit={handleSearchSubmit}
				handleOpenCart={handleOpenCart}
				handleCloseCart={handleCloseCart}
			/>

			<motion.div className={styles["container"]} variants={animations} initial="initial" animate="animate" exit="exit">
				<div className={styles["notFoundContent"]}>
					<img className={styles["notFoundImg"]} src={`${_404}`} alt="Not Found Warning" />
					<div className={styles["notFoundText"]}>
						<h2>
							<span>{location.pathname.substring(22)}</span> is not available!
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
