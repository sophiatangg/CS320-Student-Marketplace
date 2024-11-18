import AccountButton from "@components/AccountButton";
import SearchBar from "@components/SearchBar";
import TradeCenterButton from "@components/TradeCenterButton";
import { useAuth } from "@providers/AuthProvider";
import { useContextDispatch, useContextSelector } from "@providers/StoreProvider";
import navBarStyles from "@styles/NavBar.module.scss";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";
import { TiShoppingCart } from "react-icons/ti";
import { useLocation, useNavigate } from "react-router-dom";

const navBarVariants = {
	hidden: { opacity: 1, y: 15 },
	visible: { opacity: 1, y: 0 },
};

const NavBar = (props) => {
	const [userAvatar, setUserAvatar] = useState("");
	const [browsing, setBrowsing] = useState(true);

	const navigate = useNavigate();

	const { currentUser } = useAuth();

	const { cartAmount } = useContextSelector("cartStore");
	const dispatch = useContextDispatch();

	const { pathname } = useLocation();

	const handleHome = () => {
		navigate("/");

		dispatch({
			type: "SET_CART_DISPLAYED",
			payload: false,
		});

		dispatch({
			type: "SET_TRADE_DISPLAYED",
			payload: false,
		});
	};

	const handleBrowse = async () => {
		navigate("/browse");

		dispatch({
			type: "SET_CART_DISPLAYED",
			payload: false,
		});

		dispatch({
			type: "SET_TRADE_DISPLAYED",
			payload: false,
		});
	};

	const handleOpenCart = () => {
		dispatch({
			type: "SET_CART_DISPLAYED",
			payload: true,
		});

		dispatch({
			type: "SET_TRADE_DISPLAYED",
			payload: false,
		});
	};

	useEffect(() => {
		setBrowsing(!(pathname === "/"));
	}, [pathname]);

	useEffect(() => {
		if (currentUser) {
			setUserAvatar(currentUser.user_metadata.avatar_url);
		}
	}, [currentUser]);

	const renderNavLeft = () => {
		return (
			<div className={navBarStyles["logo"]} onClick={handleHome}>
				<div className={navBarStyles["icon"]}>
					<PiStudentBold style={{ fill: "#fff" }} />
				</div>
				<h3>
					<span>Student</span>
					<span>Marketplace</span>
				</h3>
			</div>
		);
	};

	const renderNavCenter = () => {
		return (
			<div className={navBarStyles["path"]}>
				{browsing && currentUser && <SearchBar />}
				{!browsing && currentUser && (
					<div className={navBarStyles["component"]} id="browseStore">
						<div className={navBarStyles["icon"]}>
							<FaShoppingBasket style={{ fill: "#fff" }} />
						</div>
						<h3 onClick={handleBrowse}>
							<span>Browse</span>
							<span>Store</span>
						</h3>
					</div>
				)}
			</div>
		);
	};

	const renderNavRight = () => {
		return (
			<div className={navBarStyles["component"]}>
				{currentUser && (
					<>
						<TradeCenterButton />
						<div className={navBarStyles["cartComponent"]} onClick={handleOpenCart}>
							<div className={navBarStyles["icon"]}>
								<TiShoppingCart
									onClick={handleOpenCart}
									style={{
										fill: cartAmount ? "#90ee90" : "#fff",
									}}
								/>
							</div>
							{cartAmount > 0 && (
								<div className={navBarStyles["badge"]} onClick={handleOpenCart}>
									{cartAmount}
								</div>
							)}
						</div>
					</>
				)}
				<AccountButton userAvatar={userAvatar} />
			</div>
		);
	};

	return (
		<>
			<motion.div
				key="navBar-component"
				className={navBarStyles["navbar"]}
				id={props.component}
				animate={"visible"}
				initial={"visible"}
				variants={navBarVariants}
				transition={{ y: { type: "spring" }, duration: 0.01 }}
			>
				{renderNavLeft()}
				{renderNavCenter()}
				{renderNavRight()}
			</motion.div>
		</>
	);
};

export default NavBar;
