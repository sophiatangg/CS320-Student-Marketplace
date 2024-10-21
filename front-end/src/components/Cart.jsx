import AnimatedCart from "@containers/AnimatedCart";
import styles from "@styles/Cart.module.scss";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { ImCross } from "react-icons/im";

const Cart = (props) => {
	const { cartAmount, cart, handleOpenCart, handleCloseCart, cartDisplayed, handleHover, clearCart, handleRemoveFromCart, openGamePage } = props;

	const [total, setTotal] = useState(0);
	const [isHover, setIsHover] = useState(false);

	let newTotal = 0;
	cart.forEach((item, i) => {
		let priceAsNumber = parseFloat(item.price);
		let currentTotal = parseFloat(newTotal);
		newTotal = (priceAsNumber + currentTotal).toFixed(2);

		if (i === cart.length) {
			setTotal(newTotal);
		}
	});

	const variants = {
		initial: { x: 100 },
		animate: { x: 0, transition: { x: { type: "spring", duration: 1.2, bounce: 0.4 } } },
		exit: { x: 100, transition: { x: { type: "spring", duration: 1.2, bounce: 0.575 } } },
	};

	return (
		<div className={styles["cartWindow"]}>
			<div className={styles["back"]} onClick={handleCloseCart}></div>
			<AnimatedCart>
				<div className={styles["cart"]} style={{ backgroundColor: "#1A1A1A", height: "100vh" }}>
					<div className={styles["top"]}>
						<div className={styles["topHeader"]}>
							<h2>{cartAmount >= 1 ? (cartAmount > 1 ? `${cartAmount} games` : "1 game") : "Empty cart"}</h2>
							<h3 onClick={clearCart}>{cartAmount >= 1 ? "Clear" : ""}</h3>
						</div>

						<div className={styles["topGames"]}>
							{cart.map((item, i) => {
								return (
									<motion.div
										className={styles["item"]}
										key={i}
										variants={variants}
										initial="initial"
										animate="animate"
										exit="exit"
									>
										<h3 id={item.surname} onClick={openGamePage}>
											{item.name}
										</h3>
										<div>
											${item.price}
											<button id={item.id} onClick={handleRemoveFromCart} className={styles["removeButton"]} aria-label="Close">
												<ImCross className={styles["cross"]} />
											</button>
										</div>
									</motion.div>
								);
							})}
						</div>
					</div>

					<div
						className={styles["bottom"]}
						style={{ width: "87.5%", display: "flex", justifyContent: "space-between", alignItems: "center" }}
					>
						<h3>Total: ${newTotal}</h3>
						<button
							id="24"
							onMouseEnter={handleHover}
							onMouseLeave={handleHover}
							style={{ color: isHover ? "#92f" : "#fff" }}
							aria-label="Checkout"
						>
							Checkout
							<FaChevronRight className={styles["right"]} style={{ fill: isHover ? "#92f" : "#fff" }} />
						</button>
					</div>
				</div>
			</AnimatedCart>
		</div>
	);
};

export default Cart;
