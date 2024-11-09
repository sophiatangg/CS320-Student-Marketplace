import AccountButton from "@components/AccountButton";
import SearchBar from "@components/SearchBar";
import { useContextDispatch, useContextSelector } from "@stores/StoreProvider";
import navBarStyles from "@styles/NavBar.module.scss";
import { motion } from "framer-motion";
import { FaShoppingBasket } from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";
import { TiShoppingCart } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

const NavBar = (props) => {
	const { browsing } = props;

	const navigate = useNavigate();

	const { cartAmount } = useContextSelector("cartStore");
	const dispatch = useContextDispatch();

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

	const navBarVariants = {
		hidden: { opacity: 1, y: 15 },
		visible: { opacity: 1, y: 0 },
	};

	const renderNavLeft = () => {
		return (
			<div className={navBarStyles["logo"]} onClick={handleHome}>
				<div className={navBarStyles["icon"]}>
					<PiStudentBold className={navBarStyles["svg"]} style={{ fill: "#fff" }} />
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
				{browsing && <SearchBar />}
				{!browsing && (
					<div className={navBarStyles["component"]} id="browseStore">
						<div className={navBarStyles["icon"]}>
							<FaShoppingBasket className={navBarStyles["svg"]} style={{ fill: "#fff" }} />
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
				<div className={navBarStyles["cartComponent"]} onClick={handleOpenCart}>
					<div className={navBarStyles["icon"]}>
						<TiShoppingCart
							onClick={handleOpenCart}
							className={navBarStyles["svg"]}
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
				<AccountButton />
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
