import Footer from "@components/Footer";
import NavBar from "@components/NavBar";
import { selectAllItemsWithImages, selectAllWishlistItemsByUser } from "@database/items";
import Browse from "@pages/Browse";
import Home from "@pages/Home";
import ItemPage from "@pages/ItemPage";
import Login from "@pages/Login";
import NotFound from "@pages/NotFound";
import ProtectedRoute from "@pages/ProtectedRoute";
import AccountOptionsWindow from "@popups/AccountOptionsWindow";
import AccountProfileWindow from "@popups/AccountProfileWindow";
import AddEditNewItemWindow from "@popups/AddEditNewItemWindow";
import CartWindow from "@popups/CartWindow";
import ChatListWindow from "@popups/ChatListWindow";
import TradeManageWindow from "@popups/TradeManageWindow";
import TradeWindow from "@popups/TradeWindow";
import { useContextDispatch, useContextSelector } from "@providers/StoreProvider";
import appStyles from "@styles/App.module.scss";
import cns from "@utils/classNames";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const App = () => {
	const {
		accountInfoDisplayed,
		accountProfileDisplayed,
		addEditNewItemDisplayed,
		cartDisplayed,
		chatDisplayed,
		tradeDisplayed,
		tradeManageDisplay,
	} = useContextSelector("displayStore");

	const dispatch = useContextDispatch();

	const { theme } = useContextSelector("globalStore");
	const { selectedItemIdToEdit } = useContextSelector("itemsStore");
	const { pathname } = useLocation();

	useEffect(() => {
		const fetchItems = async () => {
			try {
				const res = await selectAllItemsWithImages();
				if (res.data) {
					dispatch({
						type: "SET_ALL_ITEMS",
						payload: res.data,
					});
				} else {
					console.error("Failed to fetch items:", res.error);
				}
			} catch (error) {
				console.error("Error fetching items:", error);
			}
		};

		fetchItems();
	}, [dispatch]);

	useEffect(() => {
		const fetchWishlistItems = async () => {
			try {
				const res = await selectAllWishlistItemsByUser();
				if (res.data) {
					dispatch({
						type: "SET_WISHLIST_ITEMS",
						payload: res.data,
					});
				} else {
					console.error("Failed to fetch wishlist items:", res.error);
				}
			} catch (error) {}
		};

		fetchWishlistItems();
	}, [dispatch]);

	useEffect(() => {
		const applyTheme = () => {
			if (theme === "system") {
				const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
				document.documentElement.setAttribute("theme", systemTheme);
			} else {
				document.documentElement.setAttribute("theme", theme);
			}
		};

		applyTheme();

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		if (theme === "system") {
			mediaQuery.addEventListener("change", applyTheme);
		}

		return () => {
			mediaQuery.removeEventListener("change", applyTheme);
		};
	}, [theme]);

	const animationKey = () => {
		const key = pathname.split("/").filter(Boolean).join("-");
		return key || "home";
	};

	const isAddItemWindowOpen = addEditNewItemDisplayed || selectedItemIdToEdit > -1;

	return (
		<>
			<div
				className={cns(appStyles["app"], {
					[appStyles["hasWindowDisplay"]]:
						cartDisplayed || chatDisplayed || tradeDisplayed || tradeManageDisplay || isAddItemWindowOpen || accountProfileDisplayed,
				})}
			>
				<NavBar />
				<div className={appStyles["appContent"]}>
					<AnimatePresence exitBeforeEnter>
						<Routes key={animationKey()} location={location}>
							<Route path="/" element={<Home />} />
							<Route path="/login/" element={<Login />} />
							<Route
								path="/browse/*"
								element={
									<ProtectedRoute>
										<Browse />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/store/:itemId"
								element={
									<ProtectedRoute>
										<ItemPage />
									</ProtectedRoute>
								}
							/>
							<Route path="*" element={<NotFound />} />
						</Routes>
					</AnimatePresence>
				</div>
				{accountInfoDisplayed && <AccountOptionsWindow />}
				{accountProfileDisplayed && <AccountProfileWindow />}
				{isAddItemWindowOpen && <AddEditNewItemWindow />}
				{cartDisplayed && <CartWindow />}
				{tradeDisplayed && <TradeWindow />}
				{tradeManageDisplay && <TradeManageWindow />}
				<Footer />
				{chatDisplayed && <ChatListWindow />}
			</div>
			<ToastContainer />
		</>
	);
};

export default App;
