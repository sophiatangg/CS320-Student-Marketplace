import AddNewItemWindow from "@components/AddNewItemWindow";
import CartWindow from "@components/CartWindow";
import Footer from "@components/Footer";
import NavBar from "@components/NavBar";
import TradeWindow from "@components/TradeWindow";
import Browse from "@pages/Browse";
import Home from "@pages/Home";
import ItemPage from "@pages/ItemPage";
import NotFound from "@pages/NotFound";
import { useContextSelector } from "@stores/StoreProvider";
import appStyles from "@styles/App.module.scss";
import cns from "@utils/classNames";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import filterNames from "./utils/filterNames";
import itemsData from "./utils/itemsData";
import templateGame from "./utils/templateGame";

const App = () => {
	const localStorageItems = useContextSelector("globalStore").items;

	const [allItems, setAllItems] = useState(itemsData.concat(localStorageItems));
	const [browsing, setBrowsing] = useState(true);
	const [currentCategory, setCurrentCategory] = useState("none");
	const [extended, setExtended] = useState(false);
	const [overlap, setOverlap] = useState(false);
	const [search, setSearch] = useState("");
	const [searching, setSearching] = useState(false);
	const [selectedItem, setSelectedItem] = useState(false);
	const [shownItems, setShownItems] = useState(allItems);
	const [textExtended, setTextExtended] = useState(false);

	const [addNewItemDisplayed, setAddNewItemDisplayed] = useState(false);
	const [cartDisplayed, setCartDisplayed] = useState(false);
	const [tradeDisplayed, setTradeDisplayed] = useState(false);

	const navigate = useNavigate();
	const location = useLocation();

	if (location.pathname !== "/" && location.pathname !== "/browse" && selectedItem === false) {
		let surname = location.pathname.substring(29);

		let currentItem = itemsData.find((item) => item.surname === surname);
		if (currentItem !== undefined) {
			setSelectedItem(currentItem);
		} else {
			setSelectedItem(templateGame);
		}
	}

	const handleBrowse = async () => {
		setExtended(false);
		setTextExtended(false);
		setCartDisplayed(false);
		setTradeDisplayed(false);
		navigate("/browse");
	};

	const handleHome = () => {
		setExtended(false);
		setTextExtended(false);
		setCartDisplayed(false);
		setTradeDisplayed(false);
		navigate("/");
	};

	const handleSearch = (e) => {
		setSearch(e.target.value);
		setSearching(false);
	};

	const handleSearchSubmit = (e) => {
		setCurrentCategory("none");
		e.preventDefault();
		setSearching(true);

		if (location.pathname != "/browse") {
			navigate("/browse");
		}
	};

	const handleCategorySelect = ({ id }) => {
		const newCategoryName = filterNames[id];
		setCurrentCategory(newCategoryName);
	};

	const handleSelectItem = (id) => {
		const clickedItem = allItems.find((_item) => {
			return _item.id === id;
		});

		setSelectedItem(clickedItem);
		navigate(`/store/${clickedItem.surname}`);
	};

	const handleCurrentHoveredItem = (id) => {
		if (isNaN(id)) {
			console.error("Check id!");
			return;
		}

		const hoveredItem = allItems.find((item) => {
			return item.id === id;
		});

		setSelectedItem(hoveredItem);
	};

	const handleLike = (id) => {
		if (isNaN(id)) {
			console.error("Check liked id!");
			return;
		}

		const handledLike = allItems.map((item, i) => {
			if (id === item.id) {
				item.isLiked = !item.isLiked;
			}

			return item;
		});

		setAllItems(handledLike);
	};

	const clearFilter = () => {
		setCurrentCategory("none");
		setSearch("");
	};

	const openItemPage = (e) => {
		setCartDisplayed(false);
		setTradeDisplayed(false);

		let selectedItemSurname = e.target.id;
		navigate(`/store/${selectedItemSurname}`);
	};

	const handleHover = (e) => {};

	const handleHoverItem = (e) => {
		let handledHoveredItem = allItems.map((item, i) => {
			if (e.target.id === i) {
				item.isHovered = !item.isHovered;
				return item;
			} else {
				return item;
			}
		});

		setAllItems(handledHoveredItem);
	};

	useEffect(() => {
		setOverlap(false);

		if (location.pathname === "/") {
			setBrowsing(false);
		} else {
			setBrowsing(true);
		}

		if (location.pathname != "/browse") {
			document.body.style.overflowX = "hidden";
		} else if (location.pathname === "/browse") {
			document.body.style.overflowX = "scroll";
		}
	}, [location.pathname]);

	const handleOpenCart = () => {
		setCartDisplayed(true);
		setTradeDisplayed(false);
	};

	const handleCloseCart = () => {
		setCartDisplayed(false);
		setTradeDisplayed(false);
	};

	const handleTradeOpen = (bool) => {
		setTradeDisplayed(bool);
	};

	const handleAddNewItemOpen = (bool) => {
		setAddNewItemDisplayed(bool);
	};

	useEffect(() => {
		// console.log(selectedItem);
	}, [selectedItem]);

	const validPathName = location.pathname.replace("/", "");

	return (
		<>
			<div
				className={cns(appStyles["app"], {
					[appStyles["hasWindowDisplay"]]: cartDisplayed || tradeDisplayed || addNewItemDisplayed,
				})}
			>
				<NavBar
					browsing={browsing}
					component={validPathName}
					handleBrowse={handleBrowse}
					handleHome={handleHome}
					handleOpenCart={handleOpenCart}
					handleSearch={handleSearch}
					handleSearchSubmit={handleSearchSubmit}
					search={search}
				/>
				<AnimatePresence exitBeforeEnter>
					<Routes key={validPathName} location={location}>
						<Route path="/" element={<Home overlap={overlap} setOverlap={setOverlap} />} />
						<Route
							path="/browse"
							element={
								<Browse
									allItems={allItems}
									clearFilter={clearFilter}
									currentCategory={currentCategory}
									handleAddNewItemOpen={handleAddNewItemOpen}
									handleCurrentHoveredItem={handleCurrentHoveredItem}
									handleCategorySelect={handleCategorySelect}
									handleHoverItem={handleHoverItem}
									handleLike={handleLike}
									handleSelectItem={handleSelectItem}
									handleTradeOpen={handleTradeOpen}
									search={search}
									searching={searching}
									setCurrentCategory={setCurrentCategory}
									setShownItems={setShownItems}
									shownItems={shownItems}
								/>
							}
						/>
						<Route
							path="/category/:categoryName"
							element={
								<Browse
									allItems={allItems}
									clearFilter={clearFilter}
									currentCategory={currentCategory}
									handleAddNewItemOpen={handleAddNewItemOpen}
									handleCurrentHoveredItem={handleCurrentHoveredItem}
									handleCategorySelect={handleCategorySelect}
									handleHoverItem={handleHoverItem}
									handleLike={handleLike}
									handleSelectItem={handleSelectItem}
									handleTradeOpen={handleTradeOpen}
									search={search}
									searching={searching}
									setCurrentCategory={setCurrentCategory}
									setShownItems={setShownItems}
									shownItems={shownItems}
								/>
							}
						/>
						<Route
							path="/store/:itemId"
							element={
								<ItemPage
									allItems={allItems}
									extended={extended}
									handleBrowse={handleBrowse}
									handleLike={handleLike}
									handleTradeOpen={handleTradeOpen}
									selectedItem={selectedItem}
									setExtended={setExtended}
									setSelectedItem={setSelectedItem}
									setTextExtended={setTextExtended}
									textExtended={textExtended}
								/>
							}
						/>
						<Route path="*" element={<NotFound handleBrowse={handleBrowse} />} />
					</Routes>
				</AnimatePresence>
				{cartDisplayed && <CartWindow handleCloseCart={handleCloseCart} openItemPage={openItemPage} />}
				{tradeDisplayed && <TradeWindow handleTradeOpen={handleTradeOpen} selectedItem={selectedItem} />}
				{addNewItemDisplayed && <AddNewItemWindow handleAddNewItemOpen={handleAddNewItemOpen} />}
				<Footer />
			</div>
			<ToastContainer />
		</>
	);
};

export default App;
