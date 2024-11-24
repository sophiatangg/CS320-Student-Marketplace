import Window from "@popups/Window";
import { useContextDispatch, useContextSelector } from "@providers/StoreProvider";
import styles from "@styles/CartWindow.module.scss";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { ImCross } from "react-icons/im";

const CartWindow = (props) => {
	const { cart, cartAmount } = useContextSelector("cartStore");
	const dispatch = useContextDispatch();

	const [total, setTotal] = useState(0);
	const [isHover, setIsHover] = useState(false);

	const openItemPage = (e) => {
		const selectedItemSurname = e.target.id;
		navigate(`/store/${selectedItemSurname}`);

		dispatch({
			type: "SET_CART_DISPLAYED",
			payload: false,
		});

		dispatch({
			type: "SET_TRADE_DISPLAYED",
			payload: false,
		});
	};

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

	useEffect(() => {
		const total = cart.reduce((acc, item) => {
			return acc + parseFloat(item.price);
		}, 0);

		const newTotal = total.toFixed(2);
		setTotal(newTotal);
	}, [cart]);

	const variants = {
		initial: { x: 100 },
		animate: { x: 0, transition: { x: { type: "spring", duration: 1.2, bounce: 0.4 } } },
		exit: { x: 100, transition: { x: { type: "spring", duration: 1.2, bounce: 0.575 } } },
	};

	return (
		<Window dispatchType={"SET_CART_DISPLAYED"}>
			<div className={styles["cart"]} style={{ backgroundColor: "var(--popOutBgColor)" }}>
				<div className={styles["top"]}>
					<div className={styles["topHeader"]}>
						<h2>{cartAmount >= 1 ? (cartAmount > 1 ? `${cartAmount} items` : "1 item") : "Empty cart"}</h2>
						<h3 onClick={handleClearCart}>{cartAmount >= 1 ? "Clear" : ""}</h3>
					</div>
					<div className={styles["listItems"]}>
						{cart.map((item, i) => {
							return (
								<motion.div key={i} className={styles["item"]} variants={variants} initial="initial" animate="animate" exit="exit">
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
					<h3>
						<span>Total:</span>
						<span>${total}</span>
					</h3>
					<button id="24" style={{ color: isHover ? "#92f" : "#fff" }} aria-label="Checkout">
						<span>Checkout</span> <FaChevronRight className={styles["right"]} style={{ fill: isHover ? "#92f" : "#fff" }} />
					</button>
				</div>
			</div>
		</Window>
	);
};

export default CartWindow;
