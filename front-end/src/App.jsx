import Browse from "@containers/Browse";
import GamePage from "@containers/GamePage";
import Home from "@containers/Home";
import NotFound from "@containers/NotFound";
import cardStyles from "@styles/Card.module.scss";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import filterNames from "./utils/filterNames";
import games from "./utils/games";
import templateGame from "./utils/templateGame";

const App = () => {
	const [currentFilter, setCurrentFilter] = useState("none");
	const [allGames, setAllGames] = useState(games);
	const [cart, setCart] = useState([]);
	const [cartAmount, setCartAmount] = useState(0);
	const [shownGames, setShownGames] = useState(allGames);
	const [cartDisplayed, setCartDisplayed] = useState(false);
	const [search, setSearch] = useState("");
	const [overlap, setOverlap] = useState(false);
	const [searching, setSearching] = useState(false);
	const [browsing, setBrowsing] = useState(true);
	const [selectedGame, setSelectedGame] = useState(false);
	const [extended, setExtended] = useState(false);
	const [textExtended, setTextExtended] = useState(false);

	const navigate = useNavigate();
	const location = useLocation();

	if (location.pathname != "/react-ecommerce-store/" && location.pathname != "/react-ecommerce-store/browse" && selectedGame === false) {
		let surname = location.pathname.substring(29);

		let currentGame = games.find((game) => game.surname === surname);
		if (currentGame != undefined) {
			setSelectedGame(currentGame);
		} else {
			setSelectedGame(templateGame);
		}
	}

	async function handleBrowse() {
		setExtended(false);
		setTextExtended(false);
		setCartDisplayed(false);
		navigate("/react-ecommerce-store/browse");
	}

	const handleHome = () => {
		setExtended(false);
		setTextExtended(false);
		setCartDisplayed(false);
		navigate("/react-ecommerce-store/");
	};

	const handleSearch = (e) => {
		setSearch(e.target.value);
		setSearching(false);
	};

	const handleSearchSubmit = (e) => {
		setCurrentFilter("none");
		e.preventDefault();
		setSearching(true);

		if (location.pathname != "/react-ecommerce-store/browse") {
			navigate("/react-ecommerce-store/browse");
		}
	};

	const handleFilterSelect = (e) => {
		const selectedFilterName = filterNames[e.target.id];
		setCurrentFilter(selectedFilterName);
	};

	const handleSelectGame = (e) => {
		if (e.target.tagName === "BUTTON") {
			return;
		} else if (e.target.classList.contains(`${cardStyles["name"]}`) || e.target.classList.contains(`${cardStyles["img"]}`)) {
			const cardElem = e.target.closest(`.${cardStyles["card"]}`);
			const clickedGame = games[cardElem.id];

			setSelectedGame(games[e.target.parentNode.id]);
			navigate(`/react-ecommerce-store/games/${clickedGame.surname}`);
		}
	};

	const handleLike = (e) => {
		let handledLike = allGames.map((game, i) => {
			if (e.target.id == i) {
				game.isLiked = !game.isLiked;
				return game;
			} else {
				return game;
			}
		});

		setAllGames(handledLike);
	};

	const clearFilter = () => {
		setCurrentFilter("none");
		setSearch("");
	};

	const openGamePage = (e) => {
		setCartDisplayed(false);
		let selectedGameSurname = e.target.id;
		navigate(`/react-ecommerce-store/games/${selectedGameSurname}`);
	};

	const handleHover = (e) => {};

	const handleHoverGame = (e) => {
		let handledHoveredGame = allGames.map((game, i) => {
			if (e.target.id == i) {
				game.isHovered = !game.isHovered;
				return game;
			} else {
				return game;
			}
		});

		setAllGames(handledHoveredGame);
	};

	const handleAddToCart = (e) => {
		let handledAddedGame = allGames.map((game, i) => {
			if (location.pathname === "/react-ecommerce-store/browse") {
				if (e.target.id == i) {
					game.inCart = true;
					let newCart = cart;
					newCart.push(game);
					setCart(newCart);
					setCartAmount(cartAmount + 1);
					return game;
				} else {
					return game;
				}
			} else {
				if (selectedGame.id == i) {
					game.inCart = true;
					let newCart = cart;
					newCart.push(game);
					setCart(newCart);
					setCartAmount(cartAmount + 1);
					return game;
				} else {
					return game;
				}
			}
		});

		setAllGames(handledAddedGame);
	};

	const clearCart = () => {
		setCart([]);
		setCartAmount(0);

		const defaultGames = allGames.map((game, i) => {
			game.inCart = false;
			game.isHovered = false;
			return game;
		});

		setAllGames(defaultGames);
	};

	const handleRemoveFromCart = (e) => {
		let removedIndex = cart.findIndex((game) => game.id == e.target.id);
		let newAllGames = allGames.map((game, i) => {
			if (game.id == e.target.id) {
				game.inCart = false;
				game.isHovered = false;
				return game;
			} else {
				return game;
			}
		});
		setAllGames(newAllGames);
		let firstHalf = cart.slice(0, removedIndex);
		let secondHalf = cart.slice(removedIndex + 1);
		let addedUp = firstHalf.concat(secondHalf);
		setCart(addedUp);
		setCartAmount(cartAmount - 1);
	};

	useEffect(() => {
		setOverlap(false);

		if (location.pathname === "/react-ecommerce-store/") {
			setBrowsing(false);
		} else {
			setBrowsing(true);
		}

		if (location.pathname != "/react-ecommerce-store/browse") {
			document.body.style.overflowX = "hidden";
		} else if (location.pathname === "/react-ecommerce-store/browse") {
			document.body.style.overflowX = "scroll";
		}
	}, [location.pathname]);

	const handleOpenCart = () => {
		setCartDisplayed(true);
	};

	const handleCloseCart = () => {
		setCartDisplayed(false);
	};

	useEffect(() => {
		console.log(selectedGame);
	}, [selectedGame]);

	useEffect(() => {
		if (cartDisplayed) {
			document.body.style.overflowX = "hidden !important";
		} else {
			document.body.style.overflowX = "scroll !important";
		}
	}, [cartDisplayed]);

	return (
		<AnimatePresence exitBeforeEnter>
			<Routes key={location.pathname} location={location}>
				<Route
					path="/"
					element={
						<Home
							handleHover={handleHover}
							shownGames={shownGames}
							cart={cart}
							cartAmount={cartAmount}
							cartDisplayed={cartDisplayed}
							handleOpenCart={handleOpenCart}
							handleCloseCart={handleCloseCart}
							clearCart={clearCart}
							handleAddToCart={handleAddToCart}
							handleLike={handleLike}
							handleHoverGame={handleHoverGame}
							handleSelectGame={handleSelectGame}
							handleRemoveFromCart={handleRemoveFromCart}
							overlap={overlap}
							setOverlap={setOverlap}
							openGamePage={openGamePage}
						/>
					}
				/>
				<Route
					path="/react-ecommerce-store/"
					element={
						<Home
							handleHover={handleHover}
							shownGames={shownGames}
							cart={cart}
							cartAmount={cartAmount}
							cartDisplayed={cartDisplayed}
							handleOpenCart={handleOpenCart}
							handleCloseCart={handleCloseCart}
							clearCart={clearCart}
							handleAddToCart={handleAddToCart}
							handleLike={handleLike}
							handleHoverGame={handleHoverGame}
							handleSelectGame={handleSelectGame}
							handleRemoveFromCart={handleRemoveFromCart}
							overlap={overlap}
							setOverlap={setOverlap}
							openGamePage={openGamePage}
						/>
					}
				/>
				<Route
					path="/react-ecommerce-store/browse"
					element={
						<Browse
							cart={cart}
							cartAmount={cartAmount}
							handleHover={handleHover}
							handleFilterSelect={handleFilterSelect}
							currentFilter={currentFilter}
							shownGames={shownGames}
							setShownGames={setShownGames}
							clearFilter={clearFilter}
							allGames={allGames}
							setAllGames={setAllGames}
							handleLike={handleLike}
							handleHoverGame={handleHoverGame}
							handleAddToCart={handleAddToCart}
							handleSelectGame={handleSelectGame}
							handleSearch={handleSearch}
							handleSearchSubmit={handleSearchSubmit}
							search={search}
							searching={searching}
							browsing={browsing}
							handleBrowse={handleBrowse}
							handleHome={handleHome}
							cartDisplayed={cartDisplayed}
							handleOpenCart={handleOpenCart}
							handleCloseCart={handleCloseCart}
							clearCart={clearCart}
							handleRemoveFromCart={handleRemoveFromCart}
							openGamePage={openGamePage}
						/>
					}
				/>
				<Route
					path="/react-ecommerce-store/games/:gameId"
					element={
						<GamePage
							cart={cart}
							cartAmount={cartAmount}
							handleHover={handleHover}
							handleLike={handleLike}
							handleAddToCart={handleAddToCart}
							handleSelectGame={handleSelectGame}
							selectedGame={selectedGame}
							setSelectedGame={setSelectedGame}
							handleSearch={handleSearch}
							handleSearchSubmit={handleSearchSubmit}
							search={search}
							searching={searching}
							browsing={browsing}
							handleBrowse={handleBrowse}
							handleHome={handleHome}
							allGames={allGames}
							extended={extended}
							setExtended={setExtended}
							textExtended={textExtended}
							setTextExtended={setTextExtended}
							cartDisplayed={cartDisplayed}
							handleOpenCart={handleOpenCart}
							handleCloseCart={handleCloseCart}
							clearCart={clearCart}
							handleRemoveFromCart={handleRemoveFromCart}
							openGamePage={openGamePage}
						/>
					}
				/>
				<Route
					path="*"
					element={
						<NotFound
							cartDisplayed={cartDisplayed}
							handleCloseCart={handleCloseCart}
							handleOpenCart={handleOpenCart}
							cartAmount={cartAmount}
							clearCart={clearCart}
							handleHome={handleHome}
							handleHover={handleHover}
							cart={cart}
							browsing={browsing}
							search={search}
							searching={searching}
							handleSearch={handleSearch}
							handleSearchSubmit={handleSearchSubmit}
							handleBrowse={handleBrowse}
							handleRemoveFromCart={handleRemoveFromCart}
							openGamePage={openGamePage}
						/>
					}
				/>
			</Routes>
		</AnimatePresence>
	);
};

export default App;
