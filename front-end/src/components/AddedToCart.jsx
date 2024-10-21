import AnimatedCard from "@containers/AnimatedCard";
import styles from "@styles/AddedToCart.module.scss";

const AddedToCart = (props) => {
	const { game } = props;

	return (
		<AnimatedCard>
			<div className={styles["addToCart"]}>
				<h4>Added to cart</h4>
			</div>
		</AnimatedCard>
	);
};

export default AddedToCart;
