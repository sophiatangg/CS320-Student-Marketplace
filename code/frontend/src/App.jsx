import Footer from "@components/Footer";
import NavBar from "@components/NavBar";
import Browse from "@pages/Browse";
import Home from "@pages/Home";
import ItemPage from "@pages/ItemPage";
import NotFound from "@pages/NotFound";
import AccountOptionsWindow from "@popups/AccountOptionsWindow";
import AddNewItemWindow from "@popups/AddNewItemWindow";
import CartWindow from "@popups/CartWindow";
import TradeWindow from "@popups/TradeWindow";
import { useContextDispatch, useContextSelector } from "@stores/StoreProvider";
import appStyles from "@styles/App.module.scss";
import cns from "@utils/classNames";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const App = () => {
	const [browsing, setBrowsing] = useState(true);
	const [overlap, setOverlap] = useState(false);

	const { accountInfoDisplayed, addNewItemDisplayed, cartDisplayed, tradeDisplayed } = useContextSelector("displayStore");
	const { selectedItem } = useContextSelector("itemsStore");

	const dispatch = useContextDispatch();

	const { pathname } = useLocation();

	useEffect(() => {
		setOverlap(false);
		setBrowsing(!(pathname === "/"));
	}, [pathname]);

	const validPathName = pathname.replace("/", "");

	const animationKey = () => {
		return pathname === "/" ? "home" : pathname.startsWith("/store") ? "store" : pathname.startsWith("/browse") ? "browse" : "no-animation";
	};

	return (
		<>
			<div
				className={cns(appStyles["app"], {
					[appStyles["hasWindowDisplay"]]: cartDisplayed || tradeDisplayed || addNewItemDisplayed,
				})}
			>
				<NavBar browsing={browsing} component={validPathName} />
				<AnimatePresence exitBeforeEnter>
					<Routes key={animationKey()} location={location}>
						<Route path="/" element={<Home overlap={overlap} setOverlap={setOverlap} />} />
						<Route path="/browse/*" element={<Browse />} />
						<Route path="/store/:itemId" element={<ItemPage />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</AnimatePresence>
				{addNewItemDisplayed && <AddNewItemWindow />}
				{cartDisplayed && <CartWindow />}
				{tradeDisplayed && <TradeWindow />}
				{accountInfoDisplayed && <AccountOptionsWindow />}
				<Footer />
			</div>
			<ToastContainer />
		</>
	);
};

export default App;
