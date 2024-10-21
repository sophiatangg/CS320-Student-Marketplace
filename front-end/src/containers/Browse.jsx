import Cart from "@components/Cart";
import Filters from "@components/Filters";
import Footer from "@components/Footer";
import Grid from "@components/Grid";
import NavBar from "@components/NavBar";
import AnimatedPage from "@containers/AnimatedPage";
import styles from "@styles/Browse.module.scss";
import { useEffect, useState } from "react";
import { MdOutlineTableRows } from "react-icons/md";
import { TbLayoutGridFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const Browse = (props) => {
	const {
		handleHover,
		handleFilterSelect,
		currentFilter,
		shownGames,
		setShownGames,
		clearFilter,
		allGames,
		setAllGames,
		handleLike,
		handleHoverGame,
		cart,
		cartAmount,
		handleAddToCart,
		handleSelectGame,
		handleSearch,
		handleSearchSubmit,
		search,
		searching,
		browsing,
		handleBrowse,
		handleHome,
		handleOpenCart,
		handleCloseCart,
		cartDisplayed,
		clearCart,
		handleRemoveFromCart,
		openGamePage,
	} = props;

	const navigate = useNavigate();
	const [landingPage, setLandingPage] = useState(false);
	const [grid, setGrid] = useState(true);

	const handleLayoutSwitch = (e) => {
		if (e.target.id == "grid") {
			setGrid(true);
		} else {
			setGrid(false);
		}
	};

	useEffect(() => {
		if (currentFilter == "none") {
			setShownGames(allGames);
		} else if (currentFilter != "Wishlist") {
			let filteredShownGames = allGames.filter((game) => game.genre === currentFilter);
			setShownGames(filteredShownGames);
		} else if (currentFilter === "Wishlist") {
			let filteredShownGames = allGames.filter((game) => game.isLiked === true);
			setShownGames(filteredShownGames);
		}
	}, [currentFilter]);

	useEffect(() => {
		if (cartDisplayed) {
			document.body.style.overflowX = "hidden";
		} else {
			document.body.style.overflowX = "scroll";
		}
	}, [cartDisplayed]);

	return (
		<>
			<NavBar
				handleHover={handleHover}
				handleBrowse={handleBrowse}
				handleHome={handleHome}
				browsing={browsing}
				landingPage={landingPage}
				cartAmount={cartAmount}
				search={search}
				searching={searching}
				handleSearch={handleSearch}
				handleSearchSubmit={handleSearchSubmit}
				handleOpenCart={handleOpenCart}
				component={"browse"}
			/>
			<section className={styles["Browse"]} style={{ maxHeight: cartDisplayed ? "100vh" : "1000vh", minHeight: "100vh" }}>
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

				<AnimatedPage exitBeforeEnter>
					<div className={styles["browseContent"]}>
						<Filters handleHover={handleHover} handleFilterSelect={handleFilterSelect} currentFilter={currentFilter} />

						<div className={styles["list"]}>
							<div className={styles["applied"]}>
								<div className={styles["filterList"]}>
									<button className={styles["filterButton"]} aria-label="Current Filter">
										Filter by:
										<span> {currentFilter}</span>
									</button>
									{currentFilter !== "none" && (
										<button
											className={`${styles["filterButton"]} ${styles["clearButton"]}`}
											onClick={clearFilter}
											aria-label="Clear Filters"
										>
											Clear Filter
										</button>
									)}
								</div>

								<div className={styles["displayStyle"]}>
									<p>Display options:</p>
									<button className={styles["displayBtn"]} onClick={handleLayoutSwitch} id="grid" aria-label="Display grids">
										<TbLayoutGridFilled
											className={styles["displayItem"]}
											style={{ width: 30, height: 30, fill: grid ? "#e5e5e5" : "#6f6f6f" }}
										/>
									</button>

									<button className={styles["displayBtn"]} onClick={handleLayoutSwitch} id="columns" aria-label="Display columns">
										<MdOutlineTableRows
											className={styles["displayItem"]}
											style={{ width: 30, height: 30, fill: grid ? "#6f6f6f" : "#e5e5e5" }}
										/>
									</button>
								</div>
							</div>

							<Grid
								shownGames={shownGames}
								handleLike={handleLike}
								handleHoverGame={handleHoverGame}
								handleAddToCart={handleAddToCart}
								grid={grid}
								search={search}
								searching={searching}
								handleSelectGame={handleSelectGame}
								cartDisplayed={cartDisplayed}
							/>
						</div>
					</div>
				</AnimatedPage>
				<Footer />
			</section>
		</>
	);
};

export default Browse;
