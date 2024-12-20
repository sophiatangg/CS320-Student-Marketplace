import AccountButton from "@components/AccountButton";
import CartButton from "@components/CartButton";
import ChatButton from "@components/ChatButton";
import SearchBar from "@components/SearchBar";
import TradeCenterButton from "@components/TradeCenterButton";
import { useAuth } from "@providers/AuthProvider";
import { useContextDispatch, useContextSelector } from "@providers/StoreProvider";
import styles from "@styles/NavBar.module.scss";
import cns from "@utils/classNames";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";

const navBarVariants = {
	hidden: { opacity: 1, y: 15 },
	visible: { opacity: 1, y: 0 },
};

const NavBar = (props) => {
	const componentRef = useRef();

	const [browsing, setBrowsing] = useState(true);
	const [isSmallScreen, setIsSmallScreen] = useState(false);
	const [userAvatar, setUserAvatar] = useState("");

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

	const handleBrowse = (e) => {
		e.stopPropagation();
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

	const handleResize = () => {
		if (!componentRef.current) return;

		const componentElem = componentRef.current;
		const componentElemDimension = componentElem.getBoundingClientRect();

		const { width: componentElemWidth } = componentElemDimension;
		setIsSmallScreen(componentElemWidth <= 670);
	};

	useEffect(() => {
		setBrowsing(!(pathname === "/"));
	}, [pathname]);

	useEffect(() => {
		if (currentUser) {
			setUserAvatar(currentUser.user_metadata.avatar_url);
		}
	}, [currentUser]);

	useEffect(() => {
		handleResize();

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [window]);

	const renderNavLeft = () => {
		return (
			<div
				className={cns(styles["logo"], {
					[styles["atStore"]]: browsing,
				})}
				onClick={handleHome}
			>
				<div className={styles["logoInner"]}>
					<div className={cns(styles["icon"], styles["logoIcon"], {})}>
						<PiStudentBold style={{ fill: "#fff" }} />
					</div>
					<h3>
						<span>Student</span>
						<span>Marketplace</span>
					</h3>
				</div>
				{!browsing && currentUser && (
					<motion.div
						key={"browseComponent"}
						animate={"visible"}
						initial={"visible"}
						variants={navBarVariants}
						transition={{ y: { type: "spring" }, duration: 0.01 }}
						className={styles["component"]}
						id="browseStore"
						onClick={handleBrowse}
					>
						<div className={styles["icon"]}>
							<FaShoppingBasket style={{ fill: "#fff" }} />
						</div>
						<h3>
							<span>Browse</span>
							<span>Store</span>
						</h3>
					</motion.div>
				)}
			</div>
		);
	};

	const renderNavCenter = () => {
		return <div className={styles["middle"]}>{browsing && currentUser && <SearchBar />}</div>;
	};

	const renderNavRight = () => {
		return (
			<div className={styles["component"]}>
				{browsing && currentUser && (
					<>
						<ChatButton />
						<TradeCenterButton />
						<CartButton cartAmount={cartAmount} handleOpenCart={handleOpenCart} />
					</>
				)}
				<AccountButton userAvatar={userAvatar} />
			</div>
		);
	};

	return (
		<motion.div
			key="navBar-component"
			ref={componentRef}
			className={cns(styles["navbar"], {
				[styles["navBarNarrow"]]: isSmallScreen,
			})}
			id={props.component}
			animate={"visible"}
			initial={"visible"}
			variants={navBarVariants}
			transition={{ y: { type: "spring" }, duration: 0.01 }}
		>
			<div className={styles["navBarInner"]}>
				{!isSmallScreen ? (
					<>
						{renderNavLeft()}
						{renderNavCenter()}
						{renderNavRight()}
					</>
				) : (
					<>
						<div className={styles["navBarNarrowTop"]}>
							{renderNavLeft()}
							{renderNavRight()}
						</div>
						{renderNavCenter()}
					</>
				)}
			</div>
		</motion.div>
	);
};

export default NavBar;
