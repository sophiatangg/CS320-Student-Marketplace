import { useContextSelector } from "@stores/StoreProvider";
import styles from "@styles/NavBar.module.scss";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import { HiSearch } from "react-icons/hi";
import { IoCart } from "react-icons/io5";
import { PiStudentBold } from "react-icons/pi";
import { useLocation } from "react-router-dom";

const NavBar = (props) => {
	const { browsing, handleBrowse, handleHome, handleOpenCart, handleSearch, handleSearchSubmit, search } = props;

	const [isHover, setIsHover] = useState(false);

	const { cartAmount } = useContextSelector("cartStore");

	const variants = {
		hidden: { opacity: 1, y: 15 },
		visible: { opacity: 1, y: 0 },
	};

	const searchVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
	};

	const location = useLocation();

	return (
		<>
			<motion.div
				className={styles["navbar"]}
				id={props.component}
				animate={"visible"}
				initial={"visible"}
				variants={variants}
				transition={{ y: { type: "spring" }, duration: 0.01 }}
			>
				<div className={styles["navbar_left"]}>
					<div className={styles["logo"]} id="0" onClick={handleHome}>
						<div className={styles["icon"]}>
							<PiStudentBold className={styles["svg"]} style={{ fill: "#fff" }} />
						</div>
						<h3>
							<span>Student</span>
							<span>Marketplace</span>
						</h3>
					</div>

					<div className={styles["path"]} id="1">
						{browsing ? (
							<>
								<motion.div
									animate="visible"
									initial={location.pathname === "/browse" ? "hidden" : "visible"}
									variants={searchVariants}
									transition={{ opacity: { type: "spring" }, duration: 0.01, delay: 0.25 }}
									className={styles["search"]}
								>
									<form onSubmit={handleSearchSubmit}>
										<div className={styles["icon"]}>
											<HiSearch
												className={styles["svg"]}
												style={{ fill: isHover ? "#fff" : "#cccccc" }}
												id="7"
												aria-label="Search"
											/>
										</div>
										<input placeholder="Search items..." value={search} onChange={handleSearch}></input>
										<input type="submit" hidden className={styles["submit"]} />
										<button type="submit"></button>
									</form>
								</motion.div>
							</>
						) : (
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
				</div>

				<div className={styles["navbar_right"]}>
					<div className={styles["component"]} id="3" onClick={handleOpenCart}>
						<div className={styles["icon"]}>
							<IoCart
								onClick={handleOpenCart}
								className={styles["svg2"]}
								style={{
									fill: cartAmount ? "#90ee90" : "transparent",
									stroke: cartAmount ? "transparent" : "#fff",
									strokeWidth: "34px",
								}}
							/>
						</div>
						<h3 onClick={handleOpenCart}>Cart: {cartAmount}</h3>
					</div>
				</div>
			</motion.div>
		</>
	);
};

export default NavBar;
