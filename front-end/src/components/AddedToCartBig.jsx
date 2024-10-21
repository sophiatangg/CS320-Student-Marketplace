import AnimatedCard from "@containers/AnimatedCard";
import styles from "@styles/AddedToCartBig.module.scss";

const AddedToCartBig = (props) => {
	const { game } = props;

	return (
		<AnimatedCard>
			<div className={styles["addToCart"]}>
				<h2>Added to cart</h2>
			</div>
		</AnimatedCard>
	);
};

export default AddedToCartBig;
