import SearchBar from "@components/SearchBar";
import Account from "@pages/Account";
import { useContextDispatch, useContextSelector } from "@stores/StoreProvider";
import styles from "@styles/NavBar.module.scss";
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
			<div className={styles["logo"]} onClick={handleHome}>
				<div className={styles["icon"]}>
					<PiStudentBold className={styles["svg"]} style={{ fill: "#fff" }} />
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
			<div className={styles["path"]}>
				{browsing && <SearchBar />}
				{!browsing && (
					<div className={styles["component"]} id="browseStore">
						<div className={styles["icon"]}>
							<FaShoppingBasket className={styles["svg"]} style={{ fill: "#fff" }} />
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
			<div className={styles["component"]}>
				<div className={styles["cartComponent"]} onClick={handleOpenCart}>
					<div className={styles["icon"]}>
						<TiShoppingCart
							onClick={handleOpenCart}
							className={styles["svg"]}
							style={{
								fill: cartAmount ? "#90ee90" : "#fff",
							}}
						/>
					</div>
					{cartAmount > 0 && (
						<div className={styles["badge"]} onClick={handleOpenCart}>
							{cartAmount}
						</div>
					)}
				</div>
				<Account />
			</div>
		);
	};

	return (
		<>
			<motion.div
				className={styles["navbar"]}
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
