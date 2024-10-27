import AnimatedCart from "@animations/AnimatedCart";
import AnimatedWindow from "@animations/AnimatedWindow";
import { useContextDispatch, useContextSelector } from "@stores/StoreProvider";
import styles from "@styles/CartWindow.module.scss";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { ImCross } from "react-icons/im";

const CartWindow = (props) => {
	const { handleCloseCart, openItemPage } = props;

	const { cart, cartAmount } = useContextSelector("cartStore");
	const dispatch = useContextDispatch();

	const [total, setTotal] = useState(0);
	const [isHover, setIsHover] = useState(false);

	const handleRemoveFromCart = (item) => {
		dispatch({
			type: "REMOVE_FROM_CART",
			payload: item,
		});
	};

	const handleClearCart = () => {
		dispatch({
			type: "CLEAR_CART",
		});
	};

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
		<AnimatedWindow>
			<div className={styles["cartWindow"]}>
				<div className={styles["cartWindowBG"]} onClick={handleCloseCart}></div>
				<AnimatedCart>
					<div className={styles["cart"]} style={{ backgroundColor: "var(--popOutBgColor)" }}>
						<div className={styles["top"]}>
							<div className={styles["topHeader"]}>
								<h2>{cartAmount >= 1 ? (cartAmount > 1 ? `${cartAmount} items` : "1 item") : "Empty cart"}</h2>
								<h3 onClick={handleClearCart}>{cartAmount >= 1 ? "Clear" : ""}</h3>
							</div>

							<div className={styles["topGames"]}>
								{cart.map((item, i) => {
									return (
										<motion.div
											key={i}
											className={styles["item"]}
											variants={variants}
											initial="initial"
											animate="animate"
											exit="exit"
										>
											<h3 id={item.surname} onClick={openItemPage}>
												{item.name}
											</h3>
											<div>
												${item.price}
												<button
													id={item.id}
													onClick={(e) => {
														handleRemoveFromCart(item);
													}}
													className={styles["removeButton"]}
													aria-label="Close"
												>
													<ImCross className={styles["cross"]} />
												</button>
											</div>
										</motion.div>
									);
								})}
							</div>
						</div>

						<div className={styles["bottom"]} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<h3>Total: ${newTotal}</h3>
							<button id="24" style={{ color: isHover ? "#92f" : "#fff" }} aria-label="Checkout">
								Checkout
								<FaChevronRight className={styles["right"]} style={{ fill: isHover ? "#92f" : "#fff" }} />
							</button>
						</div>
					</div>
				</AnimatedCart>
			</div>
		</AnimatedWindow>
	);
};

export default CartWindow;
