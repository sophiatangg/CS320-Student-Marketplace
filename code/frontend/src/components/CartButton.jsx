import styles from "@styles/CartButton.module.scss";
import { TiShoppingCart } from "react-icons/ti";

const CartButton = (props) => {
	const { cartAmount, handleOpenCart } = props;

	return (
		<div className={styles["cartButton"]} onClick={handleOpenCart}>
			<div className={styles["iconComponent"]}>
				{cartAmount > 0 && <div className={styles["badge"]}>{cartAmount}</div>}
				<div className={styles["icon"]}>
					<TiShoppingCart
						onClick={handleOpenCart}
						style={{
							fill: cartAmount ? "#90ee90" : "#fff",
						}}
					/>
				</div>
			</div>
			<div className={styles["title"]}>
				<span>Cart</span>
			</div>
		</div>
	);
};

export default CartButton;
