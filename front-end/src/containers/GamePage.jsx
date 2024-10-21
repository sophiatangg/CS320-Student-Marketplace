import AddedToCartBig from "@components/AddedToCartBig";
import Cart from "@components/Cart";
import NavBar from "@components/NavBar";
import Slider from "@components/Slider";
import AnimatedGamePage from "@containers/AnimatedGamePage";
import AnimatedText from "@containers/AnimatedText";
import styles from "@styles/GamePage.module.scss";
import templateGame from "@utils/templateGame";
import { useState } from "react";
import { FaChevronUp, FaHeart, FaPlus } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useLocation, useParams } from "react-router-dom";

const GamePage = (props) => {
	const {
		handleHover,
		handleHome,
		landingPage,
		cartAmount,
		cart,
		search,
		searching,
		handleSearch,
		handleSearchSubmit,
		browsing,
		handleBrowse,
		selectedGame,
		setSelectedGame,
		allGames,
		extended,
		setExtended,
		handleAddToCart,
		handleLike,
		textExtended,
		setTextExtended,
		handleOpenCart,
		handleCloseCart,
		cartDisplayed,
		clearCart,
		handleRemoveFromCart,
		openGamePage,
	} = props;

	let { gameId } = useParams();
	const location = useLocation();

	const [carouselState, setCarouselState] = useState(0);
	const [isHover, setIsHover] = useState(false);

	const incrementCarousel = (e) => {
		if (carouselState === 3) {
			setCarouselState(0);
		} else {
			setCarouselState(carouselState + 1);
		}
	};

	const decrementCarousel = (e) => {
		if (carouselState === 0) {
			setCarouselState(3);
		} else {
			setCarouselState(carouselState - 1);
		}
	};

	const extendText = () => {
		setTextExtended(!textExtended);
	};

	const handleExtend = (e) => {
		if (document.getElementById("20").innerHTML === "More") {
			document.getElementById("20").className = "aboutBottom";
		} else if (document.getElementById("20").innerHTML === "Hide") {
			document.getElementById("20").className = "aboutBottomClosed";
		}
		setExtended(!extended);
		if (textExtended === false) {
			setTimeout(extendText, 500);
		} else {
			setTextExtended(!textExtended);
		}
	};

	return (
		<>
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
			<div className={styles["gamepage"]}>
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

				<AnimatedGamePage>
					<div className={styles["gamepageContent"]}>
						<header>
							<button
								className={styles["goBack"]}
								onMouseEnter={handleHover}
								onMouseLeave={handleHover}
								onClick={handleBrowse}
								id="19"
								aria-label="Back"
							>
								<FaArrowLeftLong className={styles["arrow"]} />
								Store
							</button>

							<h1>{selectedGame ? selectedGame.name : templateGame.name}</h1>
						</header>

						<section className={styles["game"]}>
							{
								<Slider
									selectedGame={selectedGame}
									setSelectedGame={setSelectedGame}
									allGames={allGames}
									incrementCarousel={incrementCarousel}
									decrementCarousel={decrementCarousel}
									carouselState={carouselState}
									setCarouselState={setCarouselState}
									handleHover={handleHover}
								/>
							}
							<div className={styles["gameInfo"]}>
								<div className={styles["about"]}>
									<div className={styles["aboutTop"]}>
										<h2>About</h2>
										<p>{selectedGame ? selectedGame.desc : templateGame.desc}</p>
									</div>
									<div
										className={
											extended
												? `${styles["conditionalOpen"]} ${styles["aboutBottom"]}`
												: `${styles["conditionalClose"]} ${styles["aboutBottomClosed"]}`
										}
										id="about"
									>
										<AnimatedText>
											<div className={textExtended ? styles["open"] : styles["closed"]}>
												<a href={selectedGame ? selectedGame.link : templateGame.link} target="_blank">
													{selectedGame ? selectedGame.name : "No"} Website
												</a>
												<h4>Released: {selectedGame ? selectedGame.release : templateGame.release}</h4>
												<h4>Platforms: {selectedGame ? selectedGame.platforms : templateGame.platforms}</h4>
												<h4>Main Genre: {selectedGame ? selectedGame.genre : templateGame.genre}</h4>
												<h4>Developers: {selectedGame ? selectedGame.developers : templateGame.developers}</h4>
												<h4 className={styles["lastChild"]}>
													Publishers: {selectedGame ? selectedGame.publishers : templateGame.publishers}
												</h4>
											</div>
										</AnimatedText>

										<button
											id="20"
											onClick={handleExtend}
											onMouseEnter={handleHover}
											onMouseLeave={handleHover}
											className={isHover ? styles["buttonHovered"] : styles["buttonNotHovered"]}
											aria-label="Extend"
										>
											{extended ? "Hide" : "More"}
											{extended ? (
												<FaChevronUp className={styles["up"]} style={{ fill: isHover ? "#fff" : "#cccccc" }} />
											) : (
												<FaChevronUp className={styles["down"]} style={{ fill: isHover ? "#fff" : "#cccccc" }} />
											)}
										</button>
									</div>
								</div>

								<div className={styles["addToCart"]}>
									<div className={styles["infos"]}>
										<h3>${selectedGame ? selectedGame.price : templateGame.price}</h3>
										<button id={selectedGame ? selectedGame.id : templateGame.id} onClick={handleLike} aria-label="Like">
											<FaHeart
												className={selectedGame ? (selectedGame.isLiked ? styles["liked"] : styles["like"]) : styles["like"]}
											/>
										</button>
									</div>
									{selectedGame ? (
										selectedGame.inCart ? (
											<AddedToCartBig />
										) : (
											<button
												id="21"
												onMouseEnter={handleHover}
												onMouseLeave={handleHover}
												className={styles["addToCartButton"]}
												onClick={handleAddToCart}
												aria-label="Add"
											>
												Add to cart
												<FaPlus className={styles["add"]} />
											</button>
										)
									) : (
										<button
											id="21"
											onMouseEnter={handleHover}
											onMouseLeave={handleHover}
											onClick={handleAddToCart}
											aria-label="Add"
										>
											Not available
											<FaPlus className={styles["add"]} />
										</button>
									)}
								</div>
							</div>
						</section>
					</div>
				</AnimatedGamePage>
			</div>
		</>
	);
};

export default GamePage;
