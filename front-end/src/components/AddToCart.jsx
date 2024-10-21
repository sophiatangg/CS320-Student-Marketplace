import styles from "@styles/AddToCart.module.scss";
import { TiPlus } from "react-icons/ti";

const AddToCart = (props) => {
	const { game, handleHoverGame, handleAddToCart } = props;

	return (
		<div className={styles["addToCart"]} onMouseEnter={handleHoverGame} onMouseLeave={handleHoverGame} id={game.id} onClick={handleAddToCart}>
			<h4 style={{ color: game.isHovered ? "#92f" : "#999" }}>Add to cart</h4>
			<TiPlus className={styles["add"]} style={{ fill: game.isHovered ? "#92f" : "#999" }} />
		</div>
	);
};

export default AddToCart;
