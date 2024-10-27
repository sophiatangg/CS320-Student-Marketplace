import AddToCartButton from "@components/AddToCartButton";
import TradeButton from "@components/TradeButton";
import styles from "@styles/CardFull.module.scss";
import cns from "@utils/classNames";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const CardFull = (props) => {
	const { item, isFullWidth, handleCurrentHoveredItem, handleLike, handleHoverItem, handleSelectItem, handleTradeOpen } = props;

	const variants = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
	};

	const location = useLocation();

	return (
		<motion.div
			className={cns(styles["cardFull"], {
				[styles["cardFullWidth"]]: !isFullWidth,
			})}
			onClick={(e) => {
				handleSelectItem(item.id);
			}}
			onMouseEnter={(e) => {
				handleCurrentHoveredItem(item.id);
			}}
			onMouseLeave={(e) => {
				handleCurrentHoveredItem(item.id);
			}}
			id={item.id}
			style={{ margin: 0, padding: 0 }}
			variants={variants}
			initial="initial"
			animate="animate"
			exit="exit"
		>
			<div className={styles["thumbnail"]}>
				<img src={item.cover} className={styles["img"]} alt="Item Cover Image" />
			</div>
			<div className={styles["content"]}>
				<h2 className={styles["name"]}>{item.name}</h2>
				<div className={styles["buttons"]}>
					<div className={styles["price-cart-trade"]}>
						<span className={styles["price"]}>${item.price}</span>
						<div className={styles["cart-trade"]}>
							<AddToCartButton item={item} handleHoverItem={handleHoverItem} isBig={false} />
							<TradeButton handleTradeOpen={handleTradeOpen} />
						</div>
					</div>
					<div className={styles["like-container"]}>
						<button
							className={styles["like"]}
							id={item.id}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();

								handleLike(item.id);
							}}
							aria-label="Like"
						>
							<FaHeart style={{ fill: item.isLiked ? "#F53333" : "#cccccc" }} className={styles["likeSVG"]} />
						</button>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default CardFull;
